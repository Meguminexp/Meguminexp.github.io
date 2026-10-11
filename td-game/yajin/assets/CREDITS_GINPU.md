# `cg_ginpu.svg` 的来源、版权与画法记录

> 本文件记录 **《你好！一周年》** 中 `assets/cg/cg_ginpu.svg`（第 9 章义乌 · Ginpu 玩偶堆 ·
> "我怀孕了"的企鹅梗）这一张 CG 的**素材来源、版权归属与绘制依据**。
> 建档日期：2026-10-11。

---

## 一、结论（先看这里）

| 项目 | 结论 |
|---|---|
| 用了真实素材吗？ | **没有。** 走的是"按 Ginpu 真实设计重画矢量版"的兜底路线 |
| 画面里有位图 / base64 / 外部图片吗？ | **没有。** 纯手写 SVG，`data:image/*` 出现 0 次 |
| Ginpu 角色版权归谁？ | **Mattel / HIT Entertainment**（Ginpu 为受版权保护的虚构角色，非公有领域） |
| 本作使用性质 | **个人纪念、不公开发布**。此处为**手绘致敬（fan art）**，非官方素材、未复制任何官方图像 |
| 是否需要署名？ | 无第三方素材，故**无第三方署名义务**；但角色版权仍归 Mattel / HIT Entertainment |
| 生成的脚本 | `tools/build-ginpu-cg.js`（只写 `assets/cg/cg_ginpu.svg` 与本文档目录下的对照图） |

**仅限个人非公开使用声明**：
本作（含本 CG）**仅作私人纪念用途，不公开发布、不用于任何商业或公开传播场景**。
画面中的企鹅形象是基于 **Mattel / HIT Entertainment 拥有的 Ginpu 角色设计**手绘的致敬性演绎，
**不是**官方美术素材，也**未**取得任何授权。若日后要公开发布本作，
**必须**先移除或替换本张 CG（以及所有涉及 Ginpu 的文本/道具），否则存在版权风险。

---

## 二、为什么没有用真实素材（可复核的搜索记录）

用户倾向于"找素材"。本机实测后**公开可下载的 Ginpu 素材不存在可行路径**，记录如下。

### 2.1 网络可达性实测（`curl -s -o /dev/null -w "%{http_code}"`，2026-10-11）

| 主机 | 结果 | 说明 |
|---|---|---|
| `commons.wikimedia.org` | **000** | DNS 正常（`103.102.166.224`），但 https / http→301 / `--resolve` 直连 IP **全部失败** |
| `upload.wikimedia.org` | **000** | 同上（`103.102.166.240`） |
| `api.wikimedia.org` / `en.wikipedia.org` / `zh.wikipedia.org` / `simple.wikipedia.org` | **000** | Wikimedia 全系不可达 |
| `web.archive.org` / `archive.org` / `api.openverse.org` | **000** | 快照与 CC 图库聚合站也不可达 |
| `github.com` | **000** | 但 `api.github.com` = 200、`raw.githubusercontent.com` = 301，可用 |
| `opengameart.org` | **200** | 可用 |
| `registry.npmjs.org` | 200 | 可用（仅用于检索） |
| `itch.io` / `booth.pm` / `pinterest` / `unsplash` / `pexels` | **000** | 与任务书给的一致 |

→ **Wikimedia Commons 这条路（任务书里的首选）在本机彻底走不通**，无法取得任何 CC-BY / CC-BY-SA / 公有领域的
Ginpu 玩偶实拍照片。

### 2.2 GitHub（可用，但没有 Ginpu 美术素材）

