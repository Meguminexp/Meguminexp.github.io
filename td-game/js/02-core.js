// ============================================================
// [02] CORE — 状态 / 路径 / 敌人 / 塔 / 投射物 / 区域 / 波次导演
// ============================================================
"use strict";

// ---------------- 存档 (v3, 自动迁移 v1/v2) ----------------
const SAVE_KEY='stardust_td_save_v3';
const DEFAULT_UNLOCKS={
  chapter_2:false,chapter_3:false,chapter_4:false,chapter_5:false,
  tower_fire:false,tower_ice:false,tower_thunder:false,tower_nature:false,
  diff_hard:false,diff_nightmare:false,diff_abyss:false,
  start_plus_hp:false,start_plus_coins:false,start_random_tower:false,
  tutorialSeen:false,
};
let meta={version:3, stardust:0, lifetimeStardust:0, unlocks:{...DEFAULT_UNLOCKS},
  codex:{enemies:[],towers:[],events:[]},
  stats:{runs:0,wins:0,bestWave:0,totalKills:0,bossesKilled:0,chaptersCleared:[],chapterBest:{}},
  settings:{soundOn:true,speed:1}};
function freshMeta(){ return {version:3, stardust:0, lifetimeStardust:0, unlocks:{...DEFAULT_UNLOCKS},
  codex:{enemies:[],towers:[],events:[]},
  stats:{runs:0,wins:0,bestWave:0,totalKills:0,bossesKilled:0,chaptersCleared:[],chapterBest:{}},
  settings:{soundOn:true,speed:1}}; }
function loadSave(){
  try{
    const s=localStorage.getItem(SAVE_KEY);
    if(s){ const d=JSON.parse(s); mergeSave(d); return; }
    // 尝试迁移 v2 / v1
    for(const key of ['stardust_td_save_v2','stardust_td_save_v1']){
      const old=localStorage.getItem(key);
      if(old){ const d=JSON.parse(old); mergeSave(d); localStorage.removeItem(key); break; }
    }
  }catch(e){}
}
function mergeSave(d){
  meta=freshMeta();
  if(d.stardust!=null) meta.stardust=d.stardust;
  if(d.lifetimeStardust!=null) meta.lifetimeStardust=d.lifetimeStardust;
  if(d.stats){
    meta.stats.runs=d.stats.runs||0; meta.stats.wins=d.stats.wins||0;
    meta.stats.bestWave=d.stats.bestWave||0; meta.stats.totalKills=d.stats.totalKills||0;
    meta.stats.bossesKilled=d.stats.bossesKilled||0;
    meta.stats.chaptersCleared=(d.stats.chaptersCleared||[]).slice();
    meta.stats.chapterBest=d.stats.chapterBest?{...d.stats.chapterBest}:{};
  }
  if(d.settings){ meta.settings.soundOn=d.settings.soundOn!==false; meta.settings.speed=d.settings.speed||1; }
  if(d.unlocks){ for(const k in DEFAULT_UNLOCKS){ if(d.unlocks[k]) meta.unlocks[k]=true; } }
  if(d.codex){ meta.codex={enemies:(d.codex.enemies||[]).slice(), towers:(d.codex.towers||[]).slice(), events:(d.codex.events||[]).slice()}; }
}
function saveSave(){ try{ localStorage.setItem(SAVE_KEY, JSON.stringify(meta)); }catch(e){} }
function towerUnlocked(id){ return id==='star' || meta.unlocks['tower_'+id]; }
function chapterUnlocked(cid){ return !CHAPTERS[cid].unlock || meta.unlocks[CHAPTERS[cid].unlock]; }
function diffUnlocked(did){ return !DIFFS[did].unlock || meta.unlocks[DIFFS[did].unlock]; }

