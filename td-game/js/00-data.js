// ============================================================
// [00] DATA — 星尘守卫 v3 全部配置与数值表
// 对应 DESIGN.md §3-§9；修改数值请同步设计文档
// ============================================================
"use strict";

const TILE = 48;
const COLS = 20, ROWS = 12;
const W = COLS*TILE, H = ROWS*TILE;
const PX = 4;             // 像素缩放: 12px 精灵 × 4 = 48px 瓦片
const SPR = 12;           // 精灵像素尺寸
const FIXED = 1000/60;    // 固定步长(ms)

// ============ 难度 ============
// mult: 星尘倍率  hpMult: 敌人HP倍率  spd: 敌人速度倍率  refund: 出售退款系数  income: 局内金币倍率
const DIFFS = {
  normal:    {name:"甜梦", mult:1.0,  hpMult:1.0,  spd:1.0,  refund:0.70, income:1.00, desc:"标准难度 · 失误会被惩罚", unlock:null},
  hard:      {name:"心动", mult:1.5,  hpMult:1.50, spd:1.07, refund:0.60, income:1.05, desc:"敌人更凶 · 奖励更多", unlock:"diff_hard"},
  nightmare: {name:"心颤", mult:2.0,  hpMult:2.10, spd:1.15, refund:0.50, income:1.05, desc:"极限挑战 · 超高奖励", unlock:"diff_nightmare"},
  abyss:     {name:"深渊", mult:2.5,  hpMult:2.80, spd:1.25, refund:0.40, income:1.00, desc:"绝望难度 · 怪物必定突破", unlock:"diff_abyss"},
};

// ============ 元素体系 ============
const ELEMENTS = {
  star:    {name:"星", color:"#ffd66b", dark:"#e8a838", glow:"#ffe9a8"},
  fire:    {name:"火", color:"#ff6b3d", dark:"#d94f2e", glow:"#ffd166"},
  ice:     {name:"冰", color:"#7fd8e8", dark:"#4a9dc4", glow:"#e8faff"},
  thunder: {name:"雷", color:"#ffd166", dark:"#7a4ac4", glow:"#fff3a8"},
  nature:  {name:"木", color:"#7fd86b", dark:"#4a9c4a", glow:"#c8f2a8"},
  water:   {name:"水", color:"#7fd8e8", dark:"#4a9dc4", glow:"#e8faff"},
  iron:    {name:"铁", color:"#aab2c8", dark:"#6a7090", glow:"#dfe4f2"},
  dark:    {name:"暗", color:"#8b7bd0", dark:"#4a3f74", glow:"#b8a7ff"},
};
// 塔元素 → 克制(1.5x)的敌人元素; 星无克制
const WEAK = { fire:"nature", ice:"fire", thunder:"water", nature:"thunder" };
const ELEMENT_ORDER = ["star","fire","ice","thunder","nature"];

// ============ 塔 · 五大门派 ============
const TOWERS = {
  star:    {name:"星塔", element:"star", icon:"⭐", cost:45, dmg:9,  rate:1.1, range:2.5, projSpeed:6, kind:"single",
    critChance:0.25, critMult:3.0, color:"#ffd66b", color2:"#ffe9a8",
    desc:"精准爆击流：概率暴击×3.0，单体爆发", role:"单体爆发"},
  fire:    {name:"火塔", element:"fire", icon:"🌋", cost:70, dmg:14, rate:1.0, range:2.2, projSpeed:5, kind:"burn",
    burnDps:9, burnDur:2, explodeR:1.3, explodeDmg:0.6, critChance:0, critMult:1.5, color:"#ff6b3d", color2:"#ffd166",
    desc:"点燃蔓延流：灼烧可叠加，灼烧死亡会爆炸传染", role:"持续点燃"},
  ice:     {name:"冰塔", element:"ice", icon:"❄️", cost:60, dmg:6,  rate:1.1, range:3.0, projSpeed:6, kind:"slow",
    slowFactor:0.6, slowDur:1.5, freezeChance:0.18, freezeDur:0.9, shatterR:1.2, shatterDmg:0.9, critChance:0, critMult:1.5,
    color:"#7fd8e8", color2:"#e8faff", desc:"冻结碎裂流：冻结敌人被命中会冰裂溅射+易伤", role:"控制爆发"},
  thunder: {name:"雷塔", element:"thunder", icon:"⚡", cost:100, dmg:10, rate:1.3, range:3.0, projSpeed:8, kind:"chain",
    chain:2, chainRange:1.5, surgeDps:4, surgeR:1.2, surgeDur:1.6, overload:0.2, critChance:0, critMult:1.5,
    color:"#ffd166", color2:"#7a4ac4", desc:"电弧过载流：连锁弹跳+电涌区域，概率全屏过载", role:"群体连锁"},
  nature:  {name:"木塔", element:"nature", icon:"🌿", cost:85, dmg:4,  rate:1.4, range:2.8, projSpeed:5, kind:"poison",
    poisonDps:5, poisonDur:2.5, zoneR:1.2, tangleFactor:0.7, critChance:0, critMult:1.5,
    color:"#7fd86b", color2:"#c8f2a8", desc:"剧毒纠缠流：毒雾缠绕减速，中毒死亡留毒池", role:"范围DOT"},
};
const TOWER_LEVEL_COST = 1.0;   // 升级费用 = 基础价 × 级数
const TOWER_MAX_LV = 3;
const SELL_REFUND = 0.7;
const START = {hp:20, coins:110, waveBonusBase:22, waveBonusPer:2.5};
const MAX_ALIVE = 45;

