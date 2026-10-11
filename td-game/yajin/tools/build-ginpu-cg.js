#!/usr/bin/env node
/* 《你好！一周年》— tools/build-ginpu-cg.js
 *
 * 只生成 **一张 CG**：assets/cg/cg_ginpu.svg（剧情 ch9 义乌玩偶堆 / "我怀孕了"企鹅梗）。
 * 另附一张自检对照图：assets/ginpu/doll_reference.svg（同一套矢量部件的大图，供人工比对）。
 *
 * 为什么不走 tools/build-cg.js：
 *   那个脚本会一次性重写全部 17 张合成 CG（含 cg_nail_art / cg_end_*），
 *   本脚本刻意只写上面两个文件，绝不触碰其它 CG。
 *
 * 内容来源：**纯手写 SVG**（无位图、无外部素材、无 base64、与任何第三方 IP 无关）。
 *   Ginpu 是**本作原创的企鹅玩偶角色**（详见 assets/CREDITS_GINPU.md），
 *   形象由本文件从零画出来，没有参考、复制或演绎任何第三方角色设计。
 *
 * Ginpu 的识别点（本文件逐条落实，避免画成"通用企鹅"，也刻意区别于任何现成企鹅角色）：
 *   1. 身体是**深蓝灰**（不是黑），鳍再亮一档的蓝灰；只有肚皮是暖白，
 *      头部**整块深蓝灰**、不向脸的下半延伸白色——没有"黑头罩 + 白脸"那种读法
 *   2. **短小的金黄小尖喙**：喙宽仅约头宽的 1/4，长不足喙宽的 1.3 倍，
 *      圆顶、向下收成小尖，位置在两眼之间偏下——不是又大又垂的喙
 *   3. **小眼睛**（白眼球半径约头宽的 1/7）+ **腮红**两块，眼神轻，不占脸
 *   4. 头顶**三根呆毛**、肚皮正中**一条竖的浅蓝肚纹**、蓝灰三趾小脚掌——
 *      这三样是 Ginpu 自己的记号
 *
 * 构图：21 只 Ginpu 玩偶叠成小山（4 层 + 1 只翻倒在堆顶），画面 1600×900。
 *      游戏内对话框会盖住 y ≈ 622 以下（index.html #dialog：bottom 34u、高 244u），
 *      所以小山控制在该线以上，下方只留被子。
 *
 * 运行：node tools/build-ginpu-cg.js
 *      node tools/build-ginpu-cg.js --sheet-only   只出对照图
 */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const OUT_CG = path.join(ROOT, 'assets/cg/cg_ginpu.svg');
const OUT_REF = path.join(ROOT, 'assets/ginpu/doll_reference.svg');

/* ---------------- 配色（与 assets/backgrounds/hotel.svg 同色系，夜色偏暖）
   角色配色与"黑白 + 橙红"的常见企鹅角色刻意拉开：身体深蓝灰、鳍亮蓝灰、
   喙与脚是柔和的浅金，肚皮暖白并带一条浅蓝竖纹。 ---------------- */
const C = {
  body: '#3B4A63', bodyDeep: '#26314A', bodyLite: '#5A6E93', bodyEdge: '#8A9CBB',
  belly: '#F6F2E9', bellyShade: '#DDD6C7', bellyEdge: '#BFB6A4', bellyStripe: '#D3E5F7',
  beak: '#F2C44F', beakDeep: '#BC8B1C', beakLite: '#FFF0B8', beakLo: '#D9A62E',
  foot: '#E9B45C', footDeep: '#B98430', footLite: '#FBDD9E',
  eye: '#FCFAF6', pupil: '#16171C', blush: '#E9838F',
  stitch: '#8C97AB'
};

