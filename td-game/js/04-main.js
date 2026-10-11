// ============================================================
// [04] MAIN — 渲染 / 输入 / 状态机 / 主循环 / 启动 / 调试
// ============================================================
"use strict";

// ============================================================
// 渲染器
// ============================================================
const cv=document.getElementById('game'), ctx=cv.getContext('2d');
ctx.imageSmoothingEnabled=false;
function render(){
  ctx.fillStyle='#221a4a'; ctx.fillRect(0,0,W,H);
  if(!st.grid){ return; }
  ctx.save();
  if(fx.shake>0){ ctx.translate((Math.random()-0.5)*fx.shakeAmp, (Math.random()-0.5)*fx.shakeAmp); }
  // 瓦片
  for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++){
    const t=st.grid[r][c];
    if(t.type==='build'){ ctx.drawImage(bakeSprite('grass'),0,0,SPR,SPR,c*TILE,r*TILE,TILE,TILE); }
    else if(t.type==='path'){
      ctx.drawImage(bakeSprite('path_tile'),0,0,SPR,SPR,c*TILE,r*TILE,TILE,TILE);
      if(t.slow){ ctx.fillStyle='rgba(110,170,255,.38)'; ctx.fillRect(c*TILE,r*TILE,TILE,TILE);
        ctx.fillStyle='rgba(255,255,255,.22)'; ctx.fillRect(c*TILE+5,r*TILE+6,TILE-10,4); }
      else if(t.magma){ ctx.fillStyle='rgba(255,107,61,.55)'; ctx.fillRect(c*TILE,r*TILE,TILE,TILE);
        ctx.fillStyle='rgba(255,214,102,.5)'; ctx.fillRect(c*TILE+6,r*TILE+8,TILE-12,6);
        ctx.fillStyle='rgba(255,180,80,.4)'; ctx.fillRect(c*TILE+10,r*TILE+4,TILE-14,4); }
      else if(t.ice){ ctx.fillStyle='rgba(160,220,255,.35)'; ctx.fillRect(c*TILE,r*TILE,TILE,TILE);
        ctx.strokeStyle='rgba(255,255,255,.4)'; ctx.lineWidth=1;
        ctx.beginPath(); ctx.moveTo(c*TILE+8,r*TILE); ctx.lineTo(c*TILE+16,r*TILE+6); ctx.lineTo(c*TILE+8,r*TILE+12); ctx.lineTo(c*TILE+2,r*TILE+6); ctx.closePath(); ctx.stroke(); }
      else if(t.stone){ ctx.fillStyle='rgba(255,214,107,.3)'; ctx.fillRect(c*TILE,r*TILE,TILE,TILE);
        ctx.fillStyle='rgba(122,74,196,.5)'; ctx.fillRect(c*TILE+6,r*TILE+6,6,6);
        ctx.fillStyle='#fff3a8'; ctx.fillRect(c*TILE+8,r*TILE+8,2,2); }
      else if(t.poison){ ctx.fillStyle='rgba(127,216,107,.3)'; ctx.fillRect(c*TILE,r*TILE,TILE,TILE);
        ctx.fillStyle='rgba(74,156,74,.35)'; ctx.beginPath(); ctx.arc(c*TILE+TILE/2,r*TILE+TILE/2,10,0,7); ctx.fill();
        ctx.fillStyle='rgba(200,242,168,.3)'; ctx.beginPath(); ctx.arc(c*TILE+14,r*TILE+10,6,0,7); ctx.fill(); }
    }
    else if(t.type==='block'){ ctx.drawImage(bakeSprite('block'),0,0,SPR,SPR,c*TILE,r*TILE,TILE,TILE); }
  }
  // 基地 & 入口
  const base=path.wps[path.wps.length-1];
  drawSprite(ctx,'heart', base.x-TILE/2+4, base.y-TILE/2+4, PX);
  const ent=path.wps[0];
  ctx.fillStyle='rgba(255,214,107,.55)';
  ctx.beginPath(); ctx.moveTo(ent.x-TILE/2+2,ent.y-TILE/2); ctx.lineTo(ent.x+TILE/2-2,ent.y);
  ctx.lineTo(ent.x-TILE/2+2,ent.y+TILE/2); ctx.closePath(); ctx.fill();
  ctx.fillStyle='#ffe9a8'; ctx.font='bold 10px sans-serif'; ctx.textAlign='center';
  ctx.fillText('入口',ent.x,ent.y+TILE/2+14); ctx.textAlign='left';
  // 塔
  const hs=PX*0.85;
  for(const t of TowerSystemInst.list){
    drawSprite(ctx,'tower_base', t.pos.x-TILE/2+4, t.pos.y-TILE/2+4, PX);
    drawHead(ctx, t.element, t.def.color, t.def.color2, t.pos.x-12*hs/2, t.pos.y-12*hs/2+hs*2, hs);
    if(t.level>1){ ctx.fillStyle='#ffd66b'; ctx.fillRect(t.pos.x-6, t.pos.y-10, 12, 2);
      ctx.fillStyle='#ff8fa3'; ctx.fillRect(t.pos.x-4, t.pos.y-8, 8, 2); }
    if(t.level>=3){ ctx.fillStyle='#ffe9a8'; ctx.fillRect(t.pos.x-2, t.pos.y-6, 4, 2); }
    if(now<t.frozenUntil){ ctx.fillStyle='rgba(150,220,255,.35)'; ctx.fillRect(t.pos.x-TILE/2, t.pos.y-TILE/2, TILE, TILE); }
    if(st.selected===t){ ctx.strokeStyle='rgba(255,214,107,.8)'; ctx.lineWidth=2;
      ctx.beginPath(); ctx.arc(t.pos.x,t.pos.y,t.range*TILE,0,7); ctx.stroke();
      ctx.strokeStyle='rgba(255,214,107,.25)'; ctx.setLineDash([6,6]);
      ctx.beginPath(); ctx.arc(t.pos.x,t.pos.y,t.range*TILE,0,7); ctx.stroke(); ctx.setLineDash([]); }
  }
  // 敌人
  for(const e of enemies.list){ if(!e.alive)continue;
    const sc=PX*0.9*(e.def.size/10);
    drawEnemy(ctx,e.def,e.pos.x,e.pos.y,sc);
    if(e.hitFlash>0){ ctx.globalAlpha=Math.min(1,e.hitFlash*10);
      ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(e.pos.x,e.pos.y,7,0,7); ctx.fill(); ctx.globalAlpha=1; }
    if(now<e.frozenUntil){
      ctx.fillStyle='rgba(150,220,255,.45)'; ctx.beginPath(); ctx.arc(e.pos.x,e.pos.y,10,0,7); ctx.fill();
      ctx.strokeStyle='#e8faff'; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(e.pos.x,e.pos.y,10,0,7); ctx.stroke(); }
    if(e.hp<e.maxHp){ const w=22; const frac=clamp(e.hp/e.maxHp,0,1);
      ctx.fillStyle='#2a1030'; ctx.fillRect(e.pos.x-w/2,e.pos.y-16,w,4);
      ctx.fillStyle=frac>0.4?'#7fd8c0':(frac>0.2?'#ffd66b':'#ff5b5b');
      ctx.fillRect(e.pos.x-w/2,e.pos.y-16,w*frac,4); }
    let sy=e.pos.y-20;
    if(now<e.slowUntil){ ctx.fillStyle='rgba(150,200,255,.6)'; ctx.fillRect(e.pos.x-6,sy,12,2); }
    if(now<e.burnUntil){ ctx.fillStyle='rgba(255,107,61,.8)'; ctx.fillRect(e.pos.x-6,sy-3,12,2); }
    if(now<e.poisonUntil){ ctx.fillStyle='rgba(127,216,107,.8)'; ctx.fillRect(e.pos.x-6,sy-6,12,2); }
    if(now<e.vulnerableUntil){ ctx.strokeStyle='rgba(255,243,168,.9)'; ctx.lineWidth=1;
      ctx.beginPath(); ctx.arc(e.pos.x,e.pos.y,11,0,7); ctx.stroke(); }
    if(e.def.weak && ELEMENTS[e.def.weak]){ ctx.fillStyle=ELEMENTS[e.def.weak].color;
      ctx.fillRect(e.pos.x+11, e.pos.y-10, 4, 4); }
    if(e.modifier){ const ac=(ELITE_AFFIXES.find(a=>a.id===e.modifier)||{}).color||'#fff';
      ctx.fillStyle=ac; ctx.beginPath();
      ctx.moveTo(e.pos.x-5,e.pos.y-13); ctx.lineTo(e.pos.x+5,e.pos.y-13); ctx.lineTo(e.pos.x,e.pos.y-19); ctx.closePath(); ctx.fill(); }
    if(e.shield>0){ ctx.strokeStyle='rgba(127,216,232,.85)'; ctx.lineWidth=2;
      ctx.beginPath(); ctx.arc(e.pos.x,e.pos.y,12,0,7); ctx.stroke(); }
    if(e.enraged){ ctx.globalAlpha=0.5+0.3*Math.sin(now*10);
      ctx.strokeStyle='#ff5b5b'; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(e.pos.x,e.pos.y,14,0,7); ctx.stroke(); ctx.globalAlpha=1; }
  }
  // 投射物
  for(const p of projectiles.list){ if(p.hit)continue; drawProjectile(ctx,p); }
  // 区域
  for(const h of hazards.list){ ctx.globalAlpha=0.25+0.15*Math.sin(h.life*8);
    ctx.fillStyle=h.color; ctx.beginPath(); ctx.arc(h.x,h.y,h.radius,0,7); ctx.fill();
    ctx.globalAlpha=1; }
  // 粒子
  for(const p of particles.list){ ctx.globalAlpha=1-p.life/p.max; ctx.fillStyle=p.color;
    ctx.fillRect(p.x-1,p.y-1,p.size,p.size); }
  ctx.globalAlpha=1;
  // 飘字
  ctx.font='bold 11px sans-serif'; ctx.textAlign='center';
  for(const f of floaters.list){ ctx.globalAlpha=1-f.life/f.max;
    ctx.fillStyle=f.crit?'#ffd66b':'#fff';
    if(f.crit) ctx.font='bold 14px sans-serif';
    ctx.fillText(f.val, f.x, f.y);
    if(f.crit) ctx.font='bold 11px sans-serif'; }
  ctx.globalAlpha=1; ctx.textAlign='left';
  // hover 幽灵
  if(hover && hover.valid && st.armed){
    const hdef=TOWERS[st.armed];
    ctx.globalAlpha=hover.canAfford?0.6:0.35;
    drawSprite(ctx,'tower_base', hover.c*TILE+4, hover.r*TILE+4, PX);
    drawHead(ctx, hdef.element, hdef.color, hdef.color2, hover.c*TILE+TILE/2-12*hs/2, hover.r*TILE+TILE/2-12*hs/2+hs*2, hs);
    ctx.globalAlpha=1;
    ctx.strokeStyle=hover.canAfford?'rgba(255,214,107,.85)':'rgba(255,91,122,.75)'; ctx.lineWidth=2;
    ctx.strokeRect(hover.c*TILE+1,hover.r*TILE+1,TILE-2,TILE-2);
    ctx.strokeStyle='rgba(255,214,107,.35)';
    ctx.beginPath(); ctx.arc(hover.c*TILE+TILE/2,hover.r*TILE+TILE/2,hdef.range*TILE,0,7); ctx.stroke();
  }
  ctx.restore();
  // 漏怪红闪
  if(fx.leakFlash>0){ ctx.fillStyle=`rgba(255,60,80,${fx.leakFlash*0.35})`; ctx.fillRect(0,0,W,H); }
  // Boss 血条
  drawBossBar();
  // 反应横幅
  if(fx.banner){ const b=fx.banner; b.t+=renderDt;
    const a= b.t<0.15? b.t/0.15 : (b.t> b.life-0.3? (b.life-b.t)/0.3 : 1);
    const scale=1+0.25*Math.max(0,0.15-b.t)/0.15;
    ctx.save(); ctx.translate(W/2, H*0.22); ctx.scale(scale,scale);
    ctx.globalAlpha=clamp(a,0,1);
    ctx.font='bold 26px sans-serif'; ctx.textAlign='center';
    ctx.fillStyle='rgba(20,16,48,.7)';
    const tw=ctx.measureText(b.text).width;
    ctx.fillRect(-tw/2-14,-22,tw+28,34);
    ctx.strokeStyle=b.color; ctx.lineWidth=2; ctx.strokeRect(-tw/2-14,-22,tw+28,34);
    ctx.fillStyle=b.color; ctx.fillText(b.text,0,3);
    ctx.restore(); ctx.globalAlpha=1; }
}
function drawBossBar(){
  const boss=enemies.list.find(e=>e.alive&&e.def.boss);
  if(!boss) return;
  const bw=340, bh=14, bx=W/2-bw/2, by=10;
  const frac=clamp(boss.hp/boss.maxHp,0,1);
  ctx.fillStyle='rgba(20,16,48,.85)'; ctx.fillRect(bx-4,by-4,bw+8,bh+22);
  ctx.strokeStyle='#3a3168'; ctx.lineWidth=2; ctx.strokeRect(bx-4,by-4,bw+8,bh+22);
  ctx.fillStyle='#2a1030'; ctx.fillRect(bx,by,bw,bh);
  const col= boss.enraged? (Math.sin(now*10)>0?'#ff5b5b':'#ff8fa3') : '#ffd66b';
  ctx.fillStyle=col; ctx.fillRect(bx,by,bw*frac,bh);
  ctx.font='bold 12px sans-serif'; ctx.textAlign='center'; ctx.fillStyle='#fff';
  ctx.fillText(`👑 ${boss.def.name}${boss.def.weak?` (弱${ELEMENTS[boss.def.weak].name})`:''} ${Math.ceil(boss.hp)}`, W/2, by+bh+14);
  ctx.textAlign='left';
}

