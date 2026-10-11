# 《你好！一周年》美术规格书（ART_GUIDE）

> 本文件由 `tools/gen-art-guide.js` 生成，与游戏实际使用的 ID 完全同步。
> 当前立绘来源：**程序化矢量（`src/art.js`）** —— 位图覆盖进度 **0 / 208**。

---

## 一、现在的画面是怎么来的

| 类别 | 现状 | 替换难度 |
|---|---|---|
| 角色立绘 | `src/art.js` 用代码画的矢量图（720×1080 同一画布，所以 208 个"表情×服装"组合天然对齐、体积为 0 字节） | ⭐ 把 PNG 丢进 `assets/characters/` 即可覆盖，见第四节 |
| 背景（20 张） | 仓库内手写 SVG（1600×900） | ⭐ 放同名 PNG 到 `assets/backgrounds/` 并改 `src/ui.js` 后缀 |
| CG（22 张） | 17 张 = 背景 + 程序化立绘 + 特效合成；5 张手绘符号画面 | ⭐ 放同名 PNG 到 `assets/cg/` |
| 音频 | WebAudio 实时合成（8 首 BGM + 9 音效 + 6 环境音） | 需要改 `src/audio.js` |

**为什么默认是程序化矢量**：本作需要 **2 个角色 × (16/14) 种表情 × (6/8) 套服装 = 208 张差分**，
外加 22 张 CG，一套风格统一、且覆盖"冬装/学术/居家/泳装/JK 裙/猫猫美甲"这些剧情的现成立绘包几乎不存在
（下面第三节是实测结果）。矢量方案能保证：所有表情共享同一张脸、所有服装共享同一个身体、无版权风险、离线可用。

---

## 二、三条可选路线（请挑一条，我可以继续配合）

| 路线 | 做法 | 优点 | 代价 |
|---|---|---|---|
| **A. 继续改进程序化矢量**（当前正在做） | 我按你的反馈重画头型/发际线/头肩比/描边与阴影 | 立刻可用、无限表情服装、零版权、完全一致 | 天花板是"干净的动画赛璐璐风"，达不到商业插画质感 |
| **B. 用现成立绘素材包** | 下载合规素材包丢进 `assets/characters/` | 真·插画质感 | 实测：免费包普遍是"1 角色 + 1 服装 + 数种表情"；男女主角需从不同画师处拼 → **画风会打架**，且冬装/JK/泳装等剧情差分无人提供 |
| **C. 委托画师 / AI 生成** | 按第五节清单产出 208 张差分（或至少"每套服装 × 6 种主表情"约 90 张） | 唯一能达到"精致自然"的路 | 需要成本/时间；AI 需保证同一角色的脸一致 |

> 我的建议：**A 先顶着（保证游戏完整可玩）+ 同时按 C 的清单去委托或生成**，产出多少张就覆盖多少张，
> 剩下的自动回退到矢量版——两者可以混用，不会缺图也不会报错。

---

## 三、已验证的合规素材源（本机实测）