/* ---------------- 玩偶局部坐标：原点 = 两脚之间的地面点，向上为负 y，总高约 322 ---------------- */
const BODY = 'M0,-196 C47,-196 82,-152 82,-98 C82,-44 57,-8 0,-8 C-57,-8 -82,-44 -82,-98 C-82,-152 -47,-196 0,-196 Z';
const BELLY = 'M0,-214 C40,-214 63,-164 63,-106 C63,-48 39,-19 0,-19 C-39,-19 -63,-48 -63,-106 C-63,-164 -40,-214 0,-214 Z';
const HEAD_CY = -254, HEAD_RX = 74, HEAD_RY = 72;

/* 脚掌：扁椭圆 + 3 个趾头（Ginpu 的浅金三趾小脚掌），带趾缝与顶部高光 */
function foot(cx, tilt) {
  return `<g transform="translate(${cx},-16) rotate(${tilt})">
      <ellipse cx="0" cy="0" rx="38" ry="16" fill="${C.foot}"/>
      <circle cx="-21" cy="8" r="10.5" fill="${C.foot}"/><circle cx="0" cy="10" r="11.5" fill="${C.foot}"/><circle cx="21" cy="8" r="10.5" fill="${C.foot}"/>
      <path d="M-23,6 q3,7 6,9 M-4,8 q3,7 6,9 M-31,4 q2,8 5,10" stroke="${C.footDeep}" stroke-width="2.6" fill="none" opacity="0.55" stroke-linecap="round"/>
      <path d="M-30,-6 q30,-9 60,0" stroke="${C.footLite}" stroke-width="4" fill="none" opacity="0.4" stroke-linecap="round"/>
    </g>`;
}

/* 鳍：比身体亮一档的蓝灰短鳍，贴身，避免整体糊成一块 */
const WING_L = 'M-56,-190 C-84,-178 -97,-138 -87,-110 C-83,-97 -67,-96 -64,-110 C-57,-140 -53,-170 -56,-190 Z';
const WING_R = 'M56,-190 C84,-178 97,-138 87,-110 C83,-97 67,-96 64,-110 C57,-140 53,-170 56,-190 Z';

/* 喙：Ginpu 的**短小金尖喙**。
   宽仅 38（约头宽 148 的 1/4）、高 46，圆顶、向下收成小尖，
   顶在 y=-283、尖在 y=-237，正好落在两眼之间偏下；下面一条短喙缝把它分成上下喙。 */
const BEAK_UP = 'M-19,-273 C-9,-283 9,-283 19,-273 C20,-262 10,-246 0,-237 C-10,-246 -20,-262 -19,-273 Z';

/* 头顶三根呆毛：Ginpu 自己的记号之一，也让轮廓不至于太"圆滚" */
function tuft() {
  return `<g fill="none" stroke="${C.body}" stroke-width="10" stroke-linecap="round">
      <path d="M-13,-314 C-23,-331 -18,-345 -6,-343"/>
      <path d="M2,-320 C1,-340 9,-353 20,-348"/>
      <path d="M17,-310 C27,-324 35,-326 40,-318"/>
    </g>
    <g fill="none" stroke="${C.bodyLite}" stroke-width="3.4" stroke-linecap="round" opacity="0.95">
      <path d="M-13,-317 C-21,-331 -17,-341 -8,-340"/>
      <path d="M3,-323 C2,-339 9,-350 17,-346"/>
      <path d="M18,-313 C27,-323 33,-325 37,-319"/>
    </g>`;
}

/* ---------------- 眼睛：4 种情绪，全部叠在同一局部坐标上。
   小眼睛 + 腮红：白眼球 rx=10.4（约头宽的 1/14），瞳孔更小，
   刻意不做"占满半张脸的大白眼 + 大量高光"。 ---------------- */
