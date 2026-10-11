/* 《你好！一周年》序章 · 一个无聊的人（2025.06 之前）—— 剧本组 A
 * 起点 c0_01，末节点 next → c1_01
 * 场景：dorm / forum   音乐：bgm_quiet → bgm_warm
 */
(function () {
  'use strict';
  YJ.story.add([

    /* ---------- dorm · 夜里 · 一个人的日常 ---------- */
    { id:'c0_01', chapter:0, scene:'dorm', tint:'night', bgm:'bgm_quiet', ambience:'keyboard',
      cast:[{ id:'jin', pos:'center', expr:'blank', outfit:'home', act:'sit' }],
      speaker:'narrator',
      text:'宿舍的灯管坏了一根，剩下那根也在闪。六月末的晚上，空调外机在窗外嗡嗡地响，跟谁在替这间屋子喘气似的。',
      next:'c0_02' },

    { id:'c0_02', chapter:0,
      cast:[{ id:'jin', pos:'center', expr:'neutral', outfit:'home', act:'sit' }],
      speaker:'inner',
      text:'我叫羊羊金，一米八三，站在人群里挺显眼，可我总想往最后一排缩。这一年又快过完了……我想不起来有哪一天是特别的。真的，一天都想不起来。',
      next:'c0_03' },

    { id:'c0_03', chapter:0,
      cast:[{ id:'jin', pos:'center', expr:'blank', outfit:'home', act:'sit' }],
      speaker:'narrator',
      text:'下午四点，宿舍里就剩我一个了。三个室友，一个去打球，一个去约会，一个去自习。门带上的那一声很轻——轻得像是怕吵到我。',
      next:'c0_04' },

    { id:'c0_04', chapter:0,
      cast:[{ id:'jin', pos:'center', expr:'neutral', outfit:'home', act:'sit' }],
      speaker:'jin', text:'你们去吧。我不饿。……别管我。',
      next:'c0_05' },

    { id:'c0_05', chapter:0,
      cast:[{ id:'jin', pos:'center', expr:'awkward', outfit:'home', act:'sit' }],
      speaker:'narrator',
      text:'室友在门口停了两秒。他说，你活得像个中年人。说完他自己先笑了，拖鞋拍着地板，一路拍远了。',
      next:'c0_06' },

    { id:'c0_06', chapter:0, beat:'calm',
      cast:[{ id:'jin', pos:'center', expr:'blank', outfit:'home', act:'sit' }],
      speaker:'inner',
      text:'中年人。我二十三，作息比楼下保安还规律：中午起，凌晨睡，中间全是游戏、外卖和课表。他也没说错。我盯着那扇门看了两秒，才把视线挪回屏幕。胸口还是空了一下。就那么一下。',
      next:'c0_07' },

    { id:'c0_07', chapter:0, sfx:'sfx_click', ambience:'keyboard',
      cast:[{ id:'jin', pos:'center', expr:'neutral', outfit:'home', act:'sit' }],
      speaker:'narrator',
      text:'屏幕右下角的时间一格一格地跳。排位匹配了四十六秒，终于跳出一局。四个人的位置，三个是陌生人。',
      next:'c0_08' },

    { id:'c0_08', chapter:0,
      cast:[{ id:'jin', pos:'center', expr:'serious', outfit:'home', act:'sit' }],
      speaker:'jin', text:'这边有人。板下等我，先别交。',
      next:'c0_09' },

    { id:'c0_09', chapter:0,
      cast:[{ id:'jin', pos:'center', expr:'blank', outfit:'home', act:'sit' }],
      speaker:'inner',
      text:'我说给谁听呢。屋里就我一个人。耳机里只有密码机的电流声，还有我自己敲键盘的声音。我清了清嗓子，又把那句话咽了回去。……也就这些了。',
      next:'c0_10' },

    { id:'c0_10', chapter:0, sfx:'sfx_click',
      cast:[{ id:'jin', pos:'center', expr:'blank', outfit:'home', act:'sit' }],
      speaker:'narrator',
      text:'一局打完，赢了。我把耳机摘下来挂在脖子上，房间里安静得能听见冰箱在响。赢了也没什么可说的。',
      next:'c0_11' },

    { id:'c0_11', chapter:0,
      cast:[{ id:'jin', pos:'center', expr:'neutral', outfit:'home', act:'sit' }],
      speaker:'narrator',
      text:'后半夜，隔壁宿舍有人在笑，笑得很响。我把耳机又戴回去了——不是嫌吵，是怕自己听清楚他们在笑什么。',
      next:'c0_12' },

    { id:'c0_12', chapter:0,
      cast:[{ id:'jin', pos:'center', expr:'guilty', outfit:'home', act:'sit' }],
      speaker:'inner',
      text:'手机里存着三十几个联系人。这个月真正给我发过消息的，是外卖、快递，还有班级群的例行通知。我数了两遍，好像多数出一个，今晚就能好受一点。就这样。',
      next:'c0_13' },

    { id:'c0_13', chapter:0, bgm:'bgm_warm', beat:'calm',
      cast:[{ id:'jin', pos:'center', expr:'soft', outfit:'home', act:'sit' }],
      speaker:'inner',
      text:'其实我不是不想有人一起玩。我只是……不知道该怎么说第一句话。我把手在膝盖上蹭了两下。也不知道说完之后，对方会不会觉得我很闷、很无趣、很不会看气氛。',
      next:'c0_14' },

    { id:'c0_14', chapter:0,
      cast:[{ id:'jin', pos:'center', expr:'blank', outfit:'home', act:'sit' }],
      speaker:'narrator',
      text:'两点十二分，游戏关掉了。手指空得慌，就去点那个每天都会点开、却从来不发帖的学校论坛。',
      next:'c0_15' },

    /* ---------- forum · 那条帖子 ---------- */
    { id:'c0_15', chapter:0, scene:'forum', tint:'night', transition:'fade', ambience:'keyboard',
      cast:[{ id:'jin', pos:'center', expr:'blank', outfit:'home', act:'sit' }],
      speaker:'narrator',
      text:'深色的网页界面，冷白的字。最上面一行是新帖，标题很短，末尾挂着一个我没见过的名字。',
      next:'c0_16' },

    { id:'c0_16', chatStyle:'forum', chapter:0,
      cast:[{ id:'jin', pos:'center', expr:'neutral', outfit:'home', act:'sit' }],
      speaker:'narrator',
      chatTitle:'学校论坛 · 那条帖子',
      chat:[
        { from:'ya', name:'西川路第一粽子', text:'【第五人格】想找几个人一起玩，最好是能长期的那种', time:'21:14' },
        { from:'ya', name:'西川路第一粽子', text:'我很菜的，排位不敢一个人打。', time:'21:14' },
        { from:'ya', name:'西川路第一粽子', text:'平时晚上在线，不太会指挥，但会认真打。', time:'21:15' },
        { from:'ya', name:'西川路第一粽子', text:'要是有人愿意一起，就在下面回我吧。', time:'21:15' },
        { from:'narrator', name:'论坛路人', text:'我也想玩但我更菜（', time:'21:31' }
      ],
      next:'c0_17' },

    { id:'c0_17', chapter:0, cg:'cg_forum', transition:'slowfade',
      cast:[{ id:'jin', pos:'center', expr:'surprised', outfit:'home', act:'sit' }],
      speaker:'inner',
      text:'那条帖子从头看到尾，我又倒回去看了一遍。屏幕的光打在脸上，凉凉的。发帖人那一栏写着六个字，西川路第一粽子。我小声念了一遍，记住了。念完自己都愣了一下。',
      next:'c0_18' },

    { id:'c0_18', chapter:0,
      cast:[{ id:'jin', pos:'center', expr:'neutral', outfit:'home', act:'sit' }],
      speaker:'narrator',
      text:'帖子最下面有一个回复框，光标在里面一闪一闪。我把鼠标移过去，手指停在触控板上——没按下去。',
      next:'c0_19' },

    { id:'c0_19', chapter:0, beat:'pulse',
      cast:[{ id:'jin', pos:'center', expr:'awkward', outfit:'home', act:'sit' }],
      speaker:'inner',
      text:'回了要说什么呢。说我玩得不差？说我一个人打了很久？听着都像在推销自己。可只回一句，又显得敷衍。其实我最想回的只有两个字：我在。……不行，太怪了。我就连「想找人一起玩」这几个字，都不敢承认。',
      next:'c0_20' },

    { id:'c0_20', chapter:0,
      cast:[{ id:'jin', pos:'center', expr:'blank', outfit:'home', act:'sit' }],
      speaker:'inner',
      text:'光标还在闪。就这么放着，还是动一下手——好像哪一种，我都只敢做到一半。其实我也想在每天八点半的时候，有人喊我一声。',
      choices:[
        { text:'……先点开吧。滚到最下面，把回复框点出来，写不写再说。',
          hint:'（回什么还没想好，但手已经先动了）',
          effects:{ courage:2 }, next:'c0_21a' },
        { text:'现在就把那句话打上去——两个字，我在。打完就发，不删了。',
          hint:'（这句话我在心里说了整晚，今晚我不想再咽回去）',
          effects:{ courage:2, trust:2 }, next:'c0_21b' },
        { text:'先收进收藏夹吧——明天再说嘛。',
          hint:'（明天大概也不敢，我太清楚自己了）',
          effects:{}, next:'c0_21c' }
      ] },

    { id:'c0_21a', chapter:0,
      cast:[{ id:'jin', pos:'center', expr:'awkward', outfit:'home', act:'sit' }],
      speaker:'narrator',
      text:'回复框弹出来了。我打了半行字，删掉；又打了一行，再删掉。最后那个框还是空的，光标一个人在里面眨眼。',
      next:'c0_22' },

    { id:'c0_21b', chapter:0,
      cast:[{ id:'jin', pos:'center', expr:'blank', outfit:'home', act:'sit' }],
      speaker:'narrator',
      text:'按下去的那一下，心跳得比键盘响。回复框里就那两个字，我在。我盯着它看了三秒，还是按了发送。然后把电脑合上，躺回床上。手机在枕头边亮了一下，我又爬了起来，摸黑把电脑打开。屏幕亮起来的那一瞬间，我竟然松了一口气。',
      next:'c0_22' },

    { id:'c0_21c', chapter:0,
      cast:[{ id:'jin', pos:'center', expr:'neutral', outfit:'home', act:'sit' }],
      speaker:'narrator',
      text:'收藏夹里多了一条。第二天我没点开，第三天也没有。到第四天深夜，我又把它翻了出来——那条帖子还在，还没有被删掉。',
      next:'c0_22' },

    { id:'c0_22', chapter:0, bgm:'bgm_quiet', beat:'calm',
      cast:[{ id:'jin', pos:'center', expr:'blank', outfit:'home', act:'sit' }],
      speaker:'inner',
      text:'明天。就明天吧。……这句话我对自己说过很多次了，说完就关灯。灯灭了，我又把手机摸出来，看了一眼那条帖子还在不在。',
      next:'c0_23' },

    { id:'c0_23', chapter:0, transition:'slowfade',
      cast:[{ id:'jin', pos:'center', expr:'sleepy', outfit:'home', act:'sit' }],
      speaker:'narrator',
      text:'宿舍很静。窗外有辆车开过去，光扫过天花板，又没了。我躺下的时候还在想那句"找几个人一起玩"，像有人在很远的地方，替我把一句话说完了。',
      next:'c1_01' }

  ]);
})();
