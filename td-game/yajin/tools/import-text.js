#!/usr/bin/env node
/* 把 剧本/*.md 里的改动写回游戏：生成 src/story/text.js（只记录与默认剧本不同的部分）。
 * 运行：node tools/import-text.js   （或 npm run import:text）
 */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, '剧本');

for (const f of ['src/core.js', 'src/story/characters.js', 'src/story/index.js']) require(path.join(ROOT, f));
for (let i = 0; i <= 10; i++) require(path.join(ROOT, 'src/story/chapter' + i + '.js'));
require(path.join(ROOT, 'src/story/chapter_end.js'));
const YJ = globalThis.YJ;

/* ---------- 1. 解析 md ---------- */
function parseFile(file) {
  let txt = fs.readFileSync(file, 'utf8');
  txt = txt.replace(/<!--[\s\S]*?-->/, '');            /* 去掉说明头 */
  const lines = txt.split('\n');
  const out = {};
  let id = null, buf = [], mode = null, list = [];
  const flush = () => {
    if (!id) return;
    const rec = out[id] = out[id] || {};
    if (mode === 'chat') rec.chat = list.slice();
    else if (mode === 'choice') rec.choices = list.slice();
    else {
      const body = buf.join('\n').replace(/^\s*\n+/, '').replace(/\s+$/, '');
      if (body) rec.text = body;
    }
    buf = []; list = []; mode = null;
  };
  for (const raw of lines) {
    const line = raw.replace(/\s+$/, '');
    const m = /^\[([A-Za-z0-9_]+)\]$/.exec(line.trim());
    if (m) { flush(); id = m[1]; continue; }
    if (!id) continue;
    if (/^#/.test(line.trim())) continue;                 /* 注释 */
    if (/^==\s*聊天\s*==$/.test(line.trim())) { flushBodyKeepId(); mode = 'chat'; list = []; continue; }
    if (/^==\s*选项\s*==$/.test(line.trim())) { flushBodyKeepId(); mode = 'choice'; list = []; continue; }
    if (mode === 'chat') {
      if (!line.trim()) continue;
      const parts = line.split('｜').map(s => s.trim());
      list.push({ who: parts[0] || '', time: parts[1] || '', text: parts.slice(2).join(' ｜ ') });
      continue;
    }
    if (mode === 'choice') {
      const mm = /^\d+\.\s*(.*)$/.exec(line.trim());
      if (!mm) continue;
      const parts = mm[1].split('｜');
      list.push({ text: (parts[0] || '').trim(), hint: (parts[1] || '').trim() });
      continue;
    }
    buf.push(line);
  }
  const keep = { id, mode, list };
  flush();
  return out;
  function flushBodyKeepId() {
    if (mode === null) {
      const rec = out[id] = out[id] || {};
      const body = buf.join('\n').replace(/^\s*\n+/, '').replace(/\s+$/, '');
      if (body) rec.text = body;
      buf = [];
    }
  }
}

/* ---------- 2. 与默认剧本比对，只记录差异 ---------- */
const files = fs.readdirSync(SRC).filter(f => f.endsWith('.md')).sort();
if (!files.length) { console.error('✗ 剧本/ 目录下没有 .md（先运行 npm run export:text）'); process.exit(1); }
const overrides = {};
let nText = 0, nChoice = 0, nChat = 0, unknown = [];
for (const f of files) {
  const parsed = parseFile(path.join(SRC, f));
  for (const id in parsed) {
    const node = YJ.story.get(id);
    if (!node) { unknown.push(f + ' 中的 ' + id); continue; }
    const rec = parsed[id];
    const diff = {};
    if (typeof rec.text === 'string' && rec.text.trim() !== String(node.text || '').trim()) {
      if (node.chat) { /* chat 节点的 text 通常为空，忽略 */ }
      else { diff.text = rec.text; nText++; }
    }
    if (rec.choices && node.choices && rec.choices.length === node.choices.length) {
      const cs = [];
      rec.choices.forEach((c, i) => {
        if (c.text !== node.choices[i].text || c.hint !== (node.choices[i].hint || '')) {
          cs.push({ i: i, text: c.text, hint: c.hint });
        }
      });
      if (cs.length) { diff.choices = cs; nChoice += cs.length; }
    } else if (rec.choices && node.choices && rec.choices.length !== node.choices.length) {
      unknown.push(id + '：选项行数从 ' + node.choices.length + ' 变成 ' + rec.choices.length + '（增删选项需要手工接线）');
    }
    if (rec.chat && node.chat && rec.chat.length === node.chat.length) {
      const ms = [];
      rec.chat.forEach((m, i) => { if (m.text !== node.chat[i].text) ms.push({ i: i, text: m.text }); });
      if (ms.length) { diff.chat = ms; nChat += ms.length; }
    } else if (rec.chat && node.chat && rec.chat.length !== node.chat.length) {
      unknown.push(id + '：聊天行数从 ' + node.chat.length + ' 变成 ' + rec.chat.length + '（增删聊天需要手工接线）');
    }
    if (Object.keys(diff).length) overrides[id] = diff;
  }
}

const out = `/* 《你好！一周年》文本覆盖层 —— 由 tools/import-text.js 自动生成，请勿手改本文件。
 * 想改剧情文本请编辑 剧本/*.md，然后运行：npm run import:text
 * 生成时间：${new Date().toISOString()}
 * 本文件只包含与 src/story/chapter*.js 默认文本不同的部分（共 ${Object.keys(overrides).length} 个节点）。
 */
(function (root) {
  'use strict';
  const YJ = root.YJ = root.YJ || {};
  YJ.textOverrides = ${JSON.stringify(overrides, null, 2)};
  if (YJ.story && YJ.story.applyTextOverrides) YJ.story.applyTextOverrides();
})(typeof globalThis !== 'undefined' ? globalThis : this);
`;
fs.writeFileSync(path.join(ROOT, 'src/story/text.js'), out, 'utf8');
console.log('✔ 已生成 src/story/text.js');
console.log('  改动的正文节点：' + nText + '　选项文案：' + nChoice + '　聊天条目：' + nChat);
if (unknown.length) {
  console.log('\n⚠ 需要手工处理（工具不会自动改结构）：');
  unknown.slice(0, 20).forEach(u => console.log('  · ' + u));
}
if (!Object.keys(overrides).length) console.log('  （当前与默认剧本一致，没有覆盖项）');
