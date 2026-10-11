# 角色立绘素材来源 / Character Art Credits

《你好！一周年》的**位图角色立绘**来源、许可证与加工方式记录。
本文档对应 `assets/characters/ya/` 与 `assets/characters/jin/` 下的 30 张 PNG（雅 16 张、金 14 张）。

- 记录日期：**2026-10-11**
- 抓取方式：`curl -sL` 直接下载 OpenGameArt 的直链 zip
- 加工脚本：`assets/characters/rebuild-sprites.py`（可重现整个流程）

---

## 一、游戏内需要显示的署名文字

```text
Character art: FALLiNG_AiR (https://opengameart.org/content/visual-novel-character-sprite), CC0 1.0 Public Domain
```

> **说明**：本素材包在 OpenGameArt 上声明为 **CC0 1.0（公有领域奉献）**，CC0 在法律上**不要求署名**。
> 上面这行是出于尊重与可追溯性而保留的署名文字；游戏目前**不会公开发布**，
> 该行文字以本文档 + `README.md` §「素材来源」的形式记录，**未写入游戏标题界面**。

---

## 二、最终采用的素材包

| 项目 | 内容 |
|---|---|
| 素材包名称 | **VIsual novel Character Sprite**（OpenGameArt 投稿，压缩包文件名 `character_5.zip`） |
| 来源页面 | https://opengameart.org/content/visual-novel-character-sprite |
| 直链（已实测可下载） | https://opengameart.org/sites/default/files/character_5.zip |
| 作者 / 投稿者 | **FALLiNG_AiR**（OpenGameArt 用户） |
| 许可证 | **CC0 1.0 Universal（Public Domain Dedication）** —— 页面 `license-name` 字段明确标注 `CC0` |
| 许可证全文 | https://creativecommons.org/publicdomain/zero/1.0/ |
| 是否需要署名 | **不需要**（CC0 无署名义务）；本项目仍主动署名 |
| 是否允许商用 / 修改 / 再分发 | **全部允许**（CC0） |
| 下载日期 | 2026-10-11 |
| 文件校验 | 下载后经 `file` 确认：`Zip archive data, at least v2.0 to extract, compression method=store` |

### 从该包中使用的两个角色

| 游戏角色 | 素材包内目录 | 原始外形 | 原始尺寸 |
|---|---|---|---|
| **雅**（女主，158cm） | `character_5/cha 1/` | 长绿发少女，白色披肩外套 + 灰裙 + 领带 | 2000×3000 PNG（RGBA） |
| **金**（玩家视角，183cm） | `character_5/cha 5/` | 灰白发少年，衬衫 + 背心 + 领带 + 长裤 | 2000×3000 PNG（RGBA） |

两张原图都是 **2000×3000（正好 2:3）**、**8-bit RGBA 透明底**、**正面站姿**，
且同一角色的所有表情差分**画布与站位完全一致**（已逐一比对 alpha 包围盒），
因此换表情时不会出现抖动。

### ⚠️ 诚实声明：关于上游作者

- OpenGameArt 投稿页把**整个投稿**（含 `cha 1` … `cha 5` 五个角色）标记为 **CC0**，投稿者为 **FALLiNG_AiR**。
- 该投稿说明中写明「There are psd files and clipstudio files and pngs. There may be Korean in the layer.」
  （PSD 图层里可能有韩文），提示原始画师可能是韩语圈作者，但**投稿页没有给出上游画师姓名**。
- 也就是说：**许可证（CC0）与投稿者（FALLiNG_AiR）已确认**；
  **上游原始画师身份未能确认**。本项目按 OpenGameArt 页面声明使用；
  如需商用发行，建议先到上述来源页面自行复核一次。

---

## 三、对素材做的加工（均为 CC0 允许的修改）

所有加工都在 `assets/characters/rebuild-sprites.py` 中完成，纯 Python（无第三方库），步骤固定、可重现：

1. **半身取景裁剪**：以角色 alpha 包围盒为基准，取"头顶往上留 2.2% 空白 → 向下截取人物可见高度的 62%"，
   裁成 2:3 比例并锚定在头部中心横向居中 → **720×1080** 输出。
   这样头部落在画框顶部附近、能看到胸/腰，而不是在 2:3 画框里显示成一个很小的全身像。