// ---------------- 本局状态 ----------------
const st = {
  state:'MENU',        // MENU|WORLD|BOOT|BUILD|WAVE|UPGRADE|OVER|SHOP|CODEX|SETTINGS
  chapter:'ch1', mapId:'map_1', diff:'normal', seed:0,
  hp:20, maxHp:20, coins:100, wave:0,
  kills:0, bosses:0, waveCleared:0, leaks:0,
  towers:[], enemies:[], projectiles:[], particles:[], hazards:[], floaters:[],
  event:null,
  upgrades:{},
  freePlace:0, armed:null, selected:null,
  paused:false, speed:1, over:false,
  grid:null, path:null, time:0,
  piggy:0, scrollTower:0, scholar:0,
  _shopFrom:null,
};
// 本局肉鸽加成
let towerDmgBonus=1, towerRateBonus=1, towerRangeBonus=1, towerCostBonus=1;
let bountyBonus=1, waveBonusMult=1, upgradeCostBonus=1, weakBonus=0, reactBonus=1;
let interestOn=0, lifestealOn=0, startGrantOn=0, fireSplashOn=0, natureTangleOn=0, naturePoolOn=0;
let fireEmberOn=0, iceHeartOn=0, splatterOn=0;
let luckyCrit=0, hourglassRate=1, hourglassRange=1;
function resetRunBonuses(){
  towerDmgBonus=1; towerRateBonus=1; towerRangeBonus=1; towerCostBonus=1;
  bountyBonus=1; waveBonusMult=1; upgradeCostBonus=1; weakBonus=0; reactBonus=1;
  interestOn=0; lifestealOn=0; startGrantOn=0; fireSplashOn=0; natureTangleOn=0; naturePoolOn=0;
  fireEmberOn=0; iceHeartOn=0; splatterOn=0;
  luckyCrit=0; hourglassRate=1; hourglassRange=1;
}
function diffMult(){ return DIFFS[st.diff].mult; }
function incomeMult(){ return DIFFS[st.diff].income; }
function hpMult(){ return DIFFS[st.diff].hpMult; }
function weaknessMult(){ return 1.5+weakBonus; }   // 克制倍率（弱点猎手/猎杀印记提升）
function reactionMult(){ return reactBonus; }

// ---------------- 路径 ----------------
class MapPath{
  constructor(mapId){ this.mapId=mapId; this.grid=parseMap(MAPS[mapId]);
    this.wps=MAPS[mapId].waypoints.map(wp=>new Vec(wp[0]*TILE+TILE/2, wp[1]*TILE+TILE/2)); }
  tileAt(c,r){ if(r<0||r>=ROWS||c<0||c>=COLS) return null; return (this.grid[r]&&this.grid[r][c])?this.grid[r][c]:null; }
  tileAtP(x,y){ const c=Math.floor(x/TILE), r=Math.floor(y/TILE); return this.tileAt(c,r); }
  canBuild(c,r){ const t=this.tileAt(c,r); return t && t.type==='build' && !t.tower; }
  canBuildP(x,y){ const c=Math.floor(x/TILE), r=Math.floor(y/TILE); return this.canBuild(c,r); }
  distAlong(col,row){
    let best=0; for(let i=0;i<this.wps.length-1;i++){ const a=this.wps[i],b=this.wps[i+1];
      const p={x:col*TILE+TILE/2,y:row*TILE+TILE/2};
      const t=clamp(((p.x-a.x)*(b.x-a.x)+(p.y-a.y)*(b.y-a.y))/((b.x-a.x)**2+(b.y-a.y)**2||1),0,1);
      const proj={x:a.x+(b.x-a.x)*t, y:a.y+(b.y-a.y)*t};
      const d=dist(p,proj); if(d<TILE*0.6){ best=i+1-t; break; } }
    return best;
  }
  buildTiles(){ const out=[]; for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){ const t=this.grid[r][c];
    if(t.type==='build' && !t.tower) out.push({c,r,along:this.distAlong(c,r)}); } return out; }
}
function Vec(x,y){ this.x=x; this.y=y; }

