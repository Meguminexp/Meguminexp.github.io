/* 《你好！一周年》第四章 · 石头说的话（2025.09.28） —— 剧本组 B
 * 内容为 STORY_SPEC §8.2《石头说》说说原文，逐字照抄，只按语义断句换行。
 * 全章只用独白（无对话），仅收尾一个「保存草稿 / 发布」的选择，两个选项都继续。
 */
(function () {
  'use strict';
  YJ.story.add([

    /* ==========================================================
     *  一、09-28 的夜里，我坐在电脑前
     * ========================================================== */

    { id:'c4_01', chapter:4, scene:'dorm', tint:'night', bgm:'bgm_quiet', beat:'calm',
      ambience:'keyboard',
      cast:[{ id:'jin', pos:'center', expr:'moved', outfit:'home', act:'sit' }],
      speaker:'inner',
      text:'二十七号睡到中午，二十八号一整天都没缓过来。晚上我坐在电脑前，把那些话在脑子里翻来覆去地放。',
      next:'c4_02' },

    { id:'c4_02', chapter:4, effects:{ flags:{ f_essay_written:true } },
      cast:[{ id:'jin', pos:'center', expr:'soft', outfit:'home', act:'sit' }],
      speaker:'inner',
      text:'我不知道该怎么回她。想说的东西太多，也太笨，说出来只会变成一堆道理。于是我打开了一个空白的框，开始写别的。',
      next:'c4_03' },

    { id:'c4_03', chapter:4, scene:'starfield', beat:'calm', transition:'slowfade',
      cast:[],
      speaker:'narrator',
      text:'光标闪了很久，第一行我改了三次。最后落下来的，是一块石头在说话。',
      next:'c4_04' },

    /* ==========================================================
     *  二、《石头说》原文（逐字，按语义切分）
     * ========================================================== */

    { id:'c4_04', chapter:4, titlecard:'2025 · 09 · 28  说说',
      cg:'cg_stone_essay', transition:'slowfade', beat:'calm',
      cast:[],
      speaker:'inner',
      text:'石头说：这是我第一次，清晰地感受到自己的"存在"。',
      next:'c4_05' },

    { id:'c4_05', chapter:4,
      speaker:'inner',
      text:'在此之前，是多少个纯粹的漫长沉睡。没有光，没有暗，没有时间，"我"这个概念，却像一粒被包裹的种子，早已深埋。',
      next:'c4_06' },

    { id:'c4_06', chapter:4,
      speaker:'inner',
      text:'直到这一天，一种沉甸甸的温暖降临，我才忽然拥有了"内部"。',
      next:'c4_07' },

    { id:'c4_07', chapter:4,
      speaker:'inner',
      text:'那沉甸甸的温暖，来自一只猫，一池星星和一轮月亮。',
      next:'c4_08' },

    { id:'c4_08', chapter:4,
      speaker:'inner',
      text:'一只什么样的猫？大概仅仅是一只再普通不过的猫，两个眼睛一张嘴，一双耳朵一只尾。',
      next:'c4_09' },

    { id:'c4_09', chapter:4,
      speaker:'inner',
      text:'它在黄昏时分来到我身边，把它整个身子的重量，信任地交付给我。',
      next:'c4_10' },

    { id:'c4_10', chapter:4,
      speaker:'inner',
      text:'我感受着它胸腔里那颗小马达的震动，一种规律、温热、活着的节奏。通过这种震动，我似乎也拥有了节奏——再确凿不过的生命律动。',
      next:'c4_11' },

    { id:'c4_11', chapter:4,
      speaker:'inner',
      text:'生命在这个世界里当然是普通的，因为石头尚且能够拥有自我意识。那生命的独特又设在何处呢？',
      next:'c4_12' },

    { id:'c4_12', chapter:4,
      speaker:'inner',
      text:'稍过一会儿，它开口对我说话。用那种叽里咕噜的声音。',
      next:'c4_13' },

    { id:'c4_13', chapter:4,
      speaker:'inner',
      text:'它说："我想去造桥，之后很长一段时间都会去做。"',
      next:'c4_14' },

    { id:'c4_14', chapter:4,
      speaker:'inner',
      text:'就这一句。然后它便蜷缩起来，像是把一句话说完，便心满意足地睡去。',
      next:'c4_15' },

    { id:'c4_15', chapter:4,
      speaker:'inner',
      text:'我渐渐感受到一股暖意。毫无疑问这温暖不属于我，是它赐予我的。但在它离开后，那被身体压过的曲面，确乎残留着比别处更深的、关于温暖的记忆。',
      next:'c4_16' },

    { id:'c4_16', chapter:4,
      speaker:'inner',
      text:'"搭桥去哪里呢？"我没来及问，猫睡熟了。天几乎彻底黑透。不过在它身上或许还有一点我的影子。',
      next:'c4_17' },

    { id:'c4_17', chapter:4,
      speaker:'inner',
      text:'然后，星星来了。',
      next:'c4_18' },

    { id:'c4_18', chapter:4,
      speaker:'inner',
      text:'星星是另一种语言。它们不说话，只是亮着。每一颗，都像是一个针孔，透过它们，我仿佛能窥见宇宙背后那片无垠的光明。它们的沉默与我的沉默不同，它们的沉默是歌唱着的亿万年史诗——但更重要的，是绝对的，也是发散的。',
      next:'c4_19' },

    { id:'c4_19', chapter:4,
      speaker:'inner',
      text:'只是我听力尚浅，只能接收到这微弱的、视觉上的光波。',
      next:'c4_20' },

    { id:'c4_20', chapter:4,
      speaker:'inner',
      text:'我曾以为我和星星是一类，我们都是亘古的、近乎永恒的存在。',
      next:'c4_21' },

    { id:'c4_21', chapter:4,
      speaker:'inner',
      text:'精通浪漫者当然会说，石头、猫、星星和月亮都没有什么不同，因为在很久很久的过去，我们都来自方程与恒星。',
      next:'c4_22' },

    { id:'c4_22', chapter:4,
      speaker:'inner',
      text:'但此刻我明白了不同。星星的光，是燃烧，是消耗，是巨大的能量的倾泻。而我的存在，是凝聚，是承受，是密不透风的接纳。星星在诉说，而我，在倾听。',
      next:'c4_23' },

    { id:'c4_23', chapter:4,
      speaker:'inner',
      text:'更重要的是，我所感受到的微弱热量，实际上已然历数光年、穿刺过无数黑暗，徒留一个迟钝而愚笨的我。',
      next:'c4_24' },

    { id:'c4_24', chapter:4,
      speaker:'inner',
      text:'我选择暂时不想那么多，先静静感受这样一份独特的温暖。猫君可能也这么想吧。',
      next:'c4_25' },

    { id:'c4_25', chapter:4,
      speaker:'inner',
      text:'接着，月亮升起来了。',
      next:'c4_26' },

    { id:'c4_26', chapter:4,
      speaker:'inner',
      text:'月亮不是星星。它更近，更温柔，也更……高冷。它的光不像星光那样锐利刺人，而是一片清冷流淌；悄悄地，照亮了猫的轮廓，照亮了我身上细微的纹理，也照亮了远处沉睡的山峦。',
      next:'c4_27' },

    { id:'c4_27', chapter:4,
      speaker:'inner',
      text:'月亮离不开星星，星星也离不开月亮。',
      next:'c4_28' },

    { id:'c4_28', chapter:4,
      speaker:'inner',
      text:'月亮的温暖，是一种艺术性的温暖；我作为一块石头，当然对艺术一窍不通，但我能清楚地感受到，月亮懂得怎么帮助美。它和星星一同，在无声地阐述着对美好的希冀。',
      next:'c4_29' },

    { id:'c4_29', chapter:4,
      speaker:'inner',
      text:'但月亮多少是委婉的吧，我这么想着。是宽恕，或者原谅，在期望磨去我的一些不恰当锋利。',
      next:'c4_30' },

    { id:'c4_30', chapter:4,
      speaker:'inner',
      text:'我继续任由猫君在我身上躺着，时间没有让我立刻意识到，月亮偷偷给我搭起了一座舞台：',
      next:'c4_31' },

    { id:'c4_31', chapter:4,
      speaker:'inner',
      text:'在月华之下，我首次理解了"逝去"。猫的温暖会消散，星光会隐没，连这月光，也有阴晴圆缺。而我，似乎是被豁免的那一个。我的存在如此坚固，以至于"变化"在我身上留下的痕迹，需要以千年为单位来计算。这是一种幸运，还是一种更深的孤独？',
      next:'c4_32' },

    { id:'c4_32', chapter:4,
      speaker:'inner',
      text:'猫在梦中动了一下，爪子无意识地搭在我身上。那一瞬间，温暖、星光、月辉，以及我内部那新生的、名为"我"的意识，突然交织在了一起。',
      next:'c4_33' },

    { id:'c4_33', chapter:4,
      speaker:'inner',
      text:'那一天我存在的意义，或许就是为了在这个清冷的秋夜，成为一只猫的枕头。为了承载它毫无保留的睡眠，为了记住它传递给我的、短暂的温暖。为了在星星和月亮见证的宏大叙事里，保留一个微小而具体的坐标。这个坐标，是"大家"赋予给我的。',
      next:'c4_34' },

    { id:'c4_34', chapter:4,
      speaker:'inner',
      text:'那一瞬间，我突然意识到。',
      next:'c4_35' },

    { id:'c4_35', chapter:4, beat:'swell', transition:'slowfade',
      speaker:'inner',
      text:'猫君搭桥、可能正是想去见星星和月亮吧，也许是座友谊的石子桥。',
      next:'c4_36' },

    { id:'c4_36', chapter:4,
      speaker:'inner',
      text:'我这么记录下来。',
      next:'c4_37' },

    { id:'c4_37', chapter:4,
      speaker:'inner',
      text:'9.28',
      next:'c4_38' },

    /* ==========================================================
     *  三、收尾：保存，还是发出去
     * ========================================================== */

    { id:'c4_38', chapter:4, scene:'dorm', tint:'night', beat:'calm',
      transition:'fade',
      cast:[{ id:'jin', pos:'center', expr:'soft', outfit:'home', act:'sit' }],
      speaker:'narrator',
      text:'写完之后天已经亮过一轮又暗下去。那句话躺在输入框里，光标还在最后一行闪。',
      next:'c4_39' },

    { id:'c4_39', chapter:4,
      cast:[{ id:'jin', pos:'center', expr:'shy', outfit:'home', act:'sit' }],
      speaker:'inner',
      text:'发出去，她一定会看见。会因为一句话而多想的人是我，可这次，我想让她也看见那块石头。',
      choices:[
        { text:'先存成草稿。等我想清楚要不要让她看见。', next:'c4_39a',
          effects:{ courage:2, trust:2 }, hint:'（我还没准备好，但我不想删掉它）' },
        { text:'点发布。让她明天醒来就能看到。', next:'c4_39b',
          effects:{ courage:6, trust:3, affection:4 }, hint:'（这一回，我先把话放在那里）' }
      ] },

    { id:'c4_39a', chapter:4,
      cast:[{ id:'jin', pos:'center', expr:'soft', outfit:'home', act:'sit' }],
      speaker:'narrator',
      text:'我把草稿存进了一个只有自己知道的地方。屏幕暗下去的时候，那块石头还亮在我眼睛里。',
      next:'c4_39a2' },

    { id:'c4_39a2', chapter:4,
      cast:[{ id:'jin', pos:'center', expr:'moved', outfit:'home', act:'sit' }],
      speaker:'inner',
      text:'有些话说给谁听，其实自己心里最清楚。我只是还需要一点时间，把「说」这件事练熟。',
      next:'c4_40' },

    { id:'c4_39b', chapter:4,
      cast:[{ id:'jin', pos:'center', expr:'shy', outfit:'home', act:'sit' }],
      speaker:'narrator',
      text:'我按下了发布。刷新之后，那一段字安安静静地待在页面上，像一块真的石头落进了水里。',
      next:'c4_39b2' },

    { id:'c4_39b2', chapter:4,
      cast:[{ id:'jin', pos:'center', expr:'soft', outfit:'home', act:'sit' }],
      speaker:'inner',
      text:'两分钟后，我手机震了一下。她没有点赞，也没有转发，只发来一句：「写得很好。」',
      next:'c4_40' },

    { id:'c4_40', chapter:4, transition:'slowfade',
      cast:[{ id:'jin', pos:'center', expr:'soft', outfit:'home', act:'sit' }],
      speaker:'inner',
      text:'那晚我睡得很沉。梦里有一座很小的桥，石头搭的，一头是猫，另一头是星星和月亮。',
      next:'c5_01' }
  ]);
})();
