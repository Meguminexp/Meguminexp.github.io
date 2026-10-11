// ============================================================
// [03] UI — 顶部信息条 / HUD / 全部弹层 / 图鉴 / 教程
// ============================================================
"use strict";

const $=id=>document.getElementById(id);
function hideAllOverlays(){
  ['ov-menu','ov-artifact','ov-upgrade','ov-over','ov-shop','ov-codex','ov-settings','ov-help'].forEach(id=>{
    const el=$(id); if(el) el.classList.remove('show'); });
}
function toast(msg, warn){
  const t=$('toast'); t.textContent=msg;
  t.classList.toggle('warn',!!warn);
  t.classList.add('show');
  clearTimeout(t._tm); t._tm=setTimeout(()=>t.classList.remove('show'),1700);
}

// ============================================================
// HUD
// ============================================================
function hudBuild(){
  const tb=$('topbar'), hud=$('hud');
  buildTopbar(tb);
  // ---------- HUD ----------
  const inGame = st.state==='BUILD'||st.state==='WAVE'||st.state==='UPGRADE';
  let s='';
  s+=`<div class="hrow">
    <div class="stat">❤️ <b id="hud-hp">${st.hp}</b><small style="color:var(--inkdim)">/${st.maxHp}</small></div>
    <div class="stat">🪙 <b id="hud-coins">${fmt(st.coins)}</b></div>
    <div class="stat">👾 <b id="hud-kills">${st.kills}</b></div>
    <div class="stat">🔥 <b id="hud-streak" style="color:${fx.streak>=5?'#ff8fa3':'var(--inkdim)'}">${fx.streak}</b></div>
    <div class="spacer"></div>
    <div class="kbd-hint"><span>1-5</span>选塔 <span>Space</span>开波 <span>P</span>暂停 <span>Esc</span>取消 <span>右键</span>出售</div>
    <button class="tbtn go" id="btn-wave" ${st.state==='WAVE'?'disabled style="opacity:.55"':''}>${st.state==='WAVE'?'⚔️ 战斗中…':'▶ 开始波次'}</button>
    <button class="tbtn" id="btn-speed">⏩ x${st.speed}</button>
    <button class="tbtn" id="btn-pause">${st.paused?'▶':'⏸'}</button>
    <button class="tbtn" title="图鉴" id="btn-codex">📖</button>
    <button class="tbtn" title="设置" id="btn-settings">⚙️</button>
    <button class="tbtn" title="世界地图" id="btn-world">🗺️</button>
  </div>`;
  if(inGame && !st.selected){
    // ---------- 建造栏 ----------
    s+=`<div class="hrow">`;
    const unlockedIds=ELEMENT_ORDER.filter(towerUnlocked);
    unlockedIds.forEach((id,i)=>{
      const def=TOWERS[id]; const cost=Math.round(def.cost*towerCostBonus);
      const afford=Eco.canAfford(cost)||st.freePlace>0;
      s+=`<button class="tcard ${st.armed===id?'armed':''} ${!afford?'poor':''}" data-tower="${id}"
        style="border-color:${ELEMENTS[def.element].color}" title="${def.desc}">
        <span class="hotkey">${i+1}</span>
        <span class="tic">${def.icon}</span>
        <span class="tn">${def.name}</span>
        <span class="tc">${st.freePlace>0?'🎫免费':cost+'🪙'}</span>
      </button>`;
    });
    const lockedIds=ELEMENT_ORDER.filter(id=>!towerUnlocked(id));
    if(lockedIds.length){
      s+=`<button class="tcard locked" data-locked="1" title="通关上一章 或 星尘商店解锁新元素塔">
        <span class="tic">🔒</span><span class="tn">${lockedIds.length} 座新塔</span><span class="tc">商店解锁</span>
      </button>`;
    }
    s+=`<div class="spacer"></div>
      <div class="stat" style="font-size:11.5px;color:var(--inkdim)">下一波 ${st.wave+1}/${CHAPTER_WAVES}${st.event?` · <span style="color:${st.event.color}">${st.event.icon}${st.event.name}</span>`:''}</div>
    </div>`;
  }
  if(st.selected){
    s+=towerPanel(st.selected);
  }
  hud.innerHTML=s;
  // ---------- 事件绑定 ----------
  const bw=$('btn-wave'); if(bw) bw.onclick=()=>startWave();
  const bs=$('btn-speed'); if(bs) bs.onclick=()=>{ cycleSpeed(); };
  const bp=$('btn-pause'); if(bp) bp.onclick=()=>togglePause();
  const bc=$('btn-codex'); if(bc) bc.onclick=()=>showCodex('element');
  const bst=$('btn-settings'); if(bst) bst.onclick=()=>showSettings();
  const bwd=$('btn-world'); if(bwd) bwd.onclick=()=>{ if(st.state==='WAVE'){ toast('战斗中不能退出',true); return; } showWorld(); };
  hud.querySelectorAll('.tcard[data-tower]').forEach(c=>{
    c.onclick=()=>{ const id=c.dataset.tower;
      if(!towerUnlocked(id)){ toast('通关上一章 或 星尘商店解锁',true); return; }
      st.armed=st.armed===id?null:id; st.selected=null; hudBuild(); }; });
  const lockEl=hud.querySelector('.tcard[data-locked]');
  if(lockEl) lockEl.onclick=()=>{ toast('通关上一章 或 星尘商店解锁新元素塔'); };
  // 选中塔: 升级 / 出售
  const up=$('btn-up');
  if(up) up.onclick=()=>{
    const t=st.selected; if(!t) return;
    const c=t.upgradeCost();
    if(st.coins<c){ toast('金币不够啦',true); return; }
    Eco.spend(c); t.spent+=c; t.levelUp(); SFX.level();
    particles.burst(t.pos.x,t.pos.y,'#ffd66b',10,4);
    hudBuild();
  };
  const sell=$('btn-sell');
  if(sell) sell.onclick=()=>{
    const t=st.selected; if(!t) return;
    Eco.refund(t); TowerSystemInst.remove(t); path.grid[t.row][t.col].tower=null;
    st.selected=null; SFX.sell(); hudBuild();
  };
}
function buildTopbar(tb){
  if(st.state==='MENU'||st.state==='WORLD'||st.state==='SHOP'){ tb.innerHTML=''; return; }
  const ch=CHAPTERS[st.chapter];
  const ev=st.event;
  let s=`<div class="tb-item tb-chapter">${ch.icon} ${ch.name}</div>
    <div class="tb-item">🌊 第 <b>${st.wave}</b> / ${CHAPTER_WAVES} 波</div>`;
  if(ev) s+=`<div class="tb-item tb-event" title="${ev.desc||''}">${ev.icon} ${ev.name}</div>`;
  s+=`<div class="tb-progress" title="波次进度"><i id="tb-prog"></i></div>`;
  if(st.state==='BUILD' && st.wave<CHAPTER_WAVES){
    const prev=director.preview(st.wave+1);
    s+=`<div class="tb-prev" title="下一波敌人">${prev.map(id=>`<span style="filter:${ENEMIES[id].boss?'drop-shadow(0 0 4px #ff8fa3)':''}">${ENEMIES[id].name==='小装甲蟹'?'🦀':enemyIcon(id)}</span>`).join('')}</div>`;
  }
  tb.innerHTML=s;
}
function enemyIcon(id){
  const icons={slime:'🟢',imp:'🐰',brute:'🐻',thorn:'🌵',ember:'🔥',bubble:'🫧',spark:'⚡',
    flower:'🌸',bat:'🦇',crab:'🦀',crab2:'🦀',priest:'✨',bomb:'💣',tank:'🛡️',shadow:'👻',
    boss1:'👑',boss2:'👹',boss3:'👸',boss4:'⚡',boss5:'🌳'};
  return icons[id]||'👾';
}
function cycleSpeed(){
  const speeds=[1,2,3];
  const idx=speeds.indexOf(st.speed);
  st.speed=speeds[(idx+1)%speeds.length];
  meta.settings.speed=st.speed; saveSave();
  hudBuild();
}
function togglePause(){ st.paused=!st.paused; hudBuild(); }
function towerPanel(t){
  const nextDmg=Math.round(t.dmg*(t.level===1?1.5:1.35));
  const nextRange=Math.round(t.range*(t.level===1?1.10:1.08)*10)/10;
  const nextRate=Math.max(0.12, t.fireRate*(t.level===1?0.90:0.92));
  const upCost=t.upgradeCost();
  const canUp=t.level<TOWER_MAX_LV && Eco.canAfford(upCost);
  const el=ELEMENTS[t.element];
  let s=`<div class="tpanel" style="border-color:${el.color}">
    <div class="tp-main">
      <div class="tp-name">${t.def.icon} ${t.def.name} Lv${t.level} <small>${el.name}系 · ${t.def.role||''}</small></div>
      <div class="tp-stats">
        <span>伤害 <b>${Math.round(t.dmg)}</b></span>
        <span>射程 <b>${t.range.toFixed(1)}</b></span>
        <span>攻速 <b>${t.fireRate.toFixed(2)}s</b></span>
        <span>暴击 <b>${Math.round(t.critChance*100)}%</b></span>
        <span>期望DPS <b style="color:var(--gold)">${Math.round(t.dps())}</b></span>
        <span>击杀 <b>${t.kills}</b></span>
      </div>
    </div>
    ${t.level<TOWER_MAX_LV?`<div class="tp-up">
        <span>下一级预览</span>
        <span>伤害 <b>${nextDmg}</b>(+${nextDmg-Math.round(t.dmg)})</span>
        <span>射程 <b>${nextRange}</b> · 攻速 <b>${nextRate.toFixed(2)}s</b></span>
      </div>`:`<div class="tp-up"><span style="color:var(--gold)">✨ 已满级</span><span>攻速已加成</span></div>`}
    <div class="tp-actions">
      ${t.level<TOWER_MAX_LV?`<button class="tbtn ${canUp?'':'locked'}" id="btn-up">⬆️ 升级 ${upCost}🪙</button>`
        :`<button class="tbtn locked">已满级</button>`}
      <button class="tbtn danger" id="btn-sell">🗑️ 出售 +${Math.round(t.spent*SELL_REFUND*DIFFS[st.diff].refund)}🪙</button>
    </div>
  </div>`;
  return s;
}
function updateHud(){
  const hp=$('hud-hp'),co=$('hud-coins'),ki=$('hud-kills'),stk=$('hud-streak');
  if(hp)hp.textContent=st.hp; if(co)co.textContent=fmt(st.coins); if(ki)ki.textContent=st.kills;
  if(stk){ stk.textContent=fx.streak; stk.style.color=fx.streak>=5?'#ff8fa3':'var(--inkdim)'; }
  const pw=$('tb-prog');
  if(pw){ const p=director.progress()*100; pw.style.width=p.toFixed(1)+'%'; }
}
function hudStats(){ updateHud(); }

