#!/usr/bin/env node
// ============================================================
// 星尘守卫 v3 — 无头平衡模拟器
// 用 jsdom + 假 canvas 加载真实游戏脚本, AI 玩家自动打完整局,
// 跨 章节×难度 输出胜率与数值指标, 用于验证 DESIGN.md 的数值模型。
//
// 用法: node test/sim.js [runsPerCell] [chapter|all] [diff|all]
// ============================================================
"use strict";
const fs=require('fs');
const path=require('path');
const {JSDOM}=require('jsdom');

const ROOT=path.join(__dirname,'..');
const RUNS_PER_CELL = parseInt(process.argv[2]||'5',10);
const FILTER_CH = process.argv[3]||'all';
const FILTER_DIFF = process.argv[4]||'all';

// ---------- 假 canvas 2D 上下文 ----------
function makeFakeCtx(){
  const grad={addColorStop(){}};
  const base={
    canvas:{width:960,height:576},
    measureText(t){ return {width: String(t==null?'':t).length*7}; },
    createLinearGradient(){ return grad; },
    createRadialGradient(){ return grad; },
    getImageData(){ return {data:new Uint8ClampedArray(4)}; },
  };
  return new Proxy(base,{
    get(t,k){ if(k in t) return t[k]; if(typeof k==='string') return (t[k]=t[k]||(()=>{})); return undefined; },
    set(t,k,v){ t[k]=v; return true; },
  });
}

// ---------- 组装内联脚本的 HTML ----------
function buildHTML(){
  let html=fs.readFileSync(path.join(ROOT,'index.html'),'utf8');
  html=html.replace(/<script src="js\/([\w.-]+\.js)"><\/script>/g,(m,name)=>{
    const code=fs.readFileSync(path.join(ROOT,'js',name),'utf8');
    return `<script>${code}\n//# sourceURL=js/${name}\n</script>`;
  });
  return html;
}

// ---------- 启动 jsdom ----------
function createWindow(){
  const html=buildHTML();
  const dom=new JSDOM(html,{
    url:'http://localhost:3080/',
    runScripts:'dangerously',
    pretendToBeVisual:true,
    storageQuota:10000000,
    beforeParse(window){
      // 假 canvas 上下文
      window.HTMLCanvasElement.prototype.getContext=function(){ return makeFakeCtx(); };
      window.HTMLCanvasElement.prototype.toDataURL=()=>'data:image/png;base64,';
      // rAF 挂起(模拟器手动驱动)
      window.requestAnimationFrame=()=>0;
      window.cancelAnimationFrame=()=>{};
      // Audio 不可用(游戏内 try/catch 兜底)
      window.AudioContext=undefined; window.webkitAudioContext=undefined;
      // 禁用 confirm(重置存档等)
      window.confirm=()=>false;
    },
  });
  return dom.window;
}

// ---------- AI 玩家 ----------
const ART_SCORE={hunt:4,scholar:3,lucky:3,piggy:2,hourglass:2,heart:1,glutton:1,scroll:1};
const RARITY_W={common:3,uncommon:5,rare:7,epic:10};

function pickArtifact(win){
  const info=win.__test.artifactInfo();
  if(!info.length) return false;
  let bi=0, bs=-1;
  info.forEach((a,i)=>{ const s=ART_SCORE[a.id]||0; if(s>bs){ bs=s; bi=i; } });
  return win.__test.pickArtifact(bi);
}
function pickDraft(win){
  const info=win.__test.draftInfo();
  if(!info.length){ win.__test.skipUpgrade(); return; }
  const st=win.__test, coins=st.coins, hp=st.hp;
  const chapter=win.GAME.st.chapter, theme=win.GAME.CHAPTERS[chapter].theme;
  let bi=0, bs=-1;
  info.forEach((u,i)=>{
    let s=RARITY_W[u.rarity]||2;
    if(u.el===theme) s+=3;
    if(u.tag==='经济'){ s += coins<200?2:-1; }
    if(u.tag==='生存'){ s += hp<9?2:0; }
    if(u.danger){ s-=1; if(hp<=4) s-=4; }
    if(u.id==='all_dmg'||u.id==='all_rate'||u.id==='all_range') s+=1;
    if(s>bs){ bs=s; bi=i; }
  });
  win.__test.pickUpgrade(bi);
}

