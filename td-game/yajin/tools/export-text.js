#!/usr/bin/env node
/* 导出「可直接编辑的剧本文字稿」到 剧本/ 目录（每章一个 .md）。
 * 编辑后运行 `npm run import:text` 即可把改动写回游戏（生成 src/story/text.js）。
 * 运行：node tools/export-text.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, '剧本');

for (const f of ['src/core.js', 'src/story/characters.js', 'src/story/index.js']) require(path.join(ROOT, f));
for (let i = 0; i <= 10; i++) {
  if (i === 9) require(path.join(ROOT, 'src/story/chapter_hk.js'));   /* 香港迪士尼（南阳之后、三次旅行之前） */
  require(path.join(ROOT, 'src/story/chapter' + i + '.js'));
}
require(path.join(ROOT, 'src/story/chapter_end.js'));
const YJ = globalThis.YJ;

const FILES = {
  0: 'ch00_序章_一个无聊的人.md',
  1: 'ch01_一条帖子.md',
  2: 'ch02_四人变两人.md',
  3: 'ch03_生日地图.md',
  4: 'ch04_石头说的话.md',
  5: 'ch05_第一次见面.md',
  6: 'ch06_大吵与苏州.md',
  7: 'ch07_每个月都去见你.md',
  8: 'ch08_南阳的生日.md',
  9: 'ch09_三次旅行.md',
  10: 'ch10_一周年.md',
};
const SPEAKER = { ya: '雅', jin: '金', inner: '金（心声）', narrator: '旁白' };
const POS = { left: '左', center: '中', right: '右' };

const HEAD = `<!--
  《你好！一周年》剧本文字稿 · 可编辑版
  ══════════════════════════════════════════════════════════
  怎么改：
    1. 直接修改下面每个 [节点号] 之后的中文正文（可以换行、可以加长）。
    2. 以 # 开头的行是"注释/提示"，改不改都不影响游戏；不要删除，方便你自己对照场景。
    3. 选项段：以 "== 选项 ==" 开头的段落，下面每行一个选项，用全角 ｜ 分隔"选项文字"与"提示"。
       行数必须和原来一致（改文字可以，增删选项不行——需要增删选项请告诉我）。
    4. [节点号] 那一行不要改、不要删，它决定这段文字出现在剧情哪个位置。
    5. 要"新增"剧情段落：在文件末尾写下你的补充内容，并在前面加一行 [新增]，注明想插在哪两个节点之间；
       我会帮你接进剧情（新增段落需要指定跳转关系，工具无法完全自动化，这一步交给我）。
  改完之后：
    在此目录运行  npm run import:text   （或 node tools/import-text.js）
    然后刷新浏览器即可看到新文本。
  ══════════════════════════════════════════════════════════
-->

`;

fs.mkdirSync(OUT, { recursive: true });
const oldFiles = fs.existsSync(OUT) ? fs.readdirSync(OUT).filter(f => f.endsWith('.md')) : [];
let total = 0;
for (const ch of Object.keys(FILES)) {
  const name = FILES[ch];
  let md = HEAD;
  md += '# 第 ' + ch + ' 章\n\n';
  for (const id of YJ.story.order) {
    const n = YJ.story.get(id);
    if (n.chapter !== +ch) continue;
    if (n.route) {
      md += '[' + id + ']\n# 结局路由（自动判定，无正文，不要编辑）\n\n';
      continue;
    }
    total++;
    const notes = [];
    if (n.scene) notes.push('场景：' + (YJ.SCENE_LABEL[n.scene] || n.scene) + (n.tint ? '·' + n.tint : ''));
    if (n.bgm) notes.push('♫' + n.bgm + (n.beat ? '(' + n.beat + ')' : ''));
    if (n.titlecard) notes.push('时间章：' + n.titlecard);
    if (n.cg) notes.push('CG：' + n.cg);
    notes.push('说话人：' + (SPEAKER[n.speaker] || n.speaker || '—'));
    if (n.cast && n.cast.length) {
      notes.push('立绘：' + n.cast.map(c => {
        const c2 = YJ.characters[c.id] || {};
        return (c2.name || c.id) + '（' + (POS[c.pos || 'center']) + '）' +
          (c.expr ? '·' + (YJ.exprLabel[c.expr] || c.expr) : '') +
          (c.outfit ? '·' + (YJ.outfitLabel[c.outfit] || c.outfit) : '') +
          (c.act && c.act !== 'idle' ? '·' + c.act : '');
      }).join(' ｜ '));
    }
    if (n.zoom && n.zoom !== 'bust') notes.push('镜头：' + n.zoom);
    md += '[' + id + ']\n# ' + notes.join('　｜　') + '\n';
    if (n.chat) {
      md += '# 聊天窗口（下面 4 列：谁 时间 内容；改内容即可，格式别动）\n';
      md += '== 聊天 ==\n';
      n.chat.forEach(m => {
        const who = m.name || (m.from === 'ya' ? YJ.characters.ya.handle : m.from === 'jin' ? YJ.characters.jin.handle : '');
        md += who + ' ｜ ' + (m.time || '') + ' ｜ ' + (m.text || '').replace(/\n/g, ' / ') + '\n';
      });
      md += '\n';
      continue;
    }
    if (typeof n.text === 'string') md += n.text + '\n';
    if (n.choices) {
      md += '\n== 选项 ==\n';
      n.choices.forEach((c, i) => { md += (i + 1) + '. ' + c.text + ' ｜ ' + (c.hint || '') + '\n'; });
    }
    md += '\n';
  }
  fs.writeFileSync(path.join(OUT, name), md, 'utf8');
  console.log('✔ ' + name);
}
/* 清理改名后残留的旧文件 */
/* 只清理"本工具自己生成的"章节稿（chNN_*.md），绝不动用户/主程放进来的其它 md */
oldFiles.forEach(f => { if (/^ch\d\d_.*\.md$/.test(f) && Object.values(FILES).indexOf(f) < 0) { fs.unlinkSync(path.join(OUT, f)); console.log('  （移除旧文件 ' + f + '）'); } });
console.log('\n共导出 ' + total + ' 个节点的正文 → ' + OUT);