// ---------------- 敌人 ----------------
class Enemy{
  constructor(def,wpSeq,hpScale,speedScale){
    this.id=uid(); this.def=def; this.hp=def.hp*hpScale*hpMult(); this.maxHp=this.hp;
    this.bounty=def.bounty; this.wpIdx=0; this.slowFactor=1; this.slowUntil=0;
    this.pos={x:wpSeq[0].x,y:wpSeq[0].y};
    this.wpSeq=wpSeq; this.speed=def.speed*speedScale*DIFFS[st.diff].spd; this.alive=true; this.reachedBase=false;
    this.burnUntil=0; this.burnDps=0; this.frozenUntil=0; this.poisonUntil=0; this.poisonDps=0;
    this.onPath=false;
    this.skillCd=def.skillCd||0;
    this.modifier=null;
    this.shield=0; this.shieldCd=6;
    this.vulnerableUntil=0;
    this.phaseCd=0;
    this.healCd=def.healCd||0;
    this.enraged=false;
    this.hitFlash=0;
  }
  update(dt,now){
    if(now<this.burnUntil && this.alive) this.takeDamage(this.burnDps*dt, null, true);
    if(now<this.poisonUntil && this.alive) this.takeDamage(this.poisonDps*dt, null, true);
    if(this.modifier==='shield'){ this.shieldCd-=dt;
      if(this.shieldCd<=0){ this.shieldCd=6; if(this.shield<30) this.shield+=30; } }
    // 治疗祭司
    if(this.def.healer && this.alive){ this.healCd-=dt;
      if(this.healCd<=0){ this.healCd=this.def.healCd;
        for(const o of enemies.list){ if(!o.alive||o===this)continue;
          if(dist(this.pos,o.pos)<=this.def.healR*TILE){
            o.hp=Math.min(o.maxHp, o.hp+o.maxHp*this.def.healPct);
            particles.burst(o.pos.x,o.pos.y-8,'#ffe9a8',5,2); } } } }
    // Boss 专属技能
    if(this.def.boss && this.alive){ this.skillCd-=dt;
      if(this.skillCd<=0){ this.skillCd=this.def.skillCd||8; bossSkill(this,now); } }
    if(now<this.frozenUntil) return;
    // 暗影穿梭
    if(this.def.phasing){ this.phaseCd-=dt;
      if(this.phaseCd<=0){ this.phaseCd=3;
        for(let k=0;k<2;k++){ const nwp=this.wpSeq[this.wpIdx+1];
          if(nwp){ this.pos.x=nwp.x; this.pos.y=nwp.y; this.wpIdx++; } }
        particles.burst(this.pos.x,this.pos.y,'#8b7bd0',8,4); } }
    let sp=this.speed*(now<this.slowUntil?this.slowFactor:1);
    if(this.modifier==='haste'){ for(const o of enemies.list){ if(!o.alive||o===this)continue;
      if(dist(this.pos,o.pos)<=TILE*2) o.auraBoost=0.8; } }
    if(this.modifier==='rage' && this.hp<this.maxHp*0.5) sp*=1.4;   // 狂暴
    const tile=this.path?this.path.tileAtP(this.pos.x,this.pos.y):null;
    if(tile){
      if(tile.slow) sp*=0.55;
      if(tile.ice) sp*=1.15;
      if(tile.magma && this.def.element!=='fire' && this.alive) this.takeDamage(2*dt, null, true);
    }
    if(this.auraBoost){ sp*=1.25; this.auraBoost=null; }
    if(st.event){
      if(st.event.id==='blizzard') sp*=0.7;
      if(st.event.id==='acid_rain' && this.alive) this.takeDamage(3*dt, null, true);
      if(st.event.id==='gold_rain') sp*=1.15;
    }
    const wp=this.wpSeq[this.wpIdx+1]; if(!wp){ this.alive=false; this.reachedBase=true; return; }
    const dx=wp.x-this.pos.x, dy=wp.y-this.pos.y, d=Math.hypot(dx,dy);
    const step=sp*TILE*dt;
    if(step>=d){ this.pos.x=wp.x; this.pos.y=wp.y; this.wpIdx++; }
    else{ this.pos.x+=dx/d*step; this.pos.y+=dy/d*step; }
    this.onPath=true;
  }
  applySlow(f,dur,now){ this.slowFactor=f; this.slowUntil=now+dur; }
  applyBurn(dps,dur,now){ this.burnDps=Math.min(30, this.burnDps+dps); this.burnUntil=Math.max(this.burnUntil,now+dur); }
  applyPoison(dps,dur,now){ this.poisonDps=Math.max(this.poisonDps,dps); this.poisonUntil=Math.max(this.poisonUntil,now+dur); }
  applyFreeze(dur,now){ this.frozenUntil=Math.max(this.frozenUntil,now+dur); }
  applyVulnerable(dur,now){ this.vulnerableUntil=Math.max(this.vulnerableUntil,now+dur); }
  takeDamage(dmg, attackerElement, noFloat, forceCrit, src){
    let mult=1;
    if(attackerElement && this.def.weak===attackerElement) mult*=weaknessMult();
    if(now<this.vulnerableUntil) mult*=1.3*reactionMult();
    const raw=dmg*mult-(this.def.armor||0);
    let final=Math.max(noFloat?0:1, raw);
    if(this.shield>0){ const abs=Math.min(this.shield,final); this.shield-=abs; final-=abs; if(final<=0) return; }
    this.hp-=final;
    if(this.modifier==='lifesteal' && final>0) this.hp=Math.min(this.maxHp, this.hp+final*0.15);
    // 荆棘词缀: 反弹卡壳攻击者
    if(this.modifier==='thorn' && src && !noFloat && Math.random()<0.25){
      src.frozenUntil=Math.max(src.frozenUntil||0, now+0.5);
      particles.burst(this.pos.x,this.pos.y,'#7fd86b',4,3);
    }
    if(!noFloat && meta.settings.dmgNumbers!==false && floaters){
      floaters.add(this.pos.x, this.pos.y-10, Math.round(final), forceCrit||mult>1);
    }
    this.hitFlash=0.1;
    if(this.hp<=0 && this.alive){
      if(src && src.kills!=null) src.kills++;
      this.alive=false; this.reachedBase=false;
    }
  }
}
class EnemySystem{
  constructor(){ this.list=[]; }
  spawn(id,wpSeq,hpScale,speedScale){
    const e=new Enemy(ENEMIES[id],wpSeq,hpScale,speedScale);
    e.def={...e.def,id}; e.path=path; this.list.push(e);
    if(meta.codex && meta.codex.enemies.indexOf(id)<0){ meta.codex.enemies.push(id); }
    return e;
  }
  update(dt,now){ for(const e of this.list){ if(!e.alive) continue; e.update(dt,now); } }
  prune(){ this.list=this.list.filter(e=>e.alive); }
  anyBoss(){ return this.list.some(e=>e.alive&&e.def.boss); }
}