2. **雅的去色相偏移（hue −150°）**：原作是"绿发 + 灰白"的限色画风，绿发与游戏主题色
   （雅 = `#E8A0A8` 粉）及暖色场景冲突。对每个像素做 HLS 色相旋转 −150°，把绿→粉
   （近灰像素不受影响）。**这是颜色改动，不是换角色。**
3. **金的主题色着色（向 `#8E9BB5` 混合 50%，保持亮度）**：原作是**纯灰度**（取样确认 R=G=B），
   在深色场景里会读成"白色幽灵"。向金的主题色 `#8E9BB5`（蓝灰）做保亮度着色 50%，
   与雅的粉色形成"一对角色"的配色关系。
4. **补腮红**：素材包里**没有任何"脸红 / 害羞"差分**。对雅的 `blush` 与 `shy` 两张输出图，
   在双颊位置程序化叠加一对柔和粉色椭圆（峰值不透明度 0.55，坐标 `x=307/417, y=347, rx=32, ry=18`）。
5. **等比缩放到 720×1080**（alpha 感知：先预乘 alpha 再做区域平均，避免白边）。

> 以上 2/3/4 都是**对 CC0 素材的修改**，CC0 明确允许修改与再分发，无需额外授权。

---

## 四、表情映射表

素材包提供的差分数少于游戏需要的表情数，**没有差分的表情一律复用最接近的一张**
（游戏侧 `assets/sprites.js` 用 `@any` 覆盖全部 6 / 8 套服装，因此 208 个"表情×服装"组合 100% 有图）。

### 雅（ya）—— 16 个表情，来自 10 张原图差分

| 游戏表情 id | 中文 | 使用的原图差分 | 说明 |
|---|---|---|---|
| `neutral` | 平静 | `pl1 concept` | 睁眼、闭嘴 |
| `smile` | 微笑 | `pl1 happy` | 闭眼笑 |
| `laugh` | 笑出来 | `pl1 happy` | ↖ 复用 |
| `shy` | 害羞 | `pl1 blink` | 闭眼 + **程序化腮红** |
| `blush` | 脸红 | `pl1 concept` | 平静脸 + **程序化腮红**（原包无脸红差分） |
| `tease` | 坏笑 | `pl1 plot` | 原作"眼部阴影 + 坏笑"，即素材包里的"得意/算计"表情 |
| `pout` | 鼓腮 | `pl1 angry` | 皱眉 + 咬牙 |
| `surprised` | 惊讶 | `pl1 surprise` | 张嘴 O 形 |
| `worried` | 担心 | `pl1 sad` | ↖ 复用（无单独"担心"差分） |
| `sad` | 难过 | `pl1 sad` | 垂眼 |
| `cry` | 哭 | `pl1 sadhappy` | 带泪 |
| `serious` | 认真 | `pl1 serious` | |
| `sleepy` | 困 | `pl1 blink` | 闭眼（与 `shy` 同源，但**无腮红**） |
| `proud` | 得意 | `pl1 happy` | ↖ 复用（"得意"另有 `plot`，但被 `tease` 占用） |
| `excited` | 兴奋 | `pl1 happy` | ↖ 复用 |
| `soft` | 温柔 | `pl1 concept` | ↖ 复用（与 `neutral` 同源） |

原包还有 10 张 `pl1 w*` 差分（`wangry`/`wblink`/…），它们**自带一条大的绿色"黑气"螺旋覆盖层**，
单独使用会看成异物，因此**全部弃用**。

### 金（jin）—— 14 个表情，来自 8 张原图差分

| 游戏表情 id | 中文 | 使用的原图差分 | 说明 |
|---|---|---|---|
| `neutral` | 平静 | `pl5` | 睁眼、平嘴 |
| `smile` | 微笑 | `pl5 blink` | 闭眼 + 浅笑 |
| `shy` | 害羞 | `pl5 shy` | **原包自带的腮红线** + 汗滴 |
| `awkward` | 尴尬 | `pl5 doubt` | 半睁眼 + 汗滴 |
| `blank` | 发呆 | `pl5` | ↖ 复用（与 `neutral` 同源） |
| `surprised` | 惊讶 | `pl5 surprise` | 睁大眼 + 张嘴 |
| `panic` | 慌张 | `pl5 hate` | 怒眉 + 瞪眼 + 汗滴 |
| `moved` | 眼眶红 | `pl5 sad` | ↖ 复用 |
| `cry` | 哭 | `pl5 sad` | 垂眼 + 泪 |
| `serious` | 认真 | `pl5 hate` | ↖ 复用 |
| `sleepy` | 困 | `pl5 blink` | ↖ 复用（与 `smile` 同源） |
| `soft` | 温柔 | `pl5 blink` | ↖ 复用 |
| `guilty` | 愧疚 | `pl5 plot` | 眼部阴影 + 苦笑 |
| `laugh` | 笑出来 | `pl5 scoff` | 得意/嗤笑（最接近"笑"的一张） |