// ============================================================
// 输入
// ============================================================
let hover=null;
function mouseXY(e){ const r=cv.getBoundingClientRect();
  return [ (e.clientX-r.left)*(W/r.width), (e.clientY-r.top)*(H/r.height) ]; }
cv.addEventListener('mousemove',e=>{ const [x,y]=mouseXY(e);
  hover=null; if(st.armed && st.grid){ const c=Math.floor(x/TILE), r2=Math.floor(y/TILE);
    const t=st.grid[r2]&&st.grid[r2][c];
    if(t && t.type==='build'){ const cost=Math.round(TOWERS[st.armed].cost*towerCostBonus);
      hover={c,r:r2,valid:true,canAfford:Eco.canAfford(cost)||st.freePlace>0}; } } });
cv.addEventListener('mouseleave',()=>hover=null);
cv.addEventListener('click',e=>{
  if(st.state!=='BUILD'&&st.state!=='WAVE') return;
  const [x,y]=mouseXY(e);
  const c=Math.floor(x/TILE), r2=Math.floor(y/TILE);
  const t=st.grid[r2]&&st.grid[r2][c]?st.grid[r2][c].tower:null;
  if(t){ st.selected=st.selected===t?null:t; hudBuild(); return; }
  if(st.armed){
    const def=TOWERS[st.armed];
    const cost=Math.round(def.cost*towerCostBonus);
    const afford=Eco.canAfford(cost)||st.freePlace>0;
    if(path.canBuild(c,r2) && afford){
      TowerSystemInst.add(def,c,r2,path);
      if(st.freePlace>0) st.freePlace--; else Eco.spend(cost);
      SFX.place(); particles.burst(c*TILE+TILE/2,r2*TILE+TILE/2,def.color,8,4);
      hudBuild();
    } else if(!afford) toast('金币不够啦',true);
  }
  else if(st.selected){ st.selected=null; hudBuild(); } });
