/* 《你好！一周年》收束 —— 作者：主程
 * c10_router 按 好感 / 信任 / 勇气 分流到三种收束（STORY_SPEC §7）。
 * 三种收束都在一起，区别只是话说到了多深。
 * 判定必须与 src/state.js 的 resolveEnding() 保持一致。
 */
(function () {
  'use strict';
  YJ.story.add([

    /* ================= 路由（唯一判定点） ================= */
    {
      id: 'c10_router', chapter: 10,
      route: [
        {
          when: { affection: { min: 70 }, trust: { min: 65 }, courage: { min: 55 } },
          next: 'end_star_01'
        },
        /* B《慢慢来》：他把话说出口了，只是更深的那部分还留在心里（勇气未满 55） */
        { when: { courage: { min: 40 } }, next: 'end_slow_01' },
        /* C《这次是我先说的》：勇气不足，他没能在她面前说出口——她替他说了 */
        { when: {}, next: 'end_she_first_01' }
      ]
    },

    /* =========================================================
     *  收束 A ·《星星的答案》
     * ========================================================= */
    {
      id: 'end_star_01', chapter: 10, scene: 'starfield', bgm: 'bgm_ending', beat: 'calm',
      cast: [{ id: 'jin', pos: 'center', expr: 'soft', outfit: 'home', act: 'look_up' }],
      speaker: 'inner',
      text: '那天晚上我睡不着。她靠在我肩上已经睡熟了，呼吸很轻，一下一下落在我袖子上。\n我想起一年多前，在那张地图上看到的第一个标记——「我们第一次一起打排位」。\n那时候我还不知道，一行游戏里的字，能让人哭成那样。\n……也想起这一年里我本来打算咽回去的那些半句话——在美甲的椅子上、在她家的沙发上、在她楼下的风里。今晚，一句都没剩下。',
      next: 'end_star_02'
    },
    {
      id: 'end_star_02', chapter: 10,
      cast: [{ id: 'jin', pos: 'center', expr: 'moved', outfit: 'home', act: 'sit' }],
      speaker: 'inner',
      text: '我以前一直觉得自己是块石头——不发光，不说话，只是待在那里。',
      next: 'end_star_03'
    },
    {
      id: 'end_star_03', chapter: 10, scene: 'hotel', tint: 'night', bgm: 'bgm_ending', beat: 'swell',
      cast: [
        { id: 'ya', pos: 'left', expr: 'sleepy', outfit: 'home', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'soft', outfit: 'home', act: 'sit' }
      ],
      speaker: 'ya',
      text: '唔……你没睡啊。\n……在想什么。',
      next: 'end_star_04'
    },
    {
      id: 'end_star_04', chapter: 10, zoom: 'face',
      cast: [
        { id: 'ya', pos: 'left', expr: 'shy', outfit: 'home', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'smile', outfit: 'home', act: 'sit' }
      ],
      speaker: 'jin',
      text: '在想你。\n……不是。\n我在想，一年前我一个人在宿舍打游戏，你在一张地图上给我写「我们也会接纳你」。那时候我以为自己只是被收留了。\n现在我知道不是。你从那天起，就在等我走到你面前来。\n我不想再让你等了。',
      next: 'end_star_05'
    },
    {
      id: 'end_star_05', chapter: 10, zoom: 'face',
      cast: [
        { id: 'ya', pos: 'left', expr: 'laugh', outfit: 'home', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'shy', outfit: 'home', act: 'sit' }
      ],
      speaker: 'ya',
      text: '……你这个人。\n去年打那句「因为看上你了」，我手心全是汗。现在我可以当着你的面再说一遍——\n因为看上你了，石头先生。',
      sfx: 'sfx_heart',
      effects: { affection: 6, trust: 6, courage: 4, flags: {} },
      next: 'end_star_06'
    },
    {
      id: 'end_star_06', chapter: 10, scene: 'starfield', cg: 'cg_end_star', cast: [],
      speaker: 'inner',
      text: '她笑了一下，眼睛都没睁开，嘴角先弯起来。\n「你好，我的男朋友。」\n我也笑了。这一年，我第一次笑得不用躲。\n她把脸往我肩上又埋了埋，鼻尖是凉的。',
      titlecard: '《星星的答案》',
      ending: 'star'
    },

    /* =========================================================
     *  收束 B ·《慢慢来》
     * ========================================================= */
    {
      id: 'end_slow_01', chapter: 10, scene: 'starfield', bgm: 'bgm_ending', beat: 'calm',
      cast: [{ id: 'jin', pos: 'center', expr: 'soft', outfit: 'home', act: 'look_up' }],
      speaker: 'inner',
      text: '那天晚上她靠在我肩上睡着的时候，我一直在想一件事。\n比如美甲那天我只说了「还行」，其实想说「我挺喜欢的」；比如在江边她说「你今天不用说什么」，我就真的只说了一半。\n剩下那半句，我到现在还攥在手里。',
      next: 'end_slow_02'
    },
    {
      id: 'end_slow_02', chapter: 10,
      cast: [{ id: 'jin', pos: 'center', expr: 'guilty', outfit: 'home', act: 'sit' }],
      speaker: 'inner',
      text: '我总觉得自己还没准备好。\n可她说「我们有的是时间」的时候，那句话不像安慰，更像一个允许——允许我慢一点，允许我笨一点。',
      next: 'end_slow_03'
    },
    {
      id: 'end_slow_03', chapter: 10, scene: 'hotel', tint: 'night', beat: 'swell',
      cast: [
        { id: 'ya', pos: 'left', expr: 'smile', outfit: 'home', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'shy', outfit: 'home', act: 'sit' }
      ],
      speaker: 'ya',
      text: '……你不用急着说完。\n我知道你心里还有一整句话，没敢往外拿。\n我不问。等你想说的那天。',
      next: 'end_slow_04'
    },
    {
      id: 'end_slow_04', chapter: 10, zoom: 'face',
      cast: [
        { id: 'ya', pos: 'left', expr: 'soft', outfit: 'home', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'moved', outfit: 'home', act: 'sit' }
      ],
      speaker: 'jin',
      text: '……你怎么总是什么都知道。\n……你等我一下。',
      next: 'end_slow_05'
    },
    {
      id: 'end_slow_05', chapter: 10, cg: 'cg_end_slow', cast: [],
      speaker: 'ya',
      text: '因为我看你看了很久啊。\n我们有的是时间。\n……剩下的那半句，我等你。',
      titlecard: '《慢慢来》',
      ending: 'slow'
    },

    /* =========================================================
     *  收束 C ·《这次是我先说的》
     * ========================================================= */
    {
      id: 'end_she_first_01', chapter: 10, scene: 'hotel', tint: 'night', bgm: 'bgm_quiet', beat: 'calm',
      cast: [
        { id: 'jin', pos: 'center', expr: 'guilty', outfit: 'home', act: 'sit' }
      ],
      speaker: 'inner',
      text: '我一直以为，等我再好一点，我就能把那句话说出来。\n可话到嘴边，我又开始挑毛病：太晚了，太急了，说得不够好。\n说到底还是怕。怕说出口以后，这一年里所有的「刚好」，都会变成一个需要我负责的承诺。',
      next: 'end_she_first_02'
    },
    {
      id: 'end_she_first_02', chapter: 10,
      cast: [
        { id: 'ya', pos: 'left', expr: 'smile', outfit: 'home', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'blank', outfit: 'home', act: 'sit' }
      ],
      speaker: 'ya',
      text: '……你又要开始发呆了。\n算了。我替你说吧。',
      next: 'end_she_first_03'
    },
    {
      id: 'end_she_first_03', chapter: 10, zoom: 'face', beat: 'swell',
      cast: [
        { id: 'ya', pos: 'left', expr: 'tease', outfit: 'home', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'surprised', outfit: 'home', act: 'sit' }
      ],
      speaker: 'ya',
      text: '你在想，这样的日子能不能一直有下去。\n从去年九月那张地图开始，你就在想这个。\n……你那点心思，我早就知道了。你不敢说，是怕说出来就不灵了。',
      next: 'end_she_first_04'
    },
    {
      id: 'end_she_first_04', chapter: 10, zoom: 'face',
      cast: [
        { id: 'ya', pos: 'left', expr: 'shy', outfit: 'home', act: 'sit' },
        { id: 'jin', pos: 'right', expr: 'moved', outfit: 'home', act: 'sit' }
      ],
      speaker: 'jin',
      text: '……我。\n对不起。\n……你别看我。\n……可我听清了。',
      next: 'end_she_first_05'
    },
    {
      id: 'end_she_first_05', chapter: 10, cg: 'cg_end_she_first', cast: [],
      speaker: 'ya',
      text: '没关系呀。\n……眼睛都红了，还嘴硬。\n反正我们有一整年，还有很多年——你好呀，我的男朋友。',
      titlecard: '《这次是我先说的》',
      ending: 'she_first'
    }
  ]);
})();
