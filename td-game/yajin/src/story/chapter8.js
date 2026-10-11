/* 《你好！一周年》第八章 · 南阳的生日（2026.02） —— 剧本组 D
 * 场景：nail_salon / street_cn / home_living / hotel / home_yard / airport
 * 音乐：bgm_warm → bgm_game（美甲段）→ bgm_quiet（见家长 drop）→ bgm_ending（烤棉花糖）→ bgm_quiet（机场）
 * flag：f_gift_wrap f_postcard f_nail_cat f_nail_cool f_met_parents f_hotel_first
 *       f_sneak_milktea f_marshmallow f_airport_cry_3
 * 选择：⑫ 美甲选哪只手做猫猫款  ⑬ 见家长怎么介绍自己
 *       ⑭ 被妈妈发现奶茶怎么应对  ⑮ 临走要不要说"下次我来接你"
 */
(function () {
  'use strict';
  YJ.story.add([

    /* =========================================================
     *  02 · 出发前 · 机场
     * ========================================================= */
    {
      id: 'c8_01', chapter: 8, scene: 'airport', tint: 'night', bgm:'bgm_night', ambience:'night',
      cast: [{ id: 'jin', pos: 'center', expr: 'neutral', outfit: 'winter', act: 'idle' }],
      speaker: 'narrator',
      text: '二月十号晚上，我坐在候机厅最边上那个位置。飞南阳的登机口在另一头，人不多。广播每隔十分钟念一次延误，念到第三遍的时候，我把登机牌捏软了。',
      transition: 'fade', titlecard: '2026 · 02 · 10  夜', next: 'c8_02'
    },
    {
      id: 'c8_02', chapter: 8,
      speaker: 'inner',
      text: '我这个人从不往备忘录里写这种话。那天写了一行：到站时间、见面先喊阿姨、她想吃胡辣汤的那家店。\n写完自己看了一遍，跟实验记录一个格式。我紧张起来就是这个毛病，什么都想先列出来。',
      cast: [{ id: 'jin', pos: 'center', expr: 'blank', outfit: 'winter', act: 'sit' }],
      next: 'c8_03'
    },
    {
      id: 'c8_03', chapter: 8, chat: [
        { from: 'ya', text: '登机了吗', time: '20:41:10' },
        { from: 'jin', text: '还没。延误半小时', time: '20:42:33' },
        { from: 'ya', text: '那正好', time: '20:42:40' },
        { from: 'ya', text: '你现在紧张吗', time: '20:42:47' },
        { from: 'jin', text: '我紧张什么', time: '20:43:12' },
        { from: 'ya', text: '你要见我爸妈呀', time: '20:43:25' },
        { from: 'jin', text: '……', time: '20:43:29' },
        { from: 'jin', text: '你现在说这个', time: '20:43:44' },
        { from: 'jin', text: '是不是有点晚', time: '20:43:44' },
        { from: 'ya', text: '哈哈哈哈哈哈', time: '20:43:50' },
        { from: 'ya', text: '放心吧我爸不凶的', time: '20:43:59' },
        { from: 'ya', text: '我妈更不凶', time: '20:44:05' }
      ],
      next: 'c8_04'
    },
    {
      id: 'c8_04', chapter: 8,
      speaker: 'inner',
      text: '不凶。\n我盯着这两个字看了很久。我这辈子见过最不凶的长辈，是那种整晚一句话不说、从头到尾盯着你的人。\n……也可能只是我运气不好。',
      cast: [{ id: 'jin', pos: 'center', expr: 'awkward', outfit: 'winter', act: 'sit' }],
      next: 'c8_05'
    },
    {
      id: 'c8_05', chapter: 8, sfx: 'sfx_msg',
      speaker: 'narrator',
      text: '她又发来一条：明天先去逛街，我有想要的东西，你得陪我挑。\n后面跟了个歪歪扭扭的猫猫贴纸，底下还压着两个字：必须。',
      next: 'c8_06'
    },
    {
      id: 'c8_06', chapter: 8,
      speaker: 'jin',
      text: '好。\n……你挑，我拎着。',
      cast: [{ id: 'jin', pos: 'center', expr: 'smile', outfit: 'winter', act: 'sit' }],
      next: 'c8_07'
    },
    {
      id: 'c8_07', chapter: 8, transition: 'slowfade',
      speaker: 'narrator',
      text: '快十一点才落地。廊桥外面一堆人在等行李，玻璃上映着南阳的夜——比上海暗，也比上海静。',
      next: 'c8_08'
    },
    {
      id: 'c8_08', chapter: 8, scene: 'airport', tint: 'night',
      cast: [
        { id: 'ya', pos: 'left', expr: 'excited', outfit: 'winter', act: 'reach' },
        { id: 'jin', pos: 'right', expr: 'surprised', outfit: 'winter', act: 'idle' }
      ],
      speaker: 'narrator',
      text: '出口的栏杆外面，她裹着围巾踮着脚，一只手扶着栏杆，另一只手已经在朝我挥。\n她身后还站着一个人：她妈妈。手里拎着一个空袋子，像是专门来装我东西的。\n我脚步顿了一下。',
      transition: 'fade', next: 'c8_09'
    },
    {
      id: 'c8_09', chapter: 8, scene: 'airport', tint: 'night',
      cast: [
        { id: 'ya', pos: 'left', expr: 'laugh', outfit: 'winter', act: 'reach' },
        { id: 'jin', pos: 'right', expr: 'blank', outfit: 'winter', act: 'idle' }
      ],
      speaker: 'ya',
      text: '喂——这边这边！你怎么走得这么慢啊——妈妈，他到了，就是他！',
      next: 'c8_10'
    },
    {
      id: 'c8_10', chapter: 8,
      speaker: 'jin',
      text: '……你怎么把阿姨也带来了啊。\n我连招呼要怎么打都还没想好。\n……你也不提前说一声。',
      cast: [{ id: 'jin', pos: 'right', expr: 'panic', outfit: 'winter', act: 'idle' }],
      next: 'c8_11'
    },
    {
      id: 'c8_11', chapter: 8,
      speaker: 'ya',
      text: '哎呀我没跟她说得那么细。\n我妈自己非要跟来的——她说要亲眼看一看，是谁让我这两个月一直抱着手机笑。\n……你别站着了，走啦。',
      cast: [{ id: 'ya', pos: 'left', expr: 'pout', outfit: 'winter', act: 'idle' }, { id: 'jin', pos: 'right', expr: 'guilty', outfit: 'winter', act: 'idle' }],
      next: 'c8_12'
    },
    {
      id: 'c8_12', chapter: 8,
      speaker: 'narrator',
      text: '她妈妈朝我笑了一下，问我：「是不是穿少了？这两天晚上零下六度。」\n没等我答话，她就把我手里那个背包接过去了：「先回家，家里有热的。」',
      next: 'c8_13'
    },
    {
      id: 'c8_13', chapter: 8,
      speaker: 'inner',
      text: '我跟着往外走，脑子里全是同一句：我什么都没准备。\n她从她妈妈身后回过头，看了我一眼，用口型说了两个字：别慌。\n……她凭什么知道我在想什么。\n那天晚上他们把我送到两条街外的一家酒店，房卡是她妈妈去前台办的。',
      cast: [{ id: 'jin', pos: 'right', expr: 'blank', outfit: 'winter', act: 'idle' }],
      next: 'c8_14'
    },

    /* =========================================================
     *  02 · 11 上午 · 陪她精心挑礼物
     * ========================================================= */
    {
      id: 'c8_14', chapter: 8, scene: 'street_cn', tint: 'day', bgm: 'bgm_warm', ambience: 'crowd',
      cast: [
        { id: 'ya', pos: 'center', expr: 'smile', outfit: 'winter', act: 'idle' },
        { id: 'jin', pos: 'right', expr: 'neutral', outfit: 'winter', act: 'idle' }
      ],
      speaker: 'narrator',
      text: '第二天早上七点她就来敲门了，说要带我去吃「只有在这儿才吃得到的东西」。\n南阳的冬天比上海干，风从街口钻进来，整条街的摊子都在冒白气。',
      titlecard: '2026 · 02 · 11  上午', transition: 'fade', next: 'c8_15'
    },
    {
      id: 'c8_15', chapter: 8,
      speaker: 'ya',
      text: '先喝胡辣汤，配油条。\n别怕辣啊，我们这儿的辣是香的。\n喝完再带你去吃烩面，中午那家。',
      next: 'c8_16'
    },
    {
      id: 'c8_16', chapter: 8,
      speaker: 'jin',
      text: '……早上七点就喝汤啊。\n你们这儿的人，都不睡懒觉的吗。',
      cast: [{ id: 'jin', pos: 'right', expr: 'awkward', outfit: 'winter', act: 'idle' }],
      next: 'c8_17'
    },
    {
      id: 'c8_17', chapter: 8,
      speaker: 'ya',
      text: '吃饱了才有劲逛街呀。\n我想要个香薰蜡烛，雪松味的。没有雪松就雪松加橙子，不许糊弄我。',
      cast: [{ id: 'ya', pos: 'center', expr: 'serious', outfit: 'winter', act: 'idle' }, { id: 'jin', pos: 'right', expr: 'smile', outfit: 'winter', act: 'idle' }],
      next: 'c8_18'
    },
    {
      id: 'c8_18', chapter: 8,
      speaker: 'inner',
      text: '「要带雪松味的。」\n她说得那么具体，说明这句话在心里过了很多遍。她就是这样，连许愿都要先写好参数。\n……我连自己喜欢什么都说不上来。',
      cast: [{ id: 'jin', pos: 'right', expr: 'soft', outfit: 'winter', act: 'idle' }],
      next: 'c8_19'
    },
    {
      id: 'c8_19', chapter: 8,
      speaker: 'narrator',
      text: '路过胡辣汤铺子的时候我回头看了一眼。一碗汤加两根油条，八块钱。她那碗料堆得快溢出来，我吃得比平时早饭多一倍，结账的时候还有点不敢信。\n然后我们进了第一家香薰店。她挨个掀盖子闻，闻完皱眉，翻过来看价签，再闻一次。我跟在她后面，拎着她的包。',
      next: 'c8_20'
    },
    {
      id: 'c8_20', chapter: 8,
      speaker: 'ya',
      text: '这个太甜了，像洗手间。这个太淡，根本闻不出来。这个……嗯。\n你闻一下。',
      cast: [{ id: 'ya', pos: 'center', expr: 'pout', outfit: 'winter', act: 'reach' }, { id: 'jin', pos: 'right', expr: 'neutral', outfit: 'winter', act: 'reach' }],
      next: 'c8_21'
    },
    {
      id: 'c8_21', chapter: 8,
      speaker: 'jin',
      text: '……有点像我们学校图书馆老楼。\n就那股木头味。\n……我说不上来。',
      next: 'c8_22'
    },
    {
      id: 'c8_22', chapter: 8,
      speaker: 'ya',
      text: '那不行。我要的是雪松，不是你们图书馆。\n走，换一家。老板，不好意思啊。',
      cast: [{ id: 'ya', pos: 'center', expr: 'laugh', outfit: 'winter', act: 'turn' }, { id: 'jin', pos: 'right', expr: 'smile', outfit: 'winter', act: 'idle' }],
      sfx: 'sfx_laugh', next: 'c8_23'
    },
    {
      id: 'c8_23', chapter: 8,
      speaker: 'narrator',
      text: '第二家在巷子深处，门口挂着一串铃铛。斜对面就是那家烩面馆，中午的队已经排到门外了。\n她进去一句话没说，踮脚从货架最上层够下一个墨绿色的小罐子，闻了很久。久到我以为她站着睡着了。',
      sfx: 'sfx_bell', next: 'c8_24'
    },
    {
      id: 'c8_24', chapter: 8, zoom: 'face', transition: 'slowfade',
      speaker: 'ya',
      text: '……是这个。\n你闻，就是这个味道。快闻。',
      cast: [{ id: 'ya', pos: 'center', expr: 'excited', outfit: 'winter', act: 'reach' }, { id: 'jin', pos: 'right', expr: 'soft', outfit: 'winter', act: 'reach' }],
      next: 'c8_25'
    },
    {
      id: 'c8_25', chapter: 8,
      speaker: 'inner',
      text: '我闻不出雪松，也不确定自己在闻什么。\n可她举着那个罐子的样子太亮了，我点了头。\n……点得有点快，我自己都听见了。',
      cast: [{ id: 'jin', pos: 'right', expr: 'soft', outfit: 'winter', act: 'idle' }],
      next: 'c8_26'
    },
    {
      id: 'c8_26', chapter: 8,
      speaker: 'jin',
      text: '……就这个吧。\n我去结账。',
      next: 'c8_27'
    },
    {
      id: 'c8_27', chapter: 8,
      speaker: 'ya',
      text: '不用你付。\n这是我自己想要的东西，我自己买。\n你替我买了，那算什么呀。',
      cast: [{ id: 'ya', pos: 'center', expr: 'proud', outfit: 'winter', act: 'idle' }, { id: 'jin', pos: 'right', expr: 'blank', outfit: 'winter', act: 'idle' }],
      next: 'c8_28'
    },
    {
      id: 'c8_28', chapter: 8,
      speaker: 'jin',
      text: '……那你让我陪你挑。\n……是想让我知道你想要什么吧。',
      next: 'c8_29'
    },
    {
      id: 'c8_29', chapter: 8,
      speaker: 'ya',
      text: '对呀。下次你就不用问了。\n中午那家烩面我请，一大碗才十九块。\n你肯定吃不完，我帮你吃。',
      cast: [{ id: 'ya', pos: 'center', expr: 'tease', outfit: 'winter', act: 'idle' }, { id: 'jin', pos: 'right', expr: 'shy', outfit: 'winter', act: 'idle' }],
      effects: { affection: 4, trust: 3 }, next: 'c8_30'
    },

    /* =========================================================
     *  礼物盒 · 丝带 · 笨拙的包装
     * ========================================================= */
    {
      id: 'c8_30', chapter: 8, scene: 'street_cn', tint: 'day', ambience: 'crowd',
      cast: [
        { id: 'ya', pos: 'center', expr: 'smile', outfit: 'winter', act: 'idle' },
        { id: 'jin', pos: 'right', expr: 'serious', outfit: 'winter', act: 'idle' }
      ],
      speaker: 'narrator',
      text: '出了店，我拐进旁边的文具铺，挑了一叠印着不同姿势猫猫的明信片。就一叠，别的什么都没买。\n她在门口等我，挑了下眉。',
      next: 'c8_31'
    },
    {
      id: 'c8_31', chapter: 8,
      speaker: 'ya',
      text: '明信片？你买这个干什么。',
      next: 'c8_32'
    },
    {
      id: 'c8_32', chapter: 8,
      speaker: 'jin',
      text: '……想写点东西。\n上次你说先欠着，我一直欠着——那张我留着，一直没敢动笔。\n我想自己挑一叠，写完了给你。\n……就这么点事。',
      cast: [{ id: 'jin', pos: 'right', expr: 'awkward', outfit: 'winter', act: 'idle' }],
      next: 'c8_33'
    },
    {
      id: 'c8_33', chapter: 8, zoom: 'face', transition: 'slowfade',
      speaker: 'ya',
      text: '哦——原来你还记得。\n那你写。写完不许给我看，等哪天你自己递给我。',
      cast: [{ id: 'ya', pos: 'center', expr: 'shy', outfit: 'winter', act: 'idle' }, { id: 'jin', pos: 'right', expr: 'neutral', outfit: 'winter', act: 'idle' }],
      next: 'c8_34'
    },
    {
      id: 'c8_34', chapter: 8,
      speaker: 'inner',
      text: '她说完把围巾往上拉了拉，遮住半张脸。她害羞就是这个动作。\n我本来想说「那我今天写」，最后还是没说出口。',
      cast: [{ id: 'jin', pos: 'right', expr: 'soft', outfit: 'winter', act: 'idle' }],
      next: 'c8_35'
    },

    /* =========================================================
     *  她家客厅 · 包装（胶带贴歪、丝带打不好）
     * ========================================================= */
    {
      id: 'c8_35', chapter: 8, scene: 'home_living', tint: 'day', bgm: 'bgm_warm',
      cast: [
        { id: 'ya', pos: 'left', expr: 'smile', outfit: 'home', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'serious', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'narrator',
      text: '她爸妈下午出门了，客厅里只剩我们两个。\n茶几上摆着她妈妈走之前削的一盘苹果，切面已经氧化发黄。她从电视柜底下拖出一个旧铁盒，说里面全是她小时候的东西。',
      transition: 'fade', next: 'c8_36'
    },
    {
      id: 'c8_36', chapter: 8,
      speaker: 'ya',
      text: '你看你看，这是我五岁——不对，六岁。\n我妈给我剪的头发，丑死了。那天我还哭了一下午。',
      cast: [{ id: 'ya', pos: 'left', expr: 'laugh', outfit: 'home', act: 'sit' }, { id: 'jin', pos: 'right', expr: 'awkward', outfit: 'casual', act: 'reach' }],
      next: 'c8_37'
    },
    {
      id: 'c8_37', chapter: 8,
      speaker: 'jin',
      text: '……不丑啊。\n我小时候也是这个头。\n……算了，当我没说。',
      next: 'c8_38'
    },
    {
      id: 'c8_38', chapter: 8,
      speaker: 'ya',
      text: '谁问你了。\n——等等，你小时候什么头？照片呢，下次带给我看。',
      cast: [{ id: 'ya', pos: 'left', expr: 'tease', outfit: 'home', act: 'sit' }, { id: 'jin', pos: 'right', expr: 'serious', outfit: 'casual', act: 'reach' }],
      next: 'c8_39'
    },
    {
      id: 'c8_39', chapter: 8, sfx: 'sfx_heart',
      speaker: 'narrator',
      text: '铁盒最底下压着一副旧耳机，白线缠成一团。她拎起来晃了晃，说就是这个，上个月连麦的时候一直断。\n我没接，从外套内袋里摸出那副新的，放到她手心里。',
      next: 'c8_40'
    },
    {
      id: 'c8_40', chapter: 8,
      speaker: 'jin',
      text: '换这个。\n……那副别用了。\n……真的，会漏音。',
      cast: [{ id: 'jin', pos: 'right', expr: 'serious', outfit: 'casual', act: 'reach' }],
      next: 'c8_41'
    },
    {
      id: 'c8_41', chapter: 8,
      speaker: 'ya',
      text: '等一下。\n……你怎么知道我耳机坏了。',
      cast: [{ id: 'ya', pos: 'left', expr: 'laugh', outfit: 'home', act: 'sit' }, { id: 'jin', pos: 'right', expr: 'guilty', outfit: 'casual', act: 'reach' }],
      next: 'c8_42'
    },
    {
      id: 'c8_42', chapter: 8,
      speaker: 'narrator',
      text: '上个月连麦，她那边的声音一直是断的。她说耳机接触不良，说完就去赶实验了。\n我记进了备忘录。第二天下的单。',
      next: 'c8_43'
    },
    {
      id: 'c8_43', chapter: 8,
      speaker: 'ya',
      text: '……你记得这个？\n我就是在路上随口说了一句。',
      cast: [{ id: 'ya', pos: 'left', expr: 'laugh', outfit: 'home', act: 'sit' }, { id: 'jin', pos: 'right', expr: 'awkward', outfit: 'casual', act: 'reach' }],
      sfx: 'sfx_laugh', next: 'c8_44'
    },
    {
      id: 'c8_44', chapter: 8,
      speaker: 'jin',
      text: '……你说的，我都记着。\n说得少的，也记。\n……你别老问。',
      next: 'c8_45'
    },
    {
      id: 'c8_45', chapter: 8,
      speaker: 'narrator',
      text: '她低头把新耳机戴上又摘下，试了两次，然后把旧的那副扣上盖子，塞回铁盒最底下。\n动作很轻，像在收一样东西。',
      transition: 'slowfade', next: 'c8_46'
    },
    {
      id: 'c8_46', chapter: 8,
      speaker: 'ya',
      text: '这个我收下了。\n……旧的那副我先不扔，行不行。',
      cast: [{ id: 'ya', pos: 'left', expr: 'smile', outfit: 'home', act: 'reach' }, { id: 'jin', pos: 'right', expr: 'moved', outfit: 'casual', act: 'sit' }],
      next: 'c8_47'
    },
    {
      id: 'c8_47', chapter: 8,
      speaker: 'inner',
      text: '她说这句话的时候，把旧耳机线绕在手指上，绕了两圈。\n我看着她低头的样子，突然很想说一句很长的话。\n……那句很长的话，最后缩成了下面这一小句。',
      cast: [{ id: 'jin', pos: 'right', expr: 'moved', outfit: 'casual', act: 'sit' }],
      next: 'c8_48'
    },
    {
      id: 'c8_48', chapter: 8,
      speaker: 'jin',
      text: '苏州那次，是你替我跑前跑后的。\n……这次轮到我。\n不等生日，先给你。',
      cast: [{ id: 'ya', pos: 'left', expr: 'surprised', outfit: 'home', act: 'sit' }, { id: 'jin', pos: 'right', expr: 'serious', outfit: 'casual', act: 'sit' }],
      effects: { affection: 6, trust: 5, courage: 3, flags: { f_gift_wrap: true } }, next: 'c8_49'
    },
    {
      id: 'c8_49', chapter: 8,
      speaker: 'ya',
      text: '……你这个人。\n话少，但是一开口就很讨厌。',
      cast: [{ id: 'ya', pos: 'left', expr: 'blush', outfit: 'home', act: 'shy_hide' }, { id: 'jin', pos: 'right', expr: 'soft', outfit: 'casual', act: 'sit' }],
      next: 'c8_50'
    },
    {
      id: 'c8_50', chapter: 8,
      speaker: 'jin',
      text: '讨厌，是好的意思还是坏的意思。\n……你说明白点。',
      next: 'c8_51'
    },
    {
      id: 'c8_51', chapter: 8,
      speaker: 'ya',
      text: '不许问。\n……等一下，你手里捏着那个。捏半天了，给我。',
      cast: [{ id: 'ya', pos: 'left', expr: 'pout', outfit: 'home', act: 'sit' }, { id: 'jin', pos: 'right', expr: 'smile', outfit: 'casual', act: 'sit' }],
      next: 'c8_52'
    },

    /* =========================================================
     *  猫猫明信片（重要道具 · 本章起每章出现）
     * ========================================================= */
    {
      id: 'c8_52', chapter: 8, scene: 'home_living', tint: 'dusk', bgm: 'bgm_warm', beat: 'calm',
      cast: [
        { id: 'ya', pos: 'left', expr: 'neutral', outfit: 'home', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'serious', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'narrator',
      text: '她抢过去的那张，是我昨天晚上写的。一只趴在窗台上、尾巴垂下来的三花猫——跟上一趟在上海她塞给我的那张，是一个样子。',
      titlecard: '2026 · 02 · 11  傍晚', transition: 'slowfade', next: 'c8_53'
    },
    {
      id: 'c8_53', chapter: 8,
      speaker: 'inner',
      text: '写了三遍：第一遍太客气，划掉；第二遍太长，划掉；第三遍只有一行字。\n我看了一遍，觉得够短，也够真。',
      next: 'c8_54'
    },
    {
      id: 'c8_54', chapter: 8,
      speaker: 'narrator',
      text: '我一直没想好什么时候递给她。\n她把它举起来的时候，我原本想好的那半句解释，全忘了。',
      next: 'c8_55'
    },
    {
      id: 'c8_55', chapter: 8,
      speaker: 'ya',
      text: '……等等，这张你什么时候写的。',
      cast: [{ id: 'ya', pos: 'left', expr: 'excited', outfit: 'home', act: 'reach' }, { id: 'jin', pos: 'right', expr: 'shy', outfit: 'casual', act: 'sit' }],
      next: 'c8_56'
    },
    {
      id: 'c8_56', chapter: 8,
      speaker: 'jin',
      text: '……昨天晚上写的。\n本来想等你哪天自己翻到的。',
      next: 'c8_57'
    },
    {
      id: 'c8_57', chapter: 8,
      speaker: 'ya',
      text: '那不一样。\n……你每次都这样。写好了不说，捏着，等我自己发现。',
      cast: [{ id: 'ya', pos: 'left', expr: 'proud', outfit: 'home', act: 'reach' }, { id: 'jin', pos: 'right', expr: 'panic', outfit: 'casual', act: 'reach' }],
      next: 'c8_58'
    },
    {
      id: 'c8_58', chapter: 8, zoom: 'face', transition: 'slowfade',
      speaker: 'narrator',
      text: '她把明信片举起来，先看正面，笑着说「这只猫好像你」。然后翻过来，视线在那行字上停了很久，久到我以为她不认识那几个字。',
      next: 'c8_59'
    },
    {
      id: 'c8_59', chapter: 8, zoom: 'face',
      speaker: 'ya',
      text: '……「谢谢你让我每个月都有地方可去」。\n我念出来了，你别装没听见。',
      cast: [{ id: 'ya', pos: 'left', expr: 'cry', outfit: 'home', act: 'sit' }, { id: 'jin', pos: 'right', expr: 'shy', outfit: 'casual', act: 'sit' }],
      next: 'c8_60'
    },
    {
      id: 'c8_60', chapter: 8,
      speaker: 'jin',
      text: '……不好听是吧。\n我写这种东西，本来就不太行。\n……你别念第二遍。',
      next: 'c8_61'
    },
    {
      id: 'c8_61', chapter: 8, transition: 'slowfade',
      speaker: 'ya',
      text: '好听。\n以后每次见面，都要有一张猫猫明信片。一张都不许少。',
      cast: [{ id: 'ya', pos: 'left', expr: 'blush', outfit: 'home', act: 'shy_hide' }, { id: 'jin', pos: 'right', expr: 'soft', outfit: 'casual', act: 'sit' }],
      effects: { affection: 7, trust: 5, flags: { f_postcard: true } }, next: 'c8_62'
    },
    {
      id: 'c8_62', chapter: 8,
      speaker: 'inner',
      text: '她把明信片正面朝上，夹进了自己那本贴满便签的笔记本。我瞟了一眼那本子的厚度——里面已经夹了好几张，边角都还是平的。\n我当时以为她是随手放的。后来才知道，那本笔记她一直带在身边。',
      cast: [{ id: 'jin', pos: 'right', expr: 'moved', outfit: 'casual', act: 'sit' }],
      next: 'c8_63'
    },
    {
      id: 'c8_63', chapter: 8, sfx: 'sfx_camera',
      speaker: 'narrator',
      text: '她拍了张照片：那张明信片、她小时候的相册，还有旁边那盘氧化发黄的苹果。\n她说，这是她的生日现场。',
      next: 'c8_64'
    },

    /* =========================================================
     *  02 · 11 傍晚 · 一起去给我做美甲
     * ========================================================= */
    {
      id: 'c8_64', chapter: 8, scene: 'street_cn', tint: 'dusk', bgm: 'bgm_game', beat: 'pulse',
      cast: [
        { id: 'ya', pos: 'center', expr: 'tease', outfit: 'winter', act: 'idle' },
        { id: 'jin', pos: 'right', expr: 'blank', outfit: 'winter', act: 'idle' }
      ],
      speaker: 'narrator',
      text: '晚饭后她说了句「跟我走，别问」。\n拐过两个街口，她在一家亮着粉灯的小店门口停下，推门，手往我肩膀上一按，我就坐下了。',
      titlecard: '2026 · 02 · 11  傍晚', next: 'c8_65'
    },
    {
      id: 'c8_65', chapter: 8,
      speaker: 'ya',
      text: '老板，这个位子给他坐。他第一次做，你轻一点。\n……他要是缩手，你别笑他。',
      next: 'c8_66'
    },
    {
      id: 'c8_66', chapter: 8,
      speaker: 'jin',
      text: '……等一下。\n不是说去吃巷子口那家粉吗。\n……这是美甲店吧。',
      cast: [{ id: 'jin', pos: 'right', expr: 'panic', outfit: 'winter', act: 'sit' }],
      next: 'c8_67'
    },
    {
      id: 'c8_67', chapter: 8,
      speaker: 'ya',
      text: '做美甲呀。上个月你自己说的，「可以试试看」。\n我记性好得很，哼哼。',
      cast: [{ id: 'ya', pos: 'center', expr: 'proud', outfit: 'winter', act: 'sit' }, { id: 'jin', pos: 'right', expr: 'blank', outfit: 'winter', act: 'sit' }],
      next: 'c8_68'
    },
    {
      id: 'c8_68', chapter: 8,
      speaker: 'inner',
      text: '我说过。上个月连麦，她问我怕不怕疼，我说不怕，就是有点不好意思。\n我当时想，她过两天就忘了。\n……我怎么忘了，她记性比我好。我随口说的话，她都存着。',
      cast: [{ id: 'jin', pos: 'right', expr: 'shy', outfit: 'winter', act: 'sit' }],
      next: 'c8_69'
    },
    {
      id: 'c8_69', chapter: 8,
      speaker: 'jin',
      text: '……我是答应过。\n我以为是你自己做。\n没说是我啊。\n……等等，我没说不做。',
      next: 'c8_70'
    },
    {
      id: 'c8_70', chapter: 8,
      speaker: 'ya',
      text: '你嘴上嫌弃的时候，眼睛已经在色卡上了。\n选吧。选完我给你配另一只手。\n……快点，别装。',
      cast: [{ id: 'ya', pos: 'center', expr: 'tease', outfit: 'winter', act: 'reach' }, { id: 'jin', pos: 'right', expr: 'awkward', outfit: 'winter', act: 'sit' }],
      next: 'c8_71'
    },
    {
      id: 'c8_71', chapter: 8,
      speaker: 'inner',
      text: '她看穿得太快了。\n我确实在看色卡，而且已经在心里比过两种粉：一个偏橘，一个偏灰。\n我赶紧把眼睛移开。移得太迟了。\n……她刚才是不是笑了一下。',
      next: 'c8_72'
    },

    /* -------- 美甲店：指甲油、猫猫、黑 -------- */
    {
      id: 'c8_72', chapter: 8, scene: 'nail_salon', tint: 'dusk', bgm: 'bgm_game', beat: 'pulse',
      cast: [
        { id: 'ya', pos: 'left', expr: 'excited', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'awkward', outfit: 'nails', act: 'sit' }
      ],
      speaker: 'narrator',
      text: '店里有一台老式烘干灯，粉色墙纸，玻璃柜里的甲油一溜排开，从浅到深。\n我坐下以后手不知道往哪儿放，最后搁在桌沿上。\n像等抽血。',
      transition: 'fade', next: 'c8_73'
    },
    {
      id: 'c8_73', chapter: 8,
      speaker: 'ya',
      text: '别绷那么紧。\n你手一紧，画出来就歪。\n……放松点，我又不吃你。',
      next: 'c8_74'
    },
    {
      id: 'c8_74', chapter: 8,
      speaker: 'jin',
      text: '我没绷。\n你先说，你要做什么。',
      cast: [{ id: 'jin', pos: 'right', expr: 'serious', outfit: 'nails', act: 'sit' }],
      next: 'c8_75'
    },
    {
      id: 'c8_75', chapter: 8,
      speaker: 'ya',
      text: '给你做猫猫款。粉色的底，一只小猫，耳朵、尾巴、一撮胡须。\n可爱到你自己都不好意思的那种。',
      cast: [{ id: 'ya', pos: 'left', expr: 'laugh', outfit: 'casual', act: 'reach' }, { id: 'jin', pos: 'right', expr: 'blank', outfit: 'nails', act: 'sit' }],
      sfx: 'sfx_laugh', next: 'c8_76'
    },
    {
      id: 'c8_76', chapter: 8,
      speaker: 'jin',
      text: '……可爱个头。\n谁做那个啊。',
      next: 'c8_77'
    },
    {
      id: 'c8_77', chapter: 8,
      speaker: 'inner',
      text: '「可爱个头」这四个字我说得特别快。\n再慢半秒，她就听得出来我其实一点都不反对。\n我甚至已经在想，那只小猫画出来是什么样子。粉的底，耳朵尖一点……\n……我在想什么。',
      cast: [{ id: 'jin', pos: 'right', expr: 'shy', outfit: 'nails', act: 'sit' }],
      next: 'c8_78'
    },
    {
      id: 'c8_78', chapter: 8,
      speaker: 'ya',
      text: '那另一只手呢。\n另一只手做酷的，磨砂黑，加一条细细的银线。\n不许反悔啊。',
      cast: [{ id: 'ya', pos: 'left', expr: 'proud', outfit: 'casual', act: 'sit' }, { id: 'jin', pos: 'right', expr: 'surprised', outfit: 'nails', act: 'sit' }],
      next: 'c8_79'
    },
    {
      id: 'c8_79', chapter: 8,
      speaker: 'inner',
      text: '一粉一黑。她连这个都想好了。\n我低头看自己的手。两只手一模一样，什么都没做过，这么多年就这么过来的。\n……今天要被画上猫了。',
      next: 'c8_80'
    },
    {
      id: 'c8_80', chapter: 8,
      speaker: 'ya',
      text: '选一个。哪只手做猫猫。\n快点。老板还等着呢，别磨叽。',
      cast: [{ id: 'ya', pos: 'left', expr: 'tease', outfit: 'casual', act: 'reach' }, { id: 'jin', pos: 'right', expr: 'blank', outfit: 'nails', act: 'sit' }],
      next: 'c8_81'
    },
    {
      id: 'c8_81', chapter: 8, choices: [
        {
          text: '左手做猫猫，右手做黑的',
          hint: '（右手敲键盘、写字最多，做黑的比较"讲道理"）',
          effects: { affection: 3, trust: 3, courage: 4, flags: { f_nail_cat: true, f_nail_cool: true } },
          next: 'c8_82a'
        },
        {
          text: '右手做猫猫，左手做黑的',
          hint: '（这只手我每天要看很多次——但我不会告诉她为什么）',
          effects: { affection: 7, trust: 5, courage: 8, flags: { f_nail_cat: true, f_nail_cool: true } },
          next: 'c8_82b'
        },
        {
          text: '两只手都做猫猫，行不行',
          hint: '（我就是要两只都是猫猫——这次不找借口）',
          effects: { affection: 5, trust: 2, courage: 6, flags: { f_nail_cat: true } },
          next: 'c8_82c'
        }
      ]
    },
    {
      id: 'c8_82a', zoom:'hand', hand:'mixed_left_cat', chapter: 8, beat: 'pulse',
      speaker: 'jin',
      text: '左手猫猫。右手黑的。\n右手要写字、要敲键盘。黑的……低调一点。\n……不是。我没想那么多。',
      cast: [{ id: 'ya', pos: 'left', expr: 'surprised', outfit: 'casual', act: 'sit' }, { id: 'jin', pos: 'right', expr: 'serious', outfit: 'nails', act: 'sit' }],
      next: 'c8_83'
    },
    {
      id: 'c8_82b', zoom:'hand', hand:'mixed_right_cat', chapter: 8, beat: 'swell',
      speaker: 'jin',
      text: '……猫猫放右手。左手黑的。\n……别问为什么。',
      cast: [{ id: 'ya', pos: 'left', expr: 'surprised', outfit: 'casual', act: 'sit' }, { id: 'jin', pos: 'right', expr: 'shy', outfit: 'nails', act: 'sit' }],
      effects: { affection: 4, trust: 3, courage: 2 }, next: 'c8_83'
    },
    {
      id: 'c8_82c', chapter: 8,
      speaker: 'jin',
      text: '那就两只手都做猫猫。\n……我知道这不像我。\n可我就是想两只都是。',
      cast: [{ id: 'ya', pos: 'left', expr: 'laugh', outfit: 'casual', act: 'sit' }, { id: 'jin', pos: 'right', expr: 'panic', outfit: 'nails', act: 'sit' }],
      effects: { affection: 3, trust: 2, courage: 4 }, next: 'c8_83'
    },
    {
      id: 'c8_83', chapter: 8, beat: 'swell',
      speaker: 'ya',
      text: '行啊。那就听你的。\n……你这个人真的很会挑。',
      cast: [{ id: 'ya', pos: 'left', expr: 'smile', outfit: 'casual', act: 'sit' }, { id: 'jin', pos: 'right', expr: 'shy', outfit: 'nails', act: 'sit' }],
      next: 'c8_84'
    },
    {
      id: 'c8_84', chapter: 8,
      speaker: 'ya',
      text: '你挑的时候眼睛都没眨一下。\n刚才是谁说自己随便的？',
      cast: [{ id: 'ya', pos: 'left', expr: 'tease', outfit: 'casual', act: 'reach' }, { id: 'jin', pos: 'right', expr: 'panic', outfit: 'nails', act: 'sit' }],
      next: 'c8_85'
    },
    {
      id: 'c8_85', chapter: 8,
      speaker: 'jin',
      text: '……你别乱解读啊。\n……快做吧。',
      next: 'c8_86'
    },
    {
      id: 'c8_86', chapter: 8,
      speaker: 'narrator',
      text: '上底色的时候凉凉的。\n她搬了张凳子坐到我旁边，下巴几乎搁在我手背上，盯着老板的笔。\n第一只手的小猫成形的时候，她自己先「哇」了一声。',
      next: 'c8_87'
    },
    {
      id: 'c8_87', chapter: 8,
      speaker: 'ya',
      text: '看你看你看。五个小圆点，两只尖耳朵，尾巴还往这边翘。\n哎呀——好可爱。',
      cast: [{ id: 'ya', pos: 'left', expr: 'excited', outfit: 'casual', act: 'reach' }, { id: 'jin', pos: 'right', expr: 'soft', outfit: 'nails', act: 'sit' }],
      next: 'c8_88'
    },
    {
      id: 'c8_88', chapter: 8,
      speaker: 'jin',
      text: '……还行吧。\n……嗯，画得不错。',
      next: 'c8_89'
    },
    {
      id: 'c8_89', chapter: 8,
      speaker: 'inner',
      text: '我心里想的那句话是：这只猫像我。\n她要是真把这句话说出口，我可能会把手缩回去。\n……所以我什么都没说。',
      cast: [{ id: 'jin', pos: 'right', expr: 'shy', outfit: 'nails', act: 'sit' }],
      condition: { flags: ['f_nail_cool'] }, next: 'c8_90', else: 'c8_90cat'
    },
    {
      /* 选项⑫ 分支 C（两只手都做猫猫）专用：与 c8_90 / c8_91 / c8_92 同位置的分支文本。
         只在没有做黑色那只手时进入（f_nail_cool 未点亮）。 */
      id: 'c8_90cat', zoom:'hand', hand:'both_cat', chapter: 8,
      cast: [
        { id: 'ya', pos: 'left', expr: 'smile', outfit: 'casual', act: 'reach' },
        { id: 'jin', pos: 'right', expr: 'shy', outfit: 'nails', act: 'sit' }
      ],
      speaker: 'narrator',
      text: '另一只手也画好了——一样的粉底，一样的小猫，耳朵朝里，尾巴朝外，两只手对着趴在桌上。\n我心里想的那句话是：这两只猫，其实都像我。\n她掏出手机，把两只手并在一起拍了一张，一边拍一边笑：「这就是你本人啊。一只甜的，另一只也是甜的。」',
      next: 'c8_93'
    },
    {
      id: 'c8_90', chapter: 8, zoom: 'hand', hand:'both_nails',
      speaker: 'narrator',
      text: '另一只手是磨砂黑，只有中指上一条很细的银线。\n黑的那只搁在桌上，跟旁边粉色的凑在一起——看着像两个人。',
      next: 'c8_91'
    },
    {
      id: 'c8_91', chapter: 8, sfx: 'sfx_camera',
      speaker: 'ya',
      text: '别动别动，我拍一张。\n两只手放一起——对，就这样，别缩。',
      cast: [{ id: 'ya', pos: 'left', expr: 'smile', outfit: 'casual', act: 'reach' }, { id: 'jin', pos: 'right', expr: 'awkward', outfit: 'nails', act: 'sit' }],
      next: 'c8_92'
    },
    {
      id: 'c8_92', chapter: 8, cg: 'cg_nail_art', transition: 'slowfade',
      speaker: 'narrator',
      text: '粉底、小猫、翘起来的尾巴；磨砂黑、一条银线。\n她一边拍一边笑，说「这就是你本人啊，一只甜的，一只凶的」。',
      next: 'c8_93'
    },
    {
      id: 'c8_93', chapter: 8,
      speaker: 'ya',
      text: '猫猫画得太可爱了。\n……你以后多低头看两眼，行不行。',
      next: 'c8_94'
    },
    {
      id: 'c8_94', chapter: 8,
      speaker: 'jin',
      text: '可爱个头。\n……你手别抖，拍糊了就不好看了。',
      cast: [{ id: 'jin', pos: 'right', expr: 'shy', outfit: 'nails', act: 'sit' }],
      next: 'c8_95'
    },
    {
      id: 'c8_95', chapter: 8,
      speaker: 'inner',
      text: '我说「你手别抖」的时候，一直在偷看屏幕上的猫猫。\n我怕拍不清楚。\n这个担心很奇怪。但它很真实。',
      next: 'c8_96'
    },
    {
      id: 'c8_96', chapter: 8,
      speaker: 'narrator',
      text: '甲油还没干透。她把我的两只手摊在自己膝盖上，用烘干灯一盏一盏烤。\n烤到第二只手，她突然抬头，眼睛亮了一下。\n……那个表情我认得。',
      next: 'c8_97'
    },
    {
      id: 'c8_97', chapter: 8, sfx: 'sfx_camera',
      speaker: 'ya',
      text: '我发朋友圈了。\n配图都选好了。',
      cast: [{ id: 'ya', pos: 'left', expr: 'proud', outfit: 'casual', act: 'sit' }, { id: 'jin', pos: 'right', expr: 'surprised', outfit: 'nails', act: 'sit' }],
      next: 'c8_98'
    },
    {
      id: 'c8_98', chapter: 8,
      speaker: 'jin',
      text: '什么？\n等等——\n……你先把手机给我。',
      cast: [{ id: 'jin', pos: 'right', expr: 'panic', outfit: 'nails', act: 'reach' }],
      transition: 'flash', next: 'c8_99'
    },
    {
      id: 'c8_99', chapter: 8, zoom: 'hand', hand:'cat_nails',
      speaker: 'narrator',
      text: '我伸手去抢。\n她整个人从椅子上滑下去，缩到桌子另一边，把手机按在胸口。\n她笑得太大，老板都回头看我们。',
      next: 'c8_100'
    },
    {
      id: 'c8_100', chapter: 8,
      speaker: 'ya',
      text: '你抢不到。\n再说你指甲没干，你再动一下就要花了——花的可是猫猫。',
      cast: [{ id: 'ya', pos: 'left', expr: 'laugh', outfit: 'casual', act: 'turn' }, { id: 'jin', pos: 'right', expr: 'panic', outfit: 'nails', act: 'reach' }],
      sfx: 'sfx_laugh', next: 'c8_101'
    },
    {
      id: 'c8_101', chapter: 8,
      speaker: 'narrator',
      text: '我就那样半站起来，又半坐下去，两只手举在半空。\n镜子里我耳朵是红的，红到耳根——跟刚才那片粉色配得刚好。',
      next: 'c8_102'
    },
    {
      id: 'c8_102', chapter: 8, zoom: 'face', transition: 'slowfade',
      speaker: 'jin',
      text: '……文案。\n……你到底写了什么。',
      cast: [{ id: 'jin', pos: 'right', expr: 'guilty', outfit: 'nails', act: 'sit' }],
      next: 'c8_103'
    },
    {
      id: 'c8_103', chapter: 8,
      speaker: 'ya',
      text: '写「某人第一次做美甲，猫猫是他自己挑的」。\n没了。我没写你名字。',
      cast: [{ id: 'ya', pos: 'left', expr: 'tease', outfit: 'casual', act: 'sit' }, { id: 'jin', pos: 'right', expr: 'shy', outfit: 'nails', act: 'sit' }],
      next: 'c8_104'
    },
    {
      id: 'c8_104', chapter: 8,
      speaker: 'jin',
      text: '……给我看一眼。\n……就一眼，行不行。',
      next: 'c8_105'
    },
    {
      id: 'c8_105', chapter: 8, transition: 'slowfade',
      speaker: 'narrator',
      text: '她把手机转过来。\n照片里两只手并在一起，手背上的小猫画得有点歪。边上露出她半张笑得模糊的脸。',
      next: 'c8_106'
    },
    {
      id: 'c8_106', chapter: 8,
      speaker: 'jin',
      text: '……还行。\n……嗯，拍得还行。',
      cast: [{ id: 'jin', pos: 'right', expr: 'shy', outfit: 'nails', act: 'sit' }],
      next: 'c8_107'
    },
    {
      id: 'c8_107', chapter: 8,
      speaker: 'inner',
      text: '「拍得还行」。\n我想说的是「我挺喜欢的」。\n这句话在嘴里转了三圈，出来就剩两个字，还行。\n……为什么每次都这样。',
      next: 'c8_108'
    },
    {
      id: 'c8_108', chapter: 8, zoom: 'face',
      speaker: 'ya',
      text: '你耳朵还是红的。\n左边那只更红。',
      cast: [{ id: 'ya', pos: 'left', expr: 'tease', outfit: 'casual', act: 'sit' }, { id: 'jin', pos: 'right', expr: 'awkward', outfit: 'nails', act: 'sit' }],
      next: 'c8_109'
    },
    {
      id: 'c8_109', chapter: 8,
      speaker: 'jin',
      text: '店里暖气开太足了。\n……真的，你别看我。',
      next: 'c8_110'
    },
    {
      id: 'c8_110', chapter: 8,
      speaker: 'ya',
      text: '嗯。暖气。\n……嗯。',
      cast: [{ id: 'ya', pos: 'left', expr: 'laugh', outfit: 'casual', act: 'sit' }, { id: 'jin', pos: 'right', expr: 'guilty', outfit: 'nails', act: 'sit' }],
      effects: { affection: 6, trust: 4, courage: 5, flags: { f_nail_cat: true } },
      next: 'c8_111'
    },
    {
      id: 'c8_111', chapter: 8, scene: 'street_cn', tint: 'night', bgm: 'bgm_warm',
      cast: [
        { id: 'ya', pos: 'left', expr: 'smile', outfit: 'winter', act: 'idle' },
        { id: 'jin', pos: 'right', expr: 'soft', outfit: 'winter', act: 'idle' }
      ],
      speaker: 'narrator',
      text: '出门的时候风一下灌进来。\n我把手插进兜里，插到一半又抽出来看一眼。\n路灯下面，那点粉色还亮着，猫的耳朵在光里。',
      transition: 'slowfade', next: 'c8_112'
    },
    {
      id: 'c8_112', chapter: 8, zoom: 'hand', hand:'cat_nails',
      speaker: 'inner',
      text: '那天晚上我打字慢了一半。\n不是因为不方便。是因为每敲一下，手背上的小猫就跟着跳一下。\n……我好像并不讨厌这样。\n这件事我没跟任何人说。',
      cast: [{ id: 'jin', pos: 'right', expr: 'soft', outfit: 'winter', act: 'idle' }],
      next: 'c8_113'
    },

    /* =========================================================
     *  02 · 12 · 我帮她买蛋糕
     * ========================================================= */
    {
      id: 'c8_113', chapter: 8, scene: 'street_cn', tint: 'day', bgm: 'bgm_warm',
      cast: [{ id: 'jin', pos: 'center', expr: 'serious', outfit: 'winter', act: 'idle' }],
      speaker: 'narrator',
      text: '十二号上午，她在家帮她妈妈做菜。\n我出门去取蛋糕。店在两条街外，一家做巧克力的，玻璃柜里全是深色的东西。',
      titlecard: '2026 · 02 · 12  上午', transition: 'fade', next: 'c8_114'
    },
    {
      id: 'c8_114', chapter: 8,
      speaker: 'inner',
      text: '我在店里站了很久。六寸还是八寸，草莓还是巧克力，要不要写字，写什么字。\n最后什么都没写。\n……我挑了一个形状。',
      next: 'c8_115'
    },
    {
      id: 'c8_115', chapter: 8, chat: [
        { from: 'jin', text: '你喜欢巧克力的还是奶油的', time: '10:12:30' },
        { from: 'ya', text: '你问这个干嘛', time: '10:13:02' },
        { from: 'jin', text: '随便问问', time: '10:13:20' },
        { from: 'ya', text: '哦——', time: '10:13:26' },
        { from: 'ya', text: '巧克力。要苦一点的那种', time: '10:13:40' },
        { from: 'ya', text: '你是不是在蛋糕店', time: '10:13:52' },
        { from: 'jin', text: '没有', time: '10:14:11' },
        { from: 'ya', text: '这一句你憋了二十秒', time: '10:14:20' }
      ],
      next: 'c8_116'
    },
    {
      id: 'c8_116', chapter: 8,
      speaker: 'inner',
      text: '我选的是一个火山形状的巧克力小蛋糕。不大，一只手能托住，顶上浇着一层亮亮的巧克力，边上撒着深色的碎屑。\n字我没让写。\n……我想不出合适的两个字。',
      next: 'c8_117'
    },
    {
      id: 'c8_117', chapter: 8, scene: 'home_living', tint: 'day', bgm: 'bgm_quiet', beat: 'calm',
      cast: [
        { id: 'ya', pos: 'left', expr: 'surprised', outfit: 'home', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'awkward', outfit: 'formal', act: 'sit' }
      ],
      speaker: 'narrator',
      text: '我拎着蛋糕回她家。进门才发现客厅里坐着她妈妈。\n还有她爸爸。\n他昨晚出差回来，今天没再走，就坐在那张单人沙发上。',
      transition: 'fade', next: 'c8_118'
    },
    {
      id: 'c8_118', chapter: 8,
      speaker: 'narrator',
      text: '我把蛋糕放在茶几上，说了句「阿姨好、叔叔好」。\n她妈妈接过盒子，嘴上说「来就来，还买这个」，回头就喊她：别光站着，给人倒水。',
      next: 'c8_119'
    },
    {
      id: 'c8_119', chapter: 8, zoom: 'face', transition: 'slowfade',
      speaker: 'inner',
      text: '我那天换了白衬衫，袖口扣得整整齐齐。\n坐下不到两分钟，左手袖口已经被我整理了三遍。\n我知道那是在掩饰。\n可我停不下来。',
      cast: [{ id: 'jin', pos: 'right', expr: 'awkward', outfit: 'formal', act: 'sit' }],
      next: 'c8_120'
    },
    {
      id: 'c8_120', chapter: 8,
      speaker: 'narrator',
      text: '她爸爸个子不高，坐在那张单人沙发上，手里转着一串钥匙。\n他看了我一眼，又看了一眼茶几上的蛋糕盒，往旁边挪了挪，给我腾出半张沙发。',
      next: 'c8_121'
    },
    {
      id: 'c8_121', chapter: 8,
      speaker: 'narrator',
      text: '她妈妈从厨房端出一杯热水，放在我面前：「外面冷吧，手都红了。」\n又端来一盘切好的苹果搁在我手边，才回厨房去忙。',
      next: 'c8_122'
    },
    {
      id: 'c8_122', chapter: 8,
      speaker: 'jin',
      text: '叔叔好。\n我是……我是从上海过来的。\n……坐飞机来的。',
      cast: [{ id: 'ya', pos: 'left', expr: 'worried', outfit: 'home', act: 'sit' }, { id: 'jin', pos: 'right', expr: 'awkward', outfit: 'formal', act: 'sit' }],
      next: 'c8_123'
    },
    {
      id: 'c8_123', chapter: 8,
      speaker: 'narrator',
      text: '她爸爸唔了一声，把钥匙放到茶几上，往沙发背上靠了靠。\n他问：「从上海过来，路上几个小时？」\n我说三个多小时。他点点头：「那不算远。以后来，别老挑最晚那班。」\n他说这话的时候，顺手把茶杯往我这边推了推。',
      next: 'c8_124'
    },
    {
      id: 'c8_124', chapter: 8, choices: [
        {
          text: '按实话说：我们是朋友，一起打游戏，每个月见一面',
          hint: '（不说漂亮话，也不骗人——只是把话说得不那么重）',
          effects: { trust: 5, courage: 4, flags: { f_met_parents: true } },
          next: 'c8_125a'
        },
        {
          text: '老实交代：我在追她，这次是来陪她过生日的',
          hint: '（她爸爸会怎么想？但藏着掖着更不像我）',
          effects: { affection: 5, trust: 4, courage: 8, flags: { f_met_parents: true } },
          next: 'c8_125b'
        },
        {
          text: '就说是同学，来南阳办事，顺便过来看看',
          hint: '（最安全，也最不像我）',
          effects: { trust: -4, courage: -4 },
          next: 'c8_125c'
        }
      ]
    },
    {
      id: 'c8_125a', chapter: 8,
      speaker: 'jin',
      text: '我们是打游戏认识的，后来一起做点东西。\n她生日，我从上海过来的。\n……就待三天。',
      cast: [{ id: 'ya', pos: 'left', expr: 'shy', outfit: 'home', act: 'sit' }, { id: 'jin', pos: 'right', expr: 'serious', outfit: 'formal', act: 'sit' }],
      next: 'c8_126'
    },
    {
      id: 'c8_125b', chapter: 8, beat: 'swell',
      speaker: 'jin',
      text: '叔叔……\n我在追她。\n这次过来，就是专门陪她过生日的。\n……我知道这话说得有点早。',
      cast: [{ id: 'ya', pos: 'left', expr: 'surprised', outfit: 'home', act: 'sit' }, { id: 'jin', pos: 'right', expr: 'serious', outfit: 'formal', act: 'sit' }],
      next: 'c8_126'
    },
    {
      id: 'c8_125c', chapter: 8, beat: 'drop',
      speaker: 'jin',
      text: '我们是同学。\n这次来南阳办点事，顺便过来拜访。\n……嗯。就是这样。\n……对。',
      cast: [{ id: 'ya', pos: 'left', expr: 'sad', outfit: 'home', act: 'sit' }, { id: 'jin', pos: 'right', expr: 'guilty', outfit: 'formal', act: 'sit' }],
      next: 'c8_126'
    },
    {
      id: 'c8_126', chapter: 8,
      speaker: 'narrator',
      text: '她爸爸听完，把杯子里的水喝了一口，又放下。\n他问：「你们认识多久了。」\n我张嘴的时候，桌子底下有人踢了我一脚。很轻。我抬眼，她正低头剥橘子，耳朵是红的。\n我说，快一年了。\n他唔了一声：「一年不短了。」然后起身去阳台打电话，走之前顺手收走了桌上的橘子皮。',
      next: 'c8_127'
    },
    {
      id: 'c8_127', chapter: 8,
      speaker: 'narrator',
      text: '那顿饭吃得很平常。\n她妈妈做了四个菜，一直往我碗里夹：「多吃点，上海的菜都太甜。」\n她爸爸问：「能吃辣吧？」我说能。\n他就笑了一下。\n……那一下，我记了很久。',
      next: 'c8_128'
    },
    {
      id: 'c8_128', chapter: 8,
      speaker: 'narrator',
      text: '饭后她把我拉进厨房洗碗。\n她妈妈站在门口，水龙头开着，三个人一边干活一边说话。\n说来说去，全是在排我明天早上吃什么。',
      cast: [{ id: 'ya', pos: 'left', expr: 'tease', outfit: 'home', act: 'idle' }, { id: 'jin', pos: 'right', expr: 'awkward', outfit: 'formal', act: 'idle' }],
      next: 'c8_129'
    },
    {
      id: 'c8_129', chapter: 8,
      speaker: 'ya',
      text: '今晚你先住酒店，房间我妈昨天就订好了。\n我爸十四号早上走。他一走，你就搬过来。\n……别磨蹭，听见没。',
      cast: [{ id: 'ya', pos: 'left', expr: 'pout', outfit: 'home', act: 'sit' }, { id: 'jin', pos: 'right', expr: 'panic', outfit: 'formal', act: 'sit' }],
      next: 'c8_130'
    },
    {
      id: 'c8_130', chapter: 8,
      speaker: 'narrator',
      text: '她妈妈在旁边点头：「房间我看过了，干净。」\n然后把一串钥匙塞进小崔的口袋里，转身去擦灶台。\n像什么都没发生。',
      next: 'c8_131'
    },
    {
      id: 'c8_131', chapter: 8, beat: 'calm',
      speaker: 'inner',
      text: '我站在洗碗池前面，手里还捏着一只碗。\n她们娘俩早就把这事商量好了，一句都没让我操心。\n我张了张嘴，什么也没说出来，就一直点头。\n……那一串钥匙在她口袋里响了一声。',
      cast: [{ id: 'jin', pos: 'right', expr: 'soft', outfit: 'formal', act: 'sit' }],
      effects: { trust: 3, flags: { f_hotel_first: true } }, next: 'c8_132'
    },
    {
      id: 'c8_132', chapter: 8, scene: 'street_cn', tint: 'night', bgm: 'bgm_quiet', beat: 'calm',
      cast: [
        { id: 'ya', pos: 'left', expr: 'smile', outfit: 'winter', act: 'idle' },
        { id: 'jin', pos: 'right', expr: 'soft', outfit: 'winter', act: 'idle' }
      ],
      speaker: 'narrator',
      text: '她送我下楼等车。路口那盏灯是旧的橘色，风把她的头发吹到脸上，她也不拨。手插在口袋里，一边走一边跟我数明天要去的店。',
      transition: 'fade', next: 'c8_133'
    },
    {
      id: 'c8_133', chapter: 8,
      speaker: 'ya',
      text: '明天早上我去酒店接你。七点啊，别赖床。',
      next: 'c8_134'
    },
    {
      id: 'c8_134', chapter: 8,
      speaker: 'jin',
      text: '七点啊。你们这儿的人，起这么早。\n……知道了。',
      cast: [{ id: 'ya', pos: 'left', expr: 'surprised', outfit: 'winter', act: 'idle' }, { id: 'jin', pos: 'right', expr: 'soft', outfit: 'winter', act: 'idle' }],
      next: 'c8_135'
    },
    {
      id: 'c8_135', chapter: 8,
      speaker: 'ya',
      text: '胡辣汤七点半就卖完啦。你要是起不来，我可不管你，我自己坐一桌子吃。',
      next: 'c8_136'
    },
    {
      id: 'c8_136', chapter: 8,
      speaker: 'jin',
      text: '起得来。我六点五十在楼下等。\n……你爸要是回来吃饭，我等他一起。',
      cast: [{ id: 'ya', pos: 'left', expr: 'laugh', outfit: 'winter', act: 'idle' }, { id: 'jin', pos: 'right', expr: 'smile', outfit: 'winter', act: 'idle' }],
      next: 'c8_137'
    },
    {
      id: 'c8_137', chapter: 8,
      speaker: 'narrator',
      text: '她笑了一下，拉住我的袖子，把我往路灯下面拽了半步。她说她爸明天下午的飞机，走了就把小隔间铺好——被子用她自己那床。',
      next: 'c8_138'
    },
    {
      id: 'c8_138', chapter: 8,
      speaker: 'inner',
      text: '她连被子都想好了。我点头，说好。\n我住过很多别人家的客房，毛巾叠成方块，拖鞋是新的，谁都客客气气。这次不太一样。我站在那盏橘色的灯底下，忽然不知道手该放哪儿。\n……上一次这样，还是大一第一次班会。',
      cast: [{ id: 'jin', pos: 'right', expr: 'soft', outfit: 'winter', act: 'idle' }],
      effects: { affection: 4, trust: 4 }, next: 'c8_139'
    },
    {
      id: 'c8_139', chapter: 8, scene: 'hotel', tint: 'night', bgm: 'bgm_quiet', beat: 'calm',
      cast: [{ id: 'jin', pos: 'center', expr: 'sleepy', outfit: 'casual', act: 'sit' }],
      speaker: 'narrator',
      text: '酒店在四楼，窗外是一条主路，车灯一辆一辆地过去。我把行李摊开，白衬衫挂起来，然后坐在床边，翻她发来的那张小隔间的照片。',
      transition: 'fade', titlecard: '2026 · 02 · 12  夜', next: 'c8_140'
    },
    {
      id: 'c8_140', chapter: 8, chat: [
        { from: 'ya', text: '你看，铺好了', time: '22:41:02' },
        { from: 'ya', text: '发了一张照片', time: '22:41:05' },
        { from: 'jin', text: '这么小', time: '22:42:19' },
        { from: 'ya', text: '够睡了', time: '22:42:30' },
        { from: 'ya', text: '被子是我自己那床', time: '22:42:41' },
        { from: 'jin', text: '……', time: '22:43:50' },
        { from: 'jin', text: '那我明天早点过去', time: '22:44:12' },
        { from: 'ya', text: '嗯。晚安', time: '22:44:20' },
        { from: 'jin', text: '晚安', time: '22:44:47' }
      ],
      next: 'c8_141'
    },
    {
      id: 'c8_141', chapter: 8,
      speaker: 'inner',
      text: '「被子是我自己那床」。我盯着这几个字看了很久，久到手机屏幕暗了一次，才发现自己在笑。\n酒店的床很大，我睡得不太踏实。',
      cast: [{ id: 'jin', pos: 'center', expr: 'shy', outfit: 'casual', act: 'sit' }],
      next: 'c8_142'
    },

    /* =========================================================
     *  02 · 13 · 在她妈妈眼皮底下偷买奶茶
     * ========================================================= */
    {
      id: 'c8_142', chapter: 8, scene: 'home_living', tint: 'day', bgm: 'bgm_game', beat: 'pulse',
      cast: [
        { id: 'ya', pos: 'left', expr: 'tease', outfit: 'home', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'awkward', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'narrator',
      text: '十三号中午，她爸爸还在。她妈妈在厨房剁东西，剁得很响。小崔凑过来，用只有两个人听得见的音量说话。',
      titlecard: '2026 · 02 · 13  中午', transition: 'fade', next: 'c8_143'
    },
    {
      id: 'c8_143', chapter: 8,
      speaker: 'ya',
      text: '我想喝奶茶呀。可是这几天我妈不让我买。',
      next: 'c8_144'
    },
    {
      id: 'c8_144', chapter: 8,
      speaker: 'jin',
      text: '……那你还说。\n……真拿你没办法。',
      cast: [{ id: 'jin', pos: 'right', expr: 'blank', outfit: 'casual', act: 'sit' }],
      next: 'c8_145'
    },
    {
      id: 'c8_145', chapter: 8,
      speaker: 'ya',
      text: '你去买嘛。她不会说你。你是客人呀。',
      cast: [{ id: 'ya', pos: 'left', expr: 'proud', outfit: 'home', act: 'sit' }, { id: 'jin', pos: 'right', expr: 'awkward', outfit: 'casual', act: 'sit' }],
      next: 'c8_146'
    },
    {
      id: 'c8_146', chapter: 8,
      speaker: 'inner',
      text: '我抬眼往厨房那边看了一下。剁菜的声音停了一下，又响起来。\n我这个人从来不做这种事。手已经在掏手机了。\n……我居然还有点紧张。',
      next: 'c8_147'
    },
    {
      id: 'c8_147', chapter: 8,
      speaker: 'narrator',
      text: '两个人把头凑在一起看手机，点得飞快，像在做什么见不得人的事。她压着声音念「少冰、三分糖」，我压着声音回「备注写放门口，别按门铃」。\n她嫌我慢，还在旁边数珍珠。',
      next: 'c8_148'
    },
    {
      id: 'c8_148', chapter: 8,
      speaker: 'ya',
      text: '珍珠多加一份。反正她不知道。',
      cast: [{ id: 'ya', pos: 'left', expr: 'excited', outfit: 'home', act: 'reach' }, { id: 'jin', pos: 'right', expr: 'guilty', outfit: 'casual', act: 'sit' }],
      next: 'c8_149'
    },
    {
      id: 'c8_149', chapter: 8, sfx: 'sfx_ding',
      speaker: 'narrator',
      text: '外卖到得很快。我从沙发上弹起来，说「我下去扔个垃圾」，顺手拎了玄关那个垃圾袋——空的，轻得像没拎东西。',
      next: 'c8_150'
    },
    {
      id: 'c8_150', chapter: 8,
      speaker: 'narrator',
      text: '回来的时候，两杯奶茶塞在外套里面，一边一杯，贴着肚子。我把拉链一直拉到下巴，进门先屏住呼吸换鞋。',
      next: 'c8_151'
    },
    {
      id: 'c8_151', chapter: 8,
      speaker: 'ya',
      text: '快快快，去我房间。',
      cast: [{ id: 'ya', pos: 'left', expr: 'excited', outfit: 'home', act: 'reach' }, { id: 'jin', pos: 'right', expr: 'panic', outfit: 'casual', act: 'idle' }],
      next: 'c8_152'
    },
    {
      id: 'c8_152', chapter: 8, beat: 'drop',
      speaker: 'narrator',
      text: '——「小崔。」',
      transition: 'flash', next: 'c8_153'
    },
    {
      id: 'c8_153', chapter: 8,
      speaker: 'narrator',
      text: '她妈妈从厨房门口探出半个身子，手上还拿着锅铲。她先看了看小崔，又看了看我，最后落在我外套上那块鼓起来的地方。',
      next: 'c8_154'
    },
    {
      id: 'c8_154', chapter: 8, beat: 'drop',
      speaker: 'narrator',
      text: '「你外套里那个，是奶茶吧。」',
      next: 'c8_155'
    },
    {
      id: 'c8_155', chapter: 8,
      speaker: 'inner',
      text: '我整个人钉在原地。两杯奶茶贴着肚子，冰得发凉。\n零点五秒里我想出四个借口，然后发现每一个都比奶茶本身更可疑。',
      cast: [{ id: 'jin', pos: 'right', expr: 'panic', outfit: 'casual', act: 'idle' }],
      next: 'c8_156'
    },
    {
      id: 'c8_156', chapter: 8, choices: [
        {
          text: '直接认下来：是我要喝的，跟她没关系',
          hint: '（把事揽到自己身上，别让她挨说）',
          effects: { trust: 6, courage: 5, flags: { f_sneak_milktea: true } },
          next: 'c8_157a'
        },
        {
          text: '把小崔供出来：是她要喝的，我是被指使的',
          hint: '（最真实，但这话说出口她要挨一顿）',
          effects: { affection: -3, trust: 2 },
          next: 'c8_157b'
        },
        {
          text: '硬说是酸奶，说路上买的、怕凉才塞衣服里',
          hint: '（我从来不会撒谎，今天也不想学）',
          effects: { trust: -5, courage: -4 },
          next: 'c8_157c'
        }
      ]
    },
    {
      id: 'c8_157a', chapter: 8, beat: 'calm',
      speaker: 'jin',
      text: '……是我买的。阿姨，我想喝，就顺手给她带了一杯。她没说要。',
      cast: [{ id: 'ya', pos: 'left', expr: 'surprised', outfit: 'home', act: 'sit' }, { id: 'jin', pos: 'right', expr: 'guilty', outfit: 'casual', act: 'idle' }],
      next: 'c8_158'
    },
    {
      id: 'c8_157b', chapter: 8,
      speaker: 'jin',
      text: '……是她说想喝的。她说她三天没喝了——\n……不对。\n是我自己想喝。阿姨，是我。',
      cast: [{ id: 'ya', pos: 'left', expr: 'pout', outfit: 'home', act: 'sit' }, { id: 'jin', pos: 'right', expr: 'awkward', outfit: 'casual', act: 'idle' }],
      next: 'c8_158'
    },
    {
      id: 'c8_157c', chapter: 8, beat: 'drop',
      speaker: 'jin',
      text: '……这不是奶茶，是酸奶。路上买的，怕凉，就塞衣服里了。\n……我说完自己都不信。',
      cast: [{ id: 'ya', pos: 'left', expr: 'surprised', outfit: 'home', act: 'sit' }, { id: 'jin', pos: 'right', expr: 'panic', outfit: 'casual', act: 'idle' }],
      next: 'c8_158'
    },
    {
      id: 'c8_158', chapter: 8, beat: 'calm',
      speaker: 'narrator',
      text: '她妈妈把锅铲往围裙上一插，走过来，从我外套里把两杯抽出来——很稳，一滴都没洒。然后她没问我，转头看了小崔一眼。\n「你不是说这几天不喝吗。」',
      next: 'c8_159'
    },
    {
      id: 'c8_159', chapter: 8,
      speaker: 'narrator',
      text: '「零下六度，你穿一件卫衣，从楼下提两杯冰的回来，还捂着。你说说，我该说你们什么。」',
      next: 'c8_160'
    },
    {
      id: 'c8_160', chapter: 8,
      speaker: 'narrator',
      text: '她说完自己先笑了：「行了，喝吧，下不为例。」\n给小崔留了一杯，另一杯推到我面前。转身进厨房，又端出一杯热的红糖姜茶，塞进我手里。',
      effects: { affection: 4, trust: 5 }, next: 'c8_161'
    },
    {
      id: 'c8_161', chapter: 8,
      speaker: 'ya',
      text: '看吧，我就说她不会说你。我妈连我爸都不怕，还怕你？',
      cast: [{ id: 'ya', pos: 'left', expr: 'shy', outfit: 'home', act: 'sit' }, { id: 'jin', pos: 'right', expr: 'soft', outfit: 'casual', act: 'sit' }],
      next: 'c8_162'
    },
    {
      id: 'c8_162', chapter: 8,
      speaker: 'jin',
      text: '……你妈妈人很好。比我预想的好。\n……真的。',
      next: 'c8_163'
    },
    {
      id: 'c8_163', chapter: 8,
      speaker: 'ya',
      text: '那你刚才为什么一直整理袖子。',
      cast: [{ id: 'ya', pos: 'left', expr: 'tease', outfit: 'home', act: 'sit' }, { id: 'jin', pos: 'right', expr: 'awkward', outfit: 'casual', act: 'sit' }],
      next: 'c8_164'
    },
    {
      id: 'c8_164', chapter: 8,
      speaker: 'jin',
      text: '……我没有啊。',
      next: 'c8_165'
    },
    {
      id: 'c8_165', chapter: 8,
      speaker: 'inner',
      text: '那杯姜茶我喝了很久。它是甜的。\n喝到一半才发现，小崔在桌子底下用脚尖碰了我一下，朝我比了个口型：看吧。',
      cast: [{ id: 'jin', pos: 'right', expr: 'shy', outfit: 'casual', act: 'sit' }],
      effects: { affection: 3, trust: 2 }, next: 'c8_166'
    },

    /* =========================================================
     *  爸爸走了 · 搬进小隔间
     * ========================================================= */
    {
      id: 'c8_166', chapter: 8, scene: 'home_living', tint: 'day', bgm: 'bgm_warm', beat: 'calm',
      cast: [{ id: 'jin', pos: 'center', expr: 'neutral', outfit: 'casual', act: 'idle' }],
      speaker: 'narrator',
      text: '十四号早上七点，她爸爸拎着箱子出门。我站在门口说「叔叔路上小心」，他回头看了我一眼，又补了一句：「外面冷，送完就进去。」',
      titlecard: '2026 · 02 · 14  07:10', transition: 'fade', next: 'c8_167'
    },
    {
      id: 'c8_167', chapter: 8,
      speaker: 'ya',
      text: '哎——搬东西啦。傻子，酒店退了吧。',
      cast: [{ id: 'ya', pos: 'left', expr: 'excited', outfit: 'home', act: 'reach' }, { id: 'jin', pos: 'right', expr: 'smile', outfit: 'casual', act: 'idle' }],
      next: 'c8_168'
    },
    {
      id: 'c8_168', chapter: 8, scene: 'home_living', tint: 'day',
      speaker: 'narrator',
      text: '小隔间确实小。一张折叠床，一个矮柜，窗户对着走廊，推拉门一关，就剩头顶那盏灯。\n我把行李靠墙放好，坐下去，床板响了一声。',
      next: 'c8_169'
    },
    {
      id: 'c8_169', chapter: 8,
      speaker: 'ya',
      text: '有点硬是吧。被子是我那床，你将就一下。',
      cast: [{ id: 'ya', pos: 'left', expr: 'shy', outfit: 'home', act: 'sit' }, { id: 'jin', pos: 'right', expr: 'soft', outfit: 'casual', act: 'sit' }],
      next: 'c8_170'
    },
    {
      id: 'c8_170', chapter: 8,
      speaker: 'jin',
      text: '不硬。比酒店那个大床好。\n……真的。',
      next: 'c8_171'
    },
    {
      id: 'c8_171', chapter: 8,
      speaker: 'ya',
      text: '骗人。那个床能睡两个人，你腰都没直起来。',
      cast: [{ id: 'ya', pos: 'left', expr: 'laugh', outfit: 'home', act: 'sit' }, { id: 'jin', pos: 'right', expr: 'shy', outfit: 'casual', act: 'sit' }],
      next: 'c8_172'
    },
    {
      id: 'c8_172', chapter: 8,
      speaker: 'inner',
      text: '我说的是真话。酒店那张床大得让人睡不踏实。\n这里小，小到我一伸手就能摸到推拉门。门那边就是她。\n我在床上把手抬起来，又放下。',
      cast: [{ id: 'jin', pos: 'right', expr: 'soft', outfit: 'casual', act: 'sit' }],
      effects: { affection: 4, trust: 3, flags: { f_hotel_first: true } }, next: 'c8_173'
    },

    /* =========================================================
     *  02 · 14 晚 · 小区楼下烤棉花糖
     * ========================================================= */
    {
      id: 'c8_173', chapter: 8, scene: 'home_yard', tint: 'night', bgm: 'bgm_ending', beat: 'swell',
      cast: [
        { id: 'ya', pos: 'left', expr: 'excited', outfit: 'winter', act: 'idle' },
        { id: 'jin', pos: 'right', expr: 'neutral', outfit: 'winter', act: 'idle' }
      ],
      speaker: 'narrator',
      text: '十四号晚上，她从厨房拎出个棉布袋，往我眼前一晃：「走，下楼。」\n袋口没扎紧，飘出来一点甜味。',
      titlecard: '2026 · 02 · 14  夜', transition: 'slowfade', next: 'c8_174'
    },
    {
      id: 'c8_174', chapter: 8,
      speaker: 'jin',
      text: '……你们小区楼下，还能烤东西啊？\n……生火，没人管吗。',
      next: 'c8_175'
    },
    {
      id: 'c8_175', chapter: 8,
      speaker: 'ya',
      text: '有啊，就东边那个角，有铁架子。我小时候在这儿烤过红薯——烤糊过仨。',
      cast: [{ id: 'ya', pos: 'left', expr: 'proud', outfit: 'winter', act: 'idle' }, { id: 'jin', pos: 'right', expr: 'smile', outfit: 'winter', act: 'idle' }],
      next: 'c8_176'
    },
    {
      id: 'c8_176', chapter: 8,
      speaker: 'narrator',
      text: '楼下只有两盏路灯是亮的，其余全黑。风从两栋楼中间穿过来，把她那条灰粉围巾的尾巴吹得笔直。\n她也不躲。',
      next: 'c8_177'
    },
    {
      id: 'c8_177', chapter: 8,
      speaker: 'narrator',
      text: '她蹲在地上支那个小炉架，打火机打了三次，第三次才着。我举着手机给她打光，没两分钟，手指就僵了。',
      next: 'c8_178'
    },
    {
      id: 'c8_178', chapter: 8,
      speaker: 'jin',
      text: '……手别碰。铁丝凉。\n我来穿。',
      cast: [{ id: 'jin', pos: 'right', expr: 'serious', outfit: 'winter', act: 'reach' }],
      next: 'c8_179'
    },
    {
      id: 'c8_179', chapter: 8,
      speaker: 'ya',
      text: '你会不会啊？签子要从正中间穿，偏一点，一烤就掉。\n别看我，我小时候也掉过。',
      cast: [{ id: 'ya', pos: 'left', expr: 'tease', outfit: 'winter', act: 'reach' }, { id: 'jin', pos: 'right', expr: 'awkward', outfit: 'winter', act: 'reach' }],
      next: 'c8_180'
    },
    {
      id: 'c8_180', chapter: 8,
      speaker: 'narrator',
      text: '第一颗我串歪了，刚放上去就滑进炭火里，烧成一小团黑。她笑得蹲都蹲不住，扶着膝盖说：「没事没事，练手的。」\n那颗黑的还在炭里冒烟。',
      sfx: 'sfx_laugh', next: 'c8_181'
    },
    {
      id: 'c8_181', chapter: 8,
      speaker: 'narrator',
      text: '第二颗成了。棉花糖在炭上慢慢转，转出一层焦黄色，表面鼓起来，边缘裂开一道口子，里面开始化。甜味混着炭火味，往上冒。',
      next: 'c8_182'
    },
    {
      id: 'c8_182', chapter: 8,
      speaker: 'ya',
      text: '快，趁热。外边那层先咬掉，别怕焦，里头是化开的。\n吹一下再吃呀，别学我。',
      cast: [{ id: 'ya', pos: 'left', expr: 'excited', outfit: 'winter', act: 'reach' }, { id: 'jin', pos: 'right', expr: 'serious', outfit: 'winter', act: 'reach' }],
      next: 'c8_183'
    },
    {
      id: 'c8_183', chapter: 8,
      speaker: 'inner',
      text: '我的手冻得抖，夹饼干夹了三次才夹稳。她笑我：「你这个人，干什么都像在考试。」\n她不知道，我不只手指在抖。这句我没敢说。',
      cast: [{ id: 'jin', pos: 'right', expr: 'soft', outfit: 'winter', act: 'reach' }],
      next: 'c8_184'
    },
    {
      id: 'c8_184', chapter: 8, cg: 'cg_marshmallow', transition: 'slowfade',
      speaker: 'narrator',
      text: '第一口有点烫。外面那层壳是脆的，咬破以后，里面是化开的糖，甜得发黏。\n她嫌了一句「太甜了」，然后把自己那颗也吃完了。',
      next: 'c8_185'
    },
    {
      id: 'c8_185', chapter: 8, cg: 'cg_marshmallow',
      speaker: 'ya',
      text: '这颗烤糊了。糊的那块最香，你尝尝？\n……嫌弃就还我，考试同学。',
      next: 'c8_186'
    },
    {
      id: 'c8_186', chapter: 8, cg: 'cg_marshmallow',
      speaker: 'jin',
      text: '……嗯。外边是苦的，里边是甜的。\n……我以为会全是甜的。',
      cast: [],
      next: 'c8_187'
    },
    {
      id: 'c8_187', chapter: 8, scene: 'home_yard', tint: 'night',
      cast: [
        { id: 'ya', pos: 'left', expr: 'excited', outfit: 'winter', act: 'reach' },
        { id: 'jin', pos: 'right', expr: 'soft', outfit: 'winter', act: 'reach' }
      ],
      speaker: 'narrator',
      text: '我们蹲在路灯底下，一共烤了十一颗。她鼻尖冻红了，手指红得像刚从冷水里捞出来的，还在往铁签上一颗一颗地串。\n比我快。',
      next: 'c8_188'
    },
    {
      id: 'c8_188', chapter: 8,
      speaker: 'narrator',
      text: '她忽然伸手，用袖口擦掉我嘴角的巧克力。我下意识往后躲，她就笑，眼睛在路灯底下弯成两个月牙。\n我的手还举在半空，什么都没接住。',
      transition: 'slowfade', next: 'c8_189'
    },
    {
      id: 'c8_189', chapter: 8, sfx: 'sfx_heart',
      speaker: 'inner',
      text: '那一刻我想说的话其实很多——比如她手指是不是很凉，比如我该把围巾还给她。\n结果我说的是：「风太大了。」\n我这辈子最不擅长的，就是在该说话的时候说话。',
      cast: [{ id: 'jin', pos: 'right', expr: 'moved', outfit: 'winter', act: 'idle' }],
      effects: { affection: 6, trust: 4, flags: { f_marshmallow: true } }, next: 'c8_190'
    },
    {
      id: 'c8_190', chapter: 8, beat: 'calm',
      speaker: 'ya',
      text: '……明天我爸要回来。\n你下午就得走了，是吧。',
      cast: [{ id: 'ya', pos: 'left', expr: 'sad', outfit: 'winter', act: 'idle' }, { id: 'jin', pos: 'right', expr: 'blank', outfit: 'winter', act: 'idle' }],
      next: 'c8_191'
    },
    {
      id: 'c8_191', chapter: 8,
      speaker: 'jin',
      text: '嗯。改签了。\n……下午两点那班。',
      next: 'c8_192'
    },
    {
      id: 'c8_192', chapter: 8,
      speaker: 'ya',
      text: '那你别让他撞见。他车停楼下的时候，你就说你已经走了。\n听见没。',
      cast: [{ id: 'ya', pos: 'left', expr: 'sad', outfit: 'winter', act: 'idle' }, { id: 'jin', pos: 'right', expr: 'soft', outfit: 'winter', act: 'idle' }],
      next: 'c8_193'
    },
    {
      id: 'c8_193', chapter: 8,
      speaker: 'inner',
      text: '她说这话的时候在笑。我知道她在替我省事，也替她自己省事。\n她爸那晚那句「你先在外面住一晚」，我一直记着。\n她大概也在装。她装得比我好。',
      next: 'c8_194'
    },

    /* =========================================================
     *  02 · 15 下午 · 提前拿行李 · 她定下明信片的规矩
     * ========================================================= */
    {
      id: 'c8_194', chapter: 8, scene: 'home_living', tint: 'day', bgm:'bgm_longing', beat: 'calm',
      cast: [
        { id: 'ya', pos: 'left', expr: 'smile', outfit: 'home', act: 'idle' },
        { id: 'jin', pos: 'right', expr: 'neutral', outfit: 'winter', act: 'idle' }
      ],
      speaker: 'narrator',
      text: '十五号下午，我把行李从那间小隔间里拎出来。折叠床收好，被子叠好，枕头按原样摆回去。\n两平米。我在里面站了几秒。',
      titlecard: '2026 · 02 · 15  13:20', transition: 'fade', next: 'c8_195'
    },
    {
      id: 'c8_195', chapter: 8,
      speaker: 'ya',
      text: '你等一下。走之前，把这个收好。\n别问是什么，先收。',
      cast: [{ id: 'ya', pos: 'left', expr: 'proud', outfit: 'home', act: 'reach' }, { id: 'jin', pos: 'right', expr: 'surprised', outfit: 'winter', act: 'idle' }],
      next: 'c8_196'
    },
    {
      id: 'c8_196', chapter: 8,
      speaker: 'narrator',
      text: '她从抽屉里拿出一叠猫猫明信片，一张一张数过去。数到一半自己先笑了：「你看，你都给我写了这么多了。」\n那叠纸的边角，全压得很平。',
      next: 'c8_197'
    },
    {
      id: 'c8_197', chapter: 8,
      speaker: 'ya',
      text: '那我们定个规矩。以后每次见面，你都得给我一张——手写的，猫猫的。\n一张都不许少。',
      cast: [{ id: 'ya', pos: 'left', expr: 'serious', outfit: 'home', act: 'reach' }, { id: 'jin', pos: 'right', expr: 'moved', outfit: 'winter', act: 'idle' }],
      next: 'c8_198'
    },
    {
      id: 'c8_198', chapter: 8,
      speaker: 'jin',
      text: '……要是我哪次忘了呢。\n……我是说，万一。\n……不会的。',
      next: 'c8_199'
    },
    {
      id: 'c8_199', chapter: 8,
      speaker: 'ya',
      text: '那我就把你那张睡着的照片发到群里。\n说到做到哦。',
      cast: [{ id: 'ya', pos: 'left', expr: 'smile', outfit: 'home', act: 'idle' }, { id: 'jin', pos: 'right', expr: 'soft', outfit: 'winter', act: 'idle' }],
      next: 'c8_200'
    },
    {
      id: 'c8_200', chapter: 8,
      speaker: 'inner',
      text: '她说这话的时候笑着，手上没停，把那一叠按日期理齐，塞回抽屉最里面。\n她比我自己更清楚我写过几张。\n连哪张是哪天，她都记得。',
      cast: [{ id: 'jin', pos: 'right', expr: 'moved', outfit: 'winter', act: 'idle' }],
      next: 'c8_201'
    },
    {
      id: 'c8_201', chapter: 8,
      speaker: 'narrator',
      text: '关抽屉之前，她又抽出两张空白的塞给我。正面是一只趴在窗台上的三花猫，跟之前那些是一套。\n她没多说，就推了推我的手。',
      next: 'c8_202'
    },
    {
      id: 'c8_202', chapter: 8,
      speaker: 'ya',
      text: '这两张你拿着。下次来之前写好，见面的时候给我——当面给。\n说好了。',
      next: 'c8_203'
    },
    {
      id: 'c8_203', chapter: 8,
      speaker: 'jin',
      text: '……好。\n……我字丑，你别嫌。\n……真的，很丑。',
      effects: { affection: 4, trust: 3, flags: { f_postcard: true } }, next: 'c8_204'
    },
    {
      id: 'c8_204', chapter: 8,
      speaker: 'narrator',
      text: '她妈妈从厨房出来，往我包里又塞了两袋自家做的点心：「路上吃，别客气。」\n我推了两次没推掉，最后只会说「谢谢阿姨」。',
      next: 'c8_205'
    },

    /* =========================================================
     *  临走 · 要不要说"下次我来接你"
     * ========================================================= */
    {
      id: 'c8_205', chapter: 8, scene: 'home_yard', tint: 'day', bgm: 'bgm_quiet', beat: 'calm',
      cast: [
        { id: 'ya', pos: 'left', expr: 'sad', outfit: 'winter', act: 'idle' },
        { id: 'jin', pos: 'right', expr: 'neutral', outfit: 'winter', act: 'idle' }
      ],
      speaker: 'narrator',
      text: '楼下风很大。她帮我把行李从单元门口推到路边，两个人都不说话。\n我叫的车还有六分钟。手机上的数字一秒一秒往下掉。',
      transition: 'fade', next: 'c8_206'
    },
    {
      id: 'c8_206', chapter: 8,
      speaker: 'inner',
      text: '每次都是她在出口先看见我。回回如此，一次都没让我找过她。\n这句话我憋了三天。从住进她家那晚就憋着，一直没找到地方说。\n车还有六分钟。再不说，就没地方说了。',
      next: 'c8_207'
    },
    {
      id: 'c8_207', chapter: 8, choices: [
        {
          text: '现在就说：「下次，换我来接你。」',
          hint: '（说出口就不能反悔了——我本来也不打算反悔）',
          effects: { affection: 6, trust: 5, courage: 8 },
          next: 'c8_208a'
        },
        {
          text: '先不说满：只说「下次，别一个人站在这儿等我了」',
          hint: '（把话说轻一点，等我真做到了再说满）',
          effects: { affection: 1, trust: 1, courage: -3 },
          next: 'c8_208b'
        },
        {
          text: '说个带日期的：「五月之前，我去上海接你一次。」',
          hint: '（带上日期，我才不会赖掉）',
          effects: { affection: 5, trust: 4, courage: 5 },
          next: 'c8_208c'
        }
      ]
    },
    {
      id: 'c8_208a', chapter: 8, beat: 'swell', zoom: 'face',
      speaker: 'jin',
      text: '……下次，换我来接你。\n……你已经在出口站过很多次了。这次换我。',
      cast: [{ id: 'ya', pos: 'left', expr: 'surprised', outfit: 'winter', act: 'idle' }, { id: 'jin', pos: 'right', expr: 'serious', outfit: 'winter', act: 'idle' }],
      next: 'c8_209'
    },
    {
      id: 'c8_208b', chapter: 8,
      speaker: 'jin',
      text: '……风大。你上去吧。\n……下次，别一个人站在这儿等我了。\n……我说真的。',
      cast: [{ id: 'ya', pos: 'left', expr: 'sad', outfit: 'winter', act: 'idle' }, { id: 'jin', pos: 'right', expr: 'guilty', outfit: 'winter', act: 'idle' }],
      next: 'c8_209'
    },
    {
      id: 'c8_208c', chapter: 8, beat: 'swell',
      speaker: 'jin',
      text: '五月之前，我去上海接你一次。\n……你别提前出来等。风大。\n……说定了。',
      cast: [{ id: 'ya', pos: 'left', expr: 'surprised', outfit: 'winter', act: 'idle' }, { id: 'jin', pos: 'right', expr: 'soft', outfit: 'winter', act: 'idle' }],
      next: 'c8_209'
    },
    {
      id: 'c8_209', chapter: 8, transition: 'slowfade',
      speaker: 'ya',
      text: '……你刚才那句，我记下了。\n你要是赖掉，我就把你那张睡着的照片发到群里。',
      cast: [{ id: 'ya', pos: 'left', expr: 'tease', outfit: 'winter', act: 'idle' }, { id: 'jin', pos: 'right', expr: 'shy', outfit: 'winter', act: 'idle' }],
      effects: { affection: 4, trust: 3 }, next: 'c8_210'
    },
    {
      id: 'c8_210', chapter: 8,
      speaker: 'jin',
      text: '……你别动不动就威胁我。\n……我又没说不算数。\n……我说了就算。',
      next: 'c8_211'
    },
    {
      id: 'c8_211', chapter: 8, sfx: 'sfx_heart',
      speaker: 'narrator',
      text: '车到了。她把行李搬进后备箱，退后一步。\n我上车，关门，摇下车窗。她手插在羽绒服口袋里，冲我晃了晃左手腕上那根红绳。\n她什么都没说，就晃了晃。',
      next: 'c8_212'
    },
    {
      id: 'c8_212', chapter: 8,
      speaker: 'narrator',
      text: '车开出去，我一直往后看。她站在那盏路灯底下，奶白色的羽绒服越缩越小，最后被一栋楼挡掉。\n挡掉以后，我还看了一会儿。',
      transition: 'slowfade', next: 'c8_213'
    },

    /* =========================================================
     *  机场 · 这次是在飞机上哭的
     * ========================================================= */
    {
      id: 'c8_213', chapter: 8, scene: 'airport', tint: 'dusk', bgm: 'bgm_quiet', beat: 'calm',
      cast: [{ id: 'jin', pos: 'center', expr: 'blank', outfit: 'winter', act: 'idle' }],
      speaker: 'narrator',
      text: '她本来要来送的。我说不用，外面风大，你回去陪你妈吧。\n所以到机场的时候，就我一个人，和一个塞得鼓鼓的背包。',
      titlecard: '2026 · 02 · 15  15:40', transition: 'fade', next: 'c8_214'
    },
    {
      id: 'c8_214', chapter: 8,
      speaker: 'jin',
      text: '我过安检了。\n……你到家，跟我说一声。\n……我下飞机就看到。',
      cast: [{ id: 'jin', pos: 'center', expr: 'neutral', outfit: 'winter', act: 'idle' }],
      next: 'c8_215'
    },
    {
      id: 'c8_215', chapter: 8, chat: [
        { from: 'ya', text: '嗯', time: '15:44:02' },
        { from: 'ya', text: '你别在机场乱买东西', time: '15:44:11' },
        { from: 'ya', text: '车上睡一会儿', time: '15:44:20' },
        { from: 'jin', text: '知道', time: '15:45:33' },
        { from: 'ya', text: '到了发消息', time: '15:45:41' },
        { from: 'ya', text: '我会一直看手机的', time: '15:45:52' },
        { from: 'jin', text: '好', time: '15:46:40' }
      ],
      next: 'c8_216'
    },
    {
      id: 'c8_216', chapter: 8,
      speaker: 'inner',
      text: '「我会一直看手机的。」\n我盯着这行字，突然特别想把刚才那句话说得再完整一点。\n刚才在楼下，我明明还能多说一句的。可是登机口已经在广播，我把手机塞回了口袋。',
      next: 'c8_217'
    },
    {
      id: 'c8_217', chapter: 8, scene: 'airport', tint: 'night', bgm: 'bgm_quiet', beat: 'calm',
      cast: [{ id: 'jin', pos: 'center', expr: 'sleepy', outfit: 'winter', act: 'sit' }],
      speaker: 'narrator',
      text: '南阳的航班是晚班。飞机起飞的时候，外面已经全黑了。\n我的座位靠窗，前面两排是空的。',
      transition: 'fade', next: 'c8_218'
    },
    {
      id: 'c8_218', chapter: 8, zoom: 'face', transition: 'slowfade',
      speaker: 'narrator',
      text: '飞机爬升的时候，我把那张空白明信片从口袋里拿出来。正面那只猫趴在窗台上，跟我第一次见她那天她手里那张，一模一样。\n然后我就哭了。\n一点预兆都没有。我刚刚还在想下周要交的实验报告。',
      next: 'c8_219'
    },
    {
      id: 'c8_219', chapter: 8, zoom: 'face', beat: 'drop',
      speaker: 'narrator',
      text: '没有声音。眼泪就那么往下掉，掉在明信片上，把那层哑光的纸洇出一小块深色。\n我把脸转向窗户。外面全黑，只能看见自己一层模糊的影子。\n我用手背擦了一下，那点湿还在。',
      next: 'c8_220'
    },
    {
      id: 'c8_220', chapter: 8,
      speaker: 'inner',
      text: '总得有个理由。很晚，很累，眼睛干。\n可真正的原因是——我在算还有多少天能再见她。算到一半发现，下一趟买哪天的票，我都还不知道。\n就为这个哭。说出来都丢人。',
      cast: [{ id: 'jin', pos: 'center', expr: 'moved', outfit: 'winter', act: 'sleepy' }],
      effects: { affection: 5, trust: 3, courage: 2, flags: { f_airport_cry_3: true } }, next: 'c8_221'
    },
    {
      id: 'c8_221', chapter: 8, transition: 'slowfade',
      speaker: 'narrator',
      text: '空乘推着车过来问我要不要水。我摆了摆手。\n过了两分钟，我又按了铃，很不好意思地要了一杯温水。\n然后我把脸埋进了那个纸杯里。',
      next: 'c8_222'
    },
    {
      id: 'c8_222', chapter: 8,
      speaker: 'narrator',
      text: '旁边座位的阿姨从包里抽出一张纸巾，递过来，什么都没问。\n只说：「小伙子，飞机上干燥，眼睛容易不舒服。」',
      next: 'c8_223'
    },
    {
      id: 'c8_223', chapter: 8,
      speaker: 'jin',
      text: '……谢谢。\n……我真没事。',
      cast: [{ id: 'jin', pos: 'center', expr: 'moved', outfit: 'winter', act: 'sit' }],
      next: 'c8_224'
    },
    {
      id: 'c8_224', chapter: 8,
      speaker: 'inner',
      text: '第一次是在机场，她在出口等我，我哭了。第二次在苏州的车站，我哭了。这是第三次，在飞机上。\n三次我都没出声。\n哭的时候不出声，这个我练得很熟。',
      next: 'c8_225'
    },
    {
      id: 'c8_225', chapter: 8,
      speaker: 'inner',
      text: '那句话我说得不好。可它已经出去了，收不回来。\n以前每次出站，都是她先看见我。\n这一次，我总算抢在了前面——虽然只是一句话。',
      cast: [{ id: 'jin', pos: 'center', expr: 'soft', outfit: 'winter', act: 'sit' }],
      effects: { courage: 4 },
      titlecard: '2026 · 02 · 15  夜航', next: 'c8_226'
    },
    {
      id: 'c8_226', chapter: 8, scene: 'airport', tint: 'night', bgm: 'bgm_quiet', beat: 'calm',
      speaker: 'narrator',
      text: '落地已经十一点多。我开机，第一条跳出来的是她：「到家了吗。」\n后面跟着一只趴着的猫猫贴纸。',
      next: 'c8_227'
    },
    {
      id: 'c8_227', chapter: 8, chat: [
        { from: 'ya', text: '到家了吗', time: '23:12:07' },
        { from: 'jin', text: '刚落地', time: '23:20:41' },
        { from: 'ya', text: '那还不算太晚', time: '23:20:52' },
        { from: 'ya', text: '路上冷，围巾别摘', time: '23:21:03' },
        { from: 'jin', text: '好', time: '23:21:30' },
        { from: 'ya', text: '小隔间的被子我没洗', time: '23:21:44' },
        { from: 'ya', text: '下次来接着用', time: '23:21:50' },
        { from: 'jin', text: '……好', time: '23:22:59' }
      ],
      next: 'c8_228'
    },
    {
      id: 'c8_228', chapter: 8,
      speaker: 'inner',
      text: '我把她给的那两张空白明信片拿出来，压进抽屉最上层。\n下一张写什么，我还不知道。\n但我知道，下次去，得当面交给她。',
      cast: [{ id: 'jin', pos: 'center', expr: 'moved', outfit: 'winter', act: 'sit' }],
      effects: { affection: 4, trust: 3, flags: { f_postcard: true } }, next: 'c8_229'
    },
    {
      id: 'c8_229', chapter: 8, scene: 'shanghai_night', tint: 'night', bgm: 'bgm_warm', beat: 'calm',
      cast: [{ id: 'jin', pos: 'center', expr: 'neutral', outfit: 'winter', act: 'idle' }],
      speaker: 'narrator',
      text: '二月剩下的日子过得很慢。三月才算春天。\n我知道后面还有几趟远路——台风、海、和一座摆满小商品的城。\n可那时候，我还什么都不知道。',
      transition: 'slowfade', next: 'c8_230'
    },
    {
      id: 'c8_230', chapter: 8,
      speaker: 'inner',
      text: '我只知道一件事：我指甲上那只画歪的小猫还在。\n这半个月，我写作业、翻书、洗手，它都没掉。\n它比我能扛。',
      cast: [{ id: 'jin', pos: 'center', expr: 'soft', outfit: 'winter', act: 'idle' }],
      next:'hk_01'
    }

  ]);
})();
