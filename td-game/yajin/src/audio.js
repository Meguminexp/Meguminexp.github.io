/* 《你好！一周年》— audio.js  (v2 · 主题动机 / 段落化 BGM / 交叉淡入淡出)
 *
 * 设计目标（对应"配乐混在一起 / 循环太长 / 情绪区分度不够"三个问题）：
 *   1. 同一时刻只有一条 BGM 在发声。"活动音源登记表"记录每个振荡器/噪声源，
 *      切轨时旧轨真淡出 → 到点 stop()+disconnect()，定时器全部清掉（见 killTrack）。
 *   2. 交叉淡入淡出（默认 ~0.95s 重叠），旧轨不会拖着不走。
 *   3. 每首曲子是 A/B/C 三块配器 + 8 小节曲式（form），和弦按块换转位、旋律按遍数
 *      换变奏，因此不会"同样 4 小节无限循环"。
 *   4. 全曲共用一条 6 音核心动机（MOTIF），在不同调式/速度/音色/音区上重现，
 *      听起来是"一部作品"而不是拼盘。
 *   5. beat(swell/drop) 只改增益包络与配器层级，不再新增振荡器（旧版元凶）。
 *
 * 技术约束：纯 WebAudio 实时合成、零采样文件、file:// 可运行；
 *          bgmOn/sfxOn 关闭后不创建任何发声节点；无 AudioContext 时全部静默降级。
 * 对外 API 保持兼容：playBGM / stopBGM / sfx / playAmbience / stopAmbience / beat。
 *
 * 香港迪士尼章专用（2026.04，见 §7 与 §6 的 park）：
 *   sfx_firework_launch（升空"咻"）/ sfx_firework_boom（炸开）/ sfx_firework_finale（齐放）
 *   sfx_coaster_whoosh（过山车俯冲呼啸）/ sfx_parade_music（花车乐句，只奏一遍）
 *   环境音 park（人群 + 远处音乐 + 偶尔的轨道车）
 * 其中齐放 / 炸开 / 花车乐句会一口气建十几个振荡器与噪声源，因此走 §7 的"声部"机制：
 * 播完自己 stop + disconnect，不在总线上留节点。
 */
