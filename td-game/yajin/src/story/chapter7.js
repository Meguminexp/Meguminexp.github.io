/* 《你好！一周年》第七章 · 每个月都去见你（2025.12–2026.01） —— 剧本组 D
 * 场景：shanghai_night / kitchen / theatre / hotel
 * 音乐：bgm_warm → bgm_game（手工·蛋糕）→ bgm_ending（跨年 swell）
 * flag：f_monthly_visit f_craft_together f_musical_sleep f_cake_together f_newyear
 * 选择：⑩ 交响乐演出睡着后怎么解释  ⑪ 期末她熬夜时要不要陪
 */
(function () {
  'use strict';
  YJ.story.add([

    /* =========================================================
     *  12 月初 · 两张机票与再飞一次的决定
     * ========================================================= */
    {
      id: 'c7_01', chapter: 7, scene: 'dorm', tint: 'night', bgm: 'bgm_warm', ambience: 'keyboard',
      cast: [{ id: 'jin', pos: 'center', expr: 'neutral', outfit: 'casual', act: 'sit' }],
      speaker: 'narrator',
      text: '十二月一号，我在宿舍的小桌上摊开手机日历。\n十一月苏州的记忆还没凉，机票搜索页又被我点开了一次。',
      transition: 'fade', titlecard: '2025 · 12 · 01', next: 'c7_02'
    },
    {
      id: 'c7_02', chapter: 7,
      speaker: 'inner',
      text: '我说过很多次我这个人很古板。古板的人不会一个月飞一次。\n可我把日程从十二月排到一月，发现只剩三个周末是空的。\n……三个。',
      cast: [{ id: 'jin', pos: 'center', expr: 'blank', outfit: 'casual', act: 'sit' }],
      next: 'c7_03'
    },
    {
      id: 'c7_03', chapter: 7, chat: [
        { from: 'ya', text: '在干嘛呀', time: '22:10:18' },
        { from: 'jin', text: '看日历', time: '22:12:04' },
        { from: 'ya', text: '看日历干什么', time: '22:12:31' },
        { from: 'jin', text: '看看哪几天可以消失', time: '22:13:02' },
        { from: 'ya', text: '？？？', time: '22:13:09' },
        { from: 'ya', text: '你要去哪', time: '22:13:20' },
        { from: 'jin', text: '上海', time: '22:14:47' },
        { from: 'ya', text: '……', time: '22:14:52' },
        { from: 'ya', text: '你等一下', time: '22:15:03' },
        { from: 'ya', text: '我要去照一下镜子看看我是不是在做梦', time: '22:15:11' }
      ],
      next: 'c7_04'
    },
    {
      id: 'c7_04', chapter: 7,
      speaker: 'inner',
      text: '她那种人，说话从来不给别人留退路。\n我盯着屏幕上那两个字看了很久，才反应过来——我已经把话说出口了。\n……上海。我说出口了。',
      cast: [{ id: 'jin', pos: 'center', expr: 'shy', outfit: 'casual', act: 'sit' }],
      next: 'c7_05'
    },
    {
      id: 'c7_05', chapter: 7, chat: [
        { from: 'ya', text: '你什么时候变得这么主动了', time: '22:16:40' },
        { from: 'jin', text: '机票便宜', time: '22:17:12' },
        { from: 'ya', text: '骗人', time: '22:17:20' },
        { from: 'ya', text: '十二月的机票一点都不便宜', time: '22:17:33' },
        { from: 'jin', text: '……', time: '22:18:01' },
        { from: 'ya', text: '那你要来几次', time: '22:18:44' },
        { from: 'jin', text: '看情况', time: '22:19:05' },
        { from: 'ya', text: '看什么情况', time: '22:19:19' },
        { from: 'jin', text: '看你想不想我', time: '22:21:37' },
        { from: 'ya', text: '发了一张猫猫贴纸', time: '22:21:45' },
        { from: 'ya', text: '这句话你打了多久', time: '22:21:58' },
        { from: 'jin', text: '两分钟', time: '22:22:10' },
        { from: 'ya', text: '我就知道哈哈哈哈哈', time: '22:22:14' }
      ],
      effects: { affection: 4, trust: 2, courage: 3, flags: { f_monthly_visit: true } },
      next: 'c7_06'
    },
    {
      id: 'c7_06', chapter: 7,
      speaker: 'inner',
      text: '两分钟，只为了一句话。\n我想说的其实是另外一句更长的。可屏幕上最后留下的，还是「看你想不想我」。',
      cast: [{ id: 'jin', pos: 'center', expr: 'soft', outfit: 'casual', act: 'sit' }],
      next: 'c7_07'
    },
    {
      id: 'c7_07', chapter: 7, sfx: 'sfx_msg',
      speaker: 'narrator',
      text: '那天晚上，我的手机屏幕上多了一串航班号、一列高铁时刻，还有一张她画得歪歪扭扭的「见面日历」。',
      next: 'c7_08'
    },

    /* =========================================================
     *  12 月中 · 去程：地铁、出口、她来接我
     * ========================================================= */
    {
      id: 'c7_08', chapter: 7, scene: 'airport', tint: 'night', bgm: 'bgm_warm', ambience: 'crowd',
      cast: [{ id: 'jin', pos: 'center', expr: 'sleepy', outfit: 'winter', act: 'idle' }],
      speaker: 'narrator',
      text: '十二月中旬，我又一次落地浦东。风从自动门缝里灌进来，我把围巾往上拉到鼻子。\n才想起这是我第三次一个人来。',
      transition: 'slowfade', titlecard: '2025 · 12 · 13  夜', next: 'c7_09'
    },
    {
      id: 'c7_09', chapter: 7,
      speaker: 'jin',
      text: '……我到了。\n你别站在风口啊。找个有暖气的地方等着。',
      cast: [{ id: 'jin', pos: 'center', expr: 'neutral', outfit: 'winter', act: 'idle' }],
      next: 'c7_10'
    },
    {
      id: 'c7_10', chapter: 7, chat: [
        { from: 'ya', text: '我没在风口', time: '21:03:12' },
        { from: 'ya', text: '我在2号航站楼的柱子后面', time: '21:03:20' },
        { from: 'ya', text: '这样你一出来我就能先看到你', time: '21:03:41' },
        { from: 'jin', text: '……好', time: '21:04:30' }
      ],
      next: 'c7_11'
    },
    {
      id: 'c7_11', chapter: 7,
      speaker: 'inner',
      text: '「这样你一出来我就能先看到你。」\n她大概只是随口说的。可我从摆渡车下来，一直到取行李，都在想这句话。',
      cast: [{ id: 'jin', pos: 'center', expr: 'shy', outfit: 'winter', act: 'idle' }],
      next: 'c7_12'
    },
    {
      id: 'c7_12', chapter: 7, sfx: 'sfx_ding', transition: 'slowfade', zoom: 'face',
      cast: [
        { id: 'ya', pos: 'left', expr: 'excited', outfit: 'dress', act: 'reach' },
        { id: 'jin', pos: 'right', expr: 'surprised', outfit: 'winter', act: 'idle' }
      ],
      speaker: 'narrator',
      text: '她真的在柱子后面。洛丽塔裙子外面罩了件短外套，及肩的短发被风吹得往一边偏，肩上挂着一个毛茸茸的小包。\n她踮着脚朝我挥手——鼻梁两侧那层很淡的小雀斑，我隔着人群也认得出来。',
      next: 'c7_13'
    },
    {
      id: 'c7_13', chapter: 7,
      speaker: 'ya',
      text: '你走得好慢呀。我在这儿站了二十分钟，脚都冻硬了。',
      cast: [{ id: 'ya', pos: 'left', expr: 'pout', outfit: 'dress', act: 'idle' }, { id: 'jin', pos: 'right', expr: 'awkward', outfit: 'winter', act: 'idle' }],
      next: 'c7_14'
    },
    {
      id: 'c7_14', chapter: 7,
      speaker: 'jin',
      text: '那你怎么不早说啊。\n我不是说了让你去里面等的。',
      next: 'c7_15'
    },
    {
      id: 'c7_15', chapter: 7,
      speaker: 'ya',
      text: '里面看不到你呀。',
      cast: [{ id: 'ya', pos: 'left', expr: 'smile', outfit: 'dress', act: 'idle' }, { id: 'jin', pos: 'right', expr: 'shy', outfit: 'winter', act: 'idle' }],
      next: 'c7_16'
    },
    {
      id: 'c7_16', chapter: 7, sfx: 'sfx_heart',
      speaker: 'inner',
      text: '她伸手来接我的箱子。我躲了一下，说「很重」。她说「我又不是拎不动」。\n最后是我拎着箱子，她把我的手拽住——一人一半。',
      cast: [{ id: 'ya', pos: 'left', expr: 'proud', outfit: 'dress', act: 'reach' }, { id: 'jin', pos: 'right', expr: 'soft', outfit: 'winter', act: 'reach' }],
      next: 'c7_17'
    },
    {
      id: 'c7_17', chapter: 7,
      speaker: 'narrator',
      text: '我们坐地铁二号线进城。车厢里人不多，暖风把车窗吹出一层雾。她把外套脱了搭在手臂上，及肩的短发被吹乱，那枚银色发夹还别在左边。',
      next: 'c7_18'
    },
    {
      id: 'c7_18', chapter: 7,
      speaker: 'ya',
      text: '你猜我给你准备了什么？',
      cast: [{ id: 'ya', pos: 'left', expr: 'tease', outfit: 'dress', act: 'sit' }, { id: 'jin', pos: 'right', expr: 'blank', outfit: 'winter', act: 'sit' }],
      next: 'c7_19'
    },
    {
      id: 'c7_19', chapter: 7,
      speaker: 'jin',
      text: '……猜不到。\n我这个人，不太会猜这种东西。\n……你直接告诉我吧。',
      next: 'c7_20'
    },
    {
      id: 'c7_20', chapter: 7,
      speaker: 'ya',
      text: '那你就别问啦。到时候你自然会知道。',
      cast: [{ id: 'ya', pos: 'left', expr: 'proud', outfit: 'dress', act: 'sit' }, { id: 'jin', pos: 'right', expr: 'soft', outfit: 'winter', act: 'sit' }],
      next: 'c7_21'
    },
    {
      id: 'c7_21', chapter: 7, transition: 'slowfade',
      speaker: 'narrator',
      text: '地铁过江的时候，车厢晃了一下。她顺势把头靠在我肩上，说「就靠一会儿」。\n那一会儿一直靠到了人民广场。',
      cast: [{ id: 'ya', pos: 'left', expr: 'sleepy', outfit: 'dress', act: 'lean' }, { id: 'jin', pos: 'right', expr: 'shy', outfit: 'winter', act: 'sit' }],
      next: 'c7_22'
    },
    {
      id: 'c7_22', chapter: 7,
      speaker: 'inner',
      text: '我全程没敢动。肩膀麻了也没动。\n我怕她醒，又怕她其实没睡——只是在看我敢不敢动。\n到站的时候，我那条手臂已经抬不起来了。',
      cast: [{ id: 'jin', pos: 'right', expr: 'shy', outfit: 'winter', act: 'sit' }],
      next: 'c7_23'
    },

    /* =========================================================
     *  上海 · 夜景与酒店（她把行程排得满满的）
     * ========================================================= */
    {
      id: 'c7_23', chapter: 7, scene: 'shanghai_night', tint: 'night', bgm: 'bgm_warm', ambience: 'crowd',
      cast: [
        { id: 'ya', pos: 'left', expr: 'excited', outfit: 'dress', act: 'idle' },
        { id: 'jin', pos: 'right', expr: 'neutral', outfit: 'winter', act: 'idle' }
      ],
      speaker: 'narrator',
      text: '出了地铁，整条街都亮着。十二月中的上海已经挂起了灯，风从楼与楼之间穿过来，把她裙摆的褶子一层层掀起来。',
      transition: 'fade', next: 'c7_24'
    },
    {
      id: 'c7_24', chapter: 7,
      speaker: 'ya',
      text: '你看那边。这个灯只有冬天才挂。\n我上周路过就想着，要带你来看。',
      cast: [{ id: 'ya', pos: 'left', expr: 'smile', outfit: 'dress', act: 'idle' }, { id: 'jin', pos: 'right', expr: 'smile', outfit: 'winter', act: 'idle' }],
      next: 'c7_25'
    },
    {
      id: 'c7_25', chapter: 7,
      speaker: 'inner',
      text: '「我上周路过就想着，要带你来看。」\n她一个人走过这条路的时候，就已经把我也放进去了。这种事她从来不说——她只做。',
      cast: [{ id: 'jin', pos: 'right', expr: 'moved', outfit: 'winter', act: 'idle' }],
      next: 'c7_26'
    },
    {
      id: 'c7_26', chapter: 7,
      speaker: 'jin',
      text: '……冷不冷啊。\n冷的话，我们去吃点热的。',
      cast: [{ id: 'jin', pos: 'right', expr: 'soft', outfit: 'winter', act: 'idle' }],
      next: 'c7_27'
    },
    {
      id: 'c7_27', chapter: 7,
      speaker: 'ya',
      text: '你这个人真的很不会讲好听话呀。\n……但是好。我要吃热的。',
      cast: [{ id: 'ya', pos: 'left', expr: 'laugh', outfit: 'dress', act: 'idle' }, { id: 'jin', pos: 'right', expr: 'awkward', outfit: 'winter', act: 'idle' }],
      sfx: 'sfx_laugh', next: 'c7_28'
    },
    {
      id: 'c7_28', chapter: 7, scene: 'hotel', tint: 'night',
      cast: [{ id: 'jin', pos: 'center', expr: 'neutral', outfit: 'casual', act: 'sit' }],
      speaker: 'narrator',
      text: '酒店在一条安静的支路上。房间不大，窗子对着弄堂的屋顶。她把行李箱推到墙角，往床上一坐，掏出手机开始念行程。',
      transition: 'fade', next: 'c7_29'
    },
    {
      id: 'c7_29', chapter: 7,
      speaker: 'ya',
      text: '明天上午做手工，下午做蛋糕。后天下午去外滩，晚上看演出——看完正好跨年。',
      cast: [{ id: 'ya', pos: 'center', expr: 'serious', outfit: 'home', act: 'sit' }, { id: 'jin', pos: 'right', expr: 'blank', outfit: 'casual', act: 'sit' }],
      next: 'c7_30'
    },
    {
      id: 'c7_30', chapter: 7,
      speaker: 'jin',
      text: '……你什么时候排的啊。\n我这边，什么都没准备。',
      next: 'c7_31'
    },
    {
      id: 'c7_31', chapter: 7,
      speaker: 'ya',
      text: '我排了两个星期呢。\n你别一副被安排的样子。你要是有想法，可以说。',
      cast: [{ id: 'ya', pos: 'center', expr: 'pout', outfit: 'home', act: 'sit' }, { id: 'jin', pos: 'right', expr: 'awkward', outfit: 'casual', act: 'sit' }],
      next: 'c7_32'
    },
    {
      id: 'c7_32', chapter: 7,
      speaker: 'jin',
      text: '没有。我……不是那个意思。\n我只是不太习惯，有人替我把两天都排好。',
      next: 'c7_33'
    },
    {
      id: 'c7_33', chapter: 7,
      speaker: 'inner',
      text: '「不太习惯」这四个字我说出口了。其实我想说的是谢谢。\n我这个人就是这样——最该说的那句，总是最后一个才想明白。',
      cast: [{ id: 'jin', pos: 'right', expr: 'soft', outfit: 'casual', act: 'sit' }],
      next: 'c7_34'
    },
    {
      id: 'c7_34', chapter: 7,
      speaker: 'ya',
      text: '那你就习惯一下咯。反正以后每个月都要排。',
      cast: [{ id: 'ya', pos: 'center', expr: 'tease', outfit: 'home', act: 'sit' }, { id: 'jin', pos: 'right', expr: 'shy', outfit: 'casual', act: 'sit' }],
      effects: { affection: 3, trust: 2 }, next: 'c7_35'
    },

    /* =========================================================
     *  12 · 14 上午 · 一起做手工（猫猫拼图）
     * ========================================================= */
    {
      id: 'c7_35', chapter: 7, scene: 'hotel', tint: 'day', bgm: 'bgm_game', beat: 'pulse',
      cast: [
        { id: 'ya', pos: 'center', expr: 'excited', outfit: 'home', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'neutral', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'narrator',
      text: '第二天早上，她从行李箱最底下拖出一个纸箱，往地毯上一倒。\n一整盒碎片，哗啦一下铺开，里面还压着一张小小的图纸。',
      titlecard: '2025 · 12 · 14  上午', transition: 'fade', next: 'c7_36'
    },
    {
      id: 'c7_36', chapter: 7,
      speaker: 'ya',
      text: '猫猫拼图。一千片。\n我买了两盒，一盒我自己拼过了。这盒我们一起拼。',
      next: 'c7_37'
    },
    {
      id: 'c7_37', chapter: 7,
      speaker: 'jin',
      text: '一千片？\n我们今天拼得完吗……',
      cast: [{ id: 'jin', pos: 'right', expr: 'surprised', outfit: 'casual', act: 'sit' }],
      next: 'c7_38'
    },
    {
      id: 'c7_38', chapter: 7,
      speaker: 'ya',
      text: '拼不完就留着呀。反正你还要来的。',
      cast: [{ id: 'ya', pos: 'center', expr: 'proud', outfit: 'home', act: 'sit' }, { id: 'jin', pos: 'right', expr: 'soft', outfit: 'casual', act: 'sit' }],
      next: 'c7_39'
    },
    {
      id: 'c7_39', chapter: 7,
      speaker: 'narrator',
      text: '我们先找边框。她把同色的碎片一片片翻过去，按深浅分成四堆，分得比做实验还认真；我负责按图纸找猫耳朵那几块。',
      next: 'c7_40'
    },
    {
      id: 'c7_40', chapter: 7,
      speaker: 'ya',
      text: '你找错了。这块是尾巴，不是耳朵。',
      cast: [{ id: 'ya', pos: 'center', expr: 'laugh', outfit: 'home', act: 'reach' }, { id: 'jin', pos: 'right', expr: 'awkward', outfit: 'casual', act: 'reach' }],
      next: 'c7_41'
    },
    {
      id: 'c7_41', chapter: 7,
      speaker: 'jin',
      text: '……可图纸上这两块长得一样啊。',
      next: 'c7_42'
    },
    {
      id: 'c7_42', chapter: 7,
      speaker: 'ya',
      text: '不一样的好吧。耳朵是尖的，尾巴是圆的。\n你看这里——有一个小尖尖。',
      cast: [{ id: 'ya', pos: 'center', expr: 'serious', outfit: 'home', act: 'reach' }, { id: 'jin', pos: 'right', expr: 'soft', outfit: 'casual', act: 'reach' }],
      next: 'c7_43'
    },
    {
      id: 'c7_43', chapter: 7,
      speaker: 'inner',
      text: '她认真起来的时候会不自觉地盘起腿，整个人缩成小小一团，手指在碎片上敲。\n我看了很久，才想起来该继续找。\n……我明明是在找猫耳朵。',
      cast: [{ id: 'jin', pos: 'right', expr: 'soft', outfit: 'casual', act: 'sit' }],
      next: 'c7_44'
    },
    {
      id: 'c7_44', chapter: 7,
      speaker: 'narrator',
      text: '到中午，我们只拼出了底下那一排和两只猫耳朵。她拍了张照片，配文「合作进度百分之七」。\n我抗议，她说不许改。',
      sfx: 'sfx_camera', next: 'c7_45'
    },
    {
      id: 'c7_45', chapter: 7,
      speaker: 'ya',
      text: '留个纪念嘛。等你下次来，我们接着拼，我就接着拍。',
      cast: [{ id: 'ya', pos: 'center', expr: 'smile', outfit: 'home', act: 'sit' }, { id: 'jin', pos: 'right', expr: 'smile', outfit: 'casual', act: 'sit' }],
      effects: { affection: 5, trust: 3, flags: { f_craft_together: true } }, next: 'c7_46'
    },

    /* =========================================================
     *  12 · 14 下午 · 一起做蛋糕（她抹了我一鼻子奶油）
     * ========================================================= */
    {
      id: 'c7_46', chapter: 7, scene: 'kitchen', tint: 'day', bgm: 'bgm_game', beat: 'pulse',
      cast: [
        { id: 'ya', pos: 'center', expr: 'excited', outfit: 'home', act: 'idle' },
        { id: 'jin', pos: 'right', expr: 'neutral', outfit: 'casual', act: 'idle' }
      ],
      speaker: 'narrator',
      text: '下午我们去了一家能自己做蛋糕的店。\n围裙是粉色的。她挑了最小的一件，套上还是宽得能盖住半个人。\n我那件袖子上有块巧克力印，洗不掉的。',
      titlecard: '2025 · 12 · 14  下午', transition: 'fade', next: 'c7_47'
    },
    {
      id: 'c7_47', chapter: 7,
      speaker: 'ya',
      text: '你切黄油，切小块就行。蛋帮我打散——打到看不见蛋白那种。\n剩下的我来。',
      next: 'c7_48'
    },
    {
      id: 'c7_48', chapter: 7,
      speaker: 'jin',
      text: '……这个秤，是不是要先归零。\n我按了，没反应。',
      cast: [{ id: 'jin', pos: 'right', expr: 'blank', outfit: 'casual', act: 'reach' }],
      next: 'c7_49'
    },
    {
      id: 'c7_49', chapter: 7,
      speaker: 'ya',
      text: '你要按那个「去皮」。\n……算了，秤给我。你专心打蛋，这个你能干。',
      cast: [{ id: 'ya', pos: 'center', expr: 'laugh', outfit: 'home', act: 'reach' }, { id: 'jin', pos: 'right', expr: 'awkward', outfit: 'casual', act: 'reach' }],
      sfx: 'sfx_laugh', next: 'c7_50'
    },
    {
      id: 'c7_50', chapter: 7,
      speaker: 'narrator',
      text: '我搅奶油，她称粉、筛粉、翻拌。她做这些的时候手很稳，刮刀贴着盆壁转一圈，盆底一点干的都不剩。\n我搅到手腕发酸，她那盆已经拌得看不出颗粒了。',
      next: 'c7_51'
    },
    {
      id: 'c7_51', chapter: 7,
      speaker: 'jin',
      text: '……你们学生物的，动手能力是不是都这样。\n……我搅了十分钟了。',
      cast: [{ id: 'jin', pos: 'right', expr: 'serious', outfit: 'casual', act: 'idle' }],
      next: 'c7_52'
    },
    {
      id: 'c7_52', chapter: 7,
      speaker: 'ya',
      text: '那当然呀。我一天要移几百次液，手抖一下就报废。\n你这盆奶油搅得也行——就是慢。',
      cast: [{ id: 'ya', pos: 'center', expr: 'tease', outfit: 'home', act: 'idle' }, { id: 'jin', pos: 'right', expr: 'awkward', outfit: 'casual', act: 'idle' }],
      next: 'c7_53'
    },
    {
      id: 'c7_53', chapter: 7, sfx: 'sfx_heart',
      speaker: 'narrator',
      text: '奶油打好的时候是雪一样的白。她挖了一大勺，举到半空，说「你脸上有一点点」。\n我知道我脸上什么都没有。',
      transition: 'slowfade', next: 'c7_54'
    },
    {
      id: 'c7_54', chapter: 7, zoom: 'face', transition: 'slowfade',
      cast: [
        { id: 'ya', pos: 'left', expr: 'laugh', outfit: 'home', act: 'reach' },
        { id: 'jin', pos: 'right', expr: 'surprised', outfit: 'casual', act: 'idle' }
      ],
      speaker: 'narrator',
      text: '然后那勺奶油就贴到了我鼻尖上。凉的。\n她笑得整个人往后仰，围裙带子滑下肩膀，眼睛弯成两个月牙。',
      next: 'c7_55'
    },
    {
      id: 'c7_55', chapter: 7,
      speaker: 'jin',
      text: '……你干嘛啊。\n……凉的。',
      cast: [{ id: 'jin', pos: 'right', expr: 'blank', outfit: 'casual', act: 'idle' }],
      next: 'c7_56'
    },
    {
      id: 'c7_56', chapter: 7,
      speaker: 'ya',
      text: '惩罚呀。谁让你说我慢。',
      cast: [{ id: 'ya', pos: 'left', expr: 'proud', outfit: 'home', act: 'idle' }, { id: 'jin', pos: 'right', expr: 'awkward', outfit: 'casual', act: 'idle' }],
      next: 'c7_57'
    },
    {
      id: 'c7_57', chapter: 7,
      speaker: 'inner',
      text: '我本可以抹回去。手都抬到一半了。\n可我看见她睫毛上沾着一点糖粉，正低着头把最后一块奶油刮到蛋糕边上。那一勺就停在半空，没落下去。',
      cast: [{ id: 'jin', pos: 'right', expr: 'shy', outfit: 'casual', act: 'idle' }],
      next: 'c7_58'
    },
    {
      id: 'c7_58', chapter: 7,
      speaker: 'narrator',
      text: '蛋糕最后做得挺像样。她抹的那圈奶油是平的，边上用叉子压了一圈纹路，中间摆了几颗草莓。\n我提心吊胆插上去的那几颗位置歪了一点，她伸手挪正了。',
      sfx: 'sfx_camera', next: 'c7_59'
    },
    {
      id: 'c7_59', chapter: 7,
      speaker: 'ya',
      text: '我拍照了。这张要留一辈子。\n你鼻子上那坨奶油也太可爱了。',
      cast: [{ id: 'ya', pos: 'left', expr: 'tease', outfit: 'home', act: 'idle' }, { id: 'jin', pos: 'right', expr: 'panic', outfit: 'casual', act: 'reach' }],
      next: 'c7_60'
    },
    {
      id: 'c7_60', chapter: 7,
      speaker: 'jin',
      text: '删掉。\n……我是说，那张删掉。',
      next: 'c7_61'
    },
    {
      id: 'c7_61', chapter: 7,
      speaker: 'ya',
      text: '不删。你自己看，你笑起来其实挺好看的嘛。',
      cast: [{ id: 'ya', pos: 'left', expr: 'smile', outfit: 'home', act: 'idle' }, { id: 'jin', pos: 'right', expr: 'shy', outfit: 'casual', act: 'idle' }],
      effects: { affection: 6, trust: 3, flags: { f_cake_together: true } }, next: 'c7_62'
    },
    {
      id: 'c7_62', chapter: 7,
      speaker: 'inner',
      text: '那个蛋糕我们一人切了一块。奶油不腻，蛋糕体是软的，草莓的酸正好压住甜。\n我知道自己其实不介意那张照片。我只是不习惯被人这样看着，还被说「好看」。',
      cast: [{ id: 'jin', pos: 'right', expr: 'soft', outfit: 'casual', act: 'sit' }],
      next: 'c7_63'
    },

    /* =========================================================
     *  12 · 31 – 01 · 01 跨年 · 意大利交响乐团演出（后半段我睡着了）
     * ========================================================= */
    {
      id: 'c7_63', chapter: 7, scene: 'theatre', tint: 'night', bgm: 'bgm_warm', beat: 'calm',
      cast: [
        { id: 'ya', pos: 'left', expr: 'excited', outfit: 'dress', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'neutral', outfit: 'formal', act: 'sit' }
      ],
      speaker: 'narrator',
      text: '那之后我们各自忙了半个月，只在视频里见过几次。再见面，是十二月三十一号晚上七点半——我们坐在音乐厅里。意大利交响乐团的跨年演出，她提前两个月订的票，第五排正中间。\n她说这个位置「看得到首席小提琴的鞋」。',
      titlecard: '2025 · 12 · 31  19:30', transition: 'slowfade', next: 'c7_64'
    },
    {
      id: 'c7_64', chapter: 7,
      speaker: 'ya',
      text: '你紧张什么呀，又不是你上台。',
      next: 'c7_65'
    },
    {
      id: 'c7_65', chapter: 7,
      speaker: 'jin',
      text: '我没紧张。我在看节目单。\n……看不懂。\n……真的没紧张。',
      cast: [{ id: 'jin', pos: 'right', expr: 'awkward', outfit: 'formal', act: 'sit' }],
      next: 'c7_66'
    },
    {
      id: 'c7_66', chapter: 7,
      speaker: 'inner',
      text: '我确实紧张。这是我第一次进音乐厅。\n我甚至提前查了「听交响乐要注意什么」，查到「乐章之间不要鼓掌」这一条，就把它记到备忘录里了。',
      cast: [{ id: 'jin', pos: 'right', expr: 'blank', outfit: 'formal', act: 'sit' }],
      next: 'c7_67'
    },
    {
      id: 'c7_67', chapter: 7,
      speaker: 'narrator',
      text: '灯暗下来，序曲响起来的时候，她轻轻抓住了我的袖子。\n我听到她很小声地吸了一口气，像小孩第一次看到海。',
      next: 'c7_68'
    },
    {
      id: 'c7_68', chapter: 7, beat: 'pulse',
      speaker: 'narrator',
      text: '上半场全是交响曲，一首接一首，没有一个人唱。她全程坐得笔直，闭眼的时候眉毛会跟着旋律动。中场休息还在跟我数刚才哪一段铜管最亮，一句都不许我漏听。',
      next: 'c7_69'
    },
    {
      id: 'c7_69', chapter: 7,
      speaker: 'ya',
      text: '下半场有德沃夏克《自新大陆》的第二乐章。里面有段英国管，特别慢，特别好听。\n你等会儿注意听。',
      cast: [{ id: 'ya', pos: 'left', expr: 'smile', outfit: 'dress', act: 'sit' }, { id: 'jin', pos: 'right', expr: 'smile', outfit: 'formal', act: 'sit' }],
      next: 'c7_70'
    },
    {
      id: 'c7_70', chapter: 7,
      speaker: 'jin',
      text: '好。我一定听。\n……你指给我听。',
      next: 'c7_71'
    },
    {
      id: 'c7_71', chapter: 7,
      speaker: 'inner',
      text: '这两天我一共睡了不到七个小时。前一晚赶报告到两点，早上六点起来赶地铁。\n坐下的时候没觉得什么。灯一暗，暖风一吹，眼皮就开始沉。\n我掐了自己手背一下。没用。',
      cast: [{ id: 'jin', pos: 'right', expr: 'sleepy', outfit: 'formal', act: 'sleepy' }],
      next: 'c7_72'
    },
    {
      id: 'c7_72', chapter: 7, beat: 'calm', transition: 'slowfade',
      speaker: 'narrator',
      text: '下半场刚开始没多久，那段英国管的旋律起来了。\n前几个音我听进去了。后面……后面的就变成了一层嗡嗡声，很远，很软。',
      next: 'c7_73'
    },
    {
      id: 'c7_73', chapter: 7, transition: 'slowfade',
      speaker: 'narrator',
      text: '我的头往右偏了一点，又偏了一点，最后落在座椅靠背和她的肩膀之间。\n整个剧场暗着，没有人注意到第五排最右边那个睡着的人。',
      next: 'c7_74'
    },
    {
      id: 'c7_74', chapter: 7, sfx: 'sfx_camera', transition: 'flash',
      speaker: 'narrator',
      text: '——那是一声很轻的快门。手机镜头对着我的侧脸、我微张的嘴，还有她肩膀上那件外套被我压出来的褶子。\n她连拍了三张。',
      next: 'c7_75'
    },
    {
      id: 'c7_75', chapter: 7, scene: 'theatre', tint: 'night', beat: 'swell',
      speaker: 'narrator',
      text: '最后一首收尾，掌声把我拍醒。我睁眼，第一眼看见的是她收回手机的动作，第二眼是她脸上那种「什么都没发生过」的表情。',
      next: 'c7_76'
    },
    {
      id: 'c7_76', chapter: 7,
      speaker: 'jin',
      text: '……结束了吗。\n我好像，睡了一会儿……\n……不是吧。',
      cast: [{ id: 'jin', pos: 'right', expr: 'panic', outfit: 'formal', act: 'sit' }],
      next: 'c7_77'
    },
    {
      id: 'c7_77', chapter: 7,
      speaker: 'ya',
      text: '嗯。下半场。\n你从头睡到尾，《自新大陆》都放完了。',
      cast: [{ id: 'ya', pos: 'left', expr: 'tease', outfit: 'dress', act: 'sit' }, { id: 'jin', pos: 'right', expr: 'guilty', outfit: 'formal', act: 'sit' }],
      next: 'c7_78'
    },
    {
      id: 'c7_78', chapter: 7,
      speaker: 'inner',
      text: '我第一反应是完了。她准备了两个月的票，我睡掉了半场。\n我脑子里已经在排道歉的话了，可她那副表情又不太像生气。\n……她越是这样，我越慌。',
      next: 'c7_79'
    },
    {
      id: 'c7_79', chapter: 7, choices: [
        {
          text: '老实认了：这两天只睡了七个小时，对不起，你最喜欢的这首我一句都没听到',
          hint: '（她准备了两个月的票，我不想用借口糊过去）',
          effects: { trust: 5, courage: 4, flags: { f_musical_sleep: true } },
          next: 'c7_80a'
        },
        {
          text: '嘴硬说自己没睡，只是闭眼听音乐',
          hint: '（我确实想保住面子）',
          effects: { affection: 1, courage: -3 },
          next: 'c7_80b'
        },
        {
          text: '反过来说她肩膀太舒服，责任在她',
          hint: '（她大概吃这一套，但我得先赌她不会真的生气）',
          effects: { affection: 3, trust: -2, courage: 1, flags: { f_musical_sleep: true } },
          next: 'c7_80c'
        }
      ]
    },
    {
      id: 'c7_80a', chapter: 7, beat: 'swell',
      speaker: 'jin',
      text: '对不起。我这两天加起来睡了七个小时，灯一暗就撑不住了。\n你准备了很久的票，你最喜欢的那首，我一句都没听到。\n……你骂我吧。',
      cast: [{ id: 'ya', pos: 'left', expr: 'surprised', outfit: 'dress', act: 'sit' }, { id: 'jin', pos: 'right', expr: 'guilty', outfit: 'formal', act: 'sit' }],
      next: 'c7_81'
    },
    {
      id: 'c7_80b', chapter: 7,
      speaker: 'jin',
      text: '我没睡。我闭着眼在听。\n……那段英国管，确实挺好听的。\n……真的。',
      cast: [{ id: 'ya', pos: 'left', expr: 'proud', outfit: 'dress', act: 'sit' }, { id: 'jin', pos: 'right', expr: 'awkward', outfit: 'formal', act: 'sit' }],
      next: 'c7_81'
    },
    {
      id: 'c7_80c', chapter: 7,
      speaker: 'jin',
      text: '……是你肩膀太舒服了。\n这个不能算我的问题吧。\n……总之是你。',
      cast: [{ id: 'ya', pos: 'left', expr: 'surprised', outfit: 'dress', act: 'sit' }, { id: 'jin', pos: 'right', expr: 'shy', outfit: 'formal', act: 'sit' }],
      next: 'c7_81'
    },
    {
      id: 'c7_81', chapter: 7, zoom: 'face', transition: 'slowfade',
      speaker: 'ya',
      text: '谁怪你了呀。我只是觉得，你睡着的样子我得留个证据。',
      cast: [{ id: 'ya', pos: 'left', expr: 'laugh', outfit: 'dress', act: 'sit' }, { id: 'jin', pos: 'right', expr: 'blank', outfit: 'formal', act: 'sit' }],
      sfx: 'sfx_laugh', next: 'c7_82'
    },
    {
      id: 'c7_82', chapter: 7,
      speaker: 'jin',
      text: '……什么证据啊。\n你把手机给我。',
      cast: [{ id: 'jin', pos: 'right', expr: 'panic', outfit: 'formal', act: 'reach' }],
      next: 'c7_83'
    },
    {
      id: 'c7_83', chapter: 7,
      speaker: 'ya',
      text: '不给。\n三张。一张侧脸，一张正脸，还有一张你嘴巴张开的。那张最好。',
      cast: [{ id: 'ya', pos: 'left', expr: 'tease', outfit: 'dress', act: 'turn' }, { id: 'jin', pos: 'right', expr: 'panic', outfit: 'formal', act: 'reach' }],
      next: 'c7_84'
    },
    {
      id: 'c7_84', chapter: 7, scene: 'theatre',
      speaker: 'narrator',
      text: '我在剧场的散场人潮里伸了两次手，都被她笑着躲开了。\n她把手机按在胸口，像护着一件战利品。',
      next: 'c7_85'
    },
    {
      id: 'c7_85', chapter: 7, scene: 'hotel', tint: 'night', bgm: 'bgm_warm',
      cast: [
        { id: 'ya', pos: 'left', expr: 'proud', outfit: 'home', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'guilty', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'narrator',
      text: '回到酒店，她把手机横过来，三张照片一张一张翻给我看。第一张我歪着头，第二张我嘴角有点口水光，第三张我张着嘴——她笑得在床上打滚。',
      transition: 'fade', titlecard: '2025 · 12 · 31  23:40', next: 'c7_86'
    },
    {
      id: 'c7_86', chapter: 7,
      speaker: 'ya',
      text: '你看你这个表情。上课睡觉被老师抓到的那种。',
      next: 'c7_87'
    },
    {
      id: 'c7_87', chapter: 7,
      speaker: 'jin',
      text: '……你笑够了没有啊。\n明天还要笑吗。',
      cast: [{ id: 'jin', pos: 'right', expr: 'awkward', outfit: 'casual', act: 'sit' }],
      next: 'c7_88'
    },
    {
      id: 'c7_88', chapter: 7,
      speaker: 'ya',
      text: '要。我要笑一整年。\n等到明年今天，我再翻出来笑一次。',
      cast: [{ id: 'ya', pos: 'left', expr: 'laugh', outfit: 'home', act: 'sit' }, { id: 'jin', pos: 'right', expr: 'soft', outfit: 'casual', act: 'sit' }],
      next: 'c7_89'
    },
    {
      id: 'c7_89', chapter: 7,
      speaker: 'inner',
      text: '我本来是真的想删掉。\n看她笑成那样，我又觉得，删了好像有点可惜。\n……这个念头我没敢说。',
      next: 'c7_90'
    },
    {
      id: 'c7_90', chapter: 7, cg: 'cg_newyear', bgm: 'bgm_ending', beat: 'swell', sfx: 'sfx_ding',
      cast: [],
      speaker: 'narrator',
      text: '二十三点五十九分，我们把窗帘拉开。桌上还摆着下午那个蛋糕，两个人把最后两块分掉了，盘子刮得干干净净。\n外面楼群上的灯一层层亮着，倒数的声音从街上一起涌上来。',
      transition: 'slowfade', next: 'c7_91'
    },
    {
      id: 'c7_91', chapter: 7, cg: 'cg_newyear', beat: 'swell',
      speaker: 'ya',
      text: '喂。新年快乐。\n……明年也要来。',
      cast: [],
      next: 'c7_92'
    },
    {
      id: 'c7_92', chapter: 7, cg: 'cg_newyear', beat: 'swell',
      speaker: 'jin',
      text: '新年快乐。\n……嗯。我会来的。真的。',
      cast: [],
      effects: { affection: 8, trust: 5, courage: 4, flags: { f_newyear: true } }, next: 'c7_93'
    },
    {
      id: 'c7_93', chapter: 7, cg: 'cg_newyear', beat: 'swell',
      speaker: 'inner',
      text: '零点的时候我听见自己的心跳，比外面倒数的声音还响。\n她刚说「明年也要来」。其实我也有一句「我每个月都想来」——没说出口。',
      cast: [],
      effects: { flags: { f_monthly_visit: true } },
      titlecard: '2026 · 01 · 01  00:00', next: 'c7_94'
    },

    /* =========================================================
     *  01 月中 · 陪她度过期末（她熬夜，我陪着）
     * ========================================================= */
    {
      id: 'c7_94', chapter: 7, scene: 'dorm', tint: 'night', bgm: 'bgm_quiet', ambience: 'keyboard', beat: 'calm',
      cast: [{ id: 'ya', pos: 'center', expr: 'sleepy', outfit: 'home', act: 'sit' }],
      speaker: 'narrator',
      text: '一月是期末。她有三门考试挤在同一周，还要交一份课程实验报告。\n视频通话里，她的桌上摊着两本笔记、一叠打印的题库，台灯照着的一个圈里全是便利贴。',
      titlecard: '2026 · 01 · 中旬', transition: 'slowfade', next: 'c7_95'
    },
    {
      id: 'c7_95', chapter: 7, chat: [
        { from: 'ya', text: '今天大概要熬到三点', time: '23:41:02' },
        { from: 'jin', text: '哪一门还没过完', time: '23:41:20' },
        { from: 'ya', text: 'C++。指针那块全是红的', time: '23:41:33' },
        { from: 'ya', text: '还有物理，电磁学', time: '23:41:41' },
        { from: 'ya', text: '书翻开我就想合上', time: '23:41:52' },
        { from: 'jin', text: '那就别翻书', time: '23:42:15' },
        { from: 'jin', text: '把你做错的那几题发我', time: '23:42:15' },
        { from: 'ya', text: '你好烦', time: '23:42:20' },
        { from: 'ya', text: '但好像有点道理', time: '23:42:31' }
      ],
      next: 'c7_96'
    },
    {
      id: 'c7_96', chapter: 7,
      speaker: 'inner',
      text: '她复习的时候有个毛病：从头到尾看一遍，什么都看，什么都不深。题做错了就翻答案，翻完觉得自己懂了，过两天换个数字又不会。\n我太熟这套流程了。我自己也这么读过。',
      cast: [{ id: 'jin', pos: 'right', expr: 'neutral', outfit: 'casual', act: 'sit' }],
      next: 'c7_97'
    },
    {
      id: 'c7_97', chapter: 7,
      speaker: 'ya',
      text: '你先睡吧。你上次在音乐厅都睡成那样了，别硬撑。',
      cast: [{ id: 'ya', pos: 'center', expr: 'serious', outfit: 'home', act: 'sit' }, { id: 'jin', pos: 'right', expr: 'soft', outfit: 'casual', act: 'sit' }],
      next: 'c7_98'
    },
    {
      id: 'c7_98', chapter: 7, choices: [
        {
          text: '把视频开一整夜，陪她过题：不会的一起查，我不睡',
          hint: '（不讲空话，就让她知道屏幕那头有人）',
          effects: { affection: 6, trust: 5, courage: 2 },
          next: 'c7_99a'
        },
        {
          text: '劝她先睡，说熬夜伤身体、效率也不高',
          hint: '（我一向觉得讲道理是负责）',
          effects: { affection: -2, trust: -3 },
          next: 'c7_99b'
        },
        {
          text: '跟她说：你把这周所有不会的题都发我，我今晚就坐在电脑前，一题一题给你讲',
          hint: '（做不了别的，至少把这几天陪完）',
          effects: { affection: 6, trust: 5, courage: 5 },
          next: 'c7_99c'
        }
      ]
    },
    {
      id: 'c7_99a', chapter: 7,
      speaker: 'jin',
      text: '我不困。你写你的，视频别关。\n我在屏幕这头陪你过题，卡住就喊我。\n……喊了我就应。',
      cast: [{ id: 'ya', pos: 'center', expr: 'shy', outfit: 'home', act: 'sit' }, { id: 'jin', pos: 'right', expr: 'soft', outfit: 'casual', act: 'sit' }],
      next: 'c7_100'
    },
    {
      id: 'c7_99b', chapter: 7,
      speaker: 'jin',
      text: '你不如先睡两个小时，四点起来看。\n熬夜效率很低的。这个有数据。\n……我不是要管你。\n（她没接这句。过了两分钟，她把摄像头打开了。）',
      cast: [{ id: 'ya', pos: 'center', expr: 'pout', outfit: 'home', act: 'sit' }, { id: 'jin', pos: 'right', expr: 'serious', outfit: 'casual', act: 'sit' }],
      next: 'c7_100'
    },
    {
      id: 'c7_99c', chapter: 7,
      speaker: 'jin',
      text: '你别管我了。你这周所有不会的题都发过来。\n我一题一题给你讲，讲到你会为止。\n……我今晚不睡。',
      cast: [{ id: 'ya', pos: 'center', expr: 'surprised', outfit: 'home', act: 'sit' }, { id: 'jin', pos: 'right', expr: 'serious', outfit: 'casual', act: 'sit' }],
      next: 'c7_100'
    },
    {
      id: 'c7_100', chapter: 7, scene: 'dorm', tint: 'night', bgm: 'bgm_quiet', beat: 'calm',
      cast: [
        { id: 'jin', pos: 'center', expr: 'neutral', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'narrator',
      text: '从那天起，每晚十一点我们开视频。她把屏幕切到共享，题目一行一行滚过去。\n我在宿舍的桌前坐下，把台灯拧亮，讲到她那边天快亮。',
      transition: 'fade', titlecard: '2026 · 01 · 18  01:20', next: 'c7_101'
    },
    {
      id: 'c7_101', chapter: 7,
      speaker: 'jin',
      text: '停。这个指针你画一下——p 指向哪，p 里面又是什么。\n……别急，慢慢画。',
      next: 'c7_102'
    },
    {
      id: 'c7_102', chapter: 7,
      speaker: 'ya',
      text: '……指向那块内存。里面存的是下一个节点的地址。',
      cast: [{ id: 'ya', pos: 'center', expr: 'surprised', outfit: 'home', act: 'sit' }],
      sfx: 'sfx_heart', next: 'c7_103'
    },
    {
      id: 'c7_103', chapter: 7,
      speaker: 'ya',
      text: '等等。那这样串起来……\n我之前一直以为是要背下来的。',
      cast: [{ id: 'ya', pos: 'center', expr: 'excited', outfit: 'home', act: 'sit' }],
      next: 'c7_104'
    },
    {
      id: 'c7_104', chapter: 7,
      speaker: 'inner',
      text: '她说这句话的时候，屏幕那头的声音明显亮了一下。我们把这些题来回过了三遍。\n物理题换了个思路：不看公式，先画受力图——画出来她自己就往下算了。',
      cast: [{ id: 'jin', pos: 'right', expr: 'soft', outfit: 'casual', act: 'sit' }],
      next: 'c7_105'
    },
    {
      id: 'c7_105', chapter: 7,
      speaker: 'narrator',
      text: '一点五十，最后一道大题讲完。她往后一靠，说了句「活了」。\n两点十分，她那边没声了，屏幕上只剩半张脸，头发压在键盘上。',
      next: 'c7_106'
    },
    {
      id: 'c7_106', chapter: 7, zoom: 'face', transition: 'slowfade',
      speaker: 'narrator',
      text: '我喊了她两声，没反应。我挂了视频，把今晚讲过的题整理成一份提纲，标上序号发过去：明天早上第一眼看这个。',
      next: 'c7_107'
    },
    {
      id: 'c7_107', chapter: 7, scene: 'dorm', tint: 'day', bgm: 'bgm_warm', beat: 'calm',
      speaker: 'ya',
      text: '……你昨天几点睡的？\n我看到你发的提纲了。',
      cast: [{ id: 'ya', pos: 'center', expr: 'surprised', outfit: 'home', act: 'sit' }],
      next: 'c7_108'
    },
    {
      id: 'c7_108', chapter: 7,
      speaker: 'jin',
      text: '三点多。\n……提纲里第十一题你再看一遍。那题你昨天算错了一个符号。',
      next: 'c7_109'
    },
    {
      id: 'c7_109', chapter: 7,
      speaker: 'narrator',
      text: '她没有说谢谢。她从包里翻出一张明信片——上面印着一只趴在窗台上的三花猫——塞进我外套的口袋。\n「先欠着，下次给你写。」',
      transition: 'slowfade', next: 'c7_110'
    },
    {
      id: 'c7_110', chapter: 7,
      speaker: 'inner',
      text: '那张明信片后来一直夹在我的笔记本里。\n我当时没想到，从这一张开始，我们会有一整摞。',
      cast: [{ id: 'jin', pos: 'right', expr: 'soft', outfit: 'casual', act: 'sit' }],
      effects: { affection: 4, trust: 3 }, next: 'c7_111'
    },
    {
      id: 'c7_111', chapter: 7, scene: 'airport', tint: 'night', bgm: 'bgm_warm',
      cast: [{ id: 'jin', pos: 'center', expr: 'neutral', outfit: 'winter', act: 'idle' }],
      speaker: 'narrator',
      text: '一月下旬，我又一次站在登机口前面。\n这个月我飞了两趟。回程的座位靠窗，我一格一格地数下面的灯——数着数着，飞机就钻进云里了。',
      titlecard: '2026 · 01 · 底', transition: 'slowfade', next: 'c7_112'
    },
    {
      id: 'c7_112', chapter: 7,
      speaker: 'inner',
      text: '以前我觉得「每个月都去见你」只是一句好听的话。\n现在我知道那是一张张机票、一次次地铁二号线，和每次在出口先看到她眼睛的那种感觉。',
      cast: [{ id: 'jin', pos: 'center', expr: 'soft', outfit: 'winter', act: 'idle' }],
      next: 'c7_113'
    },
    {
      id: 'c7_113', chapter: 7, chat: [
        { from: 'ya', text: '到宿舍了吗', time: '23:12:40' },
        { from: 'jin', text: '到了', time: '23:14:02' },
        { from: 'ya', text: '下个月还有一趟哦', time: '23:14:20' },
        { from: 'jin', text: '我知道', time: '23:14:39' },
        { from: 'ya', text: '你二月要来南阳', time: '23:14:51' },
        { from: 'ya', text: '我生日', time: '23:14:56' },
        { from: 'ya', text: '你敢不来试试', time: '23:15:03' },
        { from: 'jin', text: '我什么时候敢过', time: '23:16:47' }
      ],
      next: 'c7_114'
    },
    {
      id: 'c7_114', chapter: 7, scene: 'dorm', tint: 'night',
      cast: [{ id: 'jin', pos: 'center', expr: 'smile', outfit: 'casual', act: 'sit' }],
      speaker: 'narrator',
      text: '那晚我把日历翻到二月，在中间画了一个圈。圈里写着「南阳」。\n旁边还有一件当时我完全没预料到的事，正在等着我。',
      transition: 'slowfade', next: 'c8_01'
    }

  ]);
})();