// ============================================================
// 主菜单 / 世界地图
// ============================================================
function showMenu(){
  st.state='MENU';
  const p=$('menu-panel');
  p.innerHTML=`
    <h2>✦ 星尘守卫 ✦</h2>
    <div class="sub">爱心小角落 · 元素肉鸽塔防<br>5 大元素流派 · 章节推进 · 每波三选一 · 随机事件</div>
    <div class="row">
      <div class="stat" style="padding:6px 12px">💫 星尘 <b style="color:#ffd66b">${fmt(meta.stardust)}</b></div>
      <div class="stat" style="padding:6px 12px">🏆 已通章节 <b style="color:#ffd66b">${meta.stats.chaptersCleared.length}/${CHAPTER_ORDER.length}</b></div>
      <div class="stat" style="padding:6px 12px">🕹️ 局数 <b style="color:#ffd66b">${meta.stats.runs}</b></div>
      <div class="stat" style="padding:6px 12px">🔥 最佳波次 <b style="color:#ffd66b">${meta.stats.bestWave}</b></div>
    </div>
    <div class="row">
      <button class="btn" onclick="window._toWorld()">🗺️ 进入世界地图</button>
      <button class="btn ghost" onclick="window._shop()">✦ 星尘商店</button>
      <button class="btn ghost" onclick="window._codexOpen()">📖 图鉴</button>
      <button class="btn ghost" onclick="window._settingsOpen()">⚙️ 设置</button>
    </div>
    <div class="sub" style="margin-top:10px;font-size:11px">每章 10 波 · 第 5/10 波 Boss · 通关解锁下一章与元素塔 · 开局遗物三选一</div>`;
  $('ov-menu').classList.add('show');
}
function showWorld(){
  st.state='WORLD';
  const p=$('menu-panel');
  const firstOpen=CHAPTER_ORDER.find(c=>chapterUnlocked(c))||'ch1';
  if(!st.chapter || !chapterUnlocked(st.chapter)) st.chapter=firstOpen;
  const cards=CHAPTER_ORDER.map((cid,idx)=>{
    const c=CHAPTERS[cid], unlocked=chapterUnlocked(cid);
    const cleared=meta.stats.chaptersCleared.indexOf(cid)>=0;
    const cur=cid===st.chapter;
    const tower=TOWERS[c.tower];
    const best=meta.stats.chapterBest[cid]||0;
    const status=cleared?'✔ 已通关':(cur?'▶ 当前':(unlocked?'可挑战':'🔒'));
    return `<div class="worldcard ${cleared?'wclear':''} ${cur?'wcur':''} ${!unlocked?'wlock':''}" data-cid="${cid}">
      <div class="wicon" style="border-color:${ELEMENTS[c.theme].color}">${c.icon}</div>
      <div class="wname">${idx+1}. ${c.name}</div>
      <div class="wtheme">${tower.icon}${tower.name} · ${c.terrain}</div>
      <div class="wstatus">${status}${best?` · 最佳${best}波`:''}</div>
    </div>`;
  }).join('');
  const diffBtns=Object.entries(DIFFS).map(([id,d])=>{
    const unlocked=diffUnlocked(id);
    return `<button class="tbtn ${unlocked?'':'locked'} ${st.diff===id?'go':''}" data-diff="${id}">${d.name}${unlocked?'':' 🔒'}</button>`;
  }).join('');
  p.innerHTML=`
    <h2>✦ 世界地图 ✦</h2>
    <div class="sub">选择章节 · 💫 ${fmt(meta.stardust)} · 已通 ${meta.stats.chaptersCleared.length}/${CHAPTER_ORDER.length} · 难度决定敌人强度与星尘倍率</div>
    <div class="row" style="flex-wrap:nowrap;overflow-x:auto;padding:6px 0">${cards}</div>
    <div class="sub" style="margin:8px 0 2px">选择难度</div>
    <div class="row">${diffBtns}</div>
    <div class="row">
      <button class="btn" onclick="window._startRun()">进入章节 ❤️ ${CHAPTERS[st.chapter].icon} ${CHAPTERS[st.chapter].name}</button>
      <button class="btn ghost" onclick="window._shop()">星尘商店</button>
      <button class="btn ghost" onclick="window._backMenu()">返回</button>
    </div>
    <div class="sub" style="margin-top:8px;font-size:11px">每章 10 波 · 泥泞/岩浆/冰面/雷石/毒沼地形 · 开局遗物三选一</div>`;
  p.querySelectorAll('.worldcard').forEach(card=>{ card.onclick=()=>{ const cid=card.dataset.cid;
    if(!chapterUnlocked(cid)){ const prev=CHAPTER_ORDER[CHAPTER_ORDER.indexOf(cid)-1];
      toast(`通关「${CHAPTERS[prev].name}」解锁下一章`,true); return; }
    st.chapter=cid; showWorld(); }; });
  p.querySelectorAll('[data-diff]').forEach(b=>{ b.onclick=()=>{ const id=b.dataset.diff;
    if(!diffUnlocked(id)){ toast('在星尘商店解锁该难度',true); return; }
    st.diff=id; showWorld(); }; });
  $('ov-menu').classList.add('show');
}