// ---------------- 塔 ----------------
class Tower{
  constructor(def,col,row,path){
    this.id=uid(); this.def=def; this.col=col; this.row=row; this.level=1;
    this.pos={x:col*TILE+TILE/2, y:row*TILE+TILE/2};
    this.path=path; this.cooldown=0; this.kills=0;
    this.range=def.range; this.dmg=def.dmg; this.fireRate=def.rate;
    this.element=def.element||'star';
    this.critChance=def.critChance||0; this.critMult=def.critMult||1.5;
    this.spent=def.cost;
    this.frozenUntil=0;
    this.dmg*=towerDmgBonus; this.fireRate*=towerRateBonus; this.range*=towerRangeBonus;
    this.critChance+=(luckyCrit||0);
    this.fireRate*=hourglassRate||1; this.range*=hourglassRange||1;
  }
  upgradeCost(){ return Math.round(this.def.cost*TOWER_LEVEL_COST*this.level*upgradeCostBonus); }
  levelUp(){
    this.level++;
    this.dmg*= this.level===2?1.5:1.35;
    this.range*= this.level===2?1.10:1.08;
    this.fireRate=Math.max(0.12, this.fireRate*(this.level===2?0.90:0.92));
    if(this.level>=TOWER_MAX_LV) this.fireRate=Math.max(0.12,this.fireRate*0.92); // 满级攻速加成
  }
  dps(){ // 期望 DPS（含暴击）
    return this.dmg*(1+this.critChance*(this.critMult-1))/Math.max(0.12,this.fireRate);
  }
  acquire(enemies){
    let best=null, bestScore=-1e9;
    for(const e of enemies){ if(!e.alive) continue;
      const d=dist(this.pos,e.pos); if(d<=this.range*TILE){
        const along=this.path.distAlong(Math.floor(e.pos.x/TILE),Math.floor(e.pos.y/TILE));
        const score=along+(e.def.pri||0);
        if(score>bestScore){ bestScore=score; best=e; } } }
    return best;
  }
  update(dt,enemies,PS,now){
    if(now<this.frozenUntil) return;
    this.cooldown-=dt; const t=this.acquire(enemies);
    this.target=t;
    if(t && this.cooldown<=0){ this.cooldown=this.fireRate; PS.fire(this,t); SFX.shoot(); }
  }
}
class TowerSystem{
  constructor(){ this.list=[]; }
  add(def,col,row,path){
    if(!path.canBuild(col,row)) return null;
    const t=new Tower(def,col,row,path);
    t.defKey=Object.keys(TOWERS).find(k=>TOWERS[k]===def);
    this.list.push(t); path.grid[row][col].tower=t;
    if(meta.codex && meta.codex.towers.indexOf(t.defKey)<0) meta.codex.towers.push(t.defKey);
    return t;
  }
  remove(t){ this.list=this.list.filter(x=>x!==t); }
}