cv.addEventListener('contextmenu',e=>{
  e.preventDefault();
  if(st.state!=='BUILD'&&st.state!=='WAVE') return;
  const [x,y]=mouseXY(e);
  const c=Math.floor(x/TILE), r2=Math.floor(y/TILE);
  const t=st.grid[r2]&&st.grid[r2][c]?st.grid[r2][c].tower:null;
  if(t){ Eco.refund(t); TowerSystemInst.remove(t); st.grid[r2][c].tower=null;
    if(st.selected===t) st.selected=null; SFX.sell(); particles.burst(t.pos.x,t.pos.y,'#ffd66b',10,4); hudBuild(); } });
document.addEventListener('keydown',e=>{
  if(e.code==='Space'){ e.preventDefault(); if(st.state!=='WAVE'&&st.state!=='UPGRADE'&&st.state!=='OVER') startWave(); }
  else if(e.code==='KeyP'){ togglePause(); }
  else if(e.code==='Escape'){ st.armed=null; st.selected=null; hudBuild(); }
  else if(/^Digit[1-9]$/.test(e.code)){ const n=+e.code[5];
    const unlockedIds=ELEMENT_ORDER.filter(towerUnlocked);
    const id=unlockedIds[n-1];
    if(id){ st.armed=st.armed===id?null:id; st.selected=null; hudBuild(); } }
});