const EYE_CY = -281, EYE_CX = 27;
function eyePair(kind) {
  const white = (x) => `<ellipse cx="${x}" cy="${EYE_CY}" rx="10.4" ry="11.8" fill="${C.eye}"/>`;
  const bigWhite = (x) => `<ellipse cx="${x}" cy="${EYE_CY - 1}" rx="11.6" ry="13" fill="${C.eye}"/>`;
  const open = (x, dx, dy, k) => `
      <ellipse cx="${x + dx}" cy="${EYE_CY + dy}" rx="${6.6 * k}" ry="${7.8 * k}" fill="${C.pupil}"/>
      <ellipse cx="${x + dx - 2.2}" cy="${EYE_CY + dy - 3.1}" rx="2.5" ry="2.9" fill="#FFFFFF"/>
      <ellipse cx="${x + dx + 2.1}" cy="${EYE_CY + dy + 3}" rx="1.2" ry="1.4" fill="#FFFFFF" opacity="0.8"/>`;
  const arc = (x) => `<path d="M${x - 8.4},${EYE_CY + 2.6} Q${x},${EYE_CY - 7.4} ${x + 8.4},${EYE_CY + 2.6}" stroke="${C.pupil}" stroke-width="4.2" fill="none" stroke-linecap="round"/>`;
  const blush = (x) => `<ellipse cx="${x}" cy="${EYE_CY + 19}" rx="14.5" ry="8" fill="${C.blush}" opacity="0.42"/>`;
  const cheeks = blush(-44) + blush(44);
  if (kind === 'happy') return white(-EYE_CX) + white(EYE_CX) + arc(-EYE_CX) + arc(EYE_CX) + cheeks;
  if (kind === 'wide') return bigWhite(-EYE_CX) + bigWhite(EYE_CX) + open(-EYE_CX, 0, 0.6, 0.85) + open(EYE_CX, 0, 0.6, 0.85) + cheeks;
  if (kind === 'wink') return white(-EYE_CX) + open(-EYE_CX, 0.6, 1.6, 1) + white(EYE_CX) + arc(EYE_CX) + cheeks;
  return white(-EYE_CX) + white(EYE_CX) + open(-EYE_CX, 0.8, 1.6, 1) + open(EYE_CX, 0.8, 1.6, 1) + cheeks;
}

/* ---------------- 配饰（呼应剧情："围巾的、洗澡的、抱鱼的、戴帽子的"） ---------------- */
function scarf() {
  return `<g>
      <path d="M-48,-200 C-20,-212 20,-212 48,-200 C51,-190 44,-181 35,-181 L-35,-181 C-44,-181 -51,-190 -48,-200 Z" fill="#C0574E"/>
      <path d="M-48,-200 C-20,-212 20,-212 48,-200" stroke="#DB766C" stroke-width="4" fill="none" opacity="0.7"/>
      <path d="M13,-186 C30,-172 36,-150 28,-133 C22,-120 4,-123 9,-140 C15,-158 13,-174 7,-184 Z" fill="#AE4A42"/>
      <path d="M10,-139 l-5,12 M18,-136 l-4,12" stroke="#8E3A34" stroke-width="2.4" stroke-linecap="round" opacity="0.8"/>
    </g>`;
}
function hat() {
  return `<g>
      <path d="M-56,-292 C-56,-332 -29,-348 0,-348 C29,-348 56,-332 56,-292 Z" fill="#6F8F5E"/>
      <path d="M-56,-292 C-34,-284 34,-284 56,-292" stroke="#93B27F" stroke-width="5" fill="none" opacity="0.8"/>
      <rect x="-61" y="-298" width="122" height="21" rx="10.5" fill="#EDE3CD"/>
      <path d="M-38,-326 l76,0 M-44,-312 l88,0" stroke="#556F46" stroke-width="3" opacity="0.5"/>
      <circle cx="0" cy="-352" r="11" fill="#EDE3CD"/>
    </g>`;
}
function fish() {
  return `<g transform="translate(-80,-116) rotate(-14)">
      <path d="M-30,0 C-18,-15 12,-17 24,-6 L38,-15 L33,0 L38,15 L24,6 C12,17 -18,15 -30,0 Z" fill="#9FB3C2"/>
      <path d="M-18,-6 C-8,-12 6,-12 14,-7" stroke="#C9D8E2" stroke-width="4" fill="none" opacity="0.8"/>
      <circle cx="-16" cy="-3" r="2.8" fill="${C.pupil}"/>
    </g>`;
}
const ACC = { scarf, hat, fish };

