/* 《你好！一周年》— engine.js
 * 剧情引擎：节点推进 / 条件与路由 / 打字机 / 自动播放 / 快进 /
 *           场景与立绘调度 / 选项 / 结局 / 输入锁 / 自动存档
 */
(function (root) {
  'use strict';
  const YJ = root.YJ = root.YJ || {};

  const E = {
    mode: 'title',        // title | game | ending
    node: null,
    typing: false,
    typeIdx: 0,
    typeTimer: null,
    locked: false,        // 转场/防连点输入锁
    lockTimer: null,
    auto: false,
    autoTimer: null,
    skip: false,
    skipTimer: null,
    awaitingChoice: false,
    chat: null,            // 当前 chat 节点的消息数组
    chatRevealed: 0,       // 已揭示条数（每次点击揭示一条）
    modalOpen: false,
    pendingEnding: null,
    lastDelta: null
  };

  /* ---------------- 工具 ---------------- */
  function clearTimers() {
    if (E.typeTimer) { clearInterval(E.typeTimer); E.typeTimer = null; }
    if (E.lockTimer) { clearTimeout(E.lockTimer); E.lockTimer = null; }
    if (E.autoTimer) { clearTimeout(E.autoTimer); E.autoTimer = null; }
    if (E.skipTimer) { clearTimeout(E.skipTimer); E.skipTimer = null; }
  }
  function lock(ms) {
    E.locked = true;
    if (E.lockTimer) clearTimeout(E.lockTimer);
    E.lockTimer = setTimeout(() => { E.locked = false; }, ms == null ? 200 : ms);
  }
  function speakerOf(node) {
    const sp = YJ.speakers[node.speaker] || { name: '', color: '#CFC6B8' };
    return { name: sp.name, color: sp.color, kind: node.speaker };
  }

  /* ---------------- 节点解析（condition / route 链） ---------------- */
  function resolve(id) {
    let cur = id, guard = 0;
    while (cur && guard++ < 80) {
      const n = YJ.story.get(cur);
      if (!n) { console.error('[YJ.engine] 节点不存在：' + cur); return null; }
      if (n.route) {
        let hit = null;
        for (const r of n.route) { if (YJ.state.check(r.when)) { hit = r; break; } }
        if (!hit) { console.error('[YJ.engine] route 无匹配且无兜底：' + cur); return null; }
        cur = hit.next; continue;
      }
      if (n.condition && !YJ.state.check(n.condition)) {
        cur = n.else || n.next || null; continue;   /* 条件不满足：走 else，或跳过本节点 */
      }
      return n;
    }
    console.error('[YJ.engine] 跳转链过深或断裂：' + id);
    return null;
  }

  /* ---------------- 打字机 ---------------- */
  function typeStart(text) {
    const n = E.node;
    E.typing = true; E.typeIdx = 0;
    YJ.ui.setText('');
    YJ.ui.setTyping(true);
    const speed = YJ.save.settings.typewriter ? Math.max(0, YJ.save.settings.textSpeed | 0) : 0;
    if (speed <= 0 || !text) { finishType(); return; }
    if (E.typeTimer) clearInterval(E.typeTimer);
    E.typeTimer = setInterval(() => {
      E.typeIdx++;
      YJ.ui.setText(text.slice(0, E.typeIdx));
      if (E.typeIdx >= text.length) finishType();
    }, speed);
  }
  function finishType() {
    if (E.typeTimer) { clearInterval(E.typeTimer); E.typeTimer = null; }
    const text = E.node ? (E.node.text || '') : '';
    YJ.ui.setText(text);
    E.typing = false; E.typeIdx = text.length;
    YJ.ui.setTyping(false);
    onLineComplete();
  }
  function onLineComplete() {
    const n = E.node; if (!n) return;
    if (n.choices && n.choices.length) { showChoices(n); return; }
    if (E.skip) scheduleSkip();
    else if (E.auto) scheduleAuto();
  }
  function scheduleAuto() {
    if (E.autoTimer) clearTimeout(E.autoTimer);
    E.autoTimer = setTimeout(() => { if (E.auto && !E.awaitingChoice && !E.modalOpen) advance(); },
      Math.max(300, YJ.save.settings.autoDelay | 0));
  }
  function scheduleSkip() {
    if (E.skipTimer) clearTimeout(E.skipTimer);
    E.skipTimer = setTimeout(() => {
      if (!E.skip || E.awaitingChoice || E.modalOpen) return;
      advance();
    }, 55);
  }

  /* ---------------- 选项 ---------------- */
  function showChoices(n) {
    const list = (n.choices || []).filter(c => !c.condition || YJ.state.check(c.condition));
    if (!list.length) {
      console.warn('[YJ.engine] 没有可用选项，自动继续：' + n.id);
      if (n.next) goTo(n.next); return;
    }
    E.awaitingChoice = true;
    YJ.ui.showChoices(list, (idx) => choose(idx, list));
  }
  function choose(idx, list) {
    if (!E.awaitingChoice) return;
    const n = E.node;
    const c = list[idx];
    if (!c) return;
    E.awaitingChoice = false;
    YJ.ui.hideChoices();
    YJ.audio.sfx('sfx_choice');
    /* 记录选择 + 结算效果 */
    const delta = YJ.state.applyEffects(c.effects);
    YJ.state.st.choiceLog.push({ node: n.id, choice: c.text, effects: c.effects || null });
    if (c.text) YJ.state.pushHistory(speakerOf(n).name, '▸ ' + c.text, n.id + ':choice');
    if (delta.dirty) YJ.ui.statusDelta(delta);
    YJ.bus.emit('engine:choice', { node: n.id, choice: c.text });
    goTo(c.next);
  }

  /* ---------------- 核心：进入节点 ---------------- */
  function goTo(id, opts) {
    opts = opts || {};
    clearTimers();
    E.awaitingChoice = false;
    YJ.ui.hideChoices();
    E.skipTimer = null;
    const n = resolve(id);
    if (!n) { console.error('[YJ.engine] 无法进入节点：' + id); return false; }
    E.node = n;

    const st = YJ.state.st;
    st.node = n.id;
    if (typeof n.chapter === 'number') st.chapter = n.chapter;

    /* 数值与标记（读档时不重复结算避免二次加值） */
    if (!opts.noEffects) {
      const delta = YJ.state.applyEffects(n.effects);
      E.lastDelta = delta;
      if (delta.dirty) YJ.ui.statusDelta(delta);
      if (delta.flags.length) YJ.bus.emit('engine:flags', delta.flags);
    }

    /* 演出调度 */
    let transitionMs = 0;
    if (n.scene && n.scene !== st.scene) {
      st.scene = n.scene;
      transitionMs = YJ.ui.changeScene(n.scene, n.transition || 'fade');
    } else if (n.scene) {
      st.scene = n.scene;
    }
    if (n.tint) YJ.ui.applyTint(n.tint); else YJ.ui.applyTint(null);
    if (n.cg) { YJ.ui.showCG(n.cg); transitionMs = Math.max(transitionMs, 420); }
    else { YJ.ui.hideCG(); }
    YJ.ui.stageCast(n.cast || [], n);
    if (n.bgm) YJ.audio.playBGM(n.bgm);
    if (n.beat) YJ.audio.beat(n.beat);
    if (n.ambience) YJ.audio.playAmbience(n.ambience);
    if (n.sfx) YJ.audio.sfx(n.sfx);
    if (n.titlecard) { YJ.ui.showTitleCard(n.titlecard); transitionMs = Math.max(transitionMs, 1200); }

    /* 历史 & 已读 & 自动存档 */
    const spk = speakerOf(n);
    if (n.text) YJ.state.pushHistory(spk.name, n.text, n.id);
    YJ.save.markRead(n.id);
    if (!opts.noAutosave && !opts.noEffects) {
      YJ.save.autosave();
      /* ⑤ 进入新的一章：把"该章开头状态"写进该章专用自动槽。
         save.js 内部按章号去重 —— 章内来回走不会重复写，读档回到该章开头
         也不会被当成"新章"而覆盖自己。 */
      if (typeof n.chapter === 'number') YJ.save.chapterAutosave(n.chapter);
    }
    YJ.bus.emit('engine:node', n);

    /* 呈现文本 / 聊天窗口 */
    if (n.chat && n.chat.length) {
      E.chat = n.chat; E.chatRevealed = 0;
      YJ.ui.showLine({
        speaker: spk.name, color: spk.color, kind: spk.kind,
        text: n.text || '', chapter: st.chapter, node: n.id, silent: true
      });
      YJ.ui.openChat(n.chat, n);
      /* 进入时先揭示第一条，之后每次点击揭示一条；?chat=all 时一次性展开 */
      if (YJ.CHAT_ALL) {
        n.chat.forEach(m => YJ.ui.pushChat(m));
        E.chatRevealed = n.chat.length;
      } else {
        YJ.ui.pushChat(n.chat[0]);
        E.chatRevealed = 1;
        YJ.audio.sfx('sfx_msg');
      }
      E.typing = false;
      YJ.ui.setTyping(false);
    } else {
      E.chat = null; E.chatRevealed = 0;
      YJ.ui.closeChat();
      YJ.ui.showLine({
        speaker: spk.name, color: spk.color, kind: spk.kind,
        text: n.text || '', chapter: st.chapter, node: n.id,
        bareChoices: !n.text && !!n.choices
      });
      if (opts.instant) finishType(); else typeStart(n.text || '');
    }
    lock(Math.max(200, transitionMs));
    return true;
  }

  /* ---------------- 推进 ---------------- */
  function advance() {
    if (E.modalOpen) return;
    if (E.locked) return;
    const n = E.node;
    if (!n) return;
    if (E.awaitingChoice) return;
    /* 聊天窗口：每次点击揭示一条，全部揭示后才继续剧情 */
    if (E.chat && E.chatRevealed < E.chat.length) {
      YJ.ui.pushChat(E.chat[E.chatRevealed]);
      E.chatRevealed++;
      YJ.audio.sfx('sfx_msg');
      lock(70);
      return;
    }
    if (E.typing) { finishType(); lock(80); return; }

    if (n.ending) { presentEnding(n); return; }
    if (!n.next) { console.warn('[YJ.engine] 节点无后继，且不是结局：' + n.id); return; }
    goTo(n.next);
  }

  /* ---------------- 结局 ---------------- */
  function presentEnding(n) {
    E.mode = 'ending';
    const endingId = n.ending || YJ.state.resolveEnding();
    YJ.state.st.ending = endingId;
    YJ.state.flag('end_' + endingId);
    const def = YJ.ENDINGS[endingId] || { title: '结局', cg: null, desc: '' };
    YJ.save.autosave();
    YJ.save.flushRead();
    YJ.audio.playBGM('bgm_ending');
    YJ.ui.showEnding({
      id: endingId, title: def.title, desc: def.desc, cg: def.cg,
      affection: YJ.state.st.affection, trust: YJ.state.st.trust, courage: YJ.state.st.courage,
      flags: Object.keys(YJ.state.st.flags),
      history: YJ.state.st.history.slice(-40)
    });
    YJ.bus.emit('engine:ending', endingId);
  }

  /* ---------------- 对外 API ---------------- */
  YJ.engine = {
    state: E,
    get node() { return E.node; },
    get mode() { return E.mode; },

    /* 新游戏：彻底重置剧情状态（验收第 9 条） */
    newGame() {
      clearTimers();
      YJ.state.reset();
      YJ.save.resetChapterRun();          /* ⑤ 新的一局：允许重新记录每一章的自动存档 */
      YJ.audio.stopBGM(); YJ.audio.stopAmbience();
      E.mode = 'game'; E.auto = false; E.skip = false;
      E.awaitingChoice = false; E.modalOpen = false; E.pendingEnding = null;
      E.chat = null; E.chatRevealed = 0;
      YJ.ui.closeChat();
      YJ.ui.showGame();
      YJ.ui.refreshHUD();
      YJ.audio.ensure();
      YJ.save.flushRead();
      return this.goTo(YJ.story.START);
    },

    /* 继续/读档：恢复状态并回到存档节点（不重复结算数值） */
    load(slot) {
      const ok = YJ.save.loadFrom(slot);
      if (!ok) return false;
      clearTimers();
      E.mode = 'game'; E.auto = !!YJ.save.settings.autoMode; E.skip = false;
      E.awaitingChoice = false; E.modalOpen = false;
      E.chat = null; E.chatRevealed = 0;
      YJ.ui.showGame();
      /* 立绘/背景在节点里重建 */
      const st = YJ.state.st;
      if (st.scene) { YJ.ui.changeScene(st.scene, 'none'); }
      YJ.ui.refreshHUD();
      const from = st.node || YJ.story.START;
      /* 保留存档里的场景作为"上下文"：节点自己写了 scene 时 goTo 会换过去，
         没写 scene 时（scene 是继承来的）不会把继承值丢掉——否则 HUD 场景名会空掉 */
      const r = this.goTo(from, { noEffects: true, noAutosave: true, instant: true });
      if (!r) return this.goTo(YJ.story.START);   /* 存档节点失效：退回开头（它会自带场景） */
      /* ⑤ 读档回到的这一章就是存档里那一章：标记为"已记录"，
         之后在章内走动不会被当成"新章"而覆盖该章的自动存档 */
      YJ.save.markChapterDone(YJ.state.st.chapter);
      YJ.ui.toast('已读取存档 · ' + YJ.util.fmtTime(YJ.save.peek(slot) && YJ.save.peek(slot).savedAt));
      return true;
    },

    goTo, advance, choose,

    /* 供 UI/测试调用：跳过打字动画 */
    completeText() { if (E.typing) { finishType(); return true; } return false; },
    isTyping() { return E.typing; },
    isAwaitingChoice() { return E.awaitingChoice; },
    isLocked() { return E.locked; },

    setAuto(on) {
      E.auto = !!on;
      YJ.save.setSetting('autoMode', E.auto);
      if (E.autoTimer) { clearTimeout(E.autoTimer); E.autoTimer = null; }
      if (E.auto && !E.typing && !E.awaitingChoice) scheduleAuto();
      YJ.ui.refreshControls();
    },
    toggleAuto() { this.setAuto(!E.auto); },
    setSkip(on) {
      E.skip = !!on;
      if (E.skipTimer) { clearTimeout(E.skipTimer); E.skipTimer = null; }
      if (E.skip) { if (E.typing) finishType(); if (!E.awaitingChoice) advance(); }
      YJ.ui.refreshControls();
    },
    toggleSkip() { this.setSkip(!E.skip); },

    /* 模态框打开时冻结推进 */
    setModal(on) {
      E.modalOpen = !!on;
      if (E.modalOpen) { if (E.autoTimer) clearTimeout(E.autoTimer); if (E.skipTimer) clearTimeout(E.skipTimer); }
      else { if (E.auto && !E.awaitingChoice) scheduleAuto(); }
    },

    /* 回到标题 */
    toTitle() {
      clearTimers();
      E.mode = 'title'; E.auto = false; E.skip = false;
      E.awaitingChoice = false; E.modalOpen = false; E.node = null;
      YJ.audio.stopBGM(); YJ.audio.stopAmbience();
      YJ.ui.hideChoices(); YJ.ui.hideCG(); YJ.ui.closeChat();
      YJ.ui.showTitle();
    },

    /* 重新开始（标题界面"开始新游戏"用，需先确认） */
    restart() { return this.newGame(); },

    /* 调试/测试：直接把状态设为某节点 */
    jump(id) { E.mode = 'game'; YJ.ui.showGame(); return this.goTo(id, { instant: true }); },

    _debugState() {
      const st = YJ.state.st;
      return {
        mode: E.mode, node: st.node, chapter: st.chapter,
        affection: st.affection, trust: st.trust, courage: st.courage,
        chat: E.chat ? (E.chatRevealed + '/' + E.chat.length) : null,
        flags: Object.keys(st.flags).sort(), ending: st.ending,
        typing: E.typing, awaitingChoice: E.awaitingChoice, locked: E.locked,
        scene: st.scene, auto: E.auto, skip: E.skip
      };
    }
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);