// ============================================================
// 本局流程
// ============================================================
function newRun(chapterId,diff,seed){
  const c=CHAPTERS[chapterId]||CHAPTERS.ch1;
  st.chapter=chapterId||'ch1'; st.mapId=c.map;
  st.diff=diff||st.diff; st.seed=seed||(Math.random()*1e9|0);
  path=new MapPath(st.mapId); st.grid=path.grid; st.path=path;
  st.hp=START.hp; st.maxHp=START.hp; st.coins=START.coins;
  if(meta.unlocks.start_plus_hp){ st.maxHp+=5; st.hp=st.maxHp; }
  if(meta.unlocks.start_plus_coins) st.coins+=40;
  st.wave=0; st.kills=0; st.bosses=0; st.waveCleared=0; st.leaks=0;
  enemies.list.length=0; projectiles.list.length=0; particles.list.length=0;
  hazards.list.length=0; floaters.list.length=0; TowerSystemInst.list.length=0;
  for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++)st.grid[r][c].tower=null;
  st.upgrades={}; st.freePlace=0; st.armed=null; st.selected=null; st.over=false; st.event=null;
  st.piggy=0; st.scrollTower=0; st.scholar=0; st._lastInterest=0; st.paused=false;
  fx.streak=0; fx.streakMax=0; fx.streakShown=0; fx.banner=null; fx.shake=0; fx.leakFlash=0;
  resetRunBonuses();
  if(meta.unlocks.start_random_tower && Math.random()<0.5) st.freePlace++;
  hideAllOverlays();
  hudBuild();
  showArtifact();
}
function placeRandomTowers(n){
  const tiles=path.buildTiles();
  const unlocked=ELEMENT_ORDER.filter(towerUnlocked);
  if(!tiles.length||!unlocked.length) return;
  tiles.sort(()=>Math.random()-0.5);
  for(let i=0;i<n && tiles.length;i++){
    const tile=tiles.shift();
    const id=unlocked[(Math.random()*unlocked.length)|0];
    TowerSystemInst.add(TOWERS[id], tile.c, tile.r, path);
  }
}
function startWave(){
  if(st.state==='WAVE'||st.state==='UPGRADE'||st.state==='OVER'||st.wave>=CHAPTER_WAVES) return;
  st.wave++; director.start(st.wave); st.state='WAVE'; SFX.wave();
  fx.streak=0; fx.streakShown=0;
  hudBuild();
}
function onEnemyKilled(e){
  let bounty=Math.round(e.bounty*bountyBonus*incomeMult());
  if(st.event && st.event.id==='treasure') bounty*=2;
  Eco.earn(bounty); st.kills++;
  fx.streak++; fx.streakMax=Math.max(fx.streakMax,fx.streak); addKillStreak(fx.streak);
  if(e.def.boss){ st.bosses++; SFX.level(); } else SFX.coin();
  if(lifestealOn && st.kills%10===0 && st.hp<st.maxHp){ st.hp++; }
  if(splatterOn){
    for(const o of enemies.list){ if(!o.alive||o===e)continue;
      if(dist(e.pos,o.pos)<=TILE*1.1) o.takeDamage(e.maxHp*0.30, null, true); }
    particles.burst(e.pos.x,e.pos.y,'#ffd66b',6,3);
  }
  if(now<e.burnUntil && !e.def.boss){
    let boomR=1.3*TILE;
    for(const t of TowerSystemInst.list){ if(t.element==='fire'&&t.def.explodeR) boomR=Math.max(boomR,t.def.explodeR*TILE); }
    for(const o of enemies.list){ if(!o.alive||o===e)continue;
      if(dist(e.pos,o.pos)<=boomR){ o.takeDamage(12,null,true); o.applyBurn(6,2,now); } }
    particles.burst(e.pos.x,e.pos.y,'#ff6b3d',10,5);
  }
  if(now<e.poisonUntil){ hazards.add(e.pos.x,e.pos.y,(naturePoolOn?1.5:1.1)*TILE,4,2.5,'#7fd86b','poison',0.5); }
  if(e.def.poolOnDeath){ hazards.add(e.pos.x,e.pos.y,TILE,3,3,'#7fd86b','poison',0.45); }
  if(e.def.chillDeath){
    for(const o of enemies.list){ if(!o.alive||o===e)continue;
      if(dist(e.pos,o.pos)<=TILE*2) o.applySlow(0.5,2,now); }
    particles.burst(e.pos.x,e.pos.y,'#a8e8f5',8,4);
  }
  if(e.def.towerBomb){
    for(const t of TowerSystemInst.list){ if(dist(t.pos,e.pos)<=TILE*1.5) t.frozenUntil=now+1; }
    particles.burst(e.pos.x,e.pos.y,'#ff6b3d',14,6); shakeGame(2);
  }
  if(e.def.split){
    for(let i=0;i<2;i++){ const mini=enemies.spawn('bubble',e.wpSeq,0.4,1);
      mini.pos={x:e.pos.x,y:e.pos.y}; mini.wpIdx=e.wpIdx; mini.def={...mini.def, split:false}; }
  }
  if(e.def.crabSplit){
    for(let i=0;i<2;i++){ const mini=enemies.spawn('crab2',e.wpSeq,0.5,1);
      mini.pos={x:e.pos.x,y:e.pos.y}; mini.wpIdx=e.wpIdx; }
  }
  if(e.modifier==='split'){
    for(let i=0;i<2;i++){ const mini=enemies.spawn(e.def.id,e.wpSeq,0.5,1);
      mini.pos={x:e.pos.x,y:e.pos.y}; mini.wpIdx=e.wpIdx; mini.def={...mini.def}; mini.modifier=null; }
  }
  particles.burst(e.pos.x,e.pos.y,e.def.color,6,4);
}
function onEnemyBase(e){
  // 漏怪伤害随波次/难度递增: 波1-4漏1血, 5-8漏2血, 9-10漏3血; Boss 漏怪×3; 高难度额外加成
  const dIdx=Math.max(0,Object.keys(DIFFS).indexOf(st.diff));
  let dmg=1+Math.floor((st.wave-1)/4);
  if(e.def.boss) dmg*=3;
  dmg=Math.round(dmg*(1+0.2*dIdx));
  st.hp-=dmg; st.leaks++;
  fx.streak=0; fx.leakFlash=0.4; shakeGame(2.5); SFX.hurt();
  particles.burst(e.pos.x,e.pos.y,'#ff5b7a',12,5);
  toast(`💔 漏怪！-${dmg}❤️${e.def.boss?' (Boss!)':''}`,true);
  if(st.hp<=0){ st.hp=0; gameOver(false); }
}
function update(dt){
  if(st.over||st.state==='OVER'||st.state==='MENU'||st.state==='WORLD'||st.state==='SHOP'||
     st.state==='CODEX'||st.state==='SETTINGS'||st.state==='BOOT'||st.state==='UPGRADE') return;
  now+=dt;
  if(fx.shake>0) fx.shake-=dt;
  if(fx.leakFlash>0) fx.leakFlash-=dt;
  enemies.update(dt,now);
  for(const t of TowerSystemInst.list){ t.update(dt,enemies.list,projectiles,now); }
  projectiles.update(dt,enemies.list,now);
  particles.update(dt);
  hazards.update(dt,enemies.list,now);
  floaters.update(dt);
  director.update(dt,now);
  for(const e of enemies.list){
    if(!e.alive){
      if(e.reachedBase){ onEnemyBase(e); } else { onEnemyKilled(e); }
    }
  }
  enemies.prune();
  director.alive=enemies.list.length;
  if(st.state==='WAVE' && director.isClear()){
    st.waveCleared=st.wave;
    director.clearEvent();
    if(st.wave>=CHAPTER_WAVES){ gameOver(true); return; }
    st._lastInterest=0;
    SFX.win();
    showDraft();
  }
  if(st.state==='BUILD'||st.state==='WAVE') updateHud();
}
function gameOver(win){
  st.over=true; st.state='OVER';
  meta.stats.runs++;
  if(st.wave>meta.stats.bestWave) meta.stats.bestWave=st.wave;
  meta.stats.totalKills+=st.kills; meta.stats.bossesKilled+=st.bosses;
  if(win) meta.stats.wins++;
  const prevBest=meta.stats.chapterBest[st.chapter]||0;
  if(st.wave>prevBest) meta.stats.chapterBest[st.chapter]=st.wave;
  let firstClear=false, unlockedNext=false, nextName='';
  if(win && st.wave>=CHAPTER_WAVES){
    if(meta.stats.chaptersCleared.indexOf(st.chapter)<0){ meta.stats.chaptersCleared.push(st.chapter); firstClear=true; }
    const ci=CHAPTER_ORDER.indexOf(st.chapter);
    if(ci<CHAPTER_ORDER.length-1){
      const next=CHAPTERS[CHAPTER_ORDER[ci+1]];
      if(!meta.unlocks[next.unlock] || !meta.unlocks['tower_'+next.tower]){
        meta.unlocks[next.unlock]=true; meta.unlocks['tower_'+next.tower]=true;
        unlockedNext=true; nextName=`${next.icon} ${next.name}`;
      }
    }
  }
  let sd=Math.floor(st.wave*3+st.bosses*10+Math.max(0,st.hp)*2);
  if(firstClear) sd+=80;
  sd=Math.max(5,Math.round(sd*diffMult()));
  meta.stardust+=sd; meta.lifetimeStardust+=sd;
  saveSave();
  hideAllOverlays();
  showOver(win, sd, unlockedNext, nextName);
  if(win) SFX.win(); else SFX.over();
}
function resetSave(){
  meta=freshMeta(); saveSave();
}