// ============ 章节 ============
const CHAPTERS = {
  ch1: {name:"星光平原", icon:"⭐", theme:"star",   map:"map_1", unlock:null,      tower:"star",    terrain:"泥泞", desc:"新手章节 · 泥泞路径减速"},
  ch2: {name:"赤焰火山", icon:"🌋", theme:"fire",   map:"map_2", unlock:"chapter_2", tower:"fire",  terrain:"岩浆", desc:"岩浆灼烧 · 火塔登场"},
  ch3: {name:"冰晶湖畔", icon:"❄️", theme:"ice",     map:"map_3", unlock:"chapter_3", tower:"ice",   terrain:"冰面", desc:"超长冰面 · 冰塔冻结"},
  ch4: {name:"雷霆峡谷", icon:"⚡", theme:"thunder", map:"map_4", unlock:"chapter_4", tower:"thunder", terrain:"雷石", desc:"雷石充能 · 雷塔连锁"},
  ch5: {name:"迷雾丛林", icon:"🌿", theme:"nature",  map:"map_5", unlock:"chapter_5", tower:"nature", terrain:"毒沼", desc:"毒沼弥漫 · 木塔毒雾"},
};
const CHAPTER_ORDER = ["ch1","ch2","ch3","ch4","ch5"];
const CHAPTER_WAVES = 10;
const BOSS_WAVES = [5, 10];
const BOSS_BY_CHAPTER = {ch1:"boss1", ch2:"boss2", ch3:"boss3", ch4:"boss4", ch5:"boss5"};