// ---------------- 投射物 ----------------
class Projectile{
  constructor(tower,def,target,PS){
    this.id=uid(); this.pos={x:tower.pos.x,y:tower.pos.y};
    this.tower=tower; this.def=def; this.target=target;
    this.speed=def.projSpeed; this.damage=tower.dmg; this.hit=false;
    this.element=tower.element;
    this.chainLeft=def.chain||0; this.chainRange=(def.chainRange||1.5)*TILE;
  }
  update(dt,enemies,now){
    if(!this.target || !this.target.alive){
      let best=null,bd=1e9; for(const e of enemies){ if(!e.alive)continue; const d=dist(this.pos,e.pos); if(d<bd){bd=d;best=e;} }
      this.target=best; if(!this.target){ this.hit=true; return; } }
    const t=this.target; const dx=t.pos.x-this.pos.x, dy=t.pos.y-this.pos.y, d=Math.hypot(dx,dy);
    if(d<8){ this.explode(enemies,now); return; }
    const step=this.speed*TILE*dt; this.vx=(dx/d)*step; this.vy=(dy/d)*step;
    this.pos.x+=this.vx; this.pos.y+=this.vy;
  }
  explode(enemies,now){
    const def=this.def, t=this.target, el=this.element;
    if(t && t.alive && (def.dodge||0)>0 && Math.random()<def.dodge){
      particles.burst(t.pos.x,t.pos.y,'#fff3a8',6,3); this.hit=true; return; }
    const src=this.tower;
    if(def.kind==='slow'){                       // ❄️ 冰塔·冻结碎裂流
      if(t && t.alive){
        const wasFrozen=now<t.frozenUntil;
        t.takeDamage(this.damage, el, false, false, src);
        t.applySlow(def.slowFactor, def.slowDur, now);
        const tt=this.tower.path.tileAtP(t.pos.x,t.pos.y);
        let fr=def.freezeChance||0;
        if(tt && tt.ice) fr*=2;
        if(st.event && st.event.id==='blizzard') fr+=0.15;
        const willFreeze=Math.random()<fr;
        if(wasFrozen || willFreeze){
          const sr=(def.shatterR||1.2)*TILE, sd=this.damage*(def.shatterDmg||0.9);
          for(const o of enemies){ if(!o.alive)continue;
            if(dist(t.pos,o.pos)<=sr){ o.takeDamage(sd, el, false, false, src); o.applyVulnerable(2, now); if(iceHeartOn) o.applyFreeze(1, now); } }
          particles.burst(t.pos.x,t.pos.y,'#e8faff',12,5);
          t.frozenUntil=0;
        } else if(willFreeze){
          t.applyFreeze(def.freezeDur||0.9, now); particles.burst(t.pos.x,t.pos.y,'#e8faff',8,3);
        }
      }
    }
    else if(def.kind==='burn'){                  // 🌋 火塔·点燃蔓延流
      if(t && t.alive){
        let dmg=this.damage;
        if(st.event && st.event.id==='magma_burst') dmg*=1.2;
        if(now<t.frozenUntil){                    // 蒸发反应: 冰+火
          dmg*=1.5*reactionMult();
          t.frozenUntil=0;
          particles.burst(t.pos.x,t.pos.y,'#e8faff',10,4);
          reactionBanner('💨 蒸发！','#a8e8f5'); SFX.react();
        }
        if(fireEmberOn && now<t.burnUntil) dmg*=1.15;      // 余烬: 已灼烧再受火伤+15%
        t.takeDamage(dmg, el, false, false, src);
        const dps=(def.burnDps||5)*(st.event&&st.event.id==='magma_burst'?1.5:1);
        t.applyBurn(dps, def.burnDur||2, now);
        if(fireSplashOn){ for(const o of enemies){ if(!o.alive||o===t)continue;
          if(dist(this.pos,o.pos)<=TILE*1.2) o.applyBurn(dps*0.5, def.burnDur||2, now); } }
        particles.burst(t.pos.x,t.pos.y-6,'#ffd166',4,2);
      }
    }
    else if(def.kind==='poison'){                // 🌿 木塔·剧毒纠缠流
      if(t && t.alive){
        const zr=(def.zoneR||1.2)*TILE*(st.event&&st.event.id==='acid_rain'?1.5:1);
        const tt=this.tower.path.tileAtP(t.pos.x,t.pos.y);
        const zr2=(tt && tt.poison)?zr*1.5:zr;
        hazards.add(this.pos.x, this.pos.y, zr2, def.poisonDps||5, def.poisonDur||2.5, '#7fd86b', 'poison', def.tangleFactor||0.7);
        let dmg=this.damage;
        if(now<t.poisonUntil && def.poisonRage) dmg*=1+def.poisonRage;   // 毒素狂暴
        t.takeDamage(dmg, el, false, false, src);
        particles.burst(t.pos.x,t.pos.y,'#c8f2a8',4,2);
      }
    }
    else if(def.kind==='chain'){                 // ⚡ 雷塔·电弧过载流
      let cur=t, left=this.chainLeft;
      while(cur && cur.alive && left>=0){
        const tt=this.tower.path.tileAtP(cur.pos.x,cur.pos.y);
        let mul=(tt && tt.stone)?1.2:1;
        if(st.event && st.event.id==='thunderstorm') mul*=1.2;
        if(now<cur.frozenUntil){                  // 破甲反应: 冰+雷
          cur.applyVulnerable(2,now); cur.frozenUntil=0;
          particles.burst(cur.pos.x,cur.pos.y,'#fff3a8',6,3); reactionBanner('⚡ 破甲！','#fff3a8'); SFX.react();
        }
        cur.takeDamage(this.damage*mul, el, false, false, src);
        hazards.add(cur.pos.x, cur.pos.y, (def.surgeR||1.2)*TILE, def.surgeDps||4, def.surgeDur||1.6, '#fff3a8', 'surge');
        if(cur.def.element==='water') left++;      // 导电反应: 雷+水 → 连锁+1
        if(left<=0) break;
        let nxt=null, nd=this.chainRange;
        for(const e of enemies){ if(!e.alive||e===cur) continue;
          const d=dist(cur.pos,e.pos); if(d<nd){ nd=d; nxt=e; } }
        if(!nxt) break;
        cur=nxt; left--;
        particles.burst(cur.pos.x,cur.pos.y,'#fff3a8',5,3);
      }
      if((def.overload||0)>0 && Math.random()<def.overload){
        const alive=enemies.filter(e=>e.alive);
        const bolts=def.overloadBolts||3;
        for(let i=0;i<bolts && alive.length;i++){ const o=alive[(Math.random()*alive.length)|0];
          o.takeDamage(this.damage*0.8, el, false, false, src); particles.burst(o.pos.x,o.pos.y,'#fff3a8',6,4); }
        toast('⚡ 过载！电弧全屏爆发'); shakeGame(3);
      }
    }
    else {                                       // ⭐ 星塔·精准爆击流（通用暴击）
      if(t && t.alive){
        const crit=this.tower.critChance>0 && Math.random()<this.tower.critChance;
        const dmg=crit?this.damage*this.tower.critMult:this.damage;
        t.takeDamage(dmg, el, false, crit, src);
        if(crit){ particles.burst(t.pos.x,t.pos.y-8,'#ffe9a8',12,6); SFX.crit(); }
      }
    }
    this.hit=true;
  }
}
class ProjectileSystem{
  constructor(){ this.list=[]; }
  fire(tower,target){ const p=new Projectile(tower,tower.def,target,this); this.list.push(p); }
  update(dt,enemies,now){ for(const p of this.list){ if(p.hit)continue; p.update(dt,enemies,now); }
    this.list=this.list.filter(p=>!p.hit); }
}

