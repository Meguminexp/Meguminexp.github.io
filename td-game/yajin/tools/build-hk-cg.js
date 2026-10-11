#!/usr/bin/env node
/* 《你好！一周年》— tools/build-hk-cg.js
 *
 * 只生成 **香港迪士尼这一章的三张 CG**：
 *   assets/cg/cg_hk_coaster.svg    过山车下来之后（hk_park + 两个人）
 *   assets/cg/cg_hk_coin.svg       二十周年纪念币与两个人的手（hk_shop + 手 + 金币）
 *   assets/cg/cg_hk_fireworks.svg  烟花下的两个人（hk_fireworks + 两个人 + 光斑）
 *
 * 为什么不复用 tools/build-cg.js：
 *   那个脚本会一次性重写全部合成 CG（含 cg_nail_art / cg_end_*），
 *   本脚本刻意只写上面三个文件，绝不触碰任何其它 CG。
 *
 * 做法与 tools/build-cg.js 一致（保证画风与既有 CG 对齐）：
 *   背景 = assets/backgrounds/hk_*.svg 的内容（剥掉外层 <svg> 后内嵌）
 *   立绘 = assets/characters/<cid>/<expr>@any.png，**base64 内嵌**
 *          （CG 以 <img src="assets/cg/x.svg"> 加载，浏览器禁止引用外部文件）
 *   氛围 = YJ.art.effectSVG()（bloom / nightglow）+ 本文件自带的光斑与道具层 + 暗角
 *
 * 运行：node tools/build-hk-cg.js
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
const SLOT = { left: 330, center: 800, right: 1270 };
const SPRITE_W = 720, SPRITE_H = 1080;
const PAIR_INSET = 115;
const DEFAULT_H = 780;

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
  if (hit) return { file: path.join(ROOT, hit), expr };
  const fb = path.join(ROOT, 'assets/characters', cid, 'neutral@any.png');
  if (!fs.existsSync(fb)) throw new Error('缺少立绘位图：assets/characters/' + cid + '/' + expr + '@any.png');
  fallbacks.push(cid + ':' + expr);
  return { file: fb, expr: 'neutral' };
}
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
  return '<g transform="translate(' + R(cx) + ' ' + R(y) + ') scale(' + sx + ' 1)"' +
    (c.dim ? ' opacity="0.78"' : '') + '>' +
    '<image x="' + R(-w / 2) + '" y="0" width="' + R(w) + '" height="' + R(h) + '" href="' +
    dataURI(hit.file) + '"/></g>';
}

/* ---------- 道具一：二十周年金币 + 两个人的手 ----------
 * 金币圆心 (800, 596)，半径 148：正面城堡浮雕、背面「20」，边上一圈细字。
 * 手是平涂 + 描边的胶囊指，与 src/art.js / build-cg.js 的手部画法同一路数。 */
/* 手分成"掌"（在金币后面）与"指尖"（压在金币前面）两层，
 * 这样两只手看起来是**捧着**这枚币，而不是贴在币上。 */