/* ---------------- 玩偶本体（不含眼睛） ---------------- */
function dollBody() {
  return `
  <g>
    ${foot(-48, -7)}${foot(48, 7)}

    <path d="${BODY}" fill="${C.body}"/>
    <g clip-path="url(#clipBody)">
      <ellipse cx="0" cy="-16" rx="82" ry="36" fill="${C.bodyDeep}" opacity="0.55"/>
      <ellipse cx="56" cy="-92" rx="32" ry="72" fill="${C.bodyDeep}" opacity="0.42"/>
    </g>
    <path d="${BODY}" fill="none" stroke="${C.bodyEdge}" stroke-width="7" opacity="0.6" clip-path="url(#clipRim)"/>

    <path d="${BELLY}" fill="${C.belly}"/>
    <g clip-path="url(#clipBelly)">
      <ellipse cx="34" cy="-72" rx="42" ry="70" fill="${C.bellyShade}" opacity="0.55"/>
      <ellipse cx="0" cy="-26" rx="58" ry="22" fill="${C.bellyShade}" opacity="0.6"/>
      <ellipse cx="-24" cy="-150" rx="30" ry="30" fill="#FFFDF7" opacity="0.8"/>
      <!-- 肚纹：Ginpu 的记号之一，肚皮正中一条竖的浅蓝纹 -->
      <rect x="-13" y="-208" width="26" height="178" rx="13" fill="${C.bellyStripe}" opacity="0.7"/>
      <rect x="-13" y="-208" width="26" height="178" rx="13" fill="none" stroke="#AFC9E4" stroke-width="1.6" opacity="0.5"/>
    </g>
    <path d="${BELLY}" fill="none" stroke="${C.bellyEdge}" stroke-width="2.6" opacity="0.3"/>

    <path d="${WING_L}" fill="${C.bodyLite}"/>
    <path d="${WING_L}" fill="none" stroke="${C.bodyDeep}" stroke-width="2.6" opacity="0.45"/>
    <path d="${WING_R}" fill="${C.bodyLite}"/>
    <path d="${WING_R}" fill="none" stroke="${C.bodyDeep}" stroke-width="2.6" opacity="0.45"/>

    <ellipse cx="0" cy="${HEAD_CY}" rx="${HEAD_RX}" ry="${HEAD_RY}" fill="${C.body}"/>
    <g clip-path="url(#clipHead)">
      <ellipse cx="0" cy="-196" rx="70" ry="24" fill="${C.bodyDeep}" opacity="0.5"/>
      <ellipse cx="54" cy="-258" rx="32" ry="46" fill="${C.bodyDeep}" opacity="0.4"/>
    </g>
    <ellipse cx="0" cy="${HEAD_CY}" rx="${HEAD_RX}" ry="${HEAD_RY}" fill="none" stroke="${C.bodyEdge}" stroke-width="7" opacity="0.55" clip-path="url(#clipRim)"/>

    <!-- 下颌一抹亮蓝灰：让头不死平，但绝不是"白脸下缘" -->
    <ellipse cx="0" cy="-196" rx="56" ry="24" fill="${C.bodyLite}" opacity="0.3" clip-path="url(#clipHead)"/>

    <!-- 喙：短小的金黄小尖喙 -->
    <path d="${BEAK_UP}" fill="${C.beak}"/>
    <path d="${BEAK_UP}" fill="none" stroke="${C.beakDeep}" stroke-width="2.2" opacity="0.55"/>
    <path d="M-13,-252 Q0,-247 13,-252" stroke="${C.beakDeep}" stroke-width="2.6" fill="none" opacity="0.85"/>
    <path d="M-11,-272 C-5,-278 4,-279 10,-276" stroke="${C.beakLite}" stroke-width="5" fill="none" opacity="0.75" stroke-linecap="round"/>

    ${tuft()}

    <!-- 绒布缝线 -->
    <g fill="none" stroke="${C.stitch}" stroke-width="2" stroke-dasharray="7 7" opacity="0.4">
      <path d="M-58,-182 C-30,-198 30,-198 58,-182"/>
      <path d="M-50,-118 C-55,-140 -54,-166 -49,-180" stroke-dasharray="6 6"/>
      <path d="M50,-118 C55,-140 54,-166 49,-180" stroke-dasharray="6 6"/>
    </g>
  </g>`;
}

