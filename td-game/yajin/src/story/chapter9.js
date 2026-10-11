/* 《你好！一周年》第九章 · 三次旅行（2026 春–秋）—— 剧本组 E
 * 9-1 杭州台风 / 9-2 三亚 / 9-3 义乌
 * 权威设定：../STORY_SPEC.md v2（§2 角色 / §3 资源 / §4 节点契约 / §5 数值与 flag / §6 第九章）
 * 首节点 c9_01，末节点跳 c10_01（第十章由主程撰写）
 */
(function () {
  'use strict';
  YJ.story.add([

    /* ============================================================
     *  9-1  杭州 · 台风（2026 春）
     * ============================================================ */

    {
      id: 'c9_01', chapter: 9, scene: 'dorm', tint: 'night', bgm: 'bgm_quiet', beat: 'calm', ambience: 'night',
      cast: [{ id: 'jin', pos: 'center', expr: 'blank', outfit: 'casual', act: 'sit' }],
      titlecard: '2026 · 春  杭州 · 台风',
      speaker: 'inner', transition: 'slowfade',
      text: '出发前三天，天气预报上多了一个红色的圈。她在语音里说得轻松：应该没事的，我们运气一向不错。我盯着那个圈看了很久，把机票付款页面关掉了两次，第三次才点了确认。',
      next: 'c9_02'
    },
    {
      id: 'c9_02', chapter: 9, scene: 'airport', bgm: 'bgm_quiet', beat: 'calm',
      cast: [
        { id: 'ya', pos: 'left', expr: 'smile', outfit: 'casual', act: 'idle' },
        { id: 'jin', pos: 'right', expr: 'neutral', outfit: 'casual', act: 'idle' }
      ],
      speaker: 'ya',
      text: '你看，广播还在正常播。你现在要是反悔，我可就真哭了。',
      next: 'c9_03'
    },
    {
      id: 'c9_03', chapter: 9,
      cast: [{ id: 'ya', pos: 'left', expr: 'tease', outfit: 'casual', act: 'idle' }],
      speaker: 'jin',
      text: '……我没说要反悔。\n围巾系好。风大。\n……真的。',
      next: 'c9_04'
    },
    {
      id: 'c9_04', chapter: 9, scene: 'airport', tint: 'dusk',
      cast: [{ id: 'jin', pos: 'right', expr: 'neutral', outfit: 'casual', act: 'idle' }],
      speaker: 'inner',
      text: '飞机晚了两个小时。她靠在我肩上睡了一路，醒来第一句话是问我要不要喝水。\n——我其实不渴。可我还是喝了。',
      next: 'c9_04b'
    },
    {
      id: 'c9_04b', chapter: 9, scene: 'airport', tint: 'rain', beat: 'calm',
      cast: [{ id: 'jin', pos: 'right', expr: 'neutral', outfit: 'casual', act: 'idle' }],
      speaker: 'inner',
      text: '飞机开始下降的时候，我贴着舷窗往下看。云底下的杭州是一整片灰白，江也是灰的，看不出哪一边是西湖。\n那时候我还以为，明天就能看见它。',
      next: 'c9_05'
    },
    {
      id: 'c9_05', chapter: 9, scene: 'hotel', tint: 'rain', bgm: 'bgm_rain', beat: 'calm', ambience: 'rain',
      cast: [
        { id: 'ya', pos: 'left', expr: 'neutral', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'neutral', outfit: 'casual', act: 'idle' }
      ],
      titlecard: '落地 · 雨下了一整个下午',
      speaker: 'narrator', transition: 'fade',
      text: '走出机场的时候，雨不是落下来的，是横着抽过来的。伞刚撑开就翻了。她的头发贴在脸上，笑起来还是很好看。',
      next: 'c9_06'
    },
    {
      id: 'c9_06', chapter: 9, tint: 'rain', ambience: 'rain',
      cast: [
        { id: 'ya', pos: 'left', expr: 'surprised', outfit: 'casual', act: 'idle' },
        { id: 'jin', pos: 'right', expr: 'blank', outfit: 'casual', act: 'idle' }
      ],
      speaker: 'ya',
      text: '啊……这好像不是普通的下雨。我的鞋已经湿透了，你听，一走一步水声。',
      next: 'c9_07'
    },
    {
      id: 'c9_07', chapter: 9, scene: 'hotel', tint: 'rain', bgm: 'bgm_rain', ambience: 'rain',
      cast: [
        { id: 'ya', pos: 'left', expr: 'neutral', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'neutral', outfit: 'casual', act: 'idle' }
      ],
      speaker: 'narrator',
      text: '房间在十七层，窗外是一片被吹散的灰。前台说台风的外围环流要影响两天，让我们尽量别出门。\n她把湿透的袜子挂在椅背上，蹲在地毯上翻行李箱，翻一会儿，抬头看我一眼，又低下去。',
      next: 'c9_08'
    },
    {
      id: 'c9_08', chapter: 9, tint: 'rain',
      cast: [
        { id: 'ya', pos: 'left', expr: 'worried', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'neutral', outfit: 'casual', act: 'idle' }
      ],
      speaker: 'ya',
      text: '……我肚子有点不舒服。可能刚才在机场那杯冰的。没事没事，我坐一会儿就好。',
      next: 'c9_09'
    },
    {
      id: 'c9_09', chapter: 9, tint: 'rain',
      cast: [
        { id: 'ya', pos: 'left', expr: 'worried', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'soft', outfit: 'casual', act: 'reach' }
      ],
      speaker: 'jin',
      text: '把外套垫在腰后面。\n你先躺下，我去问前台有没有热水壶。\n……疼就说。',
      next: 'c9_010'
    },
    {
      id: 'c9_010', chapter: 9, tint: 'rain',
      cast: [{ id: 'jin', pos: 'right', expr: 'neutral', outfit: 'casual', act: 'idle' }],
      speaker: 'inner',
      text: '她嘴上说没事，眉毛是一点一点皱起来的。我在电梯里想，这趟是不是不该来。又想，这话要是真说出口，她一定会笑着骂我一句，然后更难受。\n电梯到一楼，我才发现自己刚才一直按着关门键。',
      next: 'c9_011'
    },
    {
      id: 'c9_011', chapter: 9, scene: 'hotel', tint: 'rain', beat: 'calm', ambience: 'rain',
      cast: [
        { id: 'ya', pos: 'left', expr: 'sleepy', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'neutral', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'narrator',
      text: '台风把整座城市的声音都压低了。窗外是连绵的水声，房间里的空调很吵，电视开着也没人看。我们两个都不提「出门」这两个字。',
      next: 'c9_012'
    },
    {
      id: 'c9_012', chapter: 9, tint: 'rain',
      cast: [{ id: 'ya', pos: 'left', expr: 'tease', outfit: 'casual', act: 'sit' }],
      speaker: 'ya',
      text: '所以我们大老远飞来杭州，是来住酒店的。你点外卖吧，点什么都行，我今天不想动脑子。',
      next: 'c9_013'
    },
    {
      id: 'c9_013', chapter: 9, tint: 'rain',
      cast: [
        { id: 'ya', pos: 'left', expr: 'neutral', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'neutral', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'inner',
      text: '我翻了三家店，认真得像在做一份报告。粥、小笼、一份不要辣的炒青菜。她凑过来看我的手机，看到那碗粥的时候眼睛亮了一下——她什么都没说，但我知道她看见了。',
      effects: { affection: 2, trust: 1 },
      next: 'c9_014'
    },
    {
      id: 'c9_014', chapter: 9, scene: 'hotel', tint: 'rain', sfx: 'sfx_ding',
      cast: [{ id: 'ya', pos: 'left', expr: 'excited', outfit: 'casual', act: 'sit' }],
      speaker: 'narrator',
      text: '外卖送到的时候，塑料袋上全是雨水，骑手的名字后面跟着四个字：注意安全。她把餐盒一个个摆开，摆得像在给谁过节。',
      next: 'c9_015'
    },
    {
      id: 'c9_015', chapter: 9, tint: 'rain',
      cast: [
        { id: 'ya', pos: 'left', expr: 'smile', outfit: 'casual', act: 'reach' },
        { id: 'jin', pos: 'right', expr: 'soft', outfit: 'casual', act: 'reach' }
      ],
      speaker: 'ya',
      text: '给你留了最大的那只小笼。\n……别看我呀。快吃，凉了皮会硬。',
      next: 'c9_016'
    },
    {
      id: 'c9_016', chapter: 9, tint: 'rain', bgm: 'bgm_game', beat: 'pulse',
      cast: [
        { id: 'ya', pos: 'left', expr: 'laugh', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'smile', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'narrator',
      text: '吃完饭她翻我的包，翻出那台一直跟着我的主机和两只手柄。\n她把电视调好，一只手柄塞进我手里，自己盘腿坐在地毯上：「今天谁也不许提台风。」',
      next: 'c9_017'
    },
    {
      id: 'c9_017', chapter: 9, tint: 'rain', sfx: 'sfx_msg',
      cast: [{ id: 'jin', pos: 'right', expr: 'neutral', outfit: 'casual', act: 'sit' }],
      speaker: 'jin',
      text: '……先开一局庄园？\n还是，直接打土豆。',
      next: 'c9_018'
    },
    {
      id: 'c9_018', chapter: 9, tint: 'rain',
      cast: [
        { id: 'ya', pos: 'left', expr: 'tease', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'smile', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'ya',
      text: '庄园。今天我要赢一把，不然不睡。你上次那个翻窗，我等了你三个人头的时间。',
      next: 'c9_019'
    },
    {
      id: 'c9_019', chapter: 9, scene: 'hotel', tint: 'rain', bgm: 'bgm_game', beat: 'pulse', zoom: 'bust',
      cast: [
        { id: 'ya', pos: 'left', expr: 'laugh', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'laugh', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'narrator',
      text: '我们打到十二点半。她笑到往后倒，拿手柄敲我的膝盖，说我这一局的走位像被雨泡过。\n我嘴上不认。心里松了一口——她脸色比刚进门的时候好看多了。',
      effects: { affection: 2 },
      next: 'c9_020'
    },
    {
      id: 'c9_020', chapter: 9, tint: 'rain', zoom: 'bust',
      cast: [
        { id: 'ya', pos: 'left', expr: 'excited', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'neutral', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'ya',
      text: '换一个。土豆兄弟，噩梦模式。\n今天就在这个房间里把它过了。我不信它。',
      next: 'c9_021'
    },
    {
      id: 'c9_021', chapter: 9, tint: 'rain',
      cast: [{ id: 'jin', pos: 'right', expr: 'awkward', outfit: 'casual', act: 'sit' }],
      speaker: 'inner',
      text: '我心里咯噔一下。这个模式我们线上打了半年，最好的一次是第四关倒下。她选它的时候眼睛都没眨，我要是说一句难，就等于先认输。',
      next: 'c9_022'
    },
    {
      id: 'c9_022', chapter: 9, scene: 'hotel', tint: 'rain', bgm: 'bgm_game', beat: 'pulse', ambience: 'rain',
      cast: [
        { id: 'ya', pos: 'left', expr: 'serious', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'serious', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'narrator',
      text: '第一局我们活到第十一波。她一声不吭地把残局界面看完，按下重开。第二局更差。第三局开始，房间里就只剩手柄的按键声，和窗外的雨。',
      next: 'c9_023'
    },
    {
      id: 'c9_023', chapter: 9, tint: 'rain', beat: 'pulse',
      cast: [
        { id: 'ya', pos: 'left', expr: 'pout', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'blank', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'ya',
      text: '第四局。这次我玩远程，你在前面挡。\n……你别死太早，听见没有。',
      next: 'c9_024'
    },
    {
      id: 'c9_024', chapter: 9, tint: 'rain', beat: 'drop', sfx: 'sfx_click',
      cast: [
        { id: 'ya', pos: 'left', expr: 'sad', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'guilty', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'narrator',
      text: '第四局死在第⑨波。她把脸埋进袖子里，闷闷地说了一句再来一次。第五局是最好的一次——我们打到第⑭波，我按错了一个键，屏幕一下子安静了。',
      next: 'c9_025'
    },
    {
      id: 'c9_025', chapter: 9, tint: 'rain', beat: 'drop',
      cast: [
        { id: 'ya', pos: 'left', expr: 'sad', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'guilty', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'inner',
      text: '她没说话。手柄放在腿上，屏幕上是那个还亮着的结算界面，分数停在离通关很远的地方。外面的雨还在敲窗户，一下，一下。我很想伸手抱她。可这个念头卡在喉咙口，出不来。',
      next: 'c9_choice_nightmare'
    },
    {
      id: 'c9_choice_nightmare', chapter: 9, tint: 'rain', bgm: 'bgm_game', beat: 'calm',
      cast: [
        { id: 'ya', pos: 'left', expr: 'sad', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'guilty', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'jin',
      text: '……要不，先歇一会儿吧。',
      next: 'c9_ch16_a1',
      choices: [
        { text: '放下手柄，直接把她抱过来', hint: '（不问了，先抱）', effects: { affection: 4, trust: 4, courage: 5 }, next: 'c9_ch16_a1' },
        { text: '说「再试最后一次，就一次」', hint: '（我也有点不甘心）', effects: { affection: 2, courage: 2 }, next: 'c9_ch16_b1' },
        { text: '说「这个模式，我们可能真的过不去」', hint: '（把话说得诚实一点）', effects: { trust: 5, affection: 2 }, next: 'c9_ch16_c1' }
      ]
    },

    /* —— 选项⑯ 分支 A：放下手柄 —— */
    {
      id: 'c9_ch16_a1', chapter: 9, tint: 'rain', bgm: 'bgm_warm', beat: 'swell', zoom: 'bust', transition: 'slowfade',
      cast: [
        { id: 'ya', pos: 'left', expr: 'surprised', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'soft', outfit: 'casual', act: 'hug_open' }
      ],
      speaker: 'narrator',
      text: '我把手柄放到地毯上，伸手把她连着袖子一起拉过来。\n她愣了一下，然后就势靠进我怀里，头顶正好抵在我下巴下面。\n……很轻。',
      next: 'c9_ch16_a2'
    },
    {
      id: 'c9_ch16_a2', chapter: 9, tint: 'rain', zoom: 'bust',
      cast: [
        { id: 'ya', pos: 'left', expr: 'shy', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'soft', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'ya',
      text: '……我没难过。真的。\n就是一个游戏而已。我又不是小孩。',
      next: 'c9_ch16_a3'
    },
    {
      id: 'c9_ch16_a3', chapter: 9, tint: 'rain', zoom: 'face',
      cast: [
        { id: 'ya', pos: 'left', expr: 'shy', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'soft', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'jin',
      text: '那个键是我按错的。\n……跟你没关系。',
      next: 'c9_ch16_a4'
    },
    {
      id: 'c9_ch16_a4', chapter: 9, tint: 'rain', beat: 'swell',
      cast: [
        { id: 'ya', pos: 'left', expr: 'laugh', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'smile', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'ya',
      text: '你终于承认了。\n……那你要抱多久呀？我手都麻了。',
      next: 'c9_026'
    },

    /* —— 选项⑯ 分支 B：再试最后一次 —— */
    {
      id: 'c9_ch16_b1', chapter: 9, tint: 'rain', beat: 'pulse',
      cast: [
        { id: 'ya', pos: 'left', expr: 'proud', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'serious', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'ya',
      text: '……行。最后一次。你听我的，别乱冲，我让你退你就退。',
      next: 'c9_ch16_b2'
    },
    {
      id: 'c9_ch16_b2', chapter: 9, tint: 'rain',
      cast: [
        { id: 'ya', pos: 'left', expr: 'serious', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'serious', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'narrator',
      text: '我们又试了一次。这次死在第⑫波。她把「再来」两个字咽了回去，靠着床沿坐着，很久没动。',
      effects: { affection: 1 },
      next: 'c9_ch16_b3'
    },
    {
      id: 'c9_ch16_b3', chapter: 9, tint: 'rain', zoom: 'face',
      cast: [
        { id: 'ya', pos: 'left', expr: 'sad', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'guilty', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'ya',
      text: '……算了。真的算了。我不是较真，我就是想跟你一起赢一次。',
      next: 'c9_026'
    },

    /* —— 选项⑯ 分支 C：承认过不去 —— */
    {
      id: 'c9_ch16_c1', chapter: 9, tint: 'rain', beat: 'calm', zoom: 'face',
      cast: [
        { id: 'ya', pos: 'left', expr: 'serious', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'serious', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'jin',
      text: '我们线上打了半年了。\n这个模式，大概真不是靠多打几次就能过去的。\n……不是你的问题。',
      next: 'c9_ch16_c2'
    },
    {
      id: 'c9_ch16_c2', chapter: 9, tint: 'rain', zoom: 'bust',
      cast: [
        { id: 'ya', pos: 'left', expr: 'smile', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'soft', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'ya',
      text: '我知道呀。我又不是真要赢。我是不想让你觉得，我们连一个游戏都做不好。',
      next: 'c9_ch16_c3'
    },
    {
      id: 'c9_ch16_c3', chapter: 9, tint: 'rain',
      cast: [
        { id: 'ya', pos: 'left', expr: 'shy', outfit: 'casual', act: 'reach' },
        { id: 'jin', pos: 'right', expr: 'moved', outfit: 'casual', act: 'reach' }
      ],
      speaker: 'inner',
      text: '她这句话说得很轻，我差点没接住。原来她陪我熬到半夜，不是为了那个通关界面。我伸手把她手边的袖子握住——她的手凉得很。',
      effects: { trust: 2 },
      next: 'c9_026'
    },

    /* —— 三条分支汇合 —— */
    {
      id: 'c9_026', chapter: 9, scene: 'hotel', tint: 'rain', bgm: 'bgm_warm', beat: 'calm', ambience: 'rain',
      cast: [
        { id: 'ya', pos: 'left', expr: 'smile', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'soft', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'ya',
      text: '不打了。你陪我说会儿话。\n……顺便，这个台风到底什么时候走啊。',
      next: 'c9_027'
    },
    {
      id: 'c9_027', chapter: 9, tint: 'rain', beat: 'calm',
      cast: [
        { id: 'ya', pos: 'left', expr: 'pout', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'smile', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'jin',
      text: '预报说明天中午。……也可能拖到晚上。\n这台风脾气不好，说不走就不走。',
      next: 'c9_028'
    },
    {
      id: 'c9_028', chapter: 9, tint: 'rain',
      cast: [
        { id: 'ya', pos: 'left', expr: 'pout', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'smile', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'ya',
      text: '太不识相了。我们从落地到现在一直在下雨，我鞋还没干呢。\n它一点面子都不给。',
      next: 'c9_029'
    },
    {
      id: 'c9_029', chapter: 9, tint: 'rain', zoom: 'face',
      cast: [
        { id: 'ya', pos: 'left', expr: 'tease', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'smile', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'ya',
      text: '不过它把所有人关在家里的同时，顺便把我们俩关一块儿了。\n喂，这算不算因祸得福？',
      next: 'c9_030'
    },
    {
      id: 'c9_030', chapter: 9, tint: 'rain', zoom: 'bust', transition: 'slowfade',
      cast: [
        { id: 'ya', pos: 'left', expr: 'shy', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'soft', outfit: 'casual', act: 'reach' }
      ],
      speaker: 'inner',
      text: '我说「算」。其实我心里想的是另一句话——我希望我们以后能一直这样近。可那句话太长、太软，一出口就缩成了一个「算」字。她好像也不在意，把手伸过来，让我握着。',
      effects: { affection: 3, courage: 1, flags: { f_typhoon: true } },
      next: 'c9_031'
    },
    {
      id: 'c9_031', chapter: 9, scene: 'hotel', tint: 'rain', bgm: 'bgm_rain', beat: 'calm', ambience: 'rain',
      cast: [{ id: 'ya', pos: 'center', expr: 'sleepy', outfit: 'casual', act: 'sit' }],
      speaker: 'narrator',
      text: '两点多的时候她去洗澡。我帮她收拾摊在床上的东西，一张挂号单从病历本里滑出来。\n日期是上个星期。',
      next: 'c9_032'
    },
    {
      id: 'c9_032', chapter: 9, tint: 'rain',
      cast: [{ id: 'jin', pos: 'right', expr: 'guilty', outfit: 'casual', act: 'sit' }],
      speaker: 'inner',
      text: '上面写着「慢性胃炎」，建议规律饮食、避免生冷。她一个字都没跟我提过。今天中午那杯冰的，是她自己非要买的；半夜说肚子不舒服，也只说没事，坐一会儿就好。',
      next: 'c9_033'
    },
    {
      id: 'c9_033', chapter: 9, tint: 'rain', beat: 'calm',
      cast: [
        { id: 'ya', pos: 'left', expr: 'neutral', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'soft', outfit: 'casual', act: 'reach' }
      ],
      speaker: 'jin',
      text: '水烧好了。\n你明天早上别喝凉的。我去买小米粥。\n……粥要热的。',
      next: 'c9_034'
    },
    {
      id: 'c9_034', chapter: 9, tint: 'rain', zoom: 'face',
      cast: [
        { id: 'ya', pos: 'left', expr: 'shy', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'soft', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'ya',
      text: '……你翻我包了？',
      next: 'c9_035'
    },
    {
      id: 'c9_035', chapter: 9, tint: 'rain',
      cast: [
        { id: 'ya', pos: 'left', expr: 'sad', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'soft', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'ya',
      text: '不是故意不告诉你。\n就是觉得……这种小事说出来，好像我在跟你要什么。',
      next: 'c9_036'
    },
    {
      id: 'c9_036', chapter: 9, tint: 'rain', beat: 'swell',
      cast: [
        { id: 'ya', pos: 'left', expr: 'smile', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'serious', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'jin',
      text: '以后这种事你必须说。\n我不太会看气氛。你不说，我就真的看不出来。\n……所以你得说。',
      effects: { trust: 4, affection: 2 },
      next: 'c9_037'
    },
    {
      id: 'c9_037', chapter: 9, tint: 'rain', zoom: 'bust',
      cast: [
        { id: 'ya', pos: 'left', expr: 'laugh', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'smile', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'ya',
      text: '知道了。那你也一样呀。\n你每次想说点什么，最后都只说半句——以为我看不出来吗。',
      next: 'c9_038'
    },
    {
      id: 'c9_038', chapter: 9, scene: 'hotel', tint: 'rain', bgm: 'bgm_quiet', beat: 'calm', ambience: 'rain',
      cast: [{ id: 'ya', pos: 'center', expr: 'sleepy', outfit: 'casual', act: 'sleepy' }],
      speaker: 'narrator',
      text: '她后来靠着枕头睡着了，呼吸很轻。我关掉电视，坐在窗边看外面的风雨。\n树被吹得弯下去又弹回来，像在跟谁较劲。',
      next: 'c9_039'
    },
    {
      id: 'c9_039', chapter: 9, tint: 'rain', zoom: 'bust',
      cast: [{ id: 'jin', pos: 'right', expr: 'soft', outfit: 'casual', act: 'sit' }],
      speaker: 'inner',
      text: '我想起她刚才说的「因祸得福」。这趟旅行我们哪儿都没去成，可我好像第一次这么清楚地知道，她难受的时候该怎么站在她旁边。虽然我还是笨，也还是只会泡热水。',
      next: 'c9_040'
    },
    {
      id: 'c9_040', chapter: 9, scene: 'hotel', tint: 'rain', bgm: 'bgm_quiet', beat: 'calm',
      cast: [{ id: 'jin', pos: 'right', expr: 'soft', outfit: 'casual', act: 'sit' }],
      speaker: 'narrator',
      text: '两点五十，我在台灯下抽出一张新的明信片。正面是一只蹲在窗台上的猫，耳朵压平了，一脸不高兴。\n笔帽咬了很久，才写了一行字。',
      next: 'c9_041'
    },
    {
      id: 'c9_041', chapter: 9, tint: 'rain', sfx: 'sfx_page',
      cast: [{ id: 'jin', pos: 'right', expr: 'soft', outfit: 'casual', act: 'reach' }],
      speaker: 'inner',
      text: '「我们在台风里，哪儿也没去。但我觉得这很好。——石头，2026 春，杭州」。写完我看了一眼她的背影。字很难看，可这句话我一句都不想改。',
      next: 'c9_042'
    },
    {
      id: 'c9_042', chapter: 9, tint: 'rain',
      cast: [{ id: 'jin', pos: 'right', expr: 'soft', outfit: 'casual', act: 'reach' }],
      speaker: 'narrator',
      text: '我把明信片放在她枕头边，压在手机下面。\n她翻身的时候头发盖住了边角。我伸手拨了一下，又赶紧收回来。',
      next: 'c9_043'
    },
    {
      id: 'c9_043', chapter: 9, tint: 'rain', beat: 'swell',
      cast: [
        { id: 'ya', pos: 'left', expr: 'smile', outfit: 'casual', act: 'sleepy' },
        { id: 'jin', pos: 'right', expr: 'soft', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'inner',
      text: '这是第五张猫猫明信片。\n前四张，一张在南阳的雪里，一张在苏州的展板下面，一张在她生日的蛋糕旁边，一张在上海的地铁上。\n我们说好了的：每次见面一张，谁都不许赖。',
      effects: { affection: 3, trust: 2, flags: { f_hotel_day: true } },
      next: 'c9_044'
    },
    {
      id: 'c9_044', chapter: 9, scene: 'hotel', tint: 'rain', bgm: 'bgm_warm', beat: 'swell',
      cast: [
        { id: 'ya', pos: 'left', expr: 'smile', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'smile', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'narrator', transition: 'slowfade',
      text: '第二天上午，雨真的小了一些。她坐在床边翻那张明信片，看完没说话，只是把它对折，夹进随身那本日历里。',
      next: 'c9_045'
    },
    {
      id: 'c9_045', chapter: 9, tint: 'rain', zoom: 'face',
      cast: [
        { id: 'ya', pos: 'left', expr: 'tease', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'smile', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'ya',
      text: '猫的尾巴你画太长了，像围巾。\n……不过我还是收了。第五张了哦。',
      next: 'c9_046'
    },
    {
      id: 'c9_046', chapter: 9, tint: 'rain', beat: 'pulse',
      cast: [
        { id: 'ya', pos: 'left', expr: 'excited', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'smile', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'ya',
      text: '对了，噩梦模式。趁着雨还没停，你要不要再试一次？\n就一次。我保证不生气。',
      next: 'c9_047'
    },
    {
      id: 'c9_047', chapter: 9, scene: 'hotel', tint: 'rain', bgm: 'bgm_game', beat: 'pulse',
      cast: [
        { id: 'ya', pos: 'left', expr: 'laugh', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'smile', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'narrator',
      text: '结果我们还是没过。她死在我前面三秒，然后在结算界面按下重开键，说：「看吧，我就说不生气。」我看着她笑，忽然觉得这个模式过不过去，好像已经不重要了。',
      effects: { affection: 3, flags: { f_brotato_nightmare: true } },
      next: 'c9_048'
    },
    {
      id: 'c9_048', chapter: 9, tint: 'rain', beat: 'swell',
      cast: [
        { id: 'ya', pos: 'left', expr: 'smile', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'soft', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'inner',
      text: '台风困了我们两天，把两个人留在了同一个房间里。\n我以前觉得旅行就是要去很多地方。现在觉得，只要第二天醒来她还在旁边翻行李箱，哪儿都没去也行。',
      next: 'c9_049'
    },
    {
      id: 'c9_049', chapter: 9, scene: 'airport', bgm: 'bgm_warm', beat: 'calm',
      cast: [
        { id: 'ya', pos: 'left', expr: 'smile', outfit: 'casual', act: 'idle' },
        { id: 'jin', pos: 'right', expr: 'smile', outfit: 'casual', act: 'idle' }
      ],
      titlecard: '下一个目的地 · 三亚',
      speaker: 'ya', transition: 'fade',
      text: '下一趟去三亚吧。我查过了，那边三十一度。\n而且我想住一次真正的海景房。就一晚，奢侈一次。',
      next: 'c9_049b'
    },
    {
      id: 'c9_049b', chapter: 9, scene: 'airport', bgm: 'bgm_travel', beat: 'calm',
      cast: [
        { id: 'ya', pos: 'left', expr: 'smile', outfit: 'casual', act: 'idle' },
        { id: 'jin', pos: 'right', expr: 'smile', outfit: 'casual', act: 'idle' }
      ],
      speaker: 'jin',
      text: '……好。七月吧，你考完试第二天就走。\n机票我来订，房间你挑——你说要正对海的那种，那就挑正对海的。',
      next: 'c9_049c'
    },
    {
      id: 'c9_049c', chapter: 9, beat: 'calm',
      cast: [{ id: 'jin', pos: 'center', expr: 'soft', outfit: 'casual', act: 'sit' }],
      speaker: 'inner',
      text: '回去以后，我把箱子提前一周收好了：两件短袖、一双能下水的鞋，还有她说想戴的那顶帽子。\n天气预报里从此多了一个城市，我一天开一次，看那排数字什么时候爬到三十度以上。',
      next: 'c9_049d'
    },
    {
      id: 'c9_049d', chapter: 9, scene: 'airport', tint: 'day', bgm: 'bgm_travel', beat: 'pulse',
      cast: [
        { id: 'ya', pos: 'left', expr: 'excited', outfit: 'casual', act: 'idle' },
        { id: 'jin', pos: 'right', expr: 'smile', outfit: 'casual', act: 'idle' }
      ],
      speaker: 'narrator',
      text: '出发那天早上，机场的空调冷得像另一个季节。她把外套塞进我包里，说落地就还她。\n飞机爬到云上面以后，舷窗外只剩一种蓝——我看了很久才反应过来，那是海。',
      next: 'c9_050'
    },

    /* ============================================================
     *  9-2  三亚（2026 夏）
     * ============================================================ */

    {
      id: 'c9_050', chapter: 9, scene: 'beach', tint: 'day', bgm: 'bgm_warm', beat: 'pulse', ambience: 'sea',
      cast: [
        { id: 'ya', pos: 'left', expr: 'excited', outfit: 'swim', act: 'idle' },
        { id: 'jin', pos: 'right', expr: 'awkward', outfit: 'swim', act: 'idle' }
      ],
      titlecard: '2026 · 夏  三亚', transition: 'slowfade',
      speaker: 'narrator',
      text: '三亚的第一天，阳光白得刺眼。沙子烫脚，海风里全是咸味。\n我们拖着两个箱子下了出租车，她一路小跑，去看那栋白色的楼。',
      next: 'c9_051'
    },
    {
      id: 'c9_051', chapter: 9, scene: 'beach', tint: 'day', ambience: 'sea',
      cast: [
        { id: 'ya', pos: 'left', expr: 'proud', outfit: 'swim', act: 'idle' },
        { id: 'jin', pos: 'right', expr: 'surprised', outfit: 'swim', act: 'idle' }
      ],
      speaker: 'ya',
      text: '就是这儿。落地窗，阳台，正对海。\n走，先上去看看。',
      next: 'c9_052'
    },
    {
      id: 'c9_052', chapter: 9, scene: 'hotel', tint: 'day',
      cast: [
        { id: 'ya', pos: 'left', expr: 'excited', outfit: 'swim', act: 'idle' },
        { id: 'jin', pos: 'right', expr: 'surprised', outfit: 'swim', act: 'idle' }
      ],
      speaker: 'narrator',
      text: '门一推开，就是一整面海的落地窗。她把包往床上一扔，冲到窗边，又回头喊我过去。\n我站在门口，先看了一会儿海，又看了一会儿她。',
      next: 'c9_053'
    },
    {
      id: 'c9_053', chapter: 9, scene: 'hotel', tint: 'day', zoom: 'bust',
      cast: [
        { id: 'ya', pos: 'left', expr: 'smile', outfit: 'swim', act: 'turn' },
        { id: 'jin', pos: 'right', expr: 'soft', outfit: 'swim', act: 'idle' }
      ],
      speaker: 'ya',
      text: '你站在那儿干嘛呀。过来。\n你看这个阳台——晚上可以坐在这儿听海。',
      next: 'c9_054'
    },
    {
      id: 'c9_054', chapter: 9, scene: 'hotel', tint: 'day',
      cast: [{ id: 'jin', pos: 'right', expr: 'guilty', outfit: 'swim', act: 'idle' }],
      speaker: 'inner',
      text: '我下意识想问一句这个要不要花很多钱。她大概看出了我要问什么，先开口堵了回来：是我攒的，不关你的事。她这个人，最怕别人替她心疼钱。',
      next: 'c9_055'
    },
    {
      id: 'c9_055', chapter: 9, scene: 'hotel', tint: 'day', bgm: 'bgm_warm', beat: 'calm',
      cast: [
        { id: 'ya', pos: 'left', expr: 'excited', outfit: 'swim', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'smile', outfit: 'swim', act: 'sit' }
      ],
      speaker: 'ya',
      text: '行程我排好了：下午去海边散步，晚上吃海鲜，再晚一点去吃那边人带路的烧烤。\n今天你要听我的。',
      next: 'c9_056'
    },
    {
      id: 'c9_056', chapter: 9, scene: 'hotel', tint: 'day',
      cast: [
        { id: 'ya', pos: 'left', expr: 'tease', outfit: 'swim', act: 'reach' },
        { id: 'jin', pos: 'right', expr: 'blank', outfit: 'swim', act: 'idle' }
      ],
      speaker: 'ya',
      text: '等会儿先别出门。\n你坐下，手给我。',
      next: 'c9_057'
    },
    {
      id: 'c9_057', chapter: 9, scene: 'hotel', tint: 'day', bgm: 'bgm_game', beat: 'pulse', zoom: 'hand', hand:'butterfly_nails',
      cast: [
        { id: 'ya', pos: 'left', expr: 'smile', outfit: 'casual', act: 'reach' },
        { id: 'jin', pos: 'right', expr: 'awkward', outfit: 'nails', act: 'sit' }
      ],
      speaker: 'narrator',
      text: '她从化妆包里掏出一个小盒子，里面是十几片穿戴甲：全粉的底，每片甲面上都停着一只小蝴蝶，翅膀一只朝左一只朝右。\n和上次那回不一样——这次一整套都是同一个颜色，从指甲根粉到指尖。她说来之前就挑好了，就等这趟。她把我的手放到她膝盖上，一片一片比过去。',
      next: 'c9_058'
    },
    {
      id: 'c9_058', chapter: 9, zoom: 'hand', hand:'butterfly_nails',
      cast: [
        { id: 'ya', pos: 'left', expr: 'serious', outfit: 'casual', act: 'reach' },
        { id: 'jin', pos: 'right', expr: 'awkward', outfit: 'nails', act: 'sit' }
      ],
      speaker: 'ya',
      text: '别动。\n你指甲形状其实很好看，就是太短了。这个不伤甲，洗澡前取下来就行。',
      next: 'c9_059'
    },
    {
      id: 'c9_059', chapter: 9, zoom: 'hand', hand:'butterfly_nails',
      cast: [
        { id: 'ya', pos: 'left', expr: 'proud', outfit: 'casual', act: 'reach' },
        { id: 'jin', pos: 'right', expr: 'shy', outfit: 'nails', act: 'sit' }
      ],
      speaker: 'narrator',
      text: '她先在自己手上贴了一片，对着光看了看，又揭下来。然后开始贴我的手：先比大小，再抹胶，一片一片压平。\n十几片贴完，她低头看了两次，把边上有点翘的那一片按了又按。',
      next: 'c9_060'
    },
    {
      id: 'c9_060', chapter: 9, zoom: 'hand', hand:'butterfly_nails',
      cast: [
        { id: 'ya', pos: 'left', expr: 'excited', outfit: 'casual', act: 'reach' },
        { id: 'jin', pos: 'right', expr: 'blank', outfit: 'nails', act: 'sit' }
      ],
      speaker: 'ya',
      text: '好了。你抬手看看。\n……真的好看。比我的手好看。我就说这个粉色适合你。',
      next: 'c9_061'
    },
    {
      id: 'c9_061', chapter: 9, zoom: 'hand', hand:'butterfly_nails',
      cast: [
        { id: 'ya', pos: 'left', expr: 'smile', outfit: 'casual', act: 'reach' },
        { id: 'jin', pos: 'right', expr: 'shy', outfit: 'nails', act: 'sit' }
      ],
      speaker: 'narrator',
      text: '我把手举到窗边的光里。粉得很干净，每片甲面上那只小蝴蝶都贴着甲缘。那一瞬间我有点恍惚——光里的那只手，安静又温柔，像另一个人的生活。',
      next: 'c9_062'
    },
    {
      id: 'c9_062', chapter: 9, zoom: 'face',
      cast: [
        { id: 'ya', pos: 'left', expr: 'tease', outfit: 'casual', act: 'reach' },
        { id: 'jin', pos: 'right', expr: 'shy', outfit: 'nails', act: 'sit' }
      ],
      speaker: 'inner',
      text: '我其实很喜欢。不是因为这些粉色的小蝴蝶——是因为那十几片是她一片一片给我压上去的。可我脑子里立刻跳出一句话：你是男生。这句话不是她说的，是我从小听到大的。于是我把它咽下去，换了一句安全的。',
      next: 'c9_063'
    },
    {
      id: 'c9_063', chapter: 9, zoom: 'hand', hand:'butterfly_nails',
      cast: [
        { id: 'ya', pos: 'left', expr: 'smile', outfit: 'casual', act: 'reach' },
        { id: 'jin', pos: 'right', expr: 'awkward', outfit: 'nails', act: 'sit' }
      ],
      speaker: 'jin',
      text: '……好看是好看。\n就是有点影响打游戏。按键的时候会硌。\n……真的，你别多想。',
      next: 'c9_064'
    },
    {
      id: 'c9_064', chapter: 9, zoom: 'face',
      cast: [
        { id: 'ya', pos: 'left', expr: 'smile', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'awkward', outfit: 'nails', act: 'sit' }
      ],
      speaker: 'ya',
      text: '哦——说的是打游戏啊。\n（她把胶盖拧上，耳尖有点红）那我给你留着。你什么时候想贴就贴。',
      next: 'c9_065'
    },
    {
      id: 'c9_065', zoom:'hand', hand:'butterfly_nails', chapter: 9,
      cast: [{ id: 'jin', pos: 'right', expr: 'guilty', outfit: 'nails', act: 'sit' }],
      speaker: 'inner',
      text: '她「哦」的那一声拖得很长。我没敢看她——我怕她早听懂了：我嘴上说硌，眼睛却一直粘在自己手上。她什么都没揭穿，我反而更想找个地缝钻进去。',
      next: 'c9_choice_nails'
    },
    {
      id: 'c9_choice_nails', chapter: 9, scene: 'hotel', tint: 'day', bgm: 'bgm_game', beat: 'pulse', zoom: 'hand', hand:'butterfly_nails',
      cast: [
        { id: 'ya', pos: 'left', expr: 'smile', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'awkward', outfit: 'nails', act: 'sit' }
      ],
      speaker: 'jin',
      text: '……这个，要一直贴着吗？\n……也不是不行。',
      next: 'c9_ch17_a1',
      choices: [
        { text: '取下来，装回盒子里', hint: '（打游戏确实不方便，我安慰自己）', effects: { affection: 1, trust: -2, courage: -4 }, next: 'c9_ch17_a1' },
        { text: '一直戴着，反正也就这几天', hint: '（我有点舍不得）', effects: { affection: 3, courage: 2, flags: { f_stickon_nails: true } }, next: 'c9_ch17_b1' },
        { text: '「其实我挺喜欢的。」', hint: '（把心里那句话说出来）', effects: { courage: 8, trust: 5, affection: 4, flags: { f_stickon_nails: true } }, next: 'c9_ch17_c1' }
      ]
    },

    /* —— 选项⑰ 分支 A：取下来 —— */
    {
      id: 'c9_ch17_a1', chapter: 9, scene: 'hotel', tint: 'day', beat: 'calm', zoom: 'hand', hand:'butterfly_nails',
      cast: [
        { id: 'ya', pos: 'left', expr: 'neutral', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'guilty', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'narrator',
      text: '下午她睡了一觉。我坐在阳台上，一片一片把它们揭下来，收进盒子，又把盒子压进行李箱最底下。手上还留着一股胶的味道。',
      next: 'c9_ch17_a2'
    },
    {
      id: 'c9_ch17_a2', chapter: 9,
      cast: [{ id: 'jin', pos: 'right', expr: 'guilty', outfit: 'casual', act: 'sit' }],
      speaker: 'inner',
      text: '我跟自己说是打游戏不方便。其实不是。我是怕被人看见，怕有人问一句「你一个男生戴这个干嘛」。\n可揭完那一刻，我盯着空掉的指甲，心里塌了一小块。',
      next: 'c9_ch17_a3'
    },
    {
      id: 'c9_ch17_a3', chapter: 9, scene: 'hotel', tint: 'dusk', zoom: 'face',
      cast: [
        { id: 'ya', pos: 'left', expr: 'smile', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'awkward', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'ya',
      text: '取下来了？……我知道。你在阳台上坐了好久，我没睡着。',
      next: 'c9_ch17_a4'
    },
    {
      id: 'c9_ch17_a4', chapter: 9, scene: 'hotel', tint: 'dusk',
      cast: [
        { id: 'ya', pos: 'left', expr: 'smile', outfit: 'casual', act: 'reach' },
        { id: 'jin', pos: 'right', expr: 'shy', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'ya',
      text: '盒子我放回你包里了。想贴就贴，不用跟我讲理由。',
      effects: { affection: 1, trust: 1 },
      next: 'c9_065b'
    },

    /* —— 选项⑰ 分支 B：一直戴着 —— */
    {
      id: 'c9_ch17_b1', zoom:'hand', hand:'butterfly_nails', chapter: 9, scene: 'beach', tint: 'day', beat: 'pulse', ambience: 'sea',
      cast: [
        { id: 'ya', pos: 'left', expr: 'laugh', outfit: 'swim', act: 'idle' },
        { id: 'jin', pos: 'right', expr: 'awkward', outfit: 'nails', act: 'idle' }
      ],
      speaker: 'narrator',
      text: '我戴着它们出了门。海边买了两个椰青，摊主找零钱的时候多看了我的手两眼，我下意识把手指蜷起来，转头假装在看海。',
      next: 'c9_ch17_b2'
    },
    {
      id: 'c9_ch17_b2', chapter: 9, zoom: 'hand', hand:'butterfly_nails',
      cast: [
        { id: 'ya', pos: 'left', expr: 'tease', outfit: 'swim', act: 'reach' },
        { id: 'jin', pos: 'right', expr: 'shy', outfit: 'nails', act: 'idle' }
      ],
      speaker: 'ya',
      text: '你刚才把手藏起来了。别藏，好看的东西不丢人。……你要是真害羞，就只贴这只——我天天看得见。',
      next: 'c9_ch17_b3'
    },
    {
      id: 'c9_ch17_b3', chapter: 9,
      cast: [{ id: 'jin', pos: 'right', expr: 'shy', outfit: 'nails', act: 'idle' }],
      speaker: 'inner',
      text: '那天下午我一路把左手插在口袋里，只留右手在外面。手上一片都没揭。\n晚上回到酒店，我对着洗手台的镜子看了很久，看到自己都不好意思了，才把水关上。\n原来「喜欢」两个字，说出来还是这么费劲。',
      effects: { affection: 1 },
      next: 'c9_065b'
    },

    /* —— 选项⑰ 分支 C：说出来 —— */
    {
      id: 'c9_ch17_c1', chapter: 9, scene: 'hotel', tint: 'day', bgm: 'bgm_warm', beat: 'swell', zoom: 'face',
      cast: [
        { id: 'ya', pos: 'left', expr: 'surprised', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'shy', outfit: 'nails', act: 'sit' }
      ],
      speaker: 'jin',
      text: '……其实。\n其实我挺喜欢的。刚才那句打游戏，是骗你的。\n……你别笑。',
      next: 'c9_ch17_c2'
    },
    {
      id: 'c9_ch17_c2', chapter: 9, zoom: 'bust', transition: 'slowfade',
      cast: [
        { id: 'ya', pos: 'left', expr: 'laugh', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'shy', outfit: 'nails', act: 'sit' }
      ],
      speaker: 'ya',
      text: '哈。我就知道。你刚才照着自己的手照了半分钟——打游戏的人不那样看手。',
      next: 'c9_ch17_c3'
    },
    {
      id: 'c9_ch17_c3', chapter: 9, zoom: 'face',
      cast: [
        { id: 'ya', pos: 'left', expr: 'smile', outfit: 'casual', act: 'reach' },
        { id: 'jin', pos: 'right', expr: 'moved', outfit: 'nails', act: 'sit' }
      ],
      speaker: 'ya',
      text: '这有什么好藏的。你喜欢可爱的东西，喜欢美甲，喜欢小裙子——又不是错。再说这次是我给你贴的，你喜欢，我高兴。',
      next: 'c9_ch17_c4'
    },
    {
      id: 'c9_ch17_c4', chapter: 9, zoom: 'bust',
      cast: [{ id: 'jin', pos: 'right', expr: 'moved', outfit: 'nails', act: 'sit' }],
      speaker: 'inner',
      text: '她说得很轻，像在说今天几度。我的耳朵烧得厉害，眼眶也跟着热。\n活了二十多年，我头一回觉得，「喜欢」两个字不用先交一份解释。',
      effects: { trust: 2 },
      next: 'c9_065b'
    },

    /* —— 汇合：小裙子（只是提一句，这次见面并没有穿） —— */
    {
      id: 'c9_065b', chapter: 9, scene: 'hotel', tint: 'dusk', bgm: 'bgm_game', beat: 'pulse',
      cast: [
        { id: 'ya', pos: 'left', expr: 'tease', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'blank', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'ya',
      text: '对了。你半夜跟我说的那句——想试试 JK 小裙子，你自己记不记得？',
      next: 'c9_066'
    },
    {
      id: 'c9_066', chapter: 9, zoom: 'face',
      cast: [
        { id: 'ya', pos: 'left', expr: 'smile', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'panic', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'jin',
      text: '……那是半夜说的。\n半夜说的不算啊。',
      next: 'c9_067'
    },
    {
      id: 'c9_067', chapter: 9, scene: 'hotel', tint: 'dusk', cg: 'cg_jk', transition: 'slowfade',
      cast: [
        { id: 'ya', pos: 'left', expr: 'laugh', outfit: 'casual', act: 'reach' },
        { id: 'jin', pos: 'right', expr: 'shy', outfit: 'casual', act: 'shy_hide' }
      ],
      speaker: 'narrator',
      text: '她把手机转过来，屏幕上是商场橱窗里的一排裙子，浅蓝色的那条挂在最中间。她说她路过的时候随手拍的，就想给我看看。',
      next: 'c9_068'
    },
    {
      id: 'c9_068', chapter: 9, scene: 'hotel', tint: 'dusk',
      cast: [{ id: 'jin', pos: 'right', expr: 'panic', outfit: 'casual', act: 'shy_hide' }],
      speaker: 'inner',
      text: '我盯着那张照片看了十几秒。脑子里已经开始给自己量尺寸了——肩宽、裙长、腰到哪里。这个念头冒出来的时候我自己吓了一跳，赶紧把手机推回去，像被烫了一下。',
      next: 'c9_069'
    },
    {
      id: 'c9_069', chapter: 9, scene: 'hotel', tint: 'dusk', cg: 'cg_jk', zoom: 'bust',
      cast: [
        { id: 'ya', pos: 'left', expr: 'laugh', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'shy', outfit: 'casual', act: 'turn' }
      ],
      speaker: 'narrator',
      text: '她笑得整个人往后倒在床上，说「你刚才看了好久哦」。我耳朵烫得厉害，只能低头盯着地板上的花纹。',
      next: 'c9_070'
    },
    {
      id: 'c9_070', chapter: 9, cg: 'cg_jk',
      cast: [
        { id: 'ya', pos: 'left', expr: 'excited', outfit: 'casual', act: 'reach' },
        { id: 'jin', pos: 'right', expr: 'awkward', outfit: 'casual', act: 'turn' }
      ],
      speaker: 'ya',
      text: '我没买。你什么时候想试，我们一起去。那裙子你穿，腿肯定比我好看——我有点不服，真的。',
      next: 'c9_071'
    },
    {
      id: 'c9_071', chapter: 9, zoom: 'face',
      cast: [
        { id: 'ya', pos: 'left', expr: 'smile', outfit: 'casual', act: 'reach' },
        { id: 'jin', pos: 'right', expr: 'shy', outfit: 'casual', act: 'shy_hide' }
      ],
      speaker: 'inner',
      text: '我不知道怎么接。今天早上她说要给我贴甲，我也是这么糊过去的。这两件事我其实在心里都点头了，嘴上一个字没松。\n我明明不是不想。',
      next: 'c9_072'
    },
    {
      id: 'c9_072', chapter: 9, scene: 'hotel', tint: 'night', cg: 'cg_jk', bgm: 'bgm_warm', beat: 'swell',
      cast: [
        { id: 'ya', pos: 'left', expr: 'smile', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'shy', outfit: 'casual', act: 'shy_hide' }
      ],
      speaker: 'ya',
      text: '你慢慢来，我不催你。反正我记性比你好——你哪天漏过一句什么，我都替你记着。',
      next: 'c9_073'
    },
    {
      id: 'c9_073', chapter: 9, zoom: 'face',
      cast: [
        { id: 'ya', pos: 'left', expr: 'smile', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'soft', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'jin',
      text: '……那下次。\n下次你陪我一起去。\n……说好了。',
      next: 'c9_074'
    },
    {
      id: 'c9_074', chapter: 9, scene: 'hotel', tint: 'night', beat: 'swell', transition: 'slowfade',
      cast: [{ id: 'jin', pos: 'right', expr: 'soft', outfit: 'casual', act: 'sit' }],
      speaker: 'inner',
      text: '说完那半句，房间里静了两秒。她没笑我，把那张照片又调出来，放大，说就这条，别忘了。\n……就这条。我记住了。',
      effects: { affection: 4, trust: 3, courage: 2, flags: { f_jk_skirt: true } },
      next: 'c9_075'
    },
    {
      id: 'c9_075', chapter: 9, scene: 'hotel', tint: 'night', bgm: 'bgm_game', beat: 'calm',
      cast: [
        { id: 'ya', pos: 'left', expr: 'excited', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'smile', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'ya',
      text: '明天我约了化妆师，早上九点半，在房间里化。你负责给我拍照——拍得好看一点。\n今天你乖乖坐着让我贴了一整套甲，明天换我坐那儿，你在旁边看着。',
      next: 'c9_076'
    },
    {
      id: 'c9_076', chapter: 9, scene: 'hotel', tint: 'day', bgm: 'bgm_game', beat: 'pulse',
      cast: [
        { id: 'ya', pos: 'left', expr: 'smile', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'neutral', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'narrator',
      text: '第二天九点半，化妆师准时敲门，在落地窗旁边支起一面灯。她坐好，闭眼，头发被一缕一缕别上去。我坐在沙发上，看那面镜子里慢慢长出另一个人——昨天是我坐在椅子上让她贴甲，今天轮到我看她。',
      next: 'c9_077'
    },
    {
      id: 'c9_077', chapter: 9, zoom: 'face',
      cast: [
        { id: 'ya', pos: 'left', expr: 'shy', outfit: 'dress', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'surprised', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'narrator',
      text: '眼线画完，她睁开眼，先看我。我没反应过来，愣了两秒才点头。她又转过去看镜子，看了很久，嘴角一点点扬起来。',
      next: 'c9_078'
    },
    {
      id: 'c9_078', chapter: 9, zoom: 'face',
      cast: [
        { id: 'ya', pos: 'left', expr: 'excited', outfit: 'dress', act: 'turn' },
        { id: 'jin', pos: 'right', expr: 'blank', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'ya',
      text: '怎么样？你说话呀。你就不能认认真真夸我一次吗。',
      next: 'c9_079'
    },
    {
      id: 'c9_079', chapter: 9,
      cast: [{ id: 'jin', pos: 'right', expr: 'smile', outfit: 'casual', act: 'sit' }],
      speaker: 'jin',
      text: '……挺好的。\n我找不出别的词。可这是真的。',
      next: 'c9_080'
    },
    {
      id: 'c9_080', chapter: 9,
      cast: [{ id: 'jin', pos: 'right', expr: 'guilty', outfit: 'casual', act: 'sit' }],
      speaker: 'inner',
      text: '我心里那句话是：你今天特别好看，好看得我想让这间房晚一点暗。\n我偏偏是个古板的人。满肚子的话走到嘴边，就剩「挺好的」三个字。',
      next: 'c9_081'
    },
    {
      id: 'c9_081', chapter: 9, scene: 'hotel', tint: 'day', sfx: 'sfx_camera',
      cast: [
        { id: 'ya', pos: 'left', expr: 'smile', outfit: 'dress', act: 'reach' },
        { id: 'jin', pos: 'right', expr: 'neutral', outfit: 'casual', act: 'reach' }
      ],
      speaker: 'ya',
      text: '算了。手机给你，你站到窗边来。你蹲一点，把海平线放在我头顶上。',
      next: 'c9_082'
    },
    {
      id: 'c9_082', chapter: 9, scene: 'hotel', tint: 'day', sfx: 'sfx_camera',
      cast: [{ id: 'jin', pos: 'right', expr: 'awkward', outfit: 'casual', act: 'reach' }],
      speaker: 'narrator',
      text: '我接了手机，蹲下，站起来，又退了两步。拍了二十几张：地板占半张的，把她拦腰切成两半的，还有一张背后进了走廊的路人。',
      next: 'c9_083'
    },
    {
      id: 'c9_083', chapter: 9, zoom: 'face',
      cast: [
        { id: 'ya', pos: 'left', expr: 'pout', outfit: 'dress', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'awkward', outfit: 'casual', act: 'reach' }
      ],
      speaker: 'narrator',
      text: '她一张一张翻。翻得越来越慢。翻到我拍糊的那张——她笑得最好看的那张——她停了一下，又往下翻。嘴角一点点掉了下去。',
      next: 'c9_084'
    },
    {
      id: 'c9_084', chapter: 9, zoom: 'face',
      cast: [
        { id: 'ya', pos: 'left', expr: 'sad', outfit: 'dress', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'awkward', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'jin',
      text: '……这张还行吧。\n你本来也好看，怎么拍都好看。',
      next: 'c9_085'
    },
    {
      id: 'c9_085', chapter: 9, bgm: 'bgm_tension', beat: 'drop', transition: 'slowfade',
      cast: [
        { id: 'ya', pos: 'left', expr: 'sad', outfit: 'dress', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'guilty', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'ya',
      text: '你是在拍风景，还是在拍我？我化了妆坐这儿，等你拍了半个小时。',
      next: 'c9_086'
    },
    {
      id: 'c9_086', chapter: 9, beat: 'drop',
      cast: [{ id: 'jin', pos: 'right', expr: 'guilty', outfit: 'casual', act: 'sit' }],
      speaker: 'inner',
      text: '我第一反应是解释：我不太会用手机、光是逆的、我又不是摄影师。\n可我知道，这些话说出口她就更难过。她要的从来不是一张能拿出去的照片。',
      next: 'c9_087'
    },
    {
      id: 'c9_087', chapter: 9, scene: 'hotel', tint: 'day', beat: 'drop',
      cast: [
        { id: 'ya', pos: 'left', expr: 'cry', outfit: 'dress', act: 'turn' },
        { id: 'jin', pos: 'right', expr: 'guilty', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'ya',
      text: '……算了。不拍了。',
      next: 'c9_088'
    },
    {
      id: 'c9_088', chapter: 9, scene: 'hotel', tint: 'dusk', bgm: 'bgm_tension', beat: 'drop',
      cast: [{ id: 'jin', pos: 'center', expr: 'guilty', outfit: 'casual', act: 'sit' }],
      speaker: 'narrator',
      text: '她把手机按在腿上，转头去看那面落地窗。我坐在床沿，屏幕还亮着，相册停在最后那张糊掉的照片上。谁都没出去，谁都没再开口。',
      next: 'c9_088b'
    },
    {
      id: 'c9_088b', chapter: 9, scene: 'hotel', tint: 'dusk', beat: 'drop',
      cast: [{ id: 'jin', pos: 'center', expr: 'guilty', outfit: 'casual', act: 'sit' }],
      speaker: 'narrator',
      text: '窗外有艘船慢慢挪过去，白色的航迹拉得很长。房间里只有空调的风声，和她呼吸里偶尔那一下很轻的抽气。我数着时间。十几分钟，谁都没动。',
      next: 'c9_089'
    },
    {
      id: 'c9_089', chapter: 9, beat: 'drop',
      cast: [{ id: 'jin', pos: 'center', expr: 'guilty', outfit: 'casual', act: 'sit' }],
      speaker: 'inner',
      text: '我一直以为自己够努力了——跨城、赶飞机、每天等她消息。\n可今天我在这儿坐了三个小时，连她想要的那个样子都没看清。我搞砸了。而且我很清楚我砸在哪里。',
      next: 'c9_090'
    },
    {
      id: 'c9_090', chapter: 9, scene: 'hotel', tint: 'dusk', bgm: 'bgm_hope', beat: 'swell', transition: 'slowfade',
      cast: [
        { id: 'ya', pos: 'left', expr: 'neutral', outfit: 'dress', act: 'idle' },
        { id: 'jin', pos: 'right', expr: 'guilty', outfit: 'casual', act: 'idle' }
      ],
      speaker: 'narrator',
      text: '后来是她先动的。她把手机放下，挪过来坐在床边，离我半米。窗帘没拉，外面那片海已经开始变暗。她看了我一会儿，先开的口。',
      next: 'c9_091'
    },
    {
      id: 'c9_091', chapter: 9, zoom: 'face',
      cast: [
        { id: 'ya', pos: 'left', expr: 'sad', outfit: 'dress', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'guilty', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'ya',
      text: '刚才那十几分钟，我一直在想你会不会先说话。我不是气你拍得难看。我是觉得，我化了妆坐在这儿，你好像没有认真看我。',
      next: 'c9_092'
    },
    {
      id: 'c9_092', chapter: 9, zoom: 'face',
      cast: [
        { id: 'ya', pos: 'left', expr: 'cry', outfit: 'dress', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'moved', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'ya',
      text: '我不要什么大片。我就是想让你多看我一眼。你懂不懂啊。',
      next: 'c9_choice_photo'
    },
    {
      id: 'c9_choice_photo', chapter: 9, scene: 'hotel', tint: 'dusk', bgm: 'bgm_tension', beat: 'drop',
      cast: [
        { id: 'ya', pos: 'left', expr: 'cry', outfit: 'dress', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'guilty', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'jin',
      text: '……你先说。我听着。\n这次我不打断你。',
      next: 'c9_ch18_a1',
      choices: [
        { text: '先道歉，不解释：「对不起，是我没有认真看你。」', hint: '（不要讲道理）', effects: { trust: 6, affection: 3, courage: 3, flags: { f_apologized: true, f_photo_conflict: true } }, next: 'c9_ch18_a1' },
        { text: '讲道理：「我本来就不太会拍，你也知道……」', hint: '（我觉得自己没错）', effects: { trust: -3, affection: -2, flags: { f_photo_conflict: true } }, next: 'c9_ch18_b1' },
        { text: '不说话，低着头等她说完', hint: '（我不知道说什么才不惹她生气）', effects: { trust: -4, courage: -3, flags: { f_photo_conflict: true } }, next: 'c9_ch18_c1' }
      ]
    },

    /* —— 选项⑱ 分支 A：道歉 —— */
    {
      id: 'c9_ch18_a1', chapter: 9, scene: 'hotel', tint: 'dusk', bgm: 'bgm_hope', beat: 'swell', zoom: 'face', transition: 'slowfade',
      cast: [
        { id: 'ya', pos: 'left', expr: 'surprised', outfit: 'dress', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'moved', outfit: 'casual', act: 'reach' }
      ],
      speaker: 'jin',
      text: '对不起。不是照片的事。\n是我从早上到现在，都没认真看过你一眼。',
      next: 'c9_ch18_a2'
    },
    {
      id: 'c9_ch18_a2', chapter: 9, zoom: 'face',
      cast: [
        { id: 'ya', pos: 'left', expr: 'cry', outfit: 'dress', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'moved', outfit: 'casual', act: 'reach' }
      ],
      speaker: 'jin',
      text: '你今天很好看。这句话我在心里说了一整天——就是没说出来。我这个人……你也知道，我总把话咽回去半句，然后当成自己说过了。',
      next: 'c9_ch18_a3'
    },
    {
      id: 'c9_ch18_a3', chapter: 9, zoom: 'bust',
      cast: [
        { id: 'ya', pos: 'left', expr: 'cry', outfit: 'dress', act: 'reach' },
        { id: 'jin', pos: 'right', expr: 'soft', outfit: 'casual', act: 'reach' }
      ],
      speaker: 'narrator',
      text: '她低下头，肩膀抖了一下。我把她抱过来，她整张脸埋在我肩上，妆蹭了我一领子。窗外的光一点点变红，海在那面窗里慢慢暗下去。',
      next: 'c9_ch18_a4'
    },
    {
      id: 'c9_ch18_a4', chapter: 9, zoom: 'face',
      cast: [
        { id: 'ya', pos: 'left', expr: 'smile', outfit: 'dress', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'soft', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'ya',
      text: '……那你明天重新拍。这次我教你怎么拍，你先学会看我。',
      next: 'c9_093'
    },

    /* —— 选项⑱ 分支 B：讲道理 —— */
    {
      id: 'c9_ch18_b1', chapter: 9, scene: 'hotel', tint: 'dusk', bgm: 'bgm_tension', beat: 'drop',
      cast: [
        { id: 'ya', pos: 'left', expr: 'sad', outfit: 'dress', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'guilty', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'jin',
      text: '我本来就不太会拍照。房间的光是逆的，手机镜头也就这样——我不是不愿意。',
      next: 'c9_ch18_b2'
    },
    {
      id: 'c9_ch18_b2', chapter: 9, zoom: 'face',
      cast: [
        { id: 'ya', pos: 'left', expr: 'sad', outfit: 'dress', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'guilty', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'ya',
      text: '你看，你又来了。我话还没说完，你就先讲上道理了。我要的是照片吗？',
      next: 'c9_ch18_b3'
    },
    {
      id: 'c9_ch18_b3', chapter: 9,
      cast: [{ id: 'jin', pos: 'right', expr: 'guilty', outfit: 'casual', act: 'sit' }],
      speaker: 'inner',
      text: '我说完第三秒就后悔了。\n她说得一点没错：我又拿讲道理把她的情绪挡回去了。明明去年在苏州就是这么吵起来的，我记得清清楚楚，还是照做了一遍。',
      next: 'c9_ch18_b4'
    },
    {
      id: 'c9_ch18_b4', chapter: 9, scene: 'hotel', tint: 'dusk', bgm: 'bgm_hope', beat: 'swell', zoom: 'face',
      cast: [
        { id: 'ya', pos: 'left', expr: 'sad', outfit: 'dress', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'moved', outfit: 'casual', act: 'reach' }
      ],
      speaker: 'narrator',
      text: '她没走。她坐在那儿，等我把话说完，然后深吸了一口气，自己接了下去。',
      next: 'c9_ch18_b5'
    },
    {
      id: 'c9_ch18_b5', chapter: 9, zoom: 'face',
      cast: [
        { id: 'ya', pos: 'left', expr: 'serious', outfit: 'dress', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'moved', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'ya',
      text: '我不要什么大片。我就是想让你多看我一眼。你别急着解释，你先听我说完。',
      next: 'c9_ch18_b6'
    },
    {
      id: 'c9_ch18_b6', chapter: 9, zoom: 'face',
      cast: [
        { id: 'ya', pos: 'left', expr: 'sad', outfit: 'dress', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'guilty', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'jin',
      text: '……嗯。我听着。\n对不起——我又讲道理了。',
      next: 'c9_093'
    },

    /* —— 选项⑱ 分支 C：逃避 —— */
    {
      id: 'c9_ch18_c1', chapter: 9, scene: 'hotel', tint: 'night', bgm: 'bgm_tension', beat: 'drop',
      cast: [
        { id: 'ya', pos: 'left', expr: 'sad', outfit: 'dress', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'guilty', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'narrator',
      text: '我低着头，一个字也说不出来。房间安静了很久，久到我能听见她呼吸里那点抖。',
      next: 'c9_ch18_c2'
    },
    {
      id: 'c9_ch18_c2', chapter: 9,
      cast: [{ id: 'jin', pos: 'right', expr: 'guilty', outfit: 'casual', act: 'sit' }],
      speaker: 'inner',
      text: '我怕开口就说错，所以干脆不说。这个选择我做过很多次了，每一次结果都一样：她等不到我，只好自己走开。然后我把这件事记很久。\n今天我又选了它。',
      next: 'c9_ch18_c3'
    },
    {
      id: 'c9_ch18_c3', chapter: 9, scene: 'hotel', tint: 'night', bgm: 'bgm_hope', beat: 'swell', zoom: 'face', transition: 'slowfade',
      cast: [
        { id: 'ya', pos: 'left', expr: 'sad', outfit: 'dress', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'guilty', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'ya',
      text: '你又不说话。……算了，我不逼你。我就是想让你知道我不开心——你知道，就够了。',
      next: 'c9_ch18_c4'
    },
    {
      id: 'c9_ch18_c4', chapter: 9, zoom: 'face',
      cast: [
        { id: 'ya', pos: 'left', expr: 'sad', outfit: 'dress', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'moved', outfit: 'casual', act: 'reach' }
      ],
      speaker: 'jin',
      text: '……我知道。\n……对不起。',
      next: 'c9_093'
    },

    /* —— 汇合：和解 —— */
    {
      id: 'c9_093', chapter: 9, scene: 'hotel', tint: 'night', bgm: 'bgm_hope', beat: 'swell', zoom: 'face',
      cast: [
        { id: 'ya', pos: 'left', expr: 'smile', outfit: 'dress', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'soft', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'inner',
      text: '我原来以为「拍照」只是她今天顺手出的一道题。现在才明白，那是她在问我一句话：你到底有没有看见我。我答得很烂。……可她没把卷子收走，还坐在原地等我。',
      next: 'c9_094'
    },
    {
      id: 'c9_094', chapter: 9, zoom: 'bust',
      cast: [
        { id: 'ya', pos: 'left', expr: 'shy', outfit: 'dress', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'soft', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'ya',
      text: '其实我也不该晾你那么久的。那十几分钟我一直在数，数你会不会先开口。……你别笑，我就是想听你先说。',
      next: 'c9_095'
    },
    {
      id: 'c9_095', chapter: 9, zoom: 'face',
      cast: [
        { id: 'ya', pos: 'left', expr: 'smile', outfit: 'dress', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'soft', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'jin',
      text: '下次我先开口。\n……这次是我。对不起。\n……真的对不起。',
      next: 'c9_096'
    },
    {
      id: 'c9_096', chapter: 9, scene: 'hotel', tint: 'night', beat: 'swell',
      cast: [
        { id: 'ya', pos: 'left', expr: 'laugh', outfit: 'dress', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'smile', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'ya',
      text: '那你现在把手机拿出来。我教你。第一，不许俯拍，我头顶又不是海。第二，说好看的时候，你得看着我眼睛说。',
      effects: { affection: 3, trust: 2 },
      next: 'c9_097'
    },
    {
      id: 'c9_097', chapter: 9, scene: 'hotel', tint: 'night', sfx: 'sfx_camera', bgm: 'bgm_warm', beat: 'calm',
      cast: [
        { id: 'ya', pos: 'left', expr: 'smile', outfit: 'dress', act: 'turn' },
        { id: 'jin', pos: 'right', expr: 'smile', outfit: 'casual', act: 'reach' }
      ],
      speaker: 'narrator',
      text: '我们重新拍了一组。她站在窗前面，背后是黑下去的海和几点船灯。这一次我蹲下去，把海平线放在她头顶——放好之后我没立刻按快门，先看了她一会儿。',
      next: 'c9_098'
    },
    {
      id: 'c9_098', chapter: 9, zoom: 'face',
      cast: [
        { id: 'ya', pos: 'left', expr: 'shy', outfit: 'dress', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'soft', outfit: 'casual', act: 'reach' }
      ],
      speaker: 'narrator',
      text: '那张后来成了我的锁屏。不是因为拍得多好，是因为按下去之前，我真的看了她一眼。',
      next: 'c9_099'
    },
    {
      id: 'c9_099', chapter: 9, scene: 'beach', tint: 'day', bgm: 'bgm_warm', beat: 'pulse', ambience: 'sea',
      cast: [
        { id: 'ya', pos: 'left', expr: 'excited', outfit: 'swim', act: 'idle' },
        { id: 'jin', pos: 'right', expr: 'smile', outfit: 'swim', act: 'idle' }
      ],
      speaker: 'narrator',
      text: '第二天上午，我们终于下海了。她戴着那顶大草帽，白色的泳衣在阳光里晃眼。我踩进水里，沙子软软地往下陷，脚背上全是凉的。',
      next: 'c9_100'
    },
    {
      id: 'c9_100', chapter: 9, scene: 'beach', tint: 'day', cg: 'cg_beach', ambience: 'sea',
      cast: [
        { id: 'ya', pos: 'left', expr: 'laugh', outfit: 'swim', act: 'idle' },
        { id: 'jin', pos: 'right', expr: 'smile', outfit: 'swim', act: 'idle' }
      ],
      speaker: 'ya',
      text: '你走慢点——我鞋还没脱！……算了算了，反正都要湿。诶你看那边，那浪是不是比刚才大了？',
      next: 'c9_101'
    },
    {
      id: 'c9_101', chapter: 9, cg: 'cg_beach', zoom: 'bust',
      cast: [
        { id: 'ya', pos: 'left', expr: 'smile', outfit: 'swim', act: 'idle' },
        { id: 'jin', pos: 'right', expr: 'shy', outfit: 'swim', act: 'reach' }
      ],
      speaker: 'inner',
      text: '她拉着我往水里走。她的手很小，握得特别紧，像怕我被浪卷走。其实该被卷走的是我脑子里那些乱七八糟的念头。那一刻我什么都没想，就想着别松手。',
      next: 'c9_102'
    },
    {
      id: 'c9_102', chapter: 9, scene: 'beach', tint: 'dusk', cg: 'cg_beach', bgm: 'bgm_warm', beat: 'swell', transition: 'slowfade',
      cast: [
        { id: 'ya', pos: 'left', expr: 'excited', outfit: 'swim', act: 'idle' },
        { id: 'jin', pos: 'right', expr: 'soft', outfit: 'swim', act: 'idle' }
      ],
      speaker: 'narrator',
      text: '黄昏，天从橘色一点点变成紫的。她在沙滩上写我们的名字，浪一来就冲掉，冲掉她就再写一遍。写到第四遍，她抬头看我：走，我带你去潜水。',
      next: 'c9_103'
    },
    {
      id: 'c9_103', chapter: 9, scene: 'beach', tint: 'dusk', cg: 'cg_beach', zoom: 'face',
      cast: [
        { id: 'ya', pos: 'left', expr: 'proud', outfit: 'swim', act: 'idle' },
        { id: 'jin', pos: 'right', expr: 'surprised', outfit: 'swim', act: 'idle' }
      ],
      speaker: 'ya',
      text: '明天上午的船，我早就订好了。你到时候别乱动，跟着我走就行。……看着我干嘛，我厉害吧。',
      next: 'c9_104'
    },
    {
      id: 'c9_104', chapter: 9, zoom: 'bust',
      cast: [
        { id: 'ya', pos: 'left', expr: 'smile', outfit: 'swim', act: 'idle' },
        { id: 'jin', pos: 'right', expr: 'moved', outfit: 'swim', act: 'idle' }
      ],
      speaker: 'jin',
      text: '……你什么时候订的啊。\n我一点都不知道。',
      next: 'c9_105'
    },
    {
      id: 'c9_105', chapter: 9, zoom: 'face',
      cast: [
        { id: 'ya', pos: 'left', expr: 'tease', outfit: 'swim', act: 'idle' },
        { id: 'jin', pos: 'right', expr: 'awkward', outfit: 'swim', act: 'idle' }
      ],
      speaker: 'ya',
      text: '早就订好的事，不用你操心。……喂，你耳朵又红了。你这个人真的很好懂，我都不用猜。',
      next: 'c9_106'
    },
    {
      id: 'c9_106', chapter: 9, scene: 'beach', tint: 'day', ambience: 'sea',
      cast: [
        { id: 'ya', pos: 'left', expr: 'serious', outfit: 'swim', act: 'idle' },
        { id: 'jin', pos: 'right', expr: 'neutral', outfit: 'swim', act: 'idle' }
      ],
      speaker: 'narrator',
      text: '第二天坐船出海。船一出港口，岸就缩成一条细线。她在船上给我比手势：这样是我很好，这样是往上看，这样——是别怕。',
      next: 'c9_107'
    },
    {
      id: 'c9_107', chapter: 9, scene: 'underwater', bgm: 'bgm_hope', beat: 'swell', transition: 'slowfade',
      cast: [
        { id: 'ya', pos: 'left', expr: 'excited', outfit: 'swim', act: 'idle' },
        { id: 'jin', pos: 'right', expr: 'surprised', outfit: 'swim', act: 'idle' }
      ],
      speaker: 'narrator',
      text: '入水那一瞬间，世界只剩我自己的呼吸声，一进一出。蓝色的光从头顶一层层压下来，鱼群从老远的地方转过来，像有人撒了一把会动的碎银子。',
      next: 'c9_108'
    },
    {
      id: 'c9_108', chapter: 9, scene: 'underwater', cg: 'cg_underwater', beat: 'swell',
      cast: [
        { id: 'ya', pos: 'left', expr: 'laugh', outfit: 'swim', act: 'reach' },
        { id: 'jin', pos: 'right', expr: 'smile', outfit: 'swim', act: 'reach' }
      ],
      speaker: 'narrator',
      text: '她游到我旁边，比了个往上看的手势。我一抬头——阳光穿过水面，成了一根一根会晃的柱子，鱼就从柱子中间穿过去，一条都不躲人。',
      next: 'c9_109'
    },
    {
      id: 'c9_109', chapter: 9, cg: 'cg_underwater', zoom: 'face',
      cast: [
        { id: 'ya', pos: 'left', expr: 'smile', outfit: 'swim', act: 'reach' },
        { id: 'jin', pos: 'right', expr: 'soft', outfit: 'swim', act: 'reach' }
      ],
      speaker: 'inner',
      text: '在水下说不了话，只能比手势。她一直在我左边，手伸过来扣住我的手腕，一直没松。我忽然觉得这里比岸上更像我们平时的样子：两个都不太会说话的人，靠手势和眼神过日子。',
      next: 'c9_110'
    },
    {
      id: 'c9_110', chapter: 9, scene: 'underwater', cg: 'cg_underwater', beat: 'swell',
      cast: [
        { id: 'ya', pos: 'left', expr: 'excited', outfit: 'swim', act: 'reach' },
        { id: 'jin', pos: 'right', expr: 'laugh', outfit: 'swim', act: 'reach' }
      ],
      speaker: 'narrator',
      text: '摄影师在水里拍了很多张。有我们拉着手从鱼群里穿过去的，有她一个人悬在蓝光里的，还有一张我们同时转头看镜头，头发全在水里散着。',
      next: 'c9_111'
    },
    {
      id: 'c9_111', chapter: 9, cg: 'cg_underwater',
      cast: [
        { id: 'ya', pos: 'left', expr: 'proud', outfit: 'swim', act: 'reach' },
        { id: 'jin', pos: 'right', expr: 'surprised', outfit: 'swim', act: 'reach' }
      ],
      speaker: 'ya',
      text: '（手势）喂——看这个——给你——',
      next: 'c9_112'
    },
    {
      id: 'c9_112', chapter: 9, cg: 'cg_underwater',
      cast: [
        { id: 'ya', pos: 'left', expr: 'laugh', outfit: 'swim', act: 'reach' },
        { id: 'jin', pos: 'right', expr: 'smile', outfit: 'swim', act: 'reach' }
      ],
      speaker: 'inner',
      text: '她比的那个手势我看懂了，是「我很好」。我回她一个「好」。她隔着面镜冲我眨了下眼。那一下比任何一句话都清楚。',
      next: 'c9_113'
    },
    {
      id: 'c9_113', chapter: 9, scene: 'underwater', cg: 'cg_underwater', bgm: 'bgm_hope', beat: 'swell',
      cast: [
        { id: 'ya', pos: 'left', expr: 'excited', outfit: 'swim', act: 'reach' },
        { id: 'jin', pos: 'right', expr: 'soft', outfit: 'swim', act: 'reach' }
      ],
      speaker: 'narrator',
      text: '最后一潜结束，我们浮上水面。她一把摘掉面镜，头发湿漉漉贴在脸上，第一句话是：我看到一条特别大的鱼，它看了我一眼！',
      effects: { affection: 5, trust: 3, flags: { f_diving: true } },
      next: 'c9_114'
    },
    {
      id: 'c9_114', chapter: 9, scene: 'beach', tint: 'dusk', bgm: 'bgm_warm', beat: 'calm', ambience: 'sea',
      cast: [
        { id: 'ya', pos: 'left', expr: 'smile', outfit: 'swim', act: 'sleepy' },
        { id: 'jin', pos: 'right', expr: 'soft', outfit: 'swim', act: 'sit' }
      ],
      speaker: 'narrator',
      text: '回程的船上她靠着我睡着了，湿头发把我的袖子洇出一小片深色。海风把她那顶草帽吹得哗哗响，我一只手按帽子，另一只手不敢动。',
      next: 'c9_115'
    },
    {
      id: 'c9_115', chapter: 9, scene: 'beach', tint: 'dusk',
      cast: [{ id: 'jin', pos: 'right', expr: 'soft', outfit: 'swim', act: 'sit' }],
      speaker: 'inner',
      text: '船开得很慢。我想起那天她转过去的那半张脸，又想起今天她在水下冲我眨眼的样子。她要的一直都不多：一张照片，一次认真，一个当场就肯回答她的人。这三样我哪样都没做好。……我得学得快一点。',
      next: 'c9_116'
    },
    {
      id: 'c9_116', chapter: 9, scene: 'mall', tint: 'day', bgm: 'bgm_game', beat: 'pulse',
      cast: [
        { id: 'ya', pos: 'left', expr: 'excited', outfit: 'casual', act: 'idle' },
        { id: 'jin', pos: 'right', expr: 'neutral', outfit: 'casual', act: 'idle' }
      ],
      titlecard: '最后一天 · 三亚国际免税城',
      speaker: 'ya', transition: 'fade',
      text: '最后一天，逛免税城！我列了清单的，一条一条都写好了。……不过看看也行，不一定要买。你负责拉箱子，我负责逛。',
      next: 'c9_117'
    },
    {
      id: 'c9_117', chapter: 9, scene: 'mall', tint: 'day',
      cast: [
        { id: 'ya', pos: 'left', expr: 'serious', outfit: 'casual', act: 'idle' },
        { id: 'jin', pos: 'right', expr: 'smile', outfit: 'casual', act: 'idle' }
      ],
      speaker: 'narrator',
      text: '免税城大得像个机场。她举着手机一样一样地找，蹲在货架前把两款面霜的说明读了三遍，读完又放回去。我跟在她后面，只负责把她选中的东西接过来，塞进箱子。',
      next: 'c9_118'
    },
    {
      id: 'c9_118', chapter: 9, scene: 'mall', tint: 'day',
      cast: [
        { id: 'ya', pos: 'left', expr: 'pout', outfit: 'casual', act: 'idle' },
        { id: 'jin', pos: 'right', expr: 'smile', outfit: 'casual', act: 'idle' }
      ],
      speaker: 'ya',
      text: '你看这个，国内专柜也有，差不了多少。……就是这儿色号全，什么冷门的都翻得出来。',
      next: 'c9_119'
    },
    {
      id: 'c9_119', chapter: 9,
      cast: [{ id: 'jin', pos: 'right', expr: 'smile', outfit: 'casual', act: 'idle' }],
      speaker: 'inner',
      text: '逛了两个多小时，她手里就一个小袋子，两件护肤品。剩下的时间都在一层一层地走，她一路念这个好用、那个我妈喜欢，念完就放回去。原来她要的从来不是买，是慢慢挑。',
      effects: { affection: 1, flags: { f_duty_free: true } },
      next: 'c9_120'
    },
    {
      id: 'c9_120', chapter: 9, scene: 'mall', tint: 'day', bgm: 'bgm_warm', beat: 'swell', sfx: 'sfx_ding',
      cast: [
        { id: 'ya', pos: 'left', expr: 'surprised', outfit: 'casual', act: 'idle' },
        { id: 'jin', pos: 'right', expr: 'smile', outfit: 'casual', act: 'idle' }
      ],
      speaker: 'narrator',
      text: '走到最后一层，她被一家巧克力店黏住了。橱窗里摆着一排一排小方块，深得发亮。店员正切一块试吃的递出来，她没接，先看了我一眼。',
      next: 'c9_121'
    },
    {
      id: 'c9_121', chapter: 9, scene: 'mall', tint: 'day',
      cast: [
        { id: 'ya', pos: 'left', expr: 'excited', outfit: 'casual', act: 'reach' },
        { id: 'jin', pos: 'right', expr: 'laugh', outfit: 'casual', act: 'reach' }
      ],
      speaker: 'ya',
      text: '这个！这个必须买。还有那个百分之七十的，还有——算了那个也要。你别拦我，这是最后一站了。',
      next: 'c9_122'
    },
    {
      id: 'c9_122', chapter: 9, scene: 'mall', tint: 'day',
      cast: [{ id: 'jin', pos: 'right', expr: 'smile', outfit: 'casual', act: 'idle' }],
      speaker: 'narrator',
      text: '她挑了满满一袋，结完账拎在手里晃，说：「回去慢慢吃，一天一小块。」我在旁边看她数了两遍，忽然觉得这趟旅行最后买下来的东西，比清单上那些都适合当结尾。',
      effects: { affection: 2, flags: { f_chocolate: true } },
      next: 'c9_123'
    },
    {
      id: 'c9_123', chapter: 9, scene: 'hotel', tint: 'night', bgm: 'bgm_warm', beat: 'calm',
      cast: [
        { id: 'ya', pos: 'left', expr: 'sleepy', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'soft', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'narrator',
      text: '晚上回到房间，行李堆了一地。她坐在地毯上清点战利品，我在台灯底下写第六张明信片。这次的正面是一只猫趴在栏杆上看海，尾巴画得很老实。',
      next: 'c9_124'
    },
    {
      id: 'c9_124', chapter: 9, sfx: 'sfx_page',
      cast: [{ id: 'jin', pos: 'right', expr: 'soft', outfit: 'casual', act: 'reach' }],
      speaker: 'inner',
      text: '「我们看了海，也看了彼此。今天那组照片我留着。——石头，2026 夏，三亚。」写到看了彼此的时候我停了一下——那天晚上我确实没做到，是后来重新拍的那一组才算补上。',
      next: 'c9_125'
    },
    {
      id: 'c9_125', chapter: 9, scene: 'hotel', tint: 'night', beat: 'swell',
      cast: [
        { id: 'ya', pos: 'left', expr: 'smile', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'soft', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'narrator',
      text: '我把明信片递过去。她接的时候愣了一下，抬头看我，眼睛在台灯底下亮亮的。',
      next: 'c9_126'
    },
    {
      id: 'c9_126', chapter: 9, zoom: 'face',
      cast: [
        { id: 'ya', pos: 'left', expr: 'shy', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'soft', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'ya',
      text: '……第六张了。你写东西真的很土哎。不过每一张我都留着，一张都没丢。',
      effects: { affection: 3, trust: 2 },
      next: 'c9_127'
    },
    {
      id: 'c9_127', chapter: 9, scene: 'hotel', tint: 'night', beat: 'swell', transition: 'slowfade',
      cast: [{ id: 'ya', pos: 'center', expr: 'shy', outfit: 'casual', act: 'sit' }],
      speaker: 'ya',
      text: '对了对了。九月我生日，正好中秋放假。你来义乌吧？我来安排，顺便给你过生日——你生日不也在这几天吗。……别说不来啊，我票都看好了。',
      next: 'c9_128'
    },
    {
      id: 'c9_128', chapter: 9, scene: 'hotel', tint: 'night',
      cast: [{ id: 'jin', pos: 'right', expr: 'smile', outfit: 'casual', act: 'sit' }],
      speaker: 'jin',
      text: '……好。我去。\n你安排吧，这次我都听你的。\n……真的都听你的。',
      next: 'c9_128b'
    },
    {
      id: 'c9_128b', chapter: 9, beat: 'calm',
      cast: [{ id: 'jin', pos: 'right', expr: 'soft', outfit: 'casual', act: 'sit' }],
      speaker: 'inner',
      text: '从三亚回来以后，我就开始数日子。八月底列了一张单子：杭州那家店挑的、免税城拿的，还有一路上顺手攒下来的十几只企鹅。\n单子最后一行是：她说过想吃的那家月饼，别忘了。',
      next: 'c9_128c'
    },
    {
      id: 'c9_128c', chapter: 9, scene: 'airport', tint: 'dusk', bgm: 'bgm_travel', beat: 'calm',
      cast: [{ id: 'jin', pos: 'center', expr: 'neutral', outfit: 'casual', act: 'idle' }],
      speaker: 'narrator',
      text: '中秋前一天的飞机，机舱里全是拎着礼盒回家的人。我怀里抱着一大袋企鹅，空乘问我要不要放行李架，我说不用。\n落地的时候天刚黑，广播里在放中秋的歌。',
      next: 'c9_128d'
    },
    {
      id: 'c9_128d', chapter: 9, scene: 'station', tint: 'night', bgm: 'bgm_hope', beat: 'calm', ambience: 'crowd',
      cast: [{ id: 'jin', pos: 'center', expr: 'soft', outfit: 'casual', act: 'idle' }],
      speaker: 'inner',
      text: '义乌比我以为的亮。出站口外面挂着两排红灯笼，拉货的小车一辆接一辆从旁边过去，风里有一股纸箱和桂花混在一起的味道。\n手机在口袋里响了一下——是她发来的消息。',
      next: 'c9_129'
    },

    /* ============================================================
     *  9-3  义乌（2026 秋）
     * ============================================================ */

    {
      id: 'c9_129', chapter: 9, scene: 'station', tint: 'day', bgm:'bgm_travel', beat: 'pulse',
      cast: [
        { id: 'ya', pos: 'left', expr: 'excited', outfit: 'casual', act: 'idle' },
        { id: 'jin', pos: 'right', expr: 'smile', outfit: 'casual', act: 'idle' }
      ],
      titlecard: '2026 · 秋  义乌', transition: 'slowfade',
      speaker: 'ya',
      text: '出站往左走，我在那儿等你。今天先安顿，明天一早去商贸城——我做了攻略的，六个区，一天逛两个，剩下的看心情。',
      next: 'c9_130'
    },
    {
      id: 'c9_130', chapter: 9, scene: 'station', tint: 'day',
      cast: [
        { id: 'ya', pos: 'left', expr: 'smile', outfit: 'casual', act: 'reach' },
        { id: 'jin', pos: 'right', expr: 'soft', outfit: 'casual', act: 'reach' }
      ],
      speaker: 'narrator',
      text: '她真的来了，手里举着一杯还冒热气的饮料。中秋的人流从我们两边涌过去，她站在那儿，我一眼就看见了。',
      next: 'c9_131'
    },
    {
      id: 'c9_131', chapter: 9, scene: 'hotel', tint: 'day', bgm: 'bgm_warm', beat: 'calm',
      cast: [
        { id: 'ya', pos: 'left', expr: 'excited', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'smile', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'ya',
      text: '先说好，这几天是你的生日。行程我排好了，从早到晚，一天都不空。你不许提前问，也不许嫌累。',
      next: 'c9_132'
    },
    {
      id: 'c9_132', chapter: 9,
      cast: [{ id: 'jin', pos: 'right', expr: 'moved', outfit: 'casual', act: 'sit' }],
      speaker: 'inner',
      text: '我生日跟中秋撞在同一天，往年都是自己买个小蛋糕，开一局游戏就算过了。她说「我来安排」的时候语气特别轻，像在说一件早就该做的事。而我当时只回了一个「好」。\n……我到现在还在想，那个「好」是不是太短了。',
      effects: { affection: 3 },
      next: 'c9_133'
    },
    {
      id: 'c9_133', chapter: 9, scene: 'mall', tint: 'day', bgm: 'bgm_game', beat: 'pulse',
      cast: [
        { id: 'ya', pos: 'left', expr: 'surprised', outfit: 'casual', act: 'idle' },
        { id: 'jin', pos: 'right', expr: 'blank', outfit: 'casual', act: 'idle' }
      ],
      titlecard: '义乌国际商贸城',
      speaker: 'narrator', transition: 'fade',
      text: '第二天早上，我们站在商贸城的导览图前面。图上的区用不同颜色标着，一区一直排到六区，每个区后面都跟着一行小字，字小得要贴上去才看得清。',
      next: 'c9_134'
    },
    {
      id: 'c9_134', chapter: 9, scene: 'mall', tint: 'day', zoom: 'bust',
      cast: [
        { id: 'ya', pos: 'left', expr: 'excited', outfit: 'casual', act: 'idle' },
        { id: 'jin', pos: 'right', expr: 'surprised', outfit: 'casual', act: 'idle' }
      ],
      speaker: 'ya',
      text: '六个区。一区玩具，二区饰品，三区……算了算了，进去再说。反正光两个区就够逛一天，我们今天不着急。',
      next: 'c9_135'
    },
    {
      id: 'c9_135', chapter: 9,
      cast: [{ id: 'jin', pos: 'right', expr: 'blank', outfit: 'casual', act: 'idle' }],
      speaker: 'inner',
      text: '我以为商贸城就是个大市场。走进去才发现，它是一栋一栋连起来的城，走廊长得看不到头，每间铺子都堆着成百上千件一模一样的东西。我走了十分钟，就开始偷偷找出口了。',
      next: 'c9_136'
    },
    {
      id: 'c9_136', chapter: 9, scene: 'mall', tint: 'day', sfx: 'sfx_click',
      cast: [
        { id: 'ya', pos: 'left', expr: 'laugh', outfit: 'casual', act: 'reach' },
        { id: 'jin', pos: 'right', expr: 'smile', outfit: 'casual', act: 'reach' }
      ],
      speaker: 'narrator',
      text: '她逛铺子跟平时完全不一样：直接蹲下去往箱子底下翻，一件一件举到光底下看，看完塞给我，让我看做工。我看不懂，只能点头。',
      next: 'c9_137'
    },
    {
      id: 'c9_137', chapter: 9,
      cast: [{ id: 'ya', pos: 'left', expr: 'proud', outfit: 'casual', act: 'idle' }],
      speaker: 'ya',
      text: '你看这个，摸一下。一区二区走下来，东西几乎是齐的——玩偶、玩具、盲盒，什么都有。我小时候要是有这个，我能在这条走廊里住三天。',
      effects: { affection: 2, flags: { f_yiwu_6: true } },
      next: 'c9_138'
    },
    {
      id: 'c9_138', chapter: 9, scene: 'mall', tint: 'day', beat: 'calm',
      cast: [
        { id: 'ya', pos: 'left', expr: 'smile', outfit: 'casual', act: 'idle' },
        { id: 'jin', pos: 'right', expr: 'smile', outfit: 'casual', act: 'idle' }
      ],
      speaker: 'ya',
      text: '狗狗玩具在这边，先给它挑几样。它上次把我一条围巾咬了个洞，我到现在都没舍得扔。',
      next: 'c9_139'
    },
    {
      id: 'c9_139', chapter: 9, scene: 'mall', tint: 'day',
      cast: [
        { id: 'ya', pos: 'left', expr: 'excited', outfit: 'casual', act: 'reach' },
        { id: 'jin', pos: 'right', expr: 'smile', outfit: 'casual', act: 'reach' }
      ],
      speaker: 'narrator',
      text: '那一袋很快就满了：会响的橡胶球、带小铃铛的项圈、几件狗狗玩具，还有一副她看演出要用的望远镜。她挑东西的时候眼睛是亮的，有几件拿起来在我身上比了一下，比完又放回去，什么都不说。',
      effects: { affection: 2, flags: { f_gift_xiaoqi: true } },
      next: 'c9_140'
    },
    {
      id: 'c9_140', chapter: 9, scene: 'mall', tint: 'day',
      cast: [
        { id: 'ya', pos: 'left', expr: 'excited', outfit: 'casual', act: 'reach' },
        { id: 'jin', pos: 'right', expr: 'smile', outfit: 'casual', act: 'reach' }
      ],
      speaker: 'ya',
      text: '你过来，摸一下这个毛。这也太像了吧——颜色、款式，一样不缺，跟真的几乎分不出来。',
      next: 'c9_141'
    },
    {
      id: 'c9_141', chapter: 9, scene: 'mall', tint: 'day', beat: 'pulse', sfx: 'sfx_ding',
      cast: [
        { id: 'ya', pos: 'left', expr: 'excited', outfit: 'casual', act: 'reach' },
        { id: 'jin', pos: 'right', expr: 'surprised', outfit: 'casual', act: 'reach' }
      ],
      speaker: 'ya',
      text: '啊！Ginpu！等等——那边有 Ginpu 的盲盒，一整面墙。你快点过来，快点快点。',
      next: 'c9_142'
    },
    {
      id: 'c9_142', chapter: 9, scene: 'mall', tint: 'day',
      cast: [
        { id: 'ya', pos: 'left', expr: 'laugh', outfit: 'casual', act: 'reach' },
        { id: 'jin', pos: 'right', expr: 'smile', outfit: 'casual', act: 'reach' }
      ],
      speaker: 'narrator',
      text: '一整面墙的盲盒，每一格都是那只圆滚滚的企鹅。她挑了三盒，说留一个给运气最差的那天再开。我在旁边看她抠开第一盒——戴围巾那款。她小声欢呼了一下，又赶紧左右看看，像怕被人听见。',
      effects: { affection: 2, flags: { f_ginpu_box: true } },
      next: 'c9_143'
    },
    {
      id: 'c9_143', chapter: 9, scene: 'mall', tint: 'day',
      cast: [
        { id: 'ya', pos: 'left', expr: 'tease', outfit: 'casual', act: 'idle' },
        { id: 'jin', pos: 'right', expr: 'smile', outfit: 'casual', act: 'idle' }
      ],
      speaker: 'ya',
      text: '第二个是洗澡款。第三个……你猜。猜对了三盒都归你，猜不对你今晚负责拎袋子。',
      next: 'c9_144'
    },
    {
      id: 'c9_144', chapter: 9, scene: 'mall', tint: 'day',
      cast: [
        { id: 'ya', pos: 'left', expr: 'proud', outfit: 'casual', act: 'idle' },
        { id: 'jin', pos: 'right', expr: 'laugh', outfit: 'casual', act: 'idle' }
      ],
      speaker: 'narrator',
      text: '我猜了三次都没中——是抱着小鱼那款。她把三只企鹅并排摆在柜台上，拍了张照片，说这是今天的第一笔收藏。',
      next: 'c9_145'
    },
    {
      id: 'c9_145', chapter: 9, scene: 'mall', tint: 'day', beat: 'calm',
      cast: [
        { id: 'ya', pos: 'left', expr: 'smile', outfit: 'casual', act: 'idle' },
        { id: 'jin', pos: 'right', expr: 'soft', outfit: 'casual', act: 'idle' }
      ],
      speaker: 'ya',
      text: '那边有卖小首饰的，做工特别细。我想挑一条——你帮我看看哪个好，不许说都好看。',
      next: 'c9_146'
    },
    {
      id: 'c9_146', chapter: 9, scene: 'mall', tint: 'day',
      cast: [
        { id: 'ya', pos: 'left', expr: 'serious', outfit: 'casual', act: 'reach' },
        { id: 'jin', pos: 'right', expr: 'shy', outfit: 'casual', act: 'reach' }
      ],
      speaker: 'narrator',
      text: '银饰铺子在走廊拐角，一串一串挂在灯底下。她挑了快半个小时，脖子上比两条，手腕上又试一条，每试一条都回头看我一眼，问哪条好看。',
      next: 'c9_147'
    },
    {
      id: 'c9_147', chapter: 9, scene: 'mall', tint: 'day',
      cast: [
        { id: 'ya', pos: 'left', expr: 'smile', outfit: 'casual', act: 'reach' },
        { id: 'jin', pos: 'right', expr: 'shy', outfit: 'casual', act: 'reach' }
      ],
      speaker: 'ya',
      text: '就要这条。……我平时不太戴东西的。但这条我想天天戴着。你别问为什么。',
      effects: { affection: 3, trust: 1 },
      next: 'c9_148'
    },
    {
      id: 'c9_148', chapter: 9, scene: 'mall', tint: 'day', beat: 'drop',
      cast: [
        { id: 'ya', pos: 'left', expr: 'smile', outfit: 'casual', act: 'idle' },
        { id: 'jin', pos: 'right', expr: 'awkward', outfit: 'casual', act: 'lean' }
      ],
      speaker: 'narrator',
      text: '走到三区的时候，我肚子开始不对劲。可能是早上那杯冰豆浆，也可能是昨晚空调开太低。走廊里的风一阵一阵从头顶灌下来，我越走越觉得胃在往下坠。',
      next: 'c9_149'
    },
    {
      id: 'c9_149', chapter: 9,
      cast: [{ id: 'jin', pos: 'right', expr: 'awkward', outfit: 'casual', act: 'lean' }],
      speaker: 'inner',
      text: '我本来想忍一忍。她今天上午走了快两万步，兴致高得不行，我不想因为一个肚子把她的兴头打断。可我一个字都还没说，她回头看了我一眼，就全知道了。……我在她面前好像一直藏不住事。',
      next: 'c9_150'
    },
    {
      id: 'c9_150', chapter: 9, scene: 'mall', tint: 'day', beat: 'calm', zoom: 'face',
      cast: [
        { id: 'ya', pos: 'left', expr: 'worried', outfit: 'casual', act: 'reach' },
        { id: 'jin', pos: 'right', expr: 'awkward', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'ya',
      text: '你脸色不对。别装了，坐下。那边有椅子，就在卖地毯那家前面，我刚看见的。',
      next: 'c9_151'
    },
    {
      id: 'c9_151', chapter: 9, scene: 'mall', tint: 'day',
      cast: [
        { id: 'ya', pos: 'left', expr: 'worried', outfit: 'casual', act: 'reach' },
        { id: 'jin', pos: 'right', expr: 'awkward', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'narrator',
      text: '她把我按在椅子上，又跑去旁边那家铺子问了两句。我坐了一会儿，顶上的风慢慢吹，胃里那股坠感退了一点。',
      next: 'c9_152'
    },
    {
      id: 'c9_152', chapter: 9,
      cast: [
        { id: 'ya', pos: 'left', expr: 'serious', outfit: 'casual', act: 'reach' },
        { id: 'jin', pos: 'right', expr: 'soft', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'ya',
      text: '你坐着别动，就在这儿等我。我还有两家想看，就在这一排，看完就回去。',
      next: 'c9_153'
    },
    {
      id: 'c9_153', chapter: 9, zoom: 'face',
      cast: [
        { id: 'ya', pos: 'left', expr: 'smile', outfit: 'casual', act: 'reach' },
        { id: 'jin', pos: 'right', expr: 'moved', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'inner',
      text: '在杭州是她肚子不舒服，那天我手忙脚乱，连热水都是问了前台才想起来。今天换过来，我只想让她别管我，继续逛她的。可她把两个最重的袋子都拎走了，走两步回一次头。',
      effects: { affection: 4, trust: 2, flags: { f_stomachache: true } },
      next: 'c9_154'
    },
    {
      id: 'c9_154', chapter: 9, scene: 'mall', tint: 'day', beat: 'calm',
      cast: [
        { id: 'ya', pos: 'left', expr: 'tease', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'awkward', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'ya',
      text: '你在这儿等我。就看两家，很快。……真很快。',
      next: 'c9_155'
    },
    {
      id: 'c9_155', chapter: 9, scene: 'mall', tint: 'day',
      cast: [{ id: 'jin', pos: 'right', expr: 'soft', outfit: 'casual', act: 'sit' }],
      speaker: 'narrator',
      text: '十几分钟她就回来了，手上多一个袋子，人却没了刚才那股劲。她站在我面前看了我两眼，说不逛了，回去吧。',
      next: 'c9_156'
    },
    {
      id: 'c9_156', chapter: 9, scene: 'mall', tint: 'day', zoom: 'bust',
      cast: [
        { id: 'ya', pos: 'left', expr: 'smile', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'soft', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'jin',
      text: '……你不是还有两家没看吗。\n……我自己坐会儿就行。',
      next: 'c9_157'
    },
    {
      id: 'c9_157', chapter: 9, scene: 'mall', tint: 'day', beat: 'swell', zoom: 'face',
      cast: [
        { id: 'ya', pos: 'left', expr: 'smile', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'smile', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'ya',
      text: '东西什么时候都能买。你那张脸白成那样，我逛不下去。走。',
      next: 'c9_158'
    },
    {
      id: 'c9_158', chapter: 9, scene: 'hotel', tint: 'night', bgm: 'bgm_warm', beat: 'calm',
      cast: [
        { id: 'ya', pos: 'left', expr: 'excited', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'smile', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'narrator',
      text: '晚上我们提前回了酒店，东西往床上一倒。她说别在房间里待着，把我拉出了门。中秋的月亮挂在楼顶上，圆得没什么道理；她带我绕过两条街，走过她小时候上学的那条路，最后在一家小馆子门口站住，说就这儿。',
      next: 'c9_159'
    },
    {
      id: 'c9_159', chapter: 9, scene: 'hotel', tint: 'night', bgm: 'bgm_warm', beat: 'pulse',
      cast: [
        { id: 'ya', pos: 'left', expr: 'excited', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'surprised', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'ya',
      text: '你数一下，这是我们这几天吃的第七种了。前天中餐，昨天西餐，中午印度菜——晚上这个，明天还有一家烧烤，我订好了，你不许说不去。',
      next: 'c9_160'
    },
    {
      id: 'c9_160', chapter: 9,
      cast: [{ id: 'jin', pos: 'right', expr: 'smile', outfit: 'casual', act: 'sit' }],
      speaker: 'inner',
      text: '我们真的把这一带的馆子吃了一圈。她记菜名比我快得多，指着一盘咖喱说「这个跟上次那家的区别，是椰浆多放了一勺」。我尝了一口——确实。……这种事上她永远是对的，我认。',
      effects: { affection: 2 },
      next: 'c9_161'
    },
    {
      id: 'c9_161', chapter: 9, scene: 'hotel', tint: 'night', beat: 'swell', sfx: 'sfx_ding',
      cast: [
        { id: 'ya', pos: 'left', expr: 'excited', outfit: 'casual', act: 'reach' },
        { id: 'jin', pos: 'right', expr: 'surprised', outfit: 'casual', act: 'reach' }
      ],
      speaker: 'narrator',
      text: '饭后她把纸袋往桌上一放，没让我碰，自己把里面的东西一样一样摆出来。\n摆得很慢，摆完也不说话，就撑着下巴看我的脸。',
      next: 'c9_162'
    },
    {
      id: 'c9_162', chapter: 9, scene: 'hotel', tint: 'night', sfx: 'sfx_page',
      cast: [
        { id: 'ya', pos: 'left', expr: 'shy', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'moved', outfit: 'casual', act: 'reach' }
      ],
      speaker: 'narrator',
      text: '先是一张手写的贺卡，两面都写满了，字挤着字。再下面是手柄——和我原来那只一个型号。她说我那只老漂移，还不如没收。最后压着一盒猫猫拼图，一千片。',
      next: 'c9_163'
    },
    {
      id: 'c9_163', chapter: 9, sfx: 'sfx_page',
      cast: [
        { id: 'ya', pos: 'left', expr: 'smile', outfit: 'casual', act: 'reach' },
        { id: 'jin', pos: 'right', expr: 'moved', outfit: 'casual', act: 'reach' }
      ],
      speaker: 'ya',
      text: '还有这个。\n丑吧。……你不许笑。',
      next: 'c9_164'
    },
    {
      id: 'c9_164', chapter: 9, scene: 'hotel', tint: 'night', cg: 'cg_yiwu_gifts',
      cast: [
        { id: 'ya', pos: 'left', expr: 'shy', outfit: 'casual', act: 'reach' },
        { id: 'jin', pos: 'right', expr: 'moved', outfit: 'casual', act: 'reach' }
      ],
      speaker: 'narrator',
      text: '绣布画框上是一行歪歪扭扭的针脚：「生日快乐」，旁边一只很小的猫。针脚有的紧有的松，猫的耳朵一只高一只低。\n我伸手碰了碰，指腹蹭到背面的线头，被扎了一下。',
      next: 'c9_165'
    },
    {
      id: 'c9_165', chapter: 9, sfx: 'sfx_page',
      cast: [
        { id: 'ya', pos: 'left', expr: 'tease', outfit: 'casual', act: 'reach' },
        { id: 'jin', pos: 'right', expr: 'surprised', outfit: 'casual', act: 'reach' }
      ],
      speaker: 'ya',
      text: '最后一副，塔罗牌，猫猫的。以后有什么想不通的，抽一张，抽到什么算什么。不许赖啊。',
      next: 'c9_166'
    },
    {
      id: 'c9_166', chapter: 9, scene: 'hotel', tint: 'night',
      cast: [
        { id: 'ya', pos: 'left', expr: 'serious', outfit: 'casual', act: 'reach' },
        { id: 'jin', pos: 'right', expr: 'blank', outfit: 'casual', act: 'reach' }
      ],
      speaker: 'ya',
      text: '还有一颗小珠子。你拿着，别弄丢了。丢了我不给你第二颗。',
      next: 'c9_167'
    },
    {
      id: 'c9_167', chapter: 9, scene: 'hotel', tint: 'night', zoom: 'face', beat: 'swell',
      cast: [
        { id: 'ya', pos: 'left', expr: 'shy', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'moved', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'inner',
      text: '那颗珠子很小，深蓝色，放在掌心会反出一点点光。我握着它，握到掌心都热了，也没想起来该放下。\n她一直看着我的手，看够了才转过头去收袋子。那一下我看见她耳朵是红的。\n我那时候应该抬头看她一眼的。我没敢。\n至于那颗珠子到底是干什么用的，我到今天也没弄明白。',
      effects: { affection: 6, trust: 4, flags: { f_gift_exchange: true } },
      next: 'c9_168'
    },
    {
      id: 'c9_168', chapter: 9, scene: 'hotel', tint: 'night', cg: 'cg_yiwu_gifts', beat: 'swell',
      cast: [
        { id: 'ya', pos: 'left', expr: 'laugh', outfit: 'casual', act: 'reach' },
        { id: 'jin', pos: 'right', expr: 'smile', outfit: 'casual', act: 'reach' }
      ],
      speaker: 'narrator',
      text: '我把那袋企鹅也搬了出来——围巾的、洗澡的、抱鱼的、戴帽子的，一共十几只。\n她一只一只往外掏，掏到第五只就笑到直不起腰，袋子都拿不稳。',
      effects: { affection: 3 },
      next: 'c9_169'
    },
    {
      id: 'c9_169', chapter: 9, cg: 'cg_ginpu', sfx: 'sfx_laugh',
      cast: [
        { id: 'ya', pos: 'left', expr: 'laugh', outfit: 'casual', act: 'reach' },
        { id: 'jin', pos: 'right', expr: 'smile', outfit: 'casual', act: 'reach' }
      ],
      speaker: 'ya',
      text: '你到底买了多少只啊！一、二……不数了，这么多企鹅！你是不是把它们全家的亲戚都买回来了！',
      next: 'c9_170'
    },
    {
      id: 'c9_170', chapter: 9, cg: 'cg_ginpu', zoom: 'bust',
      cast: [
        { id: 'ya', pos: 'left', expr: 'tease', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'shy', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'ya',
      text: '你从杭州买到三亚，又从三亚买到义乌——你一直在给我生企鹅。承认吧，你怀孕了，你是企鹅爸爸。',
      next: 'c9_171'
    },
    {
      id: 'c9_171', chapter: 9, cg: 'cg_ginpu',
      cast: [
        { id: 'ya', pos: 'left', expr: 'laugh', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'laugh', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'jin',
      text: '……那我是爸爸兼妈妈。反正也是我生的，我负责。\n……你别笑了啊。',
      next: 'c9_172'
    },
    {
      id: 'c9_172', chapter: 9, cg: 'cg_ginpu',
      cast: [
        { id: 'ya', pos: 'left', expr: 'laugh', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'smile', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'ya',
      text: '照这个速度，你以后时不时就得「怀孕」一回。行吧，企鹅爸爸。你负责生，我负责看。',
      next: 'c9_173'
    },
    {
      id: 'c9_173', chapter: 9,
      cast: [{ id: 'jin', pos: 'right', expr: 'soft', outfit: 'casual', act: 'sit' }],
      speaker: 'inner',
      text: '她说完自己先笑，笑到一半还得抬眼看我一下。我耳朵一下就热了，低头去翻袋子，装作没听见。\n这种玩笑她一向比我敢开。我不是不想接——我是每次都慢半句，等想好该说什么，话题已经过去了。\n下一句，我至少要说一句的。',
      effects: { trust: 3, courage: 2, flags: { f_pregnant_joke: true, f_birthday_cake2: true } },
      next: 'c9_choice_ginpu'
    },
    {
      id: 'c9_choice_ginpu', chapter: 9, scene: 'hotel', tint: 'night', cg: 'cg_ginpu', bgm: 'bgm_game', beat: 'pulse',
      cast: [
        { id: 'ya', pos: 'left', expr: 'excited', outfit: 'casual', act: 'reach' },
        { id: 'jin', pos: 'right', expr: 'smile', outfit: 'casual', act: 'reach' }
      ],
      speaker: 'jin',
      text: '……等一下。\n我又从袋子里摸了一只，摸出来，握在手里，没马上给她。',
      next: 'c9_ch19_a1',
      choices: [
        { text: '正经递过去，把话说完，不躲她的眼睛', hint: '（好好说一次，别笑着混过去）', effects: { affection: 4, trust: 3, courage: 3 }, next: 'c9_ch19_a1' },
        { text: '接着「生企鹅」的梗：「又生了一只，你抱好。」', hint: '（她刚才自己先说的）', effects: { affection: 3, courage: 1, flags: { f_pregnant_joke: true } }, next: 'c9_ch19_b1' },
        { text: '藏在背后：「猜猜我手里是什么？」', hint: '（让她猜，看她急）', effects: { affection: 2, trust: 1 }, next: 'c9_ch19_c1' }
      ]
    },

    /* —— 选项⑲ 分支 A：正经地说 —— */
    {
      id: 'c9_ch19_a1', chapter: 9, scene: 'hotel', tint: 'night', bgm: 'bgm_warm', beat: 'swell', zoom: 'face',
      cast: [
        { id: 'ya', pos: 'left', expr: 'surprised', outfit: 'casual', act: 'reach' },
        { id: 'jin', pos: 'right', expr: 'soft', outfit: 'casual', act: 'reach' }
      ],
      speaker: 'jin',
      text: '这个给你。\n……不是随手摸的。\n这一只，我从杭州留到三亚，又带到义乌。\n……这回不是玩笑了。',
      next: 'c9_ch19_a2'
    },
    {
      id: 'c9_ch19_a2', chapter: 9, zoom: 'face',
      cast: [
        { id: 'ya', pos: 'left', expr: 'shy', outfit: 'casual', act: 'reach' },
        { id: 'jin', pos: 'right', expr: 'soft', outfit: 'casual', act: 'reach' }
      ],
      speaker: 'ya',
      text: '……你这个人。平时一句话憋半天，正经起来倒是挺会说的。\n说完了没有？说完我要收东西了。',
      next: 'c9_ch19_a3'
    },
    {
      id: 'c9_ch19_a3', chapter: 9,
      cast: [{ id: 'jin', pos: 'right', expr: 'smile', outfit: 'casual', act: 'sit' }],
      speaker: 'inner',
      text: '她抱着那只企鹅转过身去收拾东西，耳朵一直是红的。\n我看着她的背影，第一次觉得，好好说一句话这件事，比拎着十几只企鹅走一整天还难。',
      effects: { courage: 2 },
      next: 'c9_174'
    },

    /* —— 选项⑲ 分支 B：接着"生企鹅"的玩笑 —— */
    {
      id: 'c9_ch19_b1', chapter: 9, scene: 'hotel', tint: 'night', bgm: 'bgm_game', beat: 'pulse', cg: 'cg_ginpu',
      cast: [
        { id: 'ya', pos: 'left', expr: 'laugh', outfit: 'casual', act: 'reach' },
        { id: 'jin', pos: 'right', expr: 'laugh', outfit: 'casual', act: 'reach' }
      ],
      speaker: 'jin',
      text: '……又生了一只。这回是抱鱼的。\n你抱好，别摔了。\n……名字我还没想。',
      next: 'c9_ch19_b2'
    },
    {
      id: 'c9_ch19_b2', chapter: 9, cg: 'cg_ginpu',
      cast: [
        { id: 'ya', pos: 'left', expr: 'laugh', outfit: 'casual', act: 'reach' },
        { id: 'jin', pos: 'right', expr: 'smile', outfit: 'casual', act: 'reach' }
      ],
      speaker: 'ya',
      text: '企鹅爸爸兼妈妈，辛苦了。……诶，这个月的奶粉钱怎么办？你生这么多。',
      next: 'c9_ch19_b3'
    },
    {
      id: 'c9_ch19_b3', chapter: 9, cg: 'cg_ginpu', zoom: 'bust',
      cast: [
        { id: 'ya', pos: 'left', expr: 'smile', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'laugh', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'narrator',
      text: '她把十几只企鹅按个头排成一排，说要给它们编名字。排到第三只自己先笑场了，最后只编出来一只，叫「土豆」——因为「你打不过噩梦模式，就用它命名」。',
      effects: { affection: 2 },
      next: 'c9_174'
    },

    /* —— 选项⑲ 分支 C：让她猜 —— */
    {
      id: 'c9_ch19_c1', chapter: 9, scene: 'hotel', tint: 'night', bgm: 'bgm_game', beat: 'pulse',
      cast: [
        { id: 'ya', pos: 'left', expr: 'pout', outfit: 'casual', act: 'reach' },
        { id: 'jin', pos: 'right', expr: 'laugh', outfit: 'casual', act: 'shy_hide' }
      ],
      speaker: 'jin',
      text: '猜猜我手里是什么。\n猜对了是你的，猜错了也是你的。\n……反正都是你的。',
      next: 'c9_ch19_c2'
    },
    {
      id: 'c9_ch19_c2', chapter: 9, zoom: 'face',
      cast: [
        { id: 'ya', pos: 'left', expr: 'pout', outfit: 'casual', act: 'reach' },
        { id: 'jin', pos: 'right', expr: 'smile', outfit: 'casual', act: 'shy_hide' }
      ],
      speaker: 'ya',
      text: '又是企鹅。\n我认得出来——你身上现在是塑料袋加毛绒的味道。快给我。',
      next: 'c9_ch19_c3'
    },
    {
      id: 'c9_ch19_c3', chapter: 9, zoom: 'bust',
      cast: [
        { id: 'ya', pos: 'left', expr: 'excited', outfit: 'casual', act: 'reach' },
        { id: 'jin', pos: 'right', expr: 'laugh', outfit: 'casual', act: 'reach' }
      ],
      speaker: 'narrator',
      text: '她一把抢过去，抱在怀里揉了两下，抬头就问还有没有。我说有。她立刻去翻我的箱子，翻到最后一只嫌慢，干脆把整个箱子倒在了床上。',
      effects: { affection: 2 },
      next: 'c9_174'
    },

    /* —— 汇合：摆拍与生日蛋糕 —— */
    {
      id: 'c9_174', chapter: 9, scene: 'hotel', tint: 'night', bgm: 'bgm_warm', beat: 'swell', cg: 'cg_yiwu_gifts',
      cast: [
        { id: 'ya', pos: 'left', expr: 'excited', outfit: 'casual', act: 'reach' },
        { id: 'jin', pos: 'right', expr: 'smile', outfit: 'casual', act: 'reach' }
      ],
      speaker: 'narrator',
      text: '她把今天所有东西重新摆了一遍：绣布画框立在最中间，塔罗牌摊成扇形，拼图和手柄放两边，前面一排企鹅，那颗小珠子摆在最前面的正中央。\n然后退到门口，拍了三张才满意。',
      next: 'c9_175'
    },
    {
      id: 'c9_175', chapter: 9, cg: 'cg_yiwu_gifts', zoom: 'face',
      cast: [
        { id: 'ya', pos: 'left', expr: 'proud', outfit: 'casual', act: 'reach' },
        { id: 'jin', pos: 'right', expr: 'soft', outfit: 'casual', act: 'reach' }
      ],
      speaker: 'ya',
      text: '这张得拍好啊。以后翻出来看，就知道我们这一天忙成什么样了。\n……你往左边站一点，挡着我的企鹅了。',
      next: 'c9_176'
    },
    {
      id: 'c9_176', chapter: 9, scene: 'hotel', tint: 'night', sfx: 'sfx_ding', beat: 'swell',
      cast: [
        { id: 'ya', pos: 'left', expr: 'excited', outfit: 'casual', act: 'reach' },
        { id: 'jin', pos: 'right', expr: 'moved', outfit: 'casual', act: 'reach' }
      ],
      speaker: 'narrator',
      text: '灯关了。她从桌子底下端出一个很小的蛋糕，上面插着一根蜡烛，火苗歪歪的。\n她说许愿不用说出来，说给企鹅听就行。\n我闭上眼，其实什么都没许。睁眼之前，先听见她在对面憋笑。',
      next: 'c9_177'
    },
    {
      id: 'c9_177', chapter: 9, scene: 'hotel', tint: 'night', beat: 'swell', transition: 'slowfade',
      cast: [
        { id: 'ya', pos: 'left', expr: 'smile', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'soft', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'ya',
      text: '生日快乐。\n……那个，明年这个时候，你还来，好不好？',
      next: 'c9_178'
    },
    {
      id: 'c9_178', chapter: 9, zoom: 'face',
      cast: [
        { id: 'ya', pos: 'left', expr: 'shy', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'soft', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'jin',
      text: '来。\n……明年也来，后年也来。\n……每一年都来。',
      next: 'c9_179'
    },
    {
      id: 'c9_179', chapter: 9, scene: 'hotel', tint: 'night', bgm: 'bgm_warm', beat: 'calm', sfx: 'sfx_page',
      cast: [{ id: 'jin', pos: 'right', expr: 'soft', outfit: 'casual', act: 'reach' }],
      speaker: 'narrator',
      text: '夜里她睡着了。我坐在窗边写这次的明信片。\n正面是一只猫抱着月饼，猫身子画得很敷衍，脸倒认真画了半天。',
      next: 'c9_180'
    },
    {
      id: 'c9_180', chapter: 9,
      cast: [{ id: 'jin', pos: 'right', expr: 'soft', outfit: 'casual', act: 'reach' }],
      speaker: 'inner',
      text: '背面写：中秋，生日，还有十几个孩子。明年见。\n——石头，2026 秋，义乌。\n写完我自己笑了一下，把它夹进那副猫猫塔罗牌的第一张里。',
      next: 'c9_181'
    },
    {
      id: 'c9_181', chapter: 9, scene: 'hotel', tint: 'night', beat: 'swell',
      cast: [
        { id: 'ya', pos: 'left', expr: 'smile', outfit: 'casual', act: 'sleepy' },
        { id: 'jin', pos: 'right', expr: 'soft', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'inner',
      text: '这是第七张猫猫明信片。\n台灯下她把被子踢开了一半，怀里还抱着一只企鹅，抱得挺紧。\n我伸手把被子拉回来，盖到她肩上。她哼了一声，没醒。',
      effects: { affection: 4, trust: 2, flags: { f_birthday_cake2: true } },
      next: 'c9_182'
    },
    {
      id: 'c9_182', chapter: 9, scene: 'hotel', tint: 'night', beat: 'calm',
      cast: [{ id: 'jin', pos: 'right', expr: 'soft', outfit: 'casual', act: 'sit' }],
      speaker: 'inner',
      text: '杭州下了两天雨，三亚晒了两天太阳，义乌走了三天路。\n这三趟加起来，我好像学会了一点以前不会的事：她难受的时候不要问要不要紧，直接去倒水；她想拍照的时候不要讲道理，先看她；她把东西递过来、说「这是给你的」的时候，不要只说谢谢。',
      next: 'c9_183'
    },
    {
      id: 'c9_183', chapter: 9, scene: 'hotel', tint: 'night', bgm: 'bgm_hope', beat: 'swell', transition: 'slowfade',
      cast: [{ id: 'jin', pos: 'right', expr: 'soft', outfit: 'casual', act: 'sit' }],
      speaker: 'inner',
      text: '十月中旬是我们的纪念日。她说要穿那条我一直没敢细看的裙子，让我把这一年所有没说出口的话一次说完。\n我想我大概还是说不完。\n……但我可以去试。',
      next: 'c9_184'
    },
    {
      id: 'c9_184', chapter: 9, scene: 'station', tint: 'day', bgm: 'bgm_warm', beat: 'calm',
      cast: [
        { id: 'ya', pos: 'left', expr: 'smile', outfit: 'casual', act: 'idle' },
        { id: 'jin', pos: 'right', expr: 'smile', outfit: 'casual', act: 'idle' }
      ],
      titlecard: '2026 · 秋  义乌站 · 回家',
      speaker: 'narrator', transition: 'fade',
      text: '走的那天她送我进站。左手提着那袋巧克力，右手抱着一只企鹅。\n她说：「这只我替你先养着。」\n检票口开了，她没有像以前那样红眼睛，只是朝我摆了摆手，然后低头去捏企鹅的帽子。',
      next: 'c10_01'
    }

  ]);
})();
