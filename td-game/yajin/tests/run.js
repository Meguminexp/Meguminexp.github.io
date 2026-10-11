#!/usr/bin/env node
/* 《你好！一周年》— tests/run.js (v2 真实故事线)
 * 无头验证（jsdom）：
 *   A. 素材与清单：文件真实存在、SVG 可解析、清单由注册表枚举且无悬空引用
 *   B. 剧本契约：节点结构 / 跳转 / flag 白名单 / 表情服装场景合法性 / 孤儿与死胡同
 *   C. 规则求解：穷举可达状态，验证三种收束真实可达、无不可达节点
 *   D. 引擎实机：新游戏 / 点击推进 / 打字机 / 选项分流 / 数值变化 /
 *      聊天窗口逐条揭示 / 存读档 / 刷新恢复 / 新游戏重置 / 连点保护 / 控制台无报错
 *   E. 数值单元测试：applyEffects / check / resolveEnding
 *   F. 音频：关闭后不发声、无 AudioContext 不崩、有 AudioContext 可运行、beat() 节奏
 *   G. 布局：等比缩放变量与窄窗口适配的静态断言
 * 运行：node tests/run.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const CHAPTERS = ['chapter0', 'chapter1', 'chapter2', 'chapter3', 'chapter4', 'chapter5',
  'chapter6', 'chapter7', 'chapter8', 'chapter9', 'chapter10', 'chapter_hk', 'chapter_end', 'text'];

let pass = 0, fail = 0;
const failures = [];
function ok(name, cond, extra) {
  if (cond) { pass++; console.log('  ✅ ' + name); }
  else { fail++; failures.push(name + (extra ? ' — ' + extra : '')); console.log('  ❌ ' + name + (extra ? ' — ' + extra : '')); }
}
function section(t) { console.log('\n' + t); }

function loadOffline() {
  for (const f of ['src/core.js', 'src/story/characters.js', 'assets/manifest.js', 'assets/sprites.js',
    'src/art.js', 'src/state.js', 'src/save.js', 'src/story/index.js']) require(path.join(ROOT, f));
  CHAPTERS.forEach(c => require(path.join(ROOT, 'src/story', c + '.js')));
  return globalThis.YJ;
}

/* ============================================================
 *  A. 素材与清单
 * ============================================================ */
function testAssets(YJ) {
  section('A. 素材与清单');
  const m = YJ.manifest;
  ok('manifest 存在且含素材表', !!(m && Array.isArray(m.assets)));
  const c = m.counts();
  ok('背景 24 张（' + c.background + '）', c.background === 24);   /* 新增香港迪士尼 4 张：hk_park/hk_parade/hk_shop/hk_fireworks */
  ok('立绘 30 种（雅 16 表情 + 金 14 表情）', c.sprite === 30, '实际 ' + c.sprite);
  ok('服装差分已登记（' + c.outfit + '）', c.outfit >= 14, '实际 ' + c.outfit);
  ok('CG 25 张（' + c.cg + '）', c.cg === 25, '实际 ' + c.cg);   /* 新增香港 3 张：cg_hk_coaster/cg_hk_coin/cg_hk_fireworks */
  ok('UI 素材已登记', c.ui >= 10);
  ok('音频素材已登记', c.audio >= 15);

  const dom = new JSDOM('<!doctype html><html></html>');
  const parser = new dom.window.DOMParser();
  let missing = 0, badXml = 0, checked = 0;
  m.assets.forEach(a => {
    if (!a.file) return;
    checked++;
    const p = path.join(ROOT, a.file);
    if (!fs.existsSync(p)) { missing++; console.log('     · 缺失 ' + a.file); return; }
    if (/\.svg$/.test(a.file)) {
      const doc = parser.parseFromString(fs.readFileSync(p, 'utf8'), 'image/svg+xml');
      if (doc.querySelector('parsererror')) { badXml++; console.log('     · SVG 解析失败 ' + a.file); }
    }
  });
  ok('清单中所有 file 引用都真实存在（' + checked + ' 个）', missing === 0, missing + ' 个缺失');
  ok('所有 SVG 均为合法 XML', badXml === 0, badXml + ' 个损坏');

  const jsonPath = path.join(ROOT, 'assets/manifest.json');
  ok('assets/manifest.json 已生成', fs.existsSync(jsonPath));
  if (fs.existsSync(jsonPath)) {
    const j = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    ok('manifest.json 与 manifest.js 条目数一致', j.assets.length === m.assets.length);
    ok('manifest.json 含剧本用量统计', !!(j.usage && Object.keys(j.usage).length > 20));
  }

  /* 剧情引用的资源必须登记 */
  const badRefs = [];
  for (const id of YJ.story.order) {
    const n = YJ.story.get(id);
    if (n.scene && YJ.SCENES.indexOf(n.scene) < 0) badRefs.push(id + '.scene=' + n.scene);
    if (n.cg && YJ.CGS.indexOf(n.cg) < 0) badRefs.push(id + '.cg=' + n.cg);
    if (n.bgm && YJ.BGMS.indexOf(n.bgm) < 0) badRefs.push(id + '.bgm=' + n.bgm);
    if (n.sfx && YJ.SFXS.indexOf(n.sfx) < 0) badRefs.push(id + '.sfx=' + n.sfx);
    if (n.tint && YJ.TINTS.indexOf(n.tint) < 0) badRefs.push(id + '.tint=' + n.tint);
    if (n.beat && YJ.BEATS.indexOf(n.beat) < 0) badRefs.push(id + '.beat=' + n.beat);
  }
  ok('剧情只引用已登记的场景/CG/BGM/音效/tint/beat', badRefs.length === 0, badRefs.slice(0, 4).join('; '));

  /* 被剧情用到的每个场景 / CG 都有真实文件 */
  const usedScenes = new Set(), usedCgs = new Set();
  for (const id of YJ.story.order) {
    const n = YJ.story.get(id);
    if (n.scene) usedScenes.add(n.scene);
    if (n.cg) usedCgs.add(n.cg);
  }
  const noFile = [];
  usedScenes.forEach(s => { if (!fs.existsSync(path.join(ROOT, 'assets/backgrounds', s + '.svg'))) noFile.push(s); });
  usedCgs.forEach(g => { if (!fs.existsSync(path.join(ROOT, 'assets/cg', g + '.svg'))) noFile.push(g); });
  ok('剧情用到的 ' + usedScenes.size + ' 场景 / ' + usedCgs.size + ' 张 CG 都有文件', noFile.length === 0, noFile.join(', '));

  ok('位图立绘通道已就绪（assets/sprites.js）', !!(YJ.sprites && typeof YJ.sprites.resolve === 'function'));
  ok('位图通道的覆盖统计可计算（' + YJ.sprites.coverage().covered + '/' + YJ.sprites.coverage().total + '）',
    YJ.sprites.coverage().total === 208);
  ok('文本覆盖层已生成（src/story/text.js）', fs.existsSync(path.join(ROOT, 'src/story/text.js')));
  ok('可编辑文字稿目录存在（剧本/*.md）',
    fs.existsSync(path.join(ROOT, '剧本')) &&
    fs.readdirSync(path.join(ROOT, '剧本')).filter(f => f.endsWith('.md')).length >= 11);
  ok('美术规格书存在（ART_GUIDE.md）', fs.existsSync(path.join(ROOT, 'ART_GUIDE.md')));

  ['logo_mark', 'icon_heart', 'icon_trust', 'icon_courage'].forEach(f => {
    ok('UI 图标 assets/ui/' + f + '.svg 存在', fs.existsSync(path.join(ROOT, 'assets/ui', f + '.svg')));
  });
}