/* 背面款：整只深蓝灰（后脑、背、鳍、脚），给玩偶堆增加层次 */
function dollBack() {
  return `
  <g>
    ${foot(-48, -7)}${foot(48, 7)}
    <path d="${BODY}" fill="${C.body}"/>
    <g clip-path="url(#clipBody)">
      <ellipse cx="0" cy="-16" rx="82" ry="36" fill="${C.bodyDeep}" opacity="0.55"/>
      <ellipse cx="56" cy="-92" rx="32" ry="72" fill="${C.bodyDeep}" opacity="0.42"/>
    </g>
    <path d="${BODY}" fill="none" stroke="${C.bodyEdge}" stroke-width="8" opacity="0.7" clip-path="url(#clipRim)"/>
    <path d="${WING_L}" fill="${C.bodyLite}" opacity="0.9"/>
    <path d="${WING_R}" fill="${C.bodyLite}" opacity="0.9"/>
    <ellipse cx="0" cy="${HEAD_CY}" rx="${HEAD_RX}" ry="${HEAD_RY}" fill="${C.body}"/>
    <g clip-path="url(#clipHead)">
      <ellipse cx="54" cy="-258" rx="32" ry="46" fill="${C.bodyDeep}" opacity="0.4"/>
      <ellipse cx="0" cy="-198" rx="58" ry="20" fill="${C.bodyDeep}" opacity="0.4"/>
    </g>
    <ellipse cx="0" cy="${HEAD_CY}" rx="${HEAD_RX}" ry="${HEAD_RY}" fill="none" stroke="${C.bodyEdge}" stroke-width="8" opacity="0.68" clip-path="url(#clipRim)"/>
    ${tuft()}
    <g fill="none" stroke="${C.stitch}" stroke-width="2" stroke-dasharray="7 7" opacity="0.32">
      <path d="M0,-318 L0,-192"/>
      <path d="M-56,-180 C-30,-196 30,-196 56,-180"/>
    </g>
  </g>`;
}

/* ---------------- 玩偶堆：4 层 + 堆顶翻倒的一只 ---------------- */
/* x,y = 底部中心；s = 缩放；r = 绕底部旋转；acc = 配饰；back = 背面款 */
const DOLLS = [
  /* 第 1 排（山顶，最小，只在中段——这样整体轮廓才是"小山"而不是"一排墙"） */
  { x: 560, y: 386, s: 0.50, r: -8, back: true },
  { x: 682, y: 393, s: 0.51, r: 6, eyes: 'happy', acc: 'hat' },
  { x: 804, y: 385, s: 0.50, r: -5, eyes: 'open' },
  { x: 926, y: 393, s: 0.51, r: 8, back: true },
  { x: 1048, y: 386, s: 0.50, r: -7, eyes: 'wide' },

  /* 第 2 排 */
  { x: 470, y: 486, s: 0.67, r: 7, back: true },
  { x: 583, y: 496, s: 0.68, r: -6, eyes: 'open' },
  { x: 696, y: 488, s: 0.70, r: 5, eyes: 'happy', acc: 'scarf' },
  { x: 809, y: 497, s: 0.69, r: -9, eyes: 'wide' },
  { x: 922, y: 488, s: 0.70, r: 8, back: true },
  { x: 1035, y: 497, s: 0.68, r: -5, eyes: 'open', acc: 'hat' },
  { x: 1148, y: 486, s: 0.67, r: 11, eyes: 'happy' },

  /* 第 3 排（最近最大） */
  { x: 430, y: 610, s: 0.86, r: -11, eyes: 'open' },
  { x: 578, y: 620, s: 0.89, r: -4, eyes: 'happy', acc: 'scarf' },
  { x: 726, y: 612, s: 0.91, r: 6, eyes: 'open' },
  { x: 874, y: 620, s: 0.92, r: -6, eyes: 'wide', acc: 'hat' },
  { x: 1022, y: 612, s: 0.90, r: 5, eyes: 'happy' },
  { x: 1170, y: 618, s: 0.86, r: 10, eyes: 'wink', acc: 'fish' },

  /* 向两侧"溢出来"的两只，把底座拉宽 */
  { x: 320, y: 596, s: 0.78, r: -27, eyes: 'open', acc: 'scarf' },
  { x: 1282, y: 594, s: 0.78, r: 26, eyes: 'open' }
];