// ============ 敌人（17 基础/精英 + 5 Boss） ============
// pri: 集火优先级(塔的目标选择加权, 单位≈格)
const ENEMIES = {
  // 基础(无属性)
  slime:  {name:"小贪吃怪", element:null, weak:null, hp:32,   speed:0.8,  bounty:4,  pri:0, color:"#7fd8c0", color2:"#4ecdc4", size:10},
  imp:    {name:"馋嘴兔",   element:null, weak:null, hp:22,   speed:1.6,  bounty:5,  pri:0, color:"#ffb7c5", color2:"#ff8fa3", size:9},
  brute:  {name:"捣蛋熊",   element:null, weak:null, hp:100,  speed:0.5,  bounty:10, pri:0, color:"#d9a066", color2:"#b8895e", size:12},
  // 元素怪(带死亡/攻击技能)
  thorn:  {name:"荆棘史莱姆", element:"nature", weak:"fire", hp:75,  speed:0.6, bounty:8,  pri:0, color:"#7fd86b", color2:"#4a9c4a", size:11},
  ember:  {name:"火苗精",   element:"fire", weak:"ice", hp:50,   speed:1.4, bounty:9,  pri:0, color:"#ff6b3d", color2:"#d94f2e", size:9,  boom:true, boomR:1.2, boomDmg:12},
  bubble: {name:"泡泡怪",   element:"water", weak:"thunder", hp:60, speed:1.0, bounty:8, pri:0, color:"#7fd8e8", color2:"#4a9dc4", size:10, split:true},
  spark:  {name:"电光球",   element:"thunder", weak:"nature", hp:38, speed:2.2, bounty:9, pri:0, color:"#ffd166", color2:"#7a4ac4", size:8,  dodge:0.30},
  // 新增 5 种（v3）
  flower: {name:"剧毒花妖", element:"nature", weak:"fire", hp:70,  speed:0.9, bounty:10, pri:1, color:"#8bd46a", color2:"#4a9c4a", size:11, poolOnDeath:true},
  bat:    {name:"冰晶蝠",   element:"ice",    weak:"fire", hp:45,  speed:1.5, bounty:10, pri:0, color:"#a8e8f5", color2:"#4a9dc4", size:9,  chillDeath:true},
  crab:   {name:"装甲蟹",   element:"iron",   weak:"thunder", hp:220, speed:0.5, bounty:18, pri:1, color:"#c8cfdd", color2:"#6a7090", size:13, armor:4, crabSplit:true},
  crab2:  {name:"小装甲蟹", element:"iron",   weak:"thunder", hp:110, speed:0.6, bounty:9,  pri:0, color:"#c8cfdd", color2:"#6a7090", size:10, armor:2},
  priest: {name:"治疗祭司", element:"star",   weak:null, hp:90,  speed:0.8, bounty:16, pri:2, color:"#ffe9a8", color2:"#d9b45e", size:12, healer:true, healCd:4, healR:2, healPct:0.15},
  bomb:   {name:"爆破傀儡", element:"fire",   weak:"ice", hp:60,  speed:1.1, bounty:12, pri:0, color:"#ff8f5e", color2:"#c23b1e", size:10, towerBomb:true},
  // 精英
  tank:   {name:"铁甲怪",   element:"iron", weak:"thunder", hp:300, speed:0.35, bounty:20, pri:1, color:"#aab2c8", color2:"#6a7090", size:15, armor:3},
  shadow: {name:"暗影偷心者", element:"dark", weak:null,     hp:150, speed:1.5, bounty:30, pri:2, color:"#8b7bd0", color2:"#4a3f74", size:13, phasing:true},
  // 章节 Boss(元素+弱点+专属技能)
  boss1:  {name:"星空魔王", element:null, weak:null,       hp:650,  speed:0.4,  bounty:80,  pri:3, color:"#b8a7ff", color2:"#ffd66b", size:14, boss:true, skill:"summon", skillCd:8},
  boss2:  {name:"熔岩巨魔", element:"fire", weak:"ice",     hp:900,  speed:0.38, bounty:120, pri:3, color:"#ff6b3d", color2:"#ffd166", size:15, boss:true, skill:"spit",   skillCd:9},
  boss3:  {name:"冰晶女王", element:"ice", weak:"thunder",  hp:1150, speed:0.4,  bounty:150, pri:3, color:"#7fd8e8", color2:"#e8faff", size:15, boss:true, skill:"freeze_towers", skillCd:8},
  boss4:  {name:"雷暴主宰", element:"thunder", weak:"nature", hp:1400, speed:0.42, bounty:180, pri:3, color:"#ffd166", color2:"#7a4ac4", size:16, boss:true, skill:"bolt", skillCd:7},
  boss5:  {name:"古树妖灵", element:"nature", weak:"fire",  hp:1800, speed:0.36, bounty:220, pri:3, color:"#7fd86b", color2:"#4a9c4a", size:16, boss:true, skill:"entangle", skillCd:9},
};
// 精英波可附加的词缀
const ELITE_AFFIXES=[
  {id:'haste',    name:"迅捷光环", icon:"⚡", desc:"周围敌人加速", color:'#ffd66b'},
  {id:'lifesteal',name:"吸血",     icon:"🩸", desc:"受击回血",     color:'#ff5b7a'},
  {id:'split',    name:"分裂",     icon:"🫧", desc:"死亡分裂成两个", color:'#b8a7ff'},
  {id:'shield',   name:"护盾",     icon:"🛡️", desc:"周期性护盾",   color:'#7fd8e8'},
  {id:'rage',     name:"狂暴",     icon:"😡", desc:"半血后加速40%", color:'#ff6b3d'},
  {id:'thorn',    name:"荆棘",     icon:"🌵", desc:"受击有概率卡壳攻击者", color:'#7fd86b'},
];

