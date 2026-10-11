# 你好！一周年

一款可直接在浏览器游玩的**中文互动式视觉小说（Galgame）**：狗狗雅与羊羊金的故事，关于「把话说出口」。
**真人设定**（不是动物拟人）：狗狗雅是一个小巧可爱的女生，羊羊金是一个高大些的男生，昵称只是昵称。

鼠标点击推进剧情、做出选择，**好感 / 信任 / 勇气** 三项数值会真实影响分支与最终收束——共 **3 种收束**。
剧本按**真实时间线**推进：2025 年 6 月末在学校论坛认识 → 9 月 27 日生日那张回忆地图 → 十月第一次见面 →
苏州学术会议 → 每个月飞上海 → 南阳生日（猫猫美甲）→ 杭州台风 / 三亚 / 义乌三次旅行 → 一周年互道「男女朋友你好」。

> 全部素材都在仓库里真实存在，无任何外部链接、无随机网络图片、无破损占位。
> **角色立绘为第三方 CC0 素材包加工的真实位图**（见 [§素材来源](#素材来源)），
> 背景与 CG 为**手写/合成 SVG**，音频为 **WebAudio 实时合成**。
> 未覆盖的「表情×服装」组合会自动回退到程序化矢量立绘，游戏不会缺图。

---

## 一、如何启动

### 方式 A：直接双击（零依赖，推荐先试这个）
直接打开 `index.html` 即可游玩。项目使用经典 `<script>` 加载（非 ES module），
因此在 `file://` 协议下也能正常运行，无需服务器。

### 方式 B：本地服务器（推荐用于长期游玩，避免个别浏览器对 file:// 的限制）
```bash
cd yajin
python3 -m http.server 8123
# 浏览器打开 http://localhost:8123
```
或 `npm start`（同上命令）。

> 若浏览器禁用了 `file://` 下的 `localStorage`，游戏会自动降级为**内存存档**（当次会话有效），不会报错。

---

## 二、依赖与命令

| 用途 | 是否需要安装 | 命令 |
|---|---|---|
| 游玩 | **不需要任何依赖** | 双击 `index.html` |
| 验收测试 | 需要 `jsdom` | `npm i -D jsdom` 然后 `npm test` |
| 重新合成 CG | 不需要 | `npm run build:cg` |
| 重新生成素材清单 JSON | 不需要 | `npm run build:manifest` |
| 导出完整文字稿 SCRIPT.md | 不需要 | `npm run build:script` |
| 导出**可编辑**的分章文字稿 | 不需要 | `npm run export:text`（生成到 `剧本/`） |
| 把 `剧本/*.md` 的改动写回游戏 | 不需要 | `npm run import:text` |
| 让位图立绘生效 | 不需要 | `npm run build:sprites` |
| 检查位图立绘尺寸与覆盖情况 | 不需要 | `npm run check:sprites` |
| 重新生成美术规格书 | 不需要 | `npm run build:guide` |

`jsdom` 仅测试用；游戏本体零依赖。若当前目录的上级已有 `node_modules/jsdom`，则无需再次安装。

**测试结果（最近一次）**：`117 项通过 / 0 项失败`，覆盖素材完整性、剧本契约、支配前沿可达性与三种收束、聊天窗口逐条揭示、
存读档与刷新恢复、新游戏重置、连点保护、真实点击推进、音频开关、响应式布局等。

```bash
npm test          # 完整验收（约 40 秒）
```

---

## 如何修改 / 补充剧情文字（不需要会写代码）

1. 打开 `剧本/` 目录，里面是分章的文字稿（每个节点一段，节点号形如 `[c3_27_18]`）。
2. 直接改中文正文：可以改措辞、可以换行、可以加长；以 `#` 开头的行是场景/神态提示，留着方便对照。
3. 选项段在 `== 选项 ==` 下面，每行一个选项，用全角 `｜` 分隔"选项文字"和"提示"（**改文字可以，增删选项需要告诉我**）。
4. 改完在该目录运行：

```bash
npm run import:text      # 把改动写回游戏（生成 src/story/text.js）
```

5. 刷新浏览器即可看到效果。想撤回就改回原文再跑一次（工具只记录与默认剧本不同的部分）。

> 要**新增剧情段落**（不是改词，而是插入新场景）：在对应 md 末尾用 `[新增]` 标记写下内容，并注明想插在哪两个节点之间——
> 新增段落需要指定跳转关系，工具无法完全自动化，这一步交给我接线即可。
> 想读整本连贯的稿子（含场景、神态、数值）看 `SCRIPT.md`；想改文字就动 `剧本/` 里的 md。

---

## 如何换成"更规范的立绘素材"

游戏已经内置**位图立绘通道**：把人画好的 PNG 丢进 `assets/characters/` 就会**自动优先使用**，没有的自动回退到程序化立绘（可混用、不会缺图）。

```bash
# 1) 放文件（命名：<表情>@<服装>.png，透明底，建议 720×1080，底部对齐）
#    assets/characters/ya/smile@casual.png
#    assets/characters/ya/smile@any.png      ← 没单独画服装时用它覆盖全部服装
# 2) 生效
npm run build:sprites
# 3) 检查尺寸/透明通道 + 看还缺哪些组合
npm run check:sprites
```

完整的 208 个组合清单、识别特征要求（雅的小雀斑与银发夹、金的眉尾疤与旧腕表）、
**实测可下载且授权明确的素材源**、AI 生成提示词模板、以及给画师的委托清单，都在 [ART_GUIDE.md](ART_GUIDE.md)。

---

## 素材来源

### 角色立绘（位图，30 张）

| 项目 | 内容 |
|---|---|
| 素材包 | **VIsual novel Character Sprite**（`character_5.zip`） |
| 来源 | https://opengameart.org/content/visual-novel-character-sprite |
| 作者 | **FALLiNG_AiR** |
| 许可证 | **CC0 1.0 Universal（公有领域奉献）** —— https://creativecommons.org/publicdomain/zero/1.0/ |
| 是否需要署名 | 不需要（CC0）；本项目仍主动署名 |
| 抓取日期 | 2026-10-11 |

**游戏内需要显示的署名文字**：

```text
Character art: FALLiNG_AiR (https://opengameart.org/content/visual-novel-character-sprite), CC0 1.0 Public Domain
```

- 雅 ← 该包 `cha 1`（原为绿发少女），金 ← 该包 `cha 5`（原为灰发少年）。
- 原图为 2000×3000 透明底 PNG；本项目做了**半身取景裁剪 → 720×1080**，
  并对雅做了**色相旋转（绿→粉）**、对金做了**主题色着色**、为雅补了**程序化腮红**（CC0 允许修改）。
- 完整表情映射表、加工细节、以及**考察过但未采用的其他候选素材**（含各自的许可证与排除原因）
  见 [`assets/characters/CREDITS.md`](assets/characters/CREDITS.md)。
- 全流程可用 `python3 assets/characters/rebuild-sprites.py` 重现（纯标准库，会自动下载 CC0 素材包）。

> ⚠️ **诚实声明**：许可证（CC0）与投稿者（FALLiNG_AiR）已从 OpenGameArt 页面确认；
> 但投稿页**未给出上游原始画师姓名**（说明里提到 PSD 图层中可能含韩文）。
> 本项目按页面声明使用；若将来要商用发行，建议先到来源页面自行复核。

### 背景 / CG / UI / 音频

| 类别 | 来源 | 授权 |
|---|---|---|
| 20 张场景背景 | 本项目**手写 SVG** | 随本项目（MIT） |
| 22 张 CG | 本项目由背景 + 立绘 + 特效**合成**（`tools/build-cg.js`） | 随本项目（MIT） |
| ↳ 其中 17 张「背景＋角色」型 CG 的**角色部分** | = **同一套 CC0 立绘素材**（`assets/characters/<cid>/<expr>@any.png`，base64 内嵌进 SVG）；署名文字见 [`assets/characters/CREDITS.md`](assets/characters/CREDITS.md) | **CC0 1.0**（与立绘相同） |
| UI 图标 / 标题徽记 | 本项目**手写 SVG** | 随本项目（MIT） |
| BGM / 音效 / 环境音 | **WebAudio 实时合成**，非采样音频 | 随本项目（MIT） |

即：**除 `assets/characters/` 下的 30 张角色立绘外，本作没有使用任何第三方素材**
——CG 里的角色部分就是这套 CC0 立绘的复用。

---

## 三、操作方式

| 操作 | 说明 |
|---|---|
| 鼠标左键 | 推进对话；打字动画中点击一次立即显示全文 |
| 点击选项 | 进入对应剧情分支 |
| `空格` / `回车` | 推进对话 |
| `Ctrl`（按住） | 快进已读文本 |
| `A` | 自动播放开/关 |
| `H` / 滚轮上翻 | 剧情回顾（历史回看） |
| `S` / `L` | 存档 / 读档界面 |
| `1`–`9` | 选择第 N 个选项 |
| `Esc` | 打开设置；再次按下关闭 |
| 右上角按钮 | 自动 / 快进 / 历史 / 存档 / 读档 / 设置 / 标题 |

设置中可调：文字速度、打字机开关、自动播放停留时间、BGM 与音效开关及音量、是否快进未读文本、清除全部数据。

---

## 三之二、预览与截图

| 文件 | 内容 |
|---|---|
| `剧本/` 目录（11 个 .md） | **可编辑的分章文字稿**：改中文正文 → `npm run import:text` → 刷新浏览器即生效（不需要碰任何代码） |
| `ART_GUIDE.md` | **美术规格书**：位图立绘命名/尺寸契约、208 个"表情×服装"组合清单、已验证的合规素材源与许可证、AI 提示词模板、委托清单 |
| `SCRIPT.md` | **完整文字稿（6198 行）**：由实际剧本数据导出，含场景、时段、BGM、立绘神态（表情·服装·动作·镜头）、对话/心声/旁白、选项与数值、三种收束 |
| `STORY_SPEC.md` | **总设定与剧本规范**：真人角色圣经、素材清单、节点契约、数值与 flag、章节大纲，以及 §8 的原始素材原文（2025-09-27 逐字聊天记录 + 《石头说》全文） |
| `preview.html` | **素材检查页**：一屏查看全部 20 张背景、30 种表情立绘（含服装差分）、22 张 CG 与 UI 图标（带文件名标注） |
| `preview-hands.html` | **手部特写对照页**：一屏并排看 5 种 `handSVG(kind)` 的「游戏内实际裁切（1600×900 slice）+ 720×1080 原始画布」以及 `cg_nail_art` 成品；改 `handSVG()` 后刷新即可复核 |
| `screenshots/01_title.png` | 标题界面（真实浏览器渲染） |
| `screenshots/02_ingame.png` | 游戏内（序章·论坛）：背景 + 立绘 + 时段染色 + 三条 HUD 计量 |
| `screenshots/03_chat_window.png` | **聊天窗口**：2025-09-27 那条私聊按原文逐条出现（网名 + 时间戳） |
| `screenshots/09_twoshot.png` | 两位角色同框（雅在说话，金略压暗）——第一次见面 |
| `screenshots/04_cg_anniversary.png` | CG 节点：全屏 CG 模式（立绘层隐藏、HUD 压暗） |
| `screenshots/05_nail_scene.png` | 南阳生日 · 猫猫美甲段落（金 `nails` 差分） |
| `screenshots/08_ending.png` | 收束 A《星星的答案》：以 CG 为背景的独白与互道「男女朋友你好」 |
| `screenshots/06_assets_gallery.png` | 全部素材一览（20 背景 + 22 CG 缩略图墙） |
| `screenshots/07_preview_v2.png` | `preview.html` 素材检查页（含服装差分视图） |
| `screenshots/13_sprite_ingame_c0_16.png` | **位图立绘接入后**：金单人（`?shot=c0_16`） |
| `screenshots/13_sprite_ingame_c5_46.png` | **位图立绘接入后**：雅 + 金同框（`?shot=c5_46`） |
| `screenshots/13_sprite_ingame_c2_01.png` | **位图立绘接入后**：金 + 雅同框（`?shot=c2_01`） |
| `screenshots/13_sprite_ingame_c7_103_ya_only.png` | **位图立绘接入后**：雅单独出现（`?shot=c7_103`，`excited`） |
| `screenshots/14_cg_first_meet.png` | **CG 换成位图立绘合成后**：`cg_first_meet`（`?shot=c5_18`，浅色背景） |
| `screenshots/15_cg_anniversary.png` | **CG 换成位图立绘合成后**：`cg_anniversary`（`?shot=c10_22`，暗色酒店房间） |
| `screenshots/16_cg_jk.png` | **CG 换成位图立绘合成后**：`cg_jk`（`?shot=c9_067`，她举着橱窗照片、他别开视线） |
| `screenshots/17_cg_beach.png` | **CG 换成位图立绘合成后**：`cg_beach`（`?shot=c9_100`，暖色黄昏） |
| `screenshots/18_cg_nail_art.png` | `cg_nail_art` 手部特写（猫猫美甲 + 磨砂黑 + 银线），**v4 重画后**的成品 |
| `screenshots/19_hand_cg_nail_art.png` | **手部插图 v4**：`cg_nail_art` 在游戏内实际显示的样子（`?shot=c8_92`） |
| `screenshots/19_hand_cat_nails.png` | **手部插图 v4**：猫猫美甲特写（`?shot=c10_24`） |
| `screenshots/19_hand_hold.png` | **手部插图 v4**：两只手（默认 `hold`，`?shot=c5_44`） |
| `screenshots/19_hand_hold_c7_16.png` | **手部插图 v4**：同上（`?shot=c7_16`，他拎箱子、她拽住他的手） |
| `screenshots/19_hand_gift.png` | **手部插图 v4**：递明信片（`?shot=c10_13`；该节点同时有 `cg_newyear`，CG 层会盖住手部层） |
| `screenshots/19_hand_ch8_default.png` | **待接线问题示例**：第 8 章美甲节点 `c8_81` 目前用的是默认 `hold`，画面上是两只手而不是美甲 |
| `screenshots/19_hand_before_compare.png` | **改前对照**：旧版 4 种手部图（面包 + 香肠 + 悬空手表） |
| `screenshots/19_hand_nail_kinds.png` | **美甲款式对照**（每格左边=游戏内裁切）8 种：`both_cat`（双猫猫）/ `butterfly_nails`（双手蝴蝶穿戴甲）/ `butterfly_one`（单手蝴蝶）/ `both_nails`（左黑右猫）/ `mixed_left_cat`（左猫右黑）/ `both_cool`（双酷黑）/ `cat_nails` / `cool_nails` |

上述 PNG 由 headless Chrome 实际渲染生成（非示意图），可据此判断真实画面效果。
（`04_cg_anniversary.png` / `05_nail_scene.png` / `09_twoshot.png` 拍于**矢量 CG 时代**，
画面里的角色仍是旧的矢量立绘，已被上面几张取代。）

**调试/截图参数**：`index.html?shot=<节点id>` 会直接跳转到指定剧情节点并立即显示全文，例如
`index.html?shot=c0_05`、`index.html?shot=c3_chat_1`（聊天窗口）、`index.html?shot=c10_44`、`index.html?shot=end_star_06`。
配合 `?debug=1` 可在控制台看到剧本校验与音频解锁日志。

---

## 四、目录结构

```
yajin/
├── index.html              页面壳 + 全部样式 + DOM（游玩入口）
├── preview.html            素材检查页：一屏查看所有背景/立绘/CG
├── package.json            脚本与测试依赖
├── README.md               本文件
├── STORY_SPEC.md           ★ 设定总纲：角色圣经 / 节点规范 / flag 表 / 数值规则 / 结局条件
├── src/
│   ├── core.js             命名空间、工具函数、事件总线
│   ├── art.js              程序化矢量立绘 + 背景兜底 + 氛围特效 + CG 合成
│   ├── state.js            好感/信任/剧情标记/条件判定/结局判定
│   ├── save.js             存档槽位、设置、已读记录（localStorage + 内存兜底）
│   ├── audio.js            WebAudio 合成 BGM / 环境音 / 音效
│   ├── engine.js           剧情引擎：节点推进、打字机、自动、快进、转场、输入锁
│   ├── ui.js               全部界面：对话框、立绘舞台、选项、HUD、弹层、结局
│   ├── main.js             启动流程与测试接口
│   └── story/
│       ├── characters.js   角色数据（姓名/主题色/表情集/flag 白名单/场景与 CG 清单）
│       ├── index.js        剧本注册表 + 校验器（跳转、flag、孤儿、结局可达性）
│       ├── chapter1.js ~ chapter4.js   第一至四章剧本
│       ├── chapter0.js     序章 · 一个无聊的人
│       ├── chapter1.js ~ chapter9.js   第一至九章（相识期 / 生日地图 / 石头说 / 第一次见面 / 苏州 /
│       │                              上海日常 / 南阳生日 / 三次旅行）
│       ├── chapter10.js    第十章 · 一周年（含表白与关键选择）
│       └── chapter_end.js  结局路由 + 三种收束
├── assets/
│   ├── manifest.js/.json   ★ 素材总清单（文件、尺寸、透明需求、用途、AI 提示词、替换路径）
│   ├── characters/         位图立绘通道（放 ya/ 与 jin/，丢进去即优先使用；当前为空）
│   ├── sprites.js          位图立绘索引（由 tools/gen-sprites.js 生成）
│   ├── backgrounds/        20 张场景背景（1600×900 SVG）
│   ├── cg/                 22 张 CG（1600×900 SVG：17 张由 tools/build-cg.js 合成「背景+立绘」，
│   │                       5 张为手绘符号画面：论坛页 / 回忆地图 / 聊天特写 / 石头独白 / Ginpu 玩偶）
│   └── ui/                 标题徽记与好感/信任图标（SVG）
├── tools/
│   ├── build-cg.js         由「背景 + 立绘 + 特效」合成 CG
│   └── gen-manifest.js     生成 assets/manifest.json 并校验文件存在性
└── tests/
    └── run.js              无头验收测试（jsdom，112 项断言）
```

**剧情规模**：**1222 个节点 · 25 个选择点（73 个选项）· 11 章 · 20 个场景 · 22 张 CG · 30 个聊天窗口节点 · 3 种收束**。
其中 2025-09-27 凌晨那段私聊**按原文逐条复现**（98 条消息、保留发送者与时间戳），
2025-09-28 的《石头说》以 **34 个独白节点**原文照录。

---

## 五、如何添加背景与角色立绘

### 5.1 背景（位图或矢量）
1. 把图片放进 `assets/backgrounds/`，命名与场景 id 一致，例如 `cafe_day.png`（**1600×900，不透明**）。
2. 在 `src/story/characters.js` 的 `YJ.SCENES` 里确认该 id 已登记。
3. 若使用 `.png`：修改 `src/ui.js` 的 `changeScene()` 中 `'assets/backgrounds/' + sceneId + '.svg'` 的后缀为 `.png`；
   或直接覆盖同名 `.svg`。
4. 在 `assets/manifest.js` 里补一条记录（`file` / `size` / `usedIn`）。

> 引擎自带**加载失败兜底**：任何背景加载失败都会自动替换为同色系渐变图，并在“关于”面板与 `__test.assetIssues()` 中记录，不会出现破图或卡死。

### 5.2 角色立绘
1. 在 `assets/characters/ya/` 与 `assets/characters/jin/` 下按表情命名放置 PNG：
   `neutral.png` `smile.png` `happy.png` `shy.png` `confused.png` `sad.png` `angry.png` `serious.png`
   （金为 `neutral/smile/happy/shy/surprised/confused/sad/serious`）
2. 规格：**720×1080，透明背景**，人物重心与基线在所有表情间保持一致（建议脚底对齐画布底部）。
3. 修改 `src/ui.js` 的 `svgFor()`，改为返回图片路径：
   ```js
   function svgFor(charId, expr, act){
     return '<img src="assets/characters/'+charId+'/'+expr+'.png" alt="">';
   }
   ```
4. 在 `assets/manifest.js` 中把对应 `sprite_*` 条目的 `status` 改为 `bitmap-final`、`file` 填入路径。

**当前立绘状态**：`procedural-vector` —— 由 `src/art.js` 用同一 720×1080 画布实时绘制，
因此 **30 种表情 × 14 套服装差分**天然对齐、无边缘锯齿、可无损缩放。
角色设定（身高体型、发型、识别特征如雅的小雀斑与银发夹、金的眉尾旧疤与旧腕表、服装清单）见 `STORY_SPEC.md` §2。

---

## 六、如何增加剧情节点与选项

剧本与引擎完全分离：每个章节是一个经典脚本，用 `YJ.story.add([...])` 注册节点。

```js
/* src/story/chapter3.js */
(function () {
  YJ.story.add([
    {
      id: 'c3_new_01',              // 全局唯一
      chapter: 3,
      scene: 'cafe_evening',        // 必须是 YJ.SCENES 中的 id；省略则沿用当前背景
      bgm: 'bgm_quiet',             // 可选，省略则沿用
      ambience: 'cafe',             // 可选环境音：rain / cafe / night
      cast: [                       // 未列出的角色会自动淡出退场
        { id: 'ya',  pos: 'left',  expr: 'confused', act: 'idle' },
        { id: 'jin', pos: 'right', expr: 'smile',    act: 'idle' }
      ],
      speaker: 'jin',               // 'ya' | 'jin' | 'narrator'（旁白）| 'inner'（雅的心声）
      text: '……',
      effects: { affection: 2, trust: 1, flags: { c3_new_flag: true } },  // 进入即结算
      sfx: 'sfx_bell',
      titlecard: '第二天，傍晚',      // 可选：黑场时间提示卡
      cg: 'cg_rubric',              // 可选：全屏 CG（隐藏立绘层、压暗 HUD）
      condition: { trust: { min: 50 }, flags: ['c2_listened'] },  // 可选
      else: 'c3_new_other',         // condition 不满足时跳这里（省略则跳过本节点）
      next: 'c3_new_02',            // 无选项时必须给 next
      choices: [                    // 有选项时 → 显示选项
        { text: '……', effects: { affection: 4, trust: 2, flags: { x: true } }, next: 'c3_new_02a', hint: '（可选小字）' }
      ]
    }
  ]);
})();
```

**路由节点**（按状态跳转，第五章结局判定用的就是它）：
```js
{ id:'c5_router', chapter:5, route:[
    { when:{ affection:{min:70}, trust:{min:65}, courage:{min:55} }, next:'end_star_01' },
    { when:{ courage:{min:40} }, next:'end_slow_01' },
    { when:{}, next:'end_she_first_01' }     // 兜底必须放最后
]}
```

**加完请务必跑一次校验**（会检查跳转目标是否存在、flag 是否越界、有无孤儿节点与死胡同、结局是否可达）：
```bash
npm test          # 或在浏览器控制台执行 __test.validate()
```

规则要点：
- `next` / `choices[].next` / `else` / `route[].next` 指向的 id 必须真实存在；
- flag 只能使用 `src/story/characters.js` 里 `YJ.FLAGS` 白名单中的名字；
- 没有 `next`/`choices`/`route` 的节点必须带 `ending`，否则校验报错。

---

## 六之二、互动节点怎么写（敲键盘 / 连续按键）

有些台词不只是"读过去"，而是要让玩家**动手回应**——比如「能听见吗？听见就敲键盘」。
这类节点不需要改引擎，只要在剧本节点上加一个 `interact` 字段：

```js
/* 简写：默认敲 4 下 */
{ id:'c3_knock_1', chapter:3, speaker:'jin',
  text:'「喂？能听见吗？」\n（听见了就敲键盘。）',
  interact:'knock',
  next:'c3_knock_2' },

/* 完整写法：所有参数都可省略（第一章 c1_37 就是这个形状） */
{ id:'c5_knock_2', chapter:5, speaker:'ya',
  text:'（他在等你说话。手指放在键盘上，敲一下也好。）',
  interact:{
    type:'knock',                 // 互动类型：目前实现了 'knock'（连续敲键盘）
    count:5,                      // 需要敲几下（自动夹在 1~9 之间，默认 4）
    hint:'（别愣着……敲键盘）',      // 对话框右下角的提示文案
    hintTap:'（也可以点一下画面）',   // 2.5 秒没等到按键时切换的兜底提示（可选）
    done:'（听见了。他在笑。）',      // 解锁时的收尾文案
    sfx:'sfx_page',               // 每敲一下播放的音效（YJ.SFXS 里已登记的音效 id）
    tapAfter:2500,                // 多久没按键就把"点击"也算作敲（ms，默认 2500）
    autoAfter:10000               // 多久无论如何自动解锁（ms，默认 10000）
  },
  next:'c5_knock_3' },
```

行为说明（`src/ui.js` 里的 `startKnock / knockOnce / autoCompleteKnock / clearKnock`）：

- 进入带 `interact:'knock'` 的节点后，**剧情推进被冻结**：空格、回车、鼠标点击、自动播放、快进
  都不会跳过它（用引擎自带的输入锁 `engine.state.locked`，并每 150ms 重申一次；
  互动期间自动播放 / 快进临时暂停，结束后原样恢复）；
- 玩家每敲一次键盘（字母 / 数字 / 空格 / 回车 / 标点一类的"可打印按键"，输入法上屏也算），
  右下角的提示点就亮一个，同时**播放音效 + 对话框轻震 + 屏幕暖光一闪**；
- 三条解锁路径互相兜底，**都走同一套收尾**（圆点一定会亮完 → 显示 `done` → 提示音 → 短暂停留后解锁）：
  1. **键盘**：敲满 `count` 下（主路径，前 2.5 秒的体验就是"敲键盘"）；
  2. **点击兜底**：进入后 2.5 秒（`tapAfter`）内一次键都没按 → 提示自动换成 `hintTap`（默认
     「听不见也没关系……点一下画面」）并出现一圈点击涟漪，此后**点击画面也算敲一下**；
     只要中途按过任意一个键，这条兜底就不会启动；
  3. **绝对保险**：10 秒（`autoAfter`）后无论如何自动补完（圆点按 90ms 依次点亮，不算突兀），
     保证触屏 / 纯鼠标 / 没有键盘的设备都不会被卡住；
- 互动期间 `Esc / H / S / L` 等快捷键被临时冻结，避免打断节奏；敲完即恢复。

可选的检查方式（浏览器控制台）：

```js
__test.goTo('c1_37');              // 跳到互动节点
YJ.ui.interact.active();           // 是否正在进行敲键盘互动
YJ.ui.interact.left();             // 还差几下
YJ.ui.interact.tap();              // 当前是否处于"点击也算敲"的兜底态
YJ.ui.interact.knock();            // 手动敲一下（等价于按一次键 / 点一下画面）
YJ.ui.interact.complete();         // 手动触发兜底三（自动补完）
```

> 提示：不想让玩家等太久，`count` 建议 3~5；`sfx` 请只用 `src/audio.js` 里已登记的音效
> （`sfx_click` / `sfx_page` / `sfx_msg` / `sfx_ding` / `sfx_heart` / `sfx_bell` …），
> 写错 id 不会报错，但会静音。
> 自动化测试若需要跳过互动，要么在跑之前摘掉节点上的 `interact` 字段，
> 要么调用 `YJ.ui.interact.complete()`；`interact` 不写 = 完全是以前的行为（向后兼容）。

---

## 七、如何调整好感度与结局条件

### 7.1 数值
- 初始值：`src/state.js` 顶部 `INIT_AFFECTION = 30` / `INIT_TRUST = 30`。
- 单次变化：写在节点的 `effects` 或选项的 `effects` 里（`affection` / `trust` 会在 0–100 之间自动夹紧）。
- 变化提示：`|Δ| ≥ 4` 时界面弹出心形/星形浮标并播放提示音（`src/ui.js` 的 `statusDelta()`）。
- 设计原则（`STORY_SPEC.md` §6）：**好感 ≠ 信任**。「我支持你，但我希望你先告诉我」加信任；
  「你去吧，不用管我」只加好感——因此“高好感低信任”会真实地落到普通结局。

### 7.2 结局条件
结局由累计状态决定，判定集中在一处，便于调整：

- **判定函数**：`src/state.js` 的 `resolveEnding()`
- **剧情路由**：`src/story/chapter5.js` 的 `c5_router`（两者阈值必须保持一致）

```js
star       ：affection ≥ 70 且 trust ≥ 65 且 **courage ≥ 55** —— 他先开口，并把最私密的一面也交了出去
slow       ：不满足 star，且 **courage ≥ 40** —— 他说了喜欢，更深的那部分还留在心里
she_first  ：其余（courage < 40）—— 他没能说出口，她替他说了
```
调整阈值时**同时修改这两处**，然后 `npm test` —— 测试会穷举所有可达状态，验证三个结局仍然可达、
且 `c4_left` 绝不会进入甜蜜结局。

---

## 八、素材状态：哪些是成品，哪些待补充

| 类别 | 数量 | 现状 | 说明 |
|---|---|---|---|
| 背景 | 9 | ✅ **成品可用** | `assets/backgrounds/*.svg`，手写矢量，1600×900，统一暖色调与暗角 |
| 角色立绘（位图） | 208 个"表情×服装"组合 | ✅ **已接入（CC0）** | 30 张 720×1080 透明 PNG（雅 16 / 金 14 表情，`@any` 覆盖全部服装），**覆盖 208/208**；来源与许可证见 [§素材来源](#素材来源) |
| 角色立绘（矢量） | 30 表情 × 14 套服装 | ✅ 兜底可用 | 程序化绘制（真人），透明背景，720×1080；**当前已被位图全面覆盖**，仅在删掉位图时作为回退 |
| 场景 CG | 22 | ✅ **成品可用** | `assets/cg/*.svg`。17 张由 `tools/build-cg.js` 合成：其中 **16 张是「背景 SVG + 位图立绘 + 氛围特效」**（角色立绘以 **base64 data URI 内嵌**——SVG 被 `<img>` 加载时不能引用外部文件）、1 张手部特写（`cg_nail_art`）；另外 5 张为手绘符号画面（`cg_forum`/`cg_birthday_map`/`cg_chat_confess`/`cg_stone_essay`/`cg_ginpu`） |
| UI 图标 | 3 | ✅ 成品 | `assets/ui/logo_mark.svg`、`icon_heart.svg`、`icon_trust.svg` |
| UI 版式 | 8 项 | ✅ 成品 | 对话框、姓名牌、好感条、选项按钮、存档、回顾、设置、结局版式（CSS 实作，无需图片） |
| BGM | 11 | ✅ **可听** | WebAudio 实时合成（和弦垫 + 稀疏旋律），**非采样音频**，可在设置中关闭 |
| 环境音 | 9 | ✅ 可听 | 雨 / 夜 / 咖啡馆 / 人群 / 海 / 键盘 / 风 / 水下 / 乐园（`park`，香港章新增），合成噪声 |
| 音效 | 16 | ✅ 可听 | 点击、翻页、消息、提示、心跳、笑声、快门、钟声、雷、雨起、选择，以及香港章专用的烟花升空 / 炸开 / 齐放、过山车呼啸、花车乐句（5 个新增，见 MUSIC_PLAN §7） |
| 位图立绘来源 | 30 张 | ✅ **已接入** | 来自 OpenGameArt 的 **CC0** 素材包（**非 AI 生成**）；加工流程与表情映射见 `assets/characters/CREDITS.md`。本作**未使用任何 AI 生成位图** |

**关于「不得引用不存在的图片路径」**：清单中所有 `file` 字段都经过 `tools/gen-manifest.js` 校验，
且 `npm test` 会再次逐一确认文件存在、SVG 可解析、剧情引用的每个场景/CG 都有对应文件。
角色立绘与音频的 `file` 为 `null` 并标注了生成方式（`generator`），不存在悬空引用。

`preview.html` 可一屏核对全部美术素材。

---

## 九、音频说明（诚实声明）

- 本作**没有采样音频文件**，所有声音由 `src/audio.js` 用 WebAudio 的振荡器与噪声**实时合成**，
  确实会发声（不是“假装实现了音乐系统”）。
- 浏览器自动播放策略要求首次交互后才能出声：点击/按键一次即自动解锁。
- 设置中关闭音效后，`YJ.audio.sfx()` 会直接返回、**不会创建任何发声节点**（已由测试断言）。
- 无 `AudioContext` 的环境（如无头测试）会安全降级为静音，不抛错。
- **香港迪士尼章的专用音效**（2026.04）：烟花用「升空上滑扫频 / 低频冲击＋中频爆点＋高频沙沙尾巴 / 多层错开的齐放」
  三层堆出来，过山车俯冲用「风上扫＋音高下滑」同时进行，花车用一段 A 大调的铜管＋风笛乐句（只奏一遍，
  音量压在 BGM 之下）；白天园区另有 `park` 环境音（人群＋远处音乐＋偶尔的轨道车）。
  合成参数与听感意图逐条列在 [`MUSIC_PLAN.md`](MUSIC_PLAN.md) §7，纯合成的做不出来的部分（真实混响空间、
  真铜管起振、立体声宽度）也在那里如实写明。
- **短音效播完会自己断开**：一次音效建出来的全部振荡器/噪声源登记在同一个"声部"上，播完统一
  `stop()` + `disconnect()`；`stopAmbience()` 会连环境音的事件定时器一并清掉，不留"停不掉的噪声源"。

---

## 十、已知取舍与后续可做

1. **立绘为矢量程序化绘制**：好处是零位图依赖、表情绝对对齐、任意缩放不糊；
   代价是不如手绘精细。替换路径已铺好（§5.2）。
2. **CG 为“背景 + 立绘 + 特效”合成**：构图统一、可批量重生成（`npm run build:cg`），
   但每张 CG 的镜头感不如单独绘制。`manifest.json` 已给出每张 CG 的 `aiPrompt` 供替换。
3. **快进只跳已读**：默认不跳未读文本（可在设置中改为也跳未读），避免误跳新剧情。
4. 若要做多周目继承、CG 鉴赏模式、成就系统：状态已全部集中在 `YJ.state.st`，
   `src/save.js` 的 `exportAll()` 可直接作为存档结构基础。

---

## 素材来源与许可（Credits）

| 类别 | 来源 | 许可 |
|---|---|---|
| **角色立绘**（雅 16 张 / 金 14 张，共 30 张 PNG） | OpenGameArt 投稿 [VIsual novel Character Sprite](https://opengameart.org/content/visual-novel-character-sprite)（作者 FALLiNG_AiR） | **CC0 1.0 公有领域**（不要求署名，此处出于尊重与可追溯性记录） |
| 背景 24 张 / 符号类 CG 5 张 | 本项目手写 SVG | 随本项目 |
| **Ginpu 企鹅玩偶**（`cg_ginpu.svg`，以及 `src/art.js` 里同款的小挂件） | **本作原创角色**，由 `tools/build-ginpu-cg.js` 手写矢量绘制 | 随本项目，**与任何第三方 IP 无关**（角色设定见 [`assets/CREDITS_GINPU.md`](assets/CREDITS_GINPU.md)） |
| 合成型 CG 17 张 | 背景 + 上述立绘素材，由 `tools/build-cg.js` 合成 | 同上（CC0） |
| 音频（11 BGM + 16 音效 + 9 环境音） | WebAudio 实时合成，无采样文件 | 随本项目 |

游戏内署名文字：`Character art: FALLiNG_AiR (opengameart.org), CC0 1.0 Public Domain`
完整记录（含来源直链、加工脚本、表情映射表）见 [`assets/characters/CREDITS.md`](assets/characters/CREDITS.md)。

**手部 / 美甲插图**（游戏内手部特写层与 `cg_nail_art`）是本项目**自绘的矢量图**，`handSVG(kind)` 共 11 种取值（含「单/双猫猫 / 单/双酷黑 / 一猫一黑 / 单/双手粉色蝴蝶穿戴甲」等美甲款式，未知取值一律回退 `hold`），，没有任何第三方素材（曾经系统考察过 OpenGameArt 等可达图库，没有可用的手/美甲素材），画法与几何契约见 [`assets/CREDITS_HANDS.md`](assets/CREDITS_HANDS.md)。
**Ginpu 企鹅玩偶**是本作**原创的玩偶角色**（深蓝灰身体、短小金黄小尖喙、小眼睛 + 腮红、三根呆毛、浅蓝肚纹、浅金三趾小脚掌），
与任何第三方 IP 无关，设定与画法见 [`assets/CREDITS_GINPU.md`](assets/CREDITS_GINPU.md)。
本项目准备**公开发布到 GitHub Pages**：立绘是 CC0、其余插图与音频均为本项目自绘 / 自合成，无第三方角色或素材依赖。