function handXform(cx, cy, scale, flip, rot) {
  return 'translate(' + R(cx) + ' ' + R(cy) + ') rotate(' + rot + ') scale(' + (flip ? -scale : scale) + ' ' + scale + ')';
}
function handBack(cx, cy, scale, flip, rot, skin, edge, band) {
  return '<g transform="' + handXform(cx, cy, scale, flip, rot) + '">' +
    /* 掌（大半在币的下方） */
    '<path d="M-56 6 q-18 -14 -14 -40 q4 -28 36 -34 l58 -8 q34 -4 40 26 q6 30 -24 42 l-42 20 q-34 14 -54 -6 z" ' +
    'fill="' + skin + '" stroke="' + edge + '" stroke-width="2.6"/>' +
    /* 拇指（搭在币沿外侧） */
    '<rect x="58" y="24" width="62" height="30" rx="15" fill="' + skin + '" stroke="' + edge + '" ' +
    'stroke-width="2.6" transform="rotate(-30 89 39)"/>' +
    /* 腕 + 表带 / 红绳 */
    (band ? '<rect x="-80" y="40" width="34" height="56" rx="12" fill="' + band.fill + '" stroke="' + edge +
      '" stroke-width="2.6"/>' + (band.dial ? '<circle cx="-63" cy="68" r="8" fill="' + band.dial + '" opacity="0.85"/>' : '') : '') +
    '</g>';
}
function handTips(cx, cy, scale, flip, rot, skin, edge) {
  const f = (x, y, w, h) => '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (w / 2) + '"/>';
  return '<g transform="' + handXform(cx, cy, scale, flip, rot) + '" fill="' + skin + '" stroke="' + edge + '" stroke-width="2.6">' +
    f(-52, -86, 34, 84) + f(-14, -104, 34, 96) + f(24, -96, 34, 90) + f(60, -74, 30, 74) +
    /* 指甲的一点高光 */
    '<g fill="#FFFFFF" opacity="0.35" stroke="none">' +
    '<ellipse cx="-35" cy="-78" rx="7" ry="9"/><ellipse cx="3" cy="-94" rx="7" ry="10"/>' +
    '<ellipse cx="41" cy="-86" rx="7" ry="9"/><ellipse cx="75" cy="-66" rx="6" ry="8"/></g>' +
    '</g>';
}
function propCoin() {
  const castle = '<path d="M-46 26 L-46 -2 L-32 -2 L-32 -20 L-16 -20 L-16 -2 L-8 -2 L-8 -30 L0 -46 L8 -30 L8 -2 ' +
    'L16 -2 L16 -20 L32 -20 L32 -2 L46 -2 L46 26 Z" fill="#C79A3E"/>' +
    '<path d="M-46 26 L-46 -2 L-32 -2 L-32 -20 L-16 -20 L-16 -2 L-8 -2 L-8 -30 L0 -46 L8 -30 L8 -2 L16 -2 ' +
    'L16 -20 L32 -20 L32 -2 L46 -2 L46 26 Z" fill="none" stroke="#8E6520" stroke-width="1.6"/>' +
    '<g fill="#8E6520" opacity="0.75">' +
    '<rect x="-8" y="6" width="16" height="20" rx="7"/><rect x="-24" y="-6" width="8" height="12" rx="3"/>' +
    '<rect x="16" y="-6" width="8" height="12" rx="3"/><rect x="0" y="-34" width="10" height="12" rx="4"/>' +
    '</g>' +
    '<circle cx="0" cy="-52" r="3.4" fill="#FFF3C8" opacity="0.9"/>';
  /* 注意：掌与指尖都用**画布绝对坐标**，因此不能放进 translate(800 566) 的币组里 */
  return handBack(676, 708, 0.72, false, 32, '#F3D6C8', '#4A4453', { fill: '#E8A0A8' }) +
    handBack(924, 712, 0.78, true, -32, '#EED2C2', '#4A4453', { fill: '#8E9BB5', dial: '#F6EBCB' }) +
    '<g transform="translate(800 566)">' +
    '<ellipse cx="0" cy="10" rx="230" ry="230" fill="url(#hcCoinGlow)"/>' +
    /* ---- 币身 ---- */
    '<circle cx="0" cy="0" r="148" fill="url(#hcCoin)" stroke="#8E6520" stroke-width="4"/>' +
    '<circle cx="0" cy="0" r="132" fill="none" stroke="#FFF3C8" stroke-width="2.4" opacity="0.75"/>' +
    '<g fill="#FFF3C8" opacity="0.85">' +
    '<circle cx="0" cy="-116" r="3"/><circle cx="58" cy="-100" r="3"/><circle cx="100" cy="-58" r="3"/>' +
    '<circle cx="116" cy="0" r="3"/><circle cx="100" cy="58" r="3"/><circle cx="58" cy="100" r="3"/>' +
    '<circle cx="0" cy="116" r="3"/><circle cx="-58" cy="100" r="3"/><circle cx="-100" cy="58" r="3"/>' +
    '<circle cx="-116" cy="0" r="3"/><circle cx="-100" cy="-58" r="3"/><circle cx="-58" cy="-100" r="3"/>' +
    '</g>' +
    '<g transform="translate(0 -14)">' + castle + '</g>' +
    '<text x="0" y="96" text-anchor="middle" font-family="Georgia,serif" font-size="52" font-weight="700" ' +
    'fill="#8E6520" opacity="0.95">20</text>' +
    '<path d="M-104 -70 q28 -40 76 -48 q-58 14 -76 48 z" fill="#FFFDF0" opacity="0.6"/>' +
    '</g>' +
    /* ---- 指尖（压在币上） ---- */
    handTips(676, 708, 0.72, false, 32, '#F3D6C8', '#4A4453') +
    handTips(924, 712, 0.78, true, -32, '#EED2C2', '#4A4453');
}

