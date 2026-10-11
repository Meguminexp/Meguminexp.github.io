#!/usr/bin/env node
/* 校验 assets/characters/ 下已放入的位图立绘：尺寸 / 透明通道 / 命名，
 * 并打印 6×16 + 8×14 = 208 个"表情×服装"组合的覆盖情况（缺哪些还靠程序化立绘兜底）。
 * 运行：node tools/check-sprites.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
require(path.join(ROOT, 'src/core.js'));
require(path.join(ROOT, 'src/story/characters.js'));
require(path.join(ROOT, 'assets/sprites.js'));
const YJ = globalThis.YJ;

/* 极简 PNG 头解析（宽/高/色彩类型），无需第三方库 */
function pngInfo(file) {
  const b = fs.readFileSync(file);
  if (b.length < 26 || b.readUInt32BE(0) !== 0x89504e47) return null;
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20), colorType: b[25] };
}
let bad = 0, okN = 0;
for (const cid in YJ.spriteFiles) {
  for (const key in YJ.spriteFiles[cid]) {
    const rel = YJ.spriteFiles[cid][key];
    const abs = path.join(ROOT, rel);
    const info = pngInfo(abs);
    if (!info) { console.log('  ? ' + rel + '（非 PNG 或无法解析，跳过尺寸检查）'); continue; }
    const ratio = info.w / info.h;
    const sizeOk = Math.abs(ratio - 2 / 3) < 0.02;
    const alphaOk = info.colorType === 4 || info.colorType === 6;
    if (!sizeOk || !alphaOk) {
      bad++;
      console.log('  ✗ ' + rel + '  ' + info.w + '×' + info.h +
        (sizeOk ? '' : '　比例不是 2:3（建议 720×1080）') + (alphaOk ? '' : '　没有透明通道'));
    } else okN++;
  }
}
console.log('\n位图立绘：' + okN + ' 张合格' + (bad ? '，' + bad + ' 张需修正' : ''));
const cov = YJ.sprites.coverage();
console.log('组合覆盖：' + cov.covered + ' / ' + cov.total + '（其余由程序化立绘兜底，游戏不会缺图）');
for (const cid in cov.per) {
  const p = cov.per[cid];
  console.log('  · ' + (YJ.characters[cid].name) + '：' + p.covered + '/' + p.total +
    (p.covered < p.total ? '　缺 ' + p.missing.length + ' 组（例：' + p.missing.slice(0, 4).join('、') + '…）' : '　✔ 全部就位'));
}
