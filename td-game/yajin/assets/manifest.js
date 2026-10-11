/* 《你好！一周年》— assets/manifest.js (v2)
 * 素材总清单：由角色/场景/CG 注册表（src/story/characters.js）*枚举*而来，
 * 因此永远不会与实际资产脱节。需要按节点统计用途时调用 YJ.manifest.usage()（需先加载剧本）。
 *
 * 状态说明：
 *   file-vector   = 仓库内真实存在的矢量文件（背景 / CG / UI 图标）
 *   procedural    = 由 src/art.js 程序化绘制的立绘（无位图文件，天然对齐）
 *   webaudio      = WebAudio 实时合成音频（无采样文件）
 */
(function (root) {
  'use strict';
  const YJ = root.YJ = root.YJ || {};

  const SCENE_NAME = YJ.SCENE_LABEL || {};
  const OUTFIT_NAME = YJ.outfitLabel || {};

  /* 统一画风提示词前缀：供将来替换为手绘 / AI 成品时使用 */
  const STYLE = '精致温暖的二次元手绘插画风格，柔和电影感光影，奶油色调，暖光与冷影对比，细腻笔触，' +
    '16:9 横构图，画面干净留白，不要文字与水印';
  const SCENE_PROMPT = {
    dorm: '男生的宿舍房间，深夜，电脑桌与台灯，窗帘半开，屏幕的冷光打在墙上，安静、有点宅',
    forum: '校园论坛网页界面的特写，深色主题，一条寻人组队的帖子，屏幕光',
    idv_map: '《第五人格》风格的庄园地图，夜雾，远处有密码机与破败建筑的剪影，地面留着一条条手写的回忆标记',
    campus_gate: '冬日的大学校门口，清晨薄雾，行人稀少，路灯还亮着，很冷',
    street_cn: '中国城市的冬日街道与小吃的摊位，暖黄的灯，呵出的白气',
    bench_night: '夜晚公园的长椅，头顶一盏路灯，光晕温柔，周围安静',
    airport: '夜晚的机场候机厅，大玻璃窗，航班信息屏，空旷的座椅',
    station: '高铁站站台，列车进站，指示牌与黄色安全线',
    hotel: '酒店房间，床上摊着行李箱与礼物，窗帘外是城市夜色',
    conference: '学术会议中心的走廊与展板，明亮的顶灯，海报墙',
    theatre: '音乐剧场内，红色座椅与舞台灯光，观众席视角',
    kitchen: '家庭厨房，料理台上是打蛋碗与草莓奶油蛋糕的半成品',
    nail_salon: '美甲店，温暖的灯光，桌上摆着各色甲油与工具',
    home_living: '女朋友家的客厅，布艺沙发与茶几，墙上挂着全家福，拘谨又温暖',
    home_yard: '冬天的小区楼下，路灯下有小小的烤炉与棉花糖，呵气成白',
    beach: '三亚的海边黄昏，海面反光，沙滩与远处的船',
    underwater: '水下的蓝色世界，阳光穿透水面，彩色鱼群游过',
    mall: '商场的国际商贸城中庭，琳琅满目的店铺与灯箱',
    starfield: '深蓝的星空，星星与月亮，安静辽阔',
    shanghai_night: '上海的夜景，江面倒影与对岸的灯光，跨年的氛围'
  };
  const CG_PROMPT = {
    cg_forum: '深夜的电脑屏幕特写，论坛上那条找人一起玩游戏的帖子，屏幕光映在脸上',
    cg_first_rank: '游戏结算画面风格的插画，两个角色并排，胜利的暖色光',
    cg_birthday_map: '一张手绘的回忆地图，上面写着一条条日期与回忆，一盏灯照着它',
    cg_zero_clock: '零点的房间，三个人在语音里一起喊生日快乐，屏幕上是 00:00',
    cg_chat_confess: '手机聊天窗口的特写，最后一条消息是"因为看上你了"',
    cg_stone_essay: '一块石头、一只猫、一池星星与一轮月亮，梦幻的手绘感',
    cg_first_meet: '冬天校园门口，女生缩在围巾里跑过来，男生站着没动',
    cg_bench: '路灯下的长椅，两人并肩，女生靠在他肩上',
    cg_airport_hug: '机场离别时的拥抱，很用力，谁都没说话',
    cg_suzhou_hall: '学术会场，女生站在展板前讲述，眼里有光',
    cg_newyear: '跨年夜的上海街头，灯光与人群，两人并肩',
    cg_nail_art: '一只做了猫猫美甲的手（右手可爱、左手酷酷的黑色），手部特写',
    cg_marshmallow: '冬夜小区楼下烤棉花糖，火光很暖，呵气成白',
    cg_beach: '三亚海边黄昏，两人并肩看海',
    cg_underwater: '水下与鱼群合影，蓝色通透',
    cg_yiwu_gifts: '桌上摆满互相包装好的礼物，中间是 Ginpu 玩偶',
    cg_ginpu: '一堆 Ginpu 企鹅玩偶堆成小山',
    cg_jk: '酒店房间里她把手机转过来，屏幕上是商场橱窗里的一排裙子（浅蓝色那条挂在最中间），他红着脸把视线别开——他并没有穿裙子',
    cg_anniversary: '一周年，两人互道"男女朋友你好"，房间灯光很暖',
    cg_end_star: '星空下，两人相视而笑，最深的坦白之后（收束 A）',
    cg_end_slow: '星空下并肩，含蓄而温柔（收束 B）',
    cg_end_she_first: '星空下，她替他说出了那句话（收束 C）'
  };

  /* CG 的合成方式（哪些是"背景 + 位图立绘"合成、哪些是手绘符号画面）。
     位图立绘只有 @any 一套（不区分服装），所以这里只记表情与额外处理。 */
  const CG_COMPOSED = {
    cg_first_rank: 'idv_map + 雅(excited) + 金(smile)',
    cg_zero_clock: 'dorm + 雅(laugh) + 金(cry)',
    cg_first_meet: 'campus_gate + 雅(shy) + 金(shy)',
    cg_bench: 'bench_night + 雅(blush) + 金(soft)',
    cg_airport_hug: 'airport + 雅(cry/水平翻转) + 金(cry)',
    cg_suzhou_hall: 'conference + 雅(serious) + 金(soft/压暗)',
    cg_newyear: 'shanghai_night + 雅(laugh) + 金(smile)',
    cg_marshmallow: 'home_yard + 雅(laugh) + 金(moved)',
    cg_beach: 'beach + 雅(smile) + 金(smile)',
    cg_underwater: 'underwater + 雅(excited) + 金(surprised)',
    cg_yiwu_gifts: 'mall + 雅(proud) + 金(laugh)',
    cg_jk: 'hotel + 雅(laugh/举着手机) + 金(shy/别开视线) + 橱窗裙子照片道具（他没有穿裙子）',
    cg_anniversary: 'hotel + 雅(blush) + 金(moved)',
    cg_nail_art: 'art.handSVG("cat_nails") + art.handSVG("cool_nails") 合成（一只甜的、一只凶的）',
    cg_end_star: 'starfield + 雅(laugh) + 金(soft)',
    cg_end_slow: 'starfield + 雅(smile) + 金(shy)',
    cg_end_she_first: 'starfield + 雅(tease) + 金(moved)'
  };
  const CG_HANDDRAWN = ['cg_forum', 'cg_birthday_map', 'cg_chat_confess', 'cg_stone_essay', 'cg_ginpu'];

  const assets = [];

  /* ---------- 背景 ---------- */
  (YJ.SCENES || []).forEach(id => {
    assets.push({
      id: 'bg_' + id, type: 'background', scene: id, name: SCENE_NAME[id] || id,
      file: 'assets/backgrounds/' + id + '.svg', size: '1600x900', transparency: false,
      status: 'file-vector', tintSupported: true,
      replaceHint: '放置 assets/backgrounds/' + id + '.png（1600×900）并改 src/ui.js 的后缀即可替换',
      aiPrompt: STYLE + '。场景：' + (SCENE_PROMPT[id] || id)
    });
  });

  /* ---------- 立绘（程序化） ---------- */
  Object.keys(YJ.characters || {}).forEach(cid => {
    const ch = YJ.characters[cid];
    ch.expressions.forEach(e => {
      assets.push({
        id: 'sprite_' + cid + '_' + e, type: 'sprite', character: cid, expression: e,
        name: ch.name + ' · ' + (YJ.exprLabel[e] || e) + '（' + ch.outfits.map(o => OUTFIT_NAME[o] || o).join('/') + '）',
        file: null, generator: 'YJ.art.characterSVG("' + cid + '", "' + e + '", act, {outfit})',
        size: '720x1080', transparency: true, status: 'procedural',
        replaceHint: '放置 assets/characters/' + cid + '/' + e + '.png（720×1080，透明，脚底对齐画布底部）后，改 src/ui.js 的 svgFor()',
        aiPrompt: STYLE + '。角色立绘：' + ch.full + '（' + ch.role + '，身高 ' + ch.height + 'cm），' +
          (YJ.exprLabel[e] || e) + '的表情，半身站立立绘，透明背景，正面偏 3/4 视角'
      });
    });
    /* 服装差分单独登记（便于美术替换时知道要画几套） */
    ch.outfits.forEach(o => {
      assets.push({
        id: 'outfit_' + cid + '_' + o, type: 'outfit', character: cid, outfit: o,
        name: ch.name + ' · ' + (OUTFIT_NAME[o] || o), file: null,
        generator: 'YJ.art.characterSVG("' + cid + '", expr, act, {outfit:"' + o + '"})',
        size: '720x1080', transparency: true, status: 'procedural',
        replaceHint: '若改为位图，需为每个表情各出一张（共 ' + ch.expressions.length + ' 张）'
      });
    });
  });

  /* ---------- CG ---------- */
  (YJ.CGS || []).forEach(id => {
    const hand = CG_HANDDRAWN.indexOf(id) >= 0;
    assets.push({
      id: id, type: 'cg', name: (CG_PROMPT[id] || id).slice(0, 14) + '…',
      file: 'assets/cg/' + id + '.svg', size: '1600x900', transparency: false,
      status: hand ? 'file-vector-handdrawn' : 'file-vector-composed',
      composition: CG_COMPOSED[id] || '手绘符号画面',
      replaceHint: '放置 assets/cg/' + id + '.png（1600×900）即可替换',
      aiPrompt: STYLE + '。CG：' + (CG_PROMPT[id] || id)
    });
  });

  /* ---------- UI ---------- */
  [
    ['ui_logo_mark', '标题徽记', 'assets/ui/logo_mark.svg', '240x240'],
    ['ui_title_night', '标题界面星空插图（手写矢量，含 CSS 动画钩子）', 'assets/ui/title_night.svg', '1600x900'],
    ['ui_icon_heart', '好感度图标', 'assets/ui/icon_heart.svg', '64x64'],
    ['ui_icon_trust', '信任度图标', 'assets/ui/icon_trust.svg', '64x64'],
    ['ui_icon_courage', '勇气图标', 'assets/ui/icon_courage.svg', '64x64']
  ].forEach(a => assets.push({
    id: a[0], type: 'ui', name: a[1], file: a[2], size: a[3],
    transparency: true, status: 'file-vector'
  }));
  [
    ['ui_dialog_frame', '对话框与姓名牌'], ['ui_choice_button', '选项按钮'],
    ['ui_chat_panel', '聊天窗口（论坛帖 / 群聊 / 私聊）'], ['ui_save_slot', '存档槽与读档界面'],
    ['ui_backlog', '剧情回顾界面'], ['ui_settings', '设置菜单'], ['ui_ending_screen', '结局画面版式'],
    ['ui_hud_meters', '好感 / 信任 / 勇气计量条'], ['ui_date_chip', '日期章（titlecard）'],
    ['ui_postcard', '猫猫明信片卡片']
  ].forEach(a => assets.push({
    id: a[0], type: 'ui', name: a[1], file: null, size: '自适应(CSS)',
    transparency: true, status: 'css-implemented',
    note: '见 index.html 中对应样式；无需图片文件。'
  }));

  /* ---------- 音频（WebAudio 合成） ---------- */
  (YJ.BGMS || []).filter(b => b !== 'bgm_none').forEach(id => assets.push({
    id: id, type: 'audio', name: 'BGM · ' + id.replace('bgm_', ''),
    file: null, generator: 'YJ.audio.playBGM("' + id + '")', size: '实时合成',
    status: 'webaudio', note: '振荡器与噪声实时合成（和弦垫 + 稀疏旋律），可在设置中关闭；非采样文件。'
  }));
  (YJ.SFXS || []).forEach(id => assets.push({
    id: id, type: 'audio', name: '音效 · ' + id.replace('sfx_', ''),
    file: null, generator: 'YJ.audio.sfx("' + id + '")', size: '实时合成',
    status: 'webaudio', note: '关闭音效后不会创建任何发声节点。'
  }));
  (YJ.AMBIENCES || []).filter(a => a !== 'none').forEach(id => assets.push({
    id: 'amb_' + id, type: 'audio', name: '环境音 · ' + id,
    file: null, generator: 'YJ.audio.playAmbience("' + id + '")', size: '实时合成',
    status: 'webaudio'
  }));

  YJ.manifest = {
    title: '你好！一周年',
    version: '2.0.0',
    note: '本作不引用任何外部网络图片。背景 / CG / UI 图标为仓库内真实存在的 SVG；' +
      '角色立绘由 src/art.js 程序化绘制（同一 720×1080 画布，表情与服装差分天然对齐）；' +
      '音频由 WebAudio 实时合成。清单由注册表枚举生成，不会与实际资产脱节。',
    characters: Object.keys(YJ.characters || {}).reduce((m, k) => {
      const c = YJ.characters[k];
      m[k] = { name: c.name, full: c.full, handle: c.handle, role: c.role, height: c.height,
        expressions: c.expressions.slice(), outfits: c.outfits.slice() };
      return m;
    }, {}),
    assets: assets,
    byId(id) { for (const a of this.assets) if (a.id === id) return a; return null; },
    /* 按剧本统计每个素材的使用次数（需先加载剧本） */
    usage() {
      const u = {};
      if (!YJ.story || !YJ.story.order) return u;
      YJ.story.order.forEach(id => {
        const n = YJ.story.get(id);
        if (n.scene) u['bg_' + n.scene] = (u['bg_' + n.scene] || 0) + 1;
        if (n.cg) u[n.cg] = (u[n.cg] || 0) + 1;
        if (n.bgm) u[n.bgm] = (u[n.bgm] || 0) + 1;
        if (n.sfx) u[n.sfx] = (u[n.sfx] || 0) + 1;
        (n.cast || []).forEach(c => { if (c.outfit) u['outfit_' + c.id + '_' + c.outfit] = (u['outfit_' + c.id + '_' + c.outfit] || 0) + 1; });
      });
      return u;
    },
    counts() {
      const c = {};
      this.assets.forEach(a => c[a.type] = (c[a.type] || 0) + 1);
      return c;
    }
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);