function place(d) {
  const t = `translate(${d.x},${d.y}) rotate(${d.r}) scale(${d.s})`;
  if (d.back) return `<use href="#pBack" xlink:href="#pBack" transform="${t}"/>`;
  return `<g transform="${t}"><use href="#pBody" xlink:href="#pBody"/>${eyePair(d.eyes || 'open')}` +
    (d.acc ? ACC[d.acc]() : '') + `</g>`;
}

/* ---------------- 背景：夜里的酒店房间 ---------------- */
function background() {
  const bokeh = [[150, 150, 9], [1210, 120, 7], [1330, 330, 6], [520, 120, 5], [980, 200, 5], [1470, 210, 4],
    [229, 560, 5], [1450, 650, 6], [80, 700, 5]]
    .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#F5D98D" opacity="0.3"/>`).join('');
  return `
  <rect width="1600" height="900" fill="url(#gWall)"/>

  <!-- 夜窗（右上） -->
  <g>
    <rect x="1060" y="52" width="470" height="350" rx="16" fill="url(#gWindow)"/>
    <circle cx="1382" cy="146" r="42" fill="#F6EBCB" opacity="0.9"/>
    <circle cx="1382" cy="146" r="120" fill="url(#gMoon)"/>
    <g opacity="0.4" fill="#F2C97A">
      <rect x="1104" y="252" width="26" height="18"/><rect x="1168" y="292" width="26" height="18"/>
      <rect x="1240" y="238" width="26" height="18"/><rect x="1316" y="300" width="26" height="18"/>
      <rect x="1428" y="262" width="26" height="18"/>
    </g>
    <rect x="1289" y="52" width="13" height="350" fill="#2A3242"/>
    <rect x="1060" y="216" width="470" height="13" fill="#2A3242"/>
  </g>

  <!-- 左侧床头灯 -->
  <ellipse cx="196" cy="286" rx="560" ry="560" fill="url(#gLamp)"/>
  <circle cx="196" cy="286" r="150" fill="url(#gLamp)"/>
  <circle cx="196" cy="286" r="30" fill="#F5D98D" opacity="0.85"/>
  <path d="M172,286 L220,286 L232,318 L160,318 Z" fill="#7A6E62"/>
  <path d="M150,318 L242,318 L228,346 L164,346 Z" fill="#4A3E50"/>

  <!-- 床 / 被子 -->
  <path d="M0,446 C300,410 1310,406 1600,442 L1600,900 L0,900 Z" fill="url(#gBed)"/>
  <path d="M0,446 C300,410 1310,406 1600,442" stroke="#6B6076" stroke-width="6" fill="none" opacity="0.6"/>
  <g fill="none" stroke="#4A4358" stroke-width="4" opacity="0.5">
    <path d="M0,520 C320,486 1290,482 1600,516"/>
    <path d="M0,606 C340,570 1270,566 1600,602"/>
    <path d="M0,700 C360,662 1250,658 1600,694"/>
    <path d="M0,800 C380,760 1230,756 1600,792"/>
  </g>
  <g fill="none" stroke="#5B5270" stroke-width="3" opacity="0.35">
    <path d="M180,470 L205,880"/><path d="M470,462 L495,880"/><path d="M760,460 L778,880"/>
    <path d="M1050,462 L1032,880"/><path d="M1330,468 L1310,880"/>
  </g>
  ${bokeh}
  <ellipse cx="772" cy="470" rx="660" ry="300" fill="url(#gRim)"/>
  <ellipse cx="196" cy="286" rx="560" ry="560" fill="url(#gLamp)"/>
  <rect width="1600" height="900" fill="url(#gVig)"/>
  <rect width="1600" height="900" fill="url(#gTop)"/>
  <rect width="1600" height="900" fill="url(#gFloor)"/>`;
}

