# UI 素材来源与授权（assets/ui/**）

本文件记录《你好！一周年》标题界面与 HUD 所用素材的来源、作者与许可证。
原则：**只使用授权明确（CC0 / CC-BY / 公有领域）的素材；不确定授权的一律不用。**
全部素材均为**本地文件**，游戏离线可运行（file:// 双击即开），不引用任何 CDN / 外链。

---

## 1. 实际使用的素材（全部为本项目自绘）

| 文件 | 名称 | 来源 | 作者 | 许可证 | 是否需署名 |
|---|---|---|---|---|---|
| `assets/ui/title_night.svg` | 标题界面星空插图 | 本项目手写 SVG（2025-10-11 新增） | 本项目 | 随项目（MIT） | 否 |
| `assets/ui/logo_mark.svg` | 标题徽记（星星与石头） | 本项目手写 SVG（既有的） | 本项目 | 随项目（MIT） | 否 |
| `assets/ui/icon_heart.svg` | 好感图标 | 本项目手写 SVG（既有的） | 本项目 | 随项目（MIT） | 否 |
| `assets/ui/icon_trust.svg` | 信任图标 | 本项目手写 SVG（既有的） | 本项目 | 随项目（MIT） | 否 |
| `assets/ui/icon_courage.svg` | 勇气图标 | 本项目手写 SVG（既有的） | 本项目 | 随项目（MIT） | 否 |

`title_night.svg` 是纯手写矢量（viewBox 1600×900，约 21 KB，无位图、无外部引用），
所以可以无损缩放到任何窗口尺寸，也和项目既有的程序化立绘 / 背景是同一套画法。

### 插图包含的元素
- 深蓝 → 紫的夜空渐变 + 一层极淡的银河带（`feGaussianBlur` 柔化）
- 114 颗星（分 A/B/C/D 四组，各自独立相位缓慢闪烁）+ 9 枚四角星芒
- 左上角一枚小月亮（带月海斑点与柔光）
- 三道**静止**的星轨细弧（长曝光感）
- 两道**定时划过**的流星（CSS 关键帧，13s / 17s 循环）
- 三层远山剪影（越近越暗）+ 山脊亮边
- 山脊上一枚被星光照亮的**石头**（呼应 2025-09-28《石头说》）
- 一颗**特别亮的星**（四道短芒，缓慢眨眼）—— 比别的星亮，但不是光源
- **并肩站着的两个人影**（纯剪影、不画五官，避免与立绘冲突）
- 松树、石缝小草（近景剪影）+ 底部三层缓慢平移的雾

### 动画（全部为 CSS，不用 JS 循环）
| 元素 | 动画 | 周期 |
|---|---|---|
| 星野 A/B/C/D 组 | 透明度呼吸（两组两种节奏） | 6.5s / 8.4s / 11s / 14s |
| 四角星芒 | 同上，另一相位 | 7.4s |
| 最亮的那颗星 | 轻微缩放 + 呼吸 | 5.2s |
| 月亮 | 极轻的明暗呼吸 | 22s |
| 流星 ×2 | 定时划过（大部分时间不可见） | 13s / 17s |
| 雾 ×3 | 水平缓慢平移 | 34s / 46s |
| 整张插图 | 极慢的推近（Ken Burns） | 96s |
| 徽记 | 上下轻浮 | 9s |
| 标题菜单按钮 | hover/active/focus 三态 | 0.18–0.24s |

---

## 2. 评估过但**没有采用**的网上素材（授权与出处如实记录）

> 结论：能拿到的明确授权素材都是**写实/像素风的位图星空**，与本作"手绘矢量 + 程序化立绘"
> 的画风不搭（用户要求"找不到合适的就自己做，不要硬凑"），因此**没有放进 `assets/`**，
> 项目里不存在这两个文件。若要复用，请自行从下列地址重新下载。

| 素材 | 作者 | 许可证 | 地址 | 未采用原因 |
|---|---|---|---|---|
| Stars/Space Background（`Starset_5.png` 等，1920×1080 PNG） | leyren | **CC0**（页面标注 License(s): CC0） | <https://opengameart.org/content/starsspace-background> | 写实星云照片质感，与手绘矢量画风冲突；且 2.7 MB / 张，离线包没必要变重 |
| Stars/Space Background colorful（`Starsetcolorful.png`，1920×1080 PNG） | leyren | **CC0**（页面标注 License(s): CC0） | <https://opengameart.org/content/starsspace-background-colorful> | 同上（颜色更艳，风格更不搭） |

两个素材均为 **CC0**，即使采用也**不需要署名**；上面列出作者只是出于尊重与可追溯。
下载与校验方式（供复核）：

```bash
curl -sL -o Starset_5.png https://opengameart.org/sites/default/files/Starset_5.png
file Starset_5.png   # PNG image data, 1920 x 1080, 8-bit/color RGBA
```

### 网络环境实测（2025-10-11）
- ✅ 可达：`opengameart.org`（含 `/sites/default/files/...` 直链）、`github.com`、`api.github.com`
- ❌ 不可达（HTTP 000）：`commons.wikimedia.org`、`upload.wikimedia.org`、`unsplash.com`、
  `pexels.com`、`pixiv`、`itch.io`、`booth.pm`

---

## 3. 字体

不引入任何网络字体。中文使用系统字体栈（苹方 → 冬青黑 → 微软雅黑 → 思源黑体 → 文泉驿），
见 `index.html` 的 `:root{--font:...}`。因此离线、无网、无外链字体请求。
