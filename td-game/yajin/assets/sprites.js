/* 《你好！一周年》位图立绘索引 —— 由 tools/gen-sprites.js 自动生成，请勿手改。
 * 有对应位图时优先使用位图，否则回退到 src/art.js 的程序化立绘（两者可在同一场景混用）。
 * 生成时间：2026-10-11T05:15:14.122Z　共 30 张位图。
 */
(function (root) {
  'use strict';
  const YJ = root.YJ = root.YJ || {};
  const F = {
  "ya": {
    "blush@any": "assets/characters/ya/blush@any.png",
    "cry@any": "assets/characters/ya/cry@any.png",
    "excited@any": "assets/characters/ya/excited@any.png",
    "laugh@any": "assets/characters/ya/laugh@any.png",
    "neutral@any": "assets/characters/ya/neutral@any.png",
    "pout@any": "assets/characters/ya/pout@any.png",
    "proud@any": "assets/characters/ya/proud@any.png",
    "sad@any": "assets/characters/ya/sad@any.png",
    "serious@any": "assets/characters/ya/serious@any.png",
    "shy@any": "assets/characters/ya/shy@any.png",
    "sleepy@any": "assets/characters/ya/sleepy@any.png",
    "smile@any": "assets/characters/ya/smile@any.png",
    "soft@any": "assets/characters/ya/soft@any.png",
    "surprised@any": "assets/characters/ya/surprised@any.png",
    "tease@any": "assets/characters/ya/tease@any.png",
    "worried@any": "assets/characters/ya/worried@any.png"
  },
  "jin": {
    "awkward@any": "assets/characters/jin/awkward@any.png",
    "blank@any": "assets/characters/jin/blank@any.png",
    "cry@any": "assets/characters/jin/cry@any.png",
    "guilty@any": "assets/characters/jin/guilty@any.png",
    "laugh@any": "assets/characters/jin/laugh@any.png",
    "moved@any": "assets/characters/jin/moved@any.png",
    "neutral@any": "assets/characters/jin/neutral@any.png",
    "panic@any": "assets/characters/jin/panic@any.png",
    "serious@any": "assets/characters/jin/serious@any.png",
    "shy@any": "assets/characters/jin/shy@any.png",
    "sleepy@any": "assets/characters/jin/sleepy@any.png",
    "smile@any": "assets/characters/jin/smile@any.png",
    "soft@any": "assets/characters/jin/soft@any.png",
    "surprised@any": "assets/characters/jin/surprised@any.png"
  }
};
  YJ.spriteFiles = F;
  YJ.sprites = {
    count: 30,
    /* 查找顺序：表情@服装 → 表情@any → 无 */
    resolve(charId, expr, outfit) {
      const t = F[charId];
      if (!t) return null;
      return t[expr + '@' + (outfit || 'any')] || t[expr + '@any'] || null;
    },
    /* 覆盖率统计（有多少 表情×服装 组合已经由位图提供） */
    coverage() {
      let total = 0, covered = 0, per = {};
      for (const cid in YJ.characters) {
        const ch = YJ.characters[cid];
        per[cid] = { total: 0, covered: 0, missing: [] };
        ch.expressions.forEach(e => ch.outfits.forEach(o => {
          total++; per[cid].total++;
          if (this.resolve(cid, e, o)) { covered++; per[cid].covered++; }
          else per[cid].missing.push(e + '@' + o);
        }));
      }
      return { total, covered, per };
    }
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);
