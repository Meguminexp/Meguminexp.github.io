/* 《你好！一周年》— save.js
 * 存档 / 读档 / 设置 / 已读记录（localStorage 持久化）
 * 槽位：
 *   · 手动 1..6（yajin.v1.save.slot1..6）+ quick 快速存档
 *   · auto 自动存档（yajin.v1.save.auto）
 *   · **章节自动存档** yajin.v1.save.chapter0..chapter10（每章开头一份，
 *     与手动槽完全分离，手动存档永远不会覆盖它们）
 * 刷新浏览器后可继续。旧版本存档（没有 kind 字段）照旧可读。
 */
(function (root) {
  'use strict';
  const YJ = root.YJ = root.YJ || {};

  const NS = 'yajin.v1.';
  const K_SLOT = i => NS + 'save.slot' + i;
  const K_AUTO = NS + 'save.auto';
  const K_QUICK = NS + 'save.quick';
  const K_SET = NS + 'settings';
  const K_READ = NS + 'read';

  /* ---------- 章节自动存档（每章一个专用槽） ----------
   * 键名：yajin.v1.save.chapter<N>，N = 0..10（序章 + 第 1..10 章）。
   * 独立于手动槽与 auto 槽，所以"手动存档"永远动不到它们。 */
  const K_CHAPTER = n => NS + 'save.chapter' + n;
  const CHAPTER_FIRST = 0;      /* 序章 = 0 */
  const CHAPTER_COUNT = 11;     /* 0..10，共 11 个默认章节槽 */
  /* 章节名（与 剧本/ch*.md 的文件名一致，供读档列表显示「第 3 章 · 生日地图」） */
  const CHAPTER_TITLE = {
    0: '一个无聊的人', 1: '一条帖子', 2: '四人变两人', 3: '生日地图', 4: '石头说的话',
    5: '第一次见面', 6: '大吵与苏州', 7: '每个月都去见你', 8: '南阳的生日', 9: '三次旅行', 10: '一周年'
  };

  /* 槽位 id → localStorage 键。
     'auto' / 'quick' / 'ch<N>'（章节自动槽）/ 数字 1..6（手动槽） */
  function keyOf(slot) {
    if (slot === 'auto') return K_AUTO;
    if (slot === 'quick') return K_QUICK;
    if (typeof slot === 'string' && /^ch\d+$/.test(slot)) {
      const n = parseInt(slot.slice(2), 10);
      if (n >= CHAPTER_FIRST && n < CHAPTER_FIRST + CHAPTER_COUNT) return K_CHAPTER(n);
    }
    return K_SLOT(slot);
  }

  const DEFAULT_SETTINGS = {
    textSpeed: 26,        // 每字毫秒
    typewriter: true,     // 打字机效果
    autoDelay: 1800,      // 自动播放停留毫秒
    autoMode: false,      // 局内状态，也持久化
    bgmVol: 0.45,
    sfxVol: 0.6,
    bgmOn: true,
    sfxOn: true,
    skipUnread: false     // 快进是否包含未读文本
  };

  /* localStorage 可能不可用（隐私模式 / 沙箱）——统一兜底到内存 */
  const mem = {};
  const store = {
    ok: (function () {
      try { const k = NS + 'probe'; localStorage.setItem(k, '1'); localStorage.removeItem(k); return true; }
      catch (e) { return false; }
    })(),
    get(k) { try { return this.ok ? localStorage.getItem(k) : (mem[k] || null); } catch (e) { return mem[k] || null; } },
    set(k, v) { try { if (this.ok) localStorage.setItem(k, v); else mem[k] = v; } catch (e) { mem[k] = v; } },
    del(k) { try { if (this.ok) localStorage.removeItem(k); else delete mem[k]; } catch (e) { delete mem[k]; } },
    keys() {
      const out = [];
      try {
        if (this.ok) { for (let i = 0; i < localStorage.length; i++) out.push(localStorage.key(i)); }
        else for (const k in mem) out.push(k);
      } catch (e) { }
      return out;
    }
  };

  YJ.save = {
    SLOT_COUNT: 6,
    CHAPTER_COUNT,
    CHAPTER_FIRST,
    store,
    settings: Object.assign({}, DEFAULT_SETTINGS),

    /* ---------- 设置 ---------- */
    loadSettings() {
      try {
        const raw = store.get(K_SET);
        if (raw) this.settings = Object.assign({}, DEFAULT_SETTINGS, JSON.parse(raw));
      } catch (e) { this.settings = Object.assign({}, DEFAULT_SETTINGS); }
      return this.settings;
    },
    saveSettings() {
      try { store.set(K_SET, JSON.stringify(this.settings)); } catch (e) { }
      YJ.bus.emit('settings:changed', this.settings);
    },
    setSetting(k, v) { this.settings[k] = v; this.saveSettings(); },

    /* ---------- 已读记录（快进用）----------
     * 注意：缓存字段叫 _readMap，不要叫 _read —— 本对象里 _read(key) 是
     * "读某个存档键"的方法，同名会把已读缓存覆盖成函数（旧代码里 wipeAll()
     * 还会把 _read 设成 null，之后任何 peek() 都会崩）。 */
    _readMap: null,
    _loadRead() {
      if (this._readMap) return this._readMap;
      try { this._readMap = JSON.parse(store.get(K_READ) || '{}') || {}; } catch (e) { this._readMap = {}; }
      return this._readMap;
    },
    markRead(nodeId) {
      if (!nodeId) return;
      const r = this._loadRead();
      if (!r[nodeId]) { r[nodeId] = 1; this._readDirty = true; }
    },
    isRead(nodeId) { return !!this._loadRead()[nodeId]; },
    flushRead() {
      if (!this._readDirty) return;
      this._readDirty = false;
      try { store.set(K_READ, JSON.stringify(this._readMap)); } catch (e) { }
    },

    /* ---------- 存档 ---------- */
    _write(key, extra) {
      const st = YJ.state.st;
      const node = st.node && YJ.story.get(st.node);
      const payload = {
        version: 1,
        kind: (extra && extra.kind) || 'manual',      /* manual | quick | auto | chapter（旧档没有 = manual） */
        savedAt: YJ.util.now(),
        chapter: st.chapter,
        chapterTitle: CHAPTER_TITLE[st.chapter | 0] || '',
        nodeId: st.node,
        nodeText: node ? YJ.util.cut(node.text || '', 40) : '',
        speaker: node ? (YJ.speakers[node.speaker] ? YJ.speakers[node.speaker].name : '') : '',
        scene: st.scene,
        cg: node ? node.cg || null : null,
        state: YJ.state.snapshot(),
        settings: YJ.util.deep(this.settings),
        label: extra && extra.label ? extra.label : ''
      };
      try { store.set(key, JSON.stringify(payload)); return true; }
      catch (e) { console.warn('[YJ.save] 写入失败', e); return false; }
    },
    saveTo(slot, label) {
      if (slot === 'auto') return this._write(K_AUTO, { label: label || '自动存档', kind: 'auto' });
      if (slot === 'quick') return this._write(K_QUICK, { label: label || '快速存档', kind: 'quick' });
      return this._write(K_SLOT(slot), { label: label || ('存档 ' + slot), kind: 'manual' });
    },
    autosave() { return this.saveTo('auto'); },

    /* ---------- 章节自动存档（⑤） ----------
     * 进入一章的开头时调用：把"该章开头状态"写进该章专用槽。
     *   · 同一次游玩里同一章只写一次 —— 在章内来回走不会反复刷屏式存档；
     *   · 读档回到某章开头时用 markChapterDone() 标记，因此不会被当成"新章"
     *     而立刻覆盖自己（存档里那一份原样保留）；
     *   · 新游戏时 resetChapterRun() 清空标记，于是本次游玩的每一章会重新记录。 */
    chapterAutosave(ch) {
      ch = ch | 0;
      if (ch < CHAPTER_FIRST || ch >= CHAPTER_FIRST + CHAPTER_COUNT) return false;
      if (this._chapterDone[ch]) return false;
      this._chapterDone[ch] = 1;                       /* 先标记：写入失败也不反复重试刷屏 */
      return this._write(K_CHAPTER(ch), { label: this.chapterLabel(ch), kind: 'chapter' });
    },
    markChapterDone(ch) { if (typeof ch === 'number') this._chapterDone[ch | 0] = 1; },
    resetChapterRun() { this._chapterDone = {}; },
    _chapterDone: {},
    chapterTitle(ch) { return CHAPTER_TITLE[ch | 0] || ''; },
    chapterLabel(ch) {
      ch = ch | 0;
      const t = CHAPTER_TITLE[ch] || '';
      if (ch === 0) return t ? ('序章 · ' + t) : '序章';
      return '第 ' + ch + ' 章' + (t ? ' · ' + t : '');
    },

    _read(key) {
      try {
        const raw = store.get(key);
        if (!raw) return null;
        const d = JSON.parse(raw);
        /* 向后兼容：结构不认识 / 节点已不存在 → 当作"无存档"，绝不抛错 */
        if (!d || typeof d !== 'object' || !d.nodeId || !YJ.story.has(d.nodeId)) return null;
        return d;
      } catch (e) { return null; }
    },
    peek(slot) { return this._read(keyOf(slot)); },

    /* 读档：恢复完整状态（含好感/信任/标记/设置） */
    loadFrom(slot) {
      const d = this.peek(slot);
      if (!d) return false;
      if (d.settings) this.settings = Object.assign({}, DEFAULT_SETTINGS, d.settings);
      YJ.state.restore(d.state);
      YJ.state.st.node = d.nodeId;
      YJ.state.st.scene = d.scene || YJ.state.st.scene;
      if (d.state && typeof d.state.chapter === 'number') YJ.state.st.chapter = d.state.chapter;
      YJ.bus.emit('save:loaded', d);
      return true;
    },
    deleteSlot(slot) { store.del(keyOf(slot)); },

    /* 供标题界面：列出所有槽位摘要（自动 + 6 手动） */
    list() {
      const out = [];
      out.push({ slot: 'auto', kind: 'auto', data: this.peek('auto') });
      for (let i = 1; i <= this.SLOT_COUNT; i++) out.push({ slot: i, kind: 'manual', data: this.peek(i) });
      return out;
    },
    /* ⑤ 章节自动存档列表：只列出已经有内容的章（读档界面单独一栏显示） */
    chapters() {
      const out = [];
      for (let ch = CHAPTER_FIRST; ch < CHAPTER_FIRST + CHAPTER_COUNT; ch++) {
        const d = this._read(K_CHAPTER(ch));
        if (d) out.push({ slot: 'ch' + ch, chapter: ch, kind: 'chapter', label: this.chapterLabel(ch), data: d });
      }
      return out;
    },
    hasAnySave() { return this.list().some(s => !!s.data) || !!this.peek('quick') || this.chapters().length > 0; },

    /* 最近一次存档（用于"继续游戏"）；章节自动存档也算 */
    latest() {
      const all = this.list().filter(s => s.data).map(s => ({ slot: s.slot, d: s.data }));
      this.chapters().forEach(s => all.push({ slot: s.slot, d: s.data }));
      const q = this.peek('quick');
      if (q) all.push({ slot: 'quick', d: q });
      if (!all.length) return null;
      all.sort((a, b) => (b.d.savedAt || 0) - (a.d.savedAt || 0));
      return all[0];
    },

    /* 清空全部游戏数据（设置界面用） */
    wipeAll() {
      store.keys().filter(k => k && k.indexOf(NS) === 0).forEach(k => store.del(k));
      this._readMap = null;
      this._chapterDone = {};
      this.settings = Object.assign({}, DEFAULT_SETTINGS);
      YJ.bus.emit('save:wiped');
    },

    /* 导出/导入（便于排查问题） */
    exportAll() {
      const out = { settings: this.settings, read: this._loadRead(), slots: {} };
      this.list().forEach(s => { if (s.data) out.slots[s.slot] = s.data; });
      this.chapters().forEach(s => { out.slots[s.slot] = s.data; });
      const q = this.peek('quick'); if (q) out.slots.quick = q;
      return out;
    },
    DEFAULT_SETTINGS
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);