// ============ 地图 ============
// 字符: S 路径  B 泥泞(减速)  M 岩浆(灼烧,火系免疫)  I 冰面(加速+冰塔冻结×2)
//        L 雷石(雷塔伤害+20%)  P 毒沼(木塔毒雾范围+50%)  X 不可建块  . 可建
const MAPS = {
  map_1: {
    name:"星光平原",
    rows:[
      "SSSSSSS.............",
      "......S.....X...X...",
      "......S......X...X..",
      "......S.............",
      "......SSSSSSBBBBB...",
      "................SX..",
      "................S.X.",
      ".........BBBBSSSS...",
      ".........S..........",
      ".........S........X.",
      "..XX.....S..........",
      ".........SSSSSSSSSSS",
    ],
    waypoints:[[0,0],[6,0],[6,4],[16,4],[16,7],[9,7],[9,11],[19,11]],
  },
  map_2: {
    name:"赤焰火山",
    rows:[
      "SSSSSSSSSSS.........",
      "..........MMXX.....X",
      "..........MMXX.....X",
      "...SSSSSSSMM........",
      "...SXX..............",
      "...SXX..............",
      "...SSSSSSSSSSSS.....",
      "..............MXX...",
      "X.............MXX...",
      "X.............MSSSSS",
      "....................",
      "....................",
    ],
    waypoints:[[0,0],[10,0],[10,3],[3,3],[3,6],[14,6],[14,9],[19,9]],
  },
  map_3: {
    name:"冰晶湖畔",
    rows:[
      "SSSIIIIIIIIIIIIIIII.",
      "...............XX.S.",
      "...............XX.S.",
      ".SSSSSSSS.........S.",
      ".S......S..X..X...SX",
      ".S......S..X..X...SX",
      ".S......S..X..X...S.",
      ".S......S.........S.",
      ".SXX....SSSSSSSS..S.",
      ".SXX...........S..S.",
      ".S.............S..S.",
      ".SSIIIIIIIIIIIIIIIIS",
    ],
    waypoints:[[0,0],[18,0],[18,11],[1,11],[1,3],[8,3],[8,8],[15,8],[15,11],[19,11]],
  },
  map_4: {
    name:"雷霆峡谷",
    rows:[
      "SSSSSS..............",
      ".....S....XX..SSSS..",
      ".....S....XX..S..LL.",
      ".....SSSLLLLLLL..LL.",
      "..XX.............LL.",
      ".........SSSSSSSSLL.",
      ".........S.........X",
      "......XX.S.........X",
      "......XX.S..........",
      ".........SSSSSSSS...",
      "...........X..X.S...",
      "................SSSS",
    ],
    waypoints:[[0,0],[5,0],[5,3],[14,3],[14,1],[17,1],[17,5],[9,5],[9,9],[16,9],[16,11],[19,11]],
  },
  map_5: {
    name:"迷雾丛林",
    rows:[
      "SSSSSSS.............",
      "......SXX...........",
      "......SSSSSSSS......",
      ".......XX....SXX...X",
      ".............SXX...X",
      "....SPPPPPPPPP......",
      "X...SXX.............",
      "X...SXX.............",
      "....SSSSSSSS........",
      "...........PPPXX....",
      "...........PPPXX....",
      "...........PSSSSSSSS",
    ],
    waypoints:[[0,0],[6,0],[6,2],[13,2],[13,5],[4,5],[4,8],[11,8],[11,11],[19,11]],
  },
};
function parseMap(m){
  const grid=[]; for(let r=0;r<ROWS;r++){ const row=[];
    for(let c=0;c<COLS;c++){ const ch=(m.rows[r]||"")[c]||'.';
      const isPath=ch==='S'||ch==='B'||ch==='M'||ch==='I'||ch==='L'||ch==='P';
      let t=ch==='X'?'block':isPath?'path':'build';
      row.push({type:t, slow:ch==='B', magma:ch==='M', ice:ch==='I', stone:ch==='L', poison:ch==='P',
        tower:null, col:c,row:r}); }
    grid.push(row); }
  return grid;
}

// ============ 随机事件（10 种，W1 不触发，主题事件权重×2） ============
const EVENTS = [
  {id:'magma_burst',  name:'熔岩爆发', icon:'🌋', color:'#ff6b3d', theme:'fire',    desc:'火塔伤害+20%，灼烧+50%'},
  {id:'blizzard',     name:'暴风雪',   icon:'❄️', color:'#7fd8e8', theme:'ice',     desc:'全场敌人-30%速，冰塔冻结+15%'},
  {id:'thunderstorm', name:'雷暴',     icon:'⚡', color:'#ffd166', theme:'thunder', desc:'雷塔+20%，周期雷击敌人'},
  {id:'acid_rain',    name:'酸雨',     icon:'🌧️', color:'#7fd86b', theme:'nature',  desc:'全场敌人中毒，木塔毒雾+50%'},
  {id:'treasure',     name:'宝藏波',   icon:'🪙', color:'#ffd66b', theme:null,      desc:'击杀赏金 ×2'},
  {id:'elite',        name:'精英波',   icon:'👑', color:'#ff8fa3', theme:null,      desc:'敌人+40%体质，赏金×2，必带词缀'},
  {id:'double_wave',  name:'双倍波次', icon:'⏳', color:'#b8a7ff', theme:null,      desc:'敌人数量×1.7，赏金×1.5（风险收益）'},
  {id:'gold_rain',    name:'黄金雨',   icon:'💰', color:'#ffd66b', theme:null,      desc:'开波+40🪙，敌人速度+15%'},
  {id:'dark_pact',    name:'暗影契约', icon:'🌑', color:'#8b7bd0', theme:null,      desc:'所有塔伤害+20%，基地-2❤️'},
  {id:'regrowth',     name:'回春',     icon:'🌸', color:'#7fd8c0', theme:null,      desc:'开波+3❤️，敌人HP+10%'},
];