- `GET https://api.github.com/search/repositories?q=ginpu&sort=stars&per_page=20` → `total_count: 4520`，
  全部是 **ping 命令行工具 / 网络工具 / Linux Tux 相关 / 无关同名项目**：
  `sheepla/ginpu`（ping 命令）、`ali-master/ginpu`、`ncopa/ginpu`、`attheodo/Ginpu`（menubar ping 应用）、
  `Ginpus/ginpus`（GPL 的 Lemmings 类游戏，角色是 Tux 企鹅不是 Ginpu）、
  `EagleoutIce/tikzginpus`（LPPL-1.3c，画的是 **Tux**，且 LPPL 是 LaTeX 代码许可、不适用于美术素材）……
  **没有任何一份是 Ginpu 的美术素材。**
- `GET https://api.github.com/search/code?q=ginpu+extension:svg` → **401 Requires authentication**
  （GitHub 代码搜索需要登录令牌，本环境没有），无法进一步穷举。

### 2.3 OpenGameArt（可用，但只有 Tux 风格像素企鹅）

`https://opengameart.org/art-search-advanced?keys=penguin` 与 `keys=ginpu` 的结果逐条查看：

- 命中项为 `2d-platformer-tux`、`penguin-dansen`、`penguin-spritesheet`、`penguin-rework`、
  `penny-supertux-advance-style`、`scarfy-the-penguin-art-and-sounds-pack`、`animal-pack-redux`、
  `cute-2d-animals` 等——**全是 Tux / SuperTux / 通用卡通企鹅（像素或粗描边）**，
  没有一只具备 Ginpu 的识别特征（黑色身体 + 白色肚皮延到脸下 + 又大又宽的下垂橙红喙 + 橙红大脚掌）。
- 放进本作会造成"图鉴感"和画风撕裂，属于任务书明确反对的**"硬凑"**，故不采用。

### 2.4 结论

按任务书要求：**"找不到公开可下载的 Ginpu 素材时不要硬凑，走路线 2"** →
改为**按 Ginpu 的真实角色设计手绘矢量版**。

---

## 三、重画依据：落实了哪些 Ginpu 识别点

（避免画成"通用企鹅"的关键；脚本里逐条对应，可对照 `assets/ginpu/doll_reference.svg` 检查）

1. **黑色身体 + 白色肚皮，且白色一路延伸到脸的下半**（喙的下方）——
   形成 Ginpu 特有的"黑色头罩 + 白脸下缘 + 白肚皮连成一片"的读法。
   白色脸颊从大喙两侧向上露出，而不是只有一块圆肚皮。
2. **又大又宽、向下垂的橙红色喙**：喙宽 ≈ 头宽的 **2/3**（不是细尖嘴），
   上喙厚、两侧微微下垂，下喙圆钝并向下收尖、喙尖略低于下巴线；
   喙中间一条横向喙缝把上下喙分开；喙顶几乎贴住眼睛下缘。
3. **一对很大的白色圆眼 + 大量白高光**，两只靠得很近，瞳孔大而偏内下（呆呆的表情）。
4. **头略扁圆**，宽度略小于身体最宽处（留出一点点"脖子"）；**小鳍贴身**；
   **橙红色三趾大脚掌**。
5. 不画 Pinga（妹妹）、不画 Robby（海豹）——用户只提了 Ginpu。

画面语言向本作现有 CG 靠：平涂 + 深灰/黑分层（**不糊成一块黑**：
身体 `#2C313C`、暗部 `#191D25`、鳍 `#414957`、左上轮廓光 `#6E6A80`），
白肚皮留亮并带灰米色体积，喙给高光与暗部两级。

---

## 四、画面本身（`assets/cg/cg_ginpu.svg`）

