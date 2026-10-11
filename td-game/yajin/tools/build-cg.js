#!/usr/bin/env node
/* 《你好！一周年》— tools/build-cg.js (v3 · 位图立绘版)
 *
 * 合成 "背景 + 角色" 型 CG：
 *   背景 = assets/backgrounds/<scene>.svg 的内容（剥掉外层 <svg> 后内嵌，与 v2 相同）
 *   角色 = assets/characters/<cid>/<expr>@any.png，**以 base64 data URI 内嵌**
 *          （SVG 被 <img src="assets/cg/x.svg"> 加载时不能引用外部文件，浏览器会拦截，
 *            所以位图只能内嵌；见 README §「素材状态」）
 *          <expr> 无文件时自动回退到 neutral@any.png。
 *   氛围 = 复用 YJ.art.effectSVG() 的矢量氛围层（雪 / 光晕 / 夜色）+ 暗角 cgVig / 顶部压暗 cgTop。
 *
 * 构图约定：画布 1600×900；角色底部贴齐（y = 900 − 绘制高度）；
 *          水平分槽 left ≈ 330 / center ≈ 800 / right ≈ 1270 为角色墨迹中心
 *          （两人同框时各自内收 PAIR_INSET=115，否则画面正中会空出一大片背景）；
 *          绘制高度默认 780（任务给的 620~760 区间在这个素材上偏小：
 *          立绘是"半身取景"的 720×1080 位图，头部只占图高约 40%，
 *          缩到 620 时脸会很小；实拍 780~810 最像正常的双人 CG）。
 *
 * 注意：src/art.js **仍然保留**（矢量立绘与 effectSVG 是兜底），本工具不改动它的对外接口。
 *
 * 运行：node tools/build-cg.js
 * 手绘符号型的 5 张 CG（cg_forum / cg_birthday_map / cg_chat_confess / cg_stone_essay / cg_ginpu）
 * 不在此工具范围内，保持原样。
 */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

require(path.join(ROOT, 'src/core.js'));
require(path.join(ROOT, 'src/story/characters.js'));
require(path.join(ROOT, 'src/art.js'));          /* 只用它的 effectSVG（矢量氛围层） */
require(path.join(ROOT, 'assets/sprites.js'));   /* 位图立绘索引：与游戏内 src/ui.js 的 svgFor() 同源 */
const YJ = globalThis.YJ;

const W = 1600, H = 900;
const SLOT = { left: 330, center: 800, right: 1270 };   /* 角色中心 x（墨迹对齐） */
const SPRITE_W = 720, SPRITE_H = 1080;                  /* 立绘位图原始画布 */
const PAIR_INSET = 115;   /* 两人同框时各自向内收，避免画面正中空出一大片背景 */
const DEFAULT_H = 780;                                  /* 默认绘制高度（建议落在 620~760 之间的观感，见 README） */

function R(v) { return Math.round(v * 100) / 100; }

/* ---------- 背景 ---------- */
function bgContent(scene) {
  const f = path.join(ROOT, 'assets/backgrounds', scene + '.svg');
  const svg = fs.readFileSync(f, 'utf8');
  const m = svg.match(/<svg[^>]*>([\s\S]*)<\/svg>\s*$/);
  if (!m) throw new Error('无法解析背景：' + f);
  return m[1];
}

/* ---------- 立绘位图 → data URI ---------- */
const uriCache = new Map();
function dataURI(file) {
  if (!uriCache.has(file)) {
    uriCache.set(file, 'data:image/png;base64,' + fs.readFileSync(file).toString('base64'));
  }
  return uriCache.get(file);
}
const fallbacks = [];
function spriteFile(cid, expr) {
  expr = expr || 'neutral';
  const hit = (YJ.sprites && YJ.sprites.resolve) ? YJ.sprites.resolve(cid, expr, 'any') : null;
  if (hit) return { file: path.join(ROOT, hit), expr: expr, fell: false };
  /* 该表情没有位图 → 回退 neutral@any.png */
  const fb = path.join(ROOT, 'assets/characters', cid, 'neutral@any.png');
  if (!fs.existsSync(fb)) throw new Error('缺少立绘位图：assets/characters/' + cid + '/' + expr + '@any.png');
  fallbacks.push(cid + ':' + expr);
  return { file: fb, expr: 'neutral', fell: true };
}