// ============================================================
// 开局遗物三选一
// ============================================================
function showArtifact(){
  st.state='BOOT';
  const pool=ARTIFACTS.slice();
  const picks=[];
  const shuffled=pool.sort(()=>Math.random()-0.5);
  for(let i=0;i<3 && shuffled.length;i++) picks.push(shuffled[i]);
  const p=$('artifact-panel');
  p.innerHTML=`
    <h2>✨ 选择开局遗物</h2>
    <div class="sub">遗物决定本局流派走向 · 三选一</div>
    <div class="row">
      ${picks.map(a=>`<div class="pick rarity-rare" style="border-color:${a.color}" onclick="window._pickArtifact('${a.id}')">
        <div class="phead" style="background:${a.color}"></div>
        <div class="pbody">
          <span class="prarity" style="background:${a.color}">遗物</span>
          <span class="picon">${a.icon}</span>
          <div class="pname">${a.name}</div>
          <div class="pdesc">${a.desc}</div>
        </div>
      </div>`).join('')}
    </div>`;
  $('ov-artifact').classList.add('show');
}
window._pickArtifact=function(id){
  const a=ARTIFACTS.find(x=>x.id===id); if(!a) return;
  a.apply();
  if(st.scrollTower) placeRandomTowers(2);
  SFX.artifact(); toast(`${a.icon} 获得遗物：${a.name}`);
  $('ov-artifact').classList.remove('show');
  st.state='BUILD'; hudBuild();
  if(!meta.unlocks.tutorialSeen){ meta.unlocks.tutorialSeen=true; saveSave(); showHelp(); }
};

