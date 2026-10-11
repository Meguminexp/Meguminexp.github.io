# 手部 / 美甲插图：素材考察与改造记录（2026-10-11）

本文档只记录**手部特写**这件事：`src/art.js` 的 `handSVG(kind)`、游戏内手部特写层、
以及 CG `assets/cg/cg_nail_art.svg`。角色立绘的来源与许可见
[`assets/characters/CREDITS.md`](characters/CREDITS.md)。

---

## 一、结论（先说）

| 项目 | 结果 |
|---|---|
| 采用路线 | **路线 2：重画**（`src/art.js handSVG()` v4，纯矢量、随本项目 MIT） |
| 是否新增第三方素材 | **没有**。`assets/hands/` 未创建，项目里除 30 张 CC0 立绘外仍无第三方素材 |
| 路线 1（找真实照片/插画）为什么没走 | 见下面第二节：本机网络可达的两个图库（OpenGameArt、GitHub API）里**没有**能用的手 / 美甲素材；照片站与 Wikimedia 全部不可达 |
| 署名义务 | 无（本方案全部为本项目自绘） |

---

## 二、路线 1 的真实素材考察记录（全部实测，2026-10-11）

### 2.1 网络可达性（`curl -sL --max-time 25 -o /dev/null -w "%{http_code}"`）

| 站点 | HTTP | 结论 |
|---|---|---|
| `opengameart.org`（含 `/sites/default/files/...` 直链） | **200** | 可达，唯一能下载到图的可达图库 |
| `github.com` | **200** | 可达（但只有 HTML 页面） |
| `api.github.com` | **200** | 可达；`/repos/<o>/<r>/contents/<path>` 能取到 base64，是 GitHub 上图片的唯一通路 |
| `raw.githubusercontent.com` | **000** | 不可达（与 `CREDITS.md` 早先记录一致，本次复测仍为 000） |
| `upload.wikimedia.org`、`commons.wikimedia.org` | **000** | 不可达（本次复测） |
| `huggingface.co`、`cdn-lfs.huggingface.co` | **000** | 不可达 |
| `itch.io` / `booth.pm` / `sutemo.com` / `unsplash.com` / `pexels.com` / `pixiv` | **000** | 不可达（`CREDITS.md` 已记录，未再浪费时间） |

> 结论：**照片站（Unsplash / Pexels）与维基共享资源在本机都拿不到**，
> 而唯一可达的 OpenGameArt 是"像素/图标/低分辨率游戏素材"库，没有照片级或赛璐璐手部插画。

### 2.2 OpenGameArt 逐条考察（按 `license-name` 字段核对许可证）

搜索关键词：`hand` / `hands` / `nail` / `manicure` / `holding-hand` / `fist` / `finger` / `handshake` / `arm+hand`（`art-search-advanced`，2D art 分类）。