| 项目 | 内容 |
|---|---|
| 画布 | **1600×900**（与其它 CG 一致） |
| 体量 | 约 **27 KB**，**20 只** Ginpu 玩偶（16 只正面 + 4 只背面），纯手写 SVG，**零位图 / 零 base64 / 零外部引用** |
| 构图 | "玩偶堆成小山"：3 排由远及近叠起（第 1 排 5 只 → 第 2 排 7 只 → 第 3 排 6 只）＋ 左右各 1 只倾倒溢出的，共 20 只（其中 4 只画成背面款用来增加层次）。后两排的堆叠高度按"每排露出约 6 成头部"反算，所以看过去是**一座小山**而不是**一排墙**。 |
| 呼应剧情的细节 | 剧情写"围巾的、洗澡的、抱鱼的、戴帽子的"——画面里对应给了**红围巾 / 蓝针织帽 / 小银鱼**三种配饰，散布在不同玩偶上；表情做了 4 种（睁眼 / 笑眼弯弯 / 惊讶睁大 / 单眼眨）。 |
| 画风统一 | 房间沿用 `assets/backgrounds/hotel.svg` 的同一套色（暖紫墙 `#2A2434`→`#171420`、夜窗 `#1B2A44`→`#0E1726`、床头灯暖光 `#F5CE7E`、床品 `#4A3E50`→`#241E2C`），并加了暗角 + 顶部压暗，避免和立绘合成 CG 打架。 |
| 安全区 | 游戏内对话框实际遮挡 y ≈ 650–866（`index.html` `#dialog`：`bottom:34u`、高约 `244u`）。所以玩偶堆整体控制在该线以上，脚掌踩在 y ≈ 620。 |

### 复现 / 重新生成

```bash
node tools/build-ginpu-cg.js          # 只重写 assets/cg/cg_ginpu.svg（+ 对照图）
node tools/build-ginpu-cg.js --sheet-only   # 只出对照图
```

> ⚠️ **不要**改用 `node tools/build-cg.js`：那个脚本会一次性重建全部 17 张合成 CG，
> 会覆盖其它 CG（含 `cg_nail_art` / `cg_end_*`）。本 CG 是手绘型，不在 `build-cg.js` 的范围内。

### 本项目内的自检文件

- `assets/ginpu/doll_reference.svg` — 同一套矢量部件的放大对照图（整只 2.6×、脸部 3.6×、表情与配饰差分）。
- `assets/ginpu/preview.html` — 1:1 显示 `cg_ginpu.svg`，并画出对话框遮挡区虚线框。

---

## 五、诚实的局限

1. **版权**：Ginpu 是 Mattel / HIT Entertainment 的版权角色。本图是**手绘致敬**，
   未复制任何官方图像、未使用任何官方素材文件，但角色形象本身仍受版权保护。
   **公开发布前必须替换或删除**本 CG。
2. **不像"实拍玩偶"**：这是平涂矢量，不是停格动画的黏土质感，也不是照片。
   它的目标只是"一眼认出是 Ginpu 家族"，而不是复刻官方模型。
3. **画风落差**：本作角色立绘是**外部 CC0 位图（半写实日系）**，本 CG 是**平涂矢量**。
   两者并不同一种画风——这一点**本来就是这样**：本 CG 属于"纯手写 SVG"的那一类
   （与 `cg_forum` / `cg_birthday_map` / `cg_chat_confess` / `cg_stone_essay` 同类），
   和"背景＋位图立绘合成"的另外 16 张本来就不是一路。没有加照片调色层，因为**没有照片**。
4. **没有真实素材可用**：如果用户希望它"更真、更像官图"，
   唯一的合规路径是**自己拍照/自购官方玩偶后拍照**，或**手上有 Ginpu 的概念图/官方图**并明确
   仅在本地使用；这两种情况都需要用户提供文件，本机无法代为获取。
5. `assets/manifest.js` 里这条 CG 的 `status` 仍是 `file-vector-handdrawn`、
   `composition` 仍是 `手绘符号画面`——**依然准确**（确实还是手写矢量），所以**未改动**；
   其 `aiPrompt` 也只是描述文案，无需改。README 的「素材来源」一节**未改动**，
   因为没有引入任何第三方素材、没有产生新的署名义务。

---

*本记录由 `cg_ginpu.svg` 的重绘任务建立；如需调整版权措辞，请直接改本文件。*