// ---------------- Boss 专属技能 ----------------
function bossSkill(b,now){
  const id=b.def.id, hpS=director.chapterScale();
  const spawn=(eid,n)=>{ for(let i=0;i<n;i++){ enemies.spawn(eid,path.wps,hpS,1); } };
  if(id==='boss1'){ spawn('slime',2); SFX.level(); }
  else if(id==='boss2'){ spawn('ember',3); particles.burst(b.pos.x,b.pos.y,'#ff6b3d',10,4); }
  else if(id==='boss3'){
    for(const t of TowerSystemInst.list) t.frozenUntil=now+1.5;
    particles.burst(b.pos.x,b.pos.y,'#e8faff',14,5); toast('❄️ 冰晶女王冻结了你的塔！'); shakeGame(4);
  }
  else if(id==='boss4'){
    const list=TowerSystemInst.list;
    for(let i=0;i<Math.min(2,list.length);i++){ const t=list[(Math.random()*list.length)|0];
      t.frozenUntil=now+1.2; particles.burst(t.pos.x,t.pos.y,'#fff3a8',8,4); }
    toast('⚡ 雷暴主宰雷击了你的塔！'); shakeGame(3);
  }
  else if(id==='boss5'){ spawn('thorn',2); particles.burst(b.pos.x,b.pos.y,'#c8f2a8',10,4); }
}

// ---------------- 区域(Hazard) ----------------
class HazardSystem{
  constructor(){ this.list=[]; }
  add(x,y,radius,dps,dur,color,type,tangle){ this.list.push({x,y,radius,dps,dur,life:0,color,type:type||'poison',tangle:tangle||0}); }
  update(dt,enemies,now){
    for(const h of this.list){ h.life+=dt;
      for(const e of enemies){ if(!e.alive)continue;
        if(dist(h,e.pos)<=h.radius){
          if(h.type==='surge'){
            e.takeDamage(h.dps*dt, 'thunder', true);
          } else {
            let mult=1;
            if(now<e.burnUntil) mult=2*reactionMult();       // 燃爆反应: 火+木
            e.takeDamage(h.dps*mult*dt, 'nature', true);
            e.applyPoison(h.dps*0.5,1.2,now);
            const tang=natureTangleOn?Math.max(0.35,h.tangle*0.6):h.tangle;
            if(tang>0) e.applySlow(tang,0.8,now);
          }
        } } }
    this.list=this.list.filter(h=>h.life<h.dur);
  }
}

