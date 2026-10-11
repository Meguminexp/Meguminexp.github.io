/* 《你好！一周年》第三章 · 生日地图（2025.09.26 夜 – 09.27 凌晨） —— 剧本组 B
 * 真实时间线：她反复问 → 我动过推掉的念头 → 09.26 23:00 我一个人进地图看手写标记
 *             → 23:50 三个人从语音里消失 → 00:00 生日快乐 → §8.1 凌晨私聊逐字复现
 * chat 节点为 STORY_SPEC §8.1 原文，逐条照抄（含时间戳），不得改写。
 */
(function () {
  'use strict';
  YJ.story.add([

    /* ==========================================================
     *  一、生日前几天：她反复问，我动过推掉的念头
     * ========================================================== */

    { id:'c3_01', chapter:3, scene:'dorm', tint:'night', bgm:'bgm_quiet', beat:'calm',
      ambience:'night',
      cast:[{ id:'jin', pos:'center', expr:'blank', outfit:'home', act:'sit' }],
      speaker:'inner',
      text:'九月底的晚上已经要点灯了。我盯着屏幕右下角的时间，看了很久才发现，自己一个字都没打出来。',
      next:'c3_02' },

    { id:'c3_02', chapter:3, sfx:'sfx_msg',
      cast:[{ id:'jin', pos:'center', expr:'neutral', outfit:'home', act:'sit' }],
      speaker:'narrator',
      text:'手机在键盘旁边亮了一下。她的消息很短，短到像随口一说。',
      next:'c3_03' },

    { id:'c3_03', chapter:3,
      cast:[{ id:'ya', pos:'left', expr:'neutral', outfit:'casual', act:'idle' },
            { id:'jin', pos:'right', expr:'blank', outfit:'home', act:'sit' }],
      speaker:'ya',
      text:'27 号那天晚上，你有空吗？',
      next:'c3_04' },

    { id:'c3_04', chapter:3,
      cast:[{ id:'ya', pos:'left', expr:'smile', outfit:'casual', act:'idle' },
            { id:'jin', pos:'right', expr:'blank', outfit:'home', act:'sit' }],
      speaker:'inner',
      text:'我打了一半「应该可以」，删掉；又打「什么事」，也删掉。最后发出去的是「大概」。就俩字，我还想了半天。',
      next:'c3_05' },

    { id:'c3_05', chapter:3,
      cast:[{ id:'ya', pos:'left', expr:'tease', outfit:'casual', act:'idle' },
            { id:'jin', pos:'right', expr:'neutral', outfit:'home', act:'sit' }],
      speaker:'ya',
      text:'那就是有咯。',
      next:'c3_06' },

    { id:'c3_06', chapter:3,
      cast:[{ id:'jin', pos:'center', expr:'neutral', outfit:'home', act:'sit' }],
      speaker:'inner',
      text:'第二天她又问了一遍。第三天换了种问法：「你那天晚上不会临时有事吧。」她把「临时」两个字咬得很重。',
      next:'c3_07' },

    { id:'c3_07', chapter:3, beat:'pulse',
      cast:[{ id:'ya', pos:'left', expr:'proud', outfit:'casual', act:'idle' },
            { id:'jin', pos:'right', expr:'awkward', outfit:'home', act:'sit' }],
      speaker:'ya',
      text:'先说好，不许鸽我。你这个人，鸽起来一点心理负担都没有。',
      next:'c3_08' },

    { id:'c3_08', chapter:3,
      cast:[{ id:'ya', pos:'left', expr:'proud', outfit:'casual', act:'idle' },
            { id:'jin', pos:'right', expr:'smile', outfit:'home', act:'sit' }],
      speaker:'jin',
      text:'……我什么时候鸽过你。',
      next:'c3_09' },

    { id:'c3_09', chapter:3,
      cast:[{ id:'ya', pos:'left', expr:'tease', outfit:'casual', act:'idle' },
            { id:'jin', pos:'right', expr:'blank', outfit:'home', act:'sit' }],
      speaker:'ya',
      text:'上周三。你说你困了。',
      next:'c3_10' },

    { id:'c3_10', chapter:3, effects:{ affection:2, trust:1 },
      cast:[{ id:'jin', pos:'center', expr:'moved', outfit:'home', act:'sit' }],
      speaker:'inner',
      text:'我确实说过困了。那句话在群里一秒钟就沉下去了，没有人接。我把手机翻过来，又翻回去。她记得。',
      next:'c3_11' },

    { id:'c3_11', chapter:3, beat:'pulse',
      cast:[{ id:'jin', pos:'center', expr:'guilty', outfit:'home', act:'sit' }],
      speaker:'inner',
      text:'也就是那几天，我心里冒出过一个很没出息的念头：那天晚上，要不要找个理由推掉。她问得太认真了，认真得让人害怕。',
      next:'c3_12' },

    { id:'c3_12', chapter:3,
      cast:[{ id:'jin', pos:'center', expr:'guilty', outfit:'home', act:'sit' }],
      speaker:'inner',
      text:'我怕自己接不住。怕她准备了很久的东西，被我一句话聊死；怕她期待的那些，我一个都给不了。',
      next:'c3_13' },

    { id:'c3_13', chapter:3, effects:{ courage:-2 },
      cast:[{ id:'jin', pos:'center', expr:'serious', outfit:'home', act:'sit' }],
      speaker:'inner',
      text:'这个念头我谁都没说。后来再想起它的时候，我自己都觉得丢人——它确实存在过。',
      next:'c3_14' },

    { id:'c3_14', chapter:3, effects:{ flags:{ f_map_hint:true } },
      cast:[{ id:'jin', pos:'center', expr:'blank', outfit:'home', act:'sit' }],
      speaker:'narrator',
      text:'她只在群里漏过半句：「26 号晚上你们谁都别上线，我要干件大事。」消息很快就被撤回了。',
      next:'c3_15' },

    { id:'c3_15', chapter:3, titlecard:'2025 · 09 · 26  22:47',
      transition:'slowfade',
      cast:[{ id:'jin', pos:'center', expr:'neutral', outfit:'home', act:'sit' }],
      speaker:'inner',
      text:'26 号晚上十点四十七。宿舍楼下的灯灭了，我洗完澡坐在电脑前，看了一会儿黑掉的屏幕。',
      next:'c3_16' },

    { id:'c3_16', chapter:3,
      cast:[{ id:'jin', pos:'center', expr:'neutral', outfit:'home', act:'sit' }],
      speaker:'inner',
      text:'语音里一直没人。宅和桥下午在群里都说今晚来不了，我就一个人把游戏挂着，房间里静得能听见风扇。我在输入框里打了句「要不要一起打两把」，看了两秒，删了。快十一点的时候，三个头像忽然一个接一个地亮起来。',
      next:'c3_16b' },

    /* ==========================================================
     *  二、23:00 四个人一起进地图
     * ========================================================== */

    { id:'c3_16b', chapter:3, ambience:'keyboard', transition:'fade',
      cast:[{ id:'ya', pos:'left', expr:'proud', outfit:'casual', act:'idle' },
            { id:'jin', pos:'right', expr:'surprised', outfit:'home', act:'sit' }],
      speaker:'ya',
      text:'都上来啦。我那张地图，今天就是要给你们看的。等会儿谁都不许抢着走，一起走。',
      next:'c3_16c' },

    { id:'c3_16c', chapter:3,
      cast:[{ id:'ya', pos:'left', expr:'smile', outfit:'casual', act:'idle' },
            { id:'jin', pos:'right', expr:'soft', outfit:'home', act:'sit' }],
      speaker:'narrator',
      text:'四个人在同一个房间里点下"准备"。加载条一格一格地走，谁都没说话。我在心里数了一遍：今晚这个房间里，一个都不少。',
      next:'c3_36' },

    /* ==========================================================
     *  三、23:50 她们一起下线，一个人在空掉的麦里
     * ========================================================== */

    { id:'c3_36', chapter:3, scene:'dorm', tint:'night', bgm:'bgm_memory', beat:'pulse',
      ambience:'keyboard', transition:'fade',
      cast:[{ id:'ya', pos:'left', expr:'smile', outfit:'casual', act:'idle' },
            { id:'jin', pos:'right', expr:'moved', outfit:'home', act:'sit' }],
      speaker:'narrator',
      text:'快十一点五十的时候，她在麦里叫了一声：「哎我网卡了。」声音有点急。宅跟着说「我也是」，桥说「我这边也卡」。',
      next:'c3_37' },

    { id:'c3_37', chapter:3,
      cast:[{ id:'ya', pos:'left', expr:'smile', outfit:'casual', act:'idle' },
            { id:'jin', pos:'right', expr:'neutral', outfit:'home', act:'sit' }],
      speaker:'ya',
      text:'我这边网卡了啦。重登一下，你先别退啊。',
      next:'c3_38' },

    { id:'c3_38', chapter:3, beat:'drop', sfx:'sfx_click',
      cast:[{ id:'jin', pos:'center', expr:'blank', outfit:'home', act:'sit' }],
      speaker:'narrator',
      text:'话音刚落，三个头像一个接一个地暗了下去。先是她，再是宅，然后是桥。中间没有一句话。',
      next:'c3_39' },

    { id:'c3_39', chapter:3, transition:'none',
      cast:[{ id:'jin', pos:'center', expr:'blank', outfit:'home', act:'sit' }],
      speaker:'inner',
      text:'…… ',
      next:'c3_40' },

    { id:'c3_40', chapter:3, transition:'none',
      cast:[{ id:'jin', pos:'center', expr:'blank', outfit:'home', act:'sit' }],
      speaker:'inner',
      text:'（耳机里只剩下我自己的呼吸。）',
      next:'c3_41' },

    { id:'c3_41', chapter:3, effects:{ flags:{ f_vanished_2350:true } },
      cast:[{ id:'jin', pos:'center', expr:'blank', outfit:'home', act:'sit' }],
      speaker:'narrator',
      text:'我没反应过来。真的没有——那几秒里我甚至在想，是不是我的网络出了问题，顺手点了一下重连。',
      next:'c3_42' },

    { id:'c3_42', chapter:3,
      cast:[{ id:'jin', pos:'center', expr:'neutral', outfit:'home', act:'sit' }],
      speaker:'inner',
      text:'三个人同时掉线。我当时的判断是「巧合」，然后我什么都没做，就站在原地，等她那个头像重新亮起来。',
      next:'c3_17' },

    /* ==========================================================
     *  四、23:56 一个人进地图：一条条手写标记
     * ========================================================== */

    { id:'c3_17', chapter:3, scene:'idv_map', bgm:'bgm_memory', beat:'calm',
      ambience:'night', transition:'slowfade',
      cast:[{ id:'jin', pos:'center', expr:'surprised', outfit:'home', act:'idle' }],
      speaker:'narrator',
      text:'等到十一点五十六，头像一个都没亮。我重新点开那张地图，一个人走了进去——沿着她们没走完的那条路。',
      next:'c3_18' },

    { id:'c3_18', chapter:3,
      cast:[{ id:'jin', pos:'center', expr:'blank', outfit:'home', act:'idle' }],
      speaker:'narrator',
      text:'这张图是精心布置过的：从开头到结尾，全是我们一起待过的地方。我往前走，夜雾里就浮出一行字；再走一段，又出来一行。',
      next:'c3_19' },

    { id:'c3_19', chapter:3, effects:{ flags:{ f_map_played:true } },
      cast:[{ id:'jin', pos:'center', expr:'moved', outfit:'home', act:'idle' }],
      speaker:'inner',
      text:'刚才他们还在这儿的时候，字飘得太快，没人看清。现在一个人走，它们一行一行按顺序亮起来。那些字不是系统给的提示——是她手写的。',
      next:'c3_20' },

    { id:'c3_20', chapter:3, beat:'pulse',
      cast:[{ id:'jin', pos:'center', expr:'moved', outfit:'home', act:'idle' }],
      speaker:'narrator',
      text:'第三条之后，雾里一起浮出来三行字。左、中、右，各自亮着一层很淡的边。它们就悬在我前面几步远的地方，安安静静地亮着，不催我。',
      next:'c3_21' },

    { id:'c3_21', chapter:3,
      cast:[{ id:'jin', pos:'center', expr:'moved', outfit:'home', act:'idle' }],
      speaker:'inner',
      text:'……我站在那儿没动。看，还是不看；看多细，看多慢。连这种事，我都要在心里过一遍。',
      choices:[
        { text:'……站定。一行一行看完，一个字都不放过。', next:'c3_21a',
          effects:{ trust:5 }, hint:'（慢一点没关系，我怕漏掉什么）' },
        { text:'……不敢细看。先往里走，让它们自己飘过去。', next:'c3_21b',
          effects:{ affection:5 }, hint:'（眼睛往旁边让开一点，就当没看见）' },
        { text:'深吸一口气，把三行字一行一行念出声——念给空掉的麦听。', next:'c3_21c',
          effects:{ courage:6, trust:2 }, hint:'（声音有点抖，可我不想再让这些话只在雾里亮着）' }
      ] },

    /* —— 分支一：站定，一行一行看完 —— */
    { id:'c3_21a', chapter:3,
      cast:[{ id:'jin', pos:'center', expr:'moved', outfit:'home', act:'idle' }],
      speaker:'narrator',
      text:'我把手插在兜里，站定了没动。左边那行笔画很小，一笔一笔压得很实，像是写完又描过一遍。',
      next:'c3_21a2' },

    { id:'c3_21a2', chapter:3,
      cast:[{ id:'jin', pos:'center', expr:'soft', outfit:'home', act:'idle' }],
      speaker:'inner',
      text:'我读得很慢。慢到能看出每个字收笔的地方墨色更深一点——她写到后面，手是用了力的。',
      next:'c3_21a3' },

    { id:'c3_21a3', chapter:3,
      cast:[{ id:'jin', pos:'center', expr:'soft', outfit:'home', act:'idle' }],
      speaker:'narrator',
      text:'三行读完，我才发现自己一直屏着气。我把那口气吐出来，往前挪了半步。字没动，还是那样亮着。',
      next:'c3_22' },

    /* —— 分支二：不敢细看，先往里走 —— */
    { id:'c3_21b', chapter:3,
      cast:[{ id:'jin', pos:'center', expr:'awkward', outfit:'home', act:'idle' }],
      speaker:'narrator',
      text:'我把视线从字上挪开，迈步往里走。其实也没走多远，就是不想站在那儿一个字一个字地看。',
      next:'c3_21b2' },

    { id:'c3_21b2', chapter:3, effects:{ flags:{ f_map_avoided:true } },
      cast:[{ id:'jin', pos:'center', expr:'guilty', outfit:'home', act:'idle' }],
      speaker:'inner',
      text:'字从我身边飘过去。眼睛的余光还是抓到了几个：「朋友」「来不了」「想和我」……都是半截。我一行都没看清，像隔着墙听一段跟自己有关的对话。',
      next:'c3_21b3' },

    { id:'c3_21b3', chapter:3,
      cast:[{ id:'jin', pos:'center', expr:'serious', outfit:'home', act:'idle' }],
      speaker:'narrator',
      text:'我又走了几步，停住了。那些字还在身后亮着，没追上来，也没灭。我回过头，走回去，站到它们跟前。……行吧。躲什么呢，躲了这么多次，哪一次是真的躲过去了。',
      next:'c3_22' },

    /* —— 分支三：念出声 —— */
    { id:'c3_21c', chapter:3,
      cast:[{ id:'jin', pos:'center', expr:'panic', outfit:'home', act:'idle' }],
      speaker:'narrator',
      text:'我清了清嗓子，把第一行念了出来。声音比我想的小，念到一半就断了，房间里只有风扇在转。',
      next:'c3_21c2' },

    { id:'c3_21c2', chapter:3,
      cast:[{ id:'jin', pos:'center', expr:'awkward', outfit:'home', act:'idle' }],
      speaker:'narrator',
      text:'我又从头念了一遍，这次没断。三行念完，我发现自己在对着一个没有人的麦说话——可她写这些话的时候，大概也是这样对着空气写的。',
      next:'c3_21c3' },

    { id:'c3_21c3', chapter:3,
      cast:[{ id:'jin', pos:'center', expr:'guilty', outfit:'home', act:'idle' }],
      speaker:'inner',
      text:'最后一句我没敢念完，声音自己就低下去了。……就这样吧，说给自己听也算说过了。可我心里清楚，我刚才其实是想说给她听的。',
      next:'c3_22' },

    { id:'c3_22', chapter:3, beat:'pulse',
      cast:[{ id:'jin', pos:'center', expr:'moved', outfit:'home', act:'idle' }],
      speaker:'narrator',
      text:'雾里的字开始往下走了。不快，一行接着一行，像是有人在那头一句一句地念。第一行：「我们第一次一起玩排位。你紧张得连麦都不敢开，赢了以后又装作很淡定。」',
      next:'c3_23' },

    { id:'c3_23', chapter:3, ambience:'keyboard',
      cast:[{ id:'jin', pos:'center', expr:'moved', outfit:'home', act:'idle' }],
      speaker:'narrator',
      text:'第二行：「你说你的朋友那天有事来不了。来不来，所以想和我玩林中童话。」',
      next:'c3_25' },

    { id:'c3_25', chapter:3,
      cast:[{ id:'jin', pos:'center', expr:'awkward', outfit:'home', act:'idle' }],
      speaker:'jin',
      text:'……被看穿了。',
      next:'c3_23b' },

    /* —— 回环：站得远、看得浅，这一行照样会回来找他 —— */
    { id:'c3_23b', chapter:3, beat:'calm',
      condition:{ flags:['f_map_avoided'] }, else:'c3_23b2',
      cast:[{ id:'jin', pos:'center', expr:'moved', outfit:'home', act:'idle' }],
      speaker:'inner',
      text:'……这行我刚才没敢细看。雾里飘过去的时候我只抓到半截，剩下的是我自己补的。现在它一字不差地摆在这儿，我倒不敢往下读了。',
      next:'c3_27' },

    { id:'c3_23b2', chapter:3, beat:'calm',
      cast:[{ id:'jin', pos:'center', expr:'moved', outfit:'home', act:'idle' }],
      speaker:'inner',
      text:'奇怪。这些字像是早就认得我。它们一行一行按顺序浮下来，我还是一个字一个字读了下去。……大概就得是这个顺序，才算是她真正想说的。',
      next:'c3_27' },

    { id:'c3_27', chapter:3,
      cast:[{ id:'jin', pos:'center', expr:'moved', outfit:'home', act:'idle' }],
      speaker:'narrator',
      text:'第三行写得最长，字也最用力：「你总说我们是好朋友。你说我们也会接纳你。你说了好多遍，我都记着。」',
      next:'c3_28' },

    { id:'c3_28', chapter:3, effects:{ affection:3, trust:3, flags:{ f_friend_words:true } },
      cast:[{ id:'jin', pos:'center', expr:'moved', outfit:'home', act:'idle' }],
      speaker:'inner',
      text:'那句话是我们四个人还在的时候，她在麦里对我说的。她说得那么随意，我却靠着那句话留了下来。',
      next:'c3_29' },

    { id:'c3_29', chapter:3,
      cast:[{ id:'jin', pos:'center', expr:'moved', outfit:'home', act:'idle' }],
      speaker:'narrator',
      text:'第四行：「你第一次在麦里笑出声。你说那是你咳嗽。我录下来了，不删。」',
      next:'c3_30' },

    { id:'c3_30', chapter:3, effects:{ affection:5, trust:2 },
      cast:[{ id:'jin', pos:'center', expr:'shy', outfit:'home', act:'idle' }],
      speaker:'inner',
      text:'我想起来了。那天她学那个游戏里的怪叫，我没忍住。笑完我立刻说「我咳嗽」，她就「哦」了一声。原来她根本没信。',
      next:'c3_31' },

    { id:'c3_31', chapter:3, effects:{ affection:5, trust:3 },
      cast:[{ id:'jin', pos:'center', expr:'surprised', outfit:'home', act:'idle' }],
      speaker:'narrator',
      text:'第五行：「你随口说你老家那边冬天有一种烤橘子。我查过了，网上买得到。」',
      next:'c3_32' },

    { id:'c3_32', chapter:3,
      cast:[{ id:'jin', pos:'center', expr:'cry', outfit:'home', act:'idle' }],
      speaker:'inner',
      text:'那句话是在等匹配的时候说的。我自己说完就忘了。她不但记住了，还去查了。',
      next:'c3_33' },

    { id:'c3_33', chapter:3, cg:'cg_birthday_map', beat:'pulse',
      transition:'slowfade',
      cast:[],
      speaker:'narrator',
      text:'夜雾从地图边缘漫上来，把那几行字一行一行照亮。她写的是我们，可每一句都像在替我数，我到底拥有什么。',
      next:'c3_34' },

    { id:'c3_34', chapter:3, effects:{ flags:{ f_cried_map:true } },
      cast:[{ id:'jin', pos:'center', expr:'cry', outfit:'home', act:'idle' }],
      speaker:'narrator',
      text:'我抬手抹了一下脸，手背上全是湿的。我没有出声，就是停在那里，让屏幕亮着。',
      next:'c3_35' },

    { id:'c3_35', chapter:3,
      cast:[{ id:'jin', pos:'center', expr:'cry', outfit:'home', act:'idle' }],
      speaker:'inner',
      text:'我这才明白，她三天里反复问的，不是「你有没有空」。她是在确认，这个位置到底有没有人坐。',
      next:'c3_43' },

    { id:'c3_43', chapter:3,
      cast:[{ id:'jin', pos:'center', expr:'cry', outfit:'home', act:'idle' }],
      speaker:'narrator',
      text:'我抹了一把脸，把手从键盘上拿开。房间里只剩主机的风扇声，语音列表那一栏，还是空的。',
      next:'c3_44' },

    { id:'c3_44', chapter:3, effects:{ courage:-2 },
      cast:[{ id:'jin', pos:'center', expr:'blank', outfit:'home', act:'sit' }],
      speaker:'inner',
      text:'屏幕上的时间一格一格往前爬。我想给她发消息，手停在输入框上，没按下去——怕她那边正忙，怕自己问得不是时候，怕显得我一直在等。我就那么坐着，地图没有关，对话框也没有关，两样东西一起亮在屏幕上。还有几分钟就零点了。',
      next:'c3_45' },

    /* ==========================================================
     *  五、00:00 她们回来，一起喊生日快乐
     * ========================================================== */

    { id:'c3_45', chapter:3, sfx:'sfx_ding', bgm:'bgm_hope', beat:'swell',
      ambience:'night', transition:'flash',
      cast:[{ id:'ya', pos:'left', expr:'laugh', outfit:'casual', act:'idle' },
            { id:'jin', pos:'right', expr:'surprised', outfit:'home', act:'sit' }],
      speaker:'narrator',
      text:'零点整，语音列表忽然亮起来。四个头像同时亮起来，耳机里炸开一片声音——她们一起喊：「生日快乐！」',
      next:'c3_46' },

    { id:'c3_46', chapter:3, cg:'cg_zero_clock',
      cast:[],
      speaker:'narrator',
      text:'屏幕右下角的时间跳到 00:00。地图那一头，她举着一块写着我名字的小牌子，字写得歪歪的。',
      next:'c3_47' },

    { id:'c3_47', chapter:3, effects:{ affection:8, trust:5, flags:{ f_zero_wish:true } },
      cast:[{ id:'ya', pos:'left', expr:'laugh', outfit:'casual', act:'idle' },
            { id:'jin', pos:'right', expr:'laugh', outfit:'home', act:'sit' }],
      speaker:'ya',
      text:'生日快乐！我掐着表的，你刚才以为我真网卡了吧？',
      next:'c3_48' },

    { id:'c3_48', chapter:3,
      cast:[{ id:'ya', pos:'left', expr:'proud', outfit:'casual', act:'idle' },
            { id:'jin', pos:'right', expr:'moved', outfit:'home', act:'sit' }],
      speaker:'jin',
      text:'……你刚才那句话说得很急。我以为你真掉线了。',
      next:'c3_49' },

    { id:'c3_49', chapter:3,
      cast:[{ id:'ya', pos:'left', expr:'tease', outfit:'casual', act:'idle' },
            { id:'jin', pos:'right', expr:'laugh', outfit:'home', act:'sit' }],
      speaker:'ya',
      text:'急一点才像真的嘛。你这个人，太聪明反倒不好骗。',
      next:'c3_50' },

    { id:'c3_50', chapter:3,
      cast:[{ id:'ya', pos:'left', expr:'smile', outfit:'casual', act:'idle' },
            { id:'jin', pos:'right', expr:'moved', outfit:'home', act:'sit' }],
      speaker:'narrator',
      text:'宅和桥在麦里笑作一团。她那边键盘敲得噼里啪啦，像是急着在屏幕上摆点什么。',
      next:'c3_51' },

    { id:'c3_51', chapter:3, effects:{ affection:3 },
      cast:[{ id:'ya', pos:'left', expr:'proud', outfit:'casual', act:'idle' },
            { id:'jin', pos:'right', expr:'laugh', outfit:'home', act:'sit' }],
      speaker:'ya',
      text:'快许愿。快点，我数三下，不许多想。',
      next:'c3_52' },

    { id:'c3_52', chapter:3,
      cast:[{ id:'ya', pos:'left', expr:'proud', outfit:'casual', act:'idle' },
            { id:'jin', pos:'right', expr:'moved', outfit:'home', act:'sit' }],
      speaker:'inner',
      text:'愿望这种东西我从来不信。可她把麦让给了我，等着我说点什么——这一回，我不想敷衍。',
      choices:[
        { text:'对着麦说：「第一个愿望……我想许给你们。」', next:'c3_52a',
          effects:{ affection:4, trust:3, courage:3 }, hint:'（说出来有点肉麻，可我现在是真的这么想）' },
        { text:'什么都没说。闭上眼，认真许了一个。', next:'c3_52b',
          effects:{ courage:2, trust:2 }, hint:'（我许的那个愿，暂时不能说）' }
      ] },

    { id:'c3_52a', chapter:3,
      cast:[{ id:'ya', pos:'left', expr:'shy', outfit:'casual', act:'idle' },
            { id:'jin', pos:'right', expr:'shy', outfit:'home', act:'sit' }],
      speaker:'ya',
      text:'……哪有人把愿望说出来的呀。说出来就不灵了。',
      next:'c3_52a2' },

    { id:'c3_52a2', chapter:3,
      cast:[{ id:'ya', pos:'left', expr:'blush', outfit:'casual', act:'idle' },
            { id:'jin', pos:'right', expr:'smile', outfit:'home', act:'sit' }],
      speaker:'inner',
      text:'她说完就去看别的地方了。麦里安静了两秒，那两秒比任何一句回答都响。',
      next:'c3_53' },

    { id:'c3_52b', chapter:3,
      cast:[{ id:'ya', pos:'left', expr:'tease', outfit:'casual', act:'idle' },
            { id:'jin', pos:'right', expr:'shy', outfit:'home', act:'sit' }],
      speaker:'ya',
      text:'哟，还挺认真。许得这么慢，是不是又在心里写小作文。',
      next:'c3_52b2' },

    { id:'c3_52b2', chapter:3,
      cast:[{ id:'ya', pos:'left', expr:'smile', outfit:'casual', act:'idle' },
            { id:'jin', pos:'right', expr:'shy', outfit:'home', act:'sit' }],
      speaker:'inner',
      text:'她猜得没错。那个愿望里有很多人，其中一个名字，我自己都没敢念出来。',
      next:'c3_53' },

    { id:'c3_53', chapter:3, transition:'slowfade',
      cast:[{ id:'ya', pos:'left', expr:'smile', outfit:'casual', act:'idle' },
            { id:'jin', pos:'right', expr:'smile', outfit:'home', act:'sit' }],
      speaker:'narrator',
      text:'零点二十分，宅和桥先后说困了。一个说要去洗头，一个说明早八点的课。麦里最后剩两个人的呼吸声。',
      next:'c3_54' },

    { id:'c3_54', chapter:3,
      cast:[{ id:'ya', pos:'left', expr:'shy', outfit:'casual', act:'idle' },
            { id:'jin', pos:'right', expr:'neutral', outfit:'home', act:'sit' }],
      speaker:'ya',
      text:'……那我也先下去了。你早点睡呀。',
      next:'c3_55' },

    { id:'c3_55', chapter:3, bgm:'bgm_quiet', transition:'fade',
      cast:[{ id:'ya', pos:'left', expr:'smile', outfit:'casual', act:'idle' },
            { id:'jin', pos:'right', expr:'blank', outfit:'home', act:'sit' }],
      speaker:'narrator',
      text:'她下线的方式和平时没有区别。我那句「嗯，你也早点睡」堵在喉咙里，没来得及说出口。语音空了以后，我盯着那张还没撤掉的地图，看了很久。',
      next:'c3_56' },

    { id:'c3_56', chapter:3, sfx:'sfx_msg',
      cast:[{ id:'jin', pos:'center', expr:'surprised', outfit:'home', act:'sit' }],
      speaker:'inner',
      text:'零点三十四分，手机亮了。是她单独发来的。我盯着那行提示看了两秒，才伸手去点。',
      next:'c3_57' },

    /* ==========================================================
     *  六、§8.1 凌晨私聊（逐字复现，含时间戳）
     * ========================================================== */

    { id:'c3_57', chapter:3,
      cast:[{ id:'jin', pos:'center', expr:'blank', outfit:'home', act:'sit' }],
      speaker:'inner',
      text:'麦里刚说完「早点睡」，人却跑到私聊里来了。她一向这样，从不按自己定的规矩走。',
      next:'c3_28_1' },

    { id:'c3_28_1', chapter:3, titlecard:'2025 · 09 · 27  00:34',
      transition:'slowfade',
      cast:[],
      speaker:'inner',
      text:'我把耳机摘了一只，留着另一只。房间里只有主机的风扇声。',
      next:'c3_chat_1' },

    /* —— 第 1 段：00:34–00:44 —— */
    { id:'c3_chat_1', chapter:3, chat:[
        { from:'ya',  text:'这下不用害怕了', time:'00:34:07' },
        { from:'jin', text:'狡猾', time:'00:38:41' },
        { from:'ya',  text:'偶尔骗一下人确实很好玩嘛', time:'00:40:38' },
        { from:'jin', text:'你心不会痛么', time:'00:41:35' },
        { from:'jin', text:'不单纯，也不老实', time:'00:41:52' },
        { from:'ya',  text:'怎么不说是自己不聪明', time:'00:42:36' },
        { from:'ya',  text:'竟然以为只是我一个人吗', time:'00:43:05' },
        { from:'jin', text:'因为你最不老实', time:'00:43:24' },
        { from:'ya',  text:'那就不老实吧', time:'00:43:45' },
        { from:'jin', text:'反派', time:'00:44:30' },
        { from:'ya',  text:'那你是主角', time:'00:44:43' }
      ],
      next:'c3_28_2' },

    { id:'c3_28_2', chapter:3,
      cast:[{ id:'jin', pos:'center', expr:'smile', outfit:'home', act:'sit' }],
      speaker:'inner',
      text:'「那你是主角」。这句话要是别人说，我大概只会当成玩笑。偏偏是她说的，我盯着这四个字看了半分钟。',
      next:'c3_28_3' },

    { id:'c3_28_3', chapter:3,
      cast:[{ id:'jin', pos:'center', expr:'shy', outfit:'home', act:'sit' }],
      speaker:'inner',
      text:'嘴上我在挑她的毛病，说她心不痛、说她是反派。心里那句其实是：原来你早就想好了，只是没告诉我。',
      next:'c3_chat_2' },

    /* —— 第 2 段：01:30–01:36 —— */
    { id:'c3_chat_2', chapter:3, chat:[
        { from:'jin', text:'你这个文案太犯规了', time:'01:30:23' },
        { from:'jin', text:'我要去举报', time:'01:30:29' },
        { from:'ya',  text:'怎么了', time:'01:30:31' },
        { from:'ya',  text:'那你举报吧', time:'01:30:35' },
        { from:'ya',  text:'反正等我今天睡醒这个地图就下架了', time:'01:30:43' },
        { from:'jin', text:'哈哈哈', time:'01:31:06' },
        { from:'jin', text:'你自己都不敢留着呢', time:'01:31:18' },
        { from:'jin', text:'还敢这么写文案', time:'01:31:23' },
        { from:'ya',  text:'没有啊', time:'01:31:27' },
        { from:'ya',  text:'是因为会有其他人进来', time:'01:31:37' },
        { from:'ya',  text:'文案怎么了', time:'01:31:43' },
        { from:'jin', text:'没事呀', time:'01:31:49' },
        { from:'jin', text:'那你小崔不就成大明星了', time:'01:31:58' },
        { from:'ya',  text:'他们又不是你', time:'01:32:13' },
        { from:'jin', text:'哇塞', time:'01:32:35' },
        { from:'jin', text:'幸好我有心理预期', time:'01:33:07' },
        { from:'jin', text:'要不然就真破了', time:'01:33:20' },
        { from:'ya',  text:'你的心理预期不是这个吧', time:'01:33:25' },
        { from:'jin', text:'这不是早就料到了', time:'01:34:39' },
        { from:'jin', text:'但是没想到你这么厉害', time:'01:34:45' },
        { from:'jin', text:'刮目相看了', time:'01:35:21' },
        { from:'ya',  text:'那很好了', time:'01:35:41' },
        { from:'ya',  text:'我不是呆瓜了', time:'01:35:46' },
        { from:'jin', text:'我是呆瓜，我是群里唯一呆瓜', time:'01:36:01' },
        { from:'ya',  text:'呆瓜', time:'01:36:19' }
      ],
      next:'c3_28_4' },

    { id:'c3_28_4', chapter:3,
      cast:[{ id:'jin', pos:'center', expr:'laugh', outfit:'home', act:'sit' }],
      speaker:'inner',
      text:'「他们又不是你」——我把这句来回看了三遍。我知道自己该随便答一句把话头绕过去，可我打字的手停在那儿了。',
      next:'c3_28_5' },

    { id:'c3_28_5', chapter:3,
      cast:[{ id:'jin', pos:'center', expr:'awkward', outfit:'home', act:'sit' }],
      speaker:'inner',
      text:'她说那地图天亮就下架。也就是说，那一整片写给我们的东西，只打算活到今天早上。',
      next:'c3_chat_3' },

    /* —— 第 3 段：01:37–01:47 —— */
    { id:'c3_chat_3', chapter:3, chat:[
        { from:'jin', text:'说真的', time:'01:37:34' },
        { from:'jin', text:'你开始问我的时候我就大概知道什么个事', time:'01:37:49' },
        { from:'jin', text:'可能真的想推掉吧', time:'01:37:58' },
        { from:'ya',  text:'嗯', time:'01:38:11' },
        { from:'ya',  text:'那怎么没推', time:'01:38:15' },
        { from:'jin', text:'但是我单纯做不到啊', time:'01:38:25' },
        { from:'jin', text:'我也搞不明白', time:'01:38:29' },
        { from:'ya',  text:'为什么呀', time:'01:38:36' },
        { from:'jin', text:'嗯..', time:'01:39:12' },
        { from:'jin', text:'因为你会耍赖', time:'01:39:22' },
        { from:'jin', text:'我拿这招没办法', time:'01:39:35' },
        { from:'ya',  text:'又不是真哭', time:'01:39:58' },
        { from:'jin', text:'也可能真的害怕让你们失望吧', time:'01:40:05' },
        { from:'ya',  text:'谁来哭一下你就心软了', time:'01:40:07' },
        { from:'jin', text:'才不心软', time:'01:40:23' },
        { from:'jin', text:'以后不心软了', time:'01:40:32' },
        { from:'ya',  text:'那我哭了', time:'01:40:41' },
        { from:'ya',  text:'呜呜呜呜呜', time:'01:41:34' },
        { from:'jin', text:'我不会说啥，但是真不要哭', time:'01:41:48' },
        { from:'jin', text:'我只是觉得受宠若惊了', time:'01:42:06' },
        { from:'ya',  text:'你以为说的话都是骗你的吗', time:'01:42:54' },
        { from:'jin', text:'我不知道，我不会往哪个方面想', time:'01:43:18' },
        { from:'jin', text:'我也从没有这种经历😂', time:'01:43:39' },
        { from:'ya',  text:'那现在有了', time:'01:43:53' },
        { from:'jin', text:'是呀', time:'01:44:06' },
        { from:'jin', text:'哎可能满足不了这么多期望', time:'01:44:40' },
        { from:'jin', text:'真不要对我这么好', time:'01:44:48' },
        { from:'ya',  text:'不要有压力呀', time:'01:44:50' },
        { from:'ya',  text:'唉', time:'01:44:54' },
        { from:'ya',  text:'就知道你会这么说吧', time:'01:45:02' },
        { from:'jin', text:'平常相处就行了', time:'01:45:12' },
        { from:'jin', text:'都能感受到的', time:'01:45:28' },
        { from:'jin', text:'我第一次加你好友的时候不就说过了', time:'01:45:55' },
        { from:'jin', text:'我不太会看气氛说话的', time:'01:46:11' },
        { from:'ya',  text:'忘记了', time:'01:46:32' },
        { from:'jin', text:'整个人就很古板', time:'01:46:35' },
        { from:'jin', text:'凑凑热闹的这种', time:'01:46:44' },
        { from:'ya',  text:'你很有趣呀', time:'01:46:45' },
        { from:'jin', text:'不有趣', time:'01:47:02' },
        { from:'ya',  text:'你要质疑我的眼光吗', time:'01:47:12' },
        { from:'jin', text:'嗯…', time:'01:47:26' }
      ],
      next:'c3_28_6' },

    { id:'c3_28_6', chapter:3, effects:{ trust:4, flags:{ f_cockatiel_line:true } },
      cast:[{ id:'jin', pos:'center', expr:'panic', outfit:'home', act:'sit' }],
      speaker:'inner',
      text:'她说「那我哭了」「呜呜呜呜呜」的时候，我嘴上在讲道理，说真不要哭。其实那几秒我整个人是慌的，手都在键盘上出汗。',
      next:'c3_28_7' },

    { id:'c3_28_7', chapter:3,
      cast:[{ id:'jin', pos:'center', expr:'moved', outfit:'home', act:'sit' }],
      speaker:'inner',
      text:'我从来没有被人这样对待过。所以第一反应不是高兴，是「她会不会搞错了」。这就是我，一个连被喜欢都要先自我审查的人。',
      next:'c3_chat_4' },

    /* —— 第 4 段：01:48–01:55 —— */
    { id:'c3_chat_4', chapter:3, chat:[
        { from:'jin', text:'不做好就会自责吧', time:'01:48:32' },
        { from:'ya',  text:'没必要那么追求完美', time:'01:49:26' },
        { from:'ya',  text:'谁都有失误', time:'01:49:34' },
        { from:'jin', text:'我非常清楚这一点', time:'01:49:54' },
        { from:'jin', text:'但也真是这一点让我成为了自己，而不是别的什么人', time:'01:50:13' },
        { from:'ya',  text:'嗯', time:'01:50:31' },
        { from:'ya',  text:'那以后喊你完美哥呀（）', time:'01:50:42' },
        { from:'jin', text:'你可太能捉弄我了', time:'01:51:02' },
        { from:'ya',  text:'我没有', time:'01:51:22' },
        { from:'jin', text:'我去还有这么体贴善良聪明用心的群主', time:'01:52:11' },
        { from:'ya',  text:'干嘛啊', time:'01:52:19' },
        { from:'jin', text:'就是不太老实，其他不是完美么', time:'01:52:22' },
        { from:'ya',  text:'这个群人已经够了', time:'01:52:42' },
        { from:'ya',  text:'我找到我想要的车队了啊', time:'01:52:50' },
        { from:'jin', text:'已经钦定成车队的一员了嘛', time:'01:54:21' },
        { from:'ya',  text:'对呀', time:'01:54:34' },
        { from:'ya',  text:'别嫌这个群主不会用飞轮', time:'01:54:42' },
        { from:'jin', text:'关键是我还是不懂为什么是我', time:'01:54:47' },
        { from:'jin', text:'这很奇怪呀', time:'01:54:54' },
        { from:'ya',  text:'为什么是你', time:'01:55:07' },
        { from:'ya',  text:'因为看上你了', time:'01:55:22' }
      ],
      next:'c3_28_8' },

    { id:'c3_28_8', chapter:3, zoom:'face', transition:'slowfade', beat:'swell',
      cg:'cg_chat_confess', sfx:'sfx_heart',
      cast:[],
      speaker:'inner',
      text:'「因为看上你了」——就这么一句，两秒之内读完，我却像被人从椅子上提起来又慢慢放下，耳边一直是自己的心跳。',
      next:'c3_28_9' },

    { id:'c3_28_9', chapter:3,
      cast:[{ id:'jin', pos:'center', expr:'panic', outfit:'home', act:'sit' }],
      speaker:'inner',
      text:'对话框里光标在闪。我可以说点别的，把这句话轻轻放过——就像我以前每一次那样。',
      choices:[
        { text:'装傻：「……看上我这个人吗？那确实。」', next:'c3_28_9a',
          effects:{ affection:2, courage:-2 }, hint:'（把这句话当成玩笑，就还能装作什么都没发生）' },
        { text:'认真问：「……你是认真的吗。」', next:'c3_28_9b',
          effects:{ trust:5, courage:3 }, hint:'（我不想在一句玩笑里错过一句真话）' },
        { text:'直接说：「……我也是。」', next:'c3_28_9c',
          effects:{ affection:6, trust:4, courage:6 }, hint:'（手指按下去之前，我在键盘上停了三秒）' }
      ] },

    { id:'c3_28_9a', chapter:3,
      cast:[{ id:'ya', pos:'left', expr:'tease', outfit:'casual', act:'idle' },
            { id:'jin', pos:'right', expr:'awkward', outfit:'home', act:'sit' }],
      speaker:'ya',
      text:'……你这个人。行吧，那就当是吧。',
      next:'c3_28_9a2' },

    { id:'c3_28_9a2', chapter:3,
      cast:[{ id:'ya', pos:'left', expr:'shy', outfit:'casual', act:'idle' },
            { id:'jin', pos:'right', expr:'guilty', outfit:'home', act:'sit' }],
      speaker:'inner',
      text:'她顺着我的玩笑滑下去了。屏幕暗下来之后我才反应过来：刚才那句，是我自己把话推开的。',
      next:'c3_28_10' },

    { id:'c3_28_9b', chapter:3,
      cast:[{ id:'ya', pos:'left', expr:'surprised', outfit:'casual', act:'idle' },
            { id:'jin', pos:'right', expr:'serious', outfit:'home', act:'sit' }],
      speaker:'ya',
      text:'……我大半夜不睡觉陪你演这一出，你觉得呢。',
      next:'c3_28_9b2' },

    { id:'c3_28_9b2', chapter:3,
      cast:[{ id:'ya', pos:'left', expr:'blush', outfit:'casual', act:'idle' },
            { id:'jin', pos:'right', expr:'shy', outfit:'home', act:'sit' }],
      speaker:'inner',
      text:'她没有再开玩笑。我盯着这行字，看见自己心里那扇一直虚掩的门，被轻轻推开了一条缝。',
      next:'c3_28_10' },

    { id:'c3_28_9c', chapter:3,
      cast:[{ id:'ya', pos:'left', expr:'surprised', outfit:'casual', act:'idle' },
            { id:'jin', pos:'right', expr:'panic', outfit:'home', act:'sit' }],
      speaker:'ya',
      text:'……你倒是回得很快。',
      next:'c3_28_9c2' },

    { id:'c3_28_9c2', chapter:3, effects:{ flags:{ f_cockatiel_line:true } },
      cast:[{ id:'ya', pos:'left', expr:'blush', outfit:'casual', act:'idle' },
            { id:'jin', pos:'right', expr:'shy', outfit:'home', act:'sit' }],
      speaker:'inner',
      text:'发出去以后我才开始怕。可她已经回消息了，字比平时小一号，还打错了两个字——她慌了。',
      next:'c3_28_9c3' },

    { id:'c3_28_9c3', chapter:3, beat:'calm',
      cast:[{ id:'jin', pos:'center', expr:'moved', outfit:'home', act:'sit' }],
      speaker:'inner',
      text:'我把手机举起来，对着那行「因为看上你了」看了一会儿。这一天该记一下——2025 年 9 月 27 日，凌晨。',
      next:'c3_28_10' },

    { id:'c3_28_10', chapter:3, bgm:'bgm_quiet', transition:'fade',
      titlecard:'2025 · 09 · 27',
      cast:[{ id:'ya', pos:'left', expr:'shy', outfit:'casual', act:'idle' },
            { id:'jin', pos:'right', expr:'shy', outfit:'home', act:'sit' }],
      speaker:'narrator',
      text:'那天晚上我们一直聊到很晚，说的都是很小的事。她先说了晚安，那句晚安后面跟了一个句号。',
      next:'c3_28_10b' },

    { id:'c3_28_10b', chapter:3,
      cast:[{ id:'jin', pos:'center', expr:'blank', outfit:'home', act:'sit' }],
      speaker:'inner',
      text:'我本来该关电脑了，可对话框还开着，我也没动。她那边也一直亮着。两个人就这么耗着，谁都没先走。',
      next:'c3_confess_game' },

,

    /* ── 互动：她让他"表白"，他偏要她拒绝；这一段的最后一击是玩家自己敲出来的 ──
       confessGame 由 src/ui.js 渲染（不是普通 choices，选项 2/3 会被"躲开"而不是被选中）：
         · 点"我喜欢你"→ 往她那句上追加一个"我喜欢你"，需要攒够 target 个
         · 点另外两个 → 按钮躲开鼠标，躲 dart 次后消失（永远选不中）
         · 攒够 → 画面暗 blackout 毫秒 → 显示 reveal 那条消息 + sfx → 继续 next
       字段形状固定为 { prompt, word, target, dart, blackout, sfx, reveal:{from,time,text} } */
    {
      id:'c3_confess_game', chapter:3,
      bgm:'bgm_quiet', beat:'calm',
      cast:[{ id:'jin', pos:'center', expr:'shy', outfit:'home', act:'sit' }],
      chat:[
        { from:'jin', time:'02:35:00', text:'你不许表白行嘛' },
        { from:'ya', time:'02:35:06', text:'哦' },
        { from:'jin', time:'02:35:14', text:'你换我来' },
        { from:'jin', time:'02:35:20', text:'然后拒绝我就行了' },
        { from:'ya', time:'02:35:20', text:'行' },
        { from:'jin', time:'02:35:41', text:'必须要拒绝我哦' },
        { from:'jin', time:'02:36:43', text:'我喜欢你哦' },
        { from:'ya', time:'02:36:55', text:'憋了半天就这么一句话' },
        { from:'ya', time:'02:37:07', text:'嗯我也是' },
        { from:'ya', time:'02:38:25', text:'我说我也喜欢你' },
        { from:'jin', time:'02:38:35', text:'这是在？我要你拒绝我呀' },
        { from:'ya', time:'02:38:57', text:'为什么我要答应你' },
        { from:'jin', time:'02:39:56', text:'因为也许你只是想感化我的心情多一点呢' },
        { from:'ya', time:'02:40:27', text:'其实你就是我的理想型呀' },
        { from:'ya', time:'02:40:30', text:'你能明白吗' },
        { from:'jin', time:'02:41:31', text:'有人会喜欢一个不会说话不懂气氛的呆瓜？我明白不了' },
        { from:'jin', time:'02:41:52', text:'无论我现实是不是这样，网络上就是这个形象' },
        { from:'ya', time:'02:42:03', text:'那不是很可爱吗' },
        { from:'jin', time:'02:43:36', text:'可是对你来说这真的好么..' },
        { from:'ya', time:'02:44:20', text:'你好烦呀你想让我说几遍' },
        { from:'jin', time:'02:44:33', text:'不许说了' },
        { from:'jin', time:'02:44:52', text:'至少要有一个人先保持理智' },
        { from:'jin', time:'02:45:01', text:'再说我就不行了' }
      ],
      confessGame:{
        prompt:'她的头像一直亮着。',
        word:'我喜欢你',
        target:15,
        dart:{ count:3 },
        blackout:2600,
        sfx:'sfx_ding',
        reveal:{ from:'ya', time:'02:45:24', text:'我喜欢你我喜欢你我喜欢你我喜欢你我喜欢你我喜欢你我喜欢你我喜欢你我喜欢你我喜欢你我喜欢你我喜欢你我喜欢你我喜欢你我喜欢你' }
      },
      next:'c3_chat_5'
    },

    ,

        { id:'c3_chat_5', chapter:3, titlecard:'2025 · 09 · 27  凌晨四点',
      chatTitle:'与 Cockatiel. 的私聊',
      chat:[
        { from:'ya',  text:'你好呀，我是交大动物科学24级的崔敬雅，以后还请多多关照啦', time:'04:14:48' },
        { from:'jin', text:'我是交大致远数学21级的金泽民，多多关照', time:'04:16:28' }
      ],
      next:'c3_28_10d' },

    { id:'c3_28_10d', chapter:3,
      cast:[{ id:'jin', pos:'center', expr:'soft', outfit:'home', act:'sit' }],
      speaker:'inner',
      text:'小崔。羊羊金。我把这两个名字念了一遍。刚才最要紧的话都说完了，两个人反倒规规矩矩做起了自我介绍，连学院和年级都报上。我对着屏幕笑了一下。挺傻的。可我一直没舍得关。',
      next:'c3_28_11' },

    { id:'c3_28_11', chapter:3,
      cast:[{ id:'jin', pos:'center', expr:'soft', outfit:'home', act:'sit' }],
      speaker:'inner',
      text:'我关掉电脑，把窗帘拉开一条缝。天还没亮，但已经不是最黑的那一段了。',
      next:'c3_28_end' },

    { id:'c3_28_end', chapter:3, transition:'slowfade',
      cast:[],
      speaker:'narrator',
      text:'第三章 · 完',
      next:'c4_01' }
  ]);
})();
