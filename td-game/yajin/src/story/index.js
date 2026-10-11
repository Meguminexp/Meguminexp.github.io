/* 《你好！一周年》— story/index.js
 * 剧本注册表 + 校验器（校验结果同时被 tests/run.js 使用）
 */
(function (root) {
  'use strict';
  const YJ = root.YJ = root.YJ || {};

  const START_NODE = 'c0_01';

  /* ---------- 叙事折算（数值成长曲线，详见 STORY_SPEC §5）----------
   * 本作有 1200+ 个叙事节点，如果每个节点都足额加减数值，100 分制的计量条会在
   * 中盘就顶到上限，玩家在 25 个选择点上的取舍就失去意义。因此：
   *   · 不含选项的"叙事节点"——其数值收益按 NARRATIVE_SCALE 折算并取整，
   *     折算后为 0 的直接不计（只保留真正有分量的情节节点）；
   *   · 含选项的"选择节点"——数值保持作者原样，足额生效。
   * 这样：主线提供温暖的底噪，走向由玩家的选择决定。 */
  const NARRATIVE_SCALE = 0.2;
  const tuned = new WeakSet();
  function tuneEffects(n) {
    if (!n.effects || n.choices || tuned.has(n)) return;
    tuned.add(n);
    ['affection', 'trust', 'courage'].forEach(k => {
      const v = n.effects[k];
      if (typeof v !== 'number') return;
      const s = v * NARRATIVE_SCALE;
      const r = s >= 0 ? Math.round(s) : -Math.round(-s);
      if (r === 0) delete n.effects[k]; else n.effects[k] = r;
    });
    if (!Object.keys(n.effects).length) delete n.effects;
  }

  YJ.story = {
    nodes: {},
    order: [],
    START: START_NODE,

    add(list) {
      if (!Array.isArray(list)) return;
      list.forEach(n => {
        if (!n || !n.id) { console.warn('[YJ.story] 节点缺少 id', n); return; }
        if (this.nodes[n.id]) { console.warn('[YJ.story] 节点 id 重复：' + n.id); }
        else this.order.push(n.id);
        tuneEffects(n);
        this.nodes[n.id] = n;
      });
    },
    get(id) { return this.nodes[id] || null; },

    /* ---------- 文本覆盖层（剧本/*.md → src/story/text.js）----------
     * 让"改故事文字"不需要碰任何 JS：编辑 剧本/*.md 后运行 npm run import:text，
     * 生成的 text.js 会把差异应用回节点（只动文字，不动结构与数值）。 */
    applyTextOverrides() {
      const ov = YJ.textOverrides;
      if (!ov) return 0;
      let n = 0;
      for (const id in ov) {
        const node = this.nodes[id];
        if (!node) { console.warn('[YJ.story] 覆盖目标不存在：' + id); continue; }
        const d = ov[id];
        if (typeof d.text === 'string' && !node.chat) { node.text = d.text; n++; }
        if (d.choices && node.choices) {
          d.choices.forEach(c => {
            if (node.choices[c.i]) {
              node.choices[c.i].text = c.text;
              node.choices[c.i].hint = c.hint;
              n++;
            }
          });
        }
        if (d.chat && node.chat) {
          d.chat.forEach(m => { if (node.chat[m.i]) { node.chat[m.i].text = m.text; n++; } });
        }
      }
      return n;
    },
    has(id) { return !!this.nodes[id]; },
    count() { return this.order.length; },

    /* 出边（用于可达性分析） */
    edges(node) {
      const out = [];
      if (!node) return out;
      if (node.next) out.push(node.next);
      if (node.else) out.push(node.else);
      if (node.choices) node.choices.forEach(c => { if (c && c.next) out.push(c.next); });
      if (node.route) node.route.forEach(r => { if (r && r.next) out.push(r.next); });
      return out;
    },

    /* ---------- 校验 ---------- */
    validate() {
      const errors = [], warnings = [];
      const E = (m) => errors.push(m);
      const W = (m) => warnings.push(m);
      const ids = this.order;

      for (const id of ids) {
        const n = this.nodes[id];
        const at = '[' + id + ']';

        /* 基本字段（route 是纯逻辑路由节点，不参与显示，因此不要求 text/speaker） */
        if (typeof n.chapter !== 'number') E(at + ' 缺少 chapter');
        if (!n.route) {
          /* chat 节点由聊天窗口渲染，text / speaker 均可省略 */
          const bare = !n.text && n.choices;   /* 纯选择节点：只呈现选项 */
          if (typeof n.text !== 'string' && !n.chat && !bare) E(at + ' 缺少 text（chat / 纯选择节点可省略）');
          if (!n.speaker && !n.chat && !bare) E(at + ' 缺少 speaker');
          else if (n.speaker && !YJ.speakers[n.speaker]) E(at + ' speaker 非法：' + n.speaker);
        } else if (n.text == null && n.speaker == null) {
          /* 允许 */
        }

        /* 资源引用 */
        if (n.scene && YJ.SCENES.indexOf(n.scene) < 0) E(at + ' scene 未登记：' + n.scene);
        if (n.cg && YJ.CGS.indexOf(n.cg) < 0) E(at + ' cg 未登记：' + n.cg);
        if (n.bgm && YJ.BGMS.indexOf(n.bgm) < 0) E(at + ' bgm 未登记：' + n.bgm);
        if (n.sfx && YJ.SFXS.indexOf(n.sfx) < 0) E(at + ' sfx 未登记：' + n.sfx);
        if (n.ambience && YJ.AMBIENCES.indexOf(n.ambience) < 0) E(at + ' ambience 未登记：' + n.ambience);
        if (n.tint && YJ.TINTS.indexOf(n.tint) < 0) E(at + ' tint 非法：' + n.tint);
        if (n.beat && YJ.BEATS.indexOf(n.beat) < 0) E(at + ' beat 非法：' + n.beat);
        if (n.zoom && YJ.ZOOMS.indexOf(n.zoom) < 0) E(at + ' zoom 非法：' + n.zoom);
        if (n.chat) {
          if (!Array.isArray(n.chat) || !n.chat.length) E(at + ' chat 不能为空');
          else n.chat.forEach((m, i) => {
            if (!m || !m.text) E(at + ' chat[' + i + '] 缺少 text');
            if (m && ['ya', 'jin', 'narrator', 'inner'].indexOf(m.from) < 0 && !m.name) {
              E(at + ' chat[' + i + '] from 非法：' + (m && m.from));
            }
          });
        }

        /* 立绘 */
        if (n.cast) {
          if (!Array.isArray(n.cast)) E(at + ' cast 必须是数组');
          else n.cast.forEach((c, i) => {
            const cAt = at + '.cast[' + i + ']';
            const ch = YJ.characters[c.id];
            if (!ch) return E(cAt + ' 角色未登记：' + c.id);
            if (c.expr && ch.expressions.indexOf(c.expr) < 0) E(cAt + ' 表情非法：' + c.id + '/' + c.expr);
            if (c.act && ch.acts.indexOf(c.act) < 0) E(cAt + ' 动作非法：' + c.act);
            if (c.outfit && ch.outfits.indexOf(c.outfit) < 0) E(cAt + ' 服装非法：' + c.id + '/' + c.outfit);
            if (c.pos && ['left', 'center', 'right'].indexOf(c.pos) < 0) E(cAt + ' 位置非法：' + c.pos);
          });
        }

        /* 数值与标记 */
        if (n.effects && n.effects.flags) {
          Object.keys(n.effects.flags).forEach(f => {
            if (!YJ.FLAG_SET[f]) E(at + ' effects.flags 未登记：' + f);
          });
        }
        if (n.effects) {
          if (n.effects.affection != null && typeof n.effects.affection !== 'number') E(at + ' affection 必须是数字');
          if (n.effects.trust != null && typeof n.effects.trust !== 'number') E(at + ' trust 必须是数字');
          if (n.effects.courage != null && typeof n.effects.courage !== 'number') E(at + ' courage 必须是数字');
        }
        if (n.condition) {
          ['flags', 'anyFlags', 'notFlags'].forEach(k => {
            if (n.condition[k]) n.condition[k].forEach(f => { if (!YJ.FLAG_SET[f]) E(at + ' condition.' + k + ' 未登记：' + f); });
          });
        }

        /* 出边存在性 */
        this.edges(n).forEach(t => { if (!this.has(t)) E(at + ' 跳转目标不存在：' + t); });
        if (n.choices) {
          if (!Array.isArray(n.choices) || !n.choices.length) E(at + ' choices 不能为空');
          else n.choices.forEach((c, i) => {
            if (!c.text) E(at + ' choices[' + i + '] 缺少 text');
            if (!c.next) E(at + ' choices[' + i + '] 缺少 next');
            if (c.effects && c.effects.flags) Object.keys(c.effects.flags).forEach(f => {
              if (!YJ.FLAG_SET[f]) E(at + ' choices[' + i + '] flags 未登记：' + f);
            });
            if (c.condition && c.condition.flags) c.condition.flags.forEach(f => {
              if (!YJ.FLAG_SET[f]) E(at + ' choices[' + i + '] condition.flags 未登记：' + f);
            });
          });
        }
        if (n.route) {
          if (!Array.isArray(n.route) || !n.route.length) E(at + ' route 不能为空');
          else {
            const last = n.route[n.route.length - 1];
            if (last.when && Object.keys(last.when).length) E(at + ' route 最后一项必须是兜底（无 when）');
            n.route.forEach((r, i) => { if (!r.next) E(at + ' route[' + i + '] 缺少 next'); });
          }
        }

        /* 终止性 */
        const terminal = !n.next && !n.choices && !n.route;
        if (terminal && !n.ending) E(at + ' 是死胡同（无 next/choices/route，也没有 ending）');
        if (n.ending && !YJ.ENDINGS[n.ending]) E(at + ' ending 非法：' + n.ending);

        /* 文本长度提示 */
        if (!n.route && typeof n.text === 'string' && n.text.length > 70) W(at + ' 文本偏长（' + n.text.length + ' 字）');
      }

      /* 孤儿检测 */
      const seen = {};
      const stack = [START_NODE];
      while (stack.length) {
        const id = stack.pop();
        if (!id || seen[id] || !this.has(id)) continue;
        seen[id] = 1;
        this.edges(this.nodes[id]).forEach(t => stack.push(t));
      }
      const orphans = ids.filter(id => !seen[id]);
      if (orphans.length) E('存在不可达节点（' + orphans.length + '）：' + orphans.slice(0, 12).join(', '));

      /* 结局可达性（结构层面：至少有一个节点带该 ending 且可达） */
      const endingsFound = {};
      ids.forEach(id => {
        const n = this.nodes[id];
        if (n.ending && seen[id]) endingsFound[n.ending] = (endingsFound[n.ending] || 0) + 1;
      });
      Object.keys(YJ.ENDINGS).forEach(e => {
        if (!endingsFound[e]) E('结局节点不可达或缺失：' + e);
      });

      return { errors, warnings, reachable: Object.keys(seen).length, total: ids.length, endings: endingsFound };
    }
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);