### 覆盖情况

```
位图立绘：30 张合格
组合覆盖：208 / 208（其余由程序化立绘兜底，游戏不会缺图）
  · 雅：96/96　✔ 全部就位
  · 金：112/112　✔ 全部就位
```

---

## 五、考察过但**未采用**的候选（全部为可下载、授权明确的素材）

| 素材包 | 作者 | 许可证 | 为什么没选 |
|---|---|---|---|
| [Codel Visual Novel Sprite](https://opengameart.org/content/codel-visual-novel-sprite) | LisadiKaprio | CC-BY 4.0 | 只有 1 人 1 衣、女性半写实风格；**没有男性角色**，无法配对 |
| [Kuudere Visual Novel Sprite](https://opengameart.org/content/kuudere-visual-novel-sprite) | LisadiKaprio | CC-BY 4.0 | 很好的女性包（4 套服装 × 7 表情），但是**Q 版大头比例**，且找不到同比例的男性包 |
| [Male sprite for visual novels](https://opengameart.org/content/male-sprite-for-visual-novels) | LisadiKaprio | CC-BY 4.0 | 唯一的现代男性候选；但**只有 3 个姿势（其中 3 张还是裸上身）**、几乎没有表情差分，做不了 14 个表情 |
| [Girl Sprite for Visual Novels](https://opengameart.org/content/girl-sprite-for-visual-novels) | frances | CC-BY 3.0 | 只有女性，且无表情差分 |
| [Character Portrait ~ Maid](https://opengameart.org/content/character-portrait-maid) | jupitersdaughter | CC-BY 3.0 | 只有女性；320×578 **只有胸像**、6 个表情，分辨率太低 |
| [Anime portrait for LPC characters](https://opengameart.org/content/anime-portrait-for-lpc-characters) | 多位（含 ZeNeRIA29） | CC-BY 3.0 / CC-BY-SA 3.0 | 900×760 的 LPC **胸像**，每张只有 3~4 个表情，且是**奇幻 RPG 角色**（骑士/精灵），不符合现代日常设定 |
| [Nekomimi girl portrait](https://opengameart.org/content/nekomimi-girl-portrait) | — | CC0 | 只有女性，且是兽耳角色 |
| `character_5.zip` 内的 `cha 2` / `cha 4` | FALLiNG_AiR | CC0 | 表情更多（`cha 2` 有 `shy`/`worry`；`cha 4` 有 `normal`/`shy`/`worry`），但 `cha 2` 是**侧脸低头、脸被手挡住**的姿势，`cha 4` 是**挥粉色大缎带**的动态姿势，都不适合做通用正面立绘 |

**不可达的站点（本机实测 HTTP 000，未使用）**：`itch.io`、`booth.pm`、`sutemo.com`、`upload.wikimedia.org`。
**未使用任何** Google 图片 / Pinterest / pixiv 抓图。

---

## 六、背景与 CG（非本次新增，原样保留）

| 类别 | 来源 | 授权 |
|---|---|---|
| 20 张场景背景 | 本项目**手写 SVG**（`assets/backgrounds/*.svg`） | 随本项目（MIT） |
| 22 张 CG | 本项目**由背景 + 立绘 + 特效合成**（`assets/cg/*.svg`，见 `tools/build-cg.js`） | 随本项目（MIT） |
| UI 图标 / 徽记 | 本项目**手写 SVG**（`assets/ui/*.svg`） | 随本项目（MIT） |
| BGM / 音效 / 环境音 | **WebAudio 实时合成**，非采样音频（`src/audio.js`） | 随本项目（MIT） |

即：**除 `assets/characters/` 下的 30 张角色立绘外，本作没有使用任何第三方素材。**
