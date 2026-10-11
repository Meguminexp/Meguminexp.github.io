/* 《你好！一周年》第十章 · 一周年（2026.10.13） —— 作者：主程
 * 收束章：害羞地互道男女朋友、浪漫的表白与互动，并回环 2025.09.27 那句「因为看上你了」。
 * 结尾路由 c10_router（定义在 chapter_end.js）按 好感/信任/勇气 分流到三种收束。
 */
(function () {
  'use strict';
  YJ.story.add([

    /* ============ 一、去上海的路上 ============ */
    {
      id: 'c10_01', chapter: 10, scene: 'station', tint: 'day', bgm:'bgm_travel', beat: 'pulse',
      titlecard: '2026 · 10 · 13  一周年',
      cast: [],
      speaker: 'narrator',
      text: '十月的上海还留着夏天的尾巴。高铁进站的时候，窗外的楼一层一层矮下去，又在远处重新长起来。',
      next: 'c10_02'
    },
    {
      id: 'c10_02', chapter: 10,
      cast: [{ id: 'jin', pos: 'center', expr: 'blank', outfit: 'plaid', act: 'idle' }],
      speaker: 'inner',
      text: '我把手机日历翻出来看了第三遍。2025 年 10 月 13 日——她说的「我们开始有点暧昧」的那天。\n一年了。我一直觉得自己不是个会记日子的人。\n可这一年里，我记住了太多不该记的细节。\n……列车过隧道的时候我才发现，日历还开着。',
      next: 'c10_03'
    },
    {
      id: 'c10_03', chapter: 10,
      cast: [{ id: 'jin', pos: 'center', expr: 'awkward', outfit: 'plaid', act: 'idle' }],
      speaker: 'inner',
      text: '比如她今天一定会穿那件新裙子。\n比如她一定会假装不在意地问我「你觉得我今天有什么不一样」。\n比如我大概还是会在她面前，说不出一句完整的话。',
      next: 'c10_04'
    },
    {
      id: 'c10_04', chapter: 10, scene: 'shanghai_night', tint: 'dusk',
      cast: [],
      speaker: 'narrator',
      text: '出站口外面人很多。我站在栏杆边上，把帆布包换到另一边肩膀上——不知道什么时候养成的习惯，为了让她一眼就能看见我。',
      next: 'c10_05'
    },
    {
      id: 'c10_05', chapter: 10,
      cast: [{ id: 'ya', pos: 'center', expr: 'smile', outfit: 'dress', act: 'reach' }],
      speaker: 'ya',
      text: '羊羊金——！\n你又在栏杆最里面站着。每次都要我挤进去捞你。',
      sfx: 'sfx_heart',
      next: 'c10_06'
    },
    {
      id: 'c10_06', chapter: 10,
      cast: [
        { id: 'jin', pos: 'left', expr: 'shy', outfit: 'plaid', act: 'idle' },
        { id: 'ya', pos: 'right', expr: 'tease', outfit: 'dress', act: 'idle' }
      ],
      speaker: 'ya',
      text: '而且我猜到了——你七点就到了，是不是？\n你外套袖子上还有刚才扶栏杆压出来的印子呢。',
      next: 'c10_07'
    },
    {
      id: 'c10_07', chapter: 10,
      cast: [
        { id: 'jin', pos: 'left', expr: 'awkward', outfit: 'plaid', act: 'idle' },
        { id: 'ya', pos: 'right', expr: 'proud', outfit: 'dress', act: 'idle' }
      ],
      speaker: 'jin',
      text: '……你怎么连这个都看得出来。\n……我七点就到了。',
      next: 'c10_08'
    },
    {
      id: 'c10_08', chapter: 10,
      cast: [
        { id: 'jin', pos: 'left', expr: 'shy', outfit: 'plaid', act: 'idle' },
        { id: 'ya', pos: 'right', expr: 'laugh', outfit: 'dress', act: 'idle' }
      ],
      speaker: 'ya',
      text: '因为我看你看了很久呀。\n走啦，先去吃饭——找了一家能看江的。你今天是我请的客人，不许抢着付钱。',
      next: 'c10_09'
    },
    {
      id: 'c10_09', chapter: 10,
      cast: [],
      speaker: 'narrator',
      text: '她走在前面，裙摆被风掀起来一点。她一边走一边回头跟我说话，走两步就要确认我有没有跟上。\n这一年，她一直是这样确认我的。',
      next: 'c10_10'
    },
    {
      id: 'c10_10', chapter: 10,
      cast: [{ id: 'jin', pos: 'center', expr: 'soft', outfit: 'plaid', act: 'idle' }],
      speaker: 'inner',
      text: '有一次我问她，为什么总是回头看我。\n她说：「因为你不说话的时候，特别像要消失。」',
      next: 'c10_11'
    },

    /* ============ 二、江边与那张明信片 ============ */
    {
      id: 'c10_11', chapter: 10, scene: 'shanghai_night', tint: 'night', bgm: 'bgm_memory',
      cg: 'cg_newyear', cast: [],
      speaker: 'narrator',
      text: '江风比想象中凉。吃完饭我们没急着回去，就沿着江边一直走，看对岸的灯一格一格亮起来。',
      next: 'c10_12'
    },
    {
      id: 'c10_12', chapter: 10, cg: 'cg_newyear',
      cast: [{ id: 'ya', pos: 'center', expr: 'smile', outfit: 'dress', act: 'idle' }],
      speaker: 'ya',
      text: '喏。给你的。',
      next: 'c10_13'
    },
    {
      id: 'c10_13', chapter: 10, cg: 'cg_newyear', zoom: 'hand', hand: 'gift',
      cast: [{ id: 'ya', pos: 'center', expr: 'shy', outfit: 'dress', act: 'reach' }],
      speaker: 'narrator',
      text: '她从包里抽出一张猫猫明信片，递到我面前——正面是一只坐在窗台上的小三花，背面有字。',
      next: 'c10_14'
    },
    {
      id: 'c10_14', chapter: 10, scene: 'shanghai_night', zoom: 'bust',
      cast: [{ id: 'jin', pos: 'center', expr: 'surprised', outfit: 'plaid', act: 'idle' }],
      speaker: 'inner',
      text: '这一年，猫猫明信片一直是我写给她的。每次见面一张，从来没断过。\n……这是第一次，是她在上面写字。',
      next: 'c10_15'
    },
    {
      id: 'c10_15', chapter: 10, scene: 'shanghai_night',
      cast: [{ id: 'jin', pos: 'center', expr: 'moved', outfit: 'plaid', act: 'idle' }],
      speaker: 'narrator',
      text: '背面是她那种有点用力的圆体字——\n\n「石头先生：\n一年前的今天，我们在这条江边开始有点暧昧。更早一点，我在一张地图上，把一整年的心事都写给了你。\n你今天不用说什么。但如果想说，我在。\n——星星」',
      next: 'c10_16'
    },
    {
      id: 'c10_16', chapter: 10,
      cast: [
        { id: 'jin', pos: 'left', expr: 'moved', outfit: 'plaid', act: 'idle' },
        { id: 'ya', pos: 'right', expr: 'shy', outfit: 'dress', act: 'idle' }
      ],
      speaker: 'jin',
      text: '……你写「石头先生」的时候，是在笑我吗。\n……我不生气，我就是问问。',
      next: 'c10_17'
    },
    {
      id: 'c10_17', chapter: 10,
      cast: [
        { id: 'jin', pos: 'left', expr: 'shy', outfit: 'plaid', act: 'idle' },
        { id: 'ya', pos: 'right', expr: 'laugh', outfit: 'dress', act: 'idle' }
      ],
      speaker: 'ya',
      text: '当然是在笑你呀。\n你去年九月二十八号发的那条说说，我存下来了。你知道你写了多少字吗——快两千字。\n一个人能写出那么长的石头，我怎么可能看不懂。',
      next: 'c10_18'
    },
    {
      id: 'c10_18', chapter: 10, scene: 'shanghai_night',
      cast: [{ id: 'jin', pos: 'center', expr: 'blank', outfit: 'plaid', act: 'idle' }],
      speaker: 'inner',
      text: '她连那条说说的字数都记得。\n我那时候以为自己是块没人看的石头。其实一直有一颗星星，在很认真地读我。',
      next: 'c10_19'
    },
    {
      id: 'c10_19', chapter: 10,
      cast: [
        { id: 'jin', pos: 'left', expr: 'soft', outfit: 'plaid', act: 'idle' },
        { id: 'ya', pos: 'right', expr: 'smile', outfit: 'dress', act: 'idle' }
      ],
      speaker: 'ya',
      text: '走吧，回去。风太大了。\n而且——我有东西想给你看。',
      next: 'c10_20'
    },

    /* ============ 三、房间里摊开的一年 ============ */
    {
      id: 'c10_20', chapter: 10, scene: 'hotel', tint: 'night', bgm: 'bgm_quiet', beat: 'calm',
      cast: [],
      speaker: 'narrator',
      text: '回到房间，她把行李箱打开，又从包的各个口袋里一样一样往外掏。\n她一直这样：什么都记得带，什么都舍不得扔。',
      next: 'c10_21'
    },
    {
      id: 'c10_21', chapter: 10,
      cast: [{ id: 'ya', pos: 'center', expr: 'excited', outfit: 'home', act: 'reach' }],
      speaker: 'ya',
      text: '你看。',
      next: 'c10_22'
    },
    {
      id: 'c10_22', chapter: 10, cg: 'cg_anniversary', cast: [],
      speaker: 'narrator',
      text: '床上摊开了这一年：\n一只耳朵被捏扁过的兔子布偶；一叠按日期排好的猫猫明信片；三只大小不一的 Ginpu 玩偶；一只装着义乌小首饰的纸盒；还有她手机里，我手上那款猫猫美甲。\n就那样摊在床上，像一整年被人翻出来晒太阳。',
      next: 'c10_23'
    },
    {
      id: 'c10_23', chapter: 10,
      cast: [
        { id: 'jin', pos: 'left', expr: 'awkward', outfit: 'home', act: 'idle' },
        { id: 'ya', pos: 'right', expr: 'tease', outfit: 'home', act: 'idle' }
      ],
      speaker: 'ya',
      text: '尤其是这张。\n你手上的猫猫，到今天还是我最喜欢的照片。',
      next: 'c10_24'
    },
    {
      id: 'c10_24', chapter: 10, zoom: 'hand', hand: 'cat_nails',
      cast: [{ id: 'ya', pos: 'center', expr: 'proud', outfit: 'home', act: 'reach' }],
      speaker: 'ya',
      text: '你看，又是这个表情。\n每次说到这个，你耳朵就红。',
      next: 'c10_25'
    },
    {
      id: 'c10_25', chapter: 10, zoom: 'bust',
      cast: [
        { id: 'jin', pos: 'left', expr: 'shy', outfit: 'home', act: 'shy_hide' },
        { id: 'ya', pos: 'right', expr: 'laugh', outfit: 'home', act: 'idle' }
      ],
      speaker: 'jin',
      text: '那张是……那次是你说要试的。\n我一个男孩子做猫猫美甲，还发朋友圈。你让我以后怎么做人。\n……不过那张拍得确实还行。',
      next: 'c10_26'
    },
    {
      id: 'c10_26', chapter: 10, scene: 'hotel',
      cast: [
        { id: 'jin', pos: 'left', expr: 'shy', outfit: 'home', act: 'idle' },
        { id: 'ya', pos: 'right', expr: 'tease', outfit: 'home', act: 'idle' }
      ],
      speaker: 'ya',
      text: '你嘴上嫌弃，可你后来自己又拍了一张，藏在相册最里面那层。\n要不要我拿出来给你看呀？',
      next: 'c10_27'
    },
    {
      id: 'c10_27', chapter: 10,
      cast: [{ id: 'jin', pos: 'center', expr: 'panic', outfit: 'home', act: 'idle' }],
      speaker: 'inner',
      text: '她把手机翻过来的时候，我心跳漏了一下。\n不是因为羞耻——是因为被她看穿的那一刻，我居然没有想逃。这个人已经知道我最不敢给人看的那一面了，而且她觉得那很好。\n……我甚至有点想让她再翻一张。',
      next: 'c10_28'
    },

    /* ============ 四、选择：关于去年的那张地图 ============ */
    {
      id: 'c10_28', chapter: 10, scene: 'hotel', bgm: 'bgm_memory', beat: 'pulse',
      cast: [
        { id: 'jin', pos: 'left', expr: 'soft', outfit: 'home', act: 'sit' },
        { id: 'ya', pos: 'right', expr: 'smile', outfit: 'home', act: 'sit' }
      ],
      speaker: 'ya',
      text: '……你还记得去年九月二十七号吗。',
      next: 'c10_29'
    },
    {
      id: 'c10_29', chapter: 10,
      cast: [
        { id: 'jin', pos: 'left', expr: 'moved', outfit: 'home', act: 'sit' },
        { id: 'ya', pos: 'right', expr: 'smile', outfit: 'home', act: 'sit' }
      ],
      speaker: 'inner',
      text: '我当然记得。\n我记得那张地图上的每一条字。我记得十一点的时候一个人待在麦里哭。我记得十一点五十你们三个说「我网卡了」。\n我也记得零点钟声响起来的时候，你们一起喊「生日快乐」。',
      next: 'c10_30'
    },
    {
      id: 'c10_30', chapter: 10,
      cast: [
        { id: 'jin', pos: 'left', expr: 'shy', outfit: 'home', act: 'sit' },
        { id: 'ya', pos: 'right', expr: 'shy', outfit: 'home', act: 'sit' }
      ],
      speaker: 'ya',
      text: '那你说呀。你记得什么。',
      choices: [
        {
          text: '把地图上的标记一条一条背给她听：第一次一起玩排位、那句「你说你的朋友那天有事来不了」，还有「我们也会接纳你」。',
          hint: '（我想让她知道，我全都记得）',
          effects: { affection: 6, trust: 4, courage: 3, flags: { f_anniv: true } },
          next: 'c10_31a'
        },
        {
          text: '说记得十一点五十那十分钟——语音里突然只剩我一个人。',
          hint: '（那十分钟我到现在都怕）',
          effects: { affection: 4, trust: 6, courage: 2, flags: { f_anniv: true } },
          next: 'c10_31b'
        },
        {
          text: '低头说：我记得那句「因为看上你了」。我到现在都没敢再点开看过。',
          hint: '（说出来有点丢人）',
          effects: { affection: 5, trust: 5, courage: 5, flags: { f_anniv: true } },
          next: 'c10_31c'
        }
      ]
    },
    {
      id: 'c10_31a', chapter: 10,
      cast: [{ id: 'ya', pos: 'center', expr: 'surprised', outfit: 'home', act: 'sit' }],
      speaker: 'ya',
      text: '……你连「朋友那天有事来不了」那条都记得。\n那条是我写得最随意的。我还以为只有我自己会回头看。',
      next: 'c10_32'
    },
    {
      id: 'c10_31b', chapter: 10,
      cast: [{ id: 'ya', pos: 'center', expr: 'shy', outfit: 'home', act: 'sit' }],
      speaker: 'ya',
      text: '那十分钟……我们三个在楼下跑来着。她们说「赶紧的赶紧的，零点之前必须回去」，我鞋都没穿好。\n我怕你一个人待着会乱想。',
      next: 'c10_32'
    },
    {
      id: 'c10_31c', chapter: 10,
      cast: [{ id: 'ya', pos: 'center', expr: 'blush', outfit: 'home', act: 'sit' }],
      speaker: 'ya',
      text: '……你这个人。\n那句话我是凌晨一点五十五分打的。打完盯着屏幕看了很久，一直在想要不要撤回。',
      next: 'c10_32'
    },
    {
      id: 'c10_32', chapter: 10,
      cast: [
        { id: 'jin', pos: 'left', expr: 'soft', outfit: 'home', act: 'sit' },
        { id: 'ya', pos: 'right', expr: 'smile', outfit: 'home', act: 'sit' }
      ],
      speaker: 'ya',
      text: '那今天呢。',
      next: 'c10_33'
    },
    {
      id: 'c10_33', chapter: 10,
      cast: [{ id: 'jin', pos: 'center', expr: 'blank', outfit: 'home', act: 'sit' }],
      speaker: 'inner',
      text: '「那今天呢。」\n她说这句话的时候声音很轻，好像只要我不接，她就可以当作只是随口一问。\n可我看见了她的手指——她把指尖压在膝盖上，压得发白。',
      next: 'c10_34'
    },
    {
      id: 'c10_34', chapter: 10,
      cast: [{ id: 'jin', pos: 'center', expr: 'guilty', outfit: 'home', act: 'sit' }],
      speaker: 'inner',
      text: '这一年，我飞了很多次上海，写了很多张明信片，记住了她所有的小习惯。\n可我从没在她面前，把那句话完整地说出来过。\n我总在等一个更合适的时候——等我不那么笨，等我不那么怕，等我能配得上她这么用力地喜欢我。\n这句话我在心里念到第三遍，才发现自己一直攥着裤缝。',
      next: 'c10_35'
    },
    {
      id: 'c10_35', chapter: 10,
      cast: [{ id: 'jin', pos: 'center', expr: 'moved', outfit: 'home', act: 'sit' }],
      speaker: 'inner',
      text: '可是喜欢这件事，好像从来不需要我先变成别的什么人。\n石头也不用变成星星——它只要待在那里，就已经接住过一次温暖了。\n……我知道这话很土。可我手心全是汗。',
      next: 'c10_36'
    },

    /* ============ 五、关键选择：把话说出口 ============ */
    {
      id: 'c10_36', chapter: 10, bgm: 'bgm_ending', beat: 'swell', zoom: 'face',
      transition: 'slowfade',
      cast: [
        { id: 'jin', pos: 'left', expr: 'moved', outfit: 'home', act: 'sit' },
        { id: 'ya', pos: 'right', expr: 'shy', outfit: 'home', act: 'sit' }
      ],
      speaker: 'ya',
      text: '……你又在发呆。',
      choices: [
        {
          text: '抬起头，看着她的眼睛，把话说完。',
          hint: '（这一次不躲了）',
          effects: { affection: 8, trust: 6, courage: 8, flags: { f_confess: true } },
          next: 'c10_37_front'
        },
        {
          text: '先老实说：我怕我说不好，我怕让你失望。然后再往下说。',
          hint: '（把自己的怕也交出去）',
          effects: { affection: 6, trust: 7, courage: 5, flags: { f_confess: true } },
          next: 'c10_37_honest'
        },
        {
          text: '反问她：那你先说你去年为什么看上我。',
          hint: '（把球踢回去，给自己一点时间）',
          effects: { affection: 3, trust: 2, courage: -4, flags: {} },
          next: 'c10_37_ask'
        }
      ]
    },
    {
      id: 'c10_37_front', chapter: 10, zoom: 'face',
      cast: [
        { id: 'jin', pos: 'left', expr: 'soft', outfit: 'home', act: 'sit' },
        { id: 'ya', pos: 'right', expr: 'surprised', outfit: 'home', act: 'sit' }
      ],
      speaker: 'jin',
      text: '小崔。我喜欢你。\n不是「习惯了跟你打游戏」的那种喜欢，也不是「你对我好所以我要回报」的那种喜欢。\n是每次下高铁、看到出站口的时候，我会先找你在哪里的那种喜欢。',
      sfx: 'sfx_heart',
      next: 'c10_38'
    },
    {
      id: 'c10_38', chapter: 10, zoom: 'face',
      cast: [
        { id: 'jin', pos: 'left', expr: 'shy', outfit: 'home', act: 'sit' },
        { id: 'ya', pos: 'right', expr: 'blush', outfit: 'home', act: 'sit' }
      ],
      speaker: 'jin',
      text: '还有一件事，我一直不敢说。\n那次做猫猫美甲，还有你说想看我穿裙子——我嘴上说不要，其实我很高兴。\n因为在你面前，我不用一直是个高大一点的男生。',
      condition: { courage: { min: 55 } }, next: 'c10_39', else: 'c10_39b'
    },
    {
      id: 'c10_39', chapter: 10, zoom: 'face', beat: 'swell',
      cast: [
        { id: 'jin', pos: 'left', expr: 'moved', outfit: 'home', act: 'sit' },
        { id: 'ya', pos: 'right', expr: 'laugh', outfit: 'home', act: 'sit' }
      ],
      speaker: 'ya',
      text: '……我早就知道啦。\n你以为你藏得很好吗？你做完美甲那天，晚上回酒店照了七次镜子呢。',
      next: 'c10_40'
    },
    {
      id: 'c10_37_honest', chapter: 10, zoom: 'face',
      cast: [
        { id: 'jin', pos: 'left', expr: 'guilty', outfit: 'home', act: 'sit' },
        { id: 'ya', pos: 'right', expr: 'soft', outfit: 'home', act: 'sit' }
      ],
      speaker: 'jin',
      text: '我怕我说不好。我这个人不太会看气氛说话，整个人都很古板——这是我自己说的，去年加你好友的时候就说过了。\n可我还是想说。\n小崔，我喜欢你。',
      sfx: 'sfx_heart',
      next: 'c10_38'
    },
    {
      id: 'c10_39b', chapter: 10, zoom: 'face',
      cast: [
        { id: 'jin', pos: 'left', expr: 'shy', outfit: 'home', act: 'sit' },
        { id: 'ya', pos: 'right', expr: 'smile', outfit: 'home', act: 'sit' }
      ],
      speaker: 'ya',
      text: '嗯。\n我知道你还有没说完的。没关系呀，慢慢来——我们有的是时间。',
      next: 'c10_40'
    },
    {
      id: 'c10_37_ask', chapter: 10, zoom: 'face',
      cast: [
        { id: 'jin', pos: 'left', expr: 'awkward', outfit: 'home', act: 'sit' },
        { id: 'ya', pos: 'right', expr: 'tease', outfit: 'home', act: 'sit' }
      ],
      speaker: 'ya',
      text: '又来这一套。\n去年我就说过了——因为看上你了。你还想听我说第二遍吗？',
      next: 'c10_39c'
    },
    {
      id: 'c10_39c', chapter: 10, zoom: 'face',
      cast: [
        { id: 'jin', pos: 'left', expr: 'blank', outfit: 'home', act: 'sit' },
        { id: 'ya', pos: 'right', expr: 'shy', outfit: 'home', act: 'sit' }
      ],
      speaker: 'ya',
      text: '……好吧。那你听我说完。\n是我先看上你的，也是我先说的。\n但今天这句，我想听你自己说。',
      next: 'c10_40'
    },

    /* ============ 六、互道「男女朋友你好」 ============ */
    {
      id: 'c10_40', chapter: 10, zoom: 'bust', bgm: 'bgm_ending', beat: 'swell',
      cast: [
        { id: 'jin', pos: 'left', expr: 'moved', outfit: 'home', act: 'idle' },
        { id: 'ya', pos: 'right', expr: 'cry', outfit: 'home', act: 'idle' }
      ],
      speaker: 'narrator',
      text: '她笑了一下，眼泪却先掉下来。\n她伸手打我肩膀，力气很轻——像在确认我是真的站在这里。',
      next: 'c10_41'
    },
    {
      id: 'c10_41', chapter: 10,
      cast: [
        { id: 'jin', pos: 'left', expr: 'soft', outfit: 'home', act: 'idle' },
        { id: 'ya', pos: 'right', expr: 'cry', outfit: 'home', act: 'idle' }
      ],
      speaker: 'ya',
      text: '你知道我等这句话等了多久吗。\n去年九月二十七号，我打完那句「因为看上你了」，就一直在等你先开口。\n等了一年。',
      next: 'c10_42'
    },
    {
      id: 'c10_42', chapter: 10,
      cast: [
        { id: 'jin', pos: 'left', expr: 'guilty', outfit: 'home', act: 'idle' },
        { id: 'ya', pos: 'right', expr: 'smile', outfit: 'home', act: 'idle' }
      ],
      speaker: 'jin',
      text: '……对不起。\n我笨。\n……我真的很笨。',
      next: 'c10_43'
    },
    {
      id: 'c10_43', chapter: 10,
      cast: [
        { id: 'jin', pos: 'left', expr: 'smile', outfit: 'home', act: 'idle' },
        { id: 'ya', pos: 'right', expr: 'laugh', outfit: 'home', act: 'idle' }
      ],
      speaker: 'ya',
      text: '笨就笨吧。反正是我的。\n——重新来一次。',
      next: 'c10_44'
    },
    {
      id: 'c10_44', chapter: 10, zoom: 'face', transition: 'slowfade',
      cast: [
        { id: 'jin', pos: 'left', expr: 'shy', outfit: 'home', act: 'idle' },
        { id: 'ya', pos: 'right', expr: 'blush', outfit: 'home', act: 'idle' }
      ],
      speaker: 'ya',
      text: '你好，我叫小崔。\n你的女朋友。',
      sfx: 'sfx_heart',
      next: 'c10_45'
    },
    {
      id: 'c10_45', chapter: 10, zoom: 'face',
      cast: [
        { id: 'jin', pos: 'left', expr: 'moved', outfit: 'home', act: 'idle' },
        { id: 'ya', pos: 'right', expr: 'shy', outfit: 'home', act: 'idle' }
      ],
      speaker: 'jin',
      text: '你好。我是羊羊金。\n……你的男朋友。\n……这句话我想了一年。',
      effects: { affection: 6, trust: 4, courage: 4, flags: { f_official: true } },
      next: 'c10_46'
    },
    {
      id: 'c10_46', chapter: 10, scene: 'starfield', bgm: 'bgm_ending', beat: 'swell',
      cg: 'cg_anniversary', cast: [],
      speaker: 'narrator',
      text: '房间的灯被她关掉了。\n窗外是这座城市的夜。灯光落进来，落在床上那一叠猫猫明信片上——很小，很安静，像一片星。',
      next: 'c10_47'
    },
    {
      id: 'c10_47', chapter: 10,
      cast: [{ id: 'jin', pos: 'center', expr: 'soft', outfit: 'home', act: 'look_up' }],
      speaker: 'inner',
      text: '一年前，我在一张地图上被一颗星星照着，第一次觉得自己存在。\n这一年我做的每一个看起来很小的选择——在美甲店里伸出去的那只手、捂着奶茶走进她家的那一步、在楼下风里犹豫的那六分钟——原来都把我送到了这里。\n今天我才明白——石头不需要变成星星。它只要把接住的那点温暖记住，就已经是回答了。',
      next: 'c10_48'
    },
    {
      id: 'c10_48', chapter: 10,
      cast: [{ id: 'jin', pos: 'center', expr: 'smile', outfit: 'home', act: 'idle' }],
      speaker: 'inner',
      text: '她说：我们有的是时间。\n……好。那就慢慢来。',
      next: 'c10_49'
    },
    { id: 'c10_49', chapter: 10, speaker: 'narrator', text: '——', next: 'c10_router' }
  ]);
})();
