#!/usr/bin/env node
/* 把剧本导出成可通读的《文字稿》SCRIPT.md：
 *   场景 / 时段 / BGM → 立绘神态（表情·服装·动作·镜头）→ 旁白·对话·心声 → 选项与数值 → 结局
 * 运行：node tools/export-script.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

for (const f of ['src/core.js', 'src/story/characters.js', 'src/story/index.js']) require(path.join(ROOT, f));
for (let i = 0; i <= 10; i++) {
  if (i === 9) require(path.join(ROOT, 'src/story/chapter_hk.js'));   /* 香港迪士尼（南阳之后、三次旅行之前） */
  require(path.join(ROOT, 'src/story/chapter' + i + '.js'));
}
require(path.join(ROOT, 'src/story/chapter_end.js'));
const YJ = globalThis.YJ;

const CH_TITLE = {
  0: '序章 · 一个无聊的人（2025.06 之前）',
  1: '第一章 · 一条帖子（2025.06 末）',
  2: '第二章 · 四人变两人（2025.07–08）',
  3: '第三章 · 生日地图（2025.09.26 夜 – 09.27 凌晨）',
  4: '第四章 · 石头说的话（2025.09.28）',
  5: '第五章 · 第一次见面（2025.10）',
  6: '第六章 · 大吵与苏州（2025.11–12）',
  7: '第七章 · 每个月都去见你（2025.12–2026.01）',
  8: '第八章 · 南阳的生日（2026.02）',
  9: '第九章 · 三次旅行（2026 春–秋）',
  10: '第十章 · 一周年（2026.10.13）与三种收束'
};
/* 说话人标签：从角色注册表读取，避免与 characters.js 脱节（曾因硬编码旧名导致同一段两种称呼） */
const SPEAKER = { narrator: '旁白' };
Object.keys(YJ.characters || {}).forEach(k => { SPEAKER[k] = YJ.characters[k].name; });
SPEAKER.inner = YJ.characters.jin.name + '（心声）';
const POS = { left: '左', center: '中', right: '右' };

function castLine(node) {
  if (!node.cast || !node.cast.length) return '';
  return node.cast.map(c => {
    const ch = YJ.characters[c.id] || {};
    const parts = [(ch.name || c.id) + '（' + POS[c.pos || 'center'] + '）'];
    if (c.expr) parts.push(YJ.exprLabel[c.expr] || c.expr);
    if (c.outfit) parts.push(YJ.outfitLabel[c.outfit] || c.outfit);
    if (c.act && c.act !== 'idle') parts.push('动作：' + c.act);
    return parts.join('·');
  }).join('　｜　');
}
function effLine(e) {
  if (!e) return '';
  const out = [];
  [['affection', '好感'], ['trust', '信任'], ['courage', '勇气']].forEach(([k, n]) => {
    if (typeof e[k] === 'number' && e[k]) out.push(n + (e[k] > 0 ? '+' : '') + e[k]);
  });
  if (e.flags) Object.keys(e.flags).forEach(f => { if (e.flags[f]) out.push('★' + f); });
  return out.length ? '〔' + out.join(' ') + '〕' : '';
}

let md = '';
md += '# 《你好！一周年》文字稿\n\n';
md += '> 由 `tools/export-script.js` 从实际剧本数据导出，与游戏内文本**完全一致**（同一份数据）。\n';
md += '> 共 ' + YJ.story.count() + ' 个节点。格式：场景 → 立绘神态 → 台词/心声 → 选项与数值。\n\n';
md += '**缩写**：时段 tint（day 白天 / dusk 黄昏 / night 夜 / rain 雨）；BGM；镜头 zoom（bust 半身 / face 面部特写 / hand 手部特写）。\n\n---\n\n';

