#!/usr/bin/env node
/* 扫描 assets/characters/ 下的位图立绘，生成 assets/sprites.js。
 * 有了它，你把人画好的立绘丢进目录 → 运行本工具 → 游戏立刻优先使用位图（程序化立绘自动兜底）。
 *
 * 命名约定：assets/characters/<ya|jin>/<表情>[@<服装>].png
 *   smile@casual.png  → 只用于"微笑 + 日常"
 *   smile@any.png     → "微笑"用于全部服装（没单独画服装时用这个）
 *   smile.png         → 同上（等价于 @any）
 * 建议尺寸：720×1080（或任何 2:3 比例），透明背景，人物底部贴齐图片底边。
 * 运行：node tools/gen-sprites.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
require(path.join(ROOT, 'src/core.js'));
require(path.join(ROOT, 'src/story/characters.js'));
const YJ = globalThis.YJ;

const EXT = ['.png', '.webp', '.jpg', '.jpeg', '.avif'];
const files = {};
let n = 0;
for (const cid of Object.keys(YJ.characters)) {
  const dir = path.join(ROOT, 'assets/characters', cid);
  fs.mkdirSync(dir, { recursive: true });
  const ch = YJ.characters[cid];
  for (const f of fs.readdirSync(dir)) {
    const ext = path.extname(f).toLowerCase();
    if (EXT.indexOf(ext) < 0) continue;
    const base = path.basename(f, ext);
    const at = base.indexOf('@');
    const expr = at < 0 ? base : base.slice(0, at);
    const outfit = at < 0 ? 'any' : base.slice(at + 1);
    if (ch.expressions.indexOf(expr) < 0) { console.warn('  ⚠ 跳过（表情名不在清单里）：' + f + '　可用：' + ch.expressions.join('/')); continue; }
    if (outfit !== 'any' && ch.outfits.indexOf(outfit) < 0) { console.warn('  ⚠ 跳过（服装名不在清单里）：' + f + '　可用：' + ch.outfits.join('/')); continue; }
    files[cid] = files[cid] || {};
    files[cid][expr + '@' + outfit] = 'assets/characters/' + cid + '/' + f;
    n++;
  }
}
const body = `/* 《你好！一周年》位图立绘索引 —— 由 tools/gen-sprites.js 自动生成，请勿手改。
 * 有对应位图时优先使用位图，否则回退到 src/art.js 的程序化立绘（两者可在同一场景混用）。
 * 生成时间：${new Date().toISOString()}　共 ${n} 张位图。
 */
(function (root) {
  'use strict';
  const YJ = root.YJ = root.YJ || {};
  const F = ${JSON.stringify(files, null, 2)};
  YJ.spriteFiles = F;
  YJ.sprites = {
    count: ${n},
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
`;
fs.writeFileSync(path.join(ROOT, 'assets/sprites.js'), body, 'utf8');
console.log('✔ 已生成 assets/sprites.js（位图立绘 ' + n + ' 张）');
const cov = globalThis.YJ.sprites ? null : null;
console.log('  把文件放进 assets/characters/ya/ 或 assets/characters/jin/ 后重新运行本工具即可生效。');