/* 单个角色 → <image>（含水平翻转 / 压暗 / x,y 微调）
 * 底部贴齐：y = H − 绘制高度；中心对齐 SLOT[pos]（两人同框时各自内收 PAIR_INSET）。 */
function figure(c, castSize) {
  const hit = spriteFile(c.id, c.expr);
  const h = c.h || DEFAULT_H;
  const w = h * SPRITE_W / SPRITE_H;
  let base = c.x != null ? c.x : SLOT[c.pos || 'center'];
  if (c.x == null && (castSize || 1) > 1 && c.inset !== 0) {
    if ((c.pos || 'center') === 'left') base += PAIR_INSET;
    if ((c.pos || 'center') === 'right') base -= PAIR_INSET;
  }
  const cx = base + (c.dx || 0);
  const y = (c.y != null ? c.y : H - h) + (c.dy || 0);
  const sx = c.flip ? -1 : 1;
  /* 注：试过用 feDropShadow 给人物加投影来提升浅色背景上的对比，
     但立绘位图的下缘是不透明的满幅像素，投影会沿着"图像矩形"而不是"人物轮廓"
     糊出一个灰方块，实拍反而更脏 ⇒ 不加滤镜，只用暗角/顶部压暗控制层次。 */
  return '<g transform="translate(' + R(cx) + ' ' + R(y) + ') scale(' + sx + ' 1)"' +
    (c.dim ? ' opacity="0.78"' : '') + '>' +
    '<image x="' + R(-w / 2) + '" y="0" width="' + R(w) + '" height="' + R(h) + '" href="' +
    dataURI(hit.file) + '"/></g>';
}

/* ---------- 道具（非角色，矢量小物，画风与立绘的平涂描边一致） ---------- */
/* cg_jk：她把商场橱窗照（一排裙子，中间那条浅蓝）在手机上转给他看；
   男主没有穿裙子，红着脸别开视线（对应 src/story/chapter9.js c9_067~c9_074）。 */