function chooseTowerId(win, themeTower){
  const ids=Object.keys(win.GAME.TOWERS).filter(id=>win.towerUnlocked(id));
  if(!ids.length) return null;
  const counts={};
  for(const t of win.__test.towers) counts[t.element]=(counts[t.element]||0)+1;
  const coins=win.__test.coins;
  const themeEl=win.GAME.TOWERS[themeTower].element;
  const affordable=ids.filter(id=>Math.round(win.GAME.TOWERS[id].cost*win.GAME.towerCostBonus)<=coins);
  if(!affordable.length) return null;
  // 主题塔优先; 若已有≥5座主题塔则补星塔; 否则取最便宜的
  if(affordable.indexOf(themeTower)>=0 && (counts[themeEl]||0)<5) return themeTower;
  const star=affordable.find(id=>id==='star');
  if(star && (counts.star||0)>=1 && (counts[themeEl]||0)>=3) return star;
  return affordable.sort((a,b)=>win.GAME.TOWERS[a].cost-win.GAME.TOWERS[b].cost)[0];
}
function pathParam(win,c,r){ // 瓦片中心投影到路径折线, 返回 {t:0..1, d:距离px}
  const wps=win.GAME.st.path&&win.GAME.st.path.wps;
  if(!wps||!wps.length) return {t:0,d:0};
  const x=c*48+24, y=r*48+24;
  let bestT=0, bestD=1e9;
  for(let i=0;i<wps.length-1;i++){
    const a=wps[i],b=wps[i+1];
    const dx=b.x-a.x, dy=b.y-a.y, len2=dx*dx+dy*dy||1;
    let t=((x-a.x)*dx+(y-a.y)*dy)/len2; t=Math.max(0,Math.min(1,t));
    const px=a.x+dx*t, py=a.y+dy*t;
    const d=Math.hypot(x-px,y-py);
    if(d<bestD){ bestD=d; bestT=(i+t)/(wps.length-1); }
  }
  return {t:bestT,d:bestD};
}
function chooseTile(win){
  const tiles=win.__test.buildTiles();
  const towers=win.__test.towers;
  if(!tiles.length) return null;
  // 相位顺序: 前两座放中段(敌人停留最久), 再逐步铺开覆盖全路径
  const PHASE_ORDER=[0.14,0.54,0.34,0.74,0.06,0.94,0.26,0.66,0.46,0.86,0.2,0.6,0.4,0.8,0.02,0.98,0.3,0.7,0.5,0.9];
  const placed=towers.length;
  const phase=PHASE_ORDER[placed%PHASE_ORDER.length];
  let best=null, bestScore=-1e9;
  for(const t of tiles){
    if(towers.some(tw=>tw.col===t.c&&tw.row===t.r)) continue;
    const pp=pathParam(win,t.c,t.r);
    if(pp.d>75) continue;                 // 必须贴近路径(≤1.5格)
    let spd=9; for(const tw of towers){ const d=Math.hypot(tw.col-t.c,tw.row-t.r); if(d<spd)spd=d; }
    const spacing=Math.min(spd,3);
    const alongScore=1-Math.abs(pp.t-phase)*2;
    const score=alongScore*2.2 + spacing*0.5 - (pp.d/48)*0.3;
    if(score>bestScore){ bestScore=score; best=t; }
  }
  return best;
}
function tryBuild(win){
  const chapter=win.GAME.st.chapter;
  const theme=win.GAME.CHAPTERS[chapter].tower;
  const id=chooseTowerId(win, theme);
  if(!id) return false;
  const tile=chooseTile(win);
  if(!tile) return false;
  return win.__test.placeTower(id, tile.c, tile.r);
}
function tryUpgrade(win){
  const towers=win.__test.towers;
  if(towers.length<6) return false;               // 先铺塔
  let best=null, bestD=0;
  for(const t of towers){ if(t.level<win.__test.maxLevel() && t.dps()>bestD){ bestD=t.dps(); best=t; } }
  if(!best) return false;
  const c=best.upgradeCost();
  const coins=win.__test.coins;
  // 铺到 10 座后优先升级; 否则仅在金币充裕时升级
  const preferUp = towers.length>=10 || coins>=c*4;
  if(preferUp && coins>=c) return win.__test.upgradeTower(best);
  return false;
}
function tryEmergency(win){
  const st=win.__test;
  if(st.hp <= win.GAME.st.maxHp*0.25 && st.towers.length<20){
    const before=st.towers.length;
    tryBuild(win);
    return st.towers.length>before;
  }
  return false;
}

