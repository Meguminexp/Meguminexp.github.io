/* 《你好！一周年》— state.js
 * 游戏状态：好感 affection / 信任 trust / 剧情标记 flags / 当前位置 / 结局
 * 所有数值变化与条件判定都集中在这里，便于测试验证。
 */
(function (root) {
  'use strict';
  const YJ = root.YJ = root.YJ || {};

  const INIT_AFFECTION = 30;
  const INIT_TRUST = 30;
  const INIT_COURAGE = 30;        /* 勇气：金敢不敢承认自己想要什么（本作主题值） */

  function freshState() {
    return {
      affection: INIT_AFFECTION,
      trust: INIT_TRUST,
      courage: INIT_COURAGE,
      flags: {},
      node: null,          // 当前节点 id
      scene: null,         // 当前背景 id
      chapter: 1,
      ending: null,        // 'sweet' | 'normal' | 'regret'
      history: [],         // [{speaker, text, node}] 最近 N 条
      choiceLog: [],       // [{node, choice, effects}] 玩家选择记录
      startedAt: YJ.util.now(),
      playtime: 0
    };
  }

  YJ.state = {
    st: freshState(),
    INIT_AFFECTION, INIT_TRUST, INIT_COURAGE,

    fresh() { return freshState(); },

    /* 开始新游戏：清空所有剧情变量（验收第 9 条） */
    reset() {
      this.st = freshState();
      YJ.bus.emit('state:reset', this.st);
      return this.st;
    },

    /* 进入节点时结算 effects；返回变化量用于 UI 提示
     * effects: { affection:+5, trust:+3, flags:{a:true} }
     */
    applyEffects(effects) {
      const out = { affection: 0, trust: 0, courage: 0, flags: [], dirty: false };
      if (!effects) return out;
      const st = this.st;
      if (typeof effects.affection === 'number' && effects.affection !== 0) {
        const before = st.affection;
        st.affection = YJ.util.clamp(st.affection + effects.affection, 0, 100);
        out.affection = st.affection - before;
        out.dirty = true;
      }
      if (typeof effects.trust === 'number' && effects.trust !== 0) {
        const before = st.trust;
        st.trust = YJ.util.clamp(st.trust + effects.trust, 0, 100);
        out.trust = st.trust - before;
        out.dirty = true;
      }
      if (typeof effects.courage === 'number' && effects.courage !== 0) {
        const before = st.courage;
        st.courage = YJ.util.clamp(st.courage + effects.courage, 0, 100);
        out.courage = st.courage - before;
        out.dirty = true;
      }
      if (effects.flags) {
        for (const k in effects.flags) {
          if (!Object.prototype.hasOwnProperty.call(effects.flags, k)) continue;
          if (YJ.DEBUG && !YJ.FLAG_SET[k]) console.warn('[YJ] 未知 flag：' + k);
          if (effects.flags[k]) { st.flags[k] = true; out.flags.push(k); }
          else { delete st.flags[k]; }
        }
      }
      if (out.dirty) YJ.bus.emit('state:changed', out);
      return out;
    },

    /* 条件判定：condition:{ affection:{min,max}, trust:{min,max}, flags:[], anyFlags:[], notFlags:[] } */
    check(cond) {
      if (!cond) return true;
      const st = this.st;
      const range = (v, r) => {
        if (!r) return true;
        if (typeof r.min === 'number' && v < r.min) return false;
        if (typeof r.max === 'number' && v > r.max) return false;
        return true;
      };
      if (!range(st.affection, cond.affection)) return false;
      if (!range(st.trust, cond.trust)) return false;
      if (!range(st.courage, cond.courage)) return false;
      if (cond.flags && !cond.flags.every(f => !!st.flags[f])) return false;
      if (cond.notFlags && cond.notFlags.some(f => !!st.flags[f])) return false;
      if (cond.anyFlags && !cond.anyFlags.some(f => !!st.flags[f])) return false;
      return true;
    },

    /* 结局判定（STORY_SPEC §7）—— 第十章路由与测试共用这一份逻辑
     * 三种收束都在一起，区别是"谁先说出口 / 说到多深" */
    resolveEnding() {
      const s = this.st;
      /* A《星星的答案》：好感、信任、勇气都够，且把最私密的一面交了出去 */
      if (s.affection >= 70 && s.trust >= 65 && s.courage >= 55) return 'star';
      /* B《慢慢来》：他把话说出口了，只是更深的那部分还留在心里 */
      if (s.courage >= 40) return 'slow';
      /* C《这次是我先说的》：勇气/信任不足，她替他说 */
      return 'she_first';
    },

    /* 记录一行已显示文本（历史回看） */
    pushHistory(speaker, text, nodeId) {
      const h = this.st.history;
      h.push({ speaker, text, node: nodeId, t: YJ.util.now() });
      if (h.length > 300) h.splice(0, h.length - 300);
    },

    /* 存档快照 / 恢复 */
    snapshot() {
      const s = this.st;
      return {
        affection: s.affection, trust: s.trust, courage: s.courage,
        flags: YJ.util.deep(s.flags),
        node: s.node, scene: s.scene, chapter: s.chapter, ending: s.ending,
        history: YJ.util.deep(s.history.slice(-60)),
        choiceLog: YJ.util.deep(s.choiceLog.slice(-60)),
        playtime: s.playtime
      };
    },
    restore(snap) {
      const s = freshState();
      if (snap) {
        s.affection = typeof snap.affection === 'number' ? snap.affection : INIT_AFFECTION;
        s.trust = typeof snap.trust === 'number' ? snap.trust : INIT_TRUST;
        s.courage = typeof snap.courage === 'number' ? snap.courage : INIT_COURAGE;
        s.flags = snap.flags ? YJ.util.deep(snap.flags) : {};
        s.node = snap.node || null;
        s.scene = snap.scene || null;
        s.chapter = snap.chapter || 1;
        s.ending = snap.ending || null;
        s.history = snap.history ? YJ.util.deep(snap.history) : [];
        s.choiceLog = snap.choiceLog ? YJ.util.deep(snap.choiceLog) : [];
        s.playtime = snap.playtime || 0;
      }
      this.st = s;
      YJ.bus.emit('state:restored', s);
      return s;
    },

    /* 供调试/测试：直接设置数值 */
    set(key, value) { this.st[key] = value; },
    flag(name, on) { if (on === false) delete this.st.flags[name]; else this.st.flags[name] = true; }
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);
