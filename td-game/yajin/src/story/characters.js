/* 《你好！一周年》— story/characters.js (v2 真实线)
 * 角色数据（真人设定）：姓名/网名/主题色/表情池/服装差分/动作池，
 * 以及场景、CG、BGM、音效、时段染色、音乐节奏、flag 白名单、结局表。
 * 立绘的实际绘制见 src/art.js（本文件只定义"有哪些"）。
 */
(function (root) {
  'use strict';
  const YJ = root.YJ = root.YJ || {};

  YJ.characters = {
    ya: {
      id: 'ya',
      name: '小崔',
      full: '小崔',
      real: '崔敬雅',        /* 真名：交大动物科学 24 级 */
      handle: 'Cockatiel.',          // 游戏/论坛网名（聊天窗口用）
      role: '女主 · 小巧可爱的女生',
      species: null,                 // 真人设定：不再有动物特征
      theme: '#E8A0A8',
      aura: '#FFD8DC',
      height: 158,
      expressions: ['neutral', 'smile', 'laugh', 'shy', 'blush', 'tease', 'pout', 'surprised',
        'worried', 'sad', 'cry', 'serious', 'sleepy', 'proud', 'excited', 'soft'],
      outfits: ['casual', 'winter', 'academic', 'home', 'swim', 'dress'],
      defaultExpr: 'neutral',
      defaultOutfit: 'casual',
      acts: ['idle', 'sit', 'lean', 'bow', 'reach', 'turn', 'hug_open', 'shy_hide', 'sleepy', 'look_up']
    },
    jin: {
      id: 'jin',
      name: '羊羊金',
      full: '羊羊金',
      real: '金泽民',        /* 真名：交大致远数学 21 级 */
      handle: 'MeguzMin',
      role: '玩家视角 · 高大些的男生',
      species: null,
      theme: '#8E9BB5',
      aura: '#DDE3EE',
      height: 183,
      expressions: ['neutral', 'smile', 'shy', 'awkward', 'blank', 'surprised', 'panic', 'moved',
        'cry', 'serious', 'sleepy', 'soft', 'guilty', 'laugh'],
      outfits: ['casual', 'plaid', 'winter', 'formal', 'swim', 'jk', 'nails', 'home'],
      defaultExpr: 'neutral',
      defaultOutfit: 'casual',
      acts: ['idle', 'sit', 'lean', 'bow', 'reach', 'turn', 'hug_open', 'shy_hide', 'sleepy', 'look_up']
    }
  };

  /* 说话人：narrator=旁白，inner=羊羊金的心声 */
  YJ.speakers = {
    ya: { name: '小崔', color: '#E8A0A8' },
    jin: { name: '羊羊金', color: '#8E9BB5' },
    inner: { name: '羊羊金（心声）', color: '#A79A88' },
    narrator: { name: '', color: '#CFC6B8' }
  };

  /* 情绪标签（调试/素材清单用） */
  YJ.exprLabel = {
    neutral: '平静', smile: '微笑', laugh: '笑出来', shy: '害羞', blush: '脸红',
    tease: '坏笑', pout: '鼓腮', surprised: '惊讶', worried: '担心', sad: '难过',
    cry: '哭', serious: '认真', sleepy: '困', proud: '得意', excited: '兴奋',
    awkward: '尴尬', blank: '发呆', panic: '慌张', moved: '眼眶红', soft: '温柔', guilty: '愧疚'
  };

  /* 服装标签 */
  YJ.outfitLabel = {
    casual: '日常', winter: '冬装', academic: '学术（衬衫西装＋细框眼镜）', home: '居家卫衣',
    swim: '泳装', dress: '连衣裙', plaid: '格纹衬衫', formal: '白衬衫', jk: 'JK 裙', nails: '猫猫美甲'
  };

  /* ---------- 场景（assets/backgrounds/*.svg） ---------- */
  YJ.SCENES = [
    'dorm', 'forum', 'idv_map', 'campus_gate', 'street_cn', 'bench_night',
    'airport', 'station', 'hotel', 'conference', 'theatre', 'kitchen',
    'nail_salon', 'home_living', 'home_yard', 'beach', 'underwater', 'mall',
    'starfield', 'shanghai_night',
    'hk_park', 'hk_parade', 'hk_shop', 'hk_fireworks'
  ];
  YJ.SCENE_LABEL = {
    dorm: '他的房间', forum: '学校论坛', idv_map: '庄园 · 回忆地图', campus_gate: '校园门口',
    street_cn: '街道', bench_night: '路灯下的长椅', airport: '机场', station: '车站（虹桥 / 苏州 / 南阳）',
    hotel: '酒店房间', conference: '学术会议中心', theatre: '音乐剧场', kitchen: '厨房',
    nail_salon: '美甲店', home_living: '她家客厅', home_yard: '小区楼下', beach: '海边',
    underwater: '水下', mall: '商场', starfield: '星空', shanghai_night: '上海的夜',
    hk_park: '香港迪士尼 · 园区与城堡', hk_parade: '香港迪士尼 · 仙境巡游',
    hk_shop: '香港迪士尼 · 玩偶店', hk_fireworks: '香港迪士尼 · 夜与烟花'
  };

  /* ---------- CG ---------- */
  YJ.CGS = [
    'cg_forum', 'cg_first_rank', 'cg_birthday_map', 'cg_zero_clock', 'cg_chat_confess',
    'cg_stone_essay', 'cg_first_meet', 'cg_bench', 'cg_airport_hug', 'cg_suzhou_hall',
    'cg_newyear', 'cg_nail_art', 'cg_marshmallow', 'cg_beach', 'cg_underwater',
    'cg_yiwu_gifts', 'cg_ginpu', 'cg_jk', 'cg_anniversary',
    'cg_end_star', 'cg_end_slow', 'cg_end_she_first',
    'cg_hk_coaster', 'cg_hk_coin', 'cg_hk_fireworks'
  ];

  /* ---------- 音频 ---------- */
  YJ.BGMS = ['bgm_warm', 'bgm_quiet', 'bgm_rain', 'bgm_tension', 'bgm_game', 'bgm_hope', 'bgm_ending', 'bgm_memory',
    'bgm_longing', 'bgm_night', 'bgm_travel',   /* 音乐重构新增：不舍 / 夜行 / 路上 */
    'bgm_none'];
  YJ.SFXS = ['sfx_click', 'sfx_page', 'sfx_msg', 'sfx_ding', 'sfx_heart', 'sfx_laugh', 'sfx_camera', 'sfx_bell', 'sfx_thunder',
    /* 香港迪士尼章专用（烟花 / 过山车 / 巡游花车），合成实现见 src/audio.js §7 */
    'sfx_firework_launch', 'sfx_firework_boom', 'sfx_firework_finale', 'sfx_coaster_whoosh', 'sfx_parade_music'];
  YJ.AMBIENCES = ['none', 'rain', 'night', 'cafe', 'crowd', 'sea', 'keyboard', 'wind', 'underwater',
    'park'];   /* park = 香港迪士尼白天园区（人群 + 远处音乐 + 偶尔的轨道车） */

  /* ---------- 演出选项 ---------- */
  YJ.TINTS = ['day', 'dusk', 'night', 'rain'];            // 时段染色（省素材）
  YJ.BEATS = ['calm', 'pulse', 'swell', 'drop'];          // 音乐节奏标记
  YJ.ZOOMS = ['bust', 'face', 'hand'];                    // 镜头

  /* ---------- Flag 白名单（STORY_SPEC §5）---------- */
  YJ.FLAGS = [
    // 相识期
    'f_forum_met', 'f_first_voice', 'f_team4', 'f_two_left', 'f_first_rank', 'f_forest_tale', 'f_friend_words',
    // 生日
    'f_map_hint', 'f_map_played', 'f_vanished_2350', 'f_zero_wish', 'f_cried_map', 'f_cockatiel_line', 'f_essay_written',
    'f_map_avoided',   /* 在回忆地图上没敢细看那几行字（分支二）—— 用于条件回环 */
    // 第一次见面
    'f_woke_3am', 'f_rabbit_plush', 'f_held_hands', 'f_bench_lean', 'f_airport_cry_1', 'f_oct13_talk', 'f_master_talk',
    // 苏州
    'f_big_fight', 'f_suzhou_invite', 'f_poster_help', 'f_rehearsal', 'f_saw_her_shine', 'f_made_up', 'f_airport_cry_2',
    // 上海日常
    'f_monthly_visit', 'f_craft_together', 'f_musical_sleep', 'f_cake_together', 'f_newyear',
    // 南阳
    'f_gift_wrap', 'f_postcard', 'f_nail_cat', 'f_nail_cool', 'f_met_parents', 'f_hotel_first',
    'f_sneak_milktea', 'f_marshmallow', 'f_airport_cry_3',
    // 杭州
    'f_typhoon', 'f_brotato_nightmare', 'f_hotel_day',
    // 三亚
    'f_stickon_nails', 'f_jk_skirt', 'f_makeup_artist', 'f_photo_conflict', 'f_apologized',
    'f_diving', 'f_duty_free', 'f_chocolate',
    // 义乌
    'f_yiwu_6', 'f_gift_xiaoqi', 'f_ginpu_box', 'f_stomachache', 'f_gift_exchange',
    'f_pregnant_joke', 'f_birthday_cake2',
    // 一周年
    'f_anniv', 'f_confess', 'f_official',
    // 收束
    'end_star', 'end_slow', 'end_she_first'
  ];
  YJ.FLAG_SET = YJ.FLAGS.reduce((m, f) => (m[f] = true, m), {});

  /* ---------- 三种收束 ---------- */
  YJ.ENDINGS = {
    star: {
      id: 'star', title: '《星星的答案》', cg: 'cg_end_star',
      desc: ''
    },
    slow: {
      id: 'slow', title: '《慢慢来》', cg: 'cg_end_slow',
      desc: ''
    },
    she_first: {
      id: 'she_first', title: '《这次是我先说的》', cg: 'cg_end_she_first',
      desc: ''
    }
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);