function propJKPhone() {
  const dress = (x, y, s, body, shade) =>
    /* 挂钩 + 衣架 */
    '<circle cx="' + R(x) + '" cy="' + R(y - 74 * s) + '" r="' + R(4 * s) + '" fill="none" stroke="#4A4453" stroke-width="' + R(3 * s) + '"/>' +
    '<path d="M ' + R(x) + ' ' + R(y - 70 * s) + ' l ' + R(-26 * s) + ' ' + R(16 * s) +
    ' M ' + R(x) + ' ' + R(y - 70 * s) + ' l ' + R(26 * s) + ' ' + R(16 * s) + '" fill="none" stroke="#4A4453" stroke-width="' + R(3 * s) + '" stroke-linecap="round"/>' +
    /* 上身 */
    '<path d="M ' + R(x - 26 * s) + ' ' + R(y - 52 * s) + ' L ' + R(x - 34 * s) + ' ' + R(y - 6 * s) +
    ' L ' + R(x + 34 * s) + ' ' + R(y - 6 * s) + ' L ' + R(x + 26 * s) + ' ' + R(y - 52 * s) + ' Z" fill="' + body + '" stroke="#4A4453" stroke-width="' + R(3 * s) + '"/>' +
    /* 裙摆 */
    '<path d="M ' + R(x - 34 * s) + ' ' + R(y - 6 * s) + ' L ' + R(x - 60 * s) + ' ' + R(y + 62 * s) +
    ' Q ' + R(x) + ' ' + R(y + 80 * s) + ' ' + R(x + 60 * s) + ' ' + R(y + 62 * s) +
    ' L ' + R(x + 34 * s) + ' ' + R(y - 6 * s) + ' Z" fill="' + body + '" stroke="#4A4453" stroke-width="' + R(3 * s) + '"/>' +
    /* 褶皱 */
    '<path d="M ' + R(x - 18 * s) + ' ' + R(y + 8 * s) + ' L ' + R(x - 26 * s) + ' ' + R(y + 56 * s) +
    ' M ' + R(x + 18 * s) + ' ' + R(y + 8 * s) + ' L ' + R(x + 26 * s) + ' ' + R(y + 56 * s) + '" fill="none" stroke="' + shade + '" stroke-width="' + R(2.4 * s) + '" opacity=".75"/>';

  const screen = '<rect x="-73" y="-138" width="146" height="276" rx="14" fill="url(#jkPhScreen)"/>' +
    '<g clip-path="url(#jkPhClip)">' +
    /* 橱窗：灯带 + 地面 */
    '<rect x="-73" y="70" width="146" height="68" fill="#E4D6C6"/>' +
    '<rect x="-73" y="-138" width="146" height="16" fill="#F7E7CB"/>' +
    '<circle cx="-38" cy="-116" r="7" fill="#FFF0CE"/><circle cx="0" cy="-118" r="7" fill="#FFF0CE"/><circle cx="38" cy="-116" r="7" fill="#FFF0CE"/>' +
    dress(-40, -34, 0.52, '#D9BCC6', '#B9949F') +
    dress(0, -26, 0.66, '#9CC8E8', '#6E9DBE') +
    dress(40, -34, 0.52, '#CFCDB2', '#AAA88E') +
    /* 玻璃反光 */
    '<path d="M -73 46 L -16 -138 L 16 -138 L -41 46 Z" fill="#FFFFFF" opacity=".18"/>' +
    '</g>' +
    '<rect x="-73" y="-138" width="146" height="276" rx="14" fill="none" stroke="#15121C" stroke-width="2.6"/>';

  /* 手：左侧四指从机身后面扣住边缘、指尖压在正面，右侧拇指搭在正面 */
  const finger = y => '<path d="M -106 ' + R(y + 12) + ' C -106 ' + R(y) + ' -96 ' + R(y - 2) + ' -84 ' + R(y - 2) +
    ' L -70 ' + R(y - 2) + ' C -55 ' + R(y - 2) + ' -46 ' + R(y + 5) + ' -46 ' + R(y + 12) +
    ' C -46 ' + R(y + 19) + ' -55 ' + R(y + 26) + ' -70 ' + R(y + 26) + ' L -84 ' + R(y + 26) +
    ' C -96 ' + R(y + 26) + ' -106 ' + R(y + 24) + ' -106 ' + R(y + 12) + ' Z" ' +
    'fill="#F7E3DA" stroke="#4A4453" stroke-width="3.4"/>';
  const hand = '<g>' +
    '<rect x="-114" y="-64" width="34" height="128" rx="17" fill="#F2DAD1" stroke="#4A4453" stroke-width="3.4"/>' +
    finger(-60) + finger(-30) + finger(0) + finger(30) +
    '<path d="M 62 -40 C 96 -36 108 0 98 30 C 90 54 70 62 60 50 C 52 38 58 22 68 12 C 78 2 74 -20 62 -40 Z" ' +
    'fill="#F2DAD1" stroke="#4A4453" stroke-width="3.4"/>' +
    '</g>';

  return '<g transform="translate(712 650) rotate(-7)">' +
    '<ellipse cx="0" cy="0" rx="190" ry="260" fill="url(#jkPhGlow)"/>' +
    '<rect x="-85" y="-150" width="170" height="300" rx="26" fill="#2B2734" stroke="#15121C" stroke-width="4.5"/>' +
    hand +
    screen +
    '</g>';
}

