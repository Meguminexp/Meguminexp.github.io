#!/usr/bin/env node
/* 生成 assets/manifest.json（含按剧本统计的使用次数），并校验所有 file 引用真实存在。
 * 运行：node tools/gen-manifest.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

for (const f of ['src/core.js', 'src/story/characters.js', 'assets/manifest.js',
  'src/story/index.js', 'src/state.js']) require(path.join(ROOT, f));
for (let i = 0; i <= 10; i++) {
  if (i === 9) require(path.join(ROOT, 'src/story/chapter_hk.js'));   /* 香港迪士尼（南阳之后、三次旅行之前） */
  require(path.join(ROOT, 'src/story/chapter' + i + '.js'));
}
require(path.join(ROOT, 'src/story/chapter_end.js'));
const YJ = globalThis.YJ;

const usage = YJ.manifest.usage();
const json = JSON.parse(JSON.stringify(YJ.manifest, (k, v) => (typeof v === 'function' ? undefined : v)));
json.usage = usage;
json.counts = YJ.manifest.counts();
json.story = { nodes: YJ.story.count(), reachable: YJ.story.validate().reachable };

fs.writeFileSync(path.join(ROOT, 'assets/manifest.json'), JSON.stringify(json, null, 2), 'utf8');
/* 供 preview.html 直接引用的用途统计（预计算，避免 file:// 下读取 JSON 的限制） */
fs.writeFileSync(path.join(ROOT, 'assets/usage.js'),
  '/* 由 tools/gen-manifest.js 生成：各素材在剧情中的使用次数 */\n' +
  'YJ.manifestUsage = ' + JSON.stringify(usage, null, 2) + ';\n', 'utf8');
console.log('✔ 已生成 assets/manifest.json 与 assets/usage.js');
console.log('  条目：' + json.assets.length + ' ' + JSON.stringify(json.counts));

let missing = 0, checked = 0;
json.assets.forEach(a => {
  if (!a.file) return;
  checked++;
  if (!fs.existsSync(path.join(ROOT, a.file))) { missing++; console.error('  ✗ 缺失：' + a.file); }
});
console.log('  文件检查：' + checked + ' 个引用，缺失 ' + missing + ' 个');
process.exit(missing ? 1 : 0);
