#!/usr/bin/env node
/* 《你好！一周年》— tools/build-end-cg.js  (专用于三张结局 CG)
 *
 * 为什么单独一个脚本：tools/build-cg.js 会一次性重建 assets/cg/ 下全部 17 张合成 CG，
 * 其中 cg_nail_art.svg 正被另一个任务改。本脚本**只写 3 个文件**：
 *     assets/cg/cg_end_star.svg / cg_end_slow.svg / cg_end_she_first.svg
 * 其它 assets/cg/*.svg 一概不碰（脚本内没有任何全目录遍历/写入）。
 * 也**不 require src/art.js**（那边正在被改），氛围层全部由本脚本自绘。
 *
 * 三张结局原来共用「starfield 背景 + 左女右男同样大小」的同一套构图，只靠表情区分，
 * 玩家分不出差别。现在改成三种**构图语言**：
 *   A《星星的答案》 close  —— 暖金逆光 · 两人近景并肩（大特写，暖）
 *   B《慢慢来》     far    —— 大远景双人剪影（小、留白多、冷而淡、含蓄）
 *   C《这次是我先说的》 one —— 她的近景侧脸 + 他低头只露半张脸（不对称，夜色微凉）
 *
 * 素材：背景 assets/backgrounds/starfield.svg 内嵌（元素 id 加前缀避免与自绘 defs 撞车），
 *       立绘 assets/characters/<cid>/<expr>@any.png **base64 内嵌**
 *       （CG 由 <img src="assets/cg/x.svg"> 加载，SVG 里引用外部文件会被浏览器拦截）。
 *
 * 布局坐标（实测标定，不是猜的）：
 *   游戏把 1600×900 的 CG 铺满 .stage，而 .stage = min(100vw,177.78vh) × min(56.25vw,100vh)。
 *   截图时实测：stage=1600×900（--u=1），CG <img> 带 cgIn 的 scale(1.03)，
 *   所以设计坐标 ≈ 截图里的 1:1 像素（design y=320 → 截图 y=345）。
 *   ★ 对话框压在画面下方：**设计 y≳545 的部分会被对话框盖住**，
 *     所以"脸"必须落在 y≈130~545 这条带子里——头以下交给对话框自然裁掉，
 *     这也正是普通 VN 特写的取法（比硬把整张半身像塞进画布自然）。
 *   位图是 720×1080 半身取景、头部只占图高约 40%、图像下缘是满幅不透明像素，
 *   因此一律"头顶定位 + 向下溢出画布"来放大，而不是缩小。
 *   立绘墨迹中线在画布 x≈348（不是 360），figure() 已做 HEAD_BIAS 修正。
 *
 * 运行：node tools/build-end-cg.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

const W = 1600, H = 900;
const SPRITE_W = 720, SPRITE_H = 1080;
const HEAD_BIAS = 348 - SPRITE_W / 2;   /* 头部中线相对画布中心的偏移（实测） */

const R = v => Math.round(v * 100) / 100;
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* ============================ 素材 ============================ */

/* 背景：剥掉外层 <svg>，并把背景内部的 id / url(#id) 全部加前缀，
   这样它可以和本脚本自绘的 defs 安全共存于同一个 <svg>。
   注意（踩过的坑）：内嵌的 <svg> 必须显式给 width/height。
   本页面 #cg-layer img 是 object-fit:cover，而一个没有尺寸的嵌套 <svg> 会拿到
   CSS 默认的 300×150，Chrome 再把 1600×900 的 viewBox 塞进去 ⇒ 背景被放大 ~5 倍。
   给成 1600×900 后，背景与自绘人物、色罩才在同一套设计坐标里。 */
function bgContent(scene, prefix) {
  const file = path.join(ROOT, 'assets/backgrounds', scene + '.svg');
  const svg = fs.readFileSync(file, 'utf8');
  const m = svg.match(/<svg[^>]*>([\s\S]*)<\/svg>\s*$/);
  if (!m) throw new Error('无法解析背景：' + file);
  /* m[0] 是完整 <svg>…</svg>；把开标签的 width/height 钉死成 1600×900（viewBox 本来就一致） */
  let inner = m[0].replace(/^<svg([^>]*?)>/, (_, attrs) =>
    '<svg' + attrs.replace(/\s(width|height)="[^"]*"/g, '') + ' width="' + W + '" height="' + H + '">');
  if (!/^<svg[^>]*width="1600"/.test(inner)) throw new Error('背景开标签补尺寸失败：' + file);
  const ids = new Set();
  inner.replace(/\sid="([^"]+)"/g, (_, id) => { ids.add(id); return _; });
  ids.forEach(id => {
    const safe = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    inner = inner.replace(new RegExp('id="' + safe + '"', 'g'), 'id="' + prefix + id + '"')
                 .replace(new RegExp('url\\(#' + safe + '\\)', 'g'), 'url(#' + prefix + id + ')');
  });
  return inner;
}