// 章节波次构成
const CHAPTER_ENEMIES = {
  ch1: {base:['slime','imp','brute'], themed:[],              elite:'tank',            boss:'boss1'},
  ch2: {base:['slime','imp','brute'], themed:['thorn'],       elite:'tank',            boss:'boss2'},
  ch3: {base:['slime','imp','brute'], themed:['ember','bubble'], elite:'tank',         boss:'boss3'},
  ch4: {base:['slime','imp','brute'], themed:['bubble','spark'], elite:['tank','shadow'], boss:'boss4'},
  ch5: {base:['slime','imp','brute'], themed:['thorn','spark'], elite:['tank','shadow'], boss:'boss5'},
};

// ============ 稀有度 ============
const RARITY={common:6,uncommon:4,rare:2,epic:1};
const RARITY_LABEL={common:"常见",uncommon:"少见",rare:"稀有",epic:"史诗",danger:"危险"};
const RARITY_COLOR={common:'#7fd8c0',uncommon:'#b8a7ff',rare:'#ffd66b',epic:'#ff8fa3',danger:'#ff6b6b'};

// ============ 肉鸽升级池 ============
const UPGRADE_POOL=[
  // 全局
  {id:'all_dmg',  name:"星光增幅",  icon:"✨", rarity:"uncommon", max:99, tag:"全局",
    desc:"所有塔伤害 <b>+15%</b>", apply(){ towerDmgBonus*=1.15; for(const t of TowerSystemInst.list) t.dmg*=1.15; }},
  {id:'all_range',name:"视野延伸",  icon:"🔭", rarity:"uncommon", max:99, tag:"全局",
    desc:"所有塔射程 <b>+12%</b>", apply(){ towerRangeBonus*=1.12; for(const t of TowerSystemInst.list) t.range*=1.12; }},
  {id:'all_rate', name:"星星连珠",  icon:"☄️", rarity:"rare", max:99, tag:"全局",
    desc:"所有塔攻速 <b>+10%</b>", apply(){ towerRateBonus*=0.9; for(const t of TowerSystemInst.list) t.fireRate=Math.max(0.12,t.fireRate*0.9); }},
  {id:'cheap',   name:"省钱妙招",  icon:"🪙", rarity:"uncommon", max:99, tag:"经济",
    desc:"塔建造花费 <b>-12%</b>", apply(){ towerCostBonus*=0.88; }},
  // 经济
  {id:'bounty',  name:"金币加成",  icon:"💰", rarity:"common", max:99, tag:"经济",
    desc:"击杀金币 <b>+15%</b>", apply(){ bountyBonus*=1.15; }},
  {id:'wavebonus',name:"波次红包", icon:"🧧", rarity:"common", max:99, tag:"经济",
    desc:"波次奖励 <b>+50%</b>", apply(){ waveBonusMult*=1.5; }},
  {id:'interest',name:"星光利息",  icon:"🏦", rarity:"rare", max:1, tag:"经济",
    desc:"每波结束获得金币 <b>×6% 利息</b>（上限150）", apply(){ interestOn=1; }},
  {id:'freeplace',name:"免费券",   icon:"🎫", rarity:"epic", max:99, tag:"经济",
    desc:"下 <b>1</b> 座塔免费放置", apply(){ st.freePlace++; }},
  // 生存
  {id:'plus_hp',name:"爱心守护",  icon:"❤️", rarity:"common", max:10, tag:"生存",
    desc:"基地生命 <b>+2</b>", apply(){ st.maxHp+=2; st.hp+=2; }},
  {id:'lifesteal',name:"治愈星光", icon:"💖", rarity:"epic", max:1, tag:"生存",
    desc:"每击杀 <b>10</b> 个敌人回复 1 点爱心", apply(){ lifestealOn=1; }},
  {id:'startgrant',name:"开局小礼", icon:"🎁", rarity:"common", max:99, tag:"经济",
    desc:"每波开始 <b>+15</b> 金币", apply(){ startGrantOn=1; }},
  // 战斗强化
  {id:'react',   name:"元素共鸣",  icon:"🔮", rarity:"rare", max:99, tag:"战斗",
    desc:"元素反应伤害 <b>+20%</b>", apply(){ reactBonus*=1.2; }},
  {id:'weakhunter',name:"弱点猎手", icon:"🎯", rarity:"uncommon", max:99, tag:"战斗",
    desc:"克制倍率 <b>1.5 → 1.65</b>", apply(){ weakBonus+=0.15; }},
  {id:'splatter',name:"分解者",    icon:"💥", rarity:"uncommon", max:99, tag:"战斗",
    desc:"击杀时对附近敌人造成 <b>30%</b> 溅射", apply(){ splatterOn=1; }},
  {id:'craft',   name:"工匠精神",  icon:"🔧", rarity:"uncommon", max:99, tag:"经济",
    desc:"塔升级费用 <b>-15%</b>", apply(){ upgradeCostBonus*=0.85; }},
  // 危险牌
  {id:'zeal',    name:"狂热",      icon:"🔥", rarity:"rare", max:99, tag:"危险",
    desc:"所有塔伤害 <b>+25%</b>，基地 <b>-1❤️</b>", danger:true, apply(){ for(const t of TowerSystemInst.list) t.dmg*=1.25; st.maxHp=Math.max(1,st.maxHp-1); st.hp=Math.min(st.hp,st.maxHp); }},
  {id:'frenzy',  name:"狂暴",      icon:"🌀", rarity:"rare", max:99, tag:"危险",
    desc:"攻速 <b>+15%</b>，射程 <b>-12%</b>", danger:true, apply(){ for(const t of TowerSystemInst.list){ t.fireRate=Math.max(0.12,t.fireRate*0.85); t.range*=0.88; } }},
  {id:'greed',   name:"贪婪",      icon:"💎", rarity:"epic", max:99, tag:"危险",
    desc:"击杀金币 <b>+30%</b>，基地 <b>-2❤️</b>", danger:true, apply(){ bountyBonus*=1.3; st.maxHp=Math.max(1,st.maxHp-2); st.hp=Math.min(st.hp,st.maxHp); }},
];
// 章节元素专属池（该章主题塔强化，权重×3）
const ELEMENT_UPGRADES = {
  star: [
    {id:'star_dmg', el:"star", name:"星辉强化", icon:"⭐", rarity:"common", max:99, tag:"元素",
      desc:"星塔伤害 <b>+30%</b>", apply(){ for(const t of TowerSystemInst.list) if(t.element==='star') t.dmg*=1.3; }},
    {id:'star_rate', el:"star", name:"星光连射", icon:"✨", rarity:"uncommon", max:99, tag:"元素",
      desc:"星塔攻速 <b>+15%</b>", apply(){ for(const t of TowerSystemInst.list) if(t.element==='star') t.fireRate=Math.max(0.12,t.fireRate*0.85); }},
    {id:'star_crit', el:"star", name:"星运", icon:"🎯", rarity:"rare", max:99, tag:"元素",
      desc:"星塔暴击率 <b>+10%</b>", apply(){ for(const t of TowerSystemInst.list) if(t.element==='star') t.critChance+=0.10; }},
    {id:'star_critdmg', el:"star", name:"星陨", icon:"💥", rarity:"epic", max:99, tag:"元素",
      desc:"星塔暴击倍率 <b>+0.6</b>", apply(){ for(const t of TowerSystemInst.list) if(t.element==='star') t.critMult+=0.6; }},
    {id:'star_luck', el:"star", name:"命运骰子", icon:"🎲", rarity:"uncommon", max:99, tag:"元素",
      desc:"所有塔暴击率 <b>+5%</b>", apply(){ for(const t of TowerSystemInst.list) t.critChance+=0.05; }},
  ],
  fire: [
    {id:'fire_dmg', el:"fire", name:"烈焰增幅", icon:"🔥", rarity:"common", max:99, tag:"元素",
      desc:"火塔伤害 <b>+30%</b>", apply(){ for(const t of TowerSystemInst.list) if(t.element==='fire') t.dmg*=1.3; }},
    {id:'fire_burn', el:"fire", name:"灼烧持久", icon:"🌡️", rarity:"uncommon", max:99, tag:"元素",
      desc:"灼烧持续 <b>+1s</b>", apply(){ for(const t of TowerSystemInst.list) if(t.element==='fire') t.def.burnDur+=1; }},
    {id:'fire_splash', el:"fire", name:"火势蔓延", icon:"🎇", rarity:"rare", max:99, tag:"元素",
      desc:"灼烧会<b>蔓延</b>到附近敌人", apply(){ fireSplashOn=1; }},
    {id:'fire_boom', el:"fire", name:"燎原", icon:"🧨", rarity:"rare", max:99, tag:"元素",
      desc:"点燃死亡爆炸范围 <b>+0.4 格</b>", apply(){ for(const t of TowerSystemInst.list) if(t.element==='fire') t.def.explodeR+=0.4; }},
    {id:'fire_ember', el:"fire", name:"余烬", icon:"🌋", rarity:"uncommon", max:99, tag:"元素",
      desc:"被灼烧敌人再受火伤 <b>+15%</b>", apply(){ fireEmberOn=1; }},
  ],
  ice: [
    {id:'ice_dmg', el:"ice", name:"寒冰穿透", icon:"❄️", rarity:"common", max:99, tag:"元素",
      desc:"冰塔伤害 <b>+25%</b>", apply(){ for(const t of TowerSystemInst.list) if(t.element==='ice') t.dmg*=1.25; }},
    {id:'ice_freeze', el:"ice", name:"冰封", icon:"🧊", rarity:"uncommon", max:99, tag:"元素",
      desc:"冻结几率 <b>+10%</b>", apply(){ for(const t of TowerSystemInst.list) if(t.element==='ice') t.def.freezeChance+=0.1; }},
    {id:'ice_shatter', el:"ice", name:"冰裂", icon:"💠", rarity:"rare", max:99, tag:"元素",
      desc:"冰裂溅射伤害 <b>+40%</b>", apply(){ for(const t of TowerSystemInst.list) if(t.element==='ice') t.def.shatterDmg+=0.4; }},
    {id:'ice_slow', el:"ice", name:"霜冻强化", icon:"🥶", rarity:"rare", max:99, tag:"元素",
      desc:"减速效果 <b>+15%</b>", apply(){ for(const t of TowerSystemInst.list) if(t.element==='ice') t.def.slowFactor=Math.max(0.2,t.def.slowFactor-0.15); }},
    {id:'ice_heart', el:"ice", name:"冰心", icon:"💠", rarity:"uncommon", max:99, tag:"元素",
      desc:"冰裂溅射附带 <b>1s 冰冻</b>", apply(){ iceHeartOn=1; }},
  ],
  thunder: [
    {id:'thunder_dmg', el:"thunder", name:"雷光充能", icon:"⚡", rarity:"common", max:99, tag:"元素",
      desc:"雷塔伤害 <b>+20%</b>", apply(){ for(const t of TowerSystemInst.list) if(t.element==='thunder') t.dmg*=1.2; }},
    {id:'thunder_chain', el:"thunder", name:"连锁增强", icon:"🔗", rarity:"rare", max:99, tag:"元素",
      desc:"雷塔连锁 <b>+1</b>", apply(){ for(const t of TowerSystemInst.list) if(t.element==='thunder') t.def.chain+=1; }},
    {id:'thunder_overload', el:"thunder", name:"过载", icon:"🌩️", rarity:"rare", max:99, tag:"元素",
      desc:"过载触发几率 <b>+15%</b>", apply(){ for(const t of TowerSystemInst.list) if(t.element==='thunder') t.def.overload+=0.15; }},
    {id:'thunder_surge', el:"thunder", name:"电涌强化", icon:"⚡", rarity:"uncommon", max:99, tag:"元素",
      desc:"电涌伤害 <b>+50%</b>", apply(){ for(const t of TowerSystemInst.list) if(t.element==='thunder') t.def.surgeDps*=1.5; }},
    {id:'thunder_storm', el:"thunder", name:"雷暴云", icon:"🌪️", rarity:"uncommon", max:99, tag:"元素",
      desc:"过载额外 <b>+2</b> 道电弧", apply(){ for(const t of TowerSystemInst.list) if(t.element==='thunder') t.def.overloadBolts=(t.def.overloadBolts||3)+2; }},
  ],
  nature: [
    {id:'nature_zone', el:"nature", name:"毒雾扩散", icon:"🌫️", rarity:"uncommon", max:99, tag:"元素",
      desc:"木塔毒雾范围 <b>+20%</b>", apply(){ for(const t of TowerSystemInst.list) if(t.element==='nature') t.def.zoneR*=1.2; }},
    {id:'nature_poison', el:"nature", name:"剧毒加深", icon:"☠️", rarity:"common", max:99, tag:"元素",
      desc:"木塔中毒伤害 <b>+30%</b>", apply(){ for(const t of TowerSystemInst.list) if(t.element==='nature') t.def.poisonDps*=1.3; }},
    {id:'nature_tangle', el:"nature", name:"藤蔓缠绕", icon:"🌿", rarity:"rare", max:99, tag:"元素",
      desc:"毒雾减速效果<b>提升</b>", apply(){ natureTangleOn=1; }},
    {id:'nature_pool', el:"nature", name:"毒池蔓延", icon:"🫧", rarity:"rare", max:99, tag:"元素",
      desc:"中毒死亡毒池范围 <b>+40%</b>", apply(){ naturePoolOn=1; }},
    {id:'nature_rage', el:"nature", name:"毒素狂暴", icon:"🍄", rarity:"uncommon", max:99, tag:"元素",
      desc:"中毒敌人受木塔伤害 <b>+20%</b>", apply(){ for(const t of TowerSystemInst.list) if(t.element==='nature') t.def.poisonRage=(t.def.poisonRage||0)+0.2; }},
  ],
};