/* 每张 CG 的构图：背景 + 位图立绘（表情 / 位置 / 高度） + 氛围特效 */
const CGS = [
  { id: 'cg_first_rank', bg: 'idv_map', fx: ['nightglow'], seed: 3,
    cast: [{ id: 'ya', pos: 'left', expr: 'excited' }, { id: 'jin', pos: 'right', expr: 'smile' }] },

  { id: 'cg_zero_clock', bg: 'dorm', fx: ['bloom'], seed: 5,
    cast: [{ id: 'ya', pos: 'left', expr: 'laugh' }, { id: 'jin', pos: 'right', expr: 'cry' }] },

  { id: 'cg_first_meet', bg: 'campus_gate', fx: ['snow'], seed: 7,
    cast: [{ id: 'ya', pos: 'left', expr: 'shy' }, { id: 'jin', pos: 'right', expr: 'shy' }] },

  { id: 'cg_bench', bg: 'bench_night', fx: ['nightglow'], seed: 11, h: 810,
    cast: [{ id: 'ya', pos: 'left', expr: 'blush' }, { id: 'jin', pos: 'right', expr: 'soft' }] },

  { id: 'cg_airport_hug', bg: 'airport', fx: ['nightglow'], seed: 13, h: 800,
    cast: [{ id: 'ya', pos: 'left', expr: 'cry', flip: true }, { id: 'jin', pos: 'right', expr: 'cry' }] },

  { id: 'cg_suzhou_hall', bg: 'conference', fx: ['bloom'], seed: 17,
    cast: [{ id: 'ya', pos: 'left', expr: 'serious' }, { id: 'jin', pos: 'right', expr: 'soft', dim: true }] },

  { id: 'cg_newyear', bg: 'shanghai_night', fx: ['nightglow'], seed: 19,
    cast: [{ id: 'ya', pos: 'left', expr: 'laugh' }, { id: 'jin', pos: 'right', expr: 'smile' }] },

  { id: 'cg_marshmallow', bg: 'home_yard', fx: ['snow'], seed: 23,
    cast: [{ id: 'ya', pos: 'left', expr: 'laugh' }, { id: 'jin', pos: 'right', expr: 'moved' }] },

  { id: 'cg_beach', bg: 'beach', fx: ['bloom'], seed: 29,
    cast: [{ id: 'ya', pos: 'left', expr: 'smile' }, { id: 'jin', pos: 'right', expr: 'smile' }] },

  { id: 'cg_underwater', bg: 'underwater', fx: [], seed: 31,
    cast: [{ id: 'ya', pos: 'left', expr: 'excited' }, { id: 'jin', pos: 'right', expr: 'surprised' }] },

  { id: 'cg_yiwu_gifts', bg: 'mall', fx: ['bloom'], seed: 37,
    cast: [{ id: 'ya', pos: 'left', expr: 'proud' }, { id: 'jin', pos: 'right', expr: 'laugh' }] },

  /* 对应 chapter9 c9_065b~c9_074：她没有真的让他穿 JK 裙，
     而是把商场橱窗里那条浅蓝裙子的照片在手机上转给他看；他红着脸别开视线。 */
  { id: 'cg_jk', bg: 'hotel', fx: ['bloom'], seed: 41, extra: propJKPhone, h: 790,
    cast: [{ id: 'ya', pos: 'left', expr: 'laugh' },
           { id: 'jin', pos: 'right', expr: 'shy', inset: 0, x: 1170 }] },

  { id: 'cg_anniversary', bg: 'hotel', fx: ['bloom'], seed: 43, h: 810,
    cast: [{ id: 'ya', pos: 'left', expr: 'blush' }, { id: 'jin', pos: 'right', expr: 'moved' }] },

  { id: 'cg_end_star', bg: 'starfield', fx: ['nightglow'], seed: 47,
    cast: [{ id: 'ya', pos: 'left', expr: 'laugh' }, { id: 'jin', pos: 'right', expr: 'soft' }] },

  { id: 'cg_end_slow', bg: 'starfield', fx: ['nightglow'], seed: 53,
    cast: [{ id: 'ya', pos: 'left', expr: 'smile' }, { id: 'jin', pos: 'right', expr: 'shy' }] },

  { id: 'cg_end_she_first', bg: 'starfield', fx: ['nightglow'], seed: 59,
    cast: [{ id: 'ya', pos: 'left', expr: 'tease' }, { id: 'jin', pos: 'right', expr: 'moved' }] }
];

const outDir = path.join(ROOT, 'assets/cg');
fs.mkdirSync(outDir, { recursive: true });
const sizes = [];
let n = 0;