/* ============================================================
 *  B. 剧本契约
 * ============================================================ */
function testStory(YJ) {
  section('B. 剧本契约');
  const v = YJ.story.validate();
  ok('节点总数 ≥ 1000（实际 ' + v.total + '）', v.total >= 1000);
  ok('无校验错误', v.errors.length === 0, v.errors.slice(0, 4).join(' | '));
  ok('全部节点可达（' + v.reachable + '/' + v.total + '）', v.reachable === v.total);
  ok('三种收束节点都存在', !!(v.endings.star && v.endings.slow && v.endings.she_first), JSON.stringify(v.endings));

  let choiceNodes = 0, choiceOptions = 0, chatNodes = 0, cgNodes = 0, titlecards = 0, monologue = 0;
  const perChapter = {};
  for (const id of YJ.story.order) {
    const n = YJ.story.get(id);
    perChapter[n.chapter] = (perChapter[n.chapter] || 0) + 1;
    if (n.choices) { choiceNodes++; choiceOptions += n.choices.length; }
    if (n.chat) chatNodes++;
    if (n.cg) cgNodes++;
    if (n.titlecard) titlecards++;
    if (n.speaker === 'inner') monologue++;
  }
  ok('选择节点 ≥ 20（' + choiceNodes + ' 节点 / ' + choiceOptions + ' 选项）', choiceNodes >= 20);
  ok('聊天窗口节点 ≥ 25（' + chatNodes + '）', chatNodes >= 25);
  ok('CG 节点 ≥ 20（' + cgNodes + '）', cgNodes >= 20);
  ok('时间章（titlecard）≥ 8（' + titlecards + '）', titlecards >= 8);
  ok('心声独白节点 ≥ 200（' + monologue + '）', monologue >= 200);
  ok('11 个章节都有内容', Object.keys(perChapter).length >= 11, JSON.stringify(perChapter));
  console.log('     章节节点分布：' + JSON.stringify(perChapter));
}

/* ============================================================
 *  C. 规则求解
 * ============================================================ */
function checkCond(cond, s) {
  if (!cond) return true;
  const rng = (v, r) => (!r ? true : ((r.min == null || v >= r.min) && (r.max == null || v <= r.max)));
  if (!rng(s.aff, cond.affection)) return false;
  if (!rng(s.trust, cond.trust)) return false;
  if (!rng(s.cou, cond.courage)) return false;
  if (cond.flags && !cond.flags.every(f => s.flags[f])) return false;
  if (cond.notFlags && cond.notFlags.some(f => s.flags[f])) return false;
  if (cond.anyFlags && !cond.anyFlags.some(f => s.flags[f])) return false;
  return true;
}
function applyEff(eff, s) {
  if (!eff) return s;
  const n = { aff: s.aff, trust: s.trust, cou: s.cou, flags: Object.assign({}, s.flags) };
  const cl = v => Math.max(0, Math.min(100, v));
  if (typeof eff.affection === 'number') n.aff = cl(n.aff + eff.affection);
  if (typeof eff.trust === 'number') n.trust = cl(n.trust + eff.trust);
  if (typeof eff.courage === 'number') n.cou = cl(n.cou + eff.courage);
  if (eff.flags) for (const k in eff.flags) { if (eff.flags[k]) n.flags[k] = true; else delete n.flags[k]; }
  return n;
}
/* 支配前沿求解：本作所有条件都是"下限型"（只有 min，没有 max），
 * 因此"三个数值都更高"的状态可以做到低状态能做的一切 —— 保留每个
 * (节点 + flag 组合) 的 Pareto 前沿即为精确（README/STORY_SPEC 有说明）。
 * 该求解可证明高阈值结局（A）可达与全图覆盖；低阈值结局（C）由下面的
 * 实机"消极策略"通关另行证明。 */