/* 立绘位图 → data URI（缓存一份，三张 CG 共用同一批 base64） */
const uriCache = new Map();
const usedExpr = [];
function dataURI(file) {
  if (!uriCache.has(file)) uriCache.set(file, 'data:image/png;base64,' + fs.readFileSync(file).toString('base64'));
  return uriCache.get(file);
}
function spriteFile(cid, expr) {
  const f = path.join(ROOT, 'assets/characters', cid, expr + '@any.png');
  if (!fs.existsSync(f)) throw new Error('缺少立绘位图：assets/characters/' + cid + '/' + expr + '@any.png');
  return f;
}

/* ============================ 人物 ============================ */
/* c = { id, expr, x(头部墨迹中心), h(绘制高度),
        headY(头顶要落在画布的哪个 y；与 y 二选一), y(图像上缘；默认底部贴齐 H),
        flip, dim(0~1 整体透明度), extra(追加属性), filter }
   一个 <image> = 一张立绘；不裁剪、不叠滤镜，保证脸上不会糊出方块。
   注意：位图 y=0~2% 是透明留白（实测头顶在 2.1% 处），headY 已补偿。 */
const HEAD_TOP = 0.021;
function figure(c) {
  const file = spriteFile(c.id, c.expr);
  usedExpr.push(c.id + ':' + c.expr);
  const h = c.h, w = h * SPRITE_W / SPRITE_H;
  const cx = c.x - HEAD_BIAS * (c.flip ? -1 : 1);   /* 让头部墨迹中心落在 x（翻转时偏移反向） */
  const y = c.headY != null ? c.headY - h * HEAD_TOP : (c.y != null ? c.y : H - h);
  const sx = c.flip ? -1 : 1;
  const at = [
    'opacity="' + R(c.dim == null ? 1 : c.dim) + '"',
    c.filter ? 'filter="' + c.filter + '"' : '',
    c.extra || ''
  ].filter(Boolean).join(' ');
  return '<g transform="translate(' + R(cx) + ' ' + R(y) + ') scale(' + R(sx) + ' 1)">' +
    '<image x="' + R(-w / 2) + '" y="0" width="' + R(w) + '" height="' + R(h) + '" ' + at +
    ' preserveAspectRatio="none" href="' + dataURI(file) + '"/></g>';
}