// ============================================================
// 三选一升级
// ============================================================
function upgradeEligible(){
  const theme=CHAPTERS[st.chapter].theme;
  const pool=[...UPGRADE_POOL, ...(ELEMENT_UPGRADES[theme]||[])];
  return pool.filter(u=>{ const n=st.upgrades[u.id]||0; return n<u.max; });
}
function upgradeWeight(u){
  let w=RARITY[u.rarity]||1;
  const theme=CHAPTERS[st.chapter].theme;
  if(ELEMENT_UPGRADES[theme] && ELEMENT_UPGRADES[theme].some(x=>x.id===u.id)) w*=3;
  return w;
}
function showDraft(){
  st.state='UPGRADE';
  const bonus=Math.round((START.waveBonusBase+st.wave*START.waveBonusPer)*waveBonusMult);
  Eco.earn(bonus);
  if(interestOn){ const it=Math.min(150, Math.round(st.coins*0.06)); Eco.earn(it); st._lastInterest=it; }
  if(st.piggy){ const it=Math.min(100, Math.round(st.coins*0.05)); Eco.earn(it); st._lastInterest=(st._lastInterest||0)+it; }
  if(startGrantOn) Eco.earn(15);
  st.coins=Math.round(st.coins);
  const pool=upgradeEligible();
  const picks=[]; const seen=new Set();
  const count=st.scholar?4:3;
  for(let i=0;i<count && pool.length;i++){
    let total=0; for(const u of pool){ if(seen.has(u.id))continue; total+=upgradeWeight(u); }
    if(total===0) break;
    let r=Math.random()*total;
    for(const u of pool){ if(seen.has(u.id))continue; r-=upgradeWeight(u);
      if(r<=0){ picks.push(u); seen.add(u.id); break; } }
  }
  const p=$('upgrade-panel');
  let parts=[`<h2>第 ${st.wave} 波胜利！</h2>`];
  const extras=[];
  if(bonus>0) extras.push(`波次奖励 +${bonus}🪙`);
  if(st._lastInterest) extras.push(`利息 +${st._lastInterest}🪙`);
  if(startGrantOn) extras.push(`开局小礼 +15🪙`);
  parts.push(`<div class="sub">${extras.join(' · ')||'选择一项强化'}</div>`);
  parts.push(`<div class="row">`);
  for(const u of picks){
    const el=u.el?ELEMENTS[u.el]:null;
    const ac=el?el.color:RARITY_COLOR[u.rarity];
    const tag=u.danger?'危险':(el?el.name:RARITY_LABEL[u.rarity]);
    const cnt=st.upgrades[u.id]||0;
    parts.push(`<div class="pick ${u.danger?'danger':'rarity-'+u.rarity}" onclick="window._pickUpgrade('${u.id}')">
      <div class="phead" style="background:${ac}"></div>
      <div class="pbody">
        <span class="prarity" style="background:${ac}">${tag}</span>
        <span class="ptype">${u.tag||'全局'}</span>
        <span class="picon">${u.icon}</span>
        <div class="pname">${u.name}</div>
        <div class="pdesc">${u.desc}</div>
        ${cnt?`<div class="pcount">已选 ${cnt}</div>`:''}
      </div>
    </div>`);
  }
  if(picks.length<count){
    parts.push(`<div class="pick dim">
      <div class="phead" style="background:#4a3d8c"></div>
      <div class="pbody"><span class="picon">😴</span><div class="pname" style="margin-top:8px">已全部选过</div></div>
    </div>`);
  }
  parts.push(`</div><button class="btn ghost" onclick="window._skipUpgrade()">跳过（+15🪙）</button>`);
  p.innerHTML=parts.join('');
  $('ov-upgrade').classList.add('show');
}
function findUpgrade(id){
  return UPGRADE_POOL.find(x=>x.id===id)
    ||Object.values(ELEMENT_UPGRADES).reduce((a,l)=>a.concat(l),[]).find(x=>x.id===id);
}
window._pickUpgrade=function(id){
  const u=findUpgrade(id); if(!u) return;
  u.apply(); st.upgrades[id]=(st.upgrades[id]||0)+1; SFX.pick();
  $('ov-upgrade').classList.remove('show');
  st.state='BUILD'; hudBuild();
};
window._skipUpgrade=function(){ Eco.earn(15); $('ov-upgrade').classList.remove('show'); st.state='BUILD'; hudBuild(); };

