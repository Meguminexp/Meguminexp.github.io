/* 《你好！一周年》· 香港迪士尼乐园（2026.04 初）—— 生日之后的一次见面
 * 章节号沿用 9（HUD 显示「第 9 章」，与 chapter9.js 同号，刻意如此，用 titlecard 标时间地点）。
 * 首节点 hk_01，末节点 hk_end → c9_01（接线由主程完成：chapter8 末节点 → hk_01）。
 *
 * 场景：hk_park（白天园区/城堡）hk_parade（巡游）hk_shop（玩偶店）hk_fireworks（夜 · 烟花）
 * CG　：cg_hk_coaster（过山车）cg_hk_coin（二十周年纪念币）cg_hk_fireworks（烟花下的两个人）
 * 音乐：bgm_travel（抵港）→ bgm_hope（入园/巡游）→ bgm_game（排队/集章）
 *       → bgm_warm（玩偶店）→ bgm_ending（烟花，calm → pulse → swell → drop）→ bgm_night（回程）
 * 选择：① 入园先去哪　② 排队时说什么　③ 巡游怎么让她看见　④ 最后一个章在哪　⑤ 她犹豫时怎么办
 * 时间：2026 年 4 月初，香港。按时间顺序在「给她过生日」（第八章 · 南阳）之后。
 */