/* ============================ 自绘氛围层 ============================ */
/* 星轨：方向、条数、粗细、透明度每张不同（B 最多最细，C 最少最暗） */
function trails(seed, count, opacity, width) {
  let s = seed;
  const rnd = () => (s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
  let out = '<g fill="none" stroke="#DCE6FF" stroke-linecap="round" opacity="' + opacity + '">';
  for (let i = 0; i < count; i++) {
    const x = rnd() * W, y = rnd() * H * 0.75, len = 40 + rnd() * 130;
    out += '<path d="M ' + R(x) + ' ' + R(y) + ' l ' + R(len * 0.94) + ' ' + R(len * 0.34) +
      '" stroke-width="' + R(width + rnd() * 0.8) + '"/>';
  }
  return out + '</g>';
}

function defs() {
  return '<defs>' +
    /* —— A：暖金逆光 —— */
    '<radialGradient id="bStarGlow" cx="0.52" cy="0.42" r="0.56">' +
    '<stop offset="0" stop-color="#FFD9A0" stop-opacity="0.62"/>' +
    '<stop offset="0.45" stop-color="#F2A868" stop-opacity="0.26"/>' +
    '<stop offset="1" stop-color="#E08A4A" stop-opacity="0"/></radialGradient>' +
    '<linearGradient id="bStarWarm" x1="0" y1="0" x2="0.25" y2="1">' +
    '<stop offset="0" stop-color="#FFC98A" stop-opacity="0.34"/>' +
    '<stop offset="0.55" stop-color="#E89A62" stop-opacity="0.12"/>' +
    '<stop offset="1" stop-color="#7A3F6A" stop-opacity="0.20"/></linearGradient>' +
    '<radialGradient id="bStarVig" cx="0.52" cy="0.44" r="0.78">' +
    '<stop offset="0.42" stop-color="#2A0E1E" stop-opacity="0"/>' +
    '<stop offset="1" stop-color="#2A0E1E" stop-opacity="0.46"/></radialGradient>' +
    /* —— B：冷、淡、远 —— */
    '<radialGradient id="bSlowHaze" cx="0.5" cy="0.66" r="0.72">' +
    '<stop offset="0" stop-color="#AFC6E8" stop-opacity="0.30"/>' +
    '<stop offset="0.5" stop-color="#7E9AC8" stop-opacity="0.11"/>' +
    '<stop offset="1" stop-color="#5E7AA8" stop-opacity="0"/></radialGradient>' +
    '<linearGradient id="bSlowCool" x1="0" y1="0" x2="0" y2="1">' +
    '<stop offset="0" stop-color="#22304C" stop-opacity="0.30"/>' +
    '<stop offset="0.62" stop-color="#26364F" stop-opacity="0.12"/>' +
    '<stop offset="1" stop-color="#2E4058" stop-opacity="0.24"/></linearGradient>' +
    '<radialGradient id="bSlowVig" cx="0.5" cy="0.60" r="0.66">' +
    '<stop offset="0.34" stop-color="#060A16" stop-opacity="0"/>' +
    '<stop offset="1" stop-color="#060A16" stop-opacity="0.58"/></radialGradient>' +
    '<radialGradient id="bSlowBokeh" cx="0.5" cy="0.5" r="0.5">' +
    '<stop offset="0" stop-color="#DCE8FF" stop-opacity="0.34"/>' +
    '<stop offset="1" stop-color="#DCE8FF" stop-opacity="0"/></radialGradient>' +
    /* —— C：夜色微凉，光只打在她脸上 —— */
    '<linearGradient id="bSheMoon" x1="1" y1="0" x2="0.05" y2="0.85">' +
    '<stop offset="0" stop-color="#B9CCF0" stop-opacity="0.26"/>' +
    '<stop offset="0.42" stop-color="#8FA6D6" stop-opacity="0.10"/>' +
    '<stop offset="1" stop-color="#0E1220" stop-opacity="0.30"/></linearGradient>' +
    '<linearGradient id="bSheLeftDark" x1="0" y1="0" x2="1" y2="0">' +
    '<stop offset="0" stop-color="#0A0D18" stop-opacity="0.66"/>' +
    '<stop offset="0.52" stop-color="#0A0D18" stop-opacity="0.16"/>' +
    '<stop offset="1" stop-color="#0A0D18" stop-opacity="0"/></linearGradient>' +
    /* 落在她脸上的那束冷光（椭圆径向，斜着扫过） */
    '<radialGradient id="bSheSpot" cx="0.5" cy="0.5" r="0.5">' +
    '<stop offset="0" stop-color="#E7F0FF" stop-opacity="0.28"/>' +
    '<stop offset="0.55" stop-color="#CBD9F2" stop-opacity="0.10"/>' +
    '<stop offset="1" stop-color="#CBD9F2" stop-opacity="0"/></radialGradient>' +
    /* 压在他身上、把左半张脸埋进暗里的软阴影（用在"他的组"局部坐标里，只覆盖他自己的 730×730 图像框） */
    '<linearGradient id="bSheHisShade" x1="0" y1="0" x2="1" y2="0">' +
    '<stop offset="0" stop-color="#0B0F1A" stop-opacity="0.70"/>' +
    '<stop offset="0.28" stop-color="#131926" stop-opacity="0.52"/>' +
    '<stop offset="0.60" stop-color="#1B2333" stop-opacity="0.28"/>' +
    '<stop offset="0.86" stop-color="#232C40" stop-opacity="0.08"/>' +
    '<stop offset="1" stop-color="#232C40" stop-opacity="0"/></linearGradient>' +
    '<radialGradient id="bSheVig" cx="0.42" cy="0.36" r="0.62">' +
    '<stop offset="0.30" stop-color="#05070E" stop-opacity="0"/>' +
    '<stop offset="1" stop-color="#05070E" stop-opacity="0.62"/></radialGradient>' +
    '<linearGradient id="bSheTop" x1="0" y1="0" x2="0" y2="1">' +
    '<stop offset="0" stop-color="#070A12" stop-opacity="0.42"/>' +
    '<stop offset="0.45" stop-color="#070A12" stop-opacity="0"/></linearGradient>' +
    /* 远景微光（B/C 共用，B 用来拉开「两个人很远」的层次） */
    '<radialGradient id="bFarGlow" cx="0.5" cy="0.5" r="0.5">' +
    '<stop offset="0" stop-color="#C8D8F6" stop-opacity="0.22"/>' +
    '<stop offset="1" stop-color="#C8D8F6" stop-opacity="0"/></radialGradient>' +
    '</defs>';
}

/* 背景：B 需要「放大一点 + 左移」，其它原尺寸 */
function bgLayer(scene, tf) {
  const inner = bgContent(scene, 's');
  if (!tf) return '<g>' + inner + '</g>';
  return '<g transform="translate(' + R(tf.tx) + ' ' + R(tf.ty) + ') scale(' + R(tf.k) + ')">' + inner + '</g>';
}

/* ============================ 三张构图 ============================ */
const CGS = [
  /* ---------------------------------------------------------------
   * A《星星的答案》— 他把最深那句说出口，她笑出声
   * 构图：两人近景并肩，人物占画面主体；暖金逆光从背后打过来
   * --------------------------------------------------------------- */
  {
    id: 'cg_end_star',
    bg: 'starfield',
    mood: 'close-up · warm backlight',
    build() {
      return [
        /* 星轨：中等，暖金色 */
        trails(101, 16, 0.20, 1.1),
        /* 逆光光晕：压在人物之下（先画），让人物边缘被"包"在光里 */
        '<ellipse cx="846" cy="330" rx="760" ry="560" fill="url(#bStarGlow)"/>',
        /* 他：右上，稍微后一点（头略低、身略小），读作"并肩"而不是"并排证件照" */
        figure({ id: 'jin', expr: 'soft', x: 1140, h: 1020, headY: 218 }),
        /* 她：左上，更近更大，肩压住他一点 —— 两人算一个整体，占画面主体 */
        figure({ id: 'ya', expr: 'laugh', x: 520, h: 1130, headY: 145 }),
        /* 暖色整体色罩 + 左上角暖光，让肤色偏暖 */
        '<rect width="' + W + '" height="' + H + '" fill="url(#bStarWarm)" style="mix-blend-mode:soft-light"/>',
        '<ellipse cx="380" cy="120" rx="640" ry="480" fill="url(#bStarGlow)" opacity="0.5"/>',
        '<rect width="' + W + '" height="' + H + '" fill="url(#bStarVig)"/>'
      ].join('\n');
    }
  },

  /* ---------------------------------------------------------------
   * B《慢慢来》— 话留一半，她不追问
   * 构图：大远景双人剪影，人很小（高度只有 A 的 1/4.7）、留白极多，星空为主体
   * --------------------------------------------------------------- */
  {
    id: 'cg_end_slow',
    bg: 'starfield',
    mood: 'wide · cool silence',
    build() {
      const bokeh = (x, y, r, o) =>
        '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="url(#bSlowBokeh)" opacity="' + o + '"/>';
      return [
        /* 星星更密：加一层亮星让"星空为主体" */
        trails(211, 26, 0.26, 0.9),
        bokeh(300, 150, 210, 0.9) + bokeh(1180, 100, 260, 0.75) +
        bokeh(760, 40, 150, 0.6) + bokeh(1450, 250, 180, 0.5) + bokeh(130, 330, 150, 0.45),
        /* 地平线那一线微光：他们站在"中景"（脚约在设计 y=545 的星空地平线一侧），
           下面更高的位置留给星野自带的猫/石头当地面前景——比之前"悬在天上"成立得多 */
        '<ellipse cx="940" cy="392" rx="430" ry="76" fill="url(#bFarGlow)"/>',
        /* 剪影：高度只有 210（A 的五分之一），小到几乎只是两个轮廓。
           整组压在设计 y 220~430 —— 那条带子刚好在游戏标题卡（设计 y≈250~320）之上、
           对话框（y≳545）之上，两个人都完整可见，头顶全是星空留白 */
        figure({ id: 'jin', expr: 'shy', x: 1046, h: 200, headY: 246, filter: 'url(#bSil)' }),
        figure({ id: 'ya', expr: 'smile', x: 890, h: 210, headY: 220, filter: 'url(#bSil)' }),
        /* 冷色罩（压饱和、压暖），叠一层淡雾拉开空气感 */
        '<rect width="' + W + '" height="' + H + '" fill="url(#bSlowCool)"/>',
        '<rect width="' + W + '" height="' + H + '" fill="#0C1424" opacity="0.24" style="mix-blend-mode:multiply"/>',
        '<ellipse cx="830" cy="450" rx="900" ry="320" fill="url(#bSlowHaze)"/>',
        '<rect width="' + W + '" height="' + H + '" fill="url(#bSlowVig)"/>'
      ].join('\n');
    }
  },

  /* ---------------------------------------------------------------
   * C《这次是我先说的》— 她替他说出口，"你别看我"
   * 构图：她的近景侧脸（大、偏左、亮）+ 他低头只有半张脸（小、偏右、在暗里）
   *      他的脸刻意压在设计 y≈340~590，正好错开游戏自带的标题卡（y≈440~540 那一条），
   *      眼睛留在卡片上方可见，嘴与下巴交给下方对话框——"你别看我"的躲闪由遮挡完成。
   * --------------------------------------------------------------- */
  {
    id: 'cg_end_she_first',
    bg: 'starfield',
    mood: 'asymmetric · she in the light',
    build() {
      /* 他的半张脸：把压暗层 clip 在"他自己的组"里（跟随 image 的局部坐标），
         这样软阴影只落在他的脸上，绝不会像上一版那样在画面别处糊出一个暗方块，
         也不会扫到她的下巴——半张脸进暗里，另半张还留着。 */
      const him = figure({ id: 'jin', expr: 'moved', x: 1196, h: 880, headY: 330, dim: 0.72 });
      const hisShade = him.replace('<image ',
        '<rect x="-440" y="0" width="880" height="880" fill="url(#bSheHisShade)"/><image ');
      return [
        trails(307, 10, 0.14, 1.0),
        /* 他在后面、在暗里：低头 → 头顶低于画面顶，剩下半张脸埋进阴影 */
        hisShade,
        /* 她：近景大特写，胸以下交给对话框，脸占画面左上主体 */
        figure({ id: 'ya', expr: 'tease', x: 496, h: 1110, headY: 140, flip: true }),
        /* 只打在她脸上的那束冷光（从右上斜下来） */
        '<ellipse cx="520" cy="300" rx="350" ry="270" fill="url(#bSheSpot)"/>',
        /* 夜色微凉 + 左侧压暗（视线被压到她的侧脸） */
        '<rect width="' + W + '" height="' + H + '" fill="url(#bSheMoon)"/>',
        '<rect width="' + W + '" height="' + H + '" fill="url(#bSheTop)"/>',
        '<rect width="' + W + '" height="' + H + '" fill="url(#bSheLeftDark)"/>',
        '<rect width="' + W + '" height="' + H + '" fill="url(#bSheVig)"/>'
      ].join('\n');
    }
  }
];

/* 剪影滤镜（B 专用）：压亮、压饱和，但保留轮廓 */
function silFilterDef() {
  return '<filter id="bSil" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB">' +
    '<feColorMatrix type="saturate" values="0.28"/>' +
    '<feComponentTransfer><feFuncR type="linear" slope="0.50" intercept="0.02"/>' +
    '<feFuncG type="linear" slope="0.55" intercept="0.03"/>' +
    '<feFuncB type="linear" slope="0.68" intercept="0.05"/></feComponentTransfer></filter>';
}

/* ============================ 输出 ============================ */
const outDir = path.join(ROOT, 'assets/cg');
const written = [];
const WRITE_ONLY = CGS.map(c => c.id + '.svg');

for (const def of CGS) {
  if (def.bgTf == null && def.bg !== 'starfield') throw new Error(def.id + ' 背景异常');
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" height="' + H + '">' +
    defs() + silFilterDef() + '\n' +
    bgLayer(def.bg, def.bgTf) + '\n' +
    def.build() + '\n' +
    '</svg>';
  if (!/^<svg[\s\S]*<\/svg>$/.test(svg)) throw new Error(def.id + ' 生成的 SVG 结构异常');
  const imgs = (svg.match(/<image /g) || []).length;
  if (imgs !== 2) throw new Error(def.id + ' <image> 数量不符：' + imgs + '/2');
  const pngs = (svg.match(/data:image\/png;base64,[A-Za-z0-9+/=]+/g) || []).length;
  if (pngs !== 2) throw new Error(def.id + ' base64 立绘内嵌失败：' + pngs + '/2');
  const f = path.join(outDir, def.id + '.svg');
  fs.writeFileSync(f, svg, 'utf8');
  written.push(def.id + '.svg');
  console.log('✔ ' + def.id + '.svg  ' + (fs.statSync(f).size / 1024).toFixed(1) + ' KB  [' + def.mood + ']');
}

console.log('\n本脚本只写这 ' + WRITE_ONLY.length + ' 个文件，未触碰其它 assets/cg/*.svg：');
WRITE_ONLY.forEach(f => console.log('   assets/cg/' + f));
console.log('立绘表情：' + usedExpr.join(' / '));