| 来源 | 许可证 | 实测结果 |
|---|---|---|
| [Codel Visual Novel Sprite](https://opengameart.org/content/codel-visual-novel-sprite)（OpenGameArt） | **CC-BY 4.0**（需署名） | ✅ 已实测下载成功（15.1 MB，12 张 PNG，1078×2089，**1 角色 / 1 服装 / 7 表情+脸红**，半写实女性） |
| [OpenGameArt 2D 角色检索](https://opengameart.org/art-search-advanced?keys=&field_art_type_tid%5B%5D=9) | 逐项查看（CC0 / CC-BY / CC-BY-SA / GPL 都有） | ✅ 站点可访问、可下载 |
| [OpenGameArt「Ren'Py: Assets」合集](https://opengameart.org/content/renpy-assets) | 逐项查看 | ✅ 可访问（视觉小说向素材集中在这里） |
| [spritecook-free-game-assets](https://github.com/cellinlab/spritecook-free-game-assets)（GitHub） | **CC0**（可商用免署名） | ✅ 仓库可下载，但内容是**像素/奇幻角色**（骑士、猫武士一类），不是日系立绘 |
| itch.io / BOOTH / sutemo | 各家不同 | ❌ 本机网络不可达（实测 HTTP 000），需要你手动下载后放进目录 |
| 商业素材（DLsite / Booth 付费立ち絵） | 购买时附带授权 | 需要你自购；买完按第四节命名放进目录即可 |

⚠️ **署名义务**：若采用 CC-BY 素材，游戏内需要加一行署名（我可以加到标题界面与 README 的"素材来源"一节）。
⚠️ **不要**直接从 Google 图片、Pinterest、pixiv 抓图 —— 那些不能商用也不能再分发。

---

## 四、丢进去就能用：位图立绘契约

**目录与命名**
```
assets/characters/ya/smile@casual.png     ← 雅 · 微笑 · 日常装（只对这一种组合生效）
assets/characters/ya/smile@any.png        ← 雅 · 微笑（全部服装都用它，没单独画服装时用）
assets/characters/ya/smile.png            ← 等价于 @any
assets/characters/jin/nails@nails.png     ← 金 · 猫猫美甲表情 · 美甲差分
```
- **尺寸**：建议 720×1080（任何 2:3 比例都行，引擎按比例缩放）
- **背景**：透明（PNG 带 alpha）
- **对齐**：人物**底部贴齐图片底边**、水平居中（和程序化立绘同基准，所以能在同一场景无缝混用）
- **表情名 / 服装名**：只能取下表里的 id，写错会被工具跳过并提示

**三个命令**
```bash
npm run build:sprites     # 扫描 assets/characters/ 生成 assets/sprites.js（必须运行才生效）
npm run check:sprites     # 校验尺寸/透明通道，并打印 208 组合的覆盖情况
# 然后刷新浏览器即可（无需改任何代码）
```

**背景 / CG 替换**：把同名 PNG（1600×900）放进 `assets/backgrounds/` 或 `assets/cg/`，
然后把 `src/ui.js` 里拼接的 `.svg` 后缀改成 `.png`（一处即可，我可以代劳）。

---

## 五、208 组合清单（画师/AI 按此产出；打 ✅ 的是已由位图覆盖）

### 5.1 狗狗雅（158cm · 小巧可爱 · 16 表情 × 6 服装 = 96）
识别特征（每张都必须有）：**鼻梁两侧一层很淡的小雀斑**（正面可见，不要画成满脸）、**左侧银色发夹**（观者右侧）、左手腕红绳、及肩内扣黑发。

| 表情 \ 服装 | 日常 | 冬装 | 学术（衬衫西装＋细框眼镜） | 居家卫衣 | 泳装 | 连衣裙 |
|---|---|---|---|---|---|---|
| **平静** `neutral` | `neutral@casual.png` | `neutral@winter.png` | `neutral@academic.png` | `neutral@home.png` | `neutral@swim.png` | `neutral@dress.png` |
| **微笑** `smile` | `smile@casual.png` | `smile@winter.png` | `smile@academic.png` | `smile@home.png` | `smile@swim.png` | `smile@dress.png` |
| **笑出来** `laugh` | `laugh@casual.png` | `laugh@winter.png` | `laugh@academic.png` | `laugh@home.png` | `laugh@swim.png` | `laugh@dress.png` |
| **害羞** `shy` | `shy@casual.png` | `shy@winter.png` | `shy@academic.png` | `shy@home.png` | `shy@swim.png` | `shy@dress.png` |
| **脸红** `blush` | `blush@casual.png` | `blush@winter.png` | `blush@academic.png` | `blush@home.png` | `blush@swim.png` | `blush@dress.png` |
| **坏笑** `tease` | `tease@casual.png` | `tease@winter.png` | `tease@academic.png` | `tease@home.png` | `tease@swim.png` | `tease@dress.png` |
| **鼓腮** `pout` | `pout@casual.png` | `pout@winter.png` | `pout@academic.png` | `pout@home.png` | `pout@swim.png` | `pout@dress.png` |
| **惊讶** `surprised` | `surprised@casual.png` | `surprised@winter.png` | `surprised@academic.png` | `surprised@home.png` | `surprised@swim.png` | `surprised@dress.png` |
| **担心** `worried` | `worried@casual.png` | `worried@winter.png` | `worried@academic.png` | `worried@home.png` | `worried@swim.png` | `worried@dress.png` |
| **难过** `sad` | `sad@casual.png` | `sad@winter.png` | `sad@academic.png` | `sad@home.png` | `sad@swim.png` | `sad@dress.png` |
| **哭** `cry` | `cry@casual.png` | `cry@winter.png` | `cry@academic.png` | `cry@home.png` | `cry@swim.png` | `cry@dress.png` |
| **认真** `serious` | `serious@casual.png` | `serious@winter.png` | `serious@academic.png` | `serious@home.png` | `serious@swim.png` | `serious@dress.png` |
| **困** `sleepy` | `sleepy@casual.png` | `sleepy@winter.png` | `sleepy@academic.png` | `sleepy@home.png` | `sleepy@swim.png` | `sleepy@dress.png` |
| **得意** `proud` | `proud@casual.png` | `proud@winter.png` | `proud@academic.png` | `proud@home.png` | `proud@swim.png` | `proud@dress.png` |
| **兴奋** `excited` | `excited@casual.png` | `excited@winter.png` | `excited@academic.png` | `excited@home.png` | `excited@swim.png` | `excited@dress.png` |
| **温柔** `soft` | `soft@casual.png` | `soft@winter.png` | `soft@academic.png` | `soft@home.png` | `soft@swim.png` | `soft@dress.png` |


### 5.2 羊羊金（183cm · 高大男生 · 14 表情 × 8 服装 = 112）
识别特征（每张都必须有）：**右眉尾一道浅旧疤**（观者右侧）、左手腕旧腕表、黑色短乱发、黑框眼镜（日常/格纹/居家/美甲时戴）。

| 表情 \ 服装 | 日常 | 格纹衬衫 | 冬装 | 白衬衫 | 泳装 | JK 裙 | 猫猫美甲 | 居家卫衣 |
|---|---|---|---|---|---|---|---|---|
| **平静** `neutral` | `neutral@casual.png` | `neutral@plaid.png` | `neutral@winter.png` | `neutral@formal.png` | `neutral@swim.png` | `neutral@jk.png` | `neutral@nails.png` | `neutral@home.png` |
| **微笑** `smile` | `smile@casual.png` | `smile@plaid.png` | `smile@winter.png` | `smile@formal.png` | `smile@swim.png` | `smile@jk.png` | `smile@nails.png` | `smile@home.png` |
| **害羞** `shy` | `shy@casual.png` | `shy@plaid.png` | `shy@winter.png` | `shy@formal.png` | `shy@swim.png` | `shy@jk.png` | `shy@nails.png` | `shy@home.png` |
| **尴尬** `awkward` | `awkward@casual.png` | `awkward@plaid.png` | `awkward@winter.png` | `awkward@formal.png` | `awkward@swim.png` | `awkward@jk.png` | `awkward@nails.png` | `awkward@home.png` |
| **发呆** `blank` | `blank@casual.png` | `blank@plaid.png` | `blank@winter.png` | `blank@formal.png` | `blank@swim.png` | `blank@jk.png` | `blank@nails.png` | `blank@home.png` |
| **惊讶** `surprised` | `surprised@casual.png` | `surprised@plaid.png` | `surprised@winter.png` | `surprised@formal.png` | `surprised@swim.png` | `surprised@jk.png` | `surprised@nails.png` | `surprised@home.png` |
| **慌张** `panic` | `panic@casual.png` | `panic@plaid.png` | `panic@winter.png` | `panic@formal.png` | `panic@swim.png` | `panic@jk.png` | `panic@nails.png` | `panic@home.png` |
| **眼眶红** `moved` | `moved@casual.png` | `moved@plaid.png` | `moved@winter.png` | `moved@formal.png` | `moved@swim.png` | `moved@jk.png` | `moved@nails.png` | `moved@home.png` |
| **哭** `cry` | `cry@casual.png` | `cry@plaid.png` | `cry@winter.png` | `cry@formal.png` | `cry@swim.png` | `cry@jk.png` | `cry@nails.png` | `cry@home.png` |
| **认真** `serious` | `serious@casual.png` | `serious@plaid.png` | `serious@winter.png` | `serious@formal.png` | `serious@swim.png` | `serious@jk.png` | `serious@nails.png` | `serious@home.png` |
| **困** `sleepy` | `sleepy@casual.png` | `sleepy@plaid.png` | `sleepy@winter.png` | `sleepy@formal.png` | `sleepy@swim.png` | `sleepy@jk.png` | `sleepy@nails.png` | `sleepy@home.png` |
| **温柔** `soft` | `soft@casual.png` | `soft@plaid.png` | `soft@winter.png` | `soft@formal.png` | `soft@swim.png` | `soft@jk.png` | `soft@nails.png` | `soft@home.png` |
| **愧疚** `guilty` | `guilty@casual.png` | `guilty@plaid.png` | `guilty@winter.png` | `guilty@formal.png` | `guilty@swim.png` | `guilty@jk.png` | `guilty@nails.png` | `guilty@home.png` |
| **笑出来** `laugh` | `laugh@casual.png` | `laugh@plaid.png` | `laugh@winter.png` | `laugh@formal.png` | `laugh@swim.png` | `laugh@jk.png` | `laugh@nails.png` | `laugh@home.png` |


---

## 六、AI 生成提示词模板（保证同一张脸）

**第一步：先定角色定妆照（不要一次生成 208 张）**

雅（基础提示词，锁死后再做差分）：
```
anime visual novel character sprite, full upper body, standing, facing viewer slightly 3/4,
petite cute young woman, 158cm, slim shoulders, oval face with soft jaw, big warm brown eyes,
shoulder-length black hair with inward-curled ends, straight bangs, one small silver hairpin on her left side,
a small beauty mark just below her left eye, fair skin, light blush, thin silver necklace, thin red string on left wrist,
cream chunky-knit cardigan over a light blue top, transparent background, clean cel shading, soft studio light,
720x1080, no text, no watermark
```
金（基础提示词）：
```
anime visual novel character sprite, full upper body, standing, facing viewer slightly 3/4,
tall young man, 183cm, broad shoulders, clear jawline, black short messy hair, gentle but slightly blank eyes,
a faint old scar at the tail of his right eyebrow, black-framed glasses, dark hoodie over a black jacket,
an old worn wristwatch on his left wrist, transparent background, clean cel shading, soft studio light,
720x1080, no text, no watermark
```
**第二步：只替换情绪与服装片段**（其余全部保持不变，并固定同一个 seed / 同一张参考图）
- 情绪片段：`expression: smiling with eyes curving into crescents` / `expression: laughing, eyes closed in happy arcs` /
  `expression: shy, blushing to the ears, looking away` / `expression: crying, tears on lashes` /
  `expression: serious, focused, wearing thin-rimmed glasses` / `expression: sleepy, half-lidded eyes` …
- 服装片段：`outfit: white puffer jacket with a grey-pink scarf and a round knit beanie`（雅·冬装）/
  `outfit: light blue shirt under an oatmeal blazer, thin-rimmed glasses`（雅·学术）/
  `outfit: white and light-blue two-piece swimwear with a wide straw hat`（雅·泳装）/
  `outfit: oversized hoodie, hair tied up in a small bun`（雅·居家）/
  `outfit: he is wearing a JK sailor-style skirt set, embarrassed, looking away`（金·JK）/
  `outfit: both hands raised to chest showing nail art, right hand cute pink cat nails, left hand matte black`（金·美甲）
**第三步**：裁成 720×1080、抠成透明底、按第四节的命名放进目录。

---

## 七、委托画师时的交付清单（可直接复制给画师）

- **用途**：个人向视觉小说（非商业 / 或注明商用范围），需要 **2 个角色**的立绘差分
- **交付格式**：PNG 透明底，720×1080（或 2160×3240 后缩），**底部对齐、水平居中**，人物在半身像内裁切
- **角色设定**：雅（158cm 娇小女生）/ 金（183cm 高大男生），细节见 §五 的识别特征
- **表情**：雅 16 种、金 14 种（清单见 §五，中文含义见 `STORY_SPEC.md` §2）
- **服装**：雅 6 套、金 8 套（含金穿 JK 裙、以及"双手抬起的猫猫美甲"两套特殊差分）
- **优先级**（预算有限时按此顺序）：① 两人的日常装 6 种主表情（neutral/smile/shy/surprised/moved/cry）
  ② 冬装（第一次见面、南阳、机场离别都是冬装，用量最大）③ JK/美甲 两套特殊差分 ④ 学术装（苏州）⑤ 泳装（三亚）⑥ 居家
- **另需 CG 22 张**（清单见 `assets/manifest.json` 的 `type:"cg"`，每项都带构图说明与尺寸）

---

## 八、常见问题

- **只画了一部分怎么办？** 没关系，没画的自动用程序化立绘，工具会告诉你缺哪些（`npm run check:sprites`）。
- **画风不统一怎么办？** 同一场景尽量只用同来源的图；混用会看得出来（引擎不做画风统一）。
- **能只换表情不换衣服吗？** 能，用 `表情@any.png` 即可覆盖该表情的**全部**服装。
- **背景能不能也换成照片/插画？** 能，见第四节末尾；照片建议加一层统一调色（游戏已有 `#grade-layer` 负责这一步）。
