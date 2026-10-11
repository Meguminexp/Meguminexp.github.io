#!/usr/bin/env node
// ============================================================
// 星尘守卫 v3 — UI 冒烟测试
// 用 jsdom 假 canvas 加载游戏, 程序化走完所有弹层/流程:
// 主菜单 → 世界地图 → 开局 → 遗物 → 建造 → 开波 → 三选一 → 图鉴 → 设置 → 商店 → 结算
// 任一步抛错即失败。
// ============================================================
"use strict";
const fs=require('fs');
const path=require('path');
const {JSDOM}=require('jsdom');
const ROOT=path.join(__dirname,'..');

function makeFakeCtx(){
  const grad={addColorStop(){}};
  const base={canvas:{width:960,height:576},measureText(t){return{width:String(t==null?'':t).length*7}},
    createLinearGradient(){return grad},createRadialGradient(){return grad},getImageData(){return{data:new Uint8ClampedArray(4)}}};
  return new Proxy(base,{get(t,k){if(k in t)return t[k];if(typeof k==='string')return(t[k]=t[k]||(()=>{}));return undefined},set(t,k,v){t[k]=v;return true}});
}
function buildHTML(){
  let html=fs.readFileSync(path.join(ROOT,'index.html'),'utf8');
  return html.replace(/<script src="js\/([\w.-]+\.js)"><\/script>/g,(m,name)=>{
    return `<script>${fs.readFileSync(path.join(ROOT,'js',name),'utf8')}\n//# sourceURL=js/${name}\n</script>`; });
}
const dom=new JSDOM(buildHTML(),{url:'http://localhost:3080/',runScripts:'dangerously',pretendToBeVisual:true,storageQuota:10000000,
  beforeParse(w){w.HTMLCanvasElement.prototype.getContext=function(){return makeFakeCtx();};
    w.HTMLCanvasElement.prototype.toDataURL=()=>'data:image/png;base64,';
    w.requestAnimationFrame=()=>0;w.cancelAnimationFrame=()=>{};w.AudioContext=undefined;w.confirm=()=>false;}});
const win=dom.window;
const doc=win.document;
let pass=0, fail=0;
function ok(name,cond){ if(cond){ pass++; console.log(`✅ ${name}`);} else { fail++; console.log(`❌ ${name}`);} }
function must(name,fn){ try{ fn(); ok(name,true);}catch(e){ fail++; console.log(`❌ ${name}: ${e.message}`);} }

// 1. 启动
ok('启动后主菜单可见', doc.getElementById('ov-menu').classList.contains('show') && doc.getElementById('menu-panel').innerHTML.includes('星尘守卫'));

// 2. 世界地图
must('打开世界地图', ()=>{ win._toWorld(); });
ok('世界地图有 5 张章节卡', doc.querySelectorAll('#menu-panel .worldcard').length===5);
ok('世界地图有 3 个难度', doc.querySelectorAll('#menu-panel [data-diff]').length===3);
must('选择难度心颤(未解锁应提示)', ()=>{ const b=[...doc.querySelectorAll('#menu-panel [data-diff]')].find(x=>x.dataset.diff==='nightmare'); b.click(); });
ok('未解锁难度仍为普通', win.GAME.st.diff==='normal');

// 3. 解锁并开始一局
must('全解锁', ()=>{ win.DEBUG.unlockAll(); });
must('开始章节', ()=>{ win._startRun(); });
ok('进入遗物三选一', win.__test.ovArtifact() && doc.querySelectorAll('#artifact-panel .pick').length===3);
must('选遗物', ()=>{ win.__test.pickArtifact(0); });
ok('遗物后进入建造', win.__test.state==='BUILD');
ok('HUD 有建造卡片', doc.querySelectorAll('#hud .tcard[data-tower]').length>=1);