| 素材 | 作者 | 许可证 | 为什么不能用 |
|---|---|---|---|
| [Lo Fi First Person Hand](https://opengameart.org/content/lo-fi-first-person-hand) | — | **CC0** | 直链 `sites/default/files/lofifirstpersonhand.png` 实测只有 **58×36 px**（第一人称 3D 手），分辨率与视角完全不可用 |
| [2D Finger](https://opengameart.org/content/2d-finger) | — | **CC0** | 像素风"手指图标"，不是手 |
| [Thumbs Up and Down](https://opengameart.org/content/thumbs-up-and-down) | dagobert83 | **CC0** | 图标集合，无手掌/指甲结构 |
| [Caster's hand](https://opengameart.org/content/casters-hand) | — | **GPL 2.0 / 3.0** | 许可证与本项目（MIT）不兼容；且是奇幻法师之手 |
| [handshake](https://opengameart.org/content/handshake) | — | CC0 | **音频**（配乐），不是图 |
| `nail` / `manicure` 关键词 | — | — | 命中的是"nail gun（射钉枪）""tooth and nail"等无关素材，**没有任何美甲素材** |
| `hand` / `hands` / `finger` 关键词其余结果 | — | — | 全部是 RPG 像素图集、图标、UI 组件、3D 模型（`low-poly-arms-rigged` 等） |

### 2.3 为什么"就算找到真手照片也不该直接用"

- 本项目**唯一的位图美术**是 30 张 OpenGameArt 的二次元立绘（限色平面 + 细线，见 `CREDITS.md`），
  场景/CG/UI 全部是手写 SVG。往一张平涂赛璐璐画面里塞一张照片级的手，
  会出现**质感、光照、边缘、色温**四重落差，比"画得不好"更刺眼。
- 真要缓解：需要降饱和 + 高斯模糊 + 与场景色调混合 + 手动抠图 + 边缘描线，
  经过这一串加工后它已经**不再是"真实素材"，而是一张糟糕的重绘**，而且平白多出一条署名义务。

**因此本项目选择重画**，并把几何写清楚（下面第三节），让它可维护、可继续改。

---

## 三、路线 2：`handSVG()` v4 的画法与几何契约

### 3.1 旧版到底怪在哪

1. 手掌是**一个椭圆**，四根手指是**四个互不相连的锥形块**贴上去 ⇒ 读起来是"面包 + 五根香肠"；
2. 指甲是个**尖三角**（像彩色铅笔尖），没有甲床/月牙/反光；
3. `hold` 那张叠了一只**悬空的手表**（画在手背上，不是手腕上）和一道红色曲线；
4. 所有形状都画在画布中心，但 `#hand-layer` 是 `preserveAspectRatio="xMidYMid slice"`
   铺满 16:9 舞台 ⇒ 玩家实际只看得到画布中间那条横带，
   旧图因此被裁成"只有半个大椭圆"，构图完全失控。

### 3.2 v4 的画法（解剖分层）

```
拇指 · 四指（锥形指节 + 半圆指尖）
  → 手背（掌指关节脊线，盖住全部指根，指间留出 V 形指蹼）
  → 剪影遮罩投影（剪影 − 反向偏移的剪影 = 右下侧一圈 cel 阴影）
  → 自上而下的柔和体积阴影（linearGradient + 剪影遮罩）
  → 指节褶 / 手背肌腱线 / 桡侧高光
  → 指甲（甲床 + 月牙 + 甲油反光 + 磨砂黑银线 / 猫猫款）
```

- **局部坐标系**（背侧视角）：原点 = 掌指关节连线中点；x 向右、y 朝手腕为正；
  四指朝 −y 长出（中指最长，食指 145 / 中指 161 / 无名指 150 / 小指 116 单位），
  拇指朝左上；手腕一直画到 y=980。
- **构图安全带**：`#hand-layer` 的可见画布范围只有 y ∈ [337.5, 742.5]，
  所有构图都压在这条 405 单位高的横带里；手腕在 y>980 处自然出画布，
  **不会再出现"被切断的手"**，也因此**没有位置放腕表/红绳** ——
  旧版那只"悬空手表"就是这么来的，v4 直接去掉（角色识别特征仍保留在立绘与文字里）。
- **配色取自同源调色板**：雅 `#FBE7DA / #EFCDBB`、金 `#F6E2D2 / #E4C6B0`（= `src/art.js` 的 `C.ya / C.jin`），
  描边 `#C99A88 / #C0917F`，因此和位图立绘同色系。

### 3.3 四种 kind（+1 新增）

**单手**：

| kind | 画面 | 用在 |
|---|---|---|
| `hold` | 两只手（金在左、雅在右，手指交叠、雅的拇指压在金手背上），**素甲** | 60 个节点的默认值 |
| `cat_nails` | 一只手，粉底 + 猫脸 + 小卷尾 | `c10_24` |
| `cool_nails` | 一只手，磨砂黑；**只有中指那一片甲面有一条很细的银线**（剧本 c8_90 原文"只有中指上一条很细的银线"），其余黑甲只有哑光高光 | `cg_nail_art` 右半边 |
| `butterfly_one` | 一只手，**穿戴甲**：粉底 + 每片甲面一只粉蝴蝶 | 第 9 章"抬手看自己一只手"的镜头 |
| `gift` | 手背在卡片后、指节与拇指压住明信片前沿 | `c10_13` |

**两只手（同一个底稿，只换指甲 —— 供"美甲选项"用）**：
画面左 = 左手、画面右 = 右手（金是第一人称视角）。这几个 kind 的手型、**肤色**、构图、手指角度**完全一致**
（这一整段都是"金低头看自己的两只手"，所以**两只手同一套肤色**，只靠 ±20° 的左右旋转区分），
所以玩家在同一个场景里换选项时，只有甲油和图案会变，不会出现"换了只手"或"换了个人"的感觉。

| kind | 左手 | 右手 | 说明 |
|---|---|---|---|
| `both_cat` | 玫瑰粉 `#F9BCC9` + 猫脸 + **小肉垫** | 樱花粉 `#F5A6B4` + 猫脸 + **卷尾巴** | 两只都是猫猫款，**全图没有黑色** |
| `both_nails` | 磨砂黑 `#33333A`（**仅中指一条银线**） | 樱花粉 `#F5A6B4` + 猫脸 + 卷尾巴 | 一猫一黑；**= `mixed_right_cat`** |
| `mixed_right_cat` | 磨砂黑（仅中指一条银线） | 猫猫款 | 与 `both_nails` 完全等价（同名产物逐字节一致） |
| `mixed_left_cat` | 玫瑰粉猫猫款 | 磨砂黑 `#2A2A31`（仅中指一条银线） | 与上一行左右互换 |
| `both_cool` | 磨砂黑 `#33333A`；**仅中指一条银线** | 磨砂黑 `#2A2A31`；**仅中指一条银线** | 两只都是酷黑款，**全图没有粉色** |
| `butterfly_nails` | 奶粉 `#F9C6D5` + **粉蝴蝶**（每片指甲一只，翅上白点 + 触角） | 甜粉 `#F4A9BE` + **粉蝴蝶** | **穿戴甲**（第 9 章义乌段落）：两只手都是粉、每片甲面一只蝴蝶，**全图没有黑、没有银线** |

> 第 8 章那套（猫猫 / 磨砂黑）与第 9 章义乌那段（穿戴甲 / 蝴蝶）是**两套完全不同的设计**，
> 前者只出现在 `cat_nails / cool_nails / both_cat / both_cool / both_nails / mixed_*`，
> 后者只出现在 `butterfly_nails`，两者不会混。

> 未知 `hand:` 值（含写错一个字母）一律回退 `hold`，不会静默变成"递明信片"。

### 3.4 CG 合成

`cg_nail_art.svg` 由**独立脚本** `tools/build-nail-cg.js` 生成（只生成这一张，
不会连带重建其它 16 张合成 CG；`tools/build-cg.js` 里那一段改为一行 `require` 委托）。
- 运行：`node tools/build-nail-cg.js`
- 定位方式：用每只手在 720×1080 画布里的锚点（掌指关节连线中点）做
  `translate(tx ty) rotate(r) scale(k) translate(-ax -ay)`。

---

## 四、没有做的事（诚实声明）

- **没有使用任何第三方手部素材**，所以本文件不构成署名义务的变更。
- **没有改剧本**（`src/story/chapter*.js` 由并行任务维护）。因此
  "第 8/9 章的美甲节点仍在用默认 `hold`"这个问题**只是报告，没有接线**。