/* ---------- 道具二：过山车的速度线 + 照片墙的一角 ---------- */
function propCoaster() {
  let streaks = '';
  const seed = [17, 43, 71, 97, 131, 163];
  seed.forEach((s, i) => {
    const y = 250 + i * 62, x = 1180 - i * 40, len = 220 - i * 18;
    streaks += '<path d="M' + x + ' ' + y + ' q-' + R(len / 2) + ' 10 -' + len + ' 0" ' +
      'stroke="#FFFFFF" stroke-width="' + R(3.4 - i * 0.3) + '" fill="none" opacity="' + R(0.34 - i * 0.04) +
      '" stroke-linecap="round"/>';
  });
  return '<g>' + streaks +
    /* 右下角一张"照片墙"的相纸（对应出口的抓拍屏） */
    '<g transform="translate(1352 742) rotate(-6)">' +
    '<rect x="-96" y="-70" width="192" height="140" rx="8" fill="#FBF6EC" stroke="#4A4453" stroke-width="3.4"/>' +
    '<rect x="-82" y="-56" width="164" height="96" rx="5" fill="#B9C6DC"/>' +
    '<circle cx="-24" cy="-14" r="17" fill="#F2DAD1"/>' +
    '<path d="M-46 34 q22 -30 44 0 z" fill="#E8A0A8"/>' +
    '<circle cx="34" cy="-18" r="17" fill="#F7E3DA"/>' +
    '<path d="M12 34 q22 -30 44 0 z" fill="#8E9BB5"/>' +
    '<text x="0" y="60" text-anchor="middle" font-family="Georgia,serif" font-size="17" fill="#8A8272">20</text>' +
    '</g></g>';
}

/* ---------- 道具三：烟花 CG 的光斑与暖雾 ---------- */
function propBokeh() {
  const dots = [
    [214, 208, 26, '#FFE7B0', 0.5], [312, 132, 16, '#FFD98A', 0.42], [148, 300, 13, '#FFF3C8', 0.4],
    [386, 262, 11, '#FFC4DC', 0.36], [1188, 176, 22, '#FFD8E6', 0.44], [1312, 244, 14, '#FFE7B0', 0.4],
    [1428, 158, 18, '#CFEFFF', 0.34], [1082, 292, 12, '#FFE7B0', 0.34], [520, 148, 10, '#FFF3C8', 0.3],
    [960, 118, 9, '#D6F6FF', 0.32]
  ];
  return '<g>' + dots.map(d =>
    '<circle cx="' + d[0] + '" cy="' + d[1] + '" r="' + d[2] + '" fill="' + d[3] + '" opacity="' + d[4] + '"/>' +
    '<circle cx="' + R(d[0] - d[2] * 0.3) + '" cy="' + R(d[1] - d[2] * 0.3) + '" r="' + R(d[2] * 0.36) +
    '" fill="#FFFFFF" opacity="' + R(d[4] * 0.7) + '"/>').join('') +
    '<ellipse cx="330" cy="150" rx="260" ry="120" fill="#FFE7B0" opacity="0.05"/></g>';
}