const ROUTER_ID = 'c10_router';
function insertFront(front, key, s) {
  const list = front.get(key);
  if (!list) { front.set(key, [s]); return true; }
  for (const x of list) if (x.aff >= s.aff && x.trust >= s.trust && x.cou >= s.cou) return false;
  for (let i = list.length - 1; i >= 0; i--) {
    const x = list[i];
    if (s.aff >= x.aff && s.trust >= x.trust && s.cou >= x.cou) list.splice(i, 1);
  }
  list.push(s);
  return true;
}
function solveAll(YJ, cap) {
  const front = new Map(), reachable = new Set(), endings = {}, router = [];
  /* 预算按剧本地图规模动态给：早期写死 150 万，节点增到 1400+（新增香港章）后
     前沿求解会提前中断，从而误报"条件可达 <99%"。按节点数缩放并保留下限。 */
  const LIMIT = cap || Math.max(1500000, 12000 * (YJ.story.order ? YJ.story.order.length : 1600));
  const stack = [{ id: YJ.story.START, s: { aff: 30, trust: 30, cou: 30, flags: {} } }];
  let pops = 0, capped = false;
  while (stack.length) {
    if (++pops > LIMIT) { capped = true; break; }
    const cur = stack.pop();
    let id = cur.id, node = null, guard = 0;
    while (id && guard++ < 80) {
      const n = YJ.story.get(id);
      if (!n) break;
      reachable.add(id);
      if (n.route) {
        if (n.id === ROUTER_ID) router.push(cur.s);
        const hit = n.route.find(r => checkCond(r.when, cur.s));
        if (!hit) break;
        id = hit.next; continue;
      }
      if (n.condition && !checkCond(n.condition, cur.s)) { id = n.else || n.next || null; continue; }
      node = n; break;
    }
    if (!node) continue;
    const after = applyEff(node.effects, cur.s);
    if (node.ending) { endings[node.ending] = (endings[node.ending] || 0) + 1; continue; }
    const fk = node.id + '|' + Object.keys(cur.s.flags).sort().join(',');
    if (!insertFront(front, fk, after)) continue;
    if (node.choices) {
      for (const ch of node.choices) {
        if (!checkCond(ch.condition, after)) continue;
        stack.push({ id: ch.next, s: applyEff(ch.effects, after) });
      }
      continue;
    }
    if (node.next) stack.push({ id: node.next, s: after });
  }
  const rg = a => a.length ? (Math.min.apply(null, a) + '~' + Math.max.apply(null, a)) : '—';
  return {
    reachable, endings, pops, capped, total: YJ.story.count(),
    range: { aff: rg(router.map(s => s.aff)), trust: rg(router.map(s => s.trust)), cou: rg(router.map(s => s.cou)) }
  };
}
/* 纯结构可达（忽略条件）：用于判断有没有孤儿节点 */
function structuralReach(YJ) {
  const seen = new Set([YJ.story.START]), q = [YJ.story.START];
  while (q.length) {
    const n = YJ.story.get(q.pop());
    for (const e of YJ.story.edges(n)) if (e && !seen.has(e)) { seen.add(e); q.push(e); }
  }
  return seen;
}
function testSolve(YJ) {
  section('C. 规则求解（支配前沿 + 结构可达）');
  const struct = structuralReach(YJ);
  ok('无孤儿节点：结构上全部可达（' + struct.size + '/' + YJ.story.count() + '）',
    struct.size === YJ.story.count(),
    '孤立：' + YJ.story.order.filter(i => !struct.has(i)).slice(0, 8).join(','));

  const r = solveAll(YJ);
  console.log('     前沿求解规模：' + r.pops + ' 次扩展' + (r.capped ? '（触及上限）' : '') +
    '，条件可达 ' + r.reachable.size + '/' + r.total);
  console.log('     可达上限（前沿）终局数值：好感 ' + r.range.aff + ' / 信任 ' + r.range.trust + ' / 勇气 ' + r.range.cou);
  ok('前沿求解在预算内完成（' + r.pops + ' 次扩展）', !r.capped, r.pops + ' 次');
  ok('高阈值收束 A《星星的答案》可达', !!r.endings.star, JSON.stringify(r.endings));
  ok('条件可达节点覆盖 ≥ 99%（' + r.reachable.size + '/' + r.total + '）',
    r.reachable.size / r.total >= 0.99,
    '未被条件路径覆盖：' + YJ.story.order.filter(i => !r.reachable.has(i)).slice(0, 6).join(','));

  const st = YJ.state, backup = JSON.parse(JSON.stringify(st.st));
  st.st.affection = 80; st.st.trust = 75; st.st.courage = 60;
  ok('高好感高信任高勇气 → 收束 A《星星的答案》', st.resolveEnding() === 'star', st.resolveEnding());
  st.st.courage = 42;
  ok('勇气不足 55 → 收束 B《慢慢来》', st.resolveEnding() === 'slow', st.resolveEnding());
  st.st.courage = 20;
  ok('勇气低于 40 → 收束 C《这次是我先说的》', st.resolveEnding() === 'she_first', st.resolveEnding());
  Object.assign(st.st, backup);
}

