// ============================================================
// [01] UTIL — 数学 / 种子随机 / 精灵烘焙 / 音频 / 反馈
// ============================================================
"use strict";

function clamp(v,a,b){return v<a?a:(v>b?b:v)}
function lerp(a,b,t){return a+(b-a)*t}
function dist(a,b){return Math.hypot(a.x-b.x,a.y-b.y)}
function fmt(n){return Math.floor(n).toLocaleString()}
function rng(seed){ // mulberry32
  let a=seed>>>0;
  return function(){ a|=0; a=a+0x6D2B79F5|0; let t=Math.imul(a^a>>>15,1|a);
    t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; };
}
function uid(){return (++uid.n).toString(36)+(Math.random()*1e6|0).toString(36)}
uid.n=0;
function pick(arr){ return arr[(Math.random()*arr.length)|0]; }
function pickWeighted(items, weightFn){ // items: any, weightFn: item=>number
  let total=0; for(const it of items) total+=weightFn(it);
  if(total<=0) return null;
  let r=Math.random()*total;
  for(const it of items){ r-=weightFn(it); if(r<=0) return it; }
  return items[items.length-1];
}

// ============================================================
// SPRITES — 运行时生成像素精灵
// ============================================================
const SPRITES = {
  heart: {size:12, pal:{R:"#ff5b7a",P:"#ff8fa3",W:"#ffe9e9"}, rows:[
    ".RRRR..RRRR.",
    "RRRRRRRRRRRR",
    "RRRRRRRRRRRR",
    "RRRRRRRRRRRR",
    ".RRRRRRRRRR.",
    "..RRRRRRRR..",
    "...RRRRRR...",
    "....RRRR....",
    ".....RR.....",
    "............",
    "............",
    "............",
  ]},
  path_tile: {size:12, pal:{S:"#f2e2b8",D:"#e0c088",G:"#d6b27a",d:"#c9a572"}, rows:[
    "SSSSSSSSSSSS",
    "SSSSSSSSSSSS",
    "SSSDDDSSSSSS",
    "SSSDDDSSSSSS",
    "SSSSSSSSSSSS",
    "SSSDSSSSSSSS",
    "SSSSDDSSSSSS",
    "SSSSSSSSSSSS",
    "SSSSSSSSSSSS",
    "SSDDSSSSSSSS",
    "SSSSSSSSSSSS",
    "SSSSSSSSSSSS",
  ]},
  grass: {size:12, pal:{G:"#8bd46a",g:"#6fbf52",D:"#5aa83f",F:"#f2e2b8"}, rows:[
    "GGGGGGGGGGGG",
    "GGGGGGGGGGGG",
    "GGGgGGGGGGGG",
    "GGGGGGGGGGGG",
    "GGGGGGgGGGGG",
    "GGGGGGGGGGGG",
    "GGgGGGGGGGGG",
    "GGGGGGGGGGGG",
    "GGGGGGGgGGGG",
    "GGGGGGGGGGGG",
    "GGGGGGGGGGGG",
    "GGGGGGGGGGGG",
  ]},
  block: {size:12, pal:{B:"#5a4f8a",b:"#4a3f74",h:"#3a315c"}, rows:[
    "BBBBBBBBBBBB",
    "BbbbbbbbbbbB",
    "BbbbbbbbbbbB",
    "BbbbbbbbbbbB",
    "BbbbbbbbbbbB",
    "BbbbbbbbbbbB",
    "BbbbbbbbbbbB",
    "BbbbbbbbbbbB",
    "BbbbbbbbbbbB",
    "BbbbbbbbbbbB",
    "BbbbbbbbbbbB",
    "BBBBBBBBBBBB",
  ]},
  tower_base: {size:12, pal:{B:"#6a5cb0",b:"#4a3d8c",S:"#8b7bd0",s:"#7a6ac0"}, rows:[
    "..BBBBBBBB..",
    ".BSSSSSSSSB.",
    "BSSSSSSSSSSB",
    "BSSSSSSSSSSB",
    "BSSSSSSSSSSB",
    "BSSSSSSSSSSB",
    "BSSSSSSSSSSB",
    "BSSSSSSSSSSB",
    "BSSSSSSSSSSB",
    ".BSSSSSSSSB.",
    "..BBBBBBBB..",
    "............",
  ]},
};
// 塔炮头：12×12 像素画(按元素)
function bakeTowerHead(element, c1, c2){
  const s=12; const c=document.createElement('canvas'); c.width=s; c.height=s;
  const g=c.getContext('2d');
  function px(x,y,w,h,col){ g.fillStyle=col; g.fillRect(x,y,w,h); }
  if(element==='star'){
    px(5,0,2,2,c1); px(3,2,6,1,c1); px(2,3,8,1,c1);
    px(1,4,2,1,c1); px(3,4,6,1,c1); px(9,4,2,1,c1);
    px(2,5,8,1,c1); px(1,6,2,1,c1); px(3,6,6,1,c1); px(9,6,2,1,c1);
    px(3,7,6,1,c1); px(5,8,2,2,c1);
    px(5,3,2,2,c2); px(5,4,2,2,'#fff');
    px(10,1,1,1,'rgba(255,230,150,.9)'); px(0,7,1,1,'rgba(255,230,150,.6)');
  }
  else if(element==='fire'){
    px(4,0,4,1,c2); px(5,1,2,1,c1);
    px(3,1,6,2,c1); px(2,3,8,1,c1);
    px(1,4,10,2,c1); px(1,6,10,1,c1);
    px(2,7,8,1,c1); px(3,8,6,2,c1);
    px(4,3,1,1,c2); px(7,5,1,1,c2); px(3,6,2,1,c2); px(8,4,1,1,'rgba(255,255,255,.5)');
  }
  else if(element==='ice'){
    px(5,0,2,2,c1); px(4,2,4,1,c1); px(3,3,6,1,c1);
    px(2,4,8,1,c1); px(2,5,8,2,c1); px(3,7,6,1,c1); px(4,8,4,1,c1); px(5,9,2,1,c1);
    px(4,3,1,1,c2); px(4,4,1,1,c2); px(6,5,1,1,'#fff'); px(3,6,1,1,c2); px(7,7,1,1,'rgba(255,255,255,.4)');
  }
  else if(element==='thunder'){
    px(5,0,2,1,c1); px(6,1,2,1,c1);
    px(3,2,6,1,c1); px(2,3,8,1,c1); px(1,4,10,1,c1); px(1,5,10,2,c1);
    px(2,7,8,1,c1); px(3,8,6,1,c1);
    px(9,4,2,1,c1); px(8,6,2,1,c1); px(4,9,2,1,c1);
    px(4,3,2,1,'#fff'); px(4,5,2,1,c2); px(7,5,1,1,c2); px(5,6,1,1,'rgba(255,255,255,.4)');
  }
  else if(element==='nature'){
    px(5,1,2,1,c1); px(4,2,4,1,c1); px(3,3,6,1,c1);
    px(2,4,2,1,c1); px(3,4,6,1,c2); px(8,4,2,1,c1);
    px(3,5,6,1,c1); px(4,6,4,1,c1); px(5,7,2,1,c1);
    px(5,8,2,2,'#4a9c4a');
    px(4,4,1,1,'#fff'); px(6,4,1,1,'#fff');
  }
  return c;
}
const _sprCache = {};
function bakeSprite(id){
  if(_sprCache[id]) return _sprCache[id];
  const def=SPRITES[id]; const c=document.createElement('canvas');
  c.width=def.size; c.height=def.size; const g=c.getContext('2d');
  for(let y=0;y<def.size;y++){ const row=def.rows[y]||"";
    for(let x=0;x<def.size;x++){ const ch=row[x];
      if(ch && ch!=='.' && ch!==' '){ const col=def.pal[ch]; if(col){ g.fillStyle=col; g.fillRect(x,y,1,1);} } } }
  _sprCache[id]=c; return c;
}
const _tintCache={};
function bakeEnemySprite(def){
  const key='enemy_'+def.id+def.color+def.color2;
  if(_tintCache[key]) return _tintCache[key];
  const s=12; const c=document.createElement('canvas'); c.width=s; c.height=s; const g=c.getContext('2d');
  function px(x,y,w,h,col){ g.fillStyle=col; g.fillRect(x,y,w,h); }
  const K='#3a1f33', D='#14102f', W='#fff';
  const body=def.color, shade=def.color2;
  px(2,10,8,1,'rgba(0,0,0,.18)');
  switch(def.id){
    case 'slime':
      px(2,3,8,7,K); px(3,2,6,1,K);
      px(3,3,6,6,body); px(2,4,8,5,body);
      px(3,2,2,1,'rgba(255,255,255,.45)'); px(2,8,8,2,shade);
      px(3,5,2,2,W); px(7,5,2,2,W); px(4,6,1,1,D); px(8,6,1,1,D);
      px(2,7,1,1,'rgba(255,150,170,.6)'); px(9,7,1,1,'rgba(255,150,170,.6)');
      px(5,8,2,1,'rgba(0,0,0,.25)');
      break;
    case 'imp':
      px(3,0,2,4,K); px(7,0,2,4,K);
      px(3,1,1,2,body); px(8,1,1,2,body); px(4,1,1,2,shade); px(7,1,1,2,shade);
      px(2,3,8,6,K); px(1,4,10,4,K);
      px(2,4,8,4,body); px(1,5,10,3,body);
      px(3,2,1,1,body); px(8,2,1,1,body);
      px(3,5,2,2,W); px(7,5,2,2,W); px(4,6,1,1,D); px(8,6,1,1,D);
      px(2,7,1,1,'rgba(255,150,170,.6)'); px(9,7,1,1,'rgba(255,150,170,.6)');
      px(5,6,2,1,'rgba(0,0,0,.3)');
      break;
    case 'brute':
      px(2,2,2,2,K); px(2,2,1,1,body); px(8,2,2,2,K); px(9,2,1,1,body);
      px(1,4,10,6,K); px(2,3,8,7,K);
      px(2,4,8,6,body); px(1,5,10,4,body); px(3,3,6,1,body);
      px(4,7,4,2,shade);
      px(3,5,2,2,K); px(7,5,2,2,K); px(3,5,1,1,W); px(7,5,1,1,W);
      px(5,6,2,1,D);
      px(2,7,1,1,'rgba(255,170,120,.5)'); px(9,7,1,1,'rgba(255,170,120,.5)');
      break;
    case 'thorn':
    case 'flower': // 花妖: 荆棘球 + 花瓣
      px(2,3,8,7,K); px(3,2,6,1,K);
      px(3,3,6,6,body); px(2,4,8,5,body);
      if(def.id==='flower'){
        px(1,2,1,2,'#c8f2a8'); px(10,3,1,2,'#c8f2a8'); px(2,9,1,1,'#c8f2a8'); px(9,8,1,1,'#c8f2a8');
        px(4,1,2,1,'#ffd66b'); px(7,1,1,1,'#ffd66b');
      } else {
        px(1,4,1,1,'#4a9c4a'); px(10,5,1,1,'#4a9c4a'); px(3,8,1,1,'#4a9c4a'); px(9,2,1,1,'#4a9c4a');
      }
      px(3,5,2,2,W); px(7,5,2,2,W); px(4,6,1,1,D); px(8,6,1,1,D);
      px(2,7,1,1,'rgba(74,156,74,.6)'); px(9,7,1,1,'rgba(74,156,74,.6)');
      break;
    case 'ember':
    case 'bomb': // 爆破傀儡: 火焰+引信
      px(5,0,2,1,'#ffd166'); px(4,1,4,2,'#ffd166');
      px(3,2,6,3,body); px(2,4,8,3,body); px(2,7,8,1,body); px(3,8,6,1,body);
      if(def.id==='bomb'){
        px(3,3,2,2,'#5c1408'); px(7,3,2,2,'#5c1408'); px(4,6,4,2,'#2a0f06');
        px(5,6,2,1,'#ffd166');
      } else {
        px(4,4,1,1,'#ffd166'); px(7,5,1,1,'#ffd166'); px(3,6,2,1,'#d94f2e');
      }
      px(4,5,1,2,D); px(7,5,1,2,D);
      break;
    case 'bubble':
      px(5,0,2,1,body); px(4,1,4,2,body); px(3,2,6,1,body);
      px(2,3,8,3,body); px(2,6,8,2,body); px(3,8,6,1,body);
      px(4,2,1,1,'rgba(255,255,255,.6)'); px(5,3,1,1,'rgba(255,255,255,.4)');
      px(3,5,2,2,shade); px(4,6,1,1,D); px(7,6,1,1,D);
      px(1,7,1,1,body); px(10,6,1,1,body);
      break;
    case 'spark':
      px(5,0,2,1,'#fff3a8'); px(4,1,4,1,'#fff3a8');
      px(3,2,6,1,body); px(2,3,8,2,body); px(2,5,8,2,body); px(3,7,6,1,body);
      px(1,4,1,1,'#fff3a8'); px(10,5,1,1,'#fff3a8'); px(5,4,2,1,'#7a4ac4');
      px(4,4,1,2,D); px(7,4,1,2,D);
      px(5,3,2,1,'rgba(255,255,255,.6)');
      break;
    case 'bat': // 冰晶蝠: 冰翼
      px(4,2,4,1,body); px(3,3,6,2,body); px(2,4,8,1,body);
      px(1,3,1,2,'#e8faff'); px(10,3,1,2,'#e8faff'); px(0,4,1,1,'#e8faff'); px(11,4,1,1,'#e8faff');
      px(4,4,1,2,D); px(7,4,1,2,D); px(5,5,2,1,'#4a9dc4');
      px(3,6,2,1,body); px(7,6,2,1,body);
      px(4,3,1,1,'rgba(255,255,255,.5)');
      break;
    case 'crab': // 装甲蟹: 双钳
      px(2,4,8,5,K); px(2,5,8,4,body); px(3,3,6,2,body);
      px(1,4,1,2,body); px(10,4,1,2,body); px(0,5,1,1,shade); px(11,5,1,1,shade);
      px(4,4,2,2,'#2a2f42'); px(7,4,2,2,'#2a2f42');
      px(5,6,2,1,'#2a2f42'); px(3,6,1,1,shade); px(8,6,1,1,shade);
      px(4,7,1,1,shade); px(7,7,1,1,shade);
      px(1,8,2,1,'rgba(255,255,255,.3)'); px(9,8,2,1,'rgba(255,255,255,.3)');
      break;
    case 'priest': // 治疗祭司: 圣光袍
      px(3,2,6,1,body); px(2,3,8,5,body); px(3,8,6,1,body);
      px(1,6,1,2,body); px(10,6,1,2,body); px(2,9,8,1,'#d9b45e');
      px(4,4,1,2,D); px(7,4,1,2,D); px(4,5,4,1,'#4a3f74');
      px(5,1,2,1,'#fff'); px(6,2,1,1,'#fff'); px(3,7,2,1,shade); px(7,7,2,1,shade);
      px(5,10,2,1,'rgba(255,255,255,.5)');
      break;
    case 'shadow':
      px(3,2,6,1,body); px(2,3,8,4,body); px(2,7,8,1,body);
      px(2,8,2,1,body); px(4,8,2,1,body); px(6,8,2,1,body); px(8,8,2,1,body);
      px(3,9,1,1,shade); px(5,9,1,1,shade); px(7,9,1,1,shade); px(9,9,1,1,shade);
      px(4,4,1,2,'#ff8fa3'); px(7,4,1,2,'#ff8fa3');
      px(4,3,1,1,'rgba(255,255,255,.3)'); px(7,3,1,1,'rgba(255,255,255,.3)');
      break;
    case 'tank':
    case 'crab2': // 小蟹(分裂)
      px(2,3,8,6,K); px(1,4,10,5,K);
      px(2,4,8,5,body); px(1,5,10,3,body); px(3,3,6,1,'rgba(255,255,255,.35)');
      if(def.id==='crab2'){
        px(3,5,6,2,'#2a2f42'); px(4,5,1,1,'#ff5b7a'); px(7,5,1,1,'#ff5b7a');
        px(1,6,1,1,'#6a7090'); px(10,6,1,1,'#6a7090');
      } else {
        px(3,5,6,2,'#2a2f42'); px(4,5,1,1,'#ff5b7a'); px(7,5,1,1,'#ff5b7a');
        px(3,3,1,1,'#5c6478'); px(8,3,1,1,'#5c6478');
      }
      px(1,9,10,2,K); px(2,9,8,1,shade); px(3,10,6,1,K);
      break;
    case 'boss1':
      px(4,0,1,1,'#ffd66b'); px(5,0,2,1,'#ffd66b'); px(7,0,1,1,'#ffd66b');
      px(3,1,6,1,'#ffd66b'); px(4,1,1,1,'#ff8fa3'); px(7,1,1,1,'#ff8fa3');
      px(4,2,4,1,body); px(3,3,6,1,body); px(2,4,8,1,body); px(2,5,8,1,body); px(3,6,6,1,body);
      px(4,4,1,2,D); px(7,4,1,2,D); px(4,5,4,1,'#4a2030');
      px(3,7,2,1,body); px(7,7,2,1,body); px(5,7,2,1,body);
      px(2,4,1,1,'rgba(255,255,255,.5)');
      break;
    case 'boss2':
      px(3,0,1,2,'#ffd166'); px(7,0,1,2,'#ffd166');
      px(4,1,4,1,body); px(3,2,6,1,body); px(2,3,8,3,body); px(2,6,8,2,body); px(3,8,6,1,body);
      px(2,3,2,2,'#d94f2e'); px(8,3,2,2,'#d94f2e');
      px(4,4,1,2,'#ffd166'); px(7,4,1,2,'#ffd166');
      px(4,6,4,1,'#5c1408'); px(3,7,2,1,body); px(7,7,2,1,body);
      px(1,5,1,1,'rgba(255,214,102,.6)'); px(10,5,1,1,'rgba(255,214,102,.6)');
      break;
    case 'boss3':
      px(4,0,1,1,'#e8faff'); px(5,0,2,1,'#e8faff'); px(7,0,1,1,'#e8faff');
      px(3,1,6,1,'#e8faff'); px(4,1,1,1,'#fff'); px(7,1,1,1,'#fff');
      px(3,2,6,1,body); px(2,3,8,2,body); px(2,5,8,2,body); px(3,7,6,1,body);
      px(1,4,1,2,'#e8faff'); px(10,4,1,2,'#e8faff');
      px(4,4,1,2,D); px(7,4,1,2,D); px(4,6,4,1,'#4a9dc4');
      px(3,3,1,1,'rgba(255,255,255,.5)');
      break;
    case 'boss4':
      px(5,0,2,1,'#fff3a8'); px(6,1,2,1,'#fff3a8');
      px(3,1,6,1,body); px(2,2,8,1,body); px(1,3,10,3,body); px(2,6,8,2,body); px(3,8,6,1,body);
      px(2,3,2,2,'#7a4ac4'); px(8,3,2,2,'#7a4ac4');
      px(4,4,1,2,'#fff3a8'); px(7,4,1,2,'#fff3a8'); px(5,5,2,1,'#7a4ac4');
      px(0,5,1,1,'#fff3a8'); px(11,5,1,1,'#fff3a8');
      px(3,6,1,1,'rgba(255,255,255,.4)'); px(8,6,1,1,'rgba(255,255,255,.4)');
      break;
    case 'boss5':
      px(4,0,4,1,'#4a9c4a'); px(3,1,6,2,'#4a9c4a');
      px(2,2,8,2,body); px(2,4,8,3,body); px(3,7,6,1,body);
      px(4,3,1,2,'#ffd166'); px(7,3,1,2,'#ffd166');
      px(5,5,2,1,'#4a9c4a');
      px(1,4,1,2,'#4a9c4a'); px(10,4,1,2,'#4a9c4a');
      px(5,8,2,2,'#4a9c4a');
      px(3,4,1,1,'rgba(200,242,168,.4)'); px(8,5,1,1,'rgba(200,242,168,.4)');
      break;
    default:
      px(2,4,8,6,body); px(3,4,6,4,shade); px(4,6,1,1,D); px(7,6,1,1,D);
  }
  _tintCache[key]=c; return c;
}
function drawSprite(ctx,id,x,y,scale){
  ctx.drawImage(bakeSprite(id),0,0,SPR,SPR, Math.round(x),Math.round(y), SPR*scale, SPR*scale);
}
function drawHead(ctx,kind,c1,c2,x,y,scale){
  ctx.drawImage(bakeTowerHead(kind,c1,c2),0,0,12,12, Math.round(x),Math.round(y), 12*scale, 12*scale);
}
function drawEnemy(ctx,def,x,y,scale){
  ctx.drawImage(bakeEnemySprite(def),0,0,12,12, Math.round(x-6*scale),Math.round(y-7*scale), 12*scale,12*scale);
}
function drawProjectile(ctx,p){
  const E=ELEMENTS[p.element]||ELEMENTS.star;
  const c=E.color, glow=E.glow;
  const vx=p.vx||1, vy=p.vy||0, m=Math.hypot(vx,vy)||1, ux=vx/m, uy=vy/m;
  ctx.strokeStyle=glow; ctx.globalAlpha=.45; ctx.lineWidth=3; ctx.lineCap='round';
  ctx.beginPath(); ctx.moveTo(p.pos.x-ux*10, p.pos.y-uy*10); ctx.lineTo(p.pos.x,p.pos.y); ctx.stroke();
  ctx.globalAlpha=1;
  if(p.element==='star'){
    ctx.fillStyle=c; ctx.beginPath(); ctx.arc(p.pos.x,p.pos.y,3,0,7); ctx.fill();
    ctx.fillStyle='rgba(255,255,255,.8)'; ctx.beginPath(); ctx.arc(p.pos.x-1,p.pos.y-1,1.2,0,7); ctx.fill();
  } else if(p.element==='fire'){
    ctx.fillStyle='rgba(255,120,60,.5)'; ctx.beginPath(); ctx.arc(p.pos.x,p.pos.y,5,0,7); ctx.fill();
    ctx.fillStyle=c; ctx.beginPath(); ctx.arc(p.pos.x,p.pos.y,3,0,7); ctx.fill();
    ctx.fillStyle=glow; ctx.beginPath(); ctx.arc(p.pos.x-ux*3,p.pos.y-uy*3,2,0,7); ctx.fill();
  } else if(p.element==='ice'){
    ctx.fillStyle='rgba(150,220,255,.35)'; ctx.beginPath(); ctx.arc(p.pos.x,p.pos.y,5,0,7); ctx.fill();
    ctx.fillStyle=c; ctx.fillRect(p.pos.x-1.5,p.pos.y-3,3,6); ctx.fillRect(p.pos.x-3,p.pos.y-1.5,6,3);
    ctx.fillStyle='#fff'; ctx.fillRect(p.pos.x-1,p.pos.y-1,2,2);
  } else if(p.element==='thunder'){
    ctx.fillStyle='rgba(255,243,168,.4)'; ctx.beginPath(); ctx.arc(p.pos.x,p.pos.y,5,0,7); ctx.fill();
    ctx.fillStyle=c; ctx.fillRect(p.pos.x-1.5,p.pos.y-2,3,4); ctx.fillRect(p.pos.x-2,p.pos.y-1,4,2);
    ctx.fillStyle='#fff'; ctx.fillRect(p.pos.x-1,p.pos.y-1,2,2);
  } else if(p.element==='nature'){
    ctx.fillStyle='rgba(127,216,107,.35)'; ctx.beginPath(); ctx.arc(p.pos.x,p.pos.y,6,0,7); ctx.fill();
    ctx.fillStyle=c; ctx.beginPath(); ctx.arc(p.pos.x,p.pos.y,3,0,7); ctx.fill();
    ctx.fillStyle=glow; ctx.beginPath(); ctx.arc(p.pos.x+1,p.pos.y+1,1.5,0,7); ctx.fill();
  }
}