/* ---------------- defs（两张图共用） ---------------- */
function defs() {
  return `
    <linearGradient id="gWall" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#2A2434"/><stop offset="1" stop-color="#171420"/>
    </linearGradient>
    <linearGradient id="gWindow" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#1B2A44"/><stop offset="1" stop-color="#0E1726"/>
    </linearGradient>
    <linearGradient id="gBed" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#4A3E50"/><stop offset="0.5" stop-color="#3A3040"/><stop offset="1" stop-color="#241E2C"/>
    </linearGradient>
    <radialGradient id="gLamp" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#F5CE7E" stop-opacity="0.34"/>
      <stop offset="1" stop-color="#F5CE7E" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="gRim" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#F7D9A6" stop-opacity="0.2"/>
      <stop offset="0.62" stop-color="#F7D9A6" stop-opacity="0.08"/>
      <stop offset="1" stop-color="#F7D9A6" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="gMoon" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#CFE0F5" stop-opacity="0.4"/>
      <stop offset="1" stop-color="#CFE0F5" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="gVig" cx="0.5" cy="0.46" r="0.78">
      <stop offset="0.42" stop-color="#000000" stop-opacity="0"/>
      <stop offset="1" stop-color="#05070C" stop-opacity="0.62"/>
    </radialGradient>
    <linearGradient id="gTop" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#070A11" stop-opacity="0.5"/>
      <stop offset="0.22" stop-color="#070A11" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="gFloor" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0B0910" stop-opacity="0"/>
      <stop offset="0.72" stop-color="#0B0910" stop-opacity="0.18"/>
      <stop offset="1" stop-color="#0B0910" stop-opacity="0.5"/>
    </linearGradient>

    <clipPath id="clipBody"><path d="${BODY}"/></clipPath>
    <clipPath id="clipBelly"><path d="${BELLY}"/></clipPath>
    <clipPath id="clipHead"><ellipse cx="0" cy="${HEAD_CY}" rx="${HEAD_RX}" ry="${HEAD_RY}"/></clipPath>
    <clipPath id="clipRim"><rect x="-220" y="-380" width="220" height="400"/></clipPath>
    <clipPath id="clipFace"><rect x="616" y="16" width="984" height="628"/></clipPath>

    <g id="pBody">${dollBody()}</g>
    <g id="pBack">${dollBack()}</g>`;
}