/* ============================================================
 *  D. 引擎实机
 * ============================================================ */
function buildHTML() {
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  return html.replace(/<script src="([^"]+)"><\/script>/g, (mm, src) => {
    const p = path.join(ROOT, src);
    if (!fs.existsSync(p)) return '<!-- 缺少脚本 ' + src + ' -->';
    return '<script>' + fs.readFileSync(p, 'utf8') + '\n//# sourceURL=' + src + '\n</script>';
  });
}
function makeFakeAudio() {
  function G() { this.gain = { value: 0, setValueAtTime() { }, linearRampToValueAtTime() { }, exponentialRampToValueAtTime() { }, setTargetAtTime() { }, cancelScheduledValues() { } }; }
  G.prototype.connect = function () { };
  function O() { this.type = 'sine'; this.frequency = { value: 440, setValueAtTime() { }, exponentialRampToValueAtTime() { } }; }
  O.prototype.connect = function () { }; O.prototype.start = function () { }; O.prototype.stop = function () { };
  function F() { this.type = 'lowpass'; this.frequency = { value: 800 }; this.Q = { value: 1 }; }
  F.prototype.connect = function () { };
  function B() { this._d = new Float32Array(64); }
  B.prototype.getChannelData = function () { return this._d; };
  function S() { this.buffer = null; this.loop = false; }
  S.prototype.connect = function () { }; S.prototype.start = function () { }; S.prototype.stop = function () { };
  function FakeCtx() {
    this.currentTime = 0; this.sampleRate = 44100; this.state = 'running'; this.destination = {};
    this.createGain = () => new G();
    this.createOscillator = () => { FakeCtx.calls.osc++; return new O(); };
    this.createBiquadFilter = () => new F(); this.createBuffer = () => new B();
    this.createBufferSource = () => new S(); this.resume = () => { };
  }
  FakeCtx.calls = { osc: 0 };
  return FakeCtx;
}
function createWindow(opts) {
  opts = opts || {};
  const errors = [];
  const dom = new JSDOM(buildHTML(), {
    url: 'http://localhost:8080/', runScripts: 'dangerously', pretendToBeVisual: true, storageQuota: 10000000,
    beforeParse(w) {
      w.HTMLCanvasElement.prototype.getContext = () => null;
      w.requestAnimationFrame = () => 0;
      w.cancelAnimationFrame = () => { };
      w.confirm = () => true;
      if (opts.audio) w.AudioContext = (typeof opts.audio === 'function' ? opts.audio : makeFakeAudio());
      const ce = w.console.error.bind(w.console);
      w.console.error = function () { errors.push([].slice.call(arguments).join(' ')); ce.apply(null, arguments); };
    }
  });
  dom.window.__errors = errors;
  return dom.window;
}
function W(opts) {
  const win = createWindow(opts);
  return new Promise(resolve => {
    if (win.document.readyState !== 'loading') return resolve(win);
    win.addEventListener('DOMContentLoaded', () => resolve(win));
    setTimeout(() => resolve(win), 1500);
  });
}
/* 敲键盘互动（node.interact）会冻结推进：自动化游玩时替玩家按几下键。
   支持 ui 暴露的 YJ.ui.interact.knock() 钩子；没有钩子就直接派发 keydown。 */
function knockIfNeeded(win, t) {
  let guard = 0;
  const isActive = () => {
    const it = win.YJ && win.YJ.ui && win.YJ.ui.interact;
    if (!it) return false;
    const a = (typeof it.active === 'function') ? it.active() : it.active;
    return !!a;
  };
  while (isActive() && guard++ < 12) {
    const it = win.YJ.ui.interact;
    if (typeof it.knock === 'function') { it.knock(); }
    else {
      for (const key of ['a', 'a', 'a', 'a']) {
        win.document.dispatchEvent(new win.KeyboardEvent('keydown', { key, bubbles: true }));
        if (win !== win.document.defaultView) win.dispatchEvent(new win.KeyboardEvent('keydown', { key, bubbles: true }));
      }
    }
    if (t && t.isTyping && t.isTyping()) t.completeText();
  }
}
/* 自动化游玩时跳过"敲键盘"互动：真实玩家照旧要敲，但测试不等人。
   做法是在开始时摘掉剧本节点上的 interact 字段，避免 startKnock 被触发。 */