// 4. 建造与开波
must('放置 3 座星塔', ()=>{
  const tiles=win.__test.buildTiles();
  let n=0;
  for(const t of tiles){ if(n>=3) break; if(win.__test.placeTower('star',t.c,t.r)) n++; }
  if(n<3) throw new Error('只放置了 '+n+' 座');
});
ok('建造后塔数=3', win.__test.towers.length===3);
must('选中塔打开面板', ()=>{ const t=win.__test.towers[0]; win.GAME.st.selected=t; win.hudBuild(); });
ok('塔面板显示升级/出售', doc.getElementById('hud').innerHTML.includes('升级') && doc.getElementById('hud').innerHTML.includes('出售'));
ok('塔面板显示期望DPS', doc.getElementById('hud').innerHTML.includes('期望DPS'));
must('取消选中', ()=>{ win.GAME.st.selected=null; win.hudBuild(); });
must('开始波次', ()=>{ win.__test.wave(); });
ok('进入战斗', win.__test.state==='WAVE');
must('推进 2 秒', ()=>{ for(let i=0;i<120;i++) win.__test.update(win.GAME.FIXED/1000); });
ok('战斗中有敌人或已清波', win.__test.enemies.length>0 || win.__test.state!=='WAVE');

// 5. 直接清波进三选一
must('清波', ()=>{ win.DEBUG.clearWave(); win.__test.enemies.forEach(e=>{e.alive=false;e.reachedBase=false;}); win.__test.update(win.GAME.FIXED/1000); });
ok('进入三选一', win.__test.ovUpgrade() && doc.querySelectorAll('#upgrade-panel .pick').length>=3);
ok('三选一显示波次奖励', doc.getElementById('upgrade-panel').innerHTML.includes('波次奖励'));
must('选择第一张牌', ()=>{ win.__test.pickUpgrade(0); });
ok('选牌后回到建造', win.__test.state==='BUILD');
ok('升级计数生效', Object.keys(win.__test.upgrades).length>=1);

// 6. 图鉴
must('打开图鉴', ()=>{ win._codexOpen(); });
ok('图鉴 6 个标签', doc.querySelectorAll('#codex-panel .ctab').length===6);
for(const tab of ['element','tower','enemy','event','react','affix']){
  must(`图鉴标签 ${tab}`, ()=>{ win.showCodex(tab); });
  ok(`图鉴 ${tab} 有内容`, doc.querySelectorAll('#codex-panel .cx-entry').length>0);
}
ok('敌人图鉴已解锁遇见的敌人', win.GAME.meta.codex.enemies.length>0);
must('关闭图鉴回建造', ()=>{ win._codexBack(); });
ok('图鉴关闭后回建造', win.__test.state==='BUILD');

// 7. 设置
must('打开设置', ()=>{ win._settingsOpen(); });
ok('设置面板显示', doc.getElementById('settings-panel').innerHTML.includes('音效'));
must('切换音效', ()=>{ doc.querySelector('#set-sound .seg').click(); });
must('切换速度', ()=>{ doc.querySelector('#set-speed .seg[data-val="2"]').click(); });
ok('速度=3', win.GAME.st.speed===3);
must('关闭设置', ()=>{ win._settingsBack(); });

// 8. 商店
must('打开商店', ()=>{ win._shop(); });
ok('商店显示', doc.getElementById('shop-panel').innerHTML.includes('星尘商店'));
must('购买火塔', ()=>{ win._buyShop('tower_fire'); });
ok('火塔已拥有', win.GAME.meta.unlocks.tower_fire===true);
must('关闭商店回建造', ()=>{ win._shopBack(); });

// 9. 渲染不抛错
must('渲染一帧', ()=>{ win.render(); });

// 10. 结算
must('胜利结算', ()=>{ win.__test.winChapter(); });
ok('结算面板可见', win.__test.ovOver() && doc.getElementById('over-panel').innerHTML.includes('守护成功'));
ok('星尘增加', win.GAME.meta.stardust>0);
ok('stats.runs 增加', win.GAME.meta.stats.runs===1);

// 11. 失败结算
must('再来一局', ()=>{ win._retry(); });
must('选遗物', ()=>{ win.__test.pickArtifact(0); });
must('失败结算', ()=>{ win.__test.loseChapter(); });
ok('失败面板可见', doc.getElementById('over-panel').innerHTML.includes('回忆被偷走'));

// 12. 存档
ok('存档已写入', win.localStorage.getItem('stardust_td_save_v3')!==null);
ok('DEBUG 兼容', typeof win.DEBUG.addCoins==='function' && typeof win.DEBUG.spawn==='function');

console.log(`\nUI 冒烟测试: ${pass} 通过 / ${fail} 失败`);
process.exit(fail>0?1:0);