for (const def of CGS) {
  const figures = def.cast.map(c => {
    const item = def.h && c.h == null ? Object.assign({ h: def.h }, c) : c;
    return figure(item, def.cast.length);
  }).join('\n');
  const fxSvg = (def.fx || []).map(f =>
    YJ.art.effectSVG(f, def.seed || 3).replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')
  ).join('\n');
  /* 道具层（可选）：贴在角色之上、暗角之下 */
  let extra = '';
  if (def.extra) {
    const defs = '<defs>' +
      '<linearGradient id="jkPhScreen" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#FBF3E6"/><stop offset="1" stop-color="#E7D7C6"/></linearGradient>' +
      '<radialGradient id="jkPhGlow" cx="0.5" cy="0.5" r="0.5">' +
      '<stop offset="0" stop-color="#FFF6E2" stop-opacity="0.5"/>' +
      '<stop offset="1" stop-color="#FFF6E2" stop-opacity="0"/></radialGradient>' +
      '<clipPath id="jkPhClip"><rect x="-73" y="-138" width="146" height="276" rx="14"/></clipPath>' +
      '</defs>';
    extra = defs + def.extra();
  }
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="1600" height="900">' +
    '<defs>' +
    '<radialGradient id="cgVig" cx="0.5" cy="0.46" r="0.8">' +
    '<stop offset="0.45" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.42"/></radialGradient>' +
    '<linearGradient id="cgTop" x1="0" y1="0" x2="0" y2="1">' +
    '<stop offset="0" stop-color="#1A1424" stop-opacity="0.3"/><stop offset="0.35" stop-color="#1A1424" stop-opacity="0"/></linearGradient>' +
    '</defs>\n' +
    bgContent(def.bg) + '\n' +
    figures + '\n' +
    fxSvg + '\n' +
    extra + (extra ? '\n' : '') +
    '<rect width="1600" height="900" fill="url(#cgTop)"/>\n' +
    '<rect width="1600" height="900" fill="url(#cgVig)"/>\n' +
    '</svg>';

  if (!/^<svg[\s\S]*<\/svg>\s*$/.test(svg)) throw new Error(def.id + ' 生成的 SVG 结构异常');
  const imgs = (svg.match(/<image /g) || []).length;
  if (imgs !== def.cast.length) throw new Error(def.id + ' <image> 数量不符：' + imgs + '/' + def.cast.length);
  const f = path.join(outDir, def.id + '.svg');
  fs.writeFileSync(f, svg, 'utf8');
  const kb = fs.statSync(f).size / 1024;
  sizes.push([def.id, fs.statSync(f).size]);
  console.log('✔ ' + def.id + '.svg  ' + kb.toFixed(1) + ' KB  (' + def.bg + ' + ' + def.cast.length + ' 张位图立绘' +
    (def.extra ? ' + 道具' : '') + ')');
  n++;
}

/* 手部特写 CG（chapter8 c8_92）委托给独立脚本 tools/build-nail-cg.js ——
 * 这样"只重建这一张"不必跑完整个 build-cg.js（避免覆盖并行任务产出的其它 CG）。
 * 注意：不要把这段删掉，否则 npm run build 会漏掉 cg_nail_art.svg。 */
{
  const sz = require('./build-nail-cg.js').buildNailArt(outDir);
  sizes.push(['cg_nail_art', sz]);
  console.log('✔ cg_nail_art.svg  ' + (sz / 1024).toFixed(1) + ' KB  (handSVG cat_nails + cool_nails 合成，手部特写型)');
  n++;
}

if (fallbacks.length) {
  console.log('\n· 表情位图缺失、已回退 neutral 的槽位 ' + fallbacks.length + ' 处：' + fallbacks.join(', '));
}
const total = sizes.reduce((a, b) => a + b[1], 0);
sizes.sort((a, b) => b[1] - a[1]);
console.log('\n最大单张：' + sizes[0][0] + ' ' + (sizes[0][1] / 1024).toFixed(1) + ' KB（阈值 2048 KB）' +
  (sizes[0][1] > 2 * 1024 * 1024 ? '  ⚠ 超阈值，需下采样' : '  ✓ 未超阈值'));
console.log('完成：合成 ' + n + ' 张 CG，assets/cg/ 共 ' + (total / 1024 / 1024).toFixed(2) + ' MB' +
  '（其余 5 张符号化 CG 保持手绘，未改动）');