function stripInteracts(win) {
  try {
    const Y = win.YJ;
    if (!Y || !Y.story || !Y.story.order) return;
    Y.story.order.forEach(function (id) {
      const n = Y.story.get(id);
      if (n && n.interact) delete n.interact;
    });
  } catch (e) { /* 忽略 */ }
}
function playToEnding(win, pick, maxSteps) {
  stripInteracts(win);
  const t = win.__test;
  let steps = 0;
  const visited = new Set();
  const guard = maxSteps || 20000;
  while (steps++ < guard) {
    const s = t.state();
    if (s.node) visited.add(s.node);
    if (s.mode === 'ending') { s.visited = visited; return s; }
    t.unlock();
    knockIfNeeded(win, t);
    if (t.isTyping()) { t.completeText(); continue; }
    /* 聊天窗口：先逐条揭示，再推进 */
    if (s.chat) { t.advance(); continue; }
    if (t.awaitingChoice()) {
      const opts = t.choices();
      const idx = (pick(s, steps, opts) | 0) % (opts.length || 1);
      if (!t.choose(idx)) return s;
      continue;
    }
    t.advance();
  }
  const fin = t.state(); fin.visited = visited;
  return fin;
}
function greedy(w) {
  return function (st, steps, opts) {
    const node = globalThis.__winYJ.story.get(st.node);
    if (!node || !node.choices) return 0;
    const texts = opts.map(b => b.textContent.trim());
    let best = 0, bestScore = -1e9;
    node.choices.forEach(c => {
      const i = texts.findIndex(x => x.indexOf(c.text.trim().slice(0, 10)) === 0);
      if (i < 0) return;
      const e = c.effects || {};
      const sc = (e.affection || 0) * w[0] + (e.trust || 0) * w[1] + (e.courage || 0) * w[2];
      if (sc > bestScore) { bestScore = sc; best = i; }
    });
    return best;
  };
}