// ============================================================
// 结算
// ============================================================
function showOver(win, sd, unlockedNext, nextName){
  st.state='OVER';
  const p=$('over-panel');
  p.innerHTML=`<h2>${win?'🎉 章节守护成功！':'💔 回忆被偷走了…'}</h2>
    <div class="sub">${win?`你们守住了「${CHAPTERS[st.chapter].name}」的全部回忆`:'没关系，下一局一定守得住'}</div>
    ${unlockedNext?`<div class="sub" style="color:#ffd66b;font-weight:700;font-size:15px">✨ 新章节解锁：${nextName} 与它的元素塔！</div>`:''}
    <div class="row" style="gap:8px">
      <div class="stat" style="padding:6px 10px">🌊 到达波次 <b style="color:#ffd66b">${st.wave}</b></div>
      <div class="stat" style="padding:6px 10px">👾 击杀 <b style="color:#ffd66b">${st.kills}</b></div>
      <div class="stat" style="padding:6px 10px">⭐ 魔王 <b style="color:#ffd66b">${st.bosses}</b></div>
      <div class="stat" style="padding:6px 10px">❤️ 剩余 <b style="color:#ffd66b">${Math.max(0,st.hp)}</b></div>
      <div class="stat" style="padding:6px 10px">💫 星尘 <b style="color:#ffd66b">+${sd}</b></div>
    </div>
    <div class="row">
      <button class="btn" onclick="window._retry()">再打一局 ❤️</button>
      <button class="btn ghost" onclick="window._toWorld()">世界地图</button>
      <button class="btn ghost" onclick="window._shop()">星尘商店</button>
    </div>`;
  $('ov-over').classList.add('show');
}