let curCh = null, curScene = null, curBgm = null, curTint = null, curCg = null;
const order = YJ.story.order.slice().sort((a, b) => {
  const A = YJ.story.get(a), B = YJ.story.get(b);
  if (A.chapter !== B.chapter) return A.chapter - B.chapter;
  return YJ.story.order.indexOf(a) - YJ.story.order.indexOf(b);
});
for (const id of order) {
  const n = YJ.story.get(id);
  if (n.chapter !== curCh) {
    curCh = n.chapter;
    md += '\n\n# ' + (CH_TITLE[curCh] || ('第 ' + curCh + ' 章')) + '\n\n';
    curScene = null;
  }
  if (n.route) {
    md += '**【结局路由】**\n\n';
    n.route.forEach(r => {
      const w = r.when || {};
      const cs = [];
      if (w.affection) cs.push('好感 ≥ ' + w.affection.min);
      if (w.trust) cs.push('信任 ≥ ' + w.trust.min);
      if (w.courage) cs.push('勇气 ≥ ' + w.courage.min);
      md += '- ' + (cs.length ? cs.join(' 且 ') : '（兜底）') + ' → `' + r.next + '`\n';
    });
    md += '\n';
    continue;
  }
  if (n.scene && n.scene !== curScene) {
    curScene = n.scene;
    md += '\n### 场景：' + (YJ.SCENE_LABEL[curScene] || curScene) + '（`' + curScene + '`' +
      (n.tint ? ' · ' + n.tint : '') + '）\n\n';
  } else if (n.tint && n.tint !== curTint) {
    md += '*（时段转为 ' + n.tint + '）*\n\n';
  }
  if (n.scene) curTint = n.tint || curTint;
  if (n.titlecard) md += '> **' + n.titlecard + '**\n\n';
  if (n.bgm && n.bgm !== curBgm) { curBgm = n.bgm; md += '*♫ ' + curBgm + (n.beat ? '（节奏：' + n.beat + '）' : '') + '*\n\n'; }
  else if (n.beat) md += '*♫ 节奏：' + n.beat + '*\n\n';
  if (n.cg && n.cg !== curCg) { curCg = n.cg; md += '**［CG：' + n.cg + '］**\n\n'; }
  else if (!n.cg) curCg = null;
  const cl = castLine(n);
  if (cl) md += '　　*【立绘】' + cl + (n.zoom && n.zoom !== 'bust' ? '　镜头：' + n.zoom : '') + '*\n\n';
  else if (n.zoom && n.zoom !== 'bust') md += '　　*【镜头】' + n.zoom + '*\n\n';

  if (n.chat) {
    md += '**［聊天窗口' + (n.chatTitle ? '：' + n.chatTitle : '') + '］**\n\n```\n';
    n.chat.forEach(m => {
      const who = m.name || (m.from === 'ya' ? YJ.characters.ya.handle : m.from === 'jin' ? YJ.characters.jin.handle : '');
      md += String(who).padEnd(12, ' ') + String(m.time || '').padEnd(10, ' ') + (m.text || '').replace(/\n/g, ' / ') + '\n';
    });
    md += '```\n\n';
  }
  if (typeof n.text === 'string' && n.text.length) {
    const sp = SPEAKER[n.speaker] || n.speaker || '';
    const body = n.text.replace(/\n/g, '\n> ');
    if (n.speaker === 'narrator') md += '> ' + body + '\n\n';
    else if (n.speaker === 'inner') md += '> **［' + sp + '］**' + body + '\n\n';
    else md += '**' + sp + '**：' + body + '\n\n';
  }
  if (n.choices) {
    md += '**【选择】**\n\n';
    n.choices.forEach((c, i) => {
      md += (i + 1) + '. ' + c.text + (c.hint ? '　　*' + c.hint + '*' : '') +
        '　→ `' + c.next + '` ' + effLine(c.effects) + '\n';
    });
    md += '\n';
  }
  if (n.effects && effLine(n.effects)) md += '　　' + effLine(n.effects) + '\n\n';
  if (n.ending) md += '\n**—— 收束「' + (YJ.ENDINGS[n.ending] ? YJ.ENDINGS[n.ending].title : n.ending) + '」——**\n\n';
}

/* ---------- 保护用户批注：导出前后自动备份 + 把旧的 // 批注按正文贴回 ---------- */
function preserveAnnotations(target, fresh) {
  if (!fs.existsSync(target)) return fresh;
  const old = fs.readFileSync(target, 'utf8');
  const oldLines = old.split('\n');
  const notes = [];           /* {nextText, note} */
  for (let i = 0; i < oldLines.length; i++) {
    if (!oldLines[i].trim().startsWith('//')) continue;
    for (let j = i + 1; j < Math.min(i + 4, oldLines.length); j++) {
      const t = oldLines[j].trim();
      if (!t) continue;
      notes.push({ next: t.slice(0, 24), note: oldLines[i].trim() });
      break;
    }
  }
  if (!notes.length) return fresh;
  fs.writeFileSync(target.replace(/\.md$/, '') + '_批注备份.md', old, 'utf8');
  const freshLines = fresh.split('\n');
  const used = new Set();
  for (const n of notes) {
    const at = freshLines.findIndex((l, i) => !used.has(i) && l.trim().startsWith(n.next));
    if (at >= 0) { freshLines.splice(at, 0, n.note); used.add(at); }
    else freshLines.push('', n.note + '  ←（原批注：未能自动定位，请人工核对）');
  }
  return freshLines.join('\n');
}
const out = path.join(ROOT, 'SCRIPT.md');
fs.writeFileSync(out, preserveAnnotations(out, md), 'utf8');
const lines = md.split('\n').length;
console.log('✔ 已导出 SCRIPT.md（' + YJ.story.count() + ' 个节点 / ' + lines + ' 行 / ' +
  (Buffer.byteLength(md, 'utf8') / 1024).toFixed(0) + ' KB）');