// ============================================================
// 主循环
// ============================================================
let last=0, acc=0, renderDt=0.016;
function frame(ts){
  if(!last) last=ts;
  let dt=ts-last; last=ts;
  if(!st.paused){
    acc+=dt*st.speed; acc=Math.min(acc,FIXED*5);
    while(acc>=FIXED){ update(FIXED/1000); acc-=FIXED; }
  }
  renderDt=dt/1000||0.016;
  render();
  requestAnimationFrame(frame);
}

// ============================================================
// 引导跳转
// ============================================================
window._startRun=function(){ hideAllOverlays(); newRun(st.chapter, st.diff, Math.random()*1e9|0); };
window._retry=function(){ hideAllOverlays(); newRun(st.chapter, st.diff, Math.random()*1e9|0); };
window._toWorld=function(){ hideAllOverlays(); showWorld(); };
window._backMenu=function(){ hideAllOverlays(); showMenu(); };
window._shop=function(){ showShop(); };

// ============================================================
// 调试 / 测试钩子
// ============================================================
window.GAME={get st(){return st}, get meta(){return meta}, TOWERS, ENEMIES, DIFFS, MAPS, CHAPTERS, ELEMENTS, ARTIFACTS, UPGRADE_POOL, EVENTS, ELITE_AFFIXES,
  ELEMENT_ORDER, WEAK, FIXED, TOWER_MAX_LV, START, CHAPTER_WAVES, CHAPTER_ENEMIES,
  get towerCostBonus(){ return towerCostBonus; },
  get towerUnlocked(){ return towerUnlocked; },
  get diffMult(){ return diffMult; }};