// ============================================================
// 星尘商店
// ============================================================
function showShop(){
  st._shopFrom = st.state==='WORLD'?'WORLD':(st.state==='BUILD'?'BUILD':'MENU');
  st.state='SHOP';
  const p=$('shop-panel');
  let parts=[`<h2>✦ 星尘商店 ✦</h2>
    <div class="sub">💫 星尘：<b style="color:#ffd66b">${fmt(meta.stardust)}</b>（终身 ${fmt(meta.lifetimeStardust)}）· 每局胜利约 60-150 星尘</div>`];
  for(const g of SHOP_GROUPS){
    const items=SHOP.filter(it=>it.type===g.type);
    if(!items.length) continue;
    parts.push(`<div class="shopgroup">${g.title}</div><div class="row">`);
    for(const it of items){
      const owned=meta.unlocks[it.id];
      const afford=meta.stardust>=it.price;
      const bc=shopBorder(it);
      parts.push(`<div class="shopcard ${owned?'owned':''} ${!owned&&!afford?'poor':''}"
        onclick="window._buyShop('${it.id}')" ${bc?`style="border-color:${bc}"`:''}>
        <div class="sicon">${it.icon}</div>
        <div class="sname">${it.name}</div>
        <div class="sdesc">${it.desc}</div>
        <div class="sprice">${owned?'✔ 已拥有':'💫 '+it.price}</div>
      </div>`);
    }
    parts.push(`</div>`);
  }
  parts.push(`<div class="row">
    <button class="btn" onclick="window._shopBack()">返回</button>
    <button class="btn ghost" onclick="window._shopReset()">重置存档</button>
  </div>`);
  p.innerHTML=parts.join('');
  $('ov-shop').classList.add('show');
}
window._buyShop=function(id){
  const it=SHOP.find(x=>x.id===id); if(!it) return;
  if(meta.unlocks[id]){ toast('已经拥有啦'); return; }
  if(meta.stardust<it.price){ toast('星尘不够，再去打几局吧',true); return; }
  meta.stardust-=it.price; meta.unlocks[id]=true; saveSave(); SFX.pick(); showShop();
};
window._shopBack=function(){
  $('ov-shop').classList.remove('show');
  if(st.over) showMenu();
  else if(st._shopFrom==='WORLD') showWorld();
  else if(st._shopFrom==='BUILD'){ st.state='BUILD'; hudBuild(); }
  else showMenu();
};
window._shopReset=function(){ if(confirm('确定重置所有星尘存档？此操作不可恢复！')){ resetSave(); showShop(); } };