(function (root) {
  'use strict';
  const YJ = root.YJ = root.YJ || {};

  /* ============================================================
   * 1. 音高与调式工具
   * ============================================================ */
  function mtof(m) { return 440 * Math.pow(2, (m - 69) / 12); }

  const SCALES = {
    major:      [0, 2, 4, 5, 7, 9, 11],   // 自然大调
    aeolian:    [0, 2, 3, 5, 7, 8, 10],   // 自然小调
    harmMinor:  [0, 2, 3, 5, 7, 8, 11],   // 和声小调（紧张/忧郁）
    dorian:     [0, 2, 3, 5, 7, 9, 10],
    mixolydian: [0, 2, 4, 5, 7, 9, 10],   // 大调降七（辽阔/夜）
    lydian:     [0, 2, 4, 6, 7, 9, 11],   // 大调升四（回忆/光）
    pentMaj:    [0, 2, 4, 7, 9],          // 大调五声（干净/少棱角）
    pentMin:    [0, 3, 5, 7, 10]
  };

  /* 音级 → 半音：超过一个八度自动向上换八度（如 V 级的 8 → 12+2） */
  function deg2semi(deg, scale) {
    const n = scale.length;
    const oct = Math.floor(deg / n);
    const i = ((deg % n) + n) % n;
    return oct * 12 + scale[i];
  }

  /* ---------- 核心动机：do–re–mi–sol–mi–re（6 音，全作共用）----------
   * 每个变奏改变"音序 / 八度 / 节奏"，但音级骨架不变 → 同一主题的不同表情。*/
  const MOTIF_VARS = [
    { degs: [0, 1, 2, 4, 2, 1], oct: 0, rhythm: [1, 1, 1, 2, 1, 1], label: '原型：上行—回落（叙述）' },
    { degs: [4, 2, 1, 2, 0, 1], oct: 0, rhythm: [1, 1, 1, 1, 2, 2], label: '逆行：叹息（不舍/低落）' },
    { degs: [0, 2, 4, 7, 4, 2], oct: 0, rhythm: [1, 1, 2, 2, 1, 1], label: '扩展：冲高（扬起）' },
    { degs: [2, 1, 0, 1, 2, 4], oct: -1, rhythm: [2, 1, 1, 1, 1, 2], label: '倒影·低八度（内省）' },
    { degs: [0, 2, 4, 7, 9, 7], oct: 0, rhythm: [1, 1, 1, 2, 2, 2], label: '华彩：冲上高音（表白/结局）' }
  ];

  /* ---------- 和声进行（写作音级，非绝对音高）---------- */
  const HG = {
    pop:   [[0, 2, 4], [4, 6, 8], [5, 7, 9], [3, 5, 7]],    // I–V–vi–IV
    soft:  [[0, 2, 4], [3, 5, 7], [0, 2, 4], [4, 6, 8]],    // I–IV–I–V
    canon: [[0, 2, 4], [4, 6, 8], [5, 7, 9], [2, 4, 6]],    // I–V–vi–iii
    rise:  [[3, 5, 7], [4, 6, 8], [5, 7, 9], [0, 2, 4]],    // IV–V–vi–I
    minor: [[0, 2, 4], [5, 7, 9], [2, 4, 6], [6, 8, 10]],   // i–VI–III–VII
    dark:  [[0, 2, 4], [1, 3, 5], [0, 2, 4], [6, 8, 10]],   // i–ii°–i–VII
    hope:  [[0, 2, 4], [3, 5, 7], [5, 7, 9], [4, 6, 8]],    // i–iv–VI–V
    modal: [[0, 2, 4], [6, 8, 10], [3, 5, 7], [0, 2, 4]]    // I–♭VII–IV–I（mixolydian）
  };

  /* ---------- 转位 / 排列：同一进行换一种"织体"，避免逐遍相同 ----------
   * 先把和弦压到"根音落在 0~11"的紧凑排列，再做标准转位/开放排列，
   * 保证任何一段的音域都在 2 个八度内（否则会出现 +24 半音的怪跳进）。*/
  function chordNorm(s) {
    const k = Math.floor(Math.min.apply(null, s) / 12);
    return s.map(x => x - k * 12);
  }
  const VOICE = {
    close: s => chordNorm(s),                                             // 原位·密集
    inv1:  s => { const c = chordNorm(s); return c.slice(1).concat([c[0] + 12]); },              // 第一转位
    inv2:  s => { const c = chordNorm(s); return c.slice(2).concat([c[0] + 12, c[1] + 12]); },   // 第二转位
    open:  s => { const c = chordNorm(s); return [c[0] - 12].concat(c.slice(1)); },              // 低八度根音·温暖
    wide:  s => { const c = chordNorm(s); return [c[0] - 12].concat(c).concat([c[0] + 12]); },   // 跨两个八度的宽排列（高潮）
    low:   s => chordNorm(s).map(x => x - 12)                             // 整体低八度（留白/落）
  };

  /* 折叠成"根音之上的紧凑排列"（去掉宽排列带来的多余八度），供琶音使用 */
  function closeVoicing(s) {
    const seen = {}, out = [];
    for (let i = 0; i < s.length; i++) {
      const v = ((s[i] % 12) + 12) % 12;
      if (!seen[v]) { seen[v] = 1; out.push(v); }
    }
    return out.sort(function (a, b) { return a - b; });
  }
  /* 把音高夹进指定音域窗口（整八度平移），保证任何调/任何变奏都落在可听且不刺耳的范围 */
  function inRange(midi, lo, hi) {
    let m = midi;
    while (m < lo) m += 12;
    while (m > hi) m -= 12;
    return m;
  }

  function blk(chords, voicing, rot, layers) {
    return { chords: chords, voicing: voicing || 'close', rot: rot || 0, layers: layers };
  }

  /* ============================================================
   * 2. 曲库：11 首（保留原 8 个 id + 新增 3 个）
   *    · 同一动机 / 同一和声语汇，靠调式·速度·音色·音区·配器分层区分情绪
   *    · form：8 小节一循环，A/B/C 三块（配器 + 转位不同）
   *    · bpm：每分钟拍数；每小节 4 拍
   * ============================================================ */
  const TRACKS = {
    /* --- 序章 / 深夜独白 / 石头自白：最静、最稀疏 --- */
    bgm_quiet: {
      name: '静', use: '序章宿舍、深夜独白、c4 石头自白、选择前的静默',
      /* 用自然大调（而非五声）写和弦：保证 I–IV–I–V 是真三和弦；
       * 动机 V0/V2/V4 的音级 (0,1,2,4,7,9) 本身就是五声音阶，旋律照样干净。*/
      tonic: 62, scale: 'major', bpm: 66, beats: 4, volScale: 0.92,
      pad:  { type: 'sine', vol: 0.050, cutoff: 1000, attack: 0.30 },
      bass: { type: 'sine', vol: 0.048, oct: -2 },
      arp:  { on: false },
      mel:  { type: 'sine', vol: 0.052, notes: 3, offset: 0.34 },
      bell: { type: 'sine', vol: 0.022 },
      counter: { on: false },
      prog: {
        A: blk(HG.soft, 'close', 0, ['pad', 'bass', 'mel']),
        B: blk(HG.soft, 'inv1', 2, ['pad', 'bass', 'mel', 'counter']),
        C: blk(HG.soft, 'open', 1, ['pad', 'bass', 'mel', 'bell'])
      },
      form: ['A', 'A', 'B', 'A', 'C', 'B', 'A', 'A']
    },

    /* --- 相识 / 暖日常 / 第一次见面：全作的主调 --- */
    bgm_warm: {
      name: '暖', use: '论坛相识、聊天、见面、上海日常、南阳家中',
      tonic: 55, scale: 'major', bpm: 86, beats: 4, volScale: 1.0,
      pad:  { type: 'triangle', vol: 0.050, cutoff: 1500, attack: 0.20 },
      bass: { type: 'sine', vol: 0.055, oct: -2 },
      arp:  { on: true, div: 4, type: 'triangle', vol: 0.020, cutoff: 2400 },
      mel:  { type: 'sine', vol: 0.058, notes: 4, offset: 0.18 },
      bell: { type: 'sine', vol: 0.024 },
      counter: { on: true, type: 'triangle', vol: 0.026, oct: -1 },
      prog: {
        A: blk(HG.pop, 'close', 0, ['pad', 'bass', 'mel']),
        B: blk(HG.pop, 'inv1', 1, ['pad', 'bass', 'mel', 'arp']),
        C: blk(HG.pop, 'open', 2, ['pad', 'bass', 'mel', 'arp', 'bell', 'counter'])
      },
      form: ['A', 'A', 'B', 'A', 'B', 'C', 'A', 'B']
    },

    /* --- 连麦 / 开黑 / 手工 / 蛋糕 / 义乌：游戏感，短促跳进 --- */
    bgm_game: {
      name: '轻快', use: '连麦开黑、手工蛋糕、上海逛街、义乌商场、站台',
      tonic: 60, scale: 'major', bpm: 128, beats: 4, volScale: 0.9,
      pad:  { type: 'triangle', vol: 0.032, cutoff: 1800, attack: 0.10 },
      bass: { type: 'triangle', vol: 0.048, oct: -2 },
      arp:  { on: true, div: 8, type: 'triangle', vol: 0.022, cutoff: 3000 },
      mel:  { type: 'square', vol: 0.026, notes: 6, offset: 0.12, filter: 'lowpass', cutoff: 2200 },
      bell: { type: 'sine', vol: 0.020 },
      counter: { on: false },
      prog: {
        A: blk(HG.canon, 'close', 0, ['pad', 'bass', 'mel', 'arp']),
        B: blk(HG.canon, 'inv2', 1, ['pad', 'bass', 'mel', 'arp']),
        C: blk(HG.canon, 'wide', 2, ['pad', 'bass', 'mel', 'arp', 'bell'])
      },
      form: ['A', 'B', 'A', 'B', 'C', 'B', 'A', 'B']
    },

    /* --- 扬起：零点 / 会场闪光 / 和好 / 潜水 --- */
    bgm_hope: {
      name: '扬', use: '生日地图零点、苏州会场闪光、和好、潜水、纪念日',
      tonic: 57, scale: 'major', bpm: 100, beats: 4, volScale: 1.0,
      pad:  { type: 'triangle', vol: 0.052, cutoff: 2000, attack: 0.16, thick: true },
      bass: { type: 'sine', vol: 0.055, oct: -2 },
      arp:  { on: true, div: 6, type: 'sine', vol: 0.020, cutoff: 2800 },
      mel:  { type: 'sine', vol: 0.062, notes: 5, offset: 0.10 },
      bell: { type: 'sine', vol: 0.030 },
      counter: { on: true, type: 'sine', vol: 0.024, oct: -1 },
      prog: {
        A: blk(HG.rise, 'close', 0, ['pad', 'bass', 'mel']),
        B: blk(HG.rise, 'inv1', 1, ['pad', 'bass', 'mel', 'arp']),
        C: blk(HG.rise, 'wide', 2, ['pad', 'bass', 'mel', 'arp', 'bell', 'counter'])
      },
      form: ['A', 'B', 'A', 'B', 'C', 'A', 'C', 'B']
    },

    /* --- 回忆：生日地图、江边、礼物、明信片（lydian 的升四度＝微光）--- */
    bgm_memory: {
      name: '回忆', use: '生日地图、外滩夜、拆礼物、写明信片',
      tonic: 53, scale: 'lydian', bpm: 64, beats: 4, volScale: 0.94,
      pad:  { type: 'sine', vol: 0.046, cutoff: 1200, attack: 0.34 },
      bass: { type: 'sine', vol: 0.046, oct: -2 },
      arp:  { on: true, div: 4, type: 'sine', vol: 0.016, cutoff: 2200 },
      mel:  { type: 'sine', vol: 0.056, notes: 4, offset: 0.26 },
      bell: { type: 'sine', vol: 0.026 },
      counter: { on: true, type: 'triangle', vol: 0.028, oct: -1 },
      prog: {
        A: blk(HG.pop, 'close', 0, ['pad', 'bass', 'mel', 'counter']),
        B: blk(HG.pop, 'inv1', 2, ['pad', 'bass', 'mel', 'arp', 'counter']),
        C: blk(HG.pop, 'open', 1, ['pad', 'bass', 'mel', 'bell', 'counter'])
      },
      form: ['A', 'A', 'B', 'A', 'C', 'A', 'B', 'A']
    },

    /* --- 主题全奏：跨年前夜 / 生日零点 / 表白 / 结局 --- */
    bgm_ending: {
      name: '主题·全奏', use: '跨年零点、南阳生日零点、一周年表白、星星结局',
      tonic: 61, scale: 'major', bpm: 82, beats: 4, volScale: 1.0,
      pad:  { type: 'triangle', vol: 0.055, cutoff: 2100, attack: 0.18, thick: true },
      bass: { type: 'sine', vol: 0.060, oct: -2 },
      arp:  { on: true, div: 6, type: 'triangle', vol: 0.022, cutoff: 2600 },
      mel:  { type: 'sine', vol: 0.070, notes: 6, offset: 0.08 },
      bell: { type: 'sine', vol: 0.032 },
      counter: { on: true, type: 'triangle', vol: 0.028, oct: -1 },
      prog: {
        A: blk(HG.pop, 'close', 0, ['pad', 'bass', 'mel']),
        B: blk(HG.pop, 'inv1', 1, ['pad', 'bass', 'mel', 'arp', 'counter']),
        C: blk(HG.pop, 'wide', 3, ['pad', 'bass', 'mel', 'arp', 'bell', 'counter'])
      },
      form: ['A', 'B', 'C', 'B', 'A', 'C', 'C', 'B']
    },

    /* --- 夜行：机场 / 城市夜 / 冬夜候机厅 --- */
    bgm_night: {
      name: '夜行', use: '冬夜候机厅、跨年前夜、夜间城市、夜里等她消息',
      tonic: 51, scale: 'mixolydian', bpm: 92, beats: 4, volScale: 0.9,
      pad:  { type: 'triangle', vol: 0.040, cutoff: 1300, attack: 0.26 },
      bass: { type: 'sine', vol: 0.052, oct: -2 },
      arp:  { on: true, div: 6, type: 'sine', vol: 0.018, cutoff: 2000 },
      mel:  { type: 'sine', vol: 0.050, notes: 3, offset: 0.30 },
      bell: { type: 'sine', vol: 0.024 },
      counter: { on: true, type: 'sine', vol: 0.024, oct: -1 },
      prog: {
        A: blk(HG.modal, 'close', 0, ['pad', 'bass', 'mel']),
        B: blk(HG.modal, 'inv1', 2, ['pad', 'bass', 'mel', 'arp', 'counter']),
        C: blk(HG.modal, 'open', 1, ['pad', 'bass', 'mel', 'arp', 'bell'])
      },
      form: ['A', 'A', 'B', 'A', 'B', 'C', 'A', 'B']
    },

    /* --- 路上：高铁 / 车站 / 自驾，切分律动 --- */
    bgm_travel: {
      name: '路上', use: '三次旅行的途中、高铁进站、车站广场、去义乌',
      tonic: 55, scale: 'mixolydian', bpm: 118, beats: 4, volScale: 0.88,
      pad:  { type: 'triangle', vol: 0.034, cutoff: 1700, attack: 0.12 },
      bass: { type: 'triangle', vol: 0.050, oct: -2, pulse: true },
      arp:  { on: true, div: 8, type: 'triangle', vol: 0.020, cutoff: 2900 },
      mel:  { type: 'sine', vol: 0.052, notes: 6, offset: 0.0 },
      bell: { type: 'sine', vol: 0.018 },
      counter: { on: false },
      prog: {
        A: blk(HG.modal, 'inv2', 0, ['pad', 'bass', 'mel', 'arp']),
        B: blk(HG.modal, 'inv1', 1, ['pad', 'bass', 'mel', 'arp', 'counter']),
        C: blk(HG.modal, 'wide', 2, ['pad', 'bass', 'mel', 'arp', 'bell'])
      },
      form: ['A', 'B', 'A', 'B', 'C', 'A', 'B', 'C']
    },

    /* --- 雨 / 台风 / 低落：小调 + 雨声，允许更长的留白 --- */
    bgm_rain: {
      name: '雨', use: '杭州台风、雨天酒店、失落、压抑的等待',
      tonic: 57, scale: 'aeolian', bpm: 74, beats: 4, volScale: 0.92,
      pad:  { type: 'sine', vol: 0.048, cutoff: 1100, attack: 0.32 },
      bass: { type: 'sine', vol: 0.050, oct: -2, pulse: true },
      arp:  { on: false },
      mel:  { type: 'sine', vol: 0.050, notes: 3, offset: 0.30 },
      bell: { type: 'sine', vol: 0.020 },
      counter: { on: true, type: 'sine', vol: 0.024, oct: -1 },
      prog: {
        A: blk(HG.minor, 'close', 0, ['pad', 'bass', 'mel']),
        B: blk(HG.minor, 'inv1', 2, ['pad', 'bass', 'mel', 'counter']),
        C: blk(HG.minor, 'open', 1, ['pad', 'bass', 'mel', 'bell'])
      },
      form: ['A', 'A', 'B', 'A', 'C', 'B', 'A', 'A'],
      amb: 'rain'
    },

    /* --- 不舍：机场送别、离别前夜、慢慢来结局 --- */
    bgm_longing: {
      name: '不舍', use: '机场送别、南阳离别、安检口、慢慢来结局',
      tonic: 53, scale: 'aeolian', bpm: 70, beats: 4, volScale: 0.96,
      pad:  { type: 'triangle', vol: 0.046, cutoff: 1250, attack: 0.28 },
      bass: { type: 'sine', vol: 0.050, oct: -2 },
      arp:  { on: true, div: 4, type: 'sine', vol: 0.014, cutoff: 2000 },
      mel:  { type: 'sine', vol: 0.060, notes: 3, offset: 0.24 },
      bell: { type: 'sine', vol: 0.022 },
      counter: { on: true, type: 'triangle', vol: 0.030, oct: -1 },
      prog: {
        A: blk(HG.hope, 'close', 0, ['pad', 'bass', 'mel', 'counter']),
        B: blk(HG.hope, 'inv1', 2, ['pad', 'bass', 'mel', 'arp', 'counter']),
        C: blk(HG.hope, 'open', 1, ['pad', 'bass', 'mel', 'bell', 'counter'])
      },
      form: ['A', 'A', 'B', 'A', 'C', 'A', 'B', 'A']
    },

    /* --- 紧张：吵架 / 会场压力 / 三亚照片 --- */
    bgm_tension: {
      name: '紧张', use: 'c6 冷战、c9 三亚争吵、误会、被挂掉的视频',
      tonic: 52, scale: 'harmMinor', bpm: 112, beats: 4, volScale: 0.86,
      pad:  { type: 'sawtooth', vol: 0.026, cutoff: 620, attack: 0.34 },
      bass: { type: 'triangle', vol: 0.052, oct: -2, pulse: true },
      arp:  { on: false },
      mel:  { type: 'triangle', vol: 0.040, notes: 3, offset: 0.42 },
      bell: { type: 'sine', vol: 0.014 },
      counter: { on: true, type: 'sawtooth', vol: 0.018, oct: -1, cutoff: 500 },
      prog: {
        A: blk(HG.dark, 'low', 0, ['pad', 'bass']),
        B: blk(HG.dark, 'close', 1, ['pad', 'bass', 'mel']),
        C: blk(HG.dark, 'inv2', 2, ['pad', 'bass', 'mel', 'counter'])
      },
      form: ['A', 'A', 'B', 'A', 'B', 'C', 'A', 'B']
    },

    bgm_none: null
  };

  /* 新增曲目 id 注册到 YJ.BGMS（剧本校验用；characters.js 里只有原 8 个） */
  const EXTRA_BGM = ['bgm_longing', 'bgm_night', 'bgm_travel'];
  /* park = 香港迪士尼白天园区（人群 + 远处音乐 + 偶尔的轨道车），见 §6 playAmb */
  const EXTRA_AMB = ['wind', 'underwater', 'park'];
  if (Array.isArray(YJ.BGMS)) EXTRA_BGM.forEach(id => { if (YJ.BGMS.indexOf(id) < 0) YJ.BGMS.push(id); });
  if (Array.isArray(YJ.AMBIENCES)) EXTRA_AMB.forEach(id => { if (YJ.AMBIENCES.indexOf(id) < 0) YJ.AMBIENCES.push(id); });

  /* ============================================================
   * 3. 运行参数
   * ============================================================ */
  const CFG = {
    fadeIn: 0.60,      // 新轨从静音到满音的时间
    fadeOut: 0.95,     // 旧轨淡出时间（重叠 ≈ 0.95s，不会"拖太久"）
    quickIn: 0.28,     // 极短间隔连续切歌时的快速替换
    quickOut: 0.30,
    stopFade: 0.45,    // stopBGM / stopAmbience 的淡出
    masterVol: 0.9
  };
  const BEAT_GAP = { swell: 3.0, drop: 4.0, pulse: 1.0 };   // 同类 beat 最小间隔（秒）
  const ENDING_BGM = { star: 'bgm_ending', slow: 'bgm_longing', she_first: 'bgm_quiet' };

  /* ============================================================
   * 4. 引擎：上下文 / 发声体 / 登记表
   * ============================================================ */
  let ctx = null, master = null, bgmBus = null, beatGain = null, sfxGain = null, ambBus = null;
  let failed = false, noiseBuf = null;

  let requestedId = null;      // 剧情请求的 BGM id（对外就是 currentBgm）
  let live = null;             // 正在发声的音轨
  const releasing = [];        // 正在淡出、待硬停的旧音轨
  let trackSeq = 0;

  let ambKind = null;          // 当前环境音种类
  let ambBeds = [];            // 环境音"床"（可整体停掉）
  let beatLast = {};           // beat 限流时间戳

  function safe(fn, a, b) { try { return fn(a, b); } catch (e) { return undefined; } }
  /* 必须用闭包调用 disconnect：把方法当裸函数传（safe(n.disconnect, n)）会丢掉 this，
   * 浏览器里会抛 "Illegal invocation" 且被 safe 静默吞掉 —— 于是所有"断开"都是空操作，
   * 停止态的节点一直挂在总线上。这里修好，§6/§7 的清理才是真的。 */
  function disc(n) { if (n && typeof n.disconnect === 'function') safe(function () { n.disconnect(); }); }

  function AC() {
    if (failed) return null;
    if (ctx) return ctx;
    try {
      const C = root.AudioContext || root.webkitAudioContext;
      if (!C) { failed = true; return null; }
      ctx = new C();
      master = ctx.createGain(); master.gain.value = CFG.masterVol;
      master.connect(ctx.destination);
      bgmBus = ctx.createGain();  bgmBus.connect(master);      // 设置里的 BGM 音量
      beatGain = ctx.createGain(); beatGain.connect(bgmBus);   // beat() 的情绪包络（独立，避免互相打断）
      sfxGain = ctx.createGain(); sfxGain.connect(master);
      ambBus = ctx.createGain();  ambBus.connect(master);
      if (ambBus.gain) ambBus.gain.value = 1;
      applyVolumes();
      return ctx;
    } catch (e) { failed = true; return null; }
  }

  function settings() {
    try { return (YJ.save && YJ.save.settings) || {}; } catch (e) { return {}; }
  }
  function bgmOn() { const s = settings(); return s.bgmOn !== false; }

  function applyVolumes() {
    if (!bgmBus) return;
    const s = settings();
    const v = s.bgmVol != null ? s.bgmVol : 0.45;
    /* 真正的"关掉"是 0；beatGain 复位，避免上一次 swell/drop 的包络残留 */
    safe(function () { bgmBus.gain.value = s.bgmOn === false ? 0 : v; });
    safe(function () { sfxGain.gain.value = s.sfxOn === false ? 0 : (s.sfxVol != null ? s.sfxVol : 0.6); });
    safe(function () { ambBus.gain.value = s.bgmOn === false ? 0 : Math.min(0.5, v * 0.7); });
    if (beatGain && ctx) {
      safe(function () {
        beatGain.gain.cancelScheduledValues(ctx.currentTime);
        if (beatGain.gain.setValueAtTime) beatGain.gain.setValueAtTime(1, ctx.currentTime);
        else beatGain.gain.value = 1;
      });
    }
  }

  /* ---------------- 通用发声体（音效 / 环境音用，短生命）----------------
   * 返回句柄 { osc, filter, gain, startAt, stopAt }：
   *   · 环境音用它做"到期回收"（见 retireBedNodes）；
   *   · 传 opt.keep = 声部（见 §7 sfxVoice）时，节点被登记，播完后统一 stop + disconnect。 */
  function tone(opt) {
    const c = AC(); if (!c) return null;
    const o = c.createOscillator(), g = c.createGain();
    o.type = opt.type || 'sine';
    const at = c.currentTime + (opt.delay || 0);
    o.frequency.setValueAtTime(opt.freq, at);
    if (opt.slideTo && o.frequency.exponentialRampToValueAtTime) {
      o.frequency.exponentialRampToValueAtTime(Math.max(20, opt.slideTo), at + opt.dur);
    }
    const peak = Math.max(0.0002, opt.vol == null ? 0.14 : opt.vol);
    g.gain.setValueAtTime(0.0001, at);
    g.gain.linearRampToValueAtTime(peak, at + (opt.attack || 0.02));
    if (g.gain.exponentialRampToValueAtTime) g.gain.exponentialRampToValueAtTime(0.0001, at + opt.dur);
    let node = o, filt = null;
    if (opt.filter && c.createBiquadFilter) {
      filt = c.createBiquadFilter();
      filt.type = opt.filter; filt.frequency.value = opt.cutoff || 1200; filt.Q.value = opt.q || 0.8;
      o.connect(filt); node = filt;
    }
    node.connect(g);
    g.connect(opt.bus || sfxGain || master);
    const stopAt = at + opt.dur + 0.05;
    o.start(at); o.stop(stopAt);
    const h = { osc: o, filter: filt, gain: g, startAt: at, stopAt: stopAt };
    if (opt.keep && opt.keep.nodes) opt.keep.nodes.push(h);
    return h;
  }

  function noiseBuffer(c) {
    if (noiseBuf) return noiseBuf;
    const len = Math.floor(c.sampleRate * 2);
    const b = c.createBuffer(1, len, c.sampleRate);
    const d = b.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    noiseBuf = b; return b;
  }
  function noise(opt) {
    const c = AC(); if (!c) return null;
    if (!c.createBufferSource) return null;
    const src = c.createBufferSource(); src.buffer = noiseBuffer(c); src.loop = true;
    const f = c.createBiquadFilter();
    f.type = opt.filter || 'bandpass'; f.frequency.value = opt.cutoff || 800; f.Q.value = opt.q || 0.7;
    const g = c.createGain();
    const at = c.currentTime + (opt.delay || 0);
    /* 可选：中心频率随时间"扫"过去。上扫 = 气流被划开 / 轨道车由远及近，
     * 下扫 = 落下来。用 setValueAtTime 钉住起点，保证扫频的起点是确定值。 */
    if (opt.cutoffTo && f.frequency.exponentialRampToValueAtTime) {
      const from = Math.max(40, opt.cutoff || 800), to = Math.max(40, opt.cutoffTo);
      safe(function () { f.frequency.setValueAtTime(from, at); });
      safe(function () { f.frequency.exponentialRampToValueAtTime(to, at + opt.dur); });
    }
    const peak = Math.max(0.0002, opt.vol == null ? 0.08 : opt.vol);
    g.gain.setValueAtTime(0.0001, at);
    g.gain.linearRampToValueAtTime(peak, at + (opt.attack || 0.15));
    if (g.gain.exponentialRampToValueAtTime) g.gain.exponentialRampToValueAtTime(0.0001, at + opt.dur);
    src.connect(f); f.connect(g); g.connect(opt.bus || ambBus || master);
    const stopAt = at + opt.dur + 0.1;
    src.start(at); src.stop(stopAt);
    const h = { src: src, filter: f, gain: g, startAt: at, stopAt: stopAt };
    if (opt.keep && opt.keep.nodes) opt.keep.nodes.push(h);
    return h;
  }

  /* ============================================================
   * 5. BGM 音轨生命周期（登记表 + 真淡出 + 真清理）
   * ============================================================ */
  function gainAt(track, t) {
    const e = track.env;
    if (!e) return 0.0001;
    if (t <= e.t0) return e.from;
    if (t >= e.t1) return e.to;
    return e.from + (e.to - e.from) * ((t - e.t0) / (e.t1 - e.t0));
  }

  function schedFade(track, to, dur) {
    if (!ctx || !track || !track.gain) return;
    const now = ctx.currentTime;
    const from = Math.max(0.0001, gainAt(track, now));
    const g = track.gain.gain;
    safe(function () { g.cancelScheduledValues(now); });
    safe(function () { g.setValueAtTime(from, now); });
    if (dur > 0.001) {
      safe(function () { g.linearRampToValueAtTime(Math.max(0.0001, to), now + dur); });
      track.env = { from: from, to: Math.max(0.0001, to), t0: now, t1: now + dur };
    } else {
      safe(function () { g.setValueAtTime(Math.max(0.0001, to), now); });
      track.env = { from: Math.max(0.0001, to), to: Math.max(0.0001, to), t0: now, t1: now };
    }
  }

  function clearTick(track) {
    if (track.timer) { clearTimeout(track.timer); clearInterval(track.timer); track.timer = null; }
    if (track.releaseTimer) { clearTimeout(track.releaseTimer); track.releaseTimer = null; }
  }

  /* 硬清理：停掉并断开这条音轨的每一个音源，登记表里不留项 */
  function killTrack(track) {
    if (!track || track.killed) return;
    track.killed = true; track.dead = true;
    clearTick(track);
    const i = releasing.indexOf(track);
    if (i >= 0) releasing.splice(i, 1);
    if (live === track) live = null;
    const now = ctx ? ctx.currentTime : 0;
    for (let k = 0; k < track.nodes.length; k++) {
      const n = track.nodes[k];
      if (n.osc) {
        safe(function () { n.osc.stop(now); });
        disc(n.osc);
      }
      disc(n.filter); disc(n.gain);
    }
    track.nodes.length = 0;
    for (let k = 0; k < track.chain.length; k++) disc(track.chain[k]);
    track.chain.length = 0;
    disc(track.gain);
    track.gain = null;
  }

  /* 淡出后硬停（定时器登记在 track 上，stopBGM 会一并清掉） */
  function releaseTrack(track, fade) {
    if (!track || track.killed) return;
    if (releasing.indexOf(track) >= 0) return;   /* 已在淡出：保留原截止时间，绝不顺延 */
    track.dead = true;
    if (live === track) live = null;
    if (fade <= 0.02) { killTrack(track); return; }
    schedFade(track, 0.0001, fade);
    clearTick(track);
    if (releasing.indexOf(track) < 0) releasing.push(track);
    track.releaseTimer = setTimeout(function () { killTrack(track); }, fade * 1000 + 40);
  }

  function newTrack(id) {
    const g = ctx.createGain();
    safe(function () { g.gain.setValueAtTime(0.0001, ctx.currentTime); });
    g.connect(beatGain || bgmBus || master);
    return {
      id: id, uid: ++trackSeq, gain: g, chain: [g], nodes: [],
      timer: null, releaseTimer: null, dead: false, killed: false,
      step: 0, nextAt: null, startedAt: ctx.currentTime,
      env: { from: 0.0001, to: 1, t0: ctx.currentTime, t1: ctx.currentTime + CFG.fadeIn },
      mode: null, push: 0     /* null = 未收到 beat 标记，按段落本身的配器编排 */
    };
  }

  /* 单个音源：创建 → 登记 → 排程；track 被 kill 时连坐 */
  function note(track, o) {
    if (!ctx || !track || track.dead || !bgmOn()) return null;
    if (!(o.vol > 0) || !(o.dur > 0.01)) return null;
    const c = ctx;
    const osc = c.createOscillator(), g = c.createGain();
    osc.type = o.type || 'sine';
    const at = o.at != null ? o.at : c.currentTime + (o.delay || 0);
    const f0 = Math.max(16, o.freq);
    safe(function () { osc.frequency.setValueAtTime(f0, at); });
    safe(function () { osc.frequency.value = f0; });
    const peak = Math.max(0.0002, o.vol);
    safe(function () {
      g.gain.setValueAtTime(0.0001, at);
      g.gain.linearRampToValueAtTime(peak, at + (o.attack || 0.02));
      if (g.gain.exponentialRampToValueAtTime) g.gain.exponentialRampToValueAtTime(0.0001, at + o.dur);
    });
    let head = osc, filt = null;
    if (o.filter && c.createBiquadFilter) {
      filt = c.createBiquadFilter();
      filt.type = o.filter;
      filt.frequency.value = o.cutoff || 1400;
      filt.Q.value = o.q || 0.7;
      osc.connect(filt); head = filt;
    }
    head.connect(g);
    g.connect(track.gain);
    const stopAt = at + o.dur + 0.06;
    safe(function () { osc.start(at); });
    safe(function () { osc.stop(stopAt); });
    track.nodes.push({ osc: osc, gain: g, filter: filt, startAt: at, stopAt: stopAt, role: o.role || null });
    return stopAt;
  }

  /* ---------------- 小节排程（有曲式、有变奏、不逐遍相同）---------------- */
  function barSeconds(def) { return def.beats * 60 / def.bpm; }

  function layersFor(def, b, track) {
    let ls = (b.layers || ['pad', 'bass']).slice();
    if (def.arp && def.arp.on === false) ls = ls.filter(x => x !== 'arp');
    if (!def.counter || def.counter.on === false) ls = ls.filter(x => x !== 'counter');
    /* beat 只做"强度修饰"，不推翻段落本身的配器编排：
     *   null（无 beat 标记）→ 完全按 A/B/C 段落的编排
     *   calm   → 只摘掉最亮的闪片层
     *   pulse  → 补上律动层
     *   swell  → 补上律动层 + 闪片层（并延续一遍曲式）
     *   drop   → 抽到只剩和弦垫与低音（骨架） */
    const mode = track.mode;
    if (mode === 'drop') ls = ls.filter(x => x === 'pad' || x === 'bass');
    else if (mode === 'calm') ls = ls.filter(x => x !== 'bell');
    if ((mode === 'pulse' || mode === 'swell') && ls.indexOf('arp') < 0 && def.arp && def.arp.on) ls = ls.concat(['arp']);
    if (track.push > 0) {
      if (ls.indexOf('arp') < 0 && def.arp && def.arp.on) ls = ls.concat(['arp']);
      if (def.bell) ls = ls.concat(['bell']);
    }
    return ls.filter((v, i, a) => v && a.indexOf(v) === i);
  }

  function arpSeq(semis, n) {
    const up = semis.concat(semis.map(x => x + 12));
    const out = [];
    let i = 0, dir = 1;
    for (let k = 0; k < n; k++) {
      out.push(up[i % up.length]);
      i += dir;
      if (i >= up.length - 1 || i <= 0) dir = -dir;
    }
    return out;
  }

  function scheduleBar(track, at) {
    const def = TRACKS[track.id];
    if (!def) return;
    const bar = barSeconds(def);
    const step = track.step++;
    const form = def.form || ['A'];
    const key = form[step % form.length];
    const b = (def.prog && (def.prog[key] || def.prog.A)) || { chords: [[0, 2, 4]], voicing: 'close', layers: ['pad', 'bass'] };
    const scale = SCALES[def.scale] || SCALES.major;
    /* 每走完一遍 8 小节曲式，换一个动机变奏 → 避免"无限同调循环" */
    const cycle = Math.floor(step / form.length);
    const mv = MOTIF_VARS[(def.motifOffset || 0) + cycle % MOTIF_VARS.length];
    const chords = b.chords;
    const degChord = chords[(step + (b.rot || 0)) % chords.length];
    const rootSemi = deg2semi(degChord[0], scale);
    const semis = (VOICE[b.voicing] || VOICE.close)(degChord.map(d => deg2semi(d, scale)));

    const ls = layersFor(def, b, track);
    const lv = def.volScale * (track.mode === 'swell' ? 1.16 : track.mode === 'pulse' ? 1.05 : track.mode === 'drop' ? 0.6 : 1);
    const has = l => ls.indexOf(l) >= 0;
    const T = def.tonic;

    /* ① 和弦垫 */
    if (has('pad')) {
      for (let i = 0; i < semis.length; i++) {
        note(track, {
          at: at, freq: mtof(inRange(T + semis[i], 33, 84)), dur: bar * 0.96, type: def.pad.type,
          vol: def.pad.vol * lv / (1 + i * 0.22), attack: def.pad.attack || bar * 0.2,
          filter: 'lowpass', cutoff: def.pad.cutoff, q: 0.6, role: 'pad'
        });
        /* 厚一点的和弦垫：加一个微失谐副本（不用任何采样/效果器） */
        if (def.pad.thick && i < 2) {
          note(track, {
            at: at, freq: mtof(inRange(T + semis[i], 33, 84) + 0.06), dur: bar * 0.96, type: def.pad.type,
            vol: def.pad.vol * lv * 0.5, attack: def.pad.attack || bar * 0.2,
            filter: 'lowpass', cutoff: def.pad.cutoff, q: 0.6, role: 'pad'
          });
        }
      }
    }
    /* ② 低音（跟和弦根音，不跟转位；并夹住音域下限，避免出现听不见的 30Hz 泥声） */
    if (has('bass') && def.bass) {
      const bassMidi = inRange(T + rootSemi + def.bass.oct * 12, 36, 55);   /* 36=C2 ~ 55=G3 */
      note(track, {
        at: at, freq: mtof(bassMidi), dur: bar * 0.9,
        type: def.bass.type, vol: def.bass.vol * lv, attack: 0.02,
        filter: 'lowpass', cutoff: 420, q: 0.7, role: 'bass'
      });
      if (def.bass.pulse) {
        note(track, {
          at: at + bar / 2, freq: mtof(bassMidi), dur: bar * 0.36,
          type: def.bass.type, vol: def.bass.vol * lv * 0.7, attack: 0.015,
          filter: 'lowpass', cutoff: 420, q: 0.7, role: 'bass'
        });
      }
    }
    /* ③ 琶音（律动层）
     * 音源用"紧凑排列"而不是当前段落的宽排列：琶音的音域因此保持恒定，
     * 不会在换到 wide/open 段落时突然窜到 C7（人耳最刺的地方）。*/
    if (has('arp') && def.arp && def.arp.on) {
      const n = def.arp.div || 4;
      const seq = arpSeq(closeVoicing(semis), n);
      for (let i = 0; i < n; i++) {
        note(track, {
          at: at + bar * i / n, freq: mtof(inRange(T + seq[i], 40, 84)), dur: bar / n * 1.7,
          type: def.arp.type || 'triangle', vol: def.arp.vol * lv * (i % 2 ? 0.72 : 1),
          attack: 0.008, filter: 'lowpass', cutoff: def.arp.cutoff || 2400, q: 0.8, role: 'arp'
        });
      }
    }
    /* ④ 主题旋律：核心动机的当遍变奏，正好铺满一小节 */
    if (has('mel') && def.mel) {
      const want = Math.max(1, Math.min(6, def.mel.notes || 4));
      const degs = mv.degs.slice(0, want);
      const rhythm = mv.rhythm.slice(0, want);
      const total = rhythm.reduce((a, x) => a + x, 0) || want;
      const off = def.mel.offset != null ? def.mel.offset : 0.2;
      /* 弱起之后的"剩余小节"里铺完整个乐句：unit 按剩余长度算，
       * 否则弱起会把乐句尾巴挤出小节，动机就只剩前半句（听不出主题）。*/
      const unit = bar * Math.max(0.45, 1 - off) / total;
      let t = at + off * bar;
      for (let i = 0; i < degs.length; i++) {
        const semi = deg2semi(degs[i] + mv.oct * scale.length, scale);
        note(track, {
          at: t, freq: mtof(inRange(T + semi, 45, 84)), dur: Math.max(0.16, Math.min(rhythm[i] * unit * 0.92, at + bar - t)),
          type: def.mel.type || 'sine', vol: def.mel.vol * lv, attack: 0.025,
          filter: def.mel.filter || null, cutoff: def.mel.cutoff || 2200, q: 0.7, role: 'mel'
        });
        t += rhythm[i] * unit;
        if (t > at + bar * 0.995) break;
      }
    }
    /* ⑤ 高音闪片（只在高潮块 / swell 之后） */
    if (has('bell') && def.bell) {
      const semi = deg2semi(mv.degs[1] + 2 * scale.length, scale);
      note(track, {
        at: at + bar * 0.5, freq: mtof(inRange(T + semi, 62, 84)), dur: bar * 0.5,
        type: def.bell.type, vol: def.bell.vol * lv, attack: 0.06, role: 'bell'
      });
    }
    /* ⑥ 低音区对位（慢速长音，撑开空间） */
    if (has('counter') && def.counter) {
      const semi = deg2semi(mv.degs[3] != null ? mv.degs[3] : 2, scale);
      note(track, {
        at: at, freq: mtof(inRange(T + semi + (def.counter.oct || -1) * 12, 33, 62)), dur: bar * 0.94,
        type: def.counter.type || 'triangle', vol: def.counter.vol * lv,
        attack: bar * 0.3, filter: 'lowpass', cutoff: def.counter.cutoff || 900, q: 0.7, role: 'counter'
      });
    }
  }

  /* 自校正节拍器：以绝对时间推进，掉帧/切后台后重新对拍，绝不补排一堆小节 */
  function tickTrack(track) {
    if (!ctx || track.dead) return;
    const def = TRACKS[track.id];
    if (!def) return;
    const bar = barSeconds(def);
    const now = ctx.currentTime;
    if (track.nextAt == null || now - track.nextAt > bar * 2.5) track.nextAt = now;
    let guard = 0;
    while (track.nextAt <= now + 0.06 && guard++ < 4) {
      scheduleBar(track, track.nextAt);
      track.nextAt += bar;
    }
    const wait = Math.max(40, (track.nextAt - ctx.currentTime) * 1000);
    track.timer = setTimeout(function () { tickTrack(track); }, wait);
  }

  function startTrack(id, fadeIn, fadeOut) {
    const def = TRACKS[id];
    if (!def || !AC() || !bgmOn()) return null;
    const track = newTrack(id);
    /* 极度密集地连续切歌（<0.3s）时用快速替换，避免"三首叠一层" */
    const young = live && (ctx.currentTime - live.startedAt) < 0.3 && live.step <= 1;
    if (young) { fadeIn = Math.min(fadeIn, CFG.quickIn); fadeOut = Math.min(fadeOut, CFG.quickOut); }
    const old = live;
    /* 只允许"新轨 + 一条正在淡出的旧轨"。更早的残留一律立即硬停：
     * 否则连续快切时每一首都把前几首的清理期限往后推，又会叠成一锅粥。 */
    for (let i = releasing.length - 1; i >= 0; i--) killTrack(releasing[i]);
    live = track;
    schedFade(track, 1, fadeIn);
    if (old && !old.killed) releaseTrack(old, fadeOut);
    tickTrack(track);
    if (YJ.log) YJ.log('BGM ->', id, '[' + def.name + ']');
    return track;
  }

  function silenceBGM(fade) {
    const f = fade == null ? CFG.stopFade : fade;
    if (f <= 0.02) {
      /* 明确的硬停：连正在淡出的旧轨也一起拔掉 */
      if (live) killTrack(live);
      for (let i = releasing.length - 1; i >= 0; i--) killTrack(releasing[i]);
      return;
    }
    if (live) releaseTrack(live, f);
    for (let i = releasing.length - 1; i >= 0; i--) releaseTrack(releasing[i], Math.min(f, 0.4));
  }

  /* ============================================================
   * 6. 环境音（可整体停掉的"床"）
   * ============================================================ */
  function killBed(bed) {
    if (bed.killed) return;
    bed.killed = true;
    if (bed.timer) { clearTimeout(bed.timer); clearInterval(bed.timer); bed.timer = null; }
    if (bed.armTimer) { clearTimeout(bed.armTimer); bed.armTimer = null; }
    if (bed.fadeTimer) { clearTimeout(bed.fadeTimer); bed.fadeTimer = null; }
    for (let i = 0; i < bed.nodes.length; i++) {
      const n = bed.nodes[i];
      if (!n) continue;
      if (n.src) { safe(function () { n.src.stop(0); }); disc(n.src); }
      if (n.osc) { safe(function () { n.osc.stop(0); }); disc(n.osc); }   /* park 的"远处音乐"是振荡器 */
      disc(n.filter); disc(n.gain);
    }
    bed.nodes.length = 0;
    disc(bed.gain); bed.gain = null;      /* 床的总线增益也要断开，否则每次开关留一个空增益节点 */
    const i = ambBeds.indexOf(bed);
    if (i >= 0) ambBeds.splice(i, 1);
  }

  /* 把已经播完的环境音节点从"床"上摘掉并断开。
   * park 的"远处音乐 / 偶尔的轨道车"每次事件都会新建节点；若不回收，
   * bed.nodes 会随游玩时长线性增长（旧版"环境音 noise 跑 3600 秒从不 stop"的同类隐患）。 */
  function retireBedNodes(bed) {
    if (!ctx || !bed || !bed.nodes.length) return;
    const now = ctx.currentTime;
    for (let i = bed.nodes.length - 1; i >= 0; i--) {
      const n = bed.nodes[i];
      if (!n || n.stopAt == null || n.stopAt > now) continue;
      if (n.src) { safe(function () { n.src.stop(0); }); disc(n.src); }
      if (n.osc) disc(n.osc);
      disc(n.filter); disc(n.gain);
      bed.nodes.splice(i, 1);
    }
  }
  function stopAllBeds(fade) {
    for (let i = ambBeds.length - 1; i >= 0; i--) {
      const bed = ambBeds[i];
      const g = bed.gain && bed.gain.gain ? bed.gain.gain : null;
      if (g && fade > 0.02 && ctx) {
        safe(function () { g.cancelScheduledValues(ctx.currentTime); });
        safe(function () { g.setValueAtTime(Math.max(0.0001, g.value), ctx.currentTime); });
        safe(function () { g.linearRampToValueAtTime(0.0001, ctx.currentTime + fade); });
        bed.fadeTimer = setTimeout(function () { killBed(bed); }, fade * 1000 + 60);
      } else killBed(bed);
    }
  }

  let ambBusGen = 0;

  function playAmb(kind) {
    if (!ctx || !AC() || !bgmOn()) return;
    const bed = { kind: kind, nodes: [], gain: null, timer: null, armTimer: null, fadeTimer: null, killed: false };
    const g = ctx.createGain();
    g.gain.value = 1; g.connect(ambBus || master);
    bed.gain = g;
    ambBeds.push(bed);
    /* 每 4 分钟续一段：长时段游玩不会断，也不会留下停不掉的 1 小时音源 */
    const CHUNK = 240;
    const gen = ambBusGen;

    function arm() {
      if (bed.killed || gen !== ambBusGen || ambKind !== kind) return;
      if (kind === 'rain') {
        bed.nodes.push(noise({ filter: 'bandpass', cutoff: 1500, q: 0.35, dur: CHUNK, vol: 0.055, attack: 1.2, bus: g }));
        bed.nodes.push(noise({ filter: 'lowpass', cutoff: 420, q: 0.5, dur: CHUNK, vol: 0.030, attack: 1.5, bus: g }));
      } else if (kind === 'cafe') {
        bed.nodes.push(noise({ filter: 'bandpass', cutoff: 700, q: 0.6, dur: CHUNK, vol: 0.028, attack: 2.0, bus: g }));
        const ping = function () {
          if (bed.killed || ambKind !== 'cafe' || !bgmOn()) return;
          noise({ filter: 'highpass', cutoff: 3000, dur: 0.12, vol: 0.02, attack: 0.01, bus: g });
          bed.timer = setTimeout(ping, 4600 + Math.random() * 4200);
        };
        bed.timer = setTimeout(ping, 3200);
      } else if (kind === 'night') {
        bed.nodes.push(noise({ filter: 'lowpass', cutoff: 300, q: 0.4, dur: CHUNK, vol: 0.030, attack: 2.0, bus: g }));
      } else if (kind === 'crowd') {
        bed.nodes.push(noise({ filter: 'bandpass', cutoff: 520, q: 0.5, dur: CHUNK, vol: 0.032, attack: 2.5, bus: g }));
        bed.nodes.push(noise({ filter: 'bandpass', cutoff: 1400, q: 0.7, dur: CHUNK, vol: 0.016, attack: 3.0, bus: g }));
      } else if (kind === 'sea') {
        bed.nodes.push(noise({ filter: 'lowpass', cutoff: 520, q: 0.6, dur: CHUNK, vol: 0.055, attack: 2.2, bus: g }));
        bed.nodes.push(noise({ filter: 'bandpass', cutoff: 900, q: 0.4, dur: CHUNK, vol: 0.030, attack: 3.0, bus: g }));
      } else if (kind === 'wind') {
        bed.nodes.push(noise({ filter: 'bandpass', cutoff: 620, q: 0.3, dur: CHUNK, vol: 0.030, attack: 3.2, bus: g }));
        bed.nodes.push(noise({ filter: 'highpass', cutoff: 2400, q: 0.5, dur: CHUNK, vol: 0.012, attack: 3.6, bus: g }));
      } else if (kind === 'underwater') {
        bed.nodes.push(noise({ filter: 'lowpass', cutoff: 200, q: 0.8, dur: CHUNK, vol: 0.055, attack: 1.6, bus: g }));
        bed.nodes.push(noise({ filter: 'bandpass', cutoff: 480, q: 1.2, dur: CHUNK, vol: 0.020, attack: 2.4, bus: g }));
      } else if (kind === 'keyboard') {
        const tap = function () {
          if (bed.killed || ambKind !== 'keyboard' || !bgmOn()) return;
          noise({ filter: 'bandpass', cutoff: 2200, q: 1.4, dur: 0.05, vol: 0.02, attack: 0.004, bus: g });
          if (Math.random() < 0.6) bed.timer = setTimeout(tap, 90 + Math.random() * 220);
          else bed.timer = setTimeout(tap, 700 + Math.random() * 1600);
        };
        bed.timer = setTimeout(tap, 400);
      } else if (kind === 'park') {
        /* 白天的乐园（香港迪士尼园区段）：
         *   ① 人群底噪两层（520Hz 中低 + 1500Hz 明亮层）——和 crowd 同源，但压低一点，
         *      因为这一床之上还要叠"远处音乐"和"轨道车"，不能糊成一片；
         *   ② 240Hz 低通一层当"园区的空气"，补足户外的低频厚度；
         *   ③ 每隔 7~12s 轮换一个事件：远处音乐短句（四个音，很远、很轻）
         *      与偶尔一列轨道车（带通中心 420→2200Hz 扫过去，再补一层高频风切）。
         * 事件节点全部挂在 bed 上：到期由 retireBedNodes 回收，stopAmbience() 时
         * 由 killBed 连定时器一起清掉 —— 不会出现停不掉的噪声源。 */
        bed.nodes.push(noise({ filter: 'bandpass', cutoff: 520, q: 0.5, dur: CHUNK, vol: 0.026, attack: 2.5, bus: g }));
        bed.nodes.push(noise({ filter: 'bandpass', cutoff: 1500, q: 0.7, dur: CHUNK, vol: 0.013, attack: 3.0, bus: g }));
        bed.nodes.push(noise({ filter: 'lowpass', cutoff: 240, q: 0.4, dur: CHUNK, vol: 0.018, attack: 4.0, bus: g }));
        let step = 0;
        const parkEvent = function () {
          if (bed.killed || ambKind !== 'park' || !bgmOn()) return;
          retireBedNodes(bed);
          if (step % 2 === 0) {
            /* 远处音乐：4 音短句，三角波过 900Hz 低通、极轻 —— 只留"那边在放音乐"的轮廓 */
            [[72, 0], [76, 0.42], [79, 0.84], [76, 1.26]].forEach(function (p) {
              const h = tone({
                freq: mtof(p[0]), dur: 0.5, type: 'triangle', vol: 0.010, attack: 0.12,
                filter: 'lowpass', cutoff: 900, q: 0.7, delay: p[1], bus: g
              });
              if (h) bed.nodes.push(h);
            });
          } else {
            /* 偶尔一列轨道车：带通中心上扫 + 高频风切 */
            const a = noise({ filter: 'bandpass', cutoff: 420, cutoffTo: 2200, q: 1.1, dur: 1.1, vol: 0.024, attack: 0.35, bus: g });
            if (a) bed.nodes.push(a);
            const b = noise({ filter: 'highpass', cutoff: 2200, dur: 0.9, vol: 0.011, attack: 0.40, delay: 0.15, bus: g });
            if (b) bed.nodes.push(b);
          }
          step++;
          /* 7s / 9.5s / 12s 轮换：听不出机械节拍，也不会密到抢戏 */
          bed.timer = setTimeout(parkEvent, 7000 + (step % 3) * 2500);
        };
        bed.timer = setTimeout(parkEvent, 4200);
      }
      bed.armTimer = setTimeout(arm, (CHUNK - 8) * 1000);
    }
    arm();
  }

  /* ============================================================
   * 7. 音效（短生命，sfxOn 关闭时不创建任何节点）
   *
   * 大型音效（烟花 / 呼啸 / 花车乐句）走"声部"机制：一次音效建出来的
   * 十几个振荡器与噪声源登记在同一个声部上，播完（时长 + 0.2s 余量）后
   * 统一 stop + disconnect，不在 sfxGain 上留任何停止态节点。
   * 定时器登记在声部上，killAllVoices() 可一次清空（关掉音效开关时用）。
   * ============================================================ */
  let sfxVoices = [];
  function sfxVoice(dur) {
    const v = { nodes: [], timer: null, done: false };
    sfxVoices.push(v);
    v.timer = setTimeout(function () { killVoice(v); }, Math.max(140, dur * 1000 + 200));
    return v;
  }
  function killVoice(v) {
    if (!v || v.done) return;
    v.done = true;
    if (v.timer) { clearTimeout(v.timer); v.timer = null; }
    const i = sfxVoices.indexOf(v);
    if (i >= 0) sfxVoices.splice(i, 1);
    for (let k = 0; k < v.nodes.length; k++) {
      const n = v.nodes[k];
      if (!n) continue;
      if (n.osc) { safe(function () { n.osc.stop(0); }); disc(n.osc); }
      if (n.src) { safe(function () { n.src.stop(0); }); disc(n.src); }
      disc(n.filter); disc(n.gain);
    }
    v.nodes.length = 0;
  }
  function killAllVoices() { for (let i = sfxVoices.length - 1; i >= 0; i--) killVoice(sfxVoices[i]); }

  const SFX = {
    sfx_click: function () { tone({ freq: 880, dur: 0.05, type: 'triangle', vol: 0.06, slideTo: 660 }); },
    sfx_page: function () { noise({ filter: 'highpass', cutoff: 2400, dur: 0.09, vol: 0.05, attack: 0.01 }); },
    sfx_msg: function () {
      tone({ freq: 1318, dur: 0.07, type: 'sine', vol: 0.055 });
      tone({ freq: 1760, dur: 0.1, type: 'sine', vol: 0.04, delay: 0.06 });
    },
    sfx_ding: function () {
      [1046, 1568, 2093].forEach(function (f, i) { tone({ freq: f, dur: 2.2 - i * 0.4, type: 'sine', vol: 0.07 - i * 0.015, delay: i * 0.01 }); });
      tone({ freq: 523, dur: 2.6, type: 'triangle', vol: 0.045 });
    },
    sfx_laugh: function () {
      [880, 988, 1046].forEach(function (f, i) { tone({ freq: f, dur: 0.09, type: 'triangle', vol: 0.05, delay: i * 0.07, slideTo: f * 1.12 }); });
    },
    sfx_camera: function () {
      noise({ filter: 'highpass', cutoff: 3600, dur: 0.05, vol: 0.07, attack: 0.005 });
      noise({ filter: 'bandpass', cutoff: 1800, q: 1.2, dur: 0.1, vol: 0.05, delay: 0.09 });
    },
    sfx_choice: function () { tone({ freq: 620, dur: 0.12, type: 'sine', vol: 0.09, slideTo: 930 }); },
    sfx_heart: function () { tone({ freq: 740, dur: 0.1, type: 'sine', vol: 0.08 }); tone({ freq: 988, dur: 0.14, type: 'sine', vol: 0.07, delay: 0.08 }); },
    sfx_bell: function () { tone({ freq: 1180, dur: 0.5, type: 'sine', vol: 0.07 }); tone({ freq: 1760, dur: 0.4, type: 'sine', vol: 0.04, delay: 0.02 }); },
    sfx_thunder: function () {
      noise({ filter: 'lowpass', cutoff: 260, dur: 1.5, vol: 0.22, attack: 0.02 });
      tone({ freq: 70, dur: 1.2, type: 'sawtooth', vol: 0.08, slideTo: 40 });
    },
    sfx_rain_start: function () { noise({ filter: 'bandpass', cutoff: 1400, q: 0.4, dur: 1.2, vol: 0.1, attack: 0.5 }); },

    /* ---------- 香港迪士尼章专用（2026.04）----------
     * 全部只用振荡器 + 噪声 + 低通/带通，不用任何采样；爆破与风都靠
     * "低频冲击（振荡器下滑）+ 中频爆点（带通噪声）+ 高频沙沙（高通噪声长尾）"三层堆出来。*/

    /* 烟花升空"咻"（约 0.55s）：一条上滑的细线。
     * 对应剧本 hk_141：「第一发升空的声音不是「砰」，是「咻」——很细，像有人在夜里拉了一根线。」*/
    sfx_firework_launch: function () {
      const v = sfxVoice(0.62);
      /* ① 主线：正弦 340 → 1450Hz，0.52s 上扫（咻的手势感） */
      tone({ freq: 340, slideTo: 1450, dur: 0.52, type: 'sine', vol: 0.055, attack: 0.06, keep: v });
      /* ② 高八度+五度的细芯（三角波 760 → 2150Hz）：让"线"细而不糊 */
      tone({ freq: 760, slideTo: 2150, dur: 0.40, type: 'triangle', vol: 0.016, attack: 0.07, delay: 0.05, keep: v });
      /* ③ 少量气流噪声：带通中心 700 → 2600Hz 跟着一起上扫 */
      noise({ filter: 'bandpass', cutoff: 700, cutoffTo: 2600, q: 1.6, dur: 0.48, vol: 0.028, attack: 0.14, keep: v });
    },

    /* 烟花炸开"砰"（约 1.2s）：低频冲击 + 中频爆点 + 高频沙沙尾巴。
     * 对应剧本 hk_142：「那根线在城堡正上方炸开……金色的光先是一个点，再是一圈。」*/
    sfx_firework_boom: function () {
      const v = sfxVoice(1.25);
      /* ① 低频冲击 120 → 38Hz，6ms 起音：胸腔里的那一下 */
      tone({ freq: 120, slideTo: 38, dur: 0.62, type: 'sine', vol: 0.170, attack: 0.006, keep: v });
      /* ② 次低八度垫底 74 → 44Hz：手机小喇叭上也能听见的"重量" */
      tone({ freq: 74, slideTo: 44, dur: 0.75, type: 'triangle', vol: 0.075, attack: 0.012, keep: v });
      /* ③ 中频爆点：900Hz / 1900Hz 带通噪声，3~4ms 起音，0.18~0.26s —— 就是"砰" */
      noise({ filter: 'bandpass', cutoff: 900, q: 0.8, dur: 0.26, vol: 0.100, attack: 0.004, keep: v });
      noise({ filter: 'bandpass', cutoff: 1900, q: 1.0, dur: 0.18, vol: 0.055, attack: 0.003, keep: v });
      /* ④ 高频沙沙尾巴：3.6kHz 高通 1.05s + 6.2kHz 带通 0.95s（慢起音＝火星慢慢散开） */
      noise({ filter: 'highpass', cutoff: 3600, dur: 1.05, vol: 0.045, attack: 0.02, keep: v });
      noise({ filter: 'bandpass', cutoff: 6200, q: 0.5, dur: 0.95, vol: 0.024, attack: 0.06, delay: 0.05, keep: v });
      /* ⑤ 三声延迟的碎火星（固定时刻，不用随机数，保证节点数确定） */
      [0.24, 0.42, 0.66].forEach(function (d, i) {
        noise({ filter: 'highpass', cutoff: 4800 + i * 900, dur: 0.09, vol: 0.020 - i * 0.004, attack: 0.004, delay: d, keep: v });
      });
    },

    /* 烟花齐放（约 2.7s）：比 boom 更长更厚的"一片"，不是一声。
     * 对应剧本 hk_161：「几十朵一起开，从城堡的左边一直铺到右边。」*/
    sfx_firework_finale: function () {
      const v = sfxVoice(2.85);
      /* ① 三层错开的低频冲击（0 / 0.13 / 0.29s，音高与时长逐层递减）
       *    —— 用"错开"代替"更响"，听感是"很多发"，而不是"一发特别大" */
      [[0.00, 116, 34, 0.190, 1.55],
       [0.13, 98, 30, 0.150, 1.35],
       [0.29, 134, 40, 0.120, 1.15]].forEach(function (L) {
        tone({ freq: L[1], slideTo: L[2], dur: L[4], type: 'sine', vol: L[3], attack: 0.008, delay: L[0], keep: v });
      });
      /* ② 中频爆点 ×3（820 / 1140 / 1460Hz）错开，连成一片 */
      [0.00, 0.13, 0.29].forEach(function (d, i) {
        noise({ filter: 'bandpass', cutoff: 820 + i * 320, q: 0.75, dur: 0.34, vol: 0.095 - i * 0.018, attack: 0.005, delay: d, keep: v });
      });
      /* ③ 长"混响"尾巴（纯合成没有卷积混响，用两层长噪声近似）：3kHz 高通 2.6s
       *    + 6.5kHz 带通 2.3s —— 天空亮着的那几秒 */
      noise({ filter: 'highpass', cutoff: 3000, dur: 2.60, vol: 0.055, attack: 0.05, keep: v });
      noise({ filter: 'bandpass', cutoff: 6500, q: 0.4, dur: 2.30, vol: 0.028, attack: 0.12, delay: 0.10, keep: v });
      /* ④ 一串落下来的火星（越往后越稀、越轻） */
      [0.50, 0.78, 1.12, 1.55, 2.02].forEach(function (d, i) {
        noise({ filter: 'highpass', cutoff: 5200 + i * 700, dur: 0.10, vol: 0.020 - i * 0.0026, attack: 0.004, delay: d, keep: v });
      });
    },

    /* 过山车俯冲"呼啸"（约 1.35s）：风 + 下坠的滑动感。
     * 对应剧本 hk_40：「她没有叫。她在笑。笑声被风吹散」（俯冲那一下）。*/
    sfx_coaster_whoosh: function () {
      const v = sfxVoice(1.5);
      /* ① 风声主体：带通中心 260 → 1700Hz 上扫 1.25s，慢起音 —— 气流被撕开 */
      noise({ filter: 'bandpass', cutoff: 260, cutoffTo: 1700, q: 0.55, dur: 1.25, vol: 0.085, attack: 0.30, keep: v });
      /* ② 高频风切：1.8kHz 高通，再慢一点起音，负责"速度" */
      noise({ filter: 'highpass', cutoff: 1800, dur: 1.15, vol: 0.045, attack: 0.34, delay: 0.05, keep: v });
      /* ③ 下坠滑动：620 → 105Hz，1.05s —— 身体往下掉的那一下 */
      tone({ freq: 620, slideTo: 105, dur: 1.05, type: 'sine', vol: 0.048, attack: 0.10, keep: v });
      /* ④ 低八度垫底 310 → 52Hz，过 900Hz 低通：撑住下坠的重量 */
      tone({ freq: 310, slideTo: 52, dur: 1.15, type: 'triangle', vol: 0.038, attack: 0.14, filter: 'lowpass', cutoff: 900, q: 0.6, keep: v });
      /* ⑤ 钢轨的金属起音：1750 → 1180Hz 锯齿波，0.2s，带通 2kHz —— 轮子压上轨道的那一瞬 */
      tone({ freq: 1750, slideTo: 1180, dur: 0.20, type: 'sawtooth', vol: 0.016, attack: 0.006, filter: 'bandpass', cutoff: 2000, q: 1.6, keep: v });
    },

    /* 花车乐句（约 2.9s，A 大调，只奏一遍，不做循环）：
     * 铜管（sawtooth + 1.7kHz 低通）领奏 + 风笛持续音（triangle 主音＋五度）
     * + 手风琴式和弦（I–V–IV–V）+ 低音号（260Hz 低通）+ 一声钟琴。
     * 音量刻意压在 BGM 之下：最响的旋律层 0.028，而 bgm_ending 的主旋律是 0.070
     * ×bgmBus 0.45 —— 目的是"花车从面前经过"，不是换一首 BGM。*/
    sfx_parade_music: function () {
      const v = sfxVoice(3.05);
      /* [MIDI, 起拍(秒), 时长, 是否叠失谐副本] —— E–E–C#–E–A–F#–E–D–C#–E */
      [[76, 0.00, 0.30, 1], [76, 0.30, 0.15, 0], [73, 0.46, 0.28, 1], [76, 0.76, 0.30, 1],
       [81, 1.10, 0.50, 1], [78, 1.62, 0.22, 0], [76, 1.86, 0.22, 0], [74, 2.10, 0.22, 0],
       [73, 2.34, 0.20, 0], [76, 2.56, 0.34, 1]].forEach(function (n) {
        tone({
          freq: mtof(n[0]), dur: n[2], type: 'sawtooth', vol: 0.028, attack: 0.045,
          filter: 'lowpass', cutoff: 1700, q: 1.1, delay: n[1], keep: v
        });
        if (n[3]) {
          /* 长音叠一个 +7 音分的副本 → 铜管的"厚"（没有合奏采样可叠） */
          tone({
            freq: mtof(n[0]) * 1.004, dur: n[2], type: 'sawtooth', vol: 0.012, attack: 0.06,
            filter: 'lowpass', cutoff: 1500, q: 1.1, delay: n[1], keep: v
          });
        }
      });
      /* 风笛持续音：主音 A3 ＋ 五度 E4 铺满 2.9s，给整句一个"一直在响"的底盘 */
      tone({ freq: mtof(57), dur: 2.90, type: 'triangle', vol: 0.010, attack: 0.18, keep: v });
      tone({ freq: mtof(64), dur: 2.90, type: 'triangle', vol: 0.008, attack: 0.24, keep: v });
      /* 手风琴式和弦：I(0.00) – V(1.05) – IV(2.10) – V(2.60)，每下三声 */
      [[0.00, [57, 61, 64], 1.05], [1.05, [52, 56, 59], 1.05],
       [2.10, [50, 54, 57], 0.50], [2.60, [52, 56, 59], 0.30]].forEach(function (c) {
        c[1].forEach(function (m) {
          tone({ freq: mtof(m), dur: c[2], type: 'triangle', vol: 0.010, attack: 0.10,
            filter: 'lowpass', cutoff: 1400, q: 0.7, delay: c[0], keep: v });
        });
      });
      /* 低音号：根音走动 A–E–E–B–D–E，只留 260Hz 以下的厚度
       * （最后一下收短，整句总长压在 2.95s 以内）*/
      [[0.00, 45, 0.46], [0.50, 40, 0.46], [1.05, 40, 0.46],
       [1.55, 47, 0.46], [2.10, 50, 0.46], [2.55, 52, 0.34]].forEach(function (b) {
        tone({ freq: mtof(b[1]), dur: b[2], type: 'triangle', vol: 0.020, attack: 0.03,
          filter: 'lowpass', cutoff: 260, q: 0.6, delay: b[0], keep: v });
      });
      /* 钟琴点缀：落在高点 A5（与旋律 81 同音高、高两个八度），一声就够 */
      tone({ freq: mtof(81) * 2, dur: 0.70, type: 'sine', vol: 0.010, attack: 0.006, delay: 1.10, keep: v });
    }
  };

  /* ============================================================
   * 8. 对外 API
   * ============================================================ */
  YJ.audio = {
    ensure: function () {
      const c = AC();
      if (c && c.state === 'suspended') safe(function () { c.resume(); });
      return !!c;
    },
    ready: function () { return !!ctx; },

    /* ---------- BGM ---------- */
    playBGM: function (id, opts) {
      opts = opts || {};
      if (!id || id === 'bgm_none' || !TRACKS[id]) {
        requestedId = id || null;
        silenceBGM(opts.fade);
        return;
      }
      if (requestedId === id && (live || !bgmOn())) return;   /* 同一首不重启 */
      requestedId = id;
      if (!bgmOn()) { silenceBGM(0.12); return; }              /* 关闭音乐：不创建任何发声节点 */
      if (!AC()) return;
      startTrack(id, opts.fadeIn != null ? opts.fadeIn : CFG.fadeIn,
                     opts.fadeOut != null ? opts.fadeOut : CFG.fadeOut);
    },
    stopBGM: function (opts) {
      requestedId = null;
      const fade = opts && opts.fade != null ? opts.fade : CFG.stopFade;
      if (!ctx) return;
      silenceBGM(fade);
    },
    /* 当前 BGM id（供 UI/测试） */
    current: function () { return requestedId; },

    /* ---------- 环境音 ---------- */
    playAmbience: function (kind) {
      if (kind === 'none' || kind == null) { this.stopAmbience(); return; }
      if (ambKind === kind) return;
      this.stopAmbience();
      ambKind = kind;
      ambBusGen++;
      if (!AC() || !bgmOn()) return;    /* 关闭音乐时不创建环境音节点 */
      playAmb(kind);
    },
    stopAmbience: function () {
      ambKind = null;
      ambBusGen++;
      if (!ctx) return;
      stopAllBeds(CFG.stopFade);
    },
    ambience: function () { return ambKind; },

    /* ---------- 情绪节奏：只调增益包络 + 配器层级，绝不新增振荡器 ---------- */
    beat: function (kind) {
      if (!ctx || !bgmBus) return;
      if (!beatGain || !beatGain.gain) return;
      const now = ctx.currentTime;
      const gap = BEAT_GAP[kind];
      if (gap) {
        if (beatLast[kind] != null && now - beatLast[kind] < gap) return;   /* 限流：避免同一标记连打 */
        beatLast[kind] = now;
      }
      const g = beatGain.gain;
      const cur = Number(g.value) || 1;
      if (live) {
        live.mode = (kind === 'calm' || kind === 'pulse' || kind === 'swell' || kind === 'drop') ? kind : 'calm';
        if (kind === 'swell') live.push = 8;            /* 接下来一整遍曲式加一层（琶音+闪片） */
        else if (kind === 'calm') live.push = 0;
        if (live.push > 0) live.push--;
      }
      if (!bgmOn()) return;
      try {
        safe(function () { g.cancelScheduledValues(now); });
        safe(function () { g.setValueAtTime(cur, now); });
        if (kind === 'drop') {
          /* 抽掉音乐 ~1.1s，留白（"她把语音静音了"这类瞬间），随后自己回来 */
          safe(function () { g.linearRampToValueAtTime(0.0001, now + 0.25); });
          safe(function () { g.setValueAtTime(0.0001, now + 1.1); });
          safe(function () { g.linearRampToValueAtTime(1, now + 2.1); });
        } else if (kind === 'swell') {
          safe(function () { g.linearRampToValueAtTime(1.28, now + 0.6); });
          safe(function () { g.linearRampToValueAtTime(1, now + 3.4); });
        } else if (kind === 'pulse') {
          safe(function () { g.linearRampToValueAtTime(1.10, now + 0.4); });
          safe(function () { g.linearRampToValueAtTime(1, now + 1.6); });
        } else {
          safe(function () { g.linearRampToValueAtTime(1, now + 0.6); });
        }
      } catch (e) { }
    },

    /* ---------- 音效 ---------- */
    sfx: function (id) {
      if (!settings().sfxOn) return;              /* 关闭音效后绝不发声（也不创建节点） */
      const f = SFX[id];
      if (f && AC()) safe(f);
    },

    applyVolumes: applyVolumes,

    /* 设置变更后调用：开关音乐 / 改音量 */
    refresh: function () {
      applyVolumes();
      /* 关掉音效：正在播的一次性音效声部立刻 stop + disconnect，不留尾巴 */
      if (settings().sfxOn === false) killAllVoices();
      if (!ctx) return;
      if (!bgmOn()) {
        silenceBGM(0.2);
        stopAllBeds(0.2);
        return;
      }
      if (requestedId && !live && TRACKS[requestedId]) startTrack(requestedId, 0.4, 0.4);
      if (ambKind && !ambBeds.length) { ambBusGen++; playAmb(ambKind); }
    },

    /* ---------- 供配乐规划 / 调试 / 测试 ---------- */
    list: function () {
      const out = [];
      for (const id in TRACKS) {
        const d = TRACKS[id];
        if (!d) continue;
        out.push({
          id: id, name: d.name, use: d.use, bpm: d.bpm, beats: d.beats,
          bar: +barSeconds(d).toFixed(2), scale: d.scale, tonic: d.tonic,
          form: d.form.join(''), prog: d.prog, amb: d.amb || null,
          voices: {
            pad: d.pad ? d.pad.type : null, padThick: !!d.pad.thick,
            bass: d.bass ? d.bass.type : null, bassPulse: !!(d.bass && d.bass.pulse),
            arp: (d.arp && d.arp.on) ? d.arp.type : null, arpDiv: (d.arp && d.arp.on) ? (d.arp.div || 4) : 0,
            mel: d.mel ? d.mel.type : null, melNotes: d.mel ? d.mel.notes : 0,
            bell: d.bell ? d.bell.type : null,
            counter: (d.counter && d.counter.on) ? d.counter.type : null
          }
        });
      }
      return out;
    },
    /* 动机表（导出用） */
    motif: function () {
      return { degs: 'do–re–mi–sol–mi–re', vars: MOTIF_VARS.map(v => ({ label: v.label, degs: v.degs.join(','), oct: v.oct, rhythm: v.rhythm.join(',') })) };
    },
    /* 某一首曲子在某一段落（A/B/C）用哪些配器层、什么转位、什么和弦（配乐规划/QA 用） */
    layers: function (id, section, mode, push) {
      const d = TRACKS[id];
      if (!d) return null;
      const b = (d.prog && (d.prog[section] || d.prog.A)) || null;
      if (!b) return null;
      const scale = SCALES[d.scale] || SCALES.major;
      const chords = b.chords.map(c => c.map(dd => deg2semi(dd, scale)));
      return {
        id: id, section: section, voicing: b.voicing, chords: b.chords,
        /* voiced = 施加转位/排列之后、相对主音的半音数组（导出/核对用） */
        voiced: chords.map(c => (VOICE[b.voicing] || VOICE.close)(c)),
        layers: layersFor(d, b, { mode: mode || null, push: push || 0 })
      };
    },
    endingMap: function () { return Object.assign({}, ENDING_BGM); },

    /* 离线渲染探针（测试/导出用，游戏流程不会调用）：
     * 把某首曲子的前 n 小节真正"算"出来，但接到一个不连总线的 scratch gain 上（完全静音），
     * 随后立刻 stop+disconnect。用来核对每个段落/每种变奏实际生成的音符、音域与数量。 */
    _render: function (id, bars, mode, push) {
      const def = TRACKS[id];
      if (!def || !AC() || !bgmOn()) return null;
      const g = ctx.createGain();                     /* 故意不 connect → 无声 */
      const scratch = { id: id, gain: g, nodes: [], chain: [], dead: false, killed: false, mode: mode || null, push: push || 0, step: 0 };
      const bar = barSeconds(def);
      const t0 = ctx.currentTime;
      const N = Math.max(1, bars || (def.form.length * 5));
      const byRole = {}, perBar = [], midis = [];
      for (let i = 0; i < N; i++) {
        scratch.nodes.length = 0;
        scheduleBar(scratch, t0 + i * bar);
        const sec = def.form[scratch.step === 0 ? 0 : (scratch.step - 1) % def.form.length];
        perBar.push({ bar: i, section: sec, notes: scratch.nodes.length });
        for (let k = 0; k < scratch.nodes.length; k++) {
          const n = scratch.nodes[k];
          const f = n.osc.frequency.value;
          if (f > 0) midis.push(69 + 12 * Math.log(f / 440) / Math.LN2);
          const r = n.role || '?';
          byRole[r] = (byRole[r] || 0) + 1;
          safe(function () { n.osc.stop(0); });
          disc(n.osc); disc(n.filter); disc(n.gain);
        }
      }
      disc(g);
      midis.sort(function (a, b) { return a - b; });
      return {
        id: id, name: def.name, bars: N, barSeconds: +bar.toFixed(3),
        notes: midis.length, byRole: byRole, perBar: perBar,
        midiMin: midis.length ? +midis[0].toFixed(1) : null,
        midiMax: midis.length ? +midis[midis.length - 1].toFixed(1) : null,
        form: def.form.join(''), variations: Math.ceil(N / def.form.length)
      };
    },

    /* 测试/诊断：活跃音源统计 */
    _debug: function () {
      const now = ctx ? ctx.currentTime : 0;
      let liveOsc = 0, releasingOsc = 0, sounding = 0, tracked = 0;
      function scan(t, bucket) {
        for (let i = 0; i < t.nodes.length; i++) {
          const n = t.nodes[i];
          if (n.stopAt > now) sounding++;
          tracked++;
          if (bucket === 'live') liveOsc++; else releasingOsc++;
        }
      }
      if (live) scan(live, 'live');
      releasing.forEach(t => scan(t, 'rel'));
      let bedNodes = 0, bedTimers = 0;
      ambBeds.forEach(b => { bedNodes += b.nodes.length; if (b.timer) bedTimers++; });
      let voiceNodes = 0;
      sfxVoices.forEach(v => { voiceNodes += v.nodes.length; });
      const roles = {};
      if (live) live.nodes.forEach(n => { const k = n.role || '?'; roles[k] = (roles[k] || 0) + 1; });
      return {
        hasCtx: !!ctx, failed: failed,
        bgm: requestedId, live: live ? live.id : null,
        liveTracks: (live ? 1 : 0) + releasing.length,
        liveOsc: liveOsc, releasingOsc: releasingOsc, trackedOsc: tracked,
        soundingOsc: sounding, liveRoles: roles,
        liveStep: live ? live.step : 0, liveMode: live ? live.mode : null,
        amb: ambKind, ambBeds: ambBeds.length, ambNodes: bedNodes, ambTimers: bedTimers,
        sfxVoices: sfxVoices.length, sfxVoiceNodes: voiceNodes,
        cfg: { fadeIn: CFG.fadeIn, fadeOut: CFG.fadeOut, stopFade: CFG.stopFade },
        _set: function (k, v) { if (CFG[k] != null) CFG[k] = v; }
      };
    },

    /* 兼容旧测试接口 */
    _state: function () {
      return { hasCtx: !!ctx, bgm: requestedId, amb: ambKind, failed: failed };
    }
  };

  /* ---------- 收束曲目路由（不必改 engine.js）----------
   * engine.js 的 presentEnding() 统一 playBGM('bgm_ending')，随后 emit('engine:ending', id)。
   * 这里收到事件后把"结局专属"的曲子补上（间隔极短 → 自动走快速替换，不会叠两层主题）。*/
  if (YJ.bus && YJ.bus.on) {
    YJ.bus.on('engine:ending', function (id) {
      const want = ENDING_BGM[id];
      if (want && YJ.audio && requestedId !== want) YJ.audio.playBGM(want);
    });
  }

  /* 切后台时别让定时器把一堆小节堆起来：回来重新对拍 */
  if (root.document && root.document.addEventListener) {
    root.document.addEventListener('visibilitychange', function () {
      if (root.document.hidden) return;
      if (live && ctx) { live.nextAt = ctx.currentTime; }
      beatLast = {};
    });
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
