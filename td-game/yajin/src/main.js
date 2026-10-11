/* 《你好！一周年》— main.js
 * 启动流程、模态框绑定、首次交互解锁音频、测试接口
 */
(function (root) {
  'use strict';
  const YJ = root.YJ = root.YJ || {};
  const U = YJ.util;

  /* ============================================================
   *  跳转的场景上下文（?shot= / 调试接口共用）
   *  ------------------------------------------------------------
   *  剧本里的 scene 是"设一次、之后继承"的：节点自己不写 scene 时，
   *  engine.goTo() 不会换背景、HUD 也读 st.scene，于是 ?shot=<节点id>
   *  会一直停在 newGame() 的默认背景（宿舍）上——烟花夜、机场都被吃掉。
   *  这里在跳转前按主线顺序（YJ.story.order）回溯，取该节点之前最近一个
   *  显式写了 scene 的节点作为上下文；节点自带 scene 时仍然以节点为准。
   *  也可以 ?shot=<id>&scene=<场景id> 显式指定（须在 YJ.SCENES 里）。
   * ============================================================ */
  function sceneFromQuery() {
    const m = /[?&]scene=([\w-]+)/.exec(location.search);
    if (!m) return null;
    if (YJ.SCENES.indexOf(m[1]) < 0) {
      console.warn('[YJ] ?scene= 未登记，忽略：' + m[1]);
      return null;
    }
    return m[1];
  }
  /* 主线顺序上"最近的、显式设置过 scene 的前驱节点"的场景 */
  function backtrackScene(id) {
    const order = YJ.story.order, nodes = YJ.story.nodes;
    for (let i = order.indexOf(id) - 1; i >= 0; i--) {
      const p = nodes[order[i]];
      if (p && p.scene) return p.scene;
    }
    return null;
  }
  /* 跳转入口：先把场景上下文建立起来，再交给引擎跳 */
  function jumpWithContext(id, explicitScene) {
    const target = YJ.story.get(id);
    const scene = explicitScene || sceneFromQuery() || backtrackScene(id);
    /* 目标节点自带 scene 时交给 engine（它会换背景并写 st.scene）；
       只有"继承"的情况才需要在这里补上下文，否则不会换背景 */
    if (scene && target && !target.scene && scene !== YJ.state.st.scene) {
      YJ.state.st.scene = scene;            /* HUD 的场景名读的就是 st.scene */
      YJ.ui.changeScene(scene, 'none');     /* 背景：瞬时切换，不把继承值留在旧场景 */
    }
    return YJ.engine.jump(id);
  }

  function boot() {
    /* 1. 设置与界面 */
    YJ.save.loadSettings();
    YJ.ui.init();
    YJ.ui._bindModals({
      backlog: document.getElementById('modal-backlog'),
      save: document.getElementById('modal-save'),
      settings: document.getElementById('modal-settings'),
      about: document.getElementById('modal-about'),
      confirm: document.getElementById('modal-confirm')
    });

    /* 2. 剧本自检（控制台报告，不阻断游玩） */
    const v = YJ.story.validate();
    YJ.log('剧本：' + v.total + ' 节点，可达 ' + v.reachable + '，结局 ' + JSON.stringify(v.endings));
    if (v.errors.length) {
      console.error('[YJ] 剧本校验发现 ' + v.errors.length + ' 个错误：');
      v.errors.forEach(e => console.error('  · ' + e));
    }
    if (v.warnings.length) YJ.log('剧本提示 ' + v.warnings.length + ' 条');

    /* 3. 首次交互解锁 WebAudio（浏览器自动播放策略） */
    const unlock = () => {
      if (YJ.audio.ensure()) {
        document.removeEventListener('pointerdown', unlock);
        document.removeEventListener('keydown', unlock);
        YJ.log('音频已解锁');
      }
    };
    document.addEventListener('pointerdown', unlock);
    document.addEventListener('keydown', unlock);

    /* 4. 标题界面 */
    YJ.ui.showTitle();

    /* 4b. 调试/截图：?shot=<节点id> 直接跳转到指定剧情节点（也用于文档截图）
     *     ?shot=<id>&scene=<场景id> 可显式指定场景；不带时按主线顺序回溯继承 */
    const shot = /[?&]shot=([\w-]+)/.exec(location.search);
    if (shot) {
      setTimeout(() => {
        YJ.engine.newGame();
        jumpWithContext(shot[1]);
        YJ.engine.completeText();
        YJ.log('截图模式：跳转到 ' + shot[1] + '（场景 ' + (YJ.state.st.scene || '—') + '）');
      }, 80);
    }
    /* 4c. 数值阈值反馈不再弹卡片 / 浮层（只让数值条自己亮一下），
       随之删除了原先为无头截图准备的那个 probe 钩子。 */

    /* 5. 离开页面前落盘 */
    window.addEventListener('beforeunload', () => {
      try { YJ.save.flushRead(); } catch (e) { }
    });

    YJ.log('《你好！一周年》v' + YJ.version + ' 启动完成');
    console.log('%c你好！一周年','color:#E8B86B;font-size:15px;font-weight:600');
    console.log('调试：window.__test · ?debug=1 输出详细日志');
  }

  /* ============================================================
   *  测试接口（供 tests/run.js 与人工调试使用）
   * ============================================================ */
  function exposeTestApi() {
    root.__test = {
      /* 生命周期 */
      booted: true,
      validate: () => YJ.story.validate(),
      story: () => YJ.story,

      /* 游玩 */
      newGame: () => YJ.engine.newGame(),
      /* 跳转：先建立场景上下文（继承 / 显式），再跳 */
      goTo: (id) => jumpWithContext(id),
      goToWithContext: (id, scene) => jumpWithContext(id, scene),
      inheritSceneOf: (id) => backtrackScene(id),
      advance: () => YJ.engine.advance(),
      completeText: () => YJ.engine.completeText(),
      isTyping: () => YJ.engine.isTyping(),
      awaitingChoice: () => YJ.engine.isAwaitingChoice(),
      choices: () => Array.prototype.slice.call(document.querySelectorAll('#choices .choice')),
      choose: (i) => { const b = document.querySelectorAll('#choices .choice')[i]; if (b) { b.click(); return true; } return false; },
      state: () => YJ.engine._debugState(),
      raw: () => YJ.state.st,

      /* 立即显示当前节点全文（跳过打字机，便于测试） */
      settle: function () {
        let guard = 0;
        while (YJ.engine.isTyping() && guard++ < 50) YJ.engine.completeText();
        return YJ.engine._debugState();
      },
      /* 测试用：立即释放输入锁（转场计时器在无头环境下不等待） */
      unlock: function () { YJ.engine.state.locked = false; return true; },

      /* 数值操作 */
      setAffection: (v) => { YJ.state.st.affection = v; YJ.ui.refreshHUD(); return v; },
      setTrust: (v) => { YJ.state.st.trust = v; YJ.ui.refreshHUD(); return v; },
      flag: (f, on) => { YJ.state.flag(f, on !== false); return Object.keys(YJ.state.st.flags); },
      resolveEnding: () => YJ.state.resolveEnding(),

      /* 存档 */
      save: (slot) => YJ.save.saveTo(slot),
      load: (slot) => YJ.engine.load(slot),
      slots: () => YJ.save.list(),
      wipe: () => YJ.save.wipeAll(),
      exportSave: () => YJ.save.exportAll(),

      /* 设置 */
      settings: () => YJ.save.settings,
      setSetting: (k, v) => { YJ.save.setSetting(k, v); return YJ.save.settings; },
      audioState: () => YJ.audio._state(),

      /* UI 状态 */
      ui: () => ({
        titleVisible: document.getElementById('title-screen').style.display !== 'none',
        gameVisible: document.getElementById('game-screen').style.display !== 'none',
        endingVisible: document.getElementById('ending-screen').classList.contains('show'),
        cgVisible: document.getElementById('cg-layer').classList.contains('show'),
        dialogText: document.getElementById('dialog-text').textContent,
        speaker: document.getElementById('name-plate').textContent,
        choiceCount: document.querySelectorAll('#choices .choice').length,
        charIds: Array.prototype.map.call(document.querySelectorAll('#char-layer .char'), n => n.dataset.char),
        bgCount: document.querySelectorAll('#bg-layer .bg').length,
        modals: Array.prototype.map.call(document.querySelectorAll('.modal.show'), n => n.id),
        spriteCache: YJ.ui._cacheSize()
      }),
      assetIssues: () => YJ.ui.assetIssues.slice(),
      manifest: () => YJ.manifest,

      /* 便捷：一键结束当前节点序列（用于路线测试） */
      play: function (choicePicker, maxSteps) {
        const limit = maxSteps || 4000;
        let steps = 0;
        while (steps++ < limit) {
          const st = YJ.engine._debugState();
          if (st.mode === 'ending') return st;
          if (YJ.engine.isTyping()) { YJ.engine.completeText(); continue; }
          if (YJ.engine.isAwaitingChoice()) {
            const idx = choicePicker ? choicePicker(st, document.querySelectorAll('#choices .choice')) : 0;
            const b = document.querySelectorAll('#choices .choice')[idx] || document.querySelectorAll('#choices .choice')[0];
            if (!b) return st;
            b.click();
            continue;
          }
          if (YJ.engine.isLocked()) { /* 等锁释放：测试环境直接忽略 */ }
          YJ.engine.advance();
        }
        return YJ.engine._debugState();
      }
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { boot(); exposeTestApi(); });
  } else {
    boot(); exposeTestApi();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