// ============================================================
// 图鉴
// ============================================================
const REACTIONS=[
  {icon:'⚔️', name:'元素克制', desc:'攻击元素 = 敌人弱点时伤害 ×1.5（弱点猎手/猎杀印记可提升）'},
  {icon:'💥', name:'燃爆（火+木）', desc:'被灼烧的敌人受到毒伤害 ×2'},
  {icon:'⚡', name:'破甲（冰+雷）', desc:'冻结目标被雷击 → 易伤 ×1.3 持续 2s 并解除冻结'},
  {icon:'💨', name:'蒸发（冰+火）', desc:'冻结目标被火击 → 伤害 ×1.5 并解除冻结'},
  {icon:'🔗', name:'导电（雷+水）', desc:'雷击水元素敌人 → 连锁数 +1'},
];
const CODEX_TABS=[['element','元素'],['tower','塔'],['enemy','敌人'],['event','事件'],['react','反应'],['affix','词缀']];
function showCodex(tab){
  if(st.state!=='CODEX') st._prevState=st.state;   // 仅首次打开记录来源(标签切换不覆盖)
  st.state='CODEX';
  const p=$('codex-panel');
  let parts=[`<h2>📖 星尘图鉴</h2>
    <div class="codex-tabs">${CODEX_TABS.map(([t,label])=>`<button class="ctab ${t===tab?'on':''}" data-tab="${t}">${label}</button>`).join('')}</div>`];
  parts.push(`<div class="codex-grid">`);
  if(tab==='element'){
    for(const eid of ELEMENT_ORDER){ const e=ELEMENTS[eid];
      parts.push(`<div class="cx-entry"><div class="cxi" style="color:${e.color}">${eid==='star'?'⭐':eid==='fire'?'🔥':eid==='ice'?'❄️':eid==='thunder'?'⚡':'🌿'}</div>
        <div class="cxn">${e.name}元素</div><div class="cxd">克制弱点：${WEAK[eid]?ELEMENTS[WEAK[eid]].name+'系敌人':'无'}</div></div>`);
    }
    parts.push(`<div class="cx-entry"><div class="cxi" style="color:#aab2c8">🛡️</div><div class="cxn">铁/水/暗</div><div class="cxd">铁弱雷 · 水弱雷 · 暗无弱点</div></div>`);
  }
  else if(tab==='tower'){
    for(const id of ELEMENT_ORDER){ const t=TOWERS[id]; const el=ELEMENTS[t.element];
      parts.push(`<div class="cx-entry"><div class="cxi">${t.icon}</div><div class="cxn">${t.name}</div>
        <div class="cxd">${t.desc}</div><div class="cxw">造价 ${t.cost} · ${el.name}系</div></div>`);
    }
  }
  else if(tab==='enemy'){
    const all=[...Object.keys(ENEMIES)];
    const known=meta.codex.enemies;
    for(const id of all){ const e=ENEMIES[id]; const seen=known.indexOf(id)>=0;
      parts.push(`<div class="cx-entry ${seen?'':'locked'}"><div class="cxi">${seen?enemyIcon(id):'❓'}</div>
        <div class="cxn">${seen?e.name:'？？？'}</div>
        <div class="cxd">${seen?`HP ${e.hp} · 速度 ${e.speed} · 赏金 ${e.bounty}${e.armor?' · 护甲'+e.armor:''}${e.weak?' · 弱'+ELEMENTS[e.weak].name:' · 无弱点'}`:'首次遭遇后解锁图鉴'}</div></div>`);
    }
  }
  else if(tab==='event'){
    for(const ev of EVENTS){ const seen=meta.codex.events.indexOf(ev.id)>=0;
      parts.push(`<div class="cx-entry ${seen?'':'locked'}"><div class="cxi">${seen?ev.icon:'❓'}</div>
        <div class="cxn">${seen?ev.name:'？？？'}</div><div class="cxd">${seen?ev.desc:'首次触发后解锁'}</div></div>`);
    }
  }
  else if(tab==='react'){
    for(const r of REACTIONS){
      parts.push(`<div class="cx-entry"><div class="cxi">${r.icon}</div><div class="cxn">${r.name}</div><div class="cxd">${r.desc}</div></div>`);
    }
  }
  else if(tab==='affix'){
    for(const af of ELITE_AFFIXES){
      parts.push(`<div class="cx-entry"><div class="cxi">${af.icon}</div><div class="cxn">${af.name}</div><div class="cxd">${af.desc}</div></div>`);
    }
  }
  parts.push(`</div><div class="cx-legend">💡 提示：敌人图鉴首次遭遇自动解锁；克制颜色可在战场上敌人右上角看到。反应伤害受「元素共鸣」升级加成。</div>`);
  parts.push(`<div class="row"><button class="btn" onclick="window._codexBack()">返回</button></div>`);
  p.innerHTML=parts.join('');
  p.querySelectorAll('.ctab').forEach(b=>{ b.onclick=()=>showCodex(b.dataset.tab); });
  $('ov-codex').classList.add('show');
}
window._codexOpen=function(){ hideAllOverlays(); showCodex('element'); };
window._codexBack=function(){
  $('ov-codex').classList.remove('show');
  if(st.over) showMenu();
  else if(st._shopFrom==='WORLD'||st._prevState==='WORLD') showWorld();
  else if(st._prevState==='BUILD'){ st.state='BUILD'; hudBuild(); }
  else showMenu();
};

