#!/usr/bin/env node
/* 《你好！一周年》— tools/build-nail-cg.js
 *
 * **只生成 `assets/cg/cg_nail_art.svg` 这一张**手部特写 CG。
 * 存在的理由：`tools/build-cg.js` 会一次性重建全部 17 张合成 CG，
 * 而这张手部 CG 与"三张结局 CG"等其它任务互不相干，独立成脚本后
 * 可以单独重跑、不会覆盖别人的产出。
 *
 * 用法：
 *   node tools/build-nail-cg.js          # 只重建 cg_nail_art.svg
 *   require('./build-nail-cg.js').buildNailArt(outDir)   # 供 build-cg.js 调用
 *
 * 依赖：src/core.js → src/story/characters.js → src/art.js（只用 art.handSVG 与新几何）。
 */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

function loadYJ() {
  require(path.join(ROOT, 'src/core.js'));
  require(path.join(ROOT, 'src/story/characters.js'));
  require(path.join(ROOT, 'src/art.js'));
  return globalThis.YJ;
}

/* 与 build-cg.js 一致的两位小数取整 */
const R = n => Math.round(n * 100) / 100;

/* 手部特写 CG（chapter8 c8_92 / chapter 8-9 美甲段落）
 * 剧本原文："粉底小猫 / 磨砂黑一条银线 —— 一只甜的，一只凶的"，所以并排合成两只手。
 *
 * handSVG 的手是在"手部局部坐标"里画好后、再用一层 PLACE 变换摆进 720×1080 画布的，
 * 所以这里直接用每只手在画布里的锚点（掌指关节连线中点）来定位：
 *   P = translate(tx ty) rotate(r) scale(kk) translate(-ax -ay)
 * 手腕在局部坐标里一直画到 y=980，无论怎么摆都会自然跑出画布下缘，
 * 不会出现"被切断的手"。
 *
 * @param {string} outDir 输出目录（通常 ROOT/assets/cg）
 * @returns {number} 生成文件的字节数
 */
function buildNailArt(outDir) {
  const YJ = globalThis.YJ || loadYJ();
  const OUT = path.join(outDir, 'cg_nail_art.svg');
  /* handSVG 自带一层 rgba(18,14,22,.60) 的压暗底（游戏里它是叠在场景上的手部特写层），
     合成 CG 时必须剥掉，否则两张手会把整幅画面叠暗、并在交叠处出现一条深色竖带。
     <defs> 要留着：新版剪影遮罩（hm_/hp_）就在里面，id 按 kind 区分，两只手不冲突。 */
  const inner = k => YJ.art.handSVG(k)
    .replace(/^[\s\S]*?<svg[^>]*>/, '')
    .replace(/<\/svg>\s*$/, '')
    .replace(/<rect width="720" height="1080" fill="rgba\(18,14,22,0\.60\)"\/>/, '');
  /* 每只手在 720×1080 画布里的锚点（与 src/art.js handSVG 里的 PLACE 一致） */
  const ANCHOR = { cat_nails: [392, 600], cool_nails: [330, 588] };
  const place = (kind, tx, ty, rot, kk) => {
    const a = ANCHOR[kind];
    return `<g transform="translate(${R(tx)} ${R(ty)}) rotate(${R(rot)}) scale(${R(kk)}) translate(${R(-a[0])} ${R(-a[1])})">${inner(kind)}</g>`;
  };
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="1600" height="900">
<defs><linearGradient id="naBg" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#F7E9EE"/><stop offset="1" stop-color="#E7D3DC"/></linearGradient>
<radialGradient id="naVig" cx="0.5" cy="0.46" r="0.8">
  <stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.34"/></radialGradient>
<radialGradient id="naGlow" cx="0.5" cy="0.5" r="0.5">
  <stop offset="0" stop-color="#FFF6EF" stop-opacity="0.75"/><stop offset="1" stop-color="#FFF6EF" stop-opacity="0"/></radialGradient></defs>
<rect width="1600" height="900" fill="url(#naBg)"/>
<ellipse cx="800" cy="540" rx="660" ry="420" fill="url(#naGlow)"/>
${place('cat_nails', 448, 500, 0, 1.56)}
${place('cool_nails', 1100, 492, 0, 1.56)}
<rect width="1600" height="900" fill="url(#naVig)"/>
</svg>`;
  fs.writeFileSync(OUT, svg, 'utf8');
  return fs.statSync(OUT).size;
}

module.exports = { buildNailArt };

if (require.main === module) {
  const outDir = path.join(ROOT, 'assets', 'cg');
  const sz = buildNailArt(outDir);
  console.log('✔ cg_nail_art.svg  ' + (sz / 1024).toFixed(1) + ' KB  (handSVG cat_nails + cool_nails 合成，手部特写型)');
}