// ---------- 单局 ----------
function playRun(win, chapter, diff, seed){
  const dust0=win.GAME.meta.stardust;
  win.__test.run(chapter, diff, seed);
  // 遗物
  if(win.__test.ovArtifact()) pickArtifact(win);
  let steps=0, maxSteps=180000, lastChange=0, lastWave=0, stall=false;
  const t0=Date.now();
  while(win.__test.state!=='OVER' && steps<maxSteps){
    const s=win.__test.state;
    if(s==='BOOT'){ if(!pickArtifact(win)){ win.__test.update(win.GAME.FIXED/1000); steps++; } }
    else if(s==='BUILD'){
      if(tryUpgrade(win)){ /* upgraded */ }
      else if(tryBuild(win)){ /* placed */ }
      else { win.__test.wave(); }
    }
    else if(s==='WAVE'){
      tryEmergency(win);
      for(let i=0;i<30;i++){
        win.__test.update(win.GAME.FIXED/1000); steps++;
        if(win.__test.state!=='WAVE') break;
      }
      // 停滞检测(400s 无波次推进 → 判定软锁)
      if(win.__test.waveNum!==lastWave){ lastWave=win.__test.waveNum; lastChange=steps; }
      else if(steps-lastChange>24000){ stall=true; break; }
    }
    else if(s==='UPGRADE'){ pickDraft(win); }
    else if(s==='OVER') break;
    else { win.__test.update(win.GAME.FIXED/1000); steps++; }
  }
  const st=win.GAME.st;
  const res={
    chapter, diff, seed,
    win: st.over && st.wave>=10,
    wave: st.wave, hp: Math.max(0,st.hp), maxHp: st.maxHp,
    coins: st.coins, towers: win.__test.towers.length, kills: st.kills, leaks: st.leaks,
    stardust: win.GAME.meta.stardust-dust0,
    ms: Date.now()-t0,
    abort: steps>=maxSteps?'timeout':(stall?'stall':undefined),
  };
  return res;
}

