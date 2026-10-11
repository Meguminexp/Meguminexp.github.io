/* 《你好！一周年》— ui.js
 * 全部 DOM 表现层：标题 / 对话框 / 立绘舞台 / 选项 / HUD / 存档读档 / 历史 / 设置 / 结局
 * 与引擎的分工：引擎管剧情推进，UI 只管呈现与输入转发。
 */
(function (root) {
  'use strict';
  const YJ = root.YJ = root.YJ || {};
  const U = YJ.util;

  const el = {};
  const spriteCache = {};
  const staged = {};          // charId -> {node, expr, act, pos}
  let typeTimer = null;
  let assetIssues = [];
  let modalStack = [];

  /* 场景 -> 氛围特效（轻量、克制） */
  const SCENE_FX = {
    street_rain: 'rain', street_night: 'nightglow', park_autumn: 'petals',
    riverside_dusk: 'bloom', riverside_night: 'nightglow', cafe_day: 'bloom',
    cafe_evening: 'bloom', room_night: 'nightglow', school_afternoon: 'bloom'
  };
  const SCENE_LABEL = {
    cafe_day: '咖啡馆 · 午后', cafe_evening: '咖啡馆 · 傍晚', street_rain: '街道 · 雨',
    street_night: '街道 · 夜', park_autumn: '公园 · 秋', school_afternoon: '校园 · 午后',
    room_night: '室内 · 夜', riverside_dusk: '河边 · 黄昏', riverside_night: '河边 · 夜'
  };

  function svgFor(charId, expr, act, outfit) {
    const k = charId + '|' + expr + '|' + act + '|' + (outfit || '');
    if (spriteCache[k]) return spriteCache[k];
    /* 位图立绘优先（assets/characters/ 里放了自己的立绘就用它），否则用程序化立绘 */
    const bitmap = YJ.sprites && YJ.sprites.resolve ? YJ.sprites.resolve(charId, expr, outfit) : null;
    spriteCache[k] = bitmap
      ? '<img class="sprite-img" src="' + bitmap + '" alt="">'
      : YJ.art.characterSVG(charId, expr, act, { outfit: outfit });
    return spriteCache[k];
  }
  /* 手部特写（牵手 / 美甲 / 递礼物）：用立绘层的同款薄片实现 */
  function handFor(kind) {
    const k = 'hand|' + kind;
    if (!spriteCache[k]) spriteCache[k] = YJ.art.handSVG(kind);
    return spriteCache[k];
  }

  /* ============================================================
   *  初始化
   * ============================================================ */
  function init() {
    el.app = U.q('#app');
    el.titleScreen = U.q('#title-screen');
    el.game = U.q('#game-screen');
    el.bgWrap = U.q('#bg-layer');
    el.fxLayer = U.q('#fx-layer');
    el.chars = U.q('#char-layer');
    el.cgLayer = U.q('#cg-layer');
    el.tintLayer = U.q('#tint-layer');
    el.chatPanel = U.q('#chat-panel');
    el.chatBody = U.q('#chat-body');
    el.chatTitle = U.q('#chat-title');
    el.chatHint = U.q('#chat-hint');
    el.chatAvatar = U.q('#chat-avatar');
    el.chatSub = U.q('#chat-sub');
    el.chatFoot = U.q('#chat-foot');
    el.chatInput = U.q('.chat-input');
    el.handLayer = U.q('#hand-layer');
    el.titleCard = U.q('#title-card');
    el.dialog = U.q('#dialog');
    el.namePlate = U.q('#name-plate');
    el.dialogKind = U.q('#dialog-kind');
    el.textEl = U.q('#dialog-text');
    el.indicator = U.q('#dialog-indicator');
    el.knockHint = U.q('#knock-hint');
    el.knockDots = U.q('#knock-dots');
    el.knockText = U.q('#knock-text');
    el.choices = U.q('#choices');
    el.hud = U.q('#hud');
    el.hudChapter = U.q('#hud-chapter');
    el.hudChapterText = U.q('#hud-chapter-text');
    el.meterAff = U.q('#meter-affection');
    el.meterTrust = U.q('#meter-trust');
    el.meterCourage = U.q('#meter-courage');
    el.btnAuto = U.q('#btn-auto');
    el.btnSkip = U.q('#btn-skip');
    el.deltaLayer = U.q('#delta-layer');
    el.toast = U.q('#toast');
    el.modals = U.q('#modal-root');
    el.backlogBody = U.q('#backlog-body');
    el.saveGrid = U.q('#save-grid');
    el.saveChapterGrid = U.q('#save-chapter-grid');
    el.saveChapterWrap = U.q('#save-chapter-wrap');
    el.saveTitle = U.q('#save-title');
    el.btnNew = U.q('#btn-new');
    el.endingScreen = U.q('#ending-screen');
    el.endingCg = U.q('#ending-cg');
    el.endingTitle = U.q('#ending-title');
    el.endingDesc = U.q('#ending-desc');
    el.endingStats = U.q('#ending-stats');

    /* 点击舞台推进（忽略 UI 元素上的点击） */
    el.game.addEventListener('click', e => {
      if (e.target.closest('.ui-interactive')) return;
      /* 敲键盘互动期间：前 2.5 秒点击只被吞掉（保证"敲键盘"的体验），
         2.5 秒内没有任何按键之后，点击也算敲一下 —— 触屏/纯鼠标玩家的兜底 */
      if (knock) { if (knock.tap && knock.left > 0) knockOnce(); return; }
      /* 告白互动期间：只有那三个按钮（或键盘 1/2/3、空格、回车）能生效，点别处一律吞掉 */
      if (confess) return;
      if (modalStack.length) return;
      if (YJ.engine.isAwaitingChoice()) return;
      YJ.engine.advance();
    });
    /* 滚轮上翻 = 历史 */
    el.game.addEventListener('wheel', e => {
      if (e.deltaY < 0 && !modalStack.length) { openBacklog(); }
    }, { passive: true });

    bindKeys();
    bindTitle();
    bindControls();
    bindSettings();
    YJ.bus.on('state:changed', () => refreshHUD());
    YJ.bus.on('state:restored', () => { resetMeterBaseline(); refreshHUD(); });
    YJ.bus.on('state:reset', () => { resetMeterBaseline(); });
    resetMeterBaseline();
    return true;
  }

  /* ============================================================
   *  键盘
   *  · 空格 / 回车 = 推进剧情（与鼠标点击完全一致的判定：转场锁定、
   *    选项等待、模态框打开时都不会被跳过）
   *  · 互动节点（interact:'knock'）期间只接受"敲击"，其余快捷键冻结
   * ============================================================ */
  function isKnockKey(e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return false;
    if (e.key === 'Enter' || e.key === ' ') return true;
    return typeof e.key === 'string' && e.key.length === 1;   /* 字母 / 数字 / 标点 / 输入法上屏 */
  }
  function bindKeys() {
    document.addEventListener('keydown', e => {
      if (e.target && /INPUT|TEXTAREA/.test(e.target.tagName)) return;
      const k = e.key;
      /* 敲键盘互动进行中：按键即"敲"（同时标记"玩家有键盘"，点击兜底就不会启动），
         其它快捷键一律不响应，避免误操作 */
      if (knock) {
        if (isKnockKey(e)) {
          e.preventDefault();
          if (!e.repeat) { knock.touched = true; knockOnce(); }
        }
        return;
      }
      /* 告白互动进行中：1 / 空格 / 回车 = 点「我喜欢你」；2 / 3 = 点那两个会躲开的按钮 */
      if (confess) {
        if (e.key === '1' || e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          if (!e.repeat) confessAppend();
        } else if (e.key === '2' || e.key === '3') {
          e.preventDefault();
          if (!e.repeat) confessDodgeByKey(+e.key);
        }
        return;
      }
      if (k === 'Escape') { e.preventDefault(); if (modalStack.length) closeModal(); else openSettings(); return; }
      if (modalStack.length) return;
      if (el.titleScreen.style.display !== 'none') return;
      if (k === ' ' || k === 'Enter') {
        e.preventDefault();
        if (e.repeat) return;                                /* 按住不放不连点 */
        if (!YJ.engine.isAwaitingChoice()) YJ.engine.advance();
      }
      else if (k === 'Control') { YJ.engine.setSkip(true); }
      else if (k === 'a' || k === 'A') { YJ.engine.toggleAuto(); }
      else if (k === 'h' || k === 'H') { openBacklog(); }
      else if (k === 's' || k === 'S') { openSave('save'); }
      else if (k === 'l' || k === 'L') { openSave('load'); }
      else if (k === 'd' || k === 'D') { setOverrideAuto(!overrideAuto); }
      else if (/^[1-9]$/.test(k)) { const b = el.choices.querySelectorAll('.choice')[+k - 1]; if (b) b.click(); }
    });
    document.addEventListener('keyup', e => { if (e.key === 'Control') YJ.engine.setSkip(false); });
  }

  /* ============================================================
   *  标题界面
   *  首页保持简洁：只有标题（名字）+ **一个**按钮。
   *  · 没有存档 → 按钮文案「开始游戏」，直接开新局
   *  · 有存档   → 按钮文案「继续」，点击后用一个确认框二选一：
   *               「继续」读最近的存档 /「重新开始」从第一章来
   *  （读档 / 设置 / 关于 都收进 HUD 与 Esc，标题上不再出现按钮）
   * ============================================================ */
  function refreshTitleButton() {
    if (!el.btnNew) return;
    const latest = YJ.save.latest();
    const label = el.btnNew.querySelector('.tb-text') || el.btnNew;
    label.textContent = latest ? '继续' : '开始游戏';
    el.btnNew.classList.toggle('has-save', !!latest);
  }
  function bindTitle() {
    U.q('#btn-new').addEventListener('click', () => {
      const latest = YJ.save.latest();
      if (!latest) { YJ.engine.newGame(); return; }
      const d = latest.d || {};
      const ch = (d.state && typeof d.state.chapter === 'number') ? d.state.chapter : 1;
      confirmBox({
        title: '继续游戏',
        message: '检测到存档（第 ' + ch + ' 章 · ' + U.fmtTime(d.savedAt) + '）。要继续上次进度吗？想从头开始就选「重新开始」。',
        ok: '继续', cancel: '重新开始',
        onOk: () => { closeModal(); YJ.engine.load(latest.slot); },
        onCancel: () => { closeModal(); YJ.engine.newGame(); }
      });
    });
  }

  let overrideAuto = false;

  /* ============================================================
   *  游戏内按钮
   * ============================================================ */
  function bindControls() {
    U.q('#btn-backlog').addEventListener('click', openBacklog);
    U.q('#btn-save').addEventListener('click', () => openSave('save'));
    U.q('#btn-load').addEventListener('click', () => openSave('load'));
    el.btnAuto.addEventListener('click', () => YJ.engine.toggleAuto());
    U.q('#btn-skip').addEventListener('click', () => YJ.engine.toggleSkip());
    U.q('#btn-config').addEventListener('click', openSettings);
    U.q('#btn-title').addEventListener('click', () => {
      confirmBox({
        title: '回到标题', message: '返回标题界面？当前进度已自动存档。',
        ok: '返回标题', cancel: '继续游戏', onOk: () => { closeModal(); YJ.engine.toTitle(); }
      });
    });
  }

  /* ============================================================
   *  画面切换
   * ============================================================ */
  function showTitle() {
    el.titleScreen.style.display = 'flex';
    el.game.style.display = 'none';
    el.endingScreen.classList.remove('show');
    el.cgLayer.classList.remove('show');
    hideChoices();
    clearKnock();
    clearConfess();
    resetMeterBaseline();
    refreshTitleButton();
  }
  function showGame() {
    el.titleScreen.style.display = 'none';
    el.endingScreen.classList.remove('show');
    el.game.style.display = 'block';
    refreshControls();
  }

  /* ---------------- 背景 ---------------- */
  function changeScene(sceneId, transition) {
    const dur = transition === 'slowfade' ? 900 : transition === 'none' ? 0 : transition === 'flash' ? 260 : 420;
    const next = document.createElement('img');
    next.className = 'bg';
    next.alt = SCENE_LABEL[sceneId] || sceneId;
    const path = 'assets/backgrounds/' + sceneId + '.svg';
    next.src = path;
    let fell = false;
    next.onerror = () => {
      if (fell) return; fell = true;
      assetIssues.push({ type: 'background', id: sceneId, path: path, fallback: '程序化渐变兜底' });
      console.warn('[YJ.ui] 背景加载失败，使用兜底：' + path);
      next.src = YJ.art.bgFallback(sceneId);
    };
    el.bgWrap.appendChild(next);
    const old = Array.prototype.slice.call(el.bgWrap.querySelectorAll('.bg')).filter(n => n !== next);
    requestAnimationFrame(() => {
      next.classList.add('in');
      old.forEach(n => n.classList.remove('in'));
    });
    setTimeout(() => { old.forEach(n => n.remove()); }, Math.max(60, dur + 60));
    applySceneFx(sceneId);
    if (transition === 'flash') flashWhite(dur);
    return dur;
  }
  function applySceneFx(sceneId) {
    const kind = SCENE_FX[sceneId];
    el.fxLayer.innerHTML = '';
    if (!kind) return;
    const wrap = document.createElement('div');
    wrap.className = 'fx fx-' + kind;
    wrap.innerHTML = YJ.art.effectSVG(kind, (sceneId.length * 7) % 11);
    el.fxLayer.appendChild(wrap);
  }
  /* 时段染色：同一张背景靠 tint 复用成白天/黄昏/夜/雨 */
  function applyTint(tint) {
    if (el.tintLayer) el.tintLayer.className = 'tint-layer' + (tint ? ' tint-' + tint : '');
    if (el.game) {
      ['day', 'dusk', 'night', 'rain'].forEach(t => el.game.classList.toggle('tintmode-' + t, t === tint));
    }
  }

  function flashWhite(ms) {
    const f = document.createElement('div');
    f.className = 'flash';
    el.fxLayer.appendChild(f);
    setTimeout(() => f.remove(), ms + 120);
  }
  function showCG(id) {
    const img = U.q('img', el.cgLayer) || (function () { const i = document.createElement('img'); el.cgLayer.appendChild(i); return i; })();
    const path = 'assets/cg/' + id + '.svg';
    let fell = false;
    img.onerror = () => {
      if (fell) return; fell = true;
      assetIssues.push({ type: 'cg', id: id, path: path, fallback: '暗色兜底' });
      console.warn('[YJ.ui] CG 加载失败：' + path);
      img.src = YJ.art.bgFallback('room_night');
    };
    img.src = path;
    img.alt = id;
    el.cgLayer.classList.add('show');
    el.game.classList.add('cg-mode');      /* 隐藏立绘层、压暗 HUD，呈现全屏 CG */
  }
  function hideCG() {
    el.cgLayer.classList.remove('show');
    el.game.classList.remove('cg-mode');
  }

  /* ---------------- 立绘舞台 ---------------- */
  function stageCast(cast, node) {
    const want = {};
    (cast || []).forEach(c => { want[c.id] = c; });
    /* 镜头：face=面部特写（整体推近）；hand=手部特写（隐藏立绘，显示手） */
    const zoom = node && node.zoom ? node.zoom : 'bust';
    el.game.classList.toggle('zoom-face', zoom === 'face');
    if (el.handLayer) {
      if (zoom === 'hand') {
        el.handLayer.innerHTML = handFor((node && node.hand) || 'hold');
        el.handLayer.classList.add('show');
        el.chars.classList.add('hidden');
      } else {
        el.handLayer.classList.remove('show');
        el.handLayer.innerHTML = '';
        el.chars.classList.remove('hidden');
      }
    }
    /* 退场 */
    Object.keys(staged).forEach(id => {
      if (!want[id]) {
        const n = staged[id].node;
        n.classList.add('leaving');
        setTimeout(() => n.remove(), 360);
        delete staged[id];
      }
    });
    /* 进场 / 更新 */
    Object.keys(want).forEach(id => {
      const c = want[id];
      const ch = YJ.characters[id];
      const expr = c.expr || ch.defaultExpr;
      const act = c.act || 'idle';
      const pos = c.pos || 'center';
      const outfit = c.outfit || ch.defaultOutfit || 'casual';
      let rec = staged[id];
      if (!rec) {
        const n = document.createElement('div');
        n.className = 'char ' + pos + ' entering';
        n.dataset.char = id;
        el.chars.appendChild(n);
        rec = staged[id] = { node: n, expr: null, act: null, outfit: null, pos: null };
        setTimeout(() => n.classList.remove('entering'), 420);
      }
      const posChanged = rec.pos !== pos;
      if (posChanged) {
        rec.node.classList.remove('left', 'center', 'right');
        rec.node.classList.add(pos);
        rec.pos = pos;
      }
      if (rec.expr !== expr || rec.act !== act || rec.outfit !== outfit) {
        if (rec.expr && rec.expr !== expr) {
          /* 表情切换：轻微淡入，保证轮廓对齐（同一画布尺寸） */
          rec.node.classList.add('expr-swap');
          setTimeout(() => rec.node.classList.remove('expr-swap'), 180);
        }
        rec.node.innerHTML = svgFor(id, expr, act, outfit);
        rec.expr = expr; rec.act = act; rec.outfit = outfit;
      }
    });
  }

  /* ---------------- 文本 ---------------- */
  function showLine(info) {
    clearInterval(typeTimer);
    el.dialog.classList.toggle('narration', info.kind === 'narrator');
    el.dialog.classList.toggle('inner', info.kind === 'inner');
    if (info.speaker) {
      el.namePlate.textContent = info.speaker;
      el.namePlate.style.color = info.color || 'var(--ink)';
      /* 新姓名样式：小色点（--name-dot）代替以前的边框与书签底色 */
      el.namePlate.style.setProperty('--name-dot', info.color || '#E8B86B');
      el.namePlate.classList.add('show');
    } else {
      el.namePlate.classList.remove('show');
    }
    el.textEl.textContent = '';
    el.dialog.classList.toggle('silent', !!info.silent || (!!info.bareChoices && !info.text));
    setChapter('第 ' + info.chapter + ' 章 · ' + (YJ.SCENE_LABEL[YJ.state.st.scene] || YJ.SCENE_LABEL[info.scene] || ''));
    /* 旁白 / 心声：给一个克制的小标签，一眼看懂这句话是谁在说
       （姓名牌里已经写了"心声"时就不再重复挂标签） */
    const kindTag = info.kind === 'narrator' ? '旁白' : info.kind === 'inner' ? '心声' : '';
    const showTag = !!kindTag && !(info.speaker && info.speaker.indexOf(kindTag) >= 0);
    if (el.dialogKind) {
      el.dialogKind.textContent = showTag ? kindTag : '';
      el.dialogKind.classList.toggle('show', showTag);
    }
    /* 互动节点：连续敲键盘（字段说明见 README「互动节点怎么写」） */
    clearKnock();
    clearConfess();
    const raw = info.node ? (YJ.story.get ? YJ.story.get(info.node) : null) : null;
    if (raw && raw.interact) startKnock(raw);
    /* 说话人高亮 / 听话人压暗 */
    Object.keys(staged).forEach(id => {
      const n = staged[id].node;
      const speaking = info.kind === id;
      n.classList.toggle('speaking', speaking);
      n.classList.toggle('listening', !!info.speaker && !speaking);
    });
    refreshHUD();
  }
  function setText(s) { el.textEl.textContent = s; }
  /* 章节 · 场景标签（HUD 顶部） */
  function setChapter(text) {
    if (el.hudChapterText) el.hudChapterText.textContent = text;
    else if (el.hudChapter) el.hudChapter.textContent = text;
  }

  /* ---------------- 聊天窗口
   * 结构契约不变： #chat-panel / #chat-head / #chat-title / #chat-hint / #chat-body
   *                .chat-row(.in/.out) / .chat-meta / .chat-who / .chat-time / .chat-bubble
   * 两套皮肤，按剧本节点的 chatStyle 分流（在面板上加修饰类，其余交给 CSS）：
   *   chatStyle:'forum' → .style-forum：朴素校园论坛帖 —— 版块标题行 / 楼主 ID + 楼层
   *                        + 时间 / 正文段落 / 回复分行；没有气泡、圆头像、在线状态、输入条
   *   无标记（与以前一致）→ .style-qq：头像 + 昵称气泡 + 输入条
   * 两种皮肤共用同一套 DOM 与 pushChat 逐条揭示逻辑；同一个人连续发言时，
   * 首条挂头像+称号、后续行缩进对齐（论坛里读起来就是"同一位楼主接着发了几段"）。
   * ------------------------------------------------------------------ */
  let lastChatFrom = null;
  let chatStyle = 'qq';        /* 当前皮肤：'qq' | 'forum' */
  let chatRoom = '';           /* 论坛版块名（style-forum 时标题显示为"版块 · 帖子标题"） */
  let chatFloor = 0;           /* 论坛楼层计数 */
  function chatInitial(name) {
    const s = String(name || '').trim();
    return s ? s.charAt(0).toUpperCase() : '·';
  }
  function chatWho(msg) {
    if (msg.name) return msg.name;
    const c = msg.from === 'ya' ? YJ.characters.ya : msg.from === 'jin' ? YJ.characters.jin : null;
    return (c && c.handle) || '对方';
  }
  /* 连续发言的分组键：from + name 一起比。
     ⚠️ 群聊里 Zhai / Qiao 都是 from:'narrator'，只比 from 会把后一个人的
     头像与昵称当成"同一人连续发言"吞掉（右下角就只剩正文）。 */
  function chatKey(msg) { return (msg.from || '') + '\u0000' + (msg.name || ''); }
  function setChatHint(more) {
    if (!el.chatHint) return;
    el.chatHint.classList.toggle('typing', !!more);
    if (chatStyle === 'forum') {
      el.chatHint.textContent = more ? '还有回复 · 点击继续 ▲' : '—— 没有更多回复了 ——';
      return;
    }
    el.chatHint.textContent = more ? '对方正在输入…' : '点击左键 / 空格 继续故事';
  }
  /* 论坛楼层号：1 楼是楼主，往后是回复（与真实论坛的编号习惯一致） */
  function floorLabel(i) { return i === 1 ? '楼主' : i + ' 楼'; }
  function openChat(list, node) {
    if (!el.chatPanel) return;
    /* 对方是谁：与左右分栏的约定一致（'ya' = 对面，其余 = 玩家自己）。
       优先取 'ya'，否则若第一句恰好是玩家说的，标题就会变成玩家自己的名字。 */
    const other = (list || []).find(m => m.from === 'ya') || (list || []).find(m => m.from === 'jin');
    const who = other && other.from === 'ya' ? YJ.characters.ya : YJ.characters.jin;
    const handle = (who && who.handle) || '私聊';
    chatStyle = (node && node.chatStyle === 'forum') ? 'forum' : 'qq';
    chatFloor = 0;
    el.chatPanel.classList.toggle('style-forum', chatStyle === 'forum');
    el.chatPanel.classList.toggle('style-qq', chatStyle === 'qq');
    const rawTitle = (node && node.chatTitle) || (handle + ' · 私聊');
    if (chatStyle === 'forum') {
      /* 标题里往往带了"学校论坛 · xxx"这样的版块前缀，拆出来单独做版块标签 */
      const parts = String(rawTitle).split('·').map(s => s.trim()).filter(Boolean);
      chatRoom = parts.length > 1 ? parts[0] : '校园论坛';
      const post = parts.length > 1 ? parts.slice(1).join(' · ') : rawTitle;
      el.chatTitle.textContent = post;
      if (el.chatAvatar) el.chatAvatar.textContent = chatRoom.slice(-2);
      if (el.chatSub) el.chatSub.textContent = chatRoom + ' · 共 ' + ((list || []).length) + ' 楼';
    } else {
      chatRoom = '';
      el.chatTitle.textContent = rawTitle;
      if (el.chatAvatar) el.chatAvatar.textContent = chatInitial(handle);
      if (el.chatSub) el.chatSub.textContent = handle + ' · 手机在线';
    }
    lastChatFrom = null;
    el.chatBody.classList.toggle('style-forum', chatStyle === 'forum');
    el.chatBody.classList.toggle('style-qq', chatStyle === 'qq');
    el.chatBody.innerHTML = '';
    const sys = document.createElement('div');
    sys.className = 'chat-sys';
    sys.textContent = chatStyle === 'forum' ? '—— 帖子内容与回复 ——' : '—— 以下为聊天记录 ——';
    el.chatBody.appendChild(sys);
    el.chatPanel.classList.add('show');
    setChatHint(true);
  }
  function pushChat(msg) {
    if (!el.chatPanel || !msg) return;
    /* 左右分栏的约定：'jin' = 玩家自己（右对齐蓝气泡），其余（'ya' 以及带
       name 的群聊成员如 Zhai / Qiao）都是对面（左对齐白气泡）。
       ⚠️ 昵称一律以 msg.name 为准（带 name 的消息不能显示成"旁白"或空）。 */
    const incoming = msg.from !== 'jin';
    const who = chatWho(msg);
    const row = document.createElement('div');
    row.className = 'chat-row ' + (incoming ? 'in' : 'out');
    /* 同一个人连续发言：头像与昵称只留一次（两种皮肤都按"分组"来读） */
    const key = chatKey(msg);
    const cont = lastChatFrom !== null && lastChatFrom === key;
    if (cont) row.classList.add('cont');
    lastChatFrom = key;
    const av = document.createElement('span');
    av.className = 'chat-av';
    av.textContent = chatInitial(who);
    const main = document.createElement('div');
    main.className = 'chat-main';
    const meta = document.createElement('div');
    meta.className = 'chat-meta';
    let whoHtml = '<span class="chat-who">' + U.esc(who) + '</span>';
    let timeHtml = '<span class="chat-time">' + U.esc(msg.time || '') + '</span>';
    if (chatStyle === 'forum') {
      /* 论坛：楼主 / 楼层 + 时间排在署名同一行，右侧挂一个小"回复"标 */
      chatFloor++;
      const isOp = chatFloor === 1;
      row.classList.toggle('forum-op', isOp);
      timeHtml = '<span class="chat-time">' + U.esc(msg.time || '') + '</span>' +
        '<span class="forum-floor">' + floorLabel(chatFloor) + '</span>';
      if (!isOp) whoHtml += '<span class="forum-tag">回复</span>';
    }
    meta.innerHTML = whoHtml + timeHtml;
    const bub = document.createElement('div');
    bub.className = 'chat-bubble';
    bub.textContent = msg.text || '';
    main.appendChild(meta);
    main.appendChild(bub);
    row.appendChild(av);
    row.appendChild(main);
    el.chatBody.appendChild(row);
    el.chatBody.scrollTop = el.chatBody.scrollHeight;
    row.classList.add('pop');
    /* 自定义互动进行中/收尾时不要再改提示行（否则会把 prompt / 收尾文案覆盖掉） */
    if (!confess) {
      const total = ((YJ.engine.state && YJ.engine.state.chat) || []).length;
      const shown = el.chatBody.querySelectorAll('.chat-row').length;
      setChatHint(shown < total);
    }
    /* 这条 chat 全部揭示完了：如果剧本带 confessGame，就直接在聊天窗口里长出互动 */
    if (!confess) maybeStartConfess();
  }
  function closeChat() {
    if (!el.chatPanel) return;
    if (confess) clearConfess();
    el.chatPanel.classList.remove('show');
    el.chatBody.innerHTML = '';
    lastChatFrom = null;
    chatFloor = 0;
    if (el.chatHint) { el.chatHint.classList.remove('typing'); el.chatHint.textContent = '点击左键，逐条查看…'; }
  }
  function setTyping(b) {
    el.dialog.classList.toggle('typing', !!b);
    /* 敲键盘互动期间，右下角留给"敲键盘"提示，不显示空格键帽 */
    el.indicator.classList.toggle('hidden', !!b || !!knock);
  }

  /* ---------------- 选项 ---------------- */
  function showChoices(list, cb) {
    el.choices.innerHTML = '';
    list.forEach((c, i) => {
      const b = document.createElement('button');
      b.className = 'choice ui-interactive';
      b.style.animationDelay = (i * 60) + 'ms';
      b.innerHTML = '<span class="choice-text">' + U.esc(c.text) + '</span>' +
        (list.length <= 9 ? '<span class="choice-key">' + (i + 1) + '</span>' : '');
      /* 选项下方的小字解释按需求隐藏（hint 仍保留在剧本数据里，便于将来复用） */
      b.addEventListener('click', ev => { ev.stopPropagation(); YJ.engine.setModal(true); cb(i); YJ.engine.setModal(false); });
      el.choices.appendChild(b);
    });
    el.choices.classList.add('show');
    el.indicator.classList.add('hidden');
  }
  function hideChoices() { el.choices.classList.remove('show'); el.choices.innerHTML = ''; }

  /* ---------------- 提示卡 / 数值提示 ---------------- */
  function showTitleCard(text) {
    el.titleCard.textContent = text;
    el.titleCard.classList.add('show');
    setTimeout(() => el.titleCard.classList.remove('show'), 1500);
  }
  function statusDelta(d) {
    const parts = [];
    if (d.affection) parts.push({ k: 'affection', v: d.affection, label: '好感' });
    if (d.trust) parts.push({ k: 'trust', v: d.trust, label: '信任' });
    if (d.courage) parts.push({ k: 'courage', v: d.courage, label: '勇气' });
    parts.forEach((p, i) => {
      const n = document.createElement('div');
      n.className = 'delta ' + (p.k === 'affection' ? 'aff' : p.k === 'trust' ? 'trust' : 'courage');
      n.style.animationDelay = (i * 120) + 'ms';
      n.appendChild(iconNode(p.k));
      const lab = document.createElement('span'); lab.className = 'd-label'; lab.textContent = p.label;
      const val = document.createElement('span'); val.className = 'd-val';
      val.textContent = (p.v > 0 ? '+' : '') + p.v;
      n.appendChild(lab); n.appendChild(val);
      el.deltaLayer.appendChild(n);
      setTimeout(() => n.remove(), 2300);
    });
    if (Math.abs(d.affection) >= 4 || Math.abs(d.trust) >= 4 || Math.abs(d.courage) >= 4) YJ.audio.sfx('sfx_heart');
    refreshHUD();
  }
  function toast(msg) {
    el.toast.textContent = msg;
    el.toast.classList.add('show');
    clearTimeout(el.toast._t);
    el.toast._t = setTimeout(() => el.toast.classList.remove('show'), 2000);
  }

  /* ============================================================
   *  数值图标：与 HUD 里那一份 SVG 同源（克隆），保证任何地方
   *  （数值浮标 / 结局统计）看到的都是同一枚图标
   * ============================================================ */
  const meterRowCache = {};
  function meterRow(key) {
    if (!meterRowCache[key]) meterRowCache[key] = el.hud.querySelector('.meter[data-key="' + key + '"]');
    return meterRowCache[key];
  }
  function iconNode(key, cls) {
    const row = meterRow(key);
    const svg = row && row.querySelector('.m-ico svg');
    const wrap = document.createElement('span');
    wrap.className = cls || 'd-icon';
    if (svg) wrap.appendChild(svg.cloneNode(true));
    return wrap;
  }

  /* ============================================================
   *  数值阈值反馈（克制版）
   *  · 只点亮刻度（.m-mark.hit）+ 让这一条自己轻轻亮一下（.meter.pop）
   *  · **不再弹任何卡片 / 浮层 / 短文案胶囊**（里程碑卡与 .m-pop 已删除）
   *  · 三条同时越过收束线时，只保留 HUD 卡片自己的三色光晕（纯 CSS 发光）
   * ============================================================ */
  const METER_DEF = {
    affection: {
      key: 70,
      tiers: [40, 55, 70]
    },
    trust: {
      key: 65,
      tiers: [40, 55, 65]
    },
    courage: {
      key: 55,
      tiers: [40, 55, 65]
    }
  };
  const lastMeter = { affection: 30, trust: 30, courage: 30 };
  let convergeShown = false;

  /* 读档 / 重开：把基线拉回当前值，避免"一读档就弹一堆提示" */
  function resetMeterBaseline() {
    const st = YJ.state.st;
    lastMeter.affection = st.affection | 0;
    lastMeter.trust = st.trust | 0;
    lastMeter.courage = st.courage | 0;
    convergeShown = !!(lastMeter.affection >= 70 && lastMeter.trust >= 65 && lastMeter.courage >= 55);
    if (el.hud) el.hud.classList.remove('converge-flash');
  }
  /* 跨过刻度：这一条自己亮一下 + 一枚轻音效。绝不创建卡片/浮层节点。 */
  function meterFlash(row, isKey) {
    if (!row) return;
    row.classList.remove('pop');
    void row.offsetWidth;                       /* 强制重排以重播动画 */
    row.classList.add('pop');
    clearTimeout(row._popT);
    row._popT = setTimeout(() => row.classList.remove('pop'), isKey ? 1500 : 1000);
    YJ.audio.sfx('sfx_heart');
  }

  /* ---------------- HUD ---------------- */
  function setVal(sel, v) { const n = U.q(sel); if (n) n.textContent = v; }
  function refreshHUD() {
    if (!el.hud) return;
    const st = YJ.state.st;
    const vals = { affection: st.affection | 0, trust: st.trust | 0, courage: st.courage | 0 };
    el.meterAff.style.width = vals.affection + '%';
    el.meterTrust.style.width = vals.trust + '%';
    if (el.meterCourage) el.meterCourage.style.width = vals.courage + '%';
    setVal('#aff-val', vals.affection);
    setVal('#trust-val', vals.trust);
    setVal('#courage-val', vals.courage);
    Object.keys(METER_DEF).forEach(k => {
      const def = METER_DEF[k], row = meterRow(k), v = vals[k];
      if (!row) return;
      row.classList.toggle('high', v >= def.key);
      /* 阈值刻度：越过的刻度点亮，一眼看出离关键档还有多远 */
      const marks = row.querySelectorAll('.m-mark');
      for (let i = 0; i < marks.length; i++) {
        marks[i].classList.toggle('hit', v >= (parseFloat(marks[i].style.left) || 0));
      }
      /* 只在"从下往上跨过"时给反馈（读档 / 重开不会误报） */
      if (v > lastMeter[k]) {
        let crossed = false;
        def.tiers.forEach(t => { if (lastMeter[k] < t && v >= t) crossed = true; });
        if (crossed) meterFlash(row, v >= def.key);
      }
      lastMeter[k] = v;
    });
    /* 收束提示：三条都达到 A 结局门槛 → 三色合一的光（纯视觉，不含剧透字幕） */
    const conv = vals.affection >= 70 && vals.trust >= 65 && vals.courage >= 55;
    el.hud.classList.toggle('converge', conv);
    if (conv && !convergeShown) {
      convergeShown = true;
      el.hud.classList.remove('converge-flash');
      void el.hud.offsetWidth;
      el.hud.classList.add('converge-flash');
      setTimeout(() => el.hud.classList.remove('converge-flash'), 2200);
    } else if (!conv) {
      convergeShown = false;
      el.hud.classList.remove('converge-flash');
    }
  }
  function refreshControls() {
    el.btnAuto.classList.toggle('on', YJ.engine.state.auto);
    el.btnSkip.classList.toggle('on', YJ.engine.state.skip);
  }

  /* ============================================================
   *  互动节点：连续敲键盘
   *  ------------------------------------------------------------
   *  剧本节点可选字段（不写 = 完全是以前的行为，向后兼容）：
   *    interact: 'knock'                     // 简写：默认敲 4 下
   *    interact: {
   *      type:  'knock',                     // 互动类型（目前实现 knock）
   *      count: 4,                           // 敲几下（1~9）
   *      hint:  '（能听见吗……敲敲键盘）',      // 对话框右下角的提示
   *      hintTap:'（听不见也没关系……点一下画面）',// 兜底一切换的提示（可选）
   *      done:  '（听见了。）',                // 解锁时的收尾提示
   *      sfx:   'sfx_page',                  // 每敲一下的音效（须在音频表里）
   *      tapAfter: 2500,                     // 多久没按键就把"点击"也算作敲（ms）
   *      autoAfter:10000                     // 多久无论如何自动解锁（ms）
   *    }
   *  三条解锁路径（互相兜底，且都走同一套收尾逻辑 → 圆点一定会亮完）：
   *    ① 键盘敲满 count 下（主路径，提示与音效不变）
   *    ② 兜底一：进入后 tapAfter 内没有任何按键 → 点击画面也算敲一下
   *    ③ 兜底二：进入后 autoAfter 无论如何自动补完并解锁
   *       —— 保证触屏 / 纯鼠标 / 键盘坏了的玩家都不会被硬卡住
   *  冻结推进用的是引擎自带的输入锁（engine.state.locked，与转场锁同一机制）
   *  并每 150ms 重申；玩家这边由本文件的 click / keydown 处理器直接拦下，
   *  根本走不到 engine.advance()。互动期间自动播放与快进临时暂停，结束后恢复
   *  （否则它们的定时器可能落在锁刷新的空隙里偷偷把剧情推过去）。
   * ============================================================ */
  const KNOCK_DEFAULT = {
    type: 'knock', count: 4, tapAfter: 2500, autoAfter: 10000,
    hint: '（能听见吗……敲敲键盘）',
    hintTap: '（听不见也没关系……点一下画面）',
    done: '（听见了。）', sfx: 'sfx_page'
  };
  let knock = null;       /* { def,left,node,tap,touched,prevAuto,prevSkip,timers[] } */
  let knockHold = null;   /* 输入锁重申计时器 */

  function readInteract(node) {
    if (!node || !node.interact) return null;
    const raw = node.interact;
    const def = Object.assign({}, KNOCK_DEFAULT, typeof raw === 'string' ? { type: raw } : raw);
    if (def.type !== 'knock') return null;                    /* 未实现的类型安全忽略 */
    def.count = Math.max(1, Math.min(9, (def.count | 0) || KNOCK_DEFAULT.count));
    def.tapAfter = Math.max(300, (def.tapAfter | 0) || KNOCK_DEFAULT.tapAfter);
    def.autoAfter = Math.max(def.tapAfter + 300, (def.autoAfter | 0) || KNOCK_DEFAULT.autoAfter);
    return def;
  }
  function knockDots() { return el.knockDots ? el.knockDots.children : []; }
  /* 点亮圆点；cascade=true 时按 90ms 依次亮起（自动兜底用的轻柔过渡） */
  function lightKnockDots(cascade) {
    const dots = knockDots();
    for (let i = 0; i < dots.length; i++) {
      if (cascade) dots[i].style.transitionDelay = (i * 90) + 'ms';
      dots[i].classList.add('hit');
    }
  }
  function startKnock(node) {
    const def = readInteract(node);
    if (!def) return false;
    const E = YJ.engine.state;
    knock = {
      def: def, left: def.count, node: node.id,
      tap: false, touched: false,
      prevAuto: !!E.auto, prevSkip: !!E.skip, timers: []
    };
    if (el.knockHint) {
      el.knockHint.classList.add('show');
      el.knockHint.classList.remove('tap', 'done');
      el.knockText.textContent = def.hint;
      el.knockDots.innerHTML = '';
      for (let i = 0; i < def.count; i++) el.knockDots.appendChild(document.createElement('i'));
    }
    el.dialog.classList.add('knocking');
    el.indicator.classList.add('hidden');
    /* 冻结推进：锁 + 每 150ms 重申（引擎自己的转场锁到点会自动放开） */
    E.locked = true;
    if (knockHold) clearInterval(knockHold);
    knockHold = setInterval(() => {
      if (knock && !modalStack.length) YJ.engine.state.locked = true;
    }, 150);
    /* 互动期间暂停自动播放 / 快进（结束后原样恢复） */
    if (E.skip) YJ.engine.setSkip(false);
    if (E.auto) YJ.engine.setAuto(false);
    /* 兜底一：tapAfter 内没有任何按键 → 点击也算敲一下 */
    knock.timers.push(setTimeout(() => {
      if (!knock || knock.touched || knock.left <= 0) return;
      knock.tap = true;
      if (el.knockHint) el.knockHint.classList.add('tap');
      if (el.knockText) el.knockText.textContent = def.hintTap || KNOCK_DEFAULT.hintTap;
    }, def.tapAfter));
    /* 兜底二：autoAfter 无论如何自动补完，任何设备都不会被卡住 */
    knock.timers.push(setTimeout(() => autoCompleteKnock(), def.autoAfter));
    return true;
  }
  /* 敲一下：音效 + 提示点 + 对话框轻震 + 屏幕暖光一闪 */
  function knockOnce() {
    if (!knock || knock.left <= 0) return false;
    const dots = knockDots();
    const idx = knock.def.count - knock.left;
    if (dots[idx]) dots[idx].classList.add('hit');
    knock.left--;
    YJ.audio.sfx(knock.def.sfx || 'sfx_page');
    el.dialog.classList.remove('knock-shake');
    void el.dialog.offsetWidth;
    el.dialog.classList.add('knock-shake');
    el.game.classList.remove('knock-flash');
    void el.game.offsetWidth;
    el.game.classList.add('knock-flash');
    if (knock.left <= 0) finishKnock();
    return true;
  }
  /* 兜底二：把剩下的圆点按 90ms 依次点亮，再走统一收尾（不是啪一下跳过去） */
  function autoCompleteKnock() {
    if (!knock || knock.left <= 0) return false;
    knock.left = 0;
    lightKnockDots(true);
    finishKnock(760);
    return true;
  }
  /* 统一的收尾：圆点全亮 + done 文案 + 提示音 + 短暂停留后解锁 */
  function finishKnock(hold) {
    const def = knock ? knock.def : KNOCK_DEFAULT;
    if (knock) knock.left = 0;
    lightKnockDots(false);
    if (el.knockHint) el.knockHint.classList.add('done');
    if (el.knockText) el.knockText.textContent = def.done || KNOCK_DEFAULT.done;
    el.dialog.classList.remove('knocking');
    el.dialog.classList.add('knock-done');
    YJ.audio.sfx('sfx_ding');
    setTimeout(() => clearKnock(), hold || 520);
  }
  /* 结束互动：清状态、还原界面、把输入锁交还给引擎（next 节点会重新加锁） */
  function clearKnock() {
    if (knockHold) { clearInterval(knockHold); knockHold = null; }
    const was = knock;
    knock = null;
    if (was) {
      was.timers.forEach(t => clearTimeout(t));
      YJ.engine.state.locked = false;
      /* 原样恢复自动/快进（直接改标记，避免 setSkip(true) 立刻把剧情推走） */
      if (was.prevSkip !== YJ.engine.state.skip) { YJ.engine.state.skip = was.prevSkip; }
      if (was.prevAuto) YJ.engine.setAuto(true);
      else refreshControls();
    }
    if (el.knockHint) el.knockHint.classList.remove('show', 'tap', 'done');
    if (el.knockDots) el.knockDots.innerHTML = '';
    if (el.dialog) el.dialog.classList.remove('knocking', 'knock-shake', 'knock-done');
    if (el.game) el.game.classList.remove('knock-flash');
    if (was && !YJ.engine.isAwaitingChoice() && !YJ.engine.isTyping()) el.indicator.classList.remove('hidden');
  }

  /* ============================================================
   *  自定义互动：告白小游戏（剧本字段 confessGame）
   *  ------------------------------------------------------------
   *  挂在"同时是 chat 节点"的剧情上（chapter3 的 c3_confess_game）：
   *  23 条聊天按原样逐条揭示，最后一条揭示完之后**不再出现"点击继续"**，
   *  而是在这条聊天窗口里长出互动：
   *    · 一条属于 **Cockatiel.（她）** 的消息（左对齐白气泡、她的头像与昵称），
   *      初始就是 word，每点一次就地追加一个 —— 点满之后黑屏过去，窗口里
   *      剩下的 reveal 那条也是她发的（同一个 from:'ya'），前后视觉连贯
   *    · 三个按钮：「我喜欢你」/「好吧，那我下次再说」/「我讨厌你」
   *      —— 这三个仍然属于玩家（羊羊金）的选择；后两个会躲开指针，
   *      永远选不中；躲满 dart.count 次后淡出消失
   *    · 攒够 target 个 → 画面变暗 blackout 毫秒 → 聊天窗口重新出现并显示
   *      reveal 那条消息 + sfx → 解锁，正常推进到 next
   *
   *  剧本字段（形状固定，缺字段一律安全降级）；
   *    confessGame: {
   *      prompt  : '她的头像一直亮着。',  // 互动上方的提示小字
   *      word    : '我喜欢你',            // 每次追加的词
   *      target  : 15,                    // 攒够多少个（1~60）
   *      dart    : { count: 3 },          // 两个"躲开"按钮合计躲几次后消失（0/省略 = 直接不出现）
   *      blackout: 2600,                  // 攒够后变暗的毫秒数（淡入+停留+淡出合计）
   *      sfx     : 'sfx_ding',            // reveal 出现时的音效
   *      reveal  : { from,time,text }     // 黑屏后重新显示的那条消息（缺省 = word×target）
   *    }
   *  锁定方式与 interact:'knock' 完全一致（引擎输入锁 + 150ms 重申 + 暂停自动/快进）。
   *  兜底：鼠标/触屏点击、键盘 1/空格/回车 追加（2/3 等价于点那两个躲开的按钮）、
   *        45 秒没有新的成功操作就自动补满（绝不会卡死）。
   * ============================================================ */
  const CONFESS_DEFAULT = { blackout: 2600, sfx: 'sfx_ding', autoAfter: 45000, dartCount: 3 };
  let confess = null;      /* { def,count,dodges,done,row,bubble,countEl,actions,btns[],timers[],prevAuto,prevSkip } */
  let confessHold = null;  /* 输入锁重申计时器 */

  function readConfess(node) {
    const raw = node && node.confessGame;
    if (!raw || typeof raw !== 'object') return null;
    const word = typeof raw.word === 'string' ? raw.word : '';
    if (!word) return null;                                  /* 没有 word 就没法玩 → 当普通 chat 节点 */
    const dart = (raw.dart && typeof raw.dart === 'object') ? raw.dart : {};
    const rv = (raw.reveal && typeof raw.reveal === 'object') ? raw.reveal : {};
    const target = Math.max(1, Math.min(60, (raw.target | 0) || 1));
    /* initial：气泡里一开始就有几个 word（默认 1，符合"起始内容就是 word"）。
       设 0 则起始为空、每次点击 1:1 对应一个 word（验收里"点 3 次 = ×3"的写法）。 */
    const initial = Math.max(0, Math.min(target - 1, raw.initial == null ? 1 : (raw.initial | 0)));
    return {
      prompt: typeof raw.prompt === 'string' ? raw.prompt : '',
      word: word,
      target: target,
      initial: initial,
      dartCount: Math.max(0, Math.min(9, (dart.count == null ? CONFESS_DEFAULT.dartCount : dart.count) | 0)),
      blackout: Math.max(600, Math.min(6000, (raw.blackout | 0) || CONFESS_DEFAULT.blackout)),
      sfx: typeof raw.sfx === 'string' ? raw.sfx : CONFESS_DEFAULT.sfx,
      autoAfter: Math.max(1500, (raw.autoAfter | 0) || CONFESS_DEFAULT.autoAfter),
      reveal: {
        from: rv.from || 'ya',
        time: rv.time || '',
        text: (typeof rv.text === 'string' && rv.text) ? rv.text : word.repeat(target)
      }
    };
  }
  /* 这一条 chat 是否已经全部揭示完 */
  function chatFullyRevealed() {
    const total = ((YJ.engine.state && YJ.engine.state.chat) || []).length;
    if (!total) return false;
    return el.chatBody.querySelectorAll('.chat-row').length >= total;
  }
  function maybeStartConfess() {
    const node = YJ.engine.node;
    const def = readConfess(node);
    if (!def) return false;
    if (!chatFullyRevealed()) return false;
    return startConfess(def);
  }

  function startConfess(def) {
    const E = YJ.engine.state;
    confess = {
      def: def, count: def.initial, dodges: 0, done: false,
      row: null, bubble: null, countEl: null, actions: null, btns: [], darts: [],
      timers: [], lastHover: 0,
      prevAuto: !!E.auto, prevSkip: !!E.skip
    };
    /* 互动 UI 一律放进聊天面板的「固定页脚」（输入条上方），不随消息区滚动，
       所以不管 23 条聊天滚到哪里、面板多矮，气泡和按钮都看得见。 */
    const bar = document.createElement('div');
    bar.className = 'confess-bar';
    /* 提示小字：只在这里出现一次（页脚状态行另给一句不同的动作提示） */
    if (def.prompt) {
      const p = document.createElement('div');
      p.className = 'confess-prompt';
      p.textContent = def.prompt;
      bar.appendChild(p);
    }
    /* 那条会越点越长的消息：用 Cockatiel.（她）的身份渲染 —— 左对齐、白气泡、
       她的头像圆牌与昵称。reveal 的 from 也是 'ya'，所以黑屏后是同一条消息的延续。
       三个按钮与计数仍属于玩家（羊羊金）的选择，只是排在气泡下面。 */
    const row = document.createElement('div');
    row.className = 'chat-row in confess-row';
    const av = document.createElement('span');
    av.className = 'chat-av';
    const who = chatWho({ from: 'ya' });
    av.textContent = chatInitial(who);
    const main = document.createElement('div');
    main.className = 'chat-main';
    const meta = document.createElement('div');
    meta.className = 'chat-meta';
    meta.innerHTML = '<span class="chat-who">' + U.esc(who) + '</span><span class="chat-time"></span>';
    const bub = document.createElement('div');
    bub.className = 'chat-bubble';
    bub.textContent = def.word.repeat(def.initial);
    main.appendChild(meta); main.appendChild(bub);
    row.appendChild(av); row.appendChild(main);
    bar.appendChild(row);
    /* 计数 + 三个按钮 */
    const acts = document.createElement('div');
    acts.className = 'confess-actions';
    const cnt = document.createElement('span');
    cnt.className = 'confess-count';
    acts.appendChild(cnt);
    const say = confessButton('我喜欢你', 'say');
    /* pointerdown 立刻计数（触屏/鼠标都跟手），紧跟其后的那次 click 只吃掉一次，
       避免"一次点击算两下"；不吃时间窗，所以快速连点不会丢。 */
    say.addEventListener('pointerdown', e => {
      e.preventDefault(); e.stopPropagation();
      sayPointerPending = true;
      confessAppend();
    });
    say.addEventListener('pointerup', () => {
      /* click 在本轮任务结束后才可能来，先记着；没来就清掉，避免吃掉下一次键盘/程序触发 */
      setTimeout(() => { sayPointerPending = false; }, 0);
    });
    say.addEventListener('click', e => {
      e.stopPropagation();
      if (sayPointerPending) { sayPointerPending = false; return; }
      confessAppend();
    });
    acts.appendChild(say);
    const labels = ['好吧，那我下次再说', '我讨厌你'];
    labels.forEach(txt => {
      if (def.dartCount <= 0) return;                        /* 不躲 = 直接不出现 */
      const b = confessButton(txt, 'dodge');
      b.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); confessDodge(b, true); });
      b.addEventListener('click', e => { e.stopPropagation(); confessDodge(b, true); });
      b.addEventListener('pointerenter', () => { b.classList.add('armed'); });
      b.addEventListener('pointerleave', () => { b.classList.remove('armed'); });
      acts.appendChild(b);
      confess.darts.push(b);
    });
    bar.appendChild(acts);
    /* 插到输入条上方（找不到页脚就退回消息区，保证任何情况下都不会"看不见"） */
    if (el.chatFoot) {
      el.chatFoot.insertBefore(bar, el.chatInput || el.chatFoot.querySelector('.chat-input') || null);
    } else {
      el.chatBody.appendChild(bar);
    }
    confess.bar = bar;
    confess.row = row; confess.bubble = bub; confess.countEl = cnt;
    confess.actions = acts; confess.btns = [say].concat(confess.darts);
    lastChatFrom = chatKey({ from: 'ya' });
    updateConfessCount();
    /* 页脚状态行给一句"动作提示"（与剧本 prompt 不是同一句，避免看起来重复两遍） */
    if (el.chatHint) {
      el.chatHint.classList.remove('typing');
      el.chatHint.textContent = '点「我喜欢你」';
    }
    /* 锁：引擎输入锁 + 每 150ms 重申；期间暂停自动/快进（与 knock 同一套） */
    E.locked = true;
    if (confessHold) clearInterval(confessHold);
    confessHold = setInterval(() => {
      if (confess && !modalStack.length) YJ.engine.state.locked = true;
    }, 150);
    if (E.skip) YJ.engine.setSkip(false);
    if (E.auto) YJ.engine.setAuto(false);
    el.chatPanel.addEventListener('pointermove', onConfessHover);
    armConfessIdle();
    return true;
  }
  let sayPointerPending = false;   /* pointerdown 之后紧跟的那一次 click 不要重复计数 */
  function confessButton(text, cls) {
    const b = document.createElement('button');
    b.className = 'confess-btn ' + cls;
    b.type = 'button';
    b.textContent = text;
    return b;
  }
  function updateConfessCount() {
    if (confess && confess.countEl) confess.countEl.textContent = confess.count + ' / ' + confess.def.target;
  }
  /* 45 秒没有新的成功操作 → 自动补满（每次成功点击都会重置） */
  function armConfessIdle() {
    if (!confess) return;
    if (confess.idleTimer) clearTimeout(confess.idleTimer);
    confess.idleTimer = setTimeout(() => {
      if (!confess || confess.done) return;
      confess.count = confess.def.target;
      renderConfessWord();
      updateConfessCount();
      confessFinish();
    }, confess.def.autoAfter);
  }
  function renderConfessWord() {
    if (!confess || !confess.bubble) return;
    /* 气泡在固定页脚里，不用再滚动消息区 */
    confess.bubble.textContent = confess.def.word.repeat(confess.count);
  }
  /* 点「我喜欢你」：追加一个词 + 轻音效 + 弹跳 + 计数 +1 */
  function confessAppend() {
    if (!confess || confess.done) return false;
    if (confess.count >= confess.def.target) return false;
    confess.count++;
    renderConfessWord();
    updateConfessCount();
    YJ.audio.sfx('sfx_click');
    const row = confess.row;
    if (row) {
      row.classList.remove('confess-bump');
      void row.offsetWidth;
      row.classList.add('confess-bump');
    }
    armConfessIdle();
    if (confess.count >= confess.def.target) confessFinish();
    return true;
  }
  /* 两个"躲开"按钮：指针靠近/被点到都算躲一次，躲满就淡出消失，永远选不中 */
  function confessDodge(btn, force, pointer) {
    if (!confess || confess.done) return false;
    let b = btn;
    if (!b || b.classList.contains('gone')) {
      b = confess.darts.filter(x => !x.classList.contains('gone'))[0];
    }
    if (!b) return false;
    const now = Date.now();
    if (!force && now - confess.lastHover < 40) return false;   /* 节流，避免一次掠过算多次 */
    confess.lastHover = now;
    const r = (b.getBoundingClientRect && b.getBoundingClientRect()) || {};
    const w = r.width || 64, h = r.height || 28;   /* 没有布局引擎时（jsdom）给个默认盒，逻辑照样可测 */
    const cx = (r.left || 0) + w / 2, cy = (r.top || 0) + h / 2;
    const px = pointer && typeof pointer.x === 'number' ? pointer.x : cx - w;
    const py = pointer && typeof pointer.y === 'number' ? pointer.y : cy;
    /* 往"远离指针"的方向跳，带一点随机与旋转，看起来像被烫到 */
    const dirX = px <= cx ? 1 : -1;
    const dirY = py <= cy ? 1 : -1;
    const dx = dirX * (w * (0.5 + Math.random() * 1.1)) + (Math.random() * 2 - 1) * w * 0.3;
    const dy = dirY * (h * (0.6 + Math.random() * 1.4)) + (Math.random() * 2 - 1) * h * 0.5;
    b.style.transform = 'translate(' + Math.round(dx) + 'px,' + Math.round(dy) + 'px) rotate(' +
      (Math.random() * 8 - 4).toFixed(1) + 'deg)';
    YJ.audio.sfx('sfx_page');
    confess.dodges++;
    if (confess.dodges >= confess.def.dartCount) {
      confess.darts.forEach(d => {
        d.classList.remove('armed');
        d.classList.add('gone');
        d.disabled = true;
        d.style.pointerEvents = 'none';          /* 双保险：即使 CSS 没生效也点不到 */
      });
    }
    return true;
  }
  /* 键盘 2 / 3 等价于点那两个躲开的按钮（同样只算"躲开"，绝不当成选择） */
  function confessDodgeByKey(n) {
    if (!confess || confess.done) return false;
    const idx = n === 3 ? 1 : 0;
    const b = confess.darts[idx] || confess.darts.filter(x => !x.classList.contains('gone'))[0];
    return confessDodge(b, true);
  }
  /* 指针只要靠近就躲（在聊天面板上监听 pointermove，节流 40ms） */
  function onConfessHover(e) {
    if (!confess || confess.done) return;
    const now = Date.now();
    if (now - confess.lastHover < 40) return;
    confess.darts.forEach(b => {
      if (b.classList.contains('gone')) return;
      const r = b.getBoundingClientRect();
      const w = r.width || 64, h = r.height || 28;
      const cx = (r.left || 0) + w / 2, cy = (r.top || 0) + h / 2;
      const d = Math.hypot(e.clientX - cx, e.clientY - cy);
      if (d < w * 0.85 + 24) confessDodge(b, false, { x: e.clientX, y: e.clientY });
    });
  }
  /* 攒够 target：玩家消息完成 → 变暗 → 换内容 + reveal + sfx → 淡出 → 解锁 */
  function confessFinish() {
    if (!confess || confess.done) return false;
    confess.done = true;
    if (confess.idleTimer) { clearTimeout(confess.idleTimer); confess.idleTimer = null; }
    renderConfessWord();
    updateConfessCount();
    confessoDisableButtons();
    YJ.audio.sfx('sfx_heart');
    const bd = confess.def.blackout;
    const fadeIn = Math.round(bd * 0.26), hold = Math.round(bd * 0.46), fadeOut = Math.max(120, bd - fadeIn - hold);
    showConfessBlackout(fadeIn);
    /* 全黑的时候换内容：清掉互动痕迹，换上 reveal 那条消息 */
    setTimeout(() => { if (confess) confessReveal(); }, fadeIn + Math.round(hold * 0.3));
    setTimeout(() => { hideConfessBlackout(fadeOut); }, fadeIn + hold);
    /* 淡出之后再解锁，玩家点一下就能正常推进到 next */
    setTimeout(() => { clearConfess(); }, bd + 320);
    return true;
  }
  function confessoDisableButtons() {
    if (!confess) return;
    confess.btns.forEach(b => { b.disabled = true; b.style.pointerEvents = 'none'; });
    if (confess.actions) confess.actions.classList.add('done');
  }
  function confessReveal() {
    const def = confess.def, rv = def.reveal;
    removeConfessNodes();                       /* 撤掉固定页脚里的互动 UI */
    el.chatBody.innerHTML = '';                 /* 消息区只留她那句（黑屏后再亮起来看到的就是它） */
    lastChatFrom = null;
    pushChat({ from: rv.from, time: rv.time, text: rv.text });
    YJ.audio.sfx(def.sfx);
    if (el.chatHint) {
      el.chatHint.classList.remove('typing');
      el.chatHint.textContent = '点击左键 / 空格 继续故事';
    }
  }
  /* 移除互动 DOM（页脚 + 万一退回消息区的残留） */
  function removeConfessNodes() {
    [el.chatFoot, el.chatBody].forEach(host => {
      if (!host) return;
      Array.prototype.slice.call(host.querySelectorAll('.confess-bar, .confess-prompt, .confess-actions, .confess-row'))
        .forEach(n => n.remove());
    });
  }
  function confessBlackoutNode() {
    if (!el.confessBlackout) {
      const n = document.createElement('div');
      n.className = 'confess-blackout';
      (el.game || document.body).appendChild(n);
      el.confessBlackout = n;
    }
    return el.confessBlackout;
  }
  function showConfessBlackout(fadeIn) {
    const n = confessBlackoutNode();
    n.style.transition = 'opacity ' + fadeIn + 'ms ease';
    void n.offsetWidth;                         /* 强制重排，保证过渡真的跑起来 */
    n.classList.add('show');
  }
  function hideConfessBlackout(fadeOut) {
    if (!el.confessBlackout) return;
    el.confessBlackout.style.transition = 'opacity ' + fadeOut + 'ms ease';
    el.confessBlackout.classList.remove('show');
  }
  /* 清理互动：停锁、停计时、移除互动 DOM（已经换上的 reveal 行保留）、收起黑屏 */
  function clearConfess() {
    if (confessHold) { clearInterval(confessHold); confessHold = null; }
    const was = confess;
    confess = null;
    if (was) {
      was.timers.forEach(t => clearTimeout(t));
      if (was.idleTimer) clearTimeout(was.idleTimer);
      el.chatPanel.removeEventListener('pointermove', onConfessHover);
      YJ.engine.state.locked = false;
      if (was.prevSkip !== YJ.engine.state.skip) YJ.engine.state.skip = was.prevSkip;
      if (was.prevAuto) YJ.engine.setAuto(true);
      else refreshControls();
    }
    removeConfessNodes();
    if (el.confessBlackout) el.confessBlackout.classList.remove('show');
  }

  /* ============================================================
   *  模态框基础设施
   * ============================================================ */
  function makeModal(id, cls) {
    const wrap = document.createElement('div');
    wrap.className = 'modal ui-interactive ' + (cls || '');
    wrap.id = id;
    wrap.innerHTML = '<div class="modal-box"></div>';
    el.modals.appendChild(wrap);
    return wrap;
  }
  function openModal(node) {
    node.classList.add('show');
    modalStack.push(node);
    YJ.engine.setModal(true);
  }
  function closeModal() {
    const n = modalStack.pop();
    if (n) n.classList.remove('show');
    if (!modalStack.length) YJ.engine.setModal(false);
  }
  function closeAllModals() { while (modalStack.length) closeModal(); }

  /* ---------------- 历史回看 ---------------- */
  function openBacklog() {
    const h = YJ.state.st.history;
    el.backlogBody.innerHTML = h.length
      ? h.map(x => '<div class="log-row"><span class="log-spk">' + U.esc(x.speaker || '旁白') + '</span><span class="log-txt">' + U.esc(x.text) + '</span></div>').join('')
      : '<div class="log-empty">还没有对话记录。</div>';
    openModal(el.backlogModal);
    el.backlogBody.scrollTop = el.backlogBody.scrollHeight;
  }

  /* ---------------- 存档 / 读档 ---------------- */
  function openSave(mode) {
    el.saveTitle.textContent = mode === 'save' ? '保存进度' : '读取进度';
    renderSlots(mode);
    openModal(el.saveModal);
  }
  function renderSlots(mode) {
    const slots = YJ.save.list().concat([{ slot: 'quick', kind: 'quick', data: YJ.save.peek('quick') }]);
    el.saveGrid.innerHTML = '';
    slots.forEach(s => {
      const d = s.data;
      const b = document.createElement('div');
      b.className = 'slot' + (d ? '' : ' empty') + (s.slot === 'auto' ? ' auto' : '');
      const name = s.slot === 'auto' ? '自动存档' : s.slot === 'quick' ? '快速存档' : ('存档 ' + s.slot);
      b.innerHTML =
        '<div class="slot-head"><span class="slot-name">' + name + '</span>' +
        (d ? '<span class="slot-time">' + U.fmtTime(d.savedAt) + '</span>' : '<span class="slot-time">空</span>') + '</div>' +
        (d
          ? '<div class="slot-chapter">第 ' + (d.state && d.state.chapter ? d.state.chapter : 1) + ' 章</div>' +
            '<div class="slot-text">' + U.esc(U.cut(d.nodeText || '', 46)) + '</div>' +
            '<div class="slot-meta">♥ ' + (d.state ? d.state.affection : '-') + ' · ✦ ' + (d.state ? d.state.trust : '-') + '</div>'
          : '<div class="slot-empty">— 空槽位 —</div>');
      b.addEventListener('click', ev => {
        if (ev.target.closest('.slot-del')) return;
        if (mode === 'save') {
          if (s.slot === 'auto') { toast('自动存档由系统维护'); return; }
          YJ.save.saveTo(s.slot);
          YJ.audio.sfx('sfx_bell');
          toast('已保存到 ' + name);
          renderSlots(mode);
        } else {
          if (!d) { toast('这个槽位是空的'); return; }
          closeModal();
          if (!YJ.engine.load(s.slot)) toast('读取失败');
        }
      });
      if (d && s.slot !== 'auto') {
        const del = document.createElement('button');
        del.className = 'slot-del';
        del.textContent = '删除';
        del.addEventListener('click', ev => {
          ev.stopPropagation();
          YJ.save.deleteSlot(s.slot);
          renderSlots(mode);
          toast('已删除 ' + name);
        });
        b.appendChild(del);
      }
      el.saveGrid.appendChild(b);
    });
    renderChapterSlots(mode);
  }
  /* ⑤ 章节自动存档：单独一栏显示（与手动存档区分），只能读，手动存档不能覆盖它。
     注意：这些条目渲染在 #save-chapter-grid，不进 #save-grid —— 
     手动槽位数量（自动 + 6 手动 + 快速 = 8）保持不变。 */
  function renderChapterSlots(mode) {
    const grid = el.saveChapterGrid;
    if (!grid) return;
    const list = YJ.save.chapters();
    if (el.saveChapterWrap) el.saveChapterWrap.style.display = (list.length || mode === 'load') ? '' : 'none';
    grid.innerHTML = '';
    if (!list.length) {
      const tip = document.createElement('div');
      tip.className = 'slot-group-empty';
      tip.textContent = mode === 'load'
        ? '还没有章节自动存档 —— 每进入新的一章会自动记录该章开头。'
        : '章节自动存档由系统维护：每进入新的一章自动记录一份，手动存档不会覆盖它们。';
      grid.appendChild(tip);
      return;
    }
    list.forEach(s => {
      const d = s.data;
      const b = document.createElement('div');
      b.className = 'slot chapter-slot';
      b.title = '章节开头自动存档 · ' + U.fmtTime(d.savedAt);
      b.innerHTML =
        '<div class="slot-head"><span class="slot-name">' + U.esc(s.label) + '<i class="slot-auto-tag">自动</i></span>' +
        '<span class="slot-time">' + U.fmtTime(d.savedAt) + '</span></div>' +
        '<div class="slot-text">' + U.esc(U.cut(d.nodeText || '', 34)) + '</div>';
      b.addEventListener('click', () => {
        if (mode === 'save') { toast('章节自动存档不可覆盖'); return; }
        closeModal();
        if (!YJ.engine.load(s.slot)) toast('读取失败');
      });
      grid.appendChild(b);
    });
  }

  /* ---------------- 设置 ---------------- */
  function bindSettings() {
    const s = el.settingsModal;
    U.q('#set-speed', s).addEventListener('input', e => {
      const v = +e.target.value;
      YJ.save.setSetting('textSpeed', v);
      U.q('#set-speed-val', s).textContent = v + ' ms/字';
    });
    U.q('#set-speed', s).addEventListener('change', () => YJ.audio.sfx('sfx_click'));
    U.q('#set-typewriter', s).addEventListener('change', e => {
      YJ.save.setSetting('typewriter', e.target.checked);
      if (!e.target.checked && YJ.engine.isTyping()) YJ.engine.completeText();
    });
    U.q('#set-auto', s).addEventListener('input', e => {
      const v = +e.target.value;
      YJ.save.setSetting('autoDelay', v);
      U.q('#set-auto-val', s).textContent = (v / 1000).toFixed(1) + ' 秒';
    });
    U.q('#set-bgm', s).addEventListener('change', e => {
      YJ.save.setSetting('bgmOn', e.target.checked); YJ.audio.refresh();
    });
    U.q('#set-sfx', s).addEventListener('change', e => {
      YJ.save.setSetting('sfxOn', e.target.checked); YJ.audio.refresh(); YJ.audio.sfx('sfx_click');
    });
    U.q('#set-bgmvol', s).addEventListener('input', e => {
      YJ.save.setSetting('bgmVol', +e.target.value / 100); YJ.audio.applyVolumes();
      U.q('#set-bgmvol-val', s).textContent = e.target.value + '%';
    });
    U.q('#set-sfxvol', s).addEventListener('input', e => {
      YJ.save.setSetting('sfxVol', +e.target.value / 100); YJ.audio.applyVolumes();
      U.q('#set-sfxvol-val', s).textContent = e.target.value + '%';
    });
    U.q('#set-skipunread', s).addEventListener('change', e => YJ.save.setSetting('skipUnread', e.target.checked));
    U.q('#set-wipe', s).addEventListener('click', () => {
      confirmBox({
        title: '清除全部数据', message: '将删除所有存档、设置与已读记录，且无法恢复。确定继续吗？',
        ok: '全部删除', danger: true, onOk: () => { YJ.save.wipeAll(); closeAllModals(); YJ.engine.toTitle(); toast('数据已清除'); }
      });
    });
    U.q('#set-close', s).addEventListener('click', closeModal);
    /* 首页不再有「关于」按钮：入口挪到设置里（关于框是叠在设置上的模态，关掉后回到设置） */
    U.q('#set-about', s).addEventListener('click', openAbout);
  }
  function openSettings() {
    const s = YJ.save.settings;
    U.q('#set-speed', el.settingsModal).value = s.textSpeed;
    U.q('#set-speed-val', el.settingsModal).textContent = s.textSpeed + ' ms/字';
    U.q('#set-typewriter', el.settingsModal).checked = !!s.typewriter;
    U.q('#set-auto', el.settingsModal).value = s.autoDelay;
    U.q('#set-auto-val', el.settingsModal).textContent = (s.autoDelay / 1000).toFixed(1) + ' 秒';
    U.q('#set-bgm', el.settingsModal).checked = !!s.bgmOn;
    U.q('#set-sfx', el.settingsModal).checked = !!s.sfxOn;
    U.q('#set-bgmvol', el.settingsModal).value = Math.round((s.bgmVol || 0) * 100);
    U.q('#set-bgmvol-val', el.settingsModal).textContent = Math.round((s.bgmVol || 0) * 100) + '%';
    U.q('#set-sfxvol', el.settingsModal).value = Math.round((s.sfxVol || 0) * 100);
    U.q('#set-sfxvol-val', el.settingsModal).textContent = Math.round((s.sfxVol || 0) * 100) + '%';
    U.q('#set-skipunread', el.settingsModal).checked = !!s.skipUnread;
    openModal(el.settingsModal);
  }

  /* ---------------- 关于 / 素材说明 ---------------- */
  function openAbout() {
    const body = U.q('#about-body', el.aboutModal);
    const m = YJ.manifest || { assets: [] };
    const bgCount = (m.assets || []).filter(a => a.type === 'background').length;
    const cgCount = (m.assets || []).filter(a => a.type === 'cg').length;
    body.innerHTML =
      '<p>《你好！一周年》是一个可在浏览器直接游玩的视觉小说原型。</p>' +
      '<p><b>真实可用的素材：</b>' + bgCount + ' 张手绘矢量背景（SVG）、' + cgCount + ' 张场景 CG（由背景与立绘合成）、' +
      '两位角色的 16 种表情立绘（程序化矢量绘制，透明背景、同一 720×1080 画布，切换表情天然对齐）。</p>' +
      '<p><b>音频：</b>BGM 与环境音由 WebAudio 实时合成（非采样文件），可在设置中关闭。</p>' +
      '<p><b>待补充素材：</b>本作未使用任何 AI 生成位图；若后续要替换为手绘/AI 成品，请按 <code>assets/manifest.json</code> 的 ' +
      '<code>replaceHint</code> 字段放置同名文件即可，引擎会自动按新尺寸居中显示。详细清单与生成提示词见该文件与 README。</p>' +
      (assetIssues.length ? '<p class="warn">本次运行有 ' + assetIssues.length + ' 个资源加载失败（已使用兜底图形）。</p>' : '');
    openModal(el.aboutModal);
  }

  /* ---------------- 通用确认框 ---------------- */
  function confirmBox(opts) {
    const box = el.confirmModal;
    U.q('#cf-title', box).textContent = opts.title || '确认';
    U.q('#cf-msg', box).textContent = opts.message || '';
    const ok = U.q('#cf-ok', box), cancel = U.q('#cf-cancel', box);
    ok.textContent = opts.ok || '确定';
    cancel.textContent = opts.cancel || '取消';
    ok.className = 'btn' + (opts.danger ? ' danger' : '');
    const onOk = opts.onOk || (() => closeModal());
    const onCancel = opts.onCancel || (() => closeModal());
    ok.onclick = () => { ok.onclick = null; cancel.onclick = null; onOk(); };
    cancel.onclick = () => { ok.onclick = null; cancel.onclick = null; onCancel(); };
    openModal(box);
  }

  /* ---------------- 结局画面 ---------------- */
  function showEnding(data) {
    el.game.style.display = 'none';
    el.titleScreen.style.display = 'none';
    el.endingScreen.classList.add('show');
    const path = data.cg ? 'assets/cg/' + data.cg + '.svg' : null;
    let fell = false;
    el.endingCg.onerror = () => {
      if (fell) return; fell = true;
      assetIssues.push({ type: 'cg', id: data.cg, path: path, fallback: '兜底渐变' });
      el.endingCg.src = YJ.art.bgFallback('riverside_night');
    };
    el.endingCg.src = path || YJ.art.bgFallback('riverside_night');
    el.endingTitle.textContent = data.title;
    el.endingDesc.textContent = data.desc || '';
    const ended = ['end_star', 'end_slow', 'end_she_first'].filter(f => data.flags.indexOf(f) >= 0).length;
    /* 结局页只呈现「结局标题 + 结局 CG」：好感 / 信任 / 勇气 的统计块整体隐藏
       （#ending-stats 在 index.html 里 display:none）。DOM 仍然保留并照旧写入 ——
       既有验收测试 D7 会读它的 innerHTML，所以不删除，只不显示。 */
    const stats = [
      { k: 'affection', cls: 'aff', label: '好感', v: data.affection },
      { k: 'trust', cls: 'trust', label: '信任', v: data.trust },
      { k: 'courage', cls: 'courage', label: '勇气', v: (data.courage != null ? data.courage : '—') },
      { k: null, cls: '', label: '本局关键标记', v: data.flags.length },
      { k: null, cls: '', label: '已抵达结局', v: ended + ' / 3' }
    ];
    el.endingStats.innerHTML = '';
    stats.forEach(s => {
      const box = document.createElement('div');
      box.className = 'es-item' + (s.cls ? ' ' + s.cls : '');
      if (s.k) box.appendChild(iconNode(s.k, 'es-ico'));
      const cap = document.createElement('span');
      cap.textContent = s.label;
      const b = document.createElement('b');
      b.textContent = s.v;
      box.appendChild(cap);
      box.appendChild(b);
      el.endingStats.appendChild(box);
    });
    U.q('#btn-ending-title').onclick = () => { el.endingScreen.classList.remove('show'); YJ.engine.toTitle(); };
    U.q('#btn-ending-load').onclick = () => { closeAllModals(); openSave('load'); };
    U.q('#btn-ending-new').onclick = () => {
      confirmBox({
        title: '开始新游戏', message: '从第一章重新开始？', ok: '开始',
        onOk: () => { closeModal(); el.endingScreen.classList.remove('show'); YJ.engine.newGame(); }
      });
    };
    U.q('#btn-ending-backlog').onclick = () => openBacklog();
  }

  /* ============================================================
   *  导出
   * ============================================================ */
  YJ.ui = {
    init, showTitle, showGame, showEnding,
    changeScene, showCG, hideCG, stageCast, applyTint,
    openChat, pushChat, closeChat,
    showLine, setText, setTyping,
    showChoices, hideChoices, showTitleCard, statusDelta, toast,
    refreshHUD, refreshControls,
    openBacklog, openSave, openSettings, openAbout, confirmBox,
    closeModal, closeAllModals,
    /* 互动节点：interact:'knock' —— 状态与手动敲击（演示页 / 测试用） */
    interact: {
      active: () => !!knock,
      left: () => (knock ? knock.left : 0),
      total: () => (knock ? knock.def.count : 0),
      id: () => (knock ? knock.node : null),
      tap: () => !!(knock && knock.tap),      /* 是否已进入"点击也算敲"的兜底态 */
      knock: knockOnce,
      complete: autoCompleteKnock,            /* 手动触发兜底二（自动补完） */
      start: startKnock,
      clear: clearKnock
    },
    /* 自定义互动：confessGame（告白小游戏）—— 状态与手动操作（演示页 / 测试用） */
    confess: {
      active: () => !!confess,
      done: () => !!(confess && confess.done),
      def: () => (confess ? confess.def : null),
      count: () => (confess ? confess.count : 0),
      target: () => (confess ? confess.def.target : 0),
      dodges: () => (confess ? confess.dodges : 0),
      word: () => (confess && confess.bubble ? confess.bubble.textContent : ''),
      dartsLeft: () => (confess ? confess.darts.filter(b => !b.classList.contains('gone')).length : 0),
      append: confessAppend,                  /* = 点「我喜欢你」/ 空格 / 回车 / 键盘 1 */
      dodge: (i) => confessDodge((confess && confess.darts[i | 0]) || null, true),
      dodgeKey: confessDodgeByKey,            /* = 键盘 2 / 3 */
      hoverAt: (x, y) => onConfessHover({ clientX: x, clientY: y }),
      finish: confessFinish,                  /* 直接跳到收尾（黑屏 → reveal → 解锁） */
      clear: clearConfess
    },
    __set: function () {
      /* 测试用：注入模态框节点（main.js 创建后调用） */
    },
    _bindModals: function (modals) {
      el.backlogModal = modals.backlog;
      el.saveModal = modals.save;
      el.settingsModal = modals.settings;
      el.aboutModal = modals.about;
      el.confirmModal = modals.confirm;
    },
    assetIssues: assetIssues,
    sceneLabel: id => SCENE_LABEL[id] || id,
    _cacheSize: () => Object.keys(spriteCache).length
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);