// ============================================================
// AUDIO — WebAudio 合成音效
// ============================================================
let _actx=null;
function audio(){ if(!_actx){ try{ _actx=new (window.AudioContext||window.webkitAudioContext)(); }catch(e){} }
  if(_actx&&_actx.state==='suspended') _actx.resume(); return _actx; }
function tone(freq,dur,type,vol,slide){
  if(!meta.settings.soundOn) return; const a=audio(); if(!a) return;
  try{
    const o=a.createOscillator(), g=a.createGain();
    o.type=type||'square'; o.frequency.setValueAtTime(freq,a.currentTime);
    if(slide) o.frequency.exponentialRampToValueAtTime(slide,a.currentTime+dur);
    g.gain.setValueAtTime(vol||0.08,a.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001,a.currentTime+dur);
    o.connect(g); g.connect(a.destination); o.start(); o.stop(a.currentTime+dur);
  }catch(e){}
}
const SFX = {
  shoot:  ()=>{ tone(880,0.05,'square',0.03,660); },
  hit:    ()=>{ tone(440,0.04,'triangle',0.05,220); },
  coin:   ()=>{ tone(1046,0.08,'square',0.06,1568); },
  place:  ()=>{ tone(392,0.1,'triangle',0.09,784); },
  sell:   ()=>{ tone(523,0.1,'sine',0.08,392); },
  level:  ()=>{ tone(660,0.12,'sine',0.09,990); },
  wave:   ()=>{ tone(523,0.14,'square',0.07,784); tone(784,0.14,'square',0.06,1046); },
  hurt:   ()=>{ tone(196,0.2,'sawtooth',0.08,98); },
  pick:   ()=>{ tone(784,0.12,'sine',0.09,1175); tone(1175,0.12,'sine',0.08,1568); },
  over:   ()=>{ tone(392,0.3,'sawtooth',0.07,196); tone(262,0.4,'sawtooth',0.07,131); },
  win:    ()=>{ [523,659,784,1047].forEach((f,i)=>setTimeout(()=>tone(f,0.15,'square',0.07),i*90)); },
  react:  ()=>{ tone(660,0.1,'triangle',0.08,990); tone(990,0.1,'triangle',0.06,1320); },
  crit:   ()=>{ tone(1200,0.09,'square',0.06,1800); },
  artifact:()=>{ [392,523,659].forEach((f,i)=>setTimeout(()=>tone(f,0.12,'sine',0.08),i*80)); },
  boss:   ()=>{ tone(180,0.4,'sawtooth',0.08,90); tone(120,0.4,'sawtooth',0.07,60); },
  streak: ()=>{ tone(880,0.08,'square',0.06,1320); },
  error:  ()=>{ tone(160,0.15,'sawtooth',0.06,120); },
};

// ============================================================
// 屏幕震动 / 连击 / 反应横幅（渲染层状态）
// ============================================================
const fx = {
  shake: 0,        // 震屏剩余时间(s)
  shakeAmp: 3,
  streak: 0,       // 当前连杀数
  streakMax: 0,    // 本局最高连杀
  streakShown: 0,  // 最近展示档位
  banner: null,    // {text,color,t,life} 画面中央大字
  leakFlash: 0,
};
function shakeGame(amp){
  fx.shake=Math.max(fx.shake,0.18); fx.shakeAmp=amp||3;
}
function reactionBanner(text,color){
  fx.banner={text,color,t:0,life:1.1};
}
function addKillStreak(n){
  const tiers=[5,10,15,20,30,40,50];
  for(const t of tiers){ if(n>=t && fx.streakShown<t){ fx.streakShown=t; streakBanner(n,t); break; } }
}
function streakBanner(n,t){
  reactionBanner(`🔥 ${n} 连杀！`,'#ff8fa3'); SFX.streak();
}