(function () {
  'use strict';
  YJ.story.add([

    /* ============================================================
     *  一 · 抵港 · 入园（hk_01 – hk_24）
     * ============================================================ */

    {
      id: 'hk_01', chapter: 9, scene: 'airport', tint: 'day', bgm: 'bgm_travel', beat: 'calm', ambience: 'crowd',
      cast: [{ id: 'jin', pos: 'center', expr: 'neutral', outfit: 'casual', act: 'idle' }],
      titlecard: '2026 · 04  香港 · 迪士尼乐园',
      speaker: 'inner', transition: 'fade',
      text: '南阳那次之后，我们各自回了自己的城市，中间隔了四十多天。\n四月初，我在香港机场的到达口，比航班落地早了四十分钟。',
      next: 'hk_02'
    },
    {
      id: 'hk_02', chapter: 9,
      cast: [
        { id: 'ya', pos: 'left', expr: 'smile', outfit: 'casual', act: 'idle' },
        { id: 'jin', pos: 'right', expr: 'smile', outfit: 'casual', act: 'idle' }
      ],
      speaker: 'ya',
      text: '你是不是又早到了。\n我出关的时候就在想，你肯定已经站在那儿了。',
      next: 'hk_03'
    },
    {
      id: 'hk_03', chapter: 9,
      speaker: 'jin',
      text: '……没有。就早了一点。\n包给我。',
      next: 'hk_04'
    },
    {
      id: 'hk_04', chapter: 9, scene: 'station', bgm: 'bgm_hope', beat: 'pulse',
      cast: [
        { id: 'ya', pos: 'left', expr: 'neutral', outfit: 'casual', act: 'idle' },
        { id: 'jin', pos: 'right', expr: 'neutral', outfit: 'casual', act: 'idle' }
      ],
      speaker: 'narrator',
      text: '去乐园的专线在楼下。车门打开的时候，我先看见的是窗——整排窗都是米奇的形状。',
      next: 'hk_05'
    },
    {
      id: 'hk_05', chapter: 9,
      cast: [{ id: 'ya', pos: 'left', expr: 'excited', outfit: 'casual', act: 'reach' }],
      speaker: 'ya',
      text: '你看这个窗。\n连拉手都是米奇的头，我要拍一张。',
      next: 'hk_06'
    },
    {
      id: 'hk_06', chapter: 9,
      cast: [{ id: 'jin', pos: 'right', expr: 'soft', outfit: 'casual', act: 'idle' }],
      speaker: 'jin',
      text: '你拍。\n我扶着你，别晃。',
      next: 'hk_07'
    },
    {
      id: 'hk_07', chapter: 9, scene: 'hk_park', tint: 'day', bgm: 'bgm_hope', beat: 'swell', ambience: 'park',
      titlecard: '入园 · 二十周年',
      speaker: 'narrator', transition: 'fade',
      text: '出站就是音乐。金色的拱门，两边各站一个举着气球的人。四月的太阳落在地上，亮得发白。',
      next: 'hk_08'
    },
    {
      id: 'hk_08', chapter: 9,
      cast: [
        { id: 'ya', pos: 'left', expr: 'laugh', outfit: 'casual', act: 'look_up' },
        { id: 'jin', pos: 'right', expr: 'neutral', outfit: 'casual', act: 'idle' }
      ],
      speaker: 'ya',
      text: '到了。\n你听，音乐是从里面飘出来的，不是喇叭贴在耳朵上那种。',
      next: 'hk_09'
    },
    {
      id: 'hk_09', chapter: 9,
      cast: [{ id: 'jin', pos: 'center', expr: 'soft', outfit: 'casual', act: 'idle' }],
      speaker: 'inner',
      text: '我没说话。\n我只是把她背包的带子往上提了提——她肩窄，带子老是往下滑。',
      next: 'hk_10'
    },
    {
      id: 'hk_10', chapter: 9,
      cast: [
        { id: 'ya', pos: 'left', expr: 'smile', outfit: 'casual', act: 'idle' },
        { id: 'jin', pos: 'right', expr: 'neutral', outfit: 'casual', act: 'idle' }
      ],
      speaker: 'narrator',
      text: '拱门上印着很大的「20」。花坛里的花排得太整齐了，像每天有人拿尺子量过。',
      next: 'hk_11'
    },
    {
      id: 'hk_11', chapter: 9,
      cast: [{ id: 'ya', pos: 'left', expr: 'excited', outfit: 'casual', act: 'idle' }],
      speaker: 'ya',
      text: '工作人员说，今天的二十周年集章也开着。\n我们先去哪？',
      next: 'hk_12'
    },
    {
      id: 'hk_12', chapter: 9,
      speaker: 'inner',
      text: '她一手拿地图，一手拿手机，站在岔路口等我。帽子压得低低的，眼睛从帽檐下面看我。',
      choices: [
        { text: '过山车，先去最刺激的那个', hint: '她说过，要坐第一排', effects: { affection: 2, courage: 3 }, next: 'hk_13a' },
        { text: '先去看巡游的时间表', hint: '把最想看的那一场排在前面', effects: { affection: 2, trust: 3 }, next: 'hk_13b' },
        { text: '沿着小镇大街慢慢走', hint: '不赶，把一天铺开来用', effects: { affection: 3, trust: 2 }, next: 'hk_13c' }
      ]
    },
    {
      id: 'hk_13a', chapter: 9,
      cast: [{ id: 'ya', pos: 'left', expr: 'laugh', outfit: 'casual', act: 'idle' }],
      speaker: 'ya',
      text: '我就知道。\n你嘴上说随便，进园第一眼看的是轨道。',
      next: 'hk_14'
    },
    {
      id: 'hk_13b', chapter: 9,
      cast: [{ id: 'ya', pos: 'left', expr: 'proud', outfit: 'casual', act: 'idle' }],
      speaker: 'ya',
      text: '这个答案比第一个靠谱。\n你居然会先看时间表，你变了。',
      next: 'hk_14'
    },
    {
      id: 'hk_13c', chapter: 9,
      cast: [{ id: 'ya', pos: 'left', expr: 'soft', outfit: 'casual', act: 'idle' }],
      speaker: 'ya',
      text: '好。那我们慢慢走。\n今天路很长，你别老盯着我的鞋看。',
      next: 'hk_14'
    },
    {
      id: 'hk_14', chapter: 9, scene: 'hk_park',
      cast: [
        { id: 'ya', pos: 'left', expr: 'smile', outfit: 'casual', act: 'idle' },
        { id: 'jin', pos: 'right', expr: 'neutral', outfit: 'casual', act: 'idle' }
      ],
      speaker: 'narrator',
      text: '小镇大街的两边是矮房子，屋檐刷成不同的颜色。她走两步停一下，像在核对什么。',
      next: 'hk_15'
    },
    {
      id: 'hk_15', chapter: 9,
      cast: [{ id: 'ya', pos: 'left', expr: 'smile', outfit: 'casual', act: 'idle' }],
      speaker: 'ya',
      text: '我小时候在电视上看过这条街。\n那时候觉得它有一公里长。',
      next: 'hk_16'
    },
    {
      id: 'hk_16', chapter: 9,
      speaker: 'jin',
      text: '现在呢。',
      next: 'hk_17'
    },
    {
      id: 'hk_17', chapter: 9,
      cast: [{ id: 'ya', pos: 'left', expr: 'smile', outfit: 'casual', act: 'idle' }],
      speaker: 'ya',
      text: '现在大概三百米。\n可是它是真的。',
      next: 'hk_18'
    },
    {
      id: 'hk_18', chapter: 9,
      speaker: 'narrator',
      text: '街道尽头是城堡。她站在路的正中仰头，帽子往后滑了一点，她没去管。',
      next: 'hk_19'
    },
    {
      id: 'hk_19', chapter: 9,
      cast: [{ id: 'jin', pos: 'center', expr: 'soft', outfit: 'casual', act: 'look_up' }],
      speaker: 'inner',
      text: '我举起手机想拍城堡。\n镜头转了一下，最后画面里还是她。',
      next: 'hk_20'
    },
    {
      id: 'hk_20', chapter: 9, sfx: 'sfx_camera',
      cast: [
        { id: 'ya', pos: 'left', expr: 'laugh', outfit: 'casual', act: 'idle' },
        { id: 'jin', pos: 'right', expr: 'shy', outfit: 'casual', act: 'idle' }
      ],
      speaker: 'ya',
      text: '你拍我干嘛，拍城堡啊。\n……算了，你拍吧。',
      next: 'hk_21'
    },
    {
      id: 'hk_21', chapter: 9,
      cast: [{ id: 'jin', pos: 'center', expr: 'soft', outfit: 'casual', act: 'idle' }],
      speaker: 'inner',
      text: '我拍了一张，又拍了一张。\n第二张里她闭了眼睛。我没删。',
      next: 'hk_22'
    },
    {
      id: 'hk_22', chapter: 9,
      cast: [{ id: 'ya', pos: 'left', expr: 'tease', outfit: 'casual', act: 'idle' }],
      speaker: 'ya',
      text: '走了。前面有轨道的声音。\n你听——就是那个，唰的一下。',
      next: 'hk_23'
    },
    {
      id: 'hk_23', chapter: 9, ambience: 'park',
      cast: [
        { id: 'ya', pos: 'left', expr: 'smile', outfit: 'casual', act: 'idle' },
        { id: 'jin', pos: 'right', expr: 'neutral', outfit: 'casual', act: 'idle' }
      ],
      speaker: 'narrator',
      text: '过山车的轨道从树后面升起来，车厢挂在半空，然后掉下去。人群里有一阵欢呼。',
      next: 'hk_24'
    },
    {
      id: 'hk_24', chapter: 9,
      cast: [{ id: 'ya', pos: 'left', expr: 'excited', outfit: 'casual', act: 'idle' }],
      speaker: 'ya',
      text: '我要坐。现在就去排队。',
      next: 'hk_25'
    },

    /* ============================================================
     *  二 · 过山车（hk_25 – hk_48）
     * ============================================================ */

    {
      id: 'hk_25', chapter: 9, scene: 'hk_park', bgm: 'bgm_game', beat: 'pulse', ambience: 'crowd',
      cast: [
        { id: 'ya', pos: 'left', expr: 'neutral', outfit: 'casual', act: 'idle' },
        { id: 'jin', pos: 'right', expr: 'neutral', outfit: 'casual', act: 'idle' }
      ],
      speaker: 'narrator',
      text: '队伍从入口一直拐到第三个棚子。棚子上挂着牌子：等候六十分钟。',
      next: 'hk_26'
    },
    {
      id: 'hk_26', chapter: 9,
      cast: [{ id: 'ya', pos: 'left', expr: 'neutral', outfit: 'casual', act: 'idle' }],
      speaker: 'ya',
      text: '六十分钟。\n罚站一个小时，就为了唰一下。',
      next: 'hk_27'
    },
    {
      id: 'hk_27', chapter: 9,
      speaker: 'jin',
      text: '……现在反悔还来得及。',
      next: 'hk_28'
    },
    {
      id: 'hk_28', chapter: 9,
      cast: [{ id: 'ya', pos: 'left', expr: 'proud', outfit: 'casual', act: 'idle' }],
      speaker: 'ya',
      text: '谁反悔。\n我只是在算，这一小时能跟你说多少话。',
      next: 'hk_29'
    },
    {
      id: 'hk_29', chapter: 9,
      cast: [{ id: 'jin', pos: 'center', expr: 'soft', outfit: 'casual', act: 'idle' }],
      speaker: 'inner',
      text: '前面那对情侣正在分一只面包。\n我忽然希望这条队伍再长一点。',
      next: 'hk_30'
    },
    {
      id: 'hk_30', chapter: 9,
      speaker: 'inner',
      text: '队伍往前挪了五步，又停下。她把手插进口袋，侧过头看我。',
      choices: [
        { text: '讲一个不好笑的笑话', hint: '先把这一小时填满', effects: { affection: 3, courage: 2 }, next: 'hk_31a' },
        { text: '老实说，我也怕', hint: '不装那副稳的样子', effects: { affection: 2, trust: 3 }, next: 'hk_31b' },
        { text: '把她的手从口袋里拿出来，握住', hint: '这里人很多，可是她的手很凉', effects: { affection: 4, courage: 5 }, next: 'hk_31c' }
      ]
    },
    {
      id: 'hk_31a', chapter: 9,
      cast: [{ id: 'ya', pos: 'left', expr: 'laugh', outfit: 'casual', act: 'idle' }],
      speaker: 'ya',
      text: '哈哈哈哈。\n这个我听过三遍。可是你讲的时候自己先笑了。',
      next: 'hk_32'
    },
    {
      id: 'hk_31b', chapter: 9,
      cast: [{ id: 'ya', pos: 'left', expr: 'surprised', outfit: 'casual', act: 'idle' }],
      speaker: 'ya',
      text: '你也怕？\n那你刚才说反悔还来得及，是给我留的台阶。',
      next: 'hk_32'
    },
    {
      id: 'hk_31c', chapter: 9,
      cast: [{ id: 'ya', pos: 'left', expr: 'blush', outfit: 'casual', act: 'idle' }],
      speaker: 'ya',
      text: '……这里人很多。\n不过你别松开。一松开我就找不到你了。',
      next: 'hk_32'
    },
    {
      id: 'hk_32', chapter: 9,
      cast: [
        { id: 'ya', pos: 'left', expr: 'neutral', outfit: 'casual', act: 'idle' },
        { id: 'jin', pos: 'right', expr: 'blank', outfit: 'casual', act: 'idle' }
      ],
      speaker: 'narrator',
      text: '前面的门开了。工作人员在数人数，一车二十四个人。轮到她的时候，她回头看了我一眼。',
      next: 'hk_33'
    },
    {
      id: 'hk_33', chapter: 9,
      cast: [{ id: 'ya', pos: 'left', expr: 'serious', outfit: 'casual', act: 'idle' }],
      speaker: 'ya',
      text: '第一排。\n我说过的。',
      next: 'hk_34'
    },
    {
      id: 'hk_34', chapter: 9,
      cast: [{ id: 'jin', pos: 'center', expr: 'blank', outfit: 'casual', act: 'sit' }],
      speaker: 'inner',
      text: '我坐过很多次车。\n第一次觉得安全带扣不严。',
      next: 'hk_35'
    },
    {
      id: 'hk_35', chapter: 9, sfx: 'sfx_ding', ambience: 'none',
      cast: [
        { id: 'ya', pos: 'left', expr: 'excited', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'panic', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'narrator',
      text: '压杠落下来，卡在腰上。车先是很慢地挪了一截，轮子底下是咔哒咔哒的声音。',
      next: 'hk_36'
    },
    {
      id: 'hk_36', chapter: 9,
      cast: [{ id: 'ya', pos: 'left', expr: 'excited', outfit: 'casual', act: 'idle' }],
      speaker: 'ya',
      text: '上坡了上坡了。\n你别闭眼啊，闭眼就白坐了。',
      next: 'hk_37'
    },
    {
      id: 'hk_37', chapter: 9,
      speaker: 'jin',
      text: '我没闭眼。\n我只是——',
      next: 'hk_38'
    },
    {
      id: 'hk_38', chapter: 9,
      speaker: 'narrator',
      text: '话没说完。车到了最高点，停了一秒。那一秒风是停的，人群的声音在很远的地方。',
      next: 'hk_39'
    },
    {
      id: 'hk_39', chapter: 9, zoom: 'face',
      cast: [{ id: 'jin', pos: 'center', expr: 'soft', outfit: 'casual', act: 'sit' }],
      speaker: 'inner',
      text: '那一秒我看见她的侧脸，头发全部被风掀到后面。\n然后车就下去了。',
      next: 'hk_40'
    },
    {
      id: 'hk_40', chapter: 9, sfx: 'sfx_coaster_whoosh', bgm: 'bgm_game', beat: 'drop',
      speaker: 'narrator',
      text: '她没有叫。她在笑。笑声被风吹散，一段一段从轨道那头传回来。',
      next: 'hk_41'
    },
    {
      id: 'hk_41', chapter: 9, sfx: 'sfx_laugh', beat: 'pulse',
      cast: [
        { id: 'ya', pos: 'left', expr: 'laugh', outfit: 'casual', act: 'idle' },
        { id: 'jin', pos: 'right', expr: 'laugh', outfit: 'casual', act: 'idle' }
      ],
      speaker: 'ya',
      text: '再来一次！',
      next: 'hk_42'
    },
    {
      id: 'hk_42', chapter: 9,
      speaker: 'jin',
      text: '……先让我活过来。',
      next: 'hk_43'
    },
    {
      id: 'hk_43', chapter: 9,
      cast: [{ id: 'jin', pos: 'center', expr: 'soft', outfit: 'casual', act: 'idle' }],
      speaker: 'inner',
      text: '我的腿真的在抖。\n可她站在那儿，眼睛亮得像刚被人擦过。',
      next: 'hk_44'
    },
    {
      id: 'hk_44', chapter: 9, sfx: 'sfx_camera',
      cast: [
        { id: 'ya', pos: 'left', expr: 'laugh', outfit: 'casual', act: 'idle' },
        { id: 'jin', pos: 'right', expr: 'awkward', outfit: 'casual', act: 'idle' }
      ],
      speaker: 'narrator',
      text: '出口的照片墙亮着一排屏幕。第三张是我们——她头发全竖着，我嘴张着。',
      next: 'hk_45'
    },
    {
      id: 'hk_45', chapter: 9,
      cast: [{ id: 'ya', pos: 'left', expr: 'laugh', outfit: 'casual', act: 'idle' }],
      speaker: 'ya',
      text: '那张，就是那张。\n我要拍下来，谁都不许删。',
      next: 'hk_46'
    },
    {
      id: 'hk_46', chapter: 9,
      cast: [{ id: 'jin', pos: 'center', expr: 'smile', outfit: 'casual', act: 'idle' }],
      speaker: 'inner',
      text: '照片要另外买。她拍完就走了，说要留一个不用花钱的版本。',
      next: 'hk_47'
    },
    {
      id: 'hk_47', chapter: 9, cg: 'cg_hk_coaster',
      cast: [{ id: 'ya', pos: 'left', expr: 'laugh', outfit: 'casual', act: 'idle' }],
      speaker: 'ya',
      text: '走了，下一站。\n你听，巡游的音乐已经开始了。',
      next: 'hk_48'
    },
    {
      id: 'hk_48', chapter: 9,
      cast: [
        { id: 'ya', pos: 'left', expr: 'excited', outfit: 'casual', act: 'reach' },
        { id: 'jin', pos: 'right', expr: 'smile', outfit: 'casual', act: 'idle' }
      ],
      speaker: 'narrator', transition: 'slowfade',
      text: '音乐是从大街那头过来的，一层一层压过人群的说话声。她拉着我往那边跑。',
      next: 'hk_49'
    },

    /* ============================================================
     *  三 · 仙境巡游（hk_49 – hk_67）
     * ============================================================ */

    {
      id: 'hk_49', chapter: 9, scene: 'hk_parade', tint: 'day', bgm: 'bgm_hope', beat: 'pulse', sfx: 'sfx_parade_music', ambience: 'crowd',
      titlecard: '巡游 · 仙境',
      cast: [
        { id: 'ya', pos: 'left', expr: 'smile', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'neutral', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'narrator', transition: 'fade',
      text: '路边已经坐满了人。她把包垫在地上，让我先坐，然后自己坐在我旁边的台阶上。',
      next: 'hk_50'
    },
    {
      id: 'hk_50', chapter: 9,
      cast: [{ id: 'ya', pos: 'left', expr: 'excited', outfit: 'casual', act: 'look_up' }],
      speaker: 'ya',
      text: '第一辆来了。\n你看那个茶杯，真的在转。',
      next: 'hk_51'
    },
    {
      id: 'hk_51', chapter: 9,
      speaker: 'narrator',
      text: '花车走得很慢。第一辆是茶会，第二辆上立着一整座纸做的城堡，第三辆全是扑克牌。',
      next: 'hk_52'
    },
    {
      id: 'hk_52', chapter: 9,
      cast: [{ id: 'ya', pos: 'left', expr: 'laugh', outfit: 'casual', act: 'reach' }],
      speaker: 'ya',
      text: '他们在跟我挥手！\n——不是，他是跟后面那个小孩挥的。',
      next: 'hk_53'
    },
    {
      id: 'hk_53', chapter: 9,
      cast: [{ id: 'jin', pos: 'center', expr: 'soft', outfit: 'casual', act: 'idle' }],
      speaker: 'inner',
      text: '她举着手挥了半天。\n花车上那个穿白裙子的姑娘，真的回了她一个手势。',
      next: 'hk_54'
    },
    {
      id: 'hk_54', chapter: 9, sfx: 'sfx_parade_music',
      speaker: 'narrator',
      text: '音乐到副歌的时候，彩带从两侧的机器里喷出来。她伸手去接，接了两条。',
      next: 'hk_55'
    },
    {
      id: 'hk_55', chapter: 9,
      speaker: 'inner',
      text: '第二辆花车过来了，人群往前挤。她比我矮一个头，踮着脚也只看得见一半。',
      choices: [
        { text: '把她举起来看', hint: '她说过小时候没人这么举过她', effects: { affection: 4, courage: 3 }, next: 'hk_56a' },
        { text: '往前站，用背替她挡人', hint: '让她安安静静看完这一场', effects: { affection: 3, trust: 3 }, next: 'hk_56b' },
        { text: '退后半步，蹲下来拍她', hint: '花车年年有，她这个表情只有一次', effects: { affection: 3, trust: 2 }, next: 'hk_56c' }
      ]
    },
    {
      id: 'hk_56a', chapter: 9,
      cast: [{ id: 'ya', pos: 'left', expr: 'surprised', outfit: 'casual', act: 'look_up' }],
      speaker: 'ya',
      text: '喂——\n好高。好高好高。你别松手啊。',
      next: 'hk_57'
    },
    {
      id: 'hk_56b', chapter: 9,
      cast: [{ id: 'ya', pos: 'left', expr: 'soft', outfit: 'casual', act: 'idle' }],
      speaker: 'ya',
      text: '你站在这儿，我什么都看不见了。\n可是好像也不用看见。',
      next: 'hk_57'
    },
    {
      id: 'hk_56c', chapter: 9,
      cast: [{ id: 'ya', pos: 'left', expr: 'shy', outfit: 'casual', act: 'idle' }],
      speaker: 'ya',
      text: '你怎么又拍我。\n……那你把我睫毛拍清楚一点。',
      next: 'hk_57'
    },
    {
      id: 'hk_57', chapter: 9, sfx: 'sfx_bell',
      speaker: 'narrator',
      text: '音乐最响的那一段，花车全部停下来。彩带、泡泡、纸片一起从头顶落下来。',
      next: 'hk_58'
    },
    {
      id: 'hk_58', chapter: 9,
      cast: [
        { id: 'ya', pos: 'left', expr: 'soft', outfit: 'casual', act: 'idle' },
        { id: 'jin', pos: 'right', expr: 'soft', outfit: 'casual', act: 'idle' }
      ],
      speaker: 'ya',
      text: '我眼睛有点酸。\n是音乐的关系，不是别的。',
      next: 'hk_59'
    },
    {
      id: 'hk_59', chapter: 9,
      cast: [{ id: 'jin', pos: 'center', expr: 'soft', outfit: 'casual', act: 'idle' }],
      speaker: 'inner',
      text: '她说是音乐的关系。\n我信。因为我也一样。',
      next: 'hk_60'
    },
    {
      id: 'hk_60', chapter: 9,
      speaker: 'narrator',
      text: '巡游走了。人群像水一样散开，地上留着彩带和纸屑。',
      next: 'hk_61'
    },
    {
      id: 'hk_61', chapter: 9,
      cast: [{ id: 'ya', pos: 'left', expr: 'smile', outfit: 'casual', act: 'bow' }],
      speaker: 'ya',
      text: '等等，别踩。\n这条是金色的，我要留着。',
      next: 'hk_62'
    },
    {
      id: 'hk_62', chapter: 9,
      cast: [{ id: 'ya', pos: 'left', expr: 'smile', outfit: 'casual', act: 'idle' }],
      speaker: 'ya',
      text: '缠在手指上，就当戴了个戒指。\n今天先戴着，回去再收好。',
      next: 'hk_63'
    },
    {
      id: 'hk_63', chapter: 9,
      cast: [{ id: 'jin', pos: 'right', expr: 'soft', outfit: 'casual', act: 'idle' }],
      speaker: 'jin',
      text: '……好。\n收好。',
      next: 'hk_64'
    },
    {
      id: 'hk_64', chapter: 9,
      cast: [{ id: 'jin', pos: 'center', expr: 'soft', outfit: 'casual', act: 'idle' }],
      speaker: 'inner',
      text: '我没敢接「戒指」这两个字。\n我只是看了她手指上那圈金色一眼，记住了。',
      next: 'hk_65'
    },
    {
      id: 'hk_65', chapter: 9, scene: 'hk_park',
      cast: [
        { id: 'ya', pos: 'left', expr: 'neutral', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'neutral', outfit: 'casual', act: 'idle' }
      ],
      speaker: 'narrator',
      text: '下午四点，太阳斜过去，把城堡的影子一直拉到大街上。她坐在长椅上翻地图。',
      next: 'hk_66'
    },
    {
      id: 'hk_66', chapter: 9,
      cast: [{ id: 'ya', pos: 'left', expr: 'serious', outfit: 'casual', act: 'idle' }],
      speaker: 'ya',
      text: '还有一件事。\n二十周年的印章，我今天必须集齐。',
      effects: { affection: 4 },
      next: 'hk_67'
    },
    {
      id: 'hk_67', chapter: 9,
      cast: [{ id: 'jin', pos: 'center', expr: 'smile', outfit: 'casual', act: 'idle' }],
      speaker: 'inner',
      text: '她不知道，昨天夜里我把四个盖章点的位置抄在了手心里。\n现在手心全是汗。',
      next: 'hk_68'
    },

    /* ============================================================
     *  四 · 二十周年集章 → 纪念币（hk_68 – hk_88）
     * ============================================================ */

    {
      id: 'hk_68', chapter: 9, scene: 'hk_park', bgm: 'bgm_game', beat: 'pulse', sfx: 'sfx_page',
      cast: [
        { id: 'ya', pos: 'left', expr: 'serious', outfit: 'casual', act: 'idle' },
        { id: 'jin', pos: 'right', expr: 'neutral', outfit: 'casual', act: 'idle' }
      ],
      speaker: 'narrator',
      text: '从长椅上起身，她先去游客中心领了印章本——一张折起来的地图，四个角各留一个空格。',
      next: 'hk_69'
    },
    {
      id: 'hk_69', chapter: 9,
      cast: [{ id: 'ya', pos: 'left', expr: 'excited', outfit: 'casual', act: 'idle' }],
      speaker: 'ya',
      text: '第一个在小镇大街的糖果店。\n走。',
      next: 'hk_70'
    },
    {
      id: 'hk_70', chapter: 9, sfx: 'sfx_ding',
      speaker: 'narrator',
      text: '第一个章盖下去，是米奇的耳朵。她举起来看了三秒，才舍得合上。',
      next: 'hk_71'
    },
    {
      id: 'hk_71', chapter: 9,
      cast: [{ id: 'ya', pos: 'left', expr: 'proud', outfit: 'casual', act: 'idle' }],
      speaker: 'ya',
      text: '一个。\n还剩三个。',
      next: 'hk_72'
    },
    {
      id: 'hk_72', chapter: 9,
      speaker: 'narrator',
      text: '第二个点在城堡旁边。前面排着五六个小孩，最小的那个够不到台子。',
      next: 'hk_73'
    },
    {
      id: 'hk_73', chapter: 9,
      cast: [{ id: 'ya', pos: 'left', expr: 'soft', outfit: 'casual', act: 'bow' }],
      speaker: 'ya',
      text: '小朋友你先来。\n我等你，我不急。',
      next: 'hk_74'
    },
    {
      id: 'hk_74', chapter: 9,
      cast: [{ id: 'jin', pos: 'center', expr: 'soft', outfit: 'casual', act: 'idle' }],
      speaker: 'inner',
      text: '她蹲下来，帮那个小孩把本子按平。\n小孩的章盖歪了，她替他可惜了半天。',
      next: 'hk_75'
    },
    {
      id: 'hk_75', chapter: 9, sfx: 'sfx_ding',
      speaker: 'narrator',
      text: '第二个章盖在城堡旁边。我们顺着人流绕回明日世界，第三个盖章台就在过山车出口对面。',
      next: 'hk_76'
    },
    {
      id: 'hk_76', chapter: 9,
      cast: [{ id: 'ya', pos: 'left', expr: 'laugh', outfit: 'casual', act: 'idle' }],
      speaker: 'ya',
      text: '又绕回来了。\n你听，又是唰的一声。',
      next: 'hk_77'
    },
    {
      id: 'hk_77', chapter: 9,
      speaker: 'jin',
      text: '还要再坐一次吗。',
      next: 'hk_78'
    },
    {
      id: 'hk_78', chapter: 9,
      cast: [{ id: 'ya', pos: 'left', expr: 'tease', outfit: 'casual', act: 'idle' }],
      speaker: 'ya',
      text: '不坐了。\n留着，下次来再坐。',
      next: 'hk_79'
    },
    {
      id: 'hk_79', chapter: 9,
      cast: [{ id: 'jin', pos: 'center', expr: 'soft', outfit: 'casual', act: 'idle' }],
      speaker: 'inner',
      text: '「下次」。她说得很轻，像在菜单上圈一道菜。\n我把这两个字也一起记住了。',
      effects: { affection: 5, trust: 3 },
      next: 'hk_80'
    },
    {
      id: 'hk_80', chapter: 9, sfx: 'sfx_ding',
      speaker: 'narrator',
      text: '第三个章按下去的时候，印台有点干了。她使劲压了两下。\n抬头才发现，天色已经开始发黄。',
      next: 'hk_81'
    },
    {
      id: 'hk_81', chapter: 9,
      cast: [{ id: 'ya', pos: 'left', expr: 'worried', outfit: 'casual', act: 'idle' }],
      speaker: 'ya',
      text: '地图上说，最后一个在商店街最里面。\n我记得那家店在拐角——可是拐角有两家。',
      next: 'hk_82'
    },
    {
      id: 'hk_82', chapter: 9,
      speaker: 'inner',
      text: '她在原地转了一圈，地图举起来又放下。还有一个小时天就黑了。',
      choices: [
        { text: '去问工作人员', hint: '问路不丢人', effects: { affection: 2, trust: 3 }, next: 'hk_83a' },
        { text: '往商店街最深处走', hint: '最里面那家，灯最暖', effects: { affection: 2, courage: 3 }, next: 'hk_83b' },
        { text: '翻印章本背面的小字', hint: '答案通常印在没人看的那一面', effects: { affection: 3, trust: 2 }, next: 'hk_83c' }
      ]
    },
    {
      id: 'hk_83a', chapter: 9,
      cast: [{ id: 'ya', pos: 'left', expr: 'laugh', outfit: 'casual', act: 'idle' }],
      speaker: 'ya',
      text: '你居然真的去问了。\n问得那么认真，人家还以为你在做调查。',
      next: 'hk_84'
    },
    {
      id: 'hk_83b', chapter: 9,
      cast: [{ id: 'ya', pos: 'left', expr: 'excited', outfit: 'casual', act: 'idle' }],
      speaker: 'ya',
      text: '对了，就是这儿。\n你走路只看前面，从来不看两边——这次居然走对了。',
      next: 'hk_84'
    },
    {
      id: 'hk_83c', chapter: 9,
      cast: [{ id: 'ya', pos: 'left', expr: 'proud', outfit: 'casual', act: 'idle' }],
      speaker: 'ya',
      text: '背面写着呢。\n你眼睛真尖。以后找东西都靠你。',
      next: 'hk_84'
    },
    {
      id: 'hk_84', chapter: 9,
      speaker: 'narrator',
      text: '最后一个盖章点在店门口的一张矮桌上，桌上放着一只金色的印台。前面排着两队人。',
      next: 'hk_85'
    },
    {
      id: 'hk_85', chapter: 9,
      cast: [
        { id: 'ya', pos: 'left', expr: 'excited', outfit: 'casual', act: 'reach' },
        { id: 'jin', pos: 'right', expr: 'smile', outfit: 'casual', act: 'idle' }
      ],
      speaker: 'ya',
      text: '快点快点，它快下班了。',
      next: 'hk_86'
    },
    {
      id: 'hk_86', chapter: 9, sfx: 'sfx_ding', beat: 'swell',
      speaker: 'narrator',
      text: '第四个章盖下去。四个格子拼在一起，是一只完整的米奇。',
      next: 'hk_87'
    },
    {
      id: 'hk_87', chapter: 9,
      cast: [
        { id: 'ya', pos: 'left', expr: 'laugh', outfit: 'casual', act: 'idle' },
        { id: 'jin', pos: 'right', expr: 'laugh', outfit: 'casual', act: 'idle' }
      ],
      speaker: 'ya',
      text: '集齐了！\n你看这四个角，正好一只米奇。',
      next: 'hk_88'
    },
    {
      id: 'hk_88', chapter: 9,
      cast: [{ id: 'jin', pos: 'center', expr: 'soft', outfit: 'casual', act: 'idle' }],
      speaker: 'inner',
      text: '她举着地图对着太阳看。光从纸后面透过来，那四个章像四块糖。',
      next: 'hk_89'
    },

    /* ============================================================
     *  五 · 玩偶店 ·「大尾巴鲨鱼蜥蜴」（hk_89 – hk_130）
     * ============================================================ */

    {
      id: 'hk_89', chapter: 9, scene: 'hk_shop', tint: 'dusk', bgm: 'bgm_warm', beat: 'calm', sfx: 'sfx_ding',
      cast: [
        { id: 'ya', pos: 'left', expr: 'excited', outfit: 'casual', act: 'idle' },
        { id: 'jin', pos: 'right', expr: 'smile', outfit: 'casual', act: 'idle' }
      ],
      speaker: 'narrator',
      text: '换纪念币的柜台在商店街最里面。她拿着地图走在前面，进门时回头催了我一句。\n工作人员收走地图，从抽屉里拿出硬币，放在她手心。',
      next: 'hk_90'
    },
    {
      id: 'hk_90', chapter: 9, cg: 'cg_hk_coin',
      speaker: 'narrator',
      text: '硬币是金色的。正面是城堡，背面是很大的「20」，边上一圈很细的字，写着年份。',
      next: 'hk_91'
    },
    {
      id: 'hk_91', chapter: 9,
      cast: [{ id: 'ya', pos: 'left', expr: 'proud', outfit: 'casual', act: 'idle' }],
      speaker: 'ya',
      text: '换到了。\n二十周年，只有今年有。',
      next: 'hk_92'
    },
    {
      id: 'hk_92', chapter: 9,
      cast: [{ id: 'ya', pos: 'left', expr: 'soft', outfit: 'casual', act: 'reach' }],
      speaker: 'ya',
      text: '给你。',
      next: 'hk_93'
    },
    {
      id: 'hk_93', chapter: 9,
      cast: [{ id: 'jin', pos: 'right', expr: 'surprised', outfit: 'casual', act: 'idle' }],
      speaker: 'jin',
      text: '……给我？',
      next: 'hk_94'
    },
    {
      id: 'hk_94', chapter: 9,
      cast: [{ id: 'ya', pos: 'left', expr: 'smile', outfit: 'casual', act: 'idle' }],
      speaker: 'ya',
      text: '你拿着，放你钱包里，帮我保管。\n下次见面我检查，少一道划痕都不行。',
      next: 'hk_95'
    },
    {
      id: 'hk_95', chapter: 9,
      cast: [{ id: 'jin', pos: 'center', expr: 'moved', outfit: 'casual', act: 'reach' }],
      speaker: 'inner',
      text: '我没推。我知道她这个时候不喜欢被人推来推去。\n我把硬币放进外套内袋，那里离心口最近。',
      effects: { affection: 6, trust: 4 },
      next: 'hk_96'
    },
    {
      id: 'hk_96', chapter: 9,
      cast: [{ id: 'jin', pos: 'center', expr: 'soft', outfit: 'casual', act: 'idle' }],
      speaker: 'inner',
      text: '硬币是凉的，隔着衬衣贴上来，有点硬。\n我在心里给它记了一个位置。',
      next: 'hk_97'
    },
    {
      id: 'hk_97', chapter: 9, tint: 'dusk',
      speaker: 'narrator',
      text: '从店里出来，商店街的灯已经全亮了。天是那种很深的蓝，还没有全黑。',
      next: 'hk_98'
    },
    {
      id: 'hk_98', chapter: 9,
      cast: [{ id: 'ya', pos: 'left', expr: 'smile', outfit: 'casual', act: 'idle' }],
      speaker: 'ya',
      text: '还有时间。\n进去看看？这家店的玩偶墙，我在网上看过。',
      next: 'hk_99'
    },
    {
      id: 'hk_99', chapter: 9, scene: 'hk_shop', bgm: 'bgm_warm', beat: 'calm',
      titlecard: '玩偶店 · 暖光',
      cast: [
        { id: 'ya', pos: 'left', expr: 'excited', outfit: 'casual', act: 'idle' },
        { id: 'jin', pos: 'right', expr: 'neutral', outfit: 'casual', act: 'idle' }
      ],
      speaker: 'narrator', transition: 'fade',
      text: '店里比外面暖很多。货架一直堆到天花板，每一层都坐满了玩偶，全部朝着门口看。',
      next: 'hk_100'
    },
    {
      id: 'hk_100', chapter: 9,
      cast: [{ id: 'ya', pos: 'left', expr: 'excited', outfit: 'casual', act: 'look_up' }],
      speaker: 'ya',
      text: '你看这一排。\n每一只都不一样，可是坐得一样整齐。',
      next: 'hk_101'
    },
    {
      id: 'hk_101', chapter: 9,
      speaker: 'narrator',
      text: '她走得很慢，一排一排地看。看到喜欢的就捏一下耳朵，再放回去，像在做记录。',
      next: 'hk_102'
    },
    {
      id: 'hk_102', chapter: 9,
      cast: [{ id: 'jin', pos: 'center', expr: 'soft', outfit: 'casual', act: 'idle' }],
      speaker: 'inner',
      text: '我跟在她后面半步。这是今天最好走的一段路——不用说话，只要不跟丢。',
      next: 'hk_103'
    },
    {
      id: 'hk_103', chapter: 9,
      cast: [{ id: 'ya', pos: 'left', expr: 'surprised', outfit: 'casual', act: 'bow' }],
      speaker: 'narrator',
      text: '走到最里面那一排，她忽然停住了，然后蹲了下去。',
      next: 'hk_104'
    },
    {
      id: 'hk_104', chapter: 9,
      cast: [
        { id: 'ya', pos: 'left', expr: 'surprised', outfit: 'casual', act: 'bow' },
        { id: 'jin', pos: 'right', expr: 'neutral', outfit: 'casual', act: 'idle' }
      ],
      speaker: 'ya',
      text: '……等一下。\n你看这个。',
      next: 'hk_105'
    },
    {
      id: 'hk_105', chapter: 9,
      speaker: 'narrator',
      text: '她从架子上抱下来一只玩偶。很大的尾巴，鱼一样的背鳍，圆圆的头，四只短短的爪子。',
      next: 'hk_106'
    },
    {
      id: 'hk_106', chapter: 9,
      speaker: 'narrator',
      text: '标签上写着三个字：鲨鱼蜥蜴。\n它的眼睛是两条缝，像一直在笑。',
      next: 'hk_107'
    },
    {
      id: 'hk_107', chapter: 9,
      cast: [{ id: 'ya', pos: 'left', expr: 'laugh', outfit: 'casual', act: 'reach' }],
      speaker: 'ya',
      text: '它的尾巴比我的小臂还长。\n你摸，里面好像有珠子。',
      next: 'hk_108'
    },
    {
      id: 'hk_108', chapter: 9,
      cast: [{ id: 'ya', pos: 'left', expr: 'soft', outfit: 'casual', act: 'idle' }],
      speaker: 'ya',
      text: '它丑得很认真。\n——不是丑。就是，它长得很有性格。',
      next: 'hk_109'
    },
    {
      id: 'hk_109', chapter: 9,
      cast: [{ id: 'jin', pos: 'center', expr: 'soft', outfit: 'casual', act: 'idle' }],
      speaker: 'inner',
      text: '她把它的尾巴绕在自己手腕上，解开，又绕一次。\n她没发现，她笑的时候把它抱得更紧了一点。',
      next: 'hk_110'
    },
    {
      id: 'hk_110', chapter: 9, sfx: 'sfx_page',
      speaker: 'narrator',
      text: '然后她翻了一下价签。笑容停了一下。',
      next: 'hk_111'
    },
    {
      id: 'hk_111', chapter: 9,
      cast: [{ id: 'ya', pos: 'left', expr: 'worried', outfit: 'casual', act: 'idle' }],
      speaker: 'ya',
      text: '……有点贵。\n算了，放回去吧，我们去看别的。',
      next: 'hk_112'
    },
    {
      id: 'hk_112', chapter: 9,
      speaker: 'narrator',
      text: '她把它放回架子上，位置摆得很正，还顺手把它的尾巴捋平了。然后往前走了两步。',
      next: 'hk_113'
    },
    {
      id: 'hk_113', chapter: 9,
      speaker: 'narrator',
      text: '第三步没迈出去。她回头看了一眼。',
      next: 'hk_114'
    },
    {
      id: 'hk_114', chapter: 9,
      speaker: 'inner',
      text: '她站在两排货架中间，背对着我，耳朵有点红。',
      choices: [
        { text: '什么都不问，直接拿去结账', hint: '她刚才把它摆得很正', effects: { affection: 5, courage: 3 }, next: 'hk_115a' },
        { text: '问她：真的喜欢吗', hint: '让她自己说出口', effects: { affection: 3, trust: 4 }, next: 'hk_115b' },
        { text: '先拉她走，说看完烟花再回来', hint: '逗她一下，看她急不急', effects: { courage: 2, trust: 3 }, next: 'hk_115c' }
      ]
    },
    {
      id: 'hk_115a', chapter: 9,
      cast: [{ id: 'ya', pos: 'left', expr: 'surprised', outfit: 'casual', act: 'idle' }],
      speaker: 'ya',
      text: '哎，你干嘛。\n我还没说我要。……你怎么就抱走了。',
      next: 'hk_116'
    },
    {
      id: 'hk_115b', chapter: 9,
      cast: [{ id: 'ya', pos: 'left', expr: 'shy', outfit: 'casual', act: 'idle' }],
      speaker: 'ya',
      text: '……喜欢。\n喜欢是喜欢。可是喜欢也不一定非要买。',
      next: 'hk_116'
    },
    {
      id: 'hk_115c', chapter: 9,
      cast: [{ id: 'ya', pos: 'left', expr: 'pout', outfit: 'casual', act: 'idle' }],
      speaker: 'ya',
      text: '那你别拉我。\n等我走出去，这个位置就空了，你信不信。',
      next: 'hk_116'
    },
    {
      id: 'hk_116', chapter: 9,
      cast: [{ id: 'jin', pos: 'right', expr: 'smile', outfit: 'casual', act: 'idle' }],
      speaker: 'jin',
      text: '信。\n所以我早就抱在手里了。',
      next: 'hk_117'
    },
    {
      id: 'hk_117', chapter: 9,
      cast: [
        { id: 'ya', pos: 'left', expr: 'laugh', outfit: 'casual', act: 'idle' },
        { id: 'jin', pos: 'right', expr: 'laugh', outfit: 'casual', act: 'idle' }
      ],
      speaker: 'ya',
      text: '……你这个人。\n你刚才是不是一直在等我回头。',
      next: 'hk_118'
    },
    {
      id: 'hk_118', chapter: 9, zoom: 'face',
      cast: [{ id: 'jin', pos: 'center', expr: 'soft', outfit: 'casual', act: 'idle' }],
      speaker: 'inner',
      text: '是。\n从她把它抱下来的那一刻起，我就在等她回头。',
      next: 'hk_119'
    },
    {
      id: 'hk_119', chapter: 9, sfx: 'sfx_ding',
      cast: [
        { id: 'ya', pos: 'left', expr: 'smile', outfit: 'casual', act: 'idle' },
        { id: 'jin', pos: 'right', expr: 'smile', outfit: 'casual', act: 'idle' }
      ],
      speaker: 'narrator',
      text: '她抱着它，抬头问我：真的买？\n我说买。然后我掏卡，她把脸别到一边去。\n店员问要不要包装，她摇头，说不用，我抱着。',
      next: 'hk_120'
    },
    {
      id: 'hk_120', chapter: 9,
      cast: [{ id: 'ya', pos: 'left', expr: 'proud', outfit: 'casual', act: 'idle' }],
      speaker: 'ya',
      text: '不用袋子。\n我要抱着它去看烟花。',
      next: 'hk_121'
    },
    {
      id: 'hk_121', chapter: 9,
      speaker: 'narrator',
      text: '她抱着那只玩偶出门的样子，像抱着一个刚出生的东西。',
      next: 'hk_122'
    },
    {
      id: 'hk_122', chapter: 9,
      cast: [{ id: 'ya', pos: 'left', expr: 'smile', outfit: 'casual', act: 'idle' }],
      speaker: 'ya',
      text: '我给你起个名字。\n嗯……大尾巴。就叫大尾巴。',
      next: 'hk_123'
    },
    {
      id: 'hk_123', chapter: 9,
      speaker: 'jin',
      text: '……它本来就叫大尾巴。',
      next: 'hk_124'
    },
    {
      id: 'hk_124', chapter: 9,
      cast: [{ id: 'ya', pos: 'left', expr: 'laugh', outfit: 'casual', act: 'idle' }],
      speaker: 'ya',
      text: '那不一样。\n刚才是它的种类，现在是它的名字。',
      next: 'hk_125'
    },
    {
      id: 'hk_125', chapter: 9,
      cast: [{ id: 'ya', pos: 'left', expr: 'smile', outfit: 'casual', act: 'reach' }],
      speaker: 'ya',
      text: '等一下。\n这条彩带系它尾巴上——这样它也算看过巡游。',
      next: 'hk_126'
    },
    {
      id: 'hk_126', chapter: 9,
      cast: [{ id: 'jin', pos: 'center', expr: 'soft', outfit: 'casual', act: 'idle' }],
      speaker: 'inner',
      text: '她自己手上那条还留着。\n两个人一条，一只玩偶一条。她分得很公平。',
      next: 'hk_127'
    },
    {
      id: 'hk_127', chapter: 9,
      cast: [{ id: 'ya', pos: 'left', expr: 'soft', outfit: 'casual', act: 'idle' }],
      speaker: 'ya',
      text: '你怎么不给自己买一只。',
      next: 'hk_128'
    },
    {
      id: 'hk_128', chapter: 9,
      cast: [{ id: 'jin', pos: 'center', expr: 'blank', outfit: 'casual', act: 'idle' }],
      speaker: 'inner',
      text: '我本来想说我不喜欢这种东西。\n可是刚才在店里，我看过第二只——是灰色的。',
      next: 'hk_129'
    },
    {
      id: 'hk_129', chapter: 9,
      cast: [{ id: 'jin', pos: 'right', expr: 'smile', outfit: 'casual', act: 'idle' }],
      speaker: 'jin',
      text: '……下次吧。\n下次来，我买那只灰的。',
      effects: { affection: 5, courage: 4 },
      next: 'hk_130'
    },
    {
      id: 'hk_130', chapter: 9,
      cast: [{ id: 'ya', pos: 'left', expr: 'laugh', outfit: 'casual', act: 'idle' }],
      speaker: 'ya',
      text: '说定了。\n这句话我记住了，你别赖。',
      next: 'hk_131'
    },

    /* ============================================================
     *  六 · 入夜 · 烟花（hk_131 – hk_end）
     *
     *  音效与节奏设计（这一章的高潮，写作时刻意按「一段音乐」来排布）：
     *    · beat:'calm'  hk_135–hk_140  落座 · 灯灭 · 人群安静（ambience: crowd → night）
     *    · beat:'pulse' hk_141–hk_144  第一发：sfx_firework_launch（升空"咻"）→ sfx_firework_boom（炸开）
     *    · beat:'pulse' hk_145–hk_154  第二段：鼓点跟着烟花走；sfx_heart 落在两只手相碰的地方
     *    · beat:'calm'  hk_155–hk_159  慢下来的一小段：只有零星几朵，用来放那两句最重要的台词
     *    · beat:'swell' hk_160–hk_162  最后一段：整个天空亮起来（sfx_firework_finale，cg_hk_fireworks 落在这里）
     *    · beat:'drop'  hk_163–hk_167  收：安静半秒 → 鼓掌 → 她说眼睛进东西了
     *    末尾 bgm_night（回程）收束，hk_end → c9_01。
     *    音效全部为 src/audio.js 实时合成（无采样文件），与上述 beat 编排互不干扰。
     * ============================================================ */

    {
      id: 'hk_131', chapter: 9, scene: 'hk_park', tint: 'dusk', bgm: 'bgm_warm', beat: 'calm',
      cast: [
        { id: 'ya', pos: 'left', expr: 'smile', outfit: 'casual', act: 'idle' },
        { id: 'jin', pos: 'right', expr: 'soft', outfit: 'casual', act: 'idle' }
      ],
      speaker: 'narrator',
      text: '出门的时候风起来了。天从深蓝变成一种很暗的紫，城堡的灯一盏一盏亮起来。',
      next: 'hk_132'
    },
    {
      id: 'hk_132', chapter: 9,
      cast: [{ id: 'ya', pos: 'left', expr: 'excited', outfit: 'casual', act: 'look_up' }],
      speaker: 'ya',
      text: '你看那边。\n烟花要开始了。',
      next: 'hk_133'
    },
    {
      id: 'hk_133', chapter: 9, ambience: 'crowd',
      speaker: 'narrator',
      text: '广播里在说，请往城堡正前方集合。人群开始往一个方向走，像倒过来的退潮。',
      next: 'hk_134'
    },
    {
      id: 'hk_134', chapter: 9,
      cast: [{ id: 'jin', pos: 'center', expr: 'soft', outfit: 'casual', act: 'idle' }],
      speaker: 'inner', transition: 'slowfade',
      text: '广播又念了一遍，我们跟着人流往城堡前走。她抱着大尾巴走在前面半步，走两步就回头看我。\n我拎着空袋子。袋子很轻——今天买的东西全在她怀里。',
      next: 'hk_135'
    },
    {
      id: 'hk_135', chapter: 9, scene: 'hk_fireworks', tint: 'night', bgm: 'bgm_ending', beat: 'calm', ambience: 'crowd',
      titlecard: '入夜 · 烟花',
      cast: [
        { id: 'ya', pos: 'left', expr: 'smile', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'neutral', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'narrator', transition: 'slowfade',
      text: '城堡前面已经坐满了人。我们找了个偏一点的位置，台阶还是温的，晒了一整天。',
      next: 'hk_136'
    },
    {
      id: 'hk_136', chapter: 9,
      cast: [{ id: 'ya', pos: 'left', expr: 'smile', outfit: 'casual', act: 'sit' }],
      speaker: 'ya',
      text: '坐这里可以吗。\n会不会太偏。',
      next: 'hk_137'
    },
    {
      id: 'hk_137', chapter: 9,
      speaker: 'jin',
      text: '可以。\n偏一点好，风小。',
      next: 'hk_138'
    },
    {
      id: 'hk_138', chapter: 9,
      cast: [{ id: 'jin', pos: 'center', expr: 'soft', outfit: 'casual', act: 'sit' }],
      speaker: 'inner',
      text: '我把外套脱下来铺在台阶上。她问我冷不冷，然后往里挪了挪，留出一半。',
      next: 'hk_139'
    },
    {
      id: 'hk_139', chapter: 9, ambience: 'night',
      speaker: 'narrator',
      text: '八点整，广场的灯全部暗下来。人群的声音像被人用手按住，一点一点低下去。',
      next: 'hk_140'
    },
    {
      id: 'hk_140', chapter: 9,
      cast: [
        { id: 'ya', pos: 'left', expr: 'soft', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'soft', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'ya',
      text: '开始了。',
      next: 'hk_141'
    },
    {
      id: 'hk_141', chapter: 9, sfx: 'sfx_firework_launch', beat: 'pulse',
      cast: [{ id: 'jin', pos: 'center', expr: 'soft', outfit: 'casual', act: 'look_up' }],
      speaker: 'inner',
      text: '第一发升空的声音不是「砰」，是「咻」——很细，像有人在夜里拉了一根线。',
      next: 'hk_142'
    },
    {
      id: 'hk_142', chapter: 9, sfx: 'sfx_firework_boom',
      speaker: 'narrator',
      text: '那根线在城堡正上方炸开。金色的光先是一个点，再是一圈，最后整片天都亮了一下。',
      next: 'hk_143'
    },
    {
      id: 'hk_143', chapter: 9, zoom: 'face',
      cast: [{ id: 'ya', pos: 'left', expr: 'surprised', outfit: 'casual', act: 'look_up' }],
      speaker: 'narrator',
      text: '光落在她脸上，把她的睫毛照得很清楚。她抱着大尾巴，仰着头，一动没动。',
      next: 'hk_144'
    },
    {
      id: 'hk_144', chapter: 9,
      cast: [{ id: 'jin', pos: 'center', expr: 'soft', outfit: 'casual', act: 'look_up' }],
      speaker: 'inner',
      text: '我想说点什么。张了张嘴，发现这时候说什么都是多余的。',
      next: 'hk_145'
    },
    {
      id: 'hk_145', chapter: 9, beat: 'pulse',
      speaker: 'narrator',
      text: '第二段起来了。音乐加了鼓点，烟花跟着一拍一拍往上打，一朵压着一朵。',
      next: 'hk_146'
    },
    {
      id: 'hk_146', chapter: 9, sfx: 'sfx_heart',
      cast: [
        { id: 'ya', pos: 'left', expr: 'soft', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'soft', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'narrator',
      text: '她的手在台阶上挪了半寸，碰到了我的手。两个人都没有动。',
      next: 'hk_147'
    },
    {
      id: 'hk_147', chapter: 9,
      cast: [{ id: 'jin', pos: 'center', expr: 'moved', outfit: 'casual', act: 'sit' }],
      speaker: 'inner',
      text: '我不太会做这种事。\n可这一路我什么都没说出口，手在这儿，总得让它有点用。',
      next: 'hk_148'
    },
    {
      id: 'hk_148', chapter: 9,
      speaker: 'narrator',
      text: '于是我把她的手扣住了。她的手指很凉，过了几秒才慢慢回温。',
      next: 'hk_149'
    },
    {
      id: 'hk_149', chapter: 9,
      cast: [{ id: 'ya', pos: 'left', expr: 'blush', outfit: 'casual', act: 'sit' }],
      speaker: 'ya',
      text: '……你的手也在抖。',
      next: 'hk_150'
    },
    {
      id: 'hk_150', chapter: 9,
      speaker: 'jin',
      text: '……嗯。\n从过山车那会儿就没停。',
      next: 'hk_151'
    },
    {
      id: 'hk_151', chapter: 9,
      cast: [
        { id: 'ya', pos: 'left', expr: 'laugh', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'soft', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'ya',
      text: '那你刚才还装作不怕。',
      next: 'hk_152'
    },
    {
      id: 'hk_152', chapter: 9,
      speaker: 'narrator',
      text: '城堡的墙上开始放投影。一圈一圈的光，最后是很大的「20」。',
      next: 'hk_153'
    },
    {
      id: 'hk_153', chapter: 9,
      cast: [{ id: 'ya', pos: 'left', expr: 'excited', outfit: 'casual', act: 'look_up' }],
      speaker: 'ya',
      text: '你看那个二十！\n我们今天换的那枚硬币上也有。',
      next: 'hk_154'
    },
    {
      id: 'hk_154', chapter: 9,
      cast: [{ id: 'jin', pos: 'center', expr: 'soft', outfit: 'casual', act: 'reach' }],
      speaker: 'inner',
      text: '我摸了摸外套内袋。\n硬币还在，硬硬的一小块，被我的体温焐热了。',
      next: 'hk_155'
    },
    {
      id: 'hk_155', chapter: 9, beat: 'calm',
      speaker: 'narrator',
      text: '音乐慢下来。中间几分钟只放零星几朵，一朵开完，要等很久才有下一朵。',
      next: 'hk_156'
    },
    {
      id: 'hk_156', chapter: 9, sfx: 'sfx_heart',
      cast: [{ id: 'ya', pos: 'left', expr: 'soft', outfit: 'casual', act: 'sit' }],
      speaker: 'ya',
      text: '谢谢你带我来。\n这句话我早就想说了，一直没找到地方放。',
      effects: { affection: 6, trust: 3 },
      next: 'hk_157'
    },
    {
      id: 'hk_157', chapter: 9,
      cast: [{ id: 'jin', pos: 'right', expr: 'soft', outfit: 'casual', act: 'sit' }],
      speaker: 'jin',
      text: '……我本来想说不用谢。\n后来想了一下，还是应该说点别的。',
      next: 'hk_158'
    },
    {
      id: 'hk_158', chapter: 9,
      cast: [{ id: 'ya', pos: 'left', expr: 'surprised', outfit: 'casual', act: 'sit' }],
      speaker: 'jin',
      text: '以后每一年都来。\n你说的那个「下次」，我一次都不落。',
      effects: { affection: 7, courage: 6 },
      next: 'hk_159'
    },
    {
      id: 'hk_159', chapter: 9,
      cast: [{ id: 'ya', pos: 'left', expr: 'blush', outfit: 'casual', act: 'sit' }],
      speaker: 'ya',
      text: '你说的。\n那你可要记好了。',
      next: 'hk_160'
    },
    {
      id: 'hk_160', chapter: 9, beat: 'swell',
      speaker: 'narrator',
      text: '最后一段来了。音乐整个扬上去，几十朵一起开，从城堡的左边一直铺到右边。',
      next: 'hk_161'
    },
    {
      id: 'hk_161', chapter: 9, sfx: 'sfx_firework_finale', beat: 'swell',
      speaker: 'narrator',
      text: '整个天空都是亮的。光一层一层盖下来，把广场上每个人都照成了金色。',
      next: 'hk_162'
    },
    {
      id: 'hk_162', chapter: 9, cg: 'cg_hk_fireworks', beat: 'swell',
      cast: [
        { id: 'ya', pos: 'left', expr: 'soft', outfit: 'casual', act: 'lean' },
        { id: 'jin', pos: 'right', expr: 'moved', outfit: 'casual', act: 'idle' }
      ],
      speaker: 'inner',
      text: '我们的影子投在台阶上，叠在一起，被光拉得很长。\n那一瞬间我想，这一年所有的路，好像都是为了走到这个台阶上。',
      next: 'hk_163'
    },
    {
      id: 'hk_163', chapter: 9, beat: 'drop',
      speaker: 'narrator',
      text: '最后一发炸完，天慢慢暗回去。人群先是安静了半秒，然后一起鼓掌。',
      next: 'hk_164'
    },
    {
      id: 'hk_164', chapter: 9,
      cast: [{ id: 'jin', pos: 'center', expr: 'moved', outfit: 'casual', act: 'sit' }],
      speaker: 'inner',
      text: '她在鼓掌，眼睛是湿的。\n我没问她为什么。我只是把手握得更紧了一点。',
      next: 'hk_165'
    },
    {
      id: 'hk_165', chapter: 9,
      cast: [{ id: 'ya', pos: 'left', expr: 'soft', outfit: 'casual', act: 'sit' }],
      speaker: 'ya',
      text: '……我眼睛进东西了。\n不是哭。真的。',
      next: 'hk_166'
    },
    {
      id: 'hk_166', chapter: 9,
      speaker: 'jin',
      text: '知道。\n是烟花的关系。',
      next: 'hk_167'
    },
    {
      id: 'hk_167', chapter: 9,
      cast: [{ id: 'ya', pos: 'left', expr: 'laugh', outfit: 'casual', act: 'sit' }],
      speaker: 'ya',
      text: '对。\n是烟花的关系。',
      next: 'hk_168'
    },
    {
      id: 'hk_168', chapter: 9, ambience: 'crowd',
      speaker: 'narrator',
      text: '广场的灯重新亮起来。人们站起来拍衣服上的灰，往出口走。',
      next: 'hk_169'
    },
    {
      id: 'hk_169', chapter: 9,
      cast: [
        { id: 'ya', pos: 'left', expr: 'smile', outfit: 'casual', act: 'idle' },
        { id: 'jin', pos: 'right', expr: 'smile', outfit: 'casual', act: 'idle' }
      ],
      speaker: 'narrator',
      text: '她抱着大尾巴。尾巴上那条彩带被晚风掀起来一下，又落下去。',
      next: 'hk_170'
    },
    {
      id: 'hk_170', chapter: 9,
      cast: [{ id: 'ya', pos: 'left', expr: 'tease', outfit: 'casual', act: 'idle' }],
      speaker: 'ya',
      text: '纪念币在你那儿吗。\n我检查一下。',
      next: 'hk_171'
    },
    {
      id: 'hk_171', chapter: 9,
      speaker: 'narrator',
      text: '我把硬币从内袋里拿出来。她捏着看了两秒，又塞回我手里。',
      next: 'hk_172'
    },
    {
      id: 'hk_172', chapter: 9,
      cast: [{ id: 'ya', pos: 'left', expr: 'smile', outfit: 'casual', act: 'idle' }],
      speaker: 'ya',
      text: '还在。\n那你继续保管。下一次，换一枚别的。',
      next: 'hk_173'
    },
    {
      id: 'hk_173', chapter: 9,
      cast: [{ id: 'jin', pos: 'center', expr: 'soft', outfit: 'casual', act: 'idle' }],
      speaker: 'inner',
      text: '「下一次」。她今天说了三回。\n二月在南阳也有一回。我一次都没敢接，可我都记着。',
      next: 'hk_174'
    },
    {
      id: 'hk_174', chapter: 9, scene: 'station', tint: 'night', bgm: 'bgm_night', beat: 'calm', ambience: 'night',
      cast: [
        { id: 'ya', pos: 'left', expr: 'smile', outfit: 'casual', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'neutral', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'narrator', transition: 'slowfade',
      text: '散场的时候我们在出口站了一会儿，等那阵人潮过去。\n回去的专线是十点半，车厢里人不多。她靠着窗，抱着大尾巴，说了两句就不说了。',
      next: 'hk_175'
    },
    {
      id: 'hk_175', chapter: 9,
      cast: [
        { id: 'ya', pos: 'left', expr: 'sleepy', outfit: 'casual', act: 'sleepy' },
        { id: 'jin', pos: 'right', expr: 'soft', outfit: 'casual', act: 'sit' }
      ],
      speaker: 'narrator',
      text: '过了两站，她的头慢慢歪过来，靠在我肩膀上。大尾巴从她怀里滑下去一半。',
      next: 'hk_176'
    },
    {
      id: 'hk_176', chapter: 9,
      cast: [{ id: 'jin', pos: 'center', expr: 'soft', outfit: 'casual', act: 'sit' }],
      speaker: 'inner',
      text: '我一只手扶着它的尾巴，一只手不敢动。\n窗外的灯一段一段往后退，像慢下来的烟花。',
      next: 'hk_177'
    },
    {
      id: 'hk_177', chapter: 9,
      cast: [{ id: 'jin', pos: 'center', expr: 'soft', outfit: 'casual', act: 'sit' }],
      speaker: 'inner',
      text: '今天她笑了很多次。过山车最高点那一秒，巡游的彩带，硬币被放进我内袋的那一刻。\n还有玩偶店——她回头的那一眼。',
      next: 'hk_178'
    },
    {
      id: 'hk_178', chapter: 9,
      cast: [{ id: 'jin', pos: 'center', expr: 'moved', outfit: 'casual', act: 'sit' }],
      speaker: 'inner',
      text: '我后来才明白，今天最要紧的不是我说了什么。\n是她抱着它回头的时候，我正好抬起了头。',
      effects: { affection: 5, trust: 5 },
      next: 'hk_179'
    },
    {
      id: 'hk_179', chapter: 9,
      speaker: 'narrator', transition: 'slowfade',
      text: '车到站的时候她醒了。第一句话是问大尾巴有没有掉。\n我说没有，在我手里。',
      next: 'hk_180'
    },
    {
      id: 'hk_180', chapter: 9,
      cast: [{ id: 'ya', pos: 'left', expr: 'soft', outfit: 'casual', act: 'idle' }],
      speaker: 'ya',
      text: '那就好。\n……明天你就要回去了吧。',
      next: 'hk_181'
    },
    {
      id: 'hk_181', chapter: 9,
      cast: [{ id: 'jin', pos: 'right', expr: 'soft', outfit: 'casual', act: 'idle' }],
      speaker: 'jin',
      text: '嗯。\n四月剩下的日子，我先替你把这枚硬币看好。',
      next: 'hk_end'
    },
    {
      id: 'hk_end', chapter: 9, scene: 'station', tint: 'night', bgm: 'bgm_hope', beat: 'calm', ambience: 'night',
      cast: [{ id: 'jin', pos: 'center', expr: 'soft', outfit: 'casual', act: 'idle' }],
      speaker: 'inner', transition: 'slowfade',
      text: '回去以后，我把硬币放在钱包最里面那一层，坐地铁时会隔着皮子摸一下它的边。\n四月还没过完，她发来一句：黄梅天之前，我们再去一个地方吧。',
      next: 'hk_182'
    },
    {
      id: 'hk_182', chapter: 9, scene: 'dorm', tint: 'night', bgm: 'bgm_hope', beat: 'calm', ambience: 'night',
      cast: [{ id: 'jin', pos: 'center', expr: 'soft', outfit: 'casual', act: 'idle' }],
      speaker: 'narrator', transition: 'slowfade',
      text: '隔了一天，她发来一条四十多秒的语音。前半段在讲她宿舍楼下那只猫，后半段才绕回正题：\n「黄梅天之前，我们去看西湖吧。」',
      next: 'hk_183'
    },
    {
      id: 'hk_183', chapter: 9,
      cast: [{ id: 'jin', pos: 'center', expr: 'soft', outfit: 'casual', act: 'idle' }],
      speaker: 'inner',
      text: '我听了两遍才回她。她说断桥、苏堤、灵隐寺都排好了，就三天，还不许我查天气，也不许我说「都行」。',
      next: 'hk_184'
    },
    {
      id: 'hk_184', chapter: 9,
      cast: [{ id: 'jin', pos: 'center', expr: 'smile', outfit: 'casual', act: 'idle' }],
      speaker: 'inner',
      text: '我说好。挂了电话才想起来，我连西湖在杭州的哪一边都不知道。\n那天晚上我把她发的路线存进备忘录，又在手机天气里加了一个城市：杭州。',
      next: 'c9_01'
    }

  ]);
})();