// ---------------- 粒子 / 飘字 ----------------
class ParticleSystem{
  constructor(){ this.list=[]; }
  burst(x,y,color,n,speed){ for(let i=0;i<n;i++){ const a=Math.random()*Math.PI*2, v=0.5+Math.random()*speed;
    this.list.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,life:0.3+Math.random()*0.3,max:0.6,color,size:2}); } }
  update(dt){ for(const p of this.list){ p.x+=p.vx*TILE*dt; p.y+=p.vy*TILE*dt; p.life+=dt; }
    this.list=this.list.filter(p=>p.life<p.max); }
}
class FloaterSystem{
  constructor(){ this.list=[]; }
  add(x,y,val,crit){ if(this.list.length>48) return;
    this.list.push({x:x+(Math.random()-0.5)*10, y, val, crit, life:0, max:0.7}); }
  update(dt){ for(const f of this.list){ f.y-=30*dt; f.life+=dt; }
    this.list=this.list.filter(f=>f.life<f.max); }
}

// ---------------- 经济 ----------------
const Eco = {
  canAfford(cost){ return st.coins>=cost; },
  spend(n){ st.coins-=n; },
  earn(n){ st.coins+=n; },
  refund(t){ st.coins+=Math.round(t.spent*SELL_REFUND*DIFFS[st.diff].refund); },
};