/* ---------------- 图 1：CG ---------------- */
function buildCG() {
  const shadows = DOLLS.map(d =>
    `<ellipse cx="${d.x}" cy="${d.y - 6}" rx="${(86 * d.s).toFixed(1)}" ry="${(15 * d.s).toFixed(1)}" fill="#120F18" opacity="0.4"/>`
  ).join('\n    ');

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1600 900" width="1600" height="900">
  <title>一堆 Ginpu 玩偶堆成小山（ch9 义乌 · "我怀孕了"的企鹅梗）</title>
  <desc>纯手写矢量画面，无内嵌位图、无外部素材。Ginpu 是本作原创的企鹅玩偶角色，与任何第三方 IP 无关。</desc>
  <defs>${defs()}
  </defs>

${background()}

  <!-- 玩偶堆的地面投影 -->
  <g>
    ${shadows}
  </g>

  <!-- 玩偶堆：由后往前层层叠起 -->
  <g>
${DOLLS.map(d => '    ' + place(d)).join('\n')}
  </g>

  <rect width="1600" height="900" fill="url(#gVig)"/>
</svg>
`;
}

/* ---------------- 图 2：自检对照图（同一套矢量部件放大，供人工比对 Ginpu 识别点） ---------------- */
function buildRef() {
  const variants = [
    ['open', null], ['happy', null], ['wide', null], ['wink', null], ['open', 'scarf'], ['open', 'hat'], ['open', 'fish']
  ];
  const row = variants.map(([e, a], i) => {
    const x = 640 + i * 132, y = 872;
    return `<g transform="translate(${x},${y}) scale(0.55)"><use href="#pBody" xlink:href="#pBody"/>${eyePair(e)}${a ? ACC[a]() : ''}</g>`;
  }).join('\n    ');
  const lbl = (x, y, s) => `<text x="${x}" y="${y}" font-family="PingFang SC,Helvetica,sans-serif" font-size="22" fill="#B9AFA0">${s}</text>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1600 900" width="1600" height="900">
  <title>cg_ginpu.svg 的自检对照图：玩偶部件放大 + 表情 / 配饰差分</title>
  <defs>${defs()}
  </defs>
  <rect width="1600" height="900" fill="#141119"/>
  ${lbl(30, 40, 'cg_ginpu.svg · 玩偶部件自检对照图（同一套矢量，非额外素材）')}
  ${lbl(30, 72, '左：整只 2.6×　　右上：脸部 3.6×（小尖喙 / 小眼睛 / 腮红 / 呆毛）　　下：表情与配饰差分')}
  <line x1="620" y1="20" x2="620" y2="880" stroke="#3A3040" stroke-width="2"/>

  <g transform="translate(320,860) scale(2.6)">
    <ellipse cx="0" cy="-6" rx="86" ry="15" fill="#000" opacity="0.45"/>
    <use href="#pBody" xlink:href="#pBody"/>${eyePair('open')}
  </g>
  <g transform="translate(560,760) scale(1.0)" opacity="0.95">
    <ellipse cx="0" cy="-6" rx="86" ry="15" fill="#000" opacity="0.45"/>
    <use href="#pBack" xlink:href="#pBack"/>
  </g>
  ${lbl(470, 830, '背面款')}

  <g clip-path="url(#clipFace)">
    <g transform="translate(880,1214) scale(3.6)">
      <use href="#pBody" xlink:href="#pBody"/>${eyePair('open')}
    </g>
  </g>

  ${row}
  ${lbl(640, 692, '默认 / 开心 / 惊讶 / 眨眼 / 围巾 / 帽子 / 抱鱼')}
</svg>
`;
}

/* ---------------- 输出 ---------------- */
fs.mkdirSync(path.dirname(OUT_CG), { recursive: true });
fs.mkdirSync(path.dirname(OUT_REF), { recursive: true });
if (!process.argv.includes('--sheet-only')) {
  fs.writeFileSync(OUT_CG, buildCG(), 'utf8');
  console.log('✔ 只生成 ' + path.relative(ROOT, OUT_CG) + '（' + fs.statSync(OUT_CG).size + ' 字节，' +
    DOLLS.length + ' 只玩偶（' + DOLLS.filter(d => !d.back).length + ' 正面 / ' +
    DOLLS.filter(d => d.back).length + ' 背面），纯手写 SVG，无位图）');
}
fs.writeFileSync(OUT_REF, buildRef(), 'utf8');
console.log('✔ 生成 ' + path.relative(ROOT, OUT_REF) + '（' + fs.statSync(OUT_REF).size + ' 字节，自检对照图）');