window.DEBUG={
  addCoins(n){ st.coins+=n; hudBuild(); },
  spawn(id){ const hpS=(1+0.30*(st.wave-1))*director.chapterScale(), spS=1+0.02*(st.wave-1); enemies.spawn(id,path.wps,hpS,spS); },
  clearWave(){ director.queue=[]; director.spawning=false; },
  godMode(on){ window._god=on; },
  setWave(n){ st.wave=n; },
  setDiff(d){ st.diff=d; },
  unlockAll(){ for(const k in meta.unlocks) meta.unlocks[k]=true; meta.stats.chaptersCleared=[...CHAPTER_ORDER]; saveSave(); },
  resetSave(){ resetSave(); },
  dumpSave(){ console.log(meta); },
  endWave(){ director.queue=[]; director.spawning=false; enemies.list.forEach(e=>{e.alive=false; e.reachedBase=false;}); },
};
window.__test={
  run(chapter,diff,seed){ newRun(chapter||'ch1', diff||'normal', seed||12345); },
  get state(){ return st.state; },
  get over(){ return st.over; },
  get towers(){ return TowerSystemInst.list; },
  get enemies(){ return enemies.list; },
  get now(){ return now; },
  get waveNum(){ return st.wave; },
  get event(){ return st.event; },
  get hp(){ return st.hp; },
  get coins(){ return st.coins; },
  get kills(){ return st.kills; },
  get upgrades(){ return st.upgrades; },
  addTower(id,c,r){ const t=TowerSystemInst.add(TOWERS[id],c,r,path); if(t){ st.coins-=TOWERS[id].cost; } return !!t; },
  placeTower(id,c,r){ // 与真实建造逻辑一致(含折扣/免费券)
    const def=TOWERS[id]; const cost=Math.round(def.cost*towerCostBonus);
    if(!path || !path.canBuild(c,r)) return false;
    if(!(Eco.canAfford(cost)||st.freePlace>0)) return false;
    TowerSystemInst.add(def,c,r,path);
    if(st.freePlace>0) st.freePlace--; else Eco.spend(cost);
    return true;
  },
  sellTower(t){ Eco.refund(t); TowerSystemInst.remove(t); path.grid[t.row][t.col].tower=null; if(st.selected===t) st.selected=null; },
  upgradeTower(t){ if(t.level<TOWER_MAX_LV){ const c=t.upgradeCost(); if(st.coins>=c){ st.coins-=c; t.spent+=c; t.levelUp(); return true; } } return false; },
  wave(){ startWave(); },
  update(dt){ update(dt); },
  frame(){ update(FIXED/1000); },
  ovUpgrade(){ return $('ov-upgrade').classList.contains('show'); },
  ovArtifact(){ return $('ov-artifact').classList.contains('show'); },
  ovOver(){ return $('ov-over').classList.contains('show'); },
  draftPicks(){ const cards=[...document.querySelectorAll('#upgrade-panel .pick[onclick]')];
    return cards.map(c=>{ const m=c.getAttribute('onclick').match(/'([^']+)'/); return m?m[1]:null; }); },
  draftInfo(){ const cards=[...document.querySelectorAll('#upgrade-panel .pick[onclick]')];
    return cards.map(c=>{ const m=c.getAttribute('onclick').match(/'([^']+)'/); return m?findUpgrade(m[1]):null; }).filter(Boolean); },
  pickUpgrade(i){ const cards=[...document.querySelectorAll('#upgrade-panel .pick[onclick]')];
    if(cards[i]) cards[i].click(); return !!cards[i]; },
  skipUpgrade(){ window._skipUpgrade(); },
  artifactPicks(){ const cards=[...document.querySelectorAll('#artifact-panel .pick[onclick]')];
    return cards.map(c=>{ const m=c.getAttribute('onclick').match(/'([^']+)'/); return m?m[1]:null; }); },
  artifactInfo(){ const cards=[...document.querySelectorAll('#artifact-panel .pick[onclick]')];
    return cards.map(c=>{ const m=c.getAttribute('onclick').match(/'([^']+)'/); return m?ARTIFACTS.find(a=>a.id===m[1]):null; }).filter(Boolean); },
  pickArtifact(i){ const cards=[...document.querySelectorAll('#artifact-panel .pick[onclick]')];
    if(cards[i]) cards[i].click(); return !!cards[i]; },
  buildTiles(){ return path?path.buildTiles():[]; },
  maxLevel(){ return TOWER_MAX_LV; },
  bossHp(){ const b=enemies.list.find(e=>e.alive&&e.def.boss); return b?b.hp/b.maxHp:null; },
  towerCount(){ return TowerSystemInst.list.length; },
  hazardCount(){ return hazards.list.length; },
  codex(){ return meta.codex; },
  unlockAll(){ window.DEBUG.unlockAll(); },
  rollEvent(w){ return director.rollEvent(w); },
  winChapter(){ gameOver(true); },
  loseChapter(){ gameOver(false); },
};

// ============================================================
// 启动
// ============================================================
loadSave();
st.speed=meta.settings.speed||1;
showMenu();
hudBuild();
last=0; requestAnimationFrame(frame);
console.log('%c✦ 星尘守卫 v3 已启动 ✦','color:#ffd66b;font-size:14px');
console.log('调试: window.DEBUG.addCoins(1000) / __test.run() 等');