/* ---------- 每张 CG 的构图 ---------- */
const CGS = [
  {
    id: 'cg_hk_coaster', bg: 'hk_park', fx: ['bloom'], seed: 71, h: 800,
    cast: [{ id: 'ya', pos: 'left', expr: 'laugh' }, { id: 'jin', pos: 'right', expr: 'awkward' }],
    extra: propCoaster,
    note: '过山车下来之后：她笑到头发全乱，他还没缓过来（hk_41 一带）'
  },
  {
    id: 'cg_hk_coin', bg: 'hk_shop', fx: [], seed: 79, h: 790,
    cast: [{ id: 'ya', pos: 'left', expr: 'proud', h: 730 }, { id: 'jin', pos: 'right', expr: 'soft', h: 730 }],
    extra: propCoin,
    note: '二十周年纪念币落在她手心里，两个人的手一起托着（hk_90 一带）'
  },
  {
    id: 'cg_hk_fireworks', bg: 'hk_fireworks', fx: ['nightglow'], seed: 83, h: 810,
    cast: [{ id: 'ya', pos: 'left', expr: 'soft' }, { id: 'jin', pos: 'right', expr: 'moved' }],
    extra: propBokeh,
    note: '最后一段烟花：两个人的影子叠在一起（hk_162 一带）'
  }
];

const outDir = path.join(ROOT, 'assets/cg');
fs.mkdirSync(outDir, { recursive: true });
let n = 0;
const sizes = [];

for (const def of CGS) {
  const figures = def.cast.map(c => {
    const item = def.h && c.h == null ? Object.assign({ h: def.h }, c) : c;
    return figure(item, def.cast.length);
  }).join('\n');
  const fxSvg = (def.fx || []).map(f =>
    YJ.art.effectSVG(f, def.seed || 3).replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')
  ).join('\n');

  const defs = '<defs>' +
    '<radialGradient id="cgVig" cx="0.5" cy="0.46" r="0.8">' +
    '<stop offset="0.45" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.42"/></radialGradient>' +
    '<linearGradient id="cgTop" x1="0" y1="0" x2="0" y2="1">' +
    '<stop offset="0" stop-color="#1A1424" stop-opacity="0.3"/><stop offset="0.35" stop-color="#1A1424" stop-opacity="0"/></linearGradient>' +
    '<linearGradient id="hcCoin" x1="0.2" y1="0" x2="0.8" y2="1">' +
    '<stop offset="0" stop-color="#FFF0BC"/><stop offset="0.42" stop-color="#EBC46A"/>' +
    '<stop offset="1" stop-color="#BE8F35"/></linearGradient>' +
    '<radialGradient id="hcCoinGlow" cx="0.5" cy="0.5" r="0.5">' +
    '<stop offset="0" stop-color="#FFF0BC" stop-opacity="0.5"/>' +
    '<stop offset="0.55" stop-color="#FFD98A" stop-opacity="0.2"/>' +
    '<stop offset="1" stop-color="#FFD98A" stop-opacity="0"/></radialGradient>' +
    '</defs>';

  const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="1600" height="900">' +
    defs + '\n' +
    bgContent(def.bg) + '\n' +
    figures + '\n' +
    fxSvg + '\n' +
    def.extra() + '\n' +
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
  console.log('✔ ' + def.id + '.svg  ' + kb.toFixed(1) + ' KB  (' + def.bg + ' + ' + def.cast.length +
    ' 张位图立绘 + 本文件自带道具层)');
  n++;
}

if (fallbacks.length) console.log('· 表情位图缺失、已回退 neutral：' + fallbacks.join(', '));
const total = sizes.reduce((a, b) => a + b[1], 0);
sizes.sort((a, b) => b[1] - a[1]);
console.log('\n最大单张：' + sizes[0][0] + ' ' + (sizes[0][1] / 1024).toFixed(1) + ' KB' +
  (sizes[0][1] > 2 * 1024 * 1024 ? '  ⚠ 超 2048 KB' : '  ✓ 未超 2048 KB'));
console.log('完成：只写出 ' + n + ' 张 CG（' + (total / 1024).toFixed(1) + ' KB），未触碰其它 assets/cg/*.svg');