// ============ 开局遗物（8 件，开局三选一） ============
// 说明: 遗物在开局选(塔尚未存在), 因此修改塔属性的遗物使用"本局标记",
// 由 Tower 构造时消费(luckyCrit/hourglassRate/hourglassRange 见 02-core.js)
const ARTIFACTS = [
  {id:'piggy',  name:"存钱罐",   icon:"🏦", desc:"开局+60🪙，每波利息5%",              color:'#ffd66b', apply(){ st.coins+=60; st.piggy=1; }},
  {id:'scroll', name:"双生卷轴", icon:"📜", desc:"开局随机 2 座免费塔",                color:'#b8a7ff', apply(){ st.freePlace+=2; st.scrollTower=1; }},
  {id:'hunt',   name:"猎杀印记", icon:"🎯", desc:"克制倍率 1.5 → 1.75",                color:'#ff8fa3', apply(){ weakBonus+=0.25; }},
  {id:'lucky',  name:"幸运星",   icon:"✨", desc:"所有塔暴击+10%，建造费+10%",          color:'#ffe9a8', apply(){ luckyCrit=0.10; towerCostBonus*=1.10; }},
  {id:'heart',  name:"荆棘之心", icon:"🌹", desc:"基地+6❤️，开局-30🪙",                color:'#ff5b7a', apply(){ st.maxHp+=6; st.hp+=6; st.coins=Math.max(0,st.coins-30); }},
  {id:'hourglass',name:"时间沙漏", icon:"⏳", desc:"所有塔攻速+12%，射程-8%",          color:'#7fd8e8', apply(){ hourglassRate=0.88; hourglassRange=0.92; }},
  {id:'glutton',name:"饕餮之口", icon:"🐷", desc:"击杀金币+30%，基地-2❤️",             color:'#ffd66b', apply(){ bountyBonus*=1.3; st.maxHp=Math.max(1,st.maxHp-2); st.hp=Math.min(st.hp,st.maxHp); }},
  {id:'scholar',name:"学者之眼", icon:"👁️", desc:"本局首次三选一出现 4 张",            color:'#7fd8c0', apply(){ st.scholar=1; }},
];