// ---------- 主流程 ----------
function main(){
  const win=createWindow();
  // 全解锁(测试所有塔的可用性), 但按章节递进解锁塔来模拟真实进度
  const chapters=['ch1','ch2','ch3','ch4','ch5'];
  const diffs=['normal','hard','nightmare','abyss'];
  const summary={};
  const rows=[];
  let totalRuns=0, totalMs=0, errors=0;

  for(const ch of chapters){
    if(FILTER_CH!=='all' && FILTER_CH!==ch) continue;
    // 重置存档 → 按章节解锁到当前章的塔(模拟真实进度)
    win.DEBUG.resetSave();
    const ci=chapters.indexOf(ch);
    for(let i=1;i<=ci;i++){
      const c=win.GAME.CHAPTERS[chapters[i]];
      win.GAME.meta.unlocks[c.unlock]=true; win.GAME.meta.unlocks['tower_'+c.tower]=true;
    }
    win.GAME.meta.stats.chaptersCleared=[...chapters.slice(0,ci)];
    for(const diff of diffs){
      if(FILTER_DIFF!=='all' && FILTER_DIFF!==diff) continue;
      // 难度解锁
      if(diff!=='normal'){ win.GAME.meta.unlocks[win.GAME.DIFFS[diff].unlock]=true; }
      const runs=[];
      for(let r=0;r<RUNS_PER_CELL;r++){
        try{
          const res=playRun(win, ch, diff, 1000+totalRuns);
          runs.push(res); totalRuns++; totalMs+=res.ms;
          if(res.abort) console.warn(`⚠️  ${ch}/${diff} run#${r}: ${res.abort}`);
        }catch(e){
          errors++;
          console.warn(`❌ ${ch}/${diff} run#${r}: ${e.message}\n${(e.stack||'').split('\n').slice(0,4).join('\n')}`);
        }
      }
      const wins=runs.filter(r=>r.win).length;
      const avg=arr=>arr.length? (arr.reduce((a,b)=>a+b,0)/arr.length):0;
      const agg={
        ch, diff, runs:runs.length, winRate: runs.length? Math.round(wins/runs.length*100):0,
        avgWave: +avg(runs.map(r=>r.wave)).toFixed(1),
        avgHP: +avg(runs.map(r=>r.hp)).toFixed(1),
        avgTowers: +avg(runs.map(r=>r.towers)).toFixed(1),
        avgKills: Math.round(avg(runs.map(r=>r.kills))),
        avgLeaks: +avg(runs.map(r=>r.leaks)).toFixed(1),
        avgDust: Math.round(avg(runs.map(r=>r.stardust))),
      };
      rows.push(agg);
      const key=ch+'_'+diff; summary[key]=agg;
    }
  }

  // 输出
  console.log('\n========== 星尘守卫 v3 平衡模拟结果 ==========');
  console.log(`总局数: ${totalRuns} · 平均单局 ${(totalMs/totalRuns).toFixed(0)}ms · 异常 ${errors}\n`);
  console.log('章节 | 难度     | 胜率 | 平均波 | 剩余HP | 塔数 | 击杀 | 漏怪 | 星尘');
  console.log('-----|----------|------|--------|--------|------|------|------|------');
  for(const r of rows){
    console.log(`${r.ch}  | ${r.diff.padEnd(8)} | ${String(r.winRate+'%').padStart(4)} | ${String(r.avgWave).padStart(6)} | ${String(r.avgHP).padStart(6)} | ${String(r.avgTowers).padStart(4)} | ${String(r.avgKills).padStart(4)} | ${String(r.avgLeaks).padStart(4)} | ${r.avgDust}`);
  }
  // 验收(新难度阶梯: 甜梦应偏松、深渊应极难)
  const norm=rows.filter(r=>r.diff==='normal');
  const hard=rows.filter(r=>r.diff==='hard');
  const nite=rows.filter(r=>r.diff==='nightmare');
  const abys=rows.filter(r=>r.diff==='abyss');
  const nAvg=n=> n.length? Math.round(n.reduce((a,b)=>a+b.winRate,0)/n.length):0;
  console.log('\n--- 验收 ---');
  console.log(`甜梦胜率均值: ${nAvg(norm)}% (目标 70~92)`);
  console.log(`心动胜率均值: ${nAvg(hard)}% (目标 35~70)`);
  console.log(`心颤胜率均值: ${nAvg(nite)}% (目标 12~40)`);
  console.log(`深渊胜率均值: ${nAvg(abys)}% (目标 3~25)`);
  const pass = nAvg(norm)>=70 && nAvg(norm)<=92 && nAvg(hard)>=35 && nAvg(hard)<=70
    && nAvg(nite)>=12 && nAvg(nite)<=40 && nAvg(abys)>=3 && nAvg(abys)<=25;
  console.log(pass?'✅ 数值达标(难度阶梯合理)':'⚠️ 数值未达标, 需要调整');
  return pass?0:1;
}
process.exit(main());