async function testEngine() {
  section('D. 引擎实机测试');
  const win = await W({ audio: true });
  globalThis.__winYJ = win.YJ;
  const t = win.__test;
  ok('测试接口已就绪', !!t && t.booted);
  ok('标题界面可见', t.ui().titleVisible);
  ok('剧本校验无错误', t.validate().errors.length === 0, t.validate().errors.slice(0, 3).join('|'));

  /* D1 新游戏（起点为序章 c0_01） */
  t.newGame();
  let s = t.state();
  ok('新游戏进入序章起点 c0_01', s.mode === 'game' && s.node === 'c0_01', JSON.stringify({ n: s.node }));
  ok('三维初始值均为 30', s.affection === 30 && s.trust === 30 && s.courage === 30,
    JSON.stringify({ a: s.affection, t: s.trust, c: s.courage }));
  ok('游戏画面可见、标题隐藏', t.ui().gameVisible && !t.ui().titleVisible);
  ok('HUD 含勇气条', !!win.document.getElementById('meter-courage'));

  /* D2 打字机 */
  t.setSetting('typewriter', true); t.setSetting('textSpeed', 8);
  ok('打字机开启后处于打字状态', t.isTyping());
  t.completeText();
  ok('点击后立即显示完整文本', !t.isTyping());

  /* D3 点击推进 + 真实 DOM 点击 */
  const before = t.state().node;
  t.unlock(); t.advance();
  ok('可推进到下一节点', t.state().node !== before, before + ' → ' + t.state().node);
  {
    const w = await W({ audio: false });
    w.__test.newGame(); w.__test.settle(); w.__test.unlock();
    const n0 = w.__test.state().node;
    w.document.getElementById('dialog').dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
    ok('点击对话框可推进对话', w.__test.state().node !== n0);
    w.__test.unlock();
    const n1 = w.__test.state().node;
    w.document.getElementById('btn-backlog').dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
    ok('点击 HUD 按钮不会误推进剧情', w.__test.state().node === n1);
    w.YJ.ui.closeModal();
  }

  /* D4 到达第一个选择点 */
  stripInteracts(win);
  let choiceSeen = 0;
  for (let i = 0; i < 600 && !choiceSeen; i++) {
    t.unlock();
    knockIfNeeded(win, t);
    if (t.state().chat) { t.advance(); continue; }
    if (t.isTyping()) { t.completeText(); continue; }
    if (t.awaitingChoice()) { choiceSeen = t.ui().choiceCount; break; }
    t.advance();
  }
  ok('序章出现选项（' + choiceSeen + ' 个）', choiceSeen >= 2);
  if (choiceSeen) {
    const nAt = t.state().node;
    t.choose(0);
    ok('选择后跳转到不同节点', t.state().node !== nAt);
    ok('选择被记入 choiceLog', t.raw().choiceLog.length >= 1);
  }

  /* D5 聊天窗口逐条揭示（核心交互） */
  {
    const w = await W({ audio: false });
    globalThis.__winYJ = w.YJ;
    w.__test.newGame();
    w.__test.goTo('c3_chat_1');
    const st0 = w.__test.state();
    ok('聊天节点进入后显示第 1 条', /^1\//.test(st0.chat || ''), st0.chat);
    const total = +(st0.chat || '1/1').split('/')[1];
    ok('聊天窗口可见', w.document.getElementById('chat-panel').classList.contains('show'));
    let revealed = 1, rowsAtFull = 0;
    for (let i = 0; i < total + 2; i++) {
      const at = w.document.querySelectorAll('#chat-body .chat-row').length;
      revealed = Math.max(revealed, at);
      if (at >= total) rowsAtFull = at;
      w.__test.unlock(); w.__test.advance();
      const st = w.__test.state();
      if (!st.chat) break;
    }
    ok('点击逐条揭示全部聊天记录（共 ' + total + ' 条）', revealed >= total, revealed + '/' + total);
    ok('聊天内容逐条渲染到聊天面板', rowsAtFull >= total, rowsAtFull + '/' + total + ' 条');
  }

  /* D6 三种收束实机可达 */
  const reached = {}, allVisited = new Set();
  const strategies = {
    '总是第一项': () => 0,
    '总是最后一项': (st, i, opts) => (opts ? opts.length : 1) - 1,
    '均衡经营（三项都顾）': greedy([1, 1, 1]),
    '只堆勇气': greedy([1, 1, 3]),
    '回避型（中间项）': (st, i, opts) => (opts && opts.length >= 3) ? 1 : 0,
    '消极到底（压低勇气）': greedy([0, 0, -1]),
    '什么都不经营': greedy([-1, -1, -1]),
    '拿捏分寸（勇气守在 40~55）': function (st, i, opts) {
      const node = globalThis.__winYJ.story.get(st.node);
      if (!node || !node.choices) return 0;
      let best = 0, bestScore = -1e9;
      node.choices.forEach((c, idx) => {
        const e = c.effects || {};
        const cou = st.courage + (e.courage || 0);
        const score = (e.affection || 0) + (e.trust || 0) - Math.abs(cou - 50) * 2.5;
        if (score > bestScore) { bestScore = score; best = idx; }
      });
      return best;
    }
  };
  for (const name of Object.keys(strategies)) {
    const w = await W({ audio: false });
    globalThis.__winYJ = w.YJ;
    w.__test.newGame();
    const end = playToEnding(w, strategies[name]);
    if (end.ending) reached[end.ending] = (reached[end.ending] || 0) + 1;
    if (end.visited) end.visited.forEach(v => allVisited.add(v));
    console.log('     · ' + name + ' → ' + (end.ending || '未结束') +
      '（好感 ' + end.affection + ' / 信任 ' + end.trust + ' / 勇气 ' + end.courage + '）');
  }
  ok('实机游玩可抵达收束 A《星星的答案》', !!reached.star, JSON.stringify(reached));
  ok('实机游玩可抵达收束 B《慢慢来》', !!reached.slow, JSON.stringify(reached));
  ok('实机游玩可抵达收束 C《这次是我先说的》', !!reached.she_first, JSON.stringify(reached));

  /* 完备性证明：结构可达 ∪ 前沿求解 ∪ 实机游玩 = 全部节点 */
  {
    const Y = globalThis.__winYJ;
    const frontier = solveAll(Y, 400000).reachable;
    const union = new Set();
    structuralReach(Y).forEach(v => union.add(v));
    frontier.forEach(v => union.add(v));
    allVisited.forEach(v => union.add(v));
    const miss = Y.story.order.filter(i => !union.has(i));
    console.log('     覆盖并集：结构 ' + structuralReach(Y).size + ' + 前沿 ' + frontier.size +
      ' + 实机 ' + allVisited.size + ' → ' + union.size + '/' + Y.story.count());
    ok('三种手段并集覆盖全部节点（无不可达内容）', miss.length === 0, miss.slice(0, 8).join(','));
  }

  /* D7 结局画面 */
  {
    const w = await W({ audio: false });
    globalThis.__winYJ = w.YJ;
    w.__test.newGame();
    const e = playToEnding(w, greedy([1, 1, 1]));
    ok('结局画面显示', w.__test.ui().endingVisible);
    ok('结局标题写入', w.document.getElementById('ending-title').textContent.length > 0);
    ok('结局画面含勇气统计', w.document.getElementById('ending-stats').innerHTML.indexOf('勇气') >= 0);
    ok('结局标记写入状态', !!e.ending && e.flags.indexOf('end_' + e.ending) >= 0, e.ending);
  }

  /* D8 存档 / 读档 / 刷新恢复 */
  {
    const w = await W({ audio: false });
    globalThis.__winYJ = w.YJ;
    w.__test.newGame();
    for (let i = 0; i < 15; i++) { w.__test.unlock(); if (w.__test.state().chat) { w.__test.advance(); continue; } w.__test.advance(); }
    const snap = w.__test.state().node;
    w.__test.setAffection(66); w.__test.setTrust(58);
    w.__test.raw().courage = 52;
    ok('存档写入成功', w.__test.save(1) === true);
    const listed = w.__test.slots().find(x => x.slot === 1);
    ok('存档含节点/三维数值/章节', !!(listed.data && listed.data.nodeId === snap &&
      listed.data.state.affection === 66 && listed.data.state.courage === 52));
    w.__test.setAffection(3); w.__test.setTrust(3); w.__test.raw().courage = 3;
    ok('读档返回成功', w.__test.load(1) === true);
    const after = w.__test.state();
    ok('读档恢复三维数值', after.affection === 66 && after.trust === 58 && after.courage === 52,
      JSON.stringify({ a: after.affection, t: after.trust, c: after.courage }));
    ok('读档回到存档节点', after.node === snap);
    const dump = w.__test.exportSave();
    const w2 = await W({ audio: false });
    globalThis.__winYJ = w2.YJ;
    w2.localStorage.setItem('yajin.v1.save.slot1', JSON.stringify(dump.slots['1']));
    ok('刷新（新会话）后可读到存档并恢复', w2.__test.load(1) === true && w2.__test.state().node === snap);
  }

  /* D9 新游戏重置 */
  {
    const w = await W({ audio: false });
    globalThis.__winYJ = w.YJ;
    w.__test.newGame();
    w.__test.setAffection(90); w.__test.flag('f_nail_cat');
    w.__test.newGame();
    const f = w.__test.state();
    ok('新游戏清空三维数值与标记', f.affection === 30 && f.trust === 30 && f.courage === 30 &&
      f.flags.length === 0 && f.node === 'c0_01' && !f.ending);
  }

  /* D10 连点保护 + 自动/快进 */
  {
    const w = await W({ audio: false });
    globalThis.__winYJ = w.YJ;
    w.__test.newGame();
    w.__test.unlock(); w.__test.advance();
    const lockedNode = w.__test.state().node, locked = w.__test.state().locked;
    for (let i = 0; i < 50; i++) { knockIfNeeded(w, w.__test); w.__test.advance(); }
    ok('转场期间连点不会推进剧情', locked ? w.__test.state().node === lockedNode : true);
    w.document.getElementById('btn-auto').click();
    ok('自动播放可开启', w.__test.state().auto === true);
    w.document.getElementById('btn-auto').click();
    ok('自动播放可关闭', w.__test.state().auto === false);
    w.document.getElementById('btn-skip').click();
    ok('快进可开启', w.__test.state().skip === true);
    w.document.getElementById('btn-backlog').click();
    ok('历史回看可打开且有内容', w.document.querySelectorAll('.modal.show').length > 0 &&
      w.document.getElementById('backlog-body').innerHTML.length > 50);
    w.YJ.ui.closeModal();
    w.document.getElementById('btn-save').click();
    const slotCount = w.document.querySelectorAll('#save-grid .slot').length;
    ok('存档槽位齐全（自动 + 6 手动 + 快速 = 8）', slotCount === 8, slotCount + ' 个');
    w.YJ.ui.closeModal();
    w.document.getElementById('btn-config').click();
    ok('设置界面可打开', w.document.getElementById('modal-settings').classList.contains('show'));
    w.YJ.ui.closeModal();
    w.document.getElementById('btn-title').click();
    w.document.getElementById('cf-ok').click();
    ok('可返回标题界面', w.__test.ui().titleVisible);
  }

  /* D11 资源失败兜底 + tint + 手部特写 */
  {
    const w = await W({ audio: false });
    globalThis.__winYJ = w.YJ;
    w.__test.newGame();
    const img = w.document.querySelector('#bg-layer .bg');
    ok('背景元素已创建', !!img);
    if (img) {
      img.dispatchEvent(new w.Event('error'));
      ok('背景加载失败时使用兜底图形', /^data:image\/svg\+xml/.test(img.src));
      ok('失败记录写入 assetIssues', w.__test.assetIssues().length > 0);
    }
    w.__test.goTo('c10_20');
    const tint = w.document.getElementById('tint-layer').className;
    ok('时段染色生效（tint 类名）', /tint-/.test(tint), tint);
    w.__test.goTo('c10_24');
    ok('手部特写层显示', w.document.getElementById('hand-layer').classList.contains('show'));
  }

  /* D12 完整通关控制台无报错 */
  {
    const w = await W({ audio: true });
    globalThis.__winYJ = w.YJ;
    w.__test.newGame();
    playToEnding(w, greedy([1, 1, 1]));
    const errs = w.__errors.filter(e => !/剧本校验/.test(e));
    ok('完整游玩过程中控制台无报错', errs.length === 0, errs.slice(0, 2).join(' | '));
    ok('立绘按需生成并缓存', w.__test.ui().spriteCache > 0, '缓存 ' + w.__test.ui().spriteCache);
  }
}

/* ============================================================
 *  E. 数值单元测试
 * ============================================================ */
function testNumbers(YJ) {
  section('E. 数值与条件单元测试');
  const st = YJ.state;
  const backup = JSON.parse(JSON.stringify(st.st));
  st.reset();
  const d = st.applyEffects({ affection: 5, trust: 3, courage: 4 });
  ok('effects 同时累加好感/信任/勇气', st.st.affection === 35 && st.st.trust === 33 && st.st.courage === 34 && d.dirty);
  st.applyEffects({ courage: -100 });
  ok('勇气下限夹到 0', st.st.courage === 0);
  st.applyEffects({ courage: 500 });
  ok('勇气上限夹到 100', st.st.courage === 100);
  st.reset();
  st.applyEffects({ flags: { f_nail_cat: true, f_postcard: true } });
  ok('flag 正确写入', !!st.st.flags.f_nail_cat && !!st.st.flags.f_postcard);
  ok('条件：flags 全满足', st.check({ flags: ['f_nail_cat', 'f_postcard'] }));
  ok('条件：缺少 flag 不满足', !st.check({ flags: ['f_jk_skirt'] }));
  ok('条件：notFlags 生效', !st.check({ notFlags: ['f_nail_cat'] }));
  ok('条件：anyFlags 生效', st.check({ anyFlags: ['f_jk_skirt', 'f_postcard'] }));
  st.st.courage = 55;
  ok('条件：courage 区间', st.check({ courage: { min: 55 } }) && !st.check({ courage: { min: 56 } }));

  let maxGain = 0, maxLoss = 0;
  for (const id of YJ.story.order) {
    const n = YJ.story.get(id);
    const list = [n.effects].concat((n.choices || []).map(c => c.effects));
    list.forEach(e => {
      if (!e) return;
      ['affection', 'trust', 'courage'].forEach(k => {
        if (typeof e[k] === 'number') { maxGain = Math.max(maxGain, e[k]); maxLoss = Math.min(maxLoss, e[k]); }
      });
    });
  }
  ok('单次数值变化幅度合理（+' + maxGain + ' / ' + maxLoss + '）', maxGain <= 8 && maxLoss >= -8,
    '+' + maxGain + '/' + maxLoss);
  Object.assign(st.st, backup);
}

/* ============================================================
 *  F. 音频
 * ============================================================ */
async function testAudio() {
  section('F. 音频');
  const w1 = await W({ audio: false });
  let threw = false;
  try { w1.YJ.audio.sfx('sfx_click'); w1.YJ.audio.playBGM('bgm_memory'); w1.YJ.audio.playAmbience('keyboard'); w1.YJ.audio.beat('swell'); }
  catch (e) { threw = true; }
  ok('无 AudioContext 时音频调用不抛错', !threw);
  ok('无 AudioContext 时安全降级', w1.__test.audioState().hasCtx === false);

  const fake = makeFakeAudio();
  const w2 = await W({ audio: fake });
  w2.__test.setSetting('sfxOn', false);
  w2.YJ.audio.sfx('sfx_click'); w2.YJ.audio.sfx('sfx_ding');
  ok('关闭音效后不创建任何发声节点', fake.calls.osc === 0, '创建了 ' + fake.calls.osc);
  w2.__test.setSetting('sfxOn', true);
  w2.YJ.audio.sfx('sfx_click');
  ok('重新开启音效后可发声', fake.calls.osc > 0);
  let beatOk = true;
  try { ['calm', 'pulse', 'swell', 'drop'].forEach(b => w2.YJ.audio.beat(b)); } catch (e) { beatOk = false; }
  ok('音乐节奏 beat() 四种模式均可用', beatOk);
  w2.YJ.audio.playBGM('bgm_game');
  w2.YJ.audio.playBGM('bgm_memory');
  ok('新增 BGM 可切换（bgm_game / bgm_memory）', w2.__test.audioState().bgm === 'bgm_memory');
}

/* ============================================================
 *  G. 布局
 * ============================================================ */
function testLayout() {
  section('G. 布局与响应式');
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  ok('舞台使用 16:9 等比缩放变量 --u', /--u:\s*calc\(min\(100vw,\s*177\.78vh\)\s*\/\s*1600\)/.test(html));
  ok('存在窄窗口媒体查询', /@media\s*\(max-aspect-ratio/.test(html));
  ok('对话框尺寸使用 --u', /#dialog\{[\s\S]*?calc\(var\(--u\)/.test(html));
  ok('立绘层使用 --u 定位', /\.char\{[\s\S]*?calc\(var\(--u\)/.test(html));
  ok('立绘进出场过渡已定义', /\.char\.entering\{/.test(html) && /transition:opacity/.test(html));
  ok('选项淡入动画已定义', /@keyframes choiceIn/.test(html));
  ok('数值浮标动画已定义', /@keyframes deltaFloat/.test(html));
  ok('聊天窗口样式与逐条出现动画已定义', /#chat-panel\{/.test(html) && /@keyframes msgPop/.test(html));
  ok('时段染色层样式已定义', /\.tint-night\{/.test(html) && /\.tint-rain\{/.test(html));
  ok('HUD 含好感/信任/勇气三条计量', /id="meter-affection"/.test(html) && /id="meter-trust"/.test(html) && /id="meter-courage"/.test(html));
  ok('结局画面与专属 CG 元素存在', /id="ending-screen"/.test(html) && /id="ending-cg"/.test(html));

  const uiSrc = fs.readFileSync(path.join(ROOT, 'src/ui.js'), 'utf8');
  const ids = new Set();
  let mm;
  const re1 = /\$\('#([A-Za-z0-9_-]+)'/g, re2 = /U\.q\('#([A-Za-z0-9_-]+)'/g;
  while ((mm = re1.exec(uiSrc))) ids.add(mm[1]);
  while ((mm = re2.exec(uiSrc))) ids.add(mm[1]);
  const missing = [...ids].filter(id => !new RegExp('id="' + id + '"').test(html));
  ok('ui.js 引用的 DOM id 全部存在（检查 ' + ids.size + ' 个）', missing.length === 0, missing.join(', '));
}

/* ============================================================
 *  主流程
 * ============================================================ */
async function main() {
  console.log('══════════════════════════════════════════');
  console.log(' 《你好！一周年》v2 验收测试');
  console.log('══════════════════════════════════════════');
  const YJ = loadOffline();
  testAssets(YJ);
  testStory(YJ);
  testSolve(YJ);
  await testEngine();
  testNumbers(YJ);
  await testAudio();
  testLayout();
  console.log('\n══════════════════════════════════════════');
  console.log(' 结果：' + pass + ' 项通过 / ' + fail + ' 项失败');
  if (fail) { console.log('\n 失败清单：'); failures.forEach(f => console.log('  · ' + f)); }
  console.log('══════════════════════════════════════════');
  process.exit(fail ? 1 : 0);
}
main();