// ---------------- 波次导演 ----------------
class WaveDirector{
  constructor(){ this.queue=[]; this.alive=0; this.spawning=false; this.spawnTimer=0; this.lastBolt=0; this.totalSpawn=0; }
  chapterDef(){ return CHAPTER_ENEMIES[st.chapter]||CHAPTER_ENEMIES.ch1; }
  chapterScale(){ const ci=CHAPTER_ORDER.indexOf(st.chapter); return 1+Math.max(0,ci)*0.16; }
  compose(w){
    const q=[]; const countS=1+0.20*(w-1); const cd=this.chapterDef();
    const group=(id,cnt,intv,dly,elite)=>{ cnt=Math.max(0,Math.round(cnt*countS)); if(cnt>0) q.push({id,count:cnt,interval:intv,delay:dly,elite:!!elite}); };
    if(w<=3){
      group(cd.base[0], 5+Math.round(w*1.5), 0.9, 0);
      if(w>=2) group('imp', Math.round(w*1.2), 0.7, 2);
      if(w===3) group('brute', 1, 2.5, 5);
    } else if(w<=7){
      group(cd.base[0], Math.round(4+w*1.2), 0.9, 0);
      group('imp', Math.round(w*0.8), 0.7, 2);
      group(cd.themed[0]||'slime', Math.round((w-2)*1.5), 0.8, 2.5);
      if(cd.themed[1]) group(cd.themed[1], Math.round((w-3)*1.2), 0.7, 4);
      if(w>=6) group('brute', Math.round((w-5)*0.8), 2.5, 6);
      if(w>=7) group('priest', 1, 1, 5.5);
    } else {
      group(cd.base[0], Math.round(2+w*0.7), 0.9, 0);
      group('imp', Math.round(w*0.5), 0.7, 2);
      group(cd.themed[0]||'slime', Math.round((w-2)*1.0), 0.8, 3);
      if(cd.themed[1]) group(cd.themed[1], Math.round((w-4)*0.9), 0.7, 4.5);
      group('brute', Math.round((w-7)*0.5), 2.5, 6);
      const elites=Array.isArray(cd.elite)?cd.elite:[cd.elite];
      elites.forEach((eid,i)=> group(eid, Math.max(1,Math.round((w-7)*0.8)), 2.2, 7+i*3, true));
      const isCh1 = st.chapter==='ch1';
      if(!isCh1){  // 特殊怪在 ch2+ 全面登场; ch1 是教学章, 仅保留治疗祭司(第9波起)
        if(w>=8) group('flower', Math.max(1,Math.round((w-7)*0.7)), 1.2, 6);
        if(w>=8) group('bat', Math.max(1,Math.round((w-8)*0.8)), 1.0, 7.5);
        if(w>=9) group('bomb', 1, 1.5, 8);
        if(w>=8) group('priest', Math.max(1,Math.round((w-8)*0.6)), 1.5, 9);
      } else {
        if(w>=9) group('priest', 1, 1.5, 9);
      }
    }
    if(BOSS_WAVES.indexOf(w)>=0){
      q.push({id:cd.boss, count:1, interval:1, delay:0});
      if(w===10){ q.push({id:cd.themed[0]||'slime', count:2, interval:0.9, delay:3, escort:true});
        q.push({id:'imp', count:1, interval:0.8, delay:3.5, escort:true}); }
    }
    return q;
  }
  preview(w){ // 下一波敌人图标(去重)
    const q=this.compose(w); const seen=new Set(), out=[];
    for(const g of q){ if(!seen.has(g.id)){ seen.add(g.id); out.push(g.id); } }
    return out;
  }
  rollEvent(w){
    if(w<=1 || Math.random()>0.20) return null;
    const theme=CHAPTERS[st.chapter].theme;
    let total=0; for(const ev of EVENTS) total += ev.theme===theme?2:1;
    let r=Math.random()*total;
    for(const ev of EVENTS){ r -= ev.theme===theme?2:1; if(r<=0) return {id:ev.id,name:ev.name,icon:ev.icon,color:ev.color,desc:ev.desc}; }
    return null;
  }
  start(w){
    this.queue=this.compose(w); this.spawning=true; this.spawnTimer=0; this.lastBolt=0;
    this.totalSpawn=this.queue.reduce((a,g)=>a+g.count,0);
    st.event=this.rollEvent(w);
    if(st.event){
      const ev=st.event;
      if(meta.codex && meta.codex.events.indexOf(ev.id)<0) meta.codex.events.push(ev.id);
      if(ev.id==='double_wave'){ this.queue.forEach(g=>g.count=Math.round(g.count*1.7)); this.totalSpawn=this.queue.reduce((a,g)=>a+g.count,0); }
      if(ev.id==='gold_rain'){ Eco.earn(40); }
      if(ev.id==='dark_pact'){ st.maxHp=Math.max(1,st.maxHp-2); st.hp=Math.min(st.hp,st.maxHp); }
      if(ev.id==='regrowth'){ st.hp=Math.min(st.maxHp,st.hp+3); }
    }
  }
  clearEvent(){ st.event=null; }
  progress(){ // 0..1 本波推进度
    if(!this.spawning && this.queue.length===0) return this.alive>0?0.5:1;
    const left=this.queue.reduce((a,g)=>a+g.count,0);
    const done=this.totalSpawn-left;
    return clamp((done + (this.alive>0?0.15:0))/Math.max(1,this.totalSpawn),0,1);
  }
  update(dt,now){
    if(!this.spawning) return;
    if(st.event && st.event.id==='thunderstorm'){
      if(now-this.lastBolt>1.2){ this.lastBolt=now;
        const alive=enemies.list.filter(e=>e.alive);
        if(alive.length){ const t=alive[(Math.random()*alive.length)|0];
          if(t.def.element!=='thunder'){ t.takeDamage(15,'thunder'); particles.burst(t.pos.x,t.pos.y,'#fff3a8',8,4); } } }
    }
    this.spawnTimer-=dt;
    if(this.spawnTimer<=0 && this.queue.length){
      const g=this.queue[0];
      if(g.delay>0){ g.delay-=dt; return; }
      let hpS=(1+0.30*(st.wave-1))*this.chapterScale();
      if(st.event && st.event.id==='regrowth') hpS*=1.1;
      const dIdx=Math.max(0,Object.keys(DIFFS).indexOf(st.diff));   // 0甜梦 1心动 2心颤 3深渊
      if(g.elite) hpS*=(1+0.22*dIdx);                 // 精英怪随难度加厚(精英墙)
      if(ENEMIES[g.id].boss) hpS*=(1+0.22*dIdx);      // Boss 随难度加厚(Boss 墙)
      const spS=1+0.02*(st.wave-1);
      const isElite=st.event && st.event.id==='elite';
      if(isElite) hpS*=1.4;
      const e=enemies.spawn(g.id,path.wps,hpS,spS);
      if(isElite) e.bounty*=2;
      if(st.event && st.event.id==='double_wave') e.bounty=Math.round(e.bounty*1.5);
      if(g.elite && !isElite){ const af=ELITE_AFFIXES[(Math.random()*ELITE_AFFIXES.length)|0]; e.modifier=af.id; }
      if(g.escort){
        const boss=enemies.list.find(x=>x.def.boss&&x.alive);
        if(boss){ e.pos={x:boss.pos.x,y:boss.pos.y}; e.wpIdx=boss.wpIdx; }
        e.speed=ENEMIES[g.id].speed*0.45;
      }
      this.alive++; g.count--;
      if(g.count<=0) this.queue.shift();
      this.spawnTimer=g.interval*(0.8+Math.random()*0.4);
      if(this.alive>=MAX_ALIVE) this.spawnTimer=0.4;
    }
    if(!this.queue.length) this.spawning=false;
  }
  isClear(){ return !this.spawning && this.alive===0; }
}

// ---------------- 全局单例 ----------------
const enemies=new EnemySystem();
const projectiles=new ProjectileSystem();
const particles=new ParticleSystem();
const hazards=new HazardSystem();
const floaters=new FloaterSystem();
const TowerSystemInst=new TowerSystem();
const director=new WaveDirector();
let path=null;
let now=0;