// ============ 星尘商店 ============
const SHOP=[
  {id:'tower_fire', name:"火塔", icon:"🌋", price:150, desc:"单体+灼烧 · 克制木系", type:"tower"},
  {id:'tower_ice', name:"冰塔", icon:"❄️", price:200, desc:"减速+冻结 · 克制火系", type:"tower"},
  {id:'tower_thunder', name:"雷塔", icon:"⚡", price:280, desc:"连锁弹跳 · 克制水系", type:"tower"},
  {id:'tower_nature', name:"木塔", icon:"🌿", price:350, desc:"毒雾范围 · 克制雷系", type:"tower"},
  {id:'chapter_3', name:"第3章 · 冰晶湖畔", icon:"❄️", price:300, desc:"提前解锁章节（通关亦可）", type:"chapter"},
  {id:'chapter_4', name:"第4章 · 雷霆峡谷", icon:"⚡", price:450, desc:"提前解锁章节（通关亦可）", type:"chapter"},
  {id:'chapter_5', name:"第5章 · 迷雾丛林", icon:"🌿", price:600, desc:"提前解锁章节（通关亦可）", type:"chapter"},
  {id:'diff_hard',  name:"心动难度", icon:"💓", price:200, desc:"敌人更强，星尘更多", type:"diff"},
  {id:'diff_nightmare',name:"心颤难度", icon:"💘", price:400, desc:"极限挑战，超高奖励", type:"diff"},
  {id:'diff_abyss', name:"深渊难度", icon:"🕳️", price:800, desc:"绝望挑战 · 怪物必定突破", type:"diff"},
  {id:'start_plus_hp', name:"爱心祝福", icon:"❤️", price:120, desc:"每局开局 +5 爱心", type:"start"},
  {id:'start_plus_coins', name:"金币祝福", icon:"🪙", price:120, desc:"每局开局 +40 金币", type:"start"},
  {id:'start_random_tower', name:"随缘塔", icon:"🎲", price:180, desc:"开局随机送一座塔", type:"start"},
];
const SHOP_GROUPS=[
  {title:'⚔️ 元素塔', type:'tower'},
  {title:'🗺️ 章节推进', type:'chapter'},
  {title:'🎮 难度', type:'diff'},
  {title:'✨ 开局祝福', type:'start'},
];
function shopBorder(it){
  if(it.type==='tower'){ const tid=it.id.replace('tower_','');
    if(TOWERS[tid] && ELEMENTS[TOWERS[tid].element]) return ELEMENTS[TOWERS[tid].element].color; }
  return '';
}