// ============================================================
// 设置
// ============================================================
function showSettings(){
  st._prevState=st.state;
  st.state='SETTINGS';
  const p=$('settings-panel');
  const seg=(vals,cur,fn,labels)=>vals.map((v,i)=>{
    return `<button class="seg ${v===cur?'on':''}" data-val="${i}">${labels?labels[i]:v}</button>`; }).join('');
  p.innerHTML=`
    <h2>⚙️ 设置</h2>
    <div class="setrow"><span class="sl">🔊 音效</span><span class="sr" id="set-sound">
      ${seg([true,false], meta.settings.soundOn, null, ['开','关'])}</span></div>
    <div class="setrow"><span class="sl">⏩ 默认速度</span><span class="sr" id="set-speed">
      ${seg([1,2,3], st.speed||1, null)}</span></div>
    <div class="setrow"><span class="sl">🔢 伤害数字</span><span class="sr" id="set-dmg">
      ${seg([true,false], meta.settings.dmgNumbers!==false, null, ['开','关'])}</span></div>
    <div class="setrow"><span class="sl">🎓 教程</span><span class="sr"><button class="seg" id="set-tut">重新查看</button></span></div>
    <div class="row">
      <button class="btn" onclick="window._settingsBack()">返回</button>
      <button class="btn ghost" onclick="window._shopReset()">重置存档</button>
    </div>
    <div class="sub" style="margin-top:10px;font-size:11px">星尘守卫 v3 · 存档自动保存</div>`;
  $('set-sound').querySelectorAll('.seg').forEach(b=>{ b.onclick=()=>{
    meta.settings.soundOn = b.dataset.val==='0'; saveSave(); showSettings(); }; });
  $('set-speed').querySelectorAll('.seg').forEach(b=>{ b.onclick=()=>{
    st.speed=[1,2,3][+b.dataset.val]; meta.settings.speed=st.speed; saveSave(); showSettings(); }; });
  $('set-dmg').querySelectorAll('.seg').forEach(b=>{ b.onclick=()=>{
    meta.settings.dmgNumbers = b.dataset.val==='0'; saveSave(); showSettings(); }; });
  $('set-tut').onclick=()=>{ showHelp(); };
  $('ov-settings').classList.add('show');
}
window._settingsOpen=function(){ hideAllOverlays(); showSettings(); };
window._settingsBack=function(){
  $('ov-settings').classList.remove('show');
  if(st.over) showMenu();
  else if(st._prevState==='WORLD') showWorld();
  else if(st._prevState==='BUILD'){ st.state='BUILD'; hudBuild(); }
  else showMenu();
};

// ============================================================
// 教程 / 帮助
// ============================================================
const TUT_STEPS=[
  ['🏗️ 建造', '用底部建造栏或数字键 <b>1-5</b> 选中元素塔，点击草地放置。不同元素塔是不同流派：星=暴击、火=点燃、冰=冻结、雷=连锁、木=毒雾。'],
  ['⬆️ 升级与出售', '点击已放置的塔打开面板：升级（伤害×1.5/射程/攻速）或出售（右键快捷出售）。升级费用会逐级上涨。'],
  ['⚔️ 开战', '按 <b>空格</b> 开始波次。敌人沿路径走向爱心基地，漏怪会扣❤️。战斗中也可继续建塔应急！'],
  ['🎲 三选一', '每波清空后从 3 张强化牌中选 1 张（可跳过+15🪙）。本章主题元素牌出现权重×3，尽量围绕一个流派构筑。'],
  ['⚔️ 元素克制', '敌人右上角色块 = 弱点：火克木、冰克火、雷克水、木克雷，命中弱点伤害 ×1.5。反应：火+木=燃爆、冰+雷=破甲、冰+火=蒸发、雷+水=导电。'],
];
function showHelp(){
  const p=$('help-panel');
  p.innerHTML=`<h2>🎓 新手教程</h2>
    ${TUT_STEPS.map((s,i)=>`<div class="tut-step"><b>${s[0]}</b><br>${s[1]}</div>`).join('')}
    <div class="row"><button class="btn" onclick="window._helpClose()">我知道了</button></div>`;
  $('ov-help').classList.add('show');
}
window._helpClose=function(){
  $('ov-help').classList.remove('show');
  if(st.state==='SETTINGS'){ /* stay in settings */ }
};
