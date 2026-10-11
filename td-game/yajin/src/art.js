/* 《你好！一周年》— art.js (v3 真人立绘 · 重建几何)
 * 程序化矢量美术（纯字符串拼接，Node 与浏览器均可运行，无任何运行期依赖）：
 *   1) characterSVG(charId, expr, act, {outfit}) —— 720×1080 透明背景真人半身立绘
 *   2) characterBody(charId, expr, act, {outfit}) —— { defs, content, mood, outfit }
 *   3) handSVG(kind)        —— 手部特写（牵手 / 猫猫美甲 / 酷酷美甲 / 递猫猫明信片）
 *   4) bgFallback(scene)    —— 背景加载失败时的同色系兜底图（data URI）
 *   5) effectSVG(kind)      —— 雨 / 雪 / 光晕 / 夜色氛围层
 *   6) composeCG(...)       —— 供 tools/build-cg.js 合成 CG
 *
 * ── 几何契约（v3 重做的核心，全部以"头部参数"为基准换算） ──
 *   雅 ya : 头宽 200 / 头高 272，肩宽 350（=1.75 头宽），颈宽 62，溜肩
 *   金 jin: 头宽 210 / 头高 280，肩宽 420（=2.00 头宽），颈宽 86，斜方肌斜坡
 *   立绘为"半身像"：躯干一直画到 y=1080 被画布裁切。人物水平居中于 x=360。
 *
 * ── 头发契约 ──
 *   头发 = 颅骨轮廓统一外扩 6~14px 的"帽子"（后层发团 + 前层发盖），
 *   有明确发际线（额头露出）、鬓角/侧发顺脸颊下垂、发尾按 3~6 片尖形发束分组，
 *   刘海是从发际线垂下的 4~7 束，不是一个整块。
 *
 * ── 画风契约 ──
 *   赛璐璐：平涂 + 一层软阴影 + 一点高光；外轮廓描边细（1.5~2.5px）且用深色系，
 *   脸 / 发 / 皮肤靠色块分层而不是粗黑线分隔。
 *
 * 设定严格遵循 STORY_SPEC §2：雅=158cm（左眼下方小雀斑、左侧银发夹、左手腕红绳）、
 * 金=183cm（右眉尾旧疤、左手腕旧腕表）。识别特征在全部表情/服装/动作下均保留。
 */
(function (root) {
  'use strict';
  const YJ = root.YJ = root.YJ || {};

  /* ============================================================
   *  一、调色板（保留 v2 思路，补齐衣服/头发分层所需色）
   * ============================================================ */
  const C = {
    ya: {
      skin: '#FBE7DA', skinShade: '#EFCDBB', skinDeep: '#E0B49E',
      hair: '#3E3230', hairHi: '#5E4A42', hairShade: '#2A2120', hairDeep: '#1E1817',
      irisA: '#C08A4E', irisB: '#6B4636', pupil: '#2A1B14',
      line: '#6A4A44', lash: '#3A2A28',
      lip: '#CE7B7E', lipDeep: '#A85B60', mouth: '#8A4A4A',
      blush: '#F09A9A',
      cloth: '#FBF3E6', clothShade: '#E4D6C2', clothDeep: '#C9B79E',
      accent: '#BCD9EA', accentShade: '#93B8CE',
      scarf: '#D8C2C6', hat: '#F3E6DC',
      glass: '#8A6A5C',
      silver: '#D8DCE2', silverLine: '#A8AEB8',
      red: '#D2453C'
    },
    jin: {
      skin: '#F6E2D2', skinShade: '#E4C6B0', skinDeep: '#D0AC94',
      hair: '#241F22', hairHi: '#3C3438', hairShade: '#151215', hairDeep: '#0E0C0E',
      irisA: '#7A6A5E', irisB: '#3A2F2A', pupil: '#1C1512',
      line: '#5A4640', lash: '#2A2220',
      lip: '#B87A72', lipDeep: '#8E5750', mouth: '#6E3C3C',
      blush: '#D98A80',
      cloth: '#3A3F4A', clothShade: '#2C303A', clothDeep: '#22252C',
      accent: '#5C6472', accentShade: '#454C58',
      plaid: '#3F5878', plaidLine: '#2C3F58',
      white: '#F4F1EA', whiteShade: '#DAD5CB',
      scarf: '#4A4E58', coat: '#1E2126',
      glass: '#262320',
      silver: '#C9CCD2', silverLine: '#9AA0A8',
      red: '#C43B34'
    }
  };

  /* ============================================================
   *  二、表情参数表
   *  每个表情同时在 眼(open/lid/squint) × 眉(browY/brow 角度/asym)
   *  × 嘴(kind) × 腮红(blush) × 头部倾斜(tilt) 上做差，保证肉眼可分辨。
   * ============================================================ */
  const MOODS = {
    neutral: { open: 1.00, lid: 0.00, squint: 0, browY: 0, brow: 0, browShape: 'soft', browAsym: 0, mouth: 'small', blush: 0.16, tilt: 0, look: { x: 0, y: 0 }, extras: [] },
    smile: { open: 0.80, lid: 0.10, squint: 2, browY: 0, brow: 3, browShape: 'soft', browAsym: 0, mouth: 'smile', blush: 0.30, tilt: 1.6, look: { x: 0, y: 0 }, extras: [] },
    laugh: { open: 0.00, lid: 0, squint: 0, browY: 1, brow: 7, browShape: 'soft', browAsym: 0, mouth: 'grin', blush: 0.52, tilt: 2.4, look: { x: 0, y: 0 }, extras: ['sparkle'] },
    shy: { open: 0.30, lid: 0.55, squint: 8, browY: -1, brow: 7, browShape: 'soft', browAsym: 0, mouth: 'small', blush: 0.95, tilt: 7, look: { x: -0.55, y: 0.40 }, extras: ['blushline'] },
    blush: { open: 0.94, lid: 0.06, squint: 0, browY: -2, brow: 5, browShape: 'soft', browAsym: 0, mouth: 'small', blush: 1.00, tilt: 3, look: { x: -0.35, y: 0.30 }, extras: ['blushline'] },
    surprised: { open: 1.32, lid: 0.00, squint: -4, browY: 8, brow: 3, browShape: 'arch', browAsym: 0, mouth: 'o', blush: 0.20, tilt: -1, look: { x: 0, y: -0.15 }, extras: ['surprise'] },
    serious: { open: 0.86, lid: 0.30, squint: -5, browY: -2, brow: -9, browShape: 'flat', browAsym: 0, mouth: 'line', blush: 0.05, tilt: 0, look: { x: 0, y: 0 }, extras: [] },
    sleepy: { open: 0.22, lid: 0.80, squint: 10, browY: -3, brow: 3, browShape: 'soft', browAsym: 0, mouth: 'small_open', blush: 0.24, tilt: 5, look: { x: 0, y: 0.30 }, extras: ['zzz'] },
    sad: { open: 0.72, lid: 0.18, squint: 6, browY: -3, brow: 15, browShape: 'soft', browAsym: 0, mouth: 'frown', blush: 0.20, tilt: -3, look: { x: 0, y: 0.35 }, extras: ['well_s'] },
    cry: { open: 0.66, lid: 0.10, squint: 4, browY: -4, brow: 17, browShape: 'soft', browAsym: 0, mouth: 'frown_open', blush: 0.60, tilt: -3, look: { x: 0, y: 0.25 }, extras: ['tears'] },
    worried: { open: 0.94, lid: 0.08, squint: 2, browY: -1, brow: 11, browShape: 'soft', browAsym: 1, mouth: 'wave', blush: 0.14, tilt: -2, look: { x: 0.30, y: 0.10 }, extras: [] },
    soft: { open: 0.66, lid: 0.20, squint: 3, browY: 0, brow: 2, browShape: 'soft', browAsym: 0, mouth: 'smile_s', blush: 0.34, tilt: 1.4, look: { x: 0, y: 0.10 }, extras: [] },
    /* --- 雅（16）--- */
    tease: { open: 0.78, lid: 0.18, squint: 4, browY: -1, brow: 5, browShape: 'soft', browAsym: 1, mouth: 'smirk', blush: 0.24, tilt: 3, look: { x: 0.45, y: -0.10 }, extras: [] },
    pout: { open: 0.92, lid: 0.10, squint: 2, browY: -4, brow: -6, browShape: 'flat', browAsym: 0, mouth: 'pout', blush: 0.38, tilt: -2, look: { x: -0.25, y: 0.10 }, extras: ['puff', 'anger_s'] },
    proud: { open: 0.70, lid: 0.18, squint: 4, browY: 2, brow: 2, browShape: 'arch', browAsym: 1, mouth: 'smirk', blush: 0.24, tilt: 2, look: { x: -0.20, y: -0.05 }, extras: ['sparkle_s'] },
    excited: { open: 1.16, lid: 0.00, squint: -2, browY: 6, brow: 5, browShape: 'arch', browAsym: 0, mouth: 'grin', blush: 0.44, tilt: 1, look: { x: 0, y: -0.10 }, extras: ['sparkle'] },
    /* --- 金（14）--- */
    awkward: { open: 0.78, lid: 0.22, squint: 5, browY: -2, brow: 5, browShape: 'soft', browAsym: 1, mouth: 'flat', blush: 0.34, tilt: -4, look: { x: 0.60, y: 0.10 }, extras: ['sweat'] },
    blank: { open: 0.90, lid: 0.04, squint: 0, browY: 0, brow: 0, browShape: 'flat', browAsym: 0, mouth: 'small', blush: 0.10, tilt: 0, look: { x: 0, y: 0 }, extras: ['dots'] },
    panic: { open: 1.34, lid: 0.00, squint: -6, browY: 2, brow: 13, browShape: 'soft', browAsym: 1, mouth: 'wobble_open', blush: 0.68, tilt: -3, look: { x: 0, y: -0.10 }, extras: ['sweat_big'] },
    moved: { open: 0.88, lid: 0.16, squint: 5, browY: 2, brow: 13, browShape: 'soft', browAsym: 0, mouth: 'wobble', blush: 0.52, tilt: -1, look: { x: 0, y: 0.25 }, extras: ['well'] },
    guilty: { open: 0.64, lid: 0.42, squint: 7, browY: -5, brow: 11, browShape: 'soft', browAsym: 0, mouth: 'small_open', blush: 0.42, tilt: -6, look: { x: -0.60, y: 0.35 }, extras: ['sweat'] }
  };

  /* ============================================================
   *  三、基础绘制工具
   * ============================================================ */
  const R = n => Math.round(n * 100) / 100;
  const N = (n, d) => Number(Number(n).toFixed(d == null ? 2 : d));
  function attrs(fill, extra) {
    const ex = extra ? String(extra).trim() : '';
    const hasFill = /(^|\s)fill\s*=/.test(ex);
    return (hasFill ? '' : ` fill="${fill}"`) + (ex ? ' ' + ex : '');
  }
  const path = (d, fill, extra) => `<path d="${d}"${attrs(fill, extra)}/>`;
  const ell = (cx, cy, rx, ry, fill, extra) =>
    `<ellipse cx="${R(cx)}" cy="${R(cy)}" rx="${R(rx)}" ry="${R(ry)}"${attrs(fill, extra)}/>`;
  const circle = (cx, cy, r, fill, extra) =>
    `<circle cx="${R(cx)}" cy="${R(cy)}" r="${R(r)}"${attrs(fill, extra)}/>`;
  const stroke = (d, col, w, extra) =>
    `<path d="${d}" fill="none" stroke="${col}" stroke-width="${R(w)}" stroke-linecap="round" stroke-linejoin="round"${extra ? ' ' + extra : ''}/>`;
  function lin(id, x1, y1, x2, y2, stops) {
    return `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${R(x1)}" y1="${R(y1)}" x2="${R(x2)}" y2="${R(y2)}">` +
      stops.map(s => `<stop offset="${s[0]}" stop-color="${s[1]}"${s[2] != null ? ` stop-opacity="${s[2]}"` : ''}/>`).join('') + '</linearGradient>';
  }
  const rot = (a, x, y) => `rotate(${R(a)} ${R(x)} ${R(y)})`;

  /* ============================================================
   *  四、头部几何（唯一尺寸来源）
   *  H.x / H.y 均为【局部坐标】：x ∈ [-1,1] 为半头宽，y ∈ [0,1.5] 为头高
   *  y=0 颅顶基准，y=1 下巴尖，y>1 为颈部/肩部延展。
   * ============================================================ */
  const SKULL = [
    [0.00, 0.012], [0.350, 0.045], [0.640, 0.165], [0.860, 0.365],
    [0.960, 0.605], [1.000, 0.800], [0.900, 0.925], [0.645, 1.000], [0.300, 1.022], [0.000, 1.030]
  ];
  const FACE = {
    ya: { cx: 360, headW: 200, headH: 272, top: 236, eyeY: 0.586, eyeDX: 0.455, eyeRx: 0.198, eyeRy: 0.090, browY: 0.418, browW: 0.365, browTh: 0.072, mouthY: 0.815, noseY: 0.700, neckW: 62, neckTop: 0.94, shoulderY: 1.475, shoulderHalf: 175, neckBaseHalf: 40, hairScale: 1.0, jaw: 1.0, hairMess: 0.0 },
    // 金：头更大、下颌更方、肩更宽、颈更粗
    jin: { cx: 360, headW: 210, headH: 280, top: 232, eyeY: 0.578, eyeDX: 0.462, eyeRx: 0.184, eyeRy: 0.086, browY: 0.412, browW: 0.400, browTh: 0.095, mouthY: 0.810, noseY: 0.698, neckW: 86, neckTop: 0.94, shoulderY: 1.462, shoulderHalf: 210, neckBaseHalf: 48, hairScale: 1.02, jaw: 0.86, hairMess: 1.0 }
  };
  function H(cfg, x, y) {
    return { x: cfg.cx + x * (cfg.headW / 2), y: cfg.top + y * cfg.headH };
  }
  /* 面部轮廓路径（起点=颅顶，顺时针经右侧到下巴，镜像回左侧） */
  function faceSilhouette(cfg) {
    const jaw = cfg.jaw == null ? 1 : cfg.jaw;
    const p = SKULL.map(k => {
      const t = Math.max(0, Math.min(1, (k[1] - 0.74) / 0.29));
      const sx = 1 - (1 - jaw) * t;
      return H(cfg, k[0] * sx, k[1]);
    });
    let d = `M ${R(p[0].x)} ${R(p[0].y)}`;
    for (let i = 1; i < p.length; i++) {
      const a = p[i - 1], b = p[i], m = p[i + 1] || p[i];
      const c1x = a.x + (b.x - a.x) / 3, c1y = a.y + (b.y - a.y) / 3;
      const c2x = b.x - (m.x - a.x) / 6, c2y = b.y - (m.y - a.y) / 6;
      d += ` C ${R(c1x)} ${R(c1y)} ${R(c2x)} ${R(c2y)} ${R(b.x)} ${R(b.y)}`;
    }
    for (let i = p.length - 1; i >= 0; i--) {
      const b = p[i];
      d += i === p.length - 1 ? ` L ${R(2 * cfg.cx - b.x)} ${R(b.y)}` : ` L ${R(2 * cfg.cx - b.x)} ${R(b.y)}`;
    }
    return d + ' Z';
  }

  /* ============================================================
   *  五、五官
   * ============================================================ */
  function eyeHuman(cfg, p, side, o) {
    /* side: -1 观者左 / +1 观者右 */
    const c = H(cfg, side * cfg.eyeDX, cfg.eyeY);
    const rx = cfg.headW * cfg.eyeRx, ryFull = cfg.headH * cfg.eyeRy;
    const look = o.look || { x: 0, y: 0 };
    const tag = o.tag;
    if (o.open <= 0.06) {
      /* 闭眼 / 笑眼：一条向下弯的睫毛线（laugh / shy） */
      const d = `M ${R(c.x - rx)} ${R(c.y + ryFull * 0.10)} q ${R(rx)} ${R(ryFull * 1.00)} ${R(rx * 2)} ${R(-ryFull * 0.16)}`;
      return stroke(d, p.lash, o.thin ? 5.6 : 6.6) +
        stroke(`M ${R(c.x - rx * 0.94)} ${R(c.y + ryFull * 0.30)} l ${R(-rx * 0.24)} ${R(ryFull * 0.22)}`, p.lash, 3.6) +
        stroke(`M ${R(c.x + rx * 0.96)} ${R(c.y + ryFull * 0.06)} l ${R(rx * 0.24)} ${R(ryFull * 0.22)}`, p.lash, 3.6);
    }
    const lid = o.lid || 0;                       /* 上眼睑下压量 0~0.8 */
    const ry = Math.max(3, ryFull * o.open * (1 - lid));
    const top = c.y - ry, bot = c.y + ry;
    const cid = 'ec' + tag + o.k;
    const irisR = Math.min(rx * 0.78, ry * 1.32);   /* 虹膜占约七成眼宽：既不像墨镜，也不会让眼白成一条横带 */
    const px = c.x + look.x * rx * 0.34, py = c.y + look.y * ry * 0.5;
    /* 上睫毛线：闭合点在同一 y，决定"锐/圆" */
    const lashPk = c.y - ry * 0.62 - (o.squint || 0) * 0.55;
    let s = `<defs><clipPath id="${cid}"><path d="M ${R(c.x - rx)} ${R(c.y + ry * 0.34)} Q ${R(c.x - rx * 0.86)} ${R(top + ry * 0.20)} ${R(c.x - rx * 0.40)} ${R(top)} L ${R(c.x + rx * 0.40)} ${R(top)} Q ${R(c.x + rx * 0.86)} ${R(top + ry * 0.22)} ${R(c.x + rx)} ${R(c.y + ry * 0.34)} Q ${R(c.x)} ${R(bot + ry * 0.30)} ${R(c.x - rx)} ${R(c.y + ry * 0.34)} Z"/></clipPath></defs>`;
    s += `<g clip-path="url(#${cid})">`;
    s += ell(c.x, c.y + ry * 0.10, rx * 0.99, ry * 0.94, '#F1E2DA');   /* 暖调眼白：避免与浅肤色形成一条亮带 */
    s += ell(px, py, irisR, irisR * 1.06, `url(#iris${tag})`);
    s += `<circle cx="${R(px)}" cy="${R(py)}" r="${R(irisR * 0.46)}" fill="${p.pupil}"/>`;
    s += ell(px - irisR * 0.30, py - irisR * 0.40, irisR * 0.30, irisR * 0.30, '#FFFFFF', 'opacity=".95"');
    s += circle(px + irisR * 0.34, py + irisR * 0.40, irisR * 0.15, '#FFFFFF', 'opacity=".62"');
    s += path(`M ${R(c.x - rx)} ${R(bot - ry * 0.09)} Q ${R(c.x)} ${R(bot + ry * 0.30)} ${R(c.x + rx)} ${R(bot - ry * 0.09)} L ${R(c.x + rx)} ${R(bot + ry)} L ${R(c.x - rx)} ${R(bot + ry)} Z`, p.skinShade, 'opacity=".55"');
    /* 去掉未裁剪的上眼睑大椭圆：它会在眼睛上方糊出一条比眼形更宽的浅色横带 */
    s += '</g>';
    s += stroke(`M ${R(c.x - rx)} ${R(c.y + ry * 0.34)} Q ${R(c.x - rx * 0.86)} ${R(top + ry * 0.22)} ${R(c.x - rx * 0.42)} ${R(lashPk)} L ${R(c.x + rx * 0.44)} ${R(top + ry * 0.08)} Q ${R(c.x + rx * 0.86)} ${R(top + ry * 0.26)} ${R(c.x + rx)} ${R(c.y + ry * 0.32)}`, p.lash, o.thin ? 6.8 : 7.6);
    s += stroke(`M ${R(c.x + rx * 0.82)} ${R(top + ry * 0.34)} q ${R(rx * 0.30)} ${R(-ry * 0.30)} ${R(rx * 0.46)} ${R(-ry * 0.16)}`, p.lash, 3.4);
    s += stroke(`M ${R(c.x - rx * 0.92)} ${R(c.y + ry * 0.86)} q ${R(rx * 0.92)} ${R(ry * 0.34)} ${R(rx * 1.86)} ${R(-ry * 0.06)}`, p.line, 2.1, 'opacity=".28"');
    s += `<g clip-path="url(#${cid})">` + ell(c.x, top - ry * 0.12, rx * 1.10, ry * 0.80, p.skinDeep, 'opacity=".13"') + '</g>';
    return s;
  }

  function browHuman(cfg, p, side, m) {
    const c = H(cfg, side * cfg.eyeDX * 1.02, cfg.browY);
    const w = cfg.headW * cfg.browW, th = cfg.headH * cfg.browTh;
    /* asym：±1 时左右眉不同高度（挑眉 / 疑惑），side=-1 抬 */
    const dy = (m.browAsym ? (side < 0 ? -1 : 1) * 0.020 * cfg.headH : 0) + (m.browY || 0) * -0.0075 * cfg.headH;
    const ang = (m.brow || 0) * side * 0.85;
    const shape = m.browShape || 'soft';
    let d;
    const x0 = -w / 2, x1 = w / 2, y0 = 0, y1 = -th * 0.10;
    if (shape === 'flat') {
      d = `M ${R(x0)} ${R(y0 + th * 0.12)} Q ${R(0)} ${R(y0 - th * 0.34)} ${R(x1)} ${R(y1 + th * 0.04)}`;
    } else if (shape === 'arch') {
      d = `M ${R(x0)} ${R(y0 + th * 0.30)} Q ${R(-w * 0.20)} ${R(-th * 1.30)} ${R(w * 0.10)} ${R(-th * 0.98)} Q ${R(w * 0.34)} ${R(-th * 0.62)} ${R(x1)} ${R(y1 + th * 0.34)}`;
    } else if (shape === 'angled') {
      d = `M ${R(x0)} ${R(y0 - th * 0.34)} L ${R(x1)} ${R(y1 + th * 0.40)}`;
    } else {
      d = `M ${R(x0)} ${R(y0 + th * 0.18)} Q ${R(-w * 0.16)} ${R(-th * 0.96)} ${R(x1)} ${R(y1 + th * 0.06)}`;
    }
    return `<g transform="${rot(ang, c.x, c.y)} translate(0 ${R(dy)})">` +
      path(d, 'none', `stroke="${p.hairShade}" stroke-width="${R(th)}" stroke-linecap="round"`) +
      // 眉头稍浓的一段，避免眉像一条等粗线
      path(`M ${R(x0)} ${R(y0 + th * 0.18)} L ${R(x0 + w * 0.34)} ${R(y0 - th * 0.24)}`, 'none',
        `stroke="${p.hairShade}" stroke-width="${R(th * 0.98)}" stroke-linecap="round" opacity=".95"`) +
      '</g>';
  }

  function mouthHuman(kind, cfg, p) {
    const c = H(cfg, 0, cfg.mouthY);
    const w = cfg.headW, x = c.x, y = c.y;
    const S = w / 200;
    const st = (ww, col) => `fill="none" stroke="${col || p.lip}" stroke-width="${R(ww)}" stroke-linecap="round" stroke-linejoin="round"`;
    switch (kind) {
      case 'smile': return stroke(`M ${R(x - 26 * S)} ${R(y - 2)} Q ${R(x)} ${R(y + 17 * S)} ${R(x + 26 * S)} ${R(y - 2)}`, p.lip, 5 * S);
      case 'smile_s': return stroke(`M ${R(x - 18 * S)} ${R(y - 1)} Q ${R(x)} ${R(y + 11 * S)} ${R(x + 18 * S)} ${R(y - 1)}`, p.lip, 4.6 * S);
      case 'small': return stroke(`M ${R(x - 12 * S)} ${R(y - 1)} Q ${R(x)} ${R(y + 8 * S)} ${R(x + 12 * S)} ${R(y - 1)}`, p.lip, 4.4 * S);
      case 'grin':
        return path(`M ${R(x - 30 * S)} ${R(y - 3)} Q ${R(x)} ${R(y + 24 * S)} ${R(x + 30 * S)} ${R(y - 3)} Z`, '#8E4E50') +
          path(`M ${R(x - 21 * S)} ${R(y + 1)} Q ${R(x)} ${R(y + 8 * S)} ${R(x + 21 * S)} ${R(y + 1)} Z`, '#FFF6F0', 'opacity=".94"') +
          stroke(`M ${R(x - 30 * S)} ${R(y - 3)} Q ${R(x)} ${R(y + 24 * S)} ${R(x + 30 * S)} ${R(y - 3)}`, p.lipDeep, 4.4 * S);
      case 'o': return ell(x, y + 5 * S, 11 * S, 14 * S, '#9A5456') +
        ell(x, y + 9 * S, 8 * S, 7 * S, '#C0706E', 'opacity=".6"') +
        stroke(`M ${R(x - 11 * S)} ${R(y - 9 * S)} Q ${R(x)} ${R(y - 4 * S)} ${R(x + 11 * S)} ${R(y - 9 * S)}`, p.lip, 3.2 * S);
      case 'small_open': return ell(x, y + 4 * S, 8 * S, 10 * S, '#9A5456', 'opacity=".8"') +
        stroke(`M ${R(x - 12 * S)} ${R(y - 4 * S)} Q ${R(x)} ${R(y + 3 * S)} ${R(x + 12 * S)} ${R(y - 4 * S)}`, p.lip, 4 * S);
      case 'line': return stroke(`M ${R(x - 18 * S)} ${R(y + 1)} L ${R(x + 18 * S)} ${R(y + 1)}`, p.lipDeep, 4.2 * S);
      case 'line_small': return stroke(`M ${R(x - 11 * S)} ${R(y + 1)} L ${R(x + 11 * S)} ${R(y + 1)}`, p.lipDeep, 3.8 * S);
      case 'wave': return stroke(`M ${R(x - 18 * S)} ${R(y + 4 * S)} q ${R(9 * S)} ${R(-7 * S)} ${R(18 * S)} 0 q ${R(9 * S)} ${R(7 * S)} ${R(18 * S)} 0`, p.lip, 4.2 * S);
      case 'wobble': return stroke(`M ${R(x - 15 * S)} ${R(y + 4 * S)} q ${R(7.5 * S)} ${R(-6 * S)} ${R(15 * S)} 0 q ${R(7.5 * S)} ${R(6 * S)} ${R(15 * S)} ${R(-2)}`, p.lip, 4.2 * S);
      case 'wobble_open':
        return ell(x, y + 6 * S, 8 * S, 10 * S, '#9A5456', 'opacity=".55"') +
          stroke(`M ${R(x - 17 * S)} ${R(y + 3 * S)} q ${R(8.5 * S)} ${R(-8 * S)} ${R(17 * S)} 0 q ${R(8.5 * S)} ${R(8 * S)} ${R(17 * S)} ${R(-2)}`, p.lip, 4.2 * S);
      case 'frown': return stroke(`M ${R(x - 20 * S)} ${R(y + 8 * S)} Q ${R(x)} ${R(y - 9 * S)} ${R(x + 20 * S)} ${R(y + 8 * S)}`, p.lip, 4.6 * S);
      case 'frown_open':
        return ell(x, y + 8 * S, 9 * S, 11 * S, '#9A5456', 'opacity=".5"') +
          stroke(`M ${R(x - 20 * S)} ${R(y + 7 * S)} Q ${R(x)} ${R(y - 10 * S)} ${R(x + 20 * S)} ${R(y + 7 * S)}`, p.lip, 4.6 * S);
      case 'smirk': return stroke(`M ${R(x - 22 * S)} ${R(y + 3 * S)} Q ${R(x + 2)} ${R(y + 16 * S)} ${R(x + 23 * S)} ${R(y - 7 * S)}`, p.lip, 5 * S);
      case 'pout': return stroke(`M ${R(x - 15 * S)} ${R(y + 6 * S)} Q ${R(x)} ${R(y - 7 * S)} ${R(x + 15 * S)} ${R(y + 6 * S)}`, p.lipDeep, 4.6 * S);
      case 'flat': return stroke(`M ${R(x - 16 * S)} ${R(y + 2 * S)} Q ${R(x)} ${R(y + 5 * S)} ${R(x + 16 * S)} ${R(y + 1)}`, p.lip, 4.2 * S);
      default: return '';
    }
  }

  /* 腮红 / 脸部小元素：全部由 cfg 换算，跟随头形 */
  function faceBlush(cfg, p, mood) {
    if (!(mood.blush > 0.04)) return '';
    const o = Math.min(0.62, mood.blush * 0.46);
    const y = H(cfg, 0, cfg.eyeY + 0.145).y;
    const lx = H(cfg, -(cfg.eyeDX + 0.02), 0).x, rx = H(cfg, (cfg.eyeDX + 0.02), 0).x;
    return ell(lx, y, cfg.headW * 0.145, cfg.headH * 0.055, p.blush, `opacity="${R(o)}"`) +
      ell(rx, y, cfg.headW * 0.145, cfg.headH * 0.055, p.blush, `opacity="${R(o)}"`) +
      ell(cfg.cx, H(cfg, 0, cfg.noseY).y, cfg.headW * 0.055, cfg.headH * 0.020, p.blush, `opacity="${R(o * 0.5)}"`);
  }

  function extrasHuman(list, p, cfg, who) {
    let s = '';
    const exL = H(cfg, -1.35, 0.30), exR = H(cfg, 1.35, 0.30);
    const eyL = H(cfg, -cfg.eyeDX, cfg.eyeY), eyR = H(cfg, cfg.eyeDX, cfg.eyeY);
    const has = k => list.indexOf(k) >= 0;
    if (has('sparkle')) {
      [[exL.x - 14, exL.y - 76, 1], [exR.x + 16, exR.y - 96, .82], [exR.x + 4, exR.y + 92, .66]].forEach(a => {
        const x = a[0], y = a[1], k = a[2];
        s += path(`M ${R(x)} ${R(y - 21 * k)} L ${R(x + 6 * k)} ${R(y - 6 * k)} L ${R(x + 21 * k)} ${R(y)} L ${R(x + 6 * k)} ${R(y + 6 * k)} L ${R(x)} ${R(y + 21 * k)} L ${R(x - 6 * k)} ${R(y + 6 * k)} L ${R(x - 21 * k)} ${R(y)} L ${R(x - 6 * k)} ${R(y - 6 * k)} Z`, '#FFE9A8', 'opacity=".92"');
      });
    }
    if (has('sparkle_s')) {
      s += path(`M ${R(exR.x + 10)} ${R(exR.y - 84)} l 5 -15 l 5 15 l 15 5 l -15 5 l -5 15 l -5 -15 l -15 -5 Z`, '#FFE9A8', 'opacity=".88"');
    }
    if (has('tears')) {
      s += path(`M ${R(eyL.x - 4)} ${R(eyL.y + 32)} q -12 28 0 44 q 12 -16 0 -44 Z`, '#A9D8F0', 'opacity=".94"');
      s += path(`M ${R(eyL.x + 4)} ${R(eyL.y + 74)} q -9 22 0 34 q 9 -12 0 -34 Z`, '#A9D8F0', 'opacity=".72"');
      s += path(`M ${R(eyR.x + 4)} ${R(eyR.y + 30)} q -11 26 0 40 q 11 -14 0 -40 Z`, '#A9D8F0', 'opacity=".82"');
    }
    if (has('well')) {
      s += ell(eyL.x, eyL.y + 34, 13, 8, '#BEE4F5', 'opacity=".88"');
      s += ell(eyR.x, eyR.y + 32, 11, 7, '#BEE4F5', 'opacity=".72"');
    }
    if (has('well_s')) {
      s += ell(eyL.x, eyL.y + 32, 10, 6, '#BEE4F5', 'opacity=".62"');
      s += ell(eyR.x, eyR.y + 30, 8, 5, '#BEE4F5', 'opacity=".5"');
    }
    if (has('sweat')) {
      s += path(`M ${R(exR.x + 4)} ${R(exR.y - 52)} q -14 24 0 36 q 14 -12 0 -36 Z`, '#9FD8EE', 'opacity=".88"');
    }
    if (has('sweat_big')) {
      s += path(`M ${R(exR.x + 8)} ${R(exR.y - 64)} q -19 32 0 48 q 19 -16 0 -48 Z`, '#9FD8EE', 'opacity=".92"');
      s += path(`M ${R(exR.x - 34)} ${R(exR.y - 88)} q -12 21 0 32 q 12 -11 0 -32 Z`, '#9FD8EE', 'opacity=".7"');
    }
    if (has('blushline')) {
      const y = H(cfg, 0, cfg.eyeY + 0.145).y;
      const lx = H(cfg, -(cfg.eyeDX + 0.02), 0).x, rx2 = H(cfg, cfg.eyeDX + 0.02, 0).x;
      s += `<g stroke="#E58A90" stroke-width="3.4" stroke-linecap="round" opacity=".45">
        <path d="M ${R(lx - 22)} ${R(y - 8)} l 18 -9 M ${R(lx - 20)} ${R(y)} l 18 -9 M ${R(lx - 18)} ${R(y + 8)} l 18 -9"/>
        <path d="M ${R(rx2 - 2)} ${R(y - 8)} l 18 9 M ${R(rx2 - 4)} ${R(y)} l 18 9 M ${R(rx2 - 6)} ${R(y + 8)} l 18 9"/></g>`;
    }
    if (has('surprise')) {
      const t = H(cfg, 0, -0.02).y;
      s += `<g stroke="#F2B84B" stroke-width="6" stroke-linecap="round" opacity=".85">
        <path d="M ${R(exL.x - 2)} ${R(t + 16)} l -16 -28"/><path d="M ${R(exL.x + 52)} ${R(t - 8)} l -8 -30"/>
        <path d="M ${R(exR.x + 2)} ${R(t + 16)} l 16 -28"/><path d="M ${R(exR.x - 52)} ${R(t - 8)} l 8 -30"/></g>`;
    }
    if (has('dots')) {
      s += `<g fill="#9AA6B2" opacity=".8">${circle(exR.x + 6, exR.y - 44, 7, '#9AA6B2')}${circle(exR.x + 30, exR.y - 48, 5, '#9AA6B2')}${circle(exR.x + 50, exR.y - 50, 3.5, '#9AA6B2')}</g>`;
    }
    if (has('zzz')) {
      s += `<g font-family="'PingFang SC','Hiragino Sans GB',sans-serif" fill="#9FB4C8" opacity=".88" font-weight="700">
        <text x="${R(exR.x + 4)}" y="${R(exR.y - 60)}" font-size="32">Z</text>
        <text x="${R(exR.x + 32)}" y="${R(exR.y - 94)}" font-size="24">z</text>
        <text x="${R(exR.x + 52)}" y="${R(exR.y - 120)}" font-size="17">z</text></g>`;
    }
    if (has('anger') || has('anger_s')) {
      const k = has('anger_s') ? 0.7 : 1, t = H(cfg, 0, -0.02).y;
      s += `<g opacity=".85" stroke="#E2604F" stroke-width="${R(7 * k)}" stroke-linecap="round">
        <path d="M ${R(exR.x - 26)} ${R(t + 18)} l ${R(26 * k)} ${R(-24 * k)} M ${R(exR.x - 26)} ${R(t + 18)} l ${R(22 * k)} ${R(26 * k)}"/>
        <path d="M ${R(exR.x + 0)} ${R(t - 6)} l ${R(22 * k)} ${R(-20 * k)} M ${R(exR.x + 0)} ${R(t - 6)} l ${R(19 * k)} ${R(23 * k)}"/></g>`;
    }
    if (has('puff')) {
      /* 鼓腮：两颊向外的小弧，配合 pout */
      const y = H(cfg, 0, cfg.mouthY - 0.02).y;
      const lx = H(cfg, -0.72, 0).x, rx2 = H(cfg, 0.72, 0).x;
      s += stroke(`M ${R(lx)} ${R(y - 16)} q ${R(-12)} ${R(14)} ${R(0)} ${R(28)}`, p.line, 3.4, 'opacity=".42"');
      s += stroke(`M ${R(rx2)} ${R(y - 16)} q ${R(12)} ${R(14)} ${R(0)} ${R(28)}`, p.line, 3.4, 'opacity=".42"');
    }
    return s;
  }

  /* ============================================================
   *  六、头发
   *  统一由颅骨轮廓外扩得到：外扩量 6~14px。
   * ============================================================ */
  function hairCapOuter(cfg, off) {
    /* 沿 SKULL 上半部（含耳侧）生成外扩轮廓的锚点 */
    return SKULL.map(k => {
      const pt = H(cfg, k[0], k[1]);
      const nx = k[0], ny = k[1];
      const len = Math.sqrt(nx * nx + ny * ny) || 1;
      return { x: pt.x + (nx / len) * off, y: pt.y + (ny / len) * off * 0.9 };
    });
  }

  /* 后层发团：包住整个颅骨（含耳侧、后脑），下缘按发束分组 */
  function hairBackYa(p, cfg) {
    const A = (x, y) => H(cfg, x, y);
    const c = cfg.cx;
    const r = A(1.115, 0.50);
    const L = A(-1.115, 0.50);
    const rTop = A(0.98, 0.115), lTop = A(-0.98, 0.115);
    const rEnd = A(1.06, 1.24), lEnd = A(-1.06, 1.24);
    let s = path(
      `M ${R(r.x)} ${R(r.y)}` +
      ` C ${R(c + 118)} ${R(r.y - 96)} ${R(c + 108)} ${R(rTop.y - 26)} ${R(rTop.x)} ${R(rTop.y)}` +
      ` C ${R(c + 60)} ${R(rTop.y - 20)} ${R(c - 60)} ${R(rTop.y - 20)} ${R(lTop.x)} ${R(lTop.y)}` +
      ` C ${R(c - 108)} ${R(lTop.y - 26)} ${R(c - 118)} ${R(L.y - 96)} ${R(L.x)} ${R(L.y)}` +
      ` C ${R(c - 128)} ${R(L.y + 70)} ${R(c - 126)} ${R(rEnd.y - 124)} ${R(lEnd.x)} ${R(lEnd.y)}` +
      ` C ${R(c - 100)} ${R(lEnd.y + 10)} ${R(c - 78)} ${R(A(0, 0.98).y + 16)} ${R(c - 58)} ${R(A(0, 0.98).y + 6)}` +
      ` C ${R(c - 24)} ${R(A(0, 0.98).y - 6)} ${R(c + 24)} ${R(A(0, 0.98).y - 6)} ${R(c + 58)} ${R(A(0, 0.98).y + 6)}` +
      ` C ${R(c + 78)} ${R(A(0, 0.98).y + 16)} ${R(c + 100)} ${R(rEnd.y + 10)} ${R(rEnd.x)} ${R(rEnd.y)}` +
      ` C ${R(c + 126)} ${R(rEnd.y - 124)} ${R(c + 128)} ${R(L.y + 70)} ${R(r.x)} ${R(r.y)} Z`,
      'url(#hair' + (cfg.tag) + ')');
    /* 后脑暗部（贴着颅骨内侧，制造"发团有厚度"的错觉） */
    s += path(
      `M ${R(A(-0.70, 0.34).x)} ${R(A(-0.70, 0.34).y)}` +
      ` C ${R(A(-0.95, 0.62).x)} ${R(A(-0.95, 0.62).y)} ${R(A(-1.02, 0.94).x)} ${R(A(-1.02, 0.94).y)} ${R(A(-0.94, 1.14).x)} ${R(A(-0.94, 1.14).y)}` +
      ` C ${R(A(-0.60, 1.20).x)} ${R(A(-0.60, 1.20).y)} ${R(A(-0.30, 1.20).x)} ${R(A(-0.30, 1.20).y)} ${R(A(-0.16, 1.12).x)} ${R(A(-0.16, 1.12).y)}` +
      ` C ${R(A(-0.34, 0.86).x)} ${R(A(-0.34, 0.86).y)} ${R(A(-0.52, 0.56).x)} ${R(A(-0.52, 0.56).y)} ${R(A(-0.70, 0.34).x)} ${R(A(-0.70, 0.34).y)} Z`,
      p.hairShade, 'opacity=".8"');
    /* 顶部高光 */
    s += path(`M ${R(A(-0.60, 0.16).x)} ${R(A(-0.60, 0.16).y)} C ${R(A(-0.30, 0.06).x)} ${R(A(-0.30, 0.06).y)} ${R(A(0.30, 0.06).x)} ${R(A(0.30, 0.06).y)} ${R(A(0.62, 0.18).x)} ${R(A(0.62, 0.18).y)} C ${R(A(0.30, 0.14).x)} ${R(A(0.30, 0.14).y)} ${R(A(-0.30, 0.14).x)} ${R(A(-0.30, 0.14).y)} ${R(A(-0.60, 0.16).x)} ${R(A(-0.60, 0.16).y)} Z`, p.hairHi, 'opacity=".42"');
    s += path(`M ${R(A(-1.00, 0.62).x)} ${R(A(-1.00, 0.62).y)} C ${R(A(-1.06, 0.90).x)} ${R(A(-1.06, 0.90).y)} ${R(A(-1.02, 1.12).x)} ${R(A(-1.02, 1.12).y)} ${R(A(-0.94, 1.22).x)} ${R(A(-0.94, 1.22).y)}`, 'none',
      `stroke="${p.hairHi}" stroke-width="6" opacity=".22" fill="none" stroke-linecap="round"`);
    return s;
  }

  function hairBackJin(p, cfg) {
    const A = (x, y) => H(cfg, x, y);
    const c = cfg.cx;
    const r = A(1.06, 0.50), L = A(-1.06, 0.50);
    const rTop = A(0.96, 0.10), lTop = A(-0.96, 0.10);
    const rEnd = A(0.92, 0.82), lEnd = A(-0.92, 0.82);
    let s = path(
      `M ${R(r.x)} ${R(r.y)}` +
      ` C ${R(c + 112)} ${R(r.y - 92)} ${R(c + 104)} ${R(rTop.y - 24)} ${R(rTop.x)} ${R(rTop.y)}` +
      ` C ${R(c + 58)} ${R(rTop.y - 18)} ${R(c - 58)} ${R(rTop.y - 18)} ${R(lTop.x)} ${R(lTop.y)}` +
      ` C ${R(c - 104)} ${R(lTop.y - 24)} ${R(c - 112)} ${R(L.y - 92)} ${R(L.x)} ${R(L.y)}` +
      ` C ${R(c - 104)} ${R(L.y + 46)} ${R(c - 96)} ${R(rEnd.y - 60)} ${R(lEnd.x)} ${R(lEnd.y)}` +
      ` C ${R(c - 66)} ${R(lEnd.y + 20)} ${R(c - 40)} ${R(lEnd.y + 22)} ${R(c - 18)} ${R(lEnd.y + 6)}` +
      ` C ${R(c + 24)} ${R(lEnd.y + 26)} ${R(c + 62)} ${R(lEnd.y + 18)} ${R(rEnd.x)} ${R(rEnd.y)}` +
      ` C ${R(c + 96)} ${R(rEnd.y - 60)} ${R(c + 104)} ${R(L.y + 46)} ${R(r.x)} ${R(r.y)} Z`,
      'url(#hair' + cfg.tag + ')');
    s += path(`M ${R(A(-0.62, 0.14).x)} ${R(A(-0.62, 0.14).y)} C ${R(A(-0.28, 0.03).x)} ${R(A(-0.28, 0.03).y)} ${R(A(0.28, 0.03).x)} ${R(A(0.28, 0.03).y)} ${R(A(0.64, 0.16).x)} ${R(A(0.64, 0.16).y)} C ${R(A(0.28, 0.12).x)} ${R(A(0.28, 0.12).y)} ${R(A(-0.28, 0.12).x)} ${R(A(-0.28, 0.12).y)} ${R(A(-0.62, 0.14).x)} ${R(A(-0.62, 0.14).y)} Z`, p.hairHi, 'opacity=".34"');
    return s;
  }

  /* ------------------------------------------------------------
   *  发际线：一条"从头侧向额头中央缓缓下沉、带 3 个浅波"的曲线。
   *  曲线之上是发盖（实心），之下是额头（露出皮肤）。
   *  发际线也是刘海各束的发根锚点，所以刘海与发盖之间不会有缝。
   * ------------------------------------------------------------ */
  function hairlineWave(cfg, hlY, u) {
    /* u ∈ [0,1]（0=观者左太阳穴 → 1=观者右太阳穴）；返回 y 的偏移（头高比例） */
    const edge = Math.pow(Math.abs(u * 2 - 1), 2.8) * 0.112;
    const wave = Math.sin(u * Math.PI * 2) * 0.020 + Math.sin(u * Math.PI * 5) * 0.008;
    return hlY + 0.030 - edge + wave;
  }
  function hairlinePath(cfg, hlY, n, reverse) {
    const N = n || 16;
    let d = '';
    for (let k = 0; k < N; k++) {
      const u = k / (N - 1), x = H(cfg, -1.02 + 2.04 * u, 0).x;
      const y = H(cfg, 0, hairlineWave(cfg, hlY, u)).y;
      d += (k === 0 ? 'M ' : ' L ') + R(x) + ' ' + R(y);
    }
    if (reverse) {
      const parts = d.slice(2).split(' L ');
      d = 'M ' + parts.slice().reverse().join(' L ');
    }
    return d;
  }

  /* 前层发盖：帽子感的核心。下缘走发际线，中央就是露出的额头。 */
  function hairFront(cfg, p, hlY) {
    const A = (x, y) => H(cfg, x, y);
    const c = cfg.cx;
    const oT = A(0, -0.055), oL = A(-1.085, 0.40), oR = A(1.085, 0.40);
    const yEnd = H(cfg, 0, 0.95).y;
    let d = `M ${R(oR.x)} ${R(oR.y)}` +
      ` C ${R(c + 84)} ${R(oR.y - 92)} ${R(c + 80)} ${R(oT.y - 10)} ${R(oT.x)} ${R(oT.y)}` +
      ` C ${R(c - 80)} ${R(oT.y - 10)} ${R(c - 84)} ${R(oL.y - 92)} ${R(oL.x)} ${R(oL.y)}` +
      ` L ${R(H(cfg, -1.055, 0).x)} ${R(yEnd)}`;
    d += hairlinePath(cfg, hlY, 18, false).replace(/^M/, ' L');
    d += ` L ${R(H(cfg, 1.055, 0).x)} ${R(yEnd)} L ${R(H(cfg, 1.085, 0).x)} ${R(oR.y)} Z`;
    let s = path(d, 'url(#hair' + cfg.tag + ')');
    /* 贴颅骨的一圈暗面：让发盖有厚度 */
    s += path(`M ${R(A(-1.02, 0.60).x)} ${R(A(-1.02, 0.60).y)} C ${R(A(-1.04, 0.90).x)} ${R(A(-1.04, 0.90).y)} ${R(c - 100)} ${R(H(cfg, 0, 1.02).y)} ${R(c - 78)} ${R(H(cfg, 0, 1.05).y)} L ${R(c + 78)} ${R(H(cfg, 0, 1.05).y)} C ${R(c + 100)} ${R(H(cfg, 0, 1.02).y)} ${R(A(1.04, 0.90).x)} ${R(A(1.04, 0.90).y)} ${R(A(1.02, 0.60).x)} ${R(A(1.02, 0.60).y)} Z`, p.hairShade, 'opacity=".14"');
    /* 发丝走向：顺着颅骨放射的高光/暗线 */
    for (let i = 0; i < 6; i++) {
      const t = -0.86 + i * 0.345;
      const a1 = A(t * 0.35, 0.02), a2 = A(t * 0.94, 0.30), a3 = A(t, 0.60);
      s += stroke(`M ${R(a1.x)} ${R(a1.y)} C ${R(a2.x * 0.5 + a1.x * 0.5 + t * 6)} ${R((a1.y + a2.y) / 2)} ${R(a2.x)} ${R(a2.y)} ${R(a3.x)} ${R(a3.y)}`,
        i % 2 ? p.hairHi : p.hairShade, i % 2 ? 4.6 : 5.4, i % 2 ? 'opacity=".28"' : 'opacity=".34"');
    }
    /* 发际线软阴影：只贴着发根压一条窄带，不要糊满额头 */
    /* 只在发际线【下方】压一条很窄的暖色阴影：原来跨在发际线上下、又用浅肤色，
       会在深色刘海/发盖上糊出一条浅色横带（看起来像绷带）。 */
    s += path(hairlinePath(cfg, hlY + 0.026, 22, false) + ' L ' + R(H(cfg, 1.02, 0).x) + ' ' + R(H(cfg, 0, hlY + 0.008).y) +
      ' L ' + R(H(cfg, -1.02, 0).x) + ' ' + R(H(cfg, 0, hlY + 0.008).y) + ' Z', p.skinDeep, 'opacity=".20"');
    return s;
  }

  /* 一片带尖的发束：从发根 (rx,ry) 收拢到发梢 (tx,ty) */
  function lockPath(rx, ry, tx, ty, wr, wt, bend) {
    const dx = tx - rx, dy = ty - ry;
    const c1x = rx + dx * 0.30 + bend, c1y = ry + dy * 0.34;
    const c2x = tx - dx * 0.16 + bend * 0.5, c2y = ty - dy * 0.26;
    const c3x = rx + dx * 0.36 - bend * 0.55, c3y = ry + dy * 0.46;
    const c4x = tx - dx * 0.20 - bend * 0.35, c4y = ty - dy * 0.20;
    return `M ${R(rx)} ${R(ry)} C ${R(c1x)} ${R(c1y)} ${R(c2x)} ${R(c2y)} ${R(tx)} ${R(ty)}` +
      ` L ${R(tx)} ${R(ty)} C ${R(c4x)} ${R(c4y)} ${R(c3x)} ${R(c3y)} ${R(rx + wr - wt)} ${R(ry)} Z`;
  }
  /* 单束（带暗侧，分束靠色块读出来） */
  function lock(cfg, p, rx, ry, tx, ty, wr, wt, bend, shade) {
    const dx = tx - rx, dy = ty - ry;
    return path(lockPath(rx, ry, tx, ty, wr, wt, bend), 'url(#hair' + cfg.tag + ')') +
      path(lockPath(rx + wr * 0.10, ry, tx + wt * 0.10, ty, wr * 0.46, wt * 0.6, bend + (shade ? 2 : -2)),
        p.hairShade, 'opacity="' + (shade ? '.5' : '.34') + '"');
  }

  /* 刘海底层的"发量"：填掉分束之间的缝，让刘海是一整片而不是几根细条 */
  function fringeMass(cfg, p, hlY, depth) {
    const A = (x, y) => H(cfg, x, y);
    const c = cfg.cx;
    const roll = (u) => hlY - 0.006 + depth * (0.80 + 0.20 * Math.cos(u * Math.PI * 2));
    let d = '';
    for (let k = 0; k < 24; k++) {
      const u = k / 23, x = H(cfg, -1.02 + 2.04 * u, 0).x;
      d += (k === 0 ? 'M ' : ' L ') + R(x) + ' ' + R(H(cfg, 0, roll(u)).y);
    }
    d += hairlinePath(cfg, hlY, 24, true).replace(/^M/, ' L');
    return path(d + ' Z', 'url(#hair' + cfg.tag + ')');
  }

  /* 刘海：从发际线垂下的 4~7 束（发根连续，不会有缝） */
  function bangs(cfg, p, hlY, tips, bend) {
    const A = (x, y) => H(cfg, x, y);
    const n = tips.length;
    let s = '';
    for (let i = 0; i < n; i++) {
      const u0 = -1 + 2 * i / n, u1 = -1 + 2 * (i + 1) / n;
      const rx = H(cfg, -1.02 + 2.04 * (i / n), 0).x, ry = H(cfg, 0, hairlineWave(cfg, hlY, i / n)).y - 4;
      const rx2 = H(cfg, -1.02 + 2.04 * ((i + 1) / n), 0).x;
      const tx = H(cfg, tips[i][0], 0).x, ty = H(cfg, 0, tips[i][1]).y;
      const wr = (rx2 - rx) / 2 + 3, wt = cfg.headW * (tips[i][2] || 0.045);
      const bd = (bend == null ? 0 : bend) * (i % 2 ? 1 : -1);
      s += lock(cfg, p, rx, ry, tx, ty, wr, wt, bd, i % 2 === 1);
    }
    return s;
  }

  /* 侧发 / 鬓角：顺着脸颊轮廓下垂 */
  function sideLocks(cfg, p, list, bend) {
    const A = (x, y) => H(cfg, x, y);
    let s = '';
    list.forEach((b, i) => {
      const side = b[0];
      const rx = A(side * b[1], b[2]).x, ry = A(side * b[1], b[2]).y;
      const tx = A(side * b[3], b[4]).x, ty = A(side * b[3], b[4]).y;
      const wr = cfg.headW * b[5], wt = cfg.headW * (b[6] == null ? b[5] * 0.35 : b[6]);
      const bd = side * (bend == null ? 6 : bend) * (i % 2 ? 0.6 : 1);
      s += lock(cfg, p, rx, ry, tx, ty, wr, wt, bd, i % 2 === 0);
    });
    return s;
  }

  /* 银发夹（雅 · 她的左侧 = 观者右侧） */
  function silverClip(cfg, p) {
    /* 左侧一枚小银色发夹（她的左侧 = 观者右侧）：约 34×11px，顺发走向斜一点 */
    const c = H(cfg, 1.06, 0.360);
    const k = cfg.headW / 200 * 0.95;
    return `<g transform="translate(${R(c.x)} ${R(c.y)}) rotate(-24) scale(${R(k)})">` +
      path('M -15 0 h 27 a 5 5 0 0 1 0 10 h -27 a 5 5 0 0 1 0 -10 Z', p.silver, `stroke="${p.silverLine}" stroke-width="1.3"`) +
      circle(-15, 5, 5.0, '#E8ECF0', `stroke="${p.silverLine}" stroke-width="1.3"`) +
      path('M -8 2 h 16', 'none', `stroke="#FFFFFF" stroke-width="1.5" opacity=".8"`) +
      '</g>';
  }

  /* ============================================================
   *  七、身体 / 服装
   * ============================================================ */
  /* 肩部与躯干剪影：斜方肌自然斜坡 + 肩线外端略下坠 */
  /* ============================================================
   *  九、头部：后发团 → 耳 → 脸 → 五官 → 识别特征 → 发盖/刘海 → 覆盖物
   * ============================================================ */
  function headOf(charId, m, cfg, p, outfit) {
    const A = (x, y) => H(cfg, x, y);
    const who = charId === 'ya' ? 'ya' : 'jin';
    const hlY = who === 'ya' ? 0.300 : 0.294;      /* 发际线：额头露出一段 */
    const hairUp = (outfit === 'home' && who === 'ya');   /* 居家把头发扎起来 */
    let s = '';
    /* ── 后层发团（在脸之前画，包住颅骨） ── */
    s += who === 'ya' ? hairBackYa(p, cfg) : hairBackJin(p, cfg);
    /* ── 后肩发束（3~4 片尖形发束，分组收尾） ── */
    s += who === 'ya' ? backLocks(cfg, p, [
      [-1, 1.02, 0.50, 1.06, 1.30, 0.075, 0.020],
      [-1, 0.86, 0.62, 0.80, 1.44, 0.058, 0.014],
      [1, 1.06, 0.50, 1.10, 1.22, 0.070, 0.018],
      [1, 0.86, 0.62, 0.90, 1.40, 0.055, 0.013]
    ]) : backLocks(cfg, p, [
      [-1, 1.02, 0.44, 1.05, 0.88, 0.066, 0.017],
      [-1, 0.88, 0.54, 0.85, 0.96, 0.050, 0.013],
      [1, 1.05, 0.44, 1.08, 0.82, 0.062, 0.016]
    ]);
    /* ── 脸 ── */
    s += path(faceSilhouette(cfg), 'url(#skin' + cfg.tag + ')');
    s += ell(cfg.cx, A(0, 1.02).y, cfg.headW * 0.30, cfg.headH * 0.10, p.skinShade, 'opacity=".5"');
    s += ell(A(-0.78, 0.86).x, A(-0.78, 0.86).y, cfg.headW * 0.15, cfg.headH * 0.11, p.skinShade, 'opacity=".32"');
    s += ell(A(0.78, 0.86).x, A(0.78, 0.86).y, cfg.headW * 0.15, cfg.headH * 0.11, p.skinShade, 'opacity=".32"');
    /* 鼻 */
    const nose = A(0.055, cfg.noseY);
    s += stroke(`M ${R(nose.x)} ${R(nose.y - cfg.headH * 0.028)} q ${R(cfg.headW * 0.045)} ${R(cfg.headH * 0.030)} ${R(-cfg.headW * 0.012)} ${R(cfg.headH * 0.040)}`, p.line, 2.6, 'opacity=".5"');
    /* 眉 / 眼 / 嘴 / 腮红 */
    s += eyeHuman(cfg, p, -1, { open: m.open, lid: m.lid, squint: m.squint, look: m.look, tag: cfg.tag, k: 'L', thin: who === 'ya' });
    s += eyeHuman(cfg, p, 1, { open: m.open, lid: m.lid, squint: m.squint, look: m.look, tag: cfg.tag, k: 'R', thin: who === 'ya' });
    s += browHuman(cfg, p, -1, m);
    s += browHuman(cfg, p, 1, m);
    s += mouthHuman(m.mouth, cfg, p);
    s += faceBlush(cfg, p, m);
    /* ── 识别特征（任何角度/表情/服装都必须存在） ── */
    if (who === 'ya') {
      /* 左眼下方小雀斑（她的左侧 = 观者右侧） */
      const t = A(cfg.eyeDX + 0.10, cfg.eyeY + 0.215);
      s += circle(t.x, t.y, 4.0, '#8A5A50', 'opacity=".95"');
    } else {
      /* 右眉尾一道浅旧疤（观者右侧眉尾） */
      const sc = A(cfg.eyeDX + 0.16, cfg.browY - 0.048);
      s += path(`M ${R(sc.x)} ${R(sc.y)} l 15 -9 M ${R(sc.x + 5)} ${R(sc.y + 9)} l 13 -8`, 'none',
        `stroke="#C29A88" stroke-width="2.8" opacity=".9" stroke-linecap="round"`);
    }
    /* ── 发盖 + 刘海 / 侧发（或扎发） ── */
    if (hairUp) {
      s += hairTied(cfg, p);
    } else {
      s += hairFront(cfg, p, hlY);
      s += fringeMass(cfg, p, hlY, who === 'ya' ? 0.108 : 0.098);   /* 发量下探，避免额头露出一条浅色横带 */
      if (who === 'ya') {
        /* 6 束刘海（从发际线垂下，发梢高低交错，不盖住眼睛） */
        s += bangs(cfg, p, hlY, [
          [-0.74, 0.410, 0.128], [-0.45, 0.356, 0.140], [-0.15, 0.436, 0.134],
          [0.16, 0.366, 0.140], [0.46, 0.424, 0.128], [0.76, 0.342, 0.122]
        ], 7);
        s += sideLocks(cfg, p, [
          [-1, 0.97, 0.44, 1.045, 1.34, 0.055, 0.026],
          [-1, 0.90, 0.52, 0.945, 1.06, 0.042, 0.019],
          [1, 0.97, 0.44, 1.045, 1.34, 0.055, 0.026],
          [1, 0.90, 0.52, 0.945, 1.06, 0.042, 0.019]
        ], -8);
      } else {
        /* 7 束刘海：短乱发，右侧多一束斜分 */
        s += bangs(cfg, p, hlY, [
          [-0.80, 0.392, 0.120], [-0.52, 0.448, 0.130], [-0.22, 0.352, 0.124],
          [0.08, 0.428, 0.130], [0.38, 0.368, 0.124], [0.66, 0.444, 0.130], [0.92, 0.336, 0.114]
        ], 8);
        s += sideLocks(cfg, p, [
          [-1, 1.01, 0.34, 1.070, 0.72, 0.050, 0.024],
          [1, 1.01, 0.34, 1.070, 0.72, 0.050, 0.024]
        ], -6);
      }
    }
    if (who === 'jin') {
      /* 短乱发：几撮翘起的碎发，避免变成"锅盖头" */
      [[-0.90, 0.18, -1.07, 0.030], [0.32, 0.06, 0.46, -0.020],
       [0.86, 0.15, 1.02, 0.030]].forEach((t, i) => {
        const r0 = A(t[0], t[1]), r1 = A(t[2], t[3]);
        s += path(lockPath(A(t[0], t[1] + 0.14).x, A(t[0], t[1] + 0.14).y, r1.x, r1.y,
          cfg.headW * 0.078, cfg.headW * 0.014, i % 2 ? 9 : -9), i % 2 ? p.hair : p.hairShade, 'opacity=".95"');
      });
    }
    if (who === 'ya') s += silverClip(cfg, p);
    s += headwear(cfg, p, outfit, who);
    s += extrasHuman(m.extras, p, cfg, who);
    return s;
  }

  /* 居家：把头发随手扎成一个小揪（保留发际线、鬓角与碎发） */
  function hairTied(cfg, p) {
    const A = (x, y) => H(cfg, x, y);
    const hlY = 0.300;
    let s = hairFront(cfg, p, hlY);
    s += fringeMass(cfg, p, hlY, 0.104);
    s += bangs(cfg, p, hlY, [
      [-0.74, 0.400, 0.126], [-0.45, 0.346, 0.138], [-0.15, 0.420, 0.132],
      [0.16, 0.356, 0.138], [0.46, 0.410, 0.126], [0.74, 0.332, 0.120]
    ], 6);
    s += sideLocks(cfg, p, [
      [-1, 0.97, 0.46, 0.955, 0.98, 0.046, 0.020],
      [1, 0.97, 0.46, 0.955, 0.98, 0.046, 0.020]
    ], -5);
    /* 后脑的小揪 + 散落的碎发 */
    const bun = A(0.44, -0.02);
    s += circle(bun.x, bun.y, cfg.headW * 0.135, p.hair) +
      path(`M ${R(bun.x - 20)} ${R(bun.y - 14)} q 24 -12 44 4 q -20 16 -44 -4 Z`, p.hairHi, 'opacity=".32"') +
      stroke(`M ${R(bun.x + 16)} ${R(bun.y + 2)} q 22 12 24 36`, p.hair, 7);
    const bun2 = A(-0.34, 0.02);
    s += circle(bun2.x, bun2.y, cfg.headW * 0.085, p.hairShade);
    return s;
  }

  /* 后肩发束：从耳后垂到肩（让头发有分量，且左右不对称显得自然） */
  function backLocks(cfg, p, list) {
    const A = (x, y) => H(cfg, x, y);
    let s = '';
    list.forEach((b, i) => {
      const side = b[0];
      const rx = A(side * b[1], b[2]).x, ry = A(side * b[1], b[2]).y;
      const tx = A(side * b[3], b[4]).x, ty = A(side * b[3], b[4]).y;
      const wr = cfg.headW * b[5], wt = cfg.headW * b[6];
      s += path(lockPath(rx, ry, tx, ty, wr, wt, side * (i % 2 ? 9 : -7)),
        i % 2 ? p.hair : p.hairShade, i % 2 ? 'opacity=".98"' : 'opacity=".9"');
    });
    return s;
  }

  /* 帽子 / 眼镜 / 发卡等覆盖物 */
  function headwear(cfg, p, outfit, who) {
    const A = (x, y) => H(cfg, x, y);
    const c = cfg.cx;
    let s = '';
    const glasses = (col, thick, isJin) => {
      const eL = H(cfg, -cfg.eyeDX, cfg.eyeY), eR = H(cfg, cfg.eyeDX, cfg.eyeY);
      const rw = cfg.headW * (isJin ? 0.258 : 0.262), rh = cfg.headH * (isJin ? 0.162 : 0.172);
      const cy = H(cfg, 0, cfg.eyeY - 0.006).y;
      return `<g fill="none" stroke="${col}" stroke-width="${R(thick)}" stroke-linejoin="round">
        <rect x="${R(eL.x - rw)}" y="${R(cy - rh)}" width="${R(rw * 2)}" height="${R(rh * 2)}" rx="${R(rh * 0.42)}"/>
        <rect x="${R(eR.x - rw)}" y="${R(cy - rh)}" width="${R(rw * 2)}" height="${R(rh * 2)}" rx="${R(rh * 0.42)}"/>
        <path d="M ${R(eL.x + rw)} ${R(cy - rh * 0.24)} Q ${R(c)} ${R(cy - rh * 0.62)} ${R(eR.x - rw)} ${R(cy - rh * 0.24)}"/>
        <path d="M ${R(eL.x - rw)} ${R(cy - rh * 0.30)} L ${R(H(cfg, -1.06, 0).x)} ${R(cy - rh * 0.66)}"/>
        <path d="M ${R(eR.x + rw)} ${R(cy - rh * 0.30)} L ${R(H(cfg, 1.06, 0).x)} ${R(cy - rh * 0.66)}"/>
      </g>
      <path d="M ${R(eL.x - rw * 0.68)} ${R(cy - rh * 0.52)} l ${R(rw * 0.46)} ${R(rh * 0.5)} M ${R(eR.x - rw * 0.68)} ${R(cy - rh * 0.52)} l ${R(rw * 0.46)} ${R(rh * 0.5)}" fill="none" stroke="#FFFFFF" stroke-width="${R(thick * 0.7)}" opacity=".34"/>`;
    };
    const knitHat = (col, pom) => {
      const top = A(0, -0.095), l = A(-1.14, 0.30), r = A(1.14, 0.30);
      let h = path(`M ${R(r.x)} ${R(r.y)} C ${R(c + 94)} ${R(r.y - 82)} ${R(c + 72)} ${R(top.y - 26)} ${R(top.x)} ${R(top.y)} C ${R(c - 72)} ${R(top.y - 26)} ${R(c - 94)} ${R(r.y - 82)} ${R(l.x)} ${R(l.y)} Z`, col);
      h += path(`M ${R(l.x - 8)} ${R(l.y - 8)} C ${R(c - 92)} ${R(l.y + 16)} ${R(c + 92)} ${R(r.y + 16)} ${R(r.x + 8)} ${R(r.y - 8)} L ${R(r.x + 4)} ${R(r.y + 30)} C ${R(c + 94)} ${R(r.y + 54)} ${R(c - 94)} ${R(l.y + 54)} ${R(l.x - 4)} ${R(l.y + 30)} Z`, col);
      for (let i = 0; i < 9; i++) {
        const x = -0.92 + i * 0.23;
        const t1 = A(x, -0.05), t2 = A(x, 0.32);
        h += stroke(`M ${R(t1.x)} ${R(t1.y)} C ${R(t1.x + 5)} ${R((t1.y + t2.y) / 2)} ${R(t2.x + 5)} ${R((t1.y + t2.y) / 2)} ${R(t2.x)} ${R(t2.y)}`, '#00000033', 3, 'opacity=".5"');
      }
      h += stroke(`M ${R(l.x + 6)} ${R(l.y + 26)} C ${R(c - 80)} ${R(l.y + 44)} ${R(c + 80)} ${R(r.y + 44)} ${R(r.x - 6)} ${R(r.y + 26)}`, '#FFFFFF', 2, 'opacity=".26"');
      if (pom) h += circle(top.x, top.y - 13, 17, col, 'stroke="#00000022" stroke-width="2"') + circle(top.x - 5, top.y - 17, 5, '#FFFFFF', 'opacity=".32"');
      return h;
    };
    if (who === 'ya') {
      if (outfit === 'academic') s += glasses(p.glass, 2.2, false);
      if (outfit === 'winter') s += knitHat(p.hat, true);
      if (outfit === 'swim') {
        /* 大草帽（在脑后，露出脸与刘海） */
        const hy = H(cfg, 0, 0.10).y;
        const brim = `M ${R(c - 164)} ${R(hy + 44)} C ${R(c - 164)} ${R(hy - 32)} ${R(c - 90)} ${R(hy - 74)} ${R(c)} ${R(hy - 76)} C ${R(c + 90)} ${R(hy - 74)} ${R(c + 148)} ${R(hy - 32)} ${R(c + 164)} ${R(hy + 44)}`;
        const inner = `C ${R(c + 142)} ${R(hy + 32)} ${R(c + 86)} ${R(hy + 24)} ${R(c)} ${R(hy + 24)} C ${R(c - 86)} ${R(hy + 24)} ${R(c - 142)} ${R(hy + 32)} ${R(c - 164)} ${R(hy + 44)} Z`;
        s += path(brim + ' ' + inner, '#E8D2A8') +
          path(`M ${R(c - 164)} ${R(hy + 44)} C ${R(c - 142)} ${R(hy + 68)} ${R(c - 76)} ${R(hy + 80)} ${R(c)} ${R(hy + 80)} C ${R(c + 76)} ${R(hy + 80)} ${R(c + 142)} ${R(hy + 68)} ${R(c + 164)} ${R(hy + 44)} C ${R(c + 142)} ${R(hy + 32)} ${R(c + 86)} ${R(hy + 24)} ${R(c)} ${R(hy + 24)} C ${R(c - 86)} ${R(hy + 24)} ${R(c - 142)} ${R(hy + 32)} ${R(c - 164)} ${R(hy + 44)} Z`, '#F4E3C2') +
          path(`M ${R(c - 100)} ${R(hy - 34)} C ${R(c - 52)} ${R(hy - 58)} ${R(c + 52)} ${R(hy - 58)} ${R(c + 100)} ${R(hy - 34)} L ${R(c + 92)} ${R(hy - 4)} C ${R(c + 52)} ${R(hy - 20)} ${R(c - 52)} ${R(hy - 20)} ${R(c - 92)} ${R(hy - 4)} Z`, '#DFC79A') +
          stroke(`M ${R(c - 96)} ${R(hy - 14)} C ${R(c - 42)} ${R(hy - 32)} ${R(c + 42)} ${R(hy - 32)} ${R(c + 96)} ${R(hy - 14)}`, '#C9A97A', 4);
      }
    } else {
      if (outfit === 'casual' || outfit === 'plaid' || outfit === 'home' || outfit === 'nails') s += glasses(p.glass, 3.4, true);
      if (outfit === 'winter') s += knitHat(p.coat, false);
      if (outfit === 'jk') {
        /* 试穿 JK：头顶夹一只小发卡（别扭地把刘海别起来） */
        const cl = H(cfg, 0.66, 0.30);
        s += `<g transform="translate(${R(cl.x)} ${R(cl.y)}) rotate(-16)">
          ${path('M -18 0 h 30 a 5 5 0 0 1 0 10 h -30 a 5 5 0 0 1 0 -10 Z', '#E8B4C0', 'stroke="#C98A98" stroke-width="1.6"')}
          ${circle(-18, 5, 5.4, '#F6DCE2', 'stroke="#C98A98" stroke-width="1.6"')}</g>`;
      }
    }
    return s;
  }

  /* ============================================================
   *  十、躯干剪影 + 手臂 + 全部服装差分
   * ------------------------------------------------------------
   *  躯干剪影：一整块（含肩、胸、上臂），保证轮廓连续、肩膀自然。
   *  T(x, y) 里 y 用头高折算：y=1.34 肩线，y=1.70 胸，y=2.05 腰。
   * ------------------------------------------------------------ */
  function torsoSpec(cfg, kind) {
    const male = cfg.tag === 'Jin';
    const W = cfg.shoulderHalf;
    /* d = 肩线外端的下坠（px），让肩线有坡度 */
    const M = {
      casual:  { W: W,        should: 26, drop: 24 },
      shirt:   { W: W + 4,    should: 30, drop: 28 },
      jacket:  { W: W + 24,   should: 34, drop: 36 },
      hoodie:  { W: W + 34,   should: 36, drop: 40 },
      puffy:   { W: W + 54,   should: 42, drop: 48 },
      blazer:  { W: W + 26,   should: 32, drop: 34 },
      swim:    { W: W - 28,   should: 22, drop: 20 }
    };
    const m = M[kind] || M.casual;
    return { half: m.W, neckW: cfg.neckW + 20, should: m.should, drop: m.drop, male: male };
  }
  function torsoSilhouette(cfg, spec) {
    /* 一整块连续剪影：肩线（斜方肌斜坡 + 外端略下坠）→ 外侧上臂 → 直落到画布底边。
       手臂画在这块剪影"里面"，靠接缝线分层，所以轮廓永远不会断开。 */
    const c = cfg.cx, nw = spec.neckW / 2;
    const y0 = H(cfg, 0, cfg.neckTop - 0.02).y;
    const ySP = H(cfg, 0, cfg.shoulderY).y + spec.drop;
    const L = c - spec.half, Rr = c + spec.half;
    const o = spec.male ? 14 : 16;
    const d = ySP + 150, e = ySP + 330;
    return `M ${R(c - nw + 8)} ${R(y0)}` +
      ` C ${R(c - nw - 6)} ${R(y0 + 30)} ${R(L + 44)} ${R(ySP - 54)} ${R(L)} ${R(ySP)}` +
      ` C ${R(L - 12)} ${R(ySP + 46)} ${R(L + o * 0.25)} ${R(d - 20)} ${R(L + o * 0.45)} ${R(d)}` +
      ` C ${R(L + o * 0.68)} ${R(d + 130)} ${R(L + o)} ${R(e + 120)} ${R(L + o)} 1200` +
      ` L ${R(Rr - o)} 1200` +
      ` C ${R(Rr - o)} ${R(e + 120)} ${R(Rr - o * 0.68)} ${R(d + 130)} ${R(Rr - o * 0.45)} ${R(d)}` +
      ` C ${R(Rr - o * 0.25)} ${R(d - 20)} ${R(Rr + 12)} ${R(ySP + 46)} ${R(Rr)} ${R(ySP)}` +
      ` C ${R(Rr - 44)} ${R(ySP - 54)} ${R(c + nw + 6)} ${R(y0 + 30)} ${R(c + nw - 8)} ${R(y0)} Z`;
  }
  function torsoFill(cfg, kind, fill, extra) {
    return path(torsoSilhouette(cfg, torsoSpec(cfg, kind)), fill, extra);
  }

  function neck(cfg, p) {
    const jawY = H(cfg, 0, cfg.neckTop - 0.10).y, baseY = H(cfg, 0, cfg.neckTop + 0.12).y;
    const w = cfg.neckW / 2, wb = cfg.neckBaseHalf;
    return path(`M ${R(cfg.cx - w + 6)} ${R(jawY)} C ${R(cfg.cx - w + 1)} ${R(jawY + 46)} ${R(cfg.cx - wb - 4)} ${R(baseY - 10)} ${R(cfg.cx - wb - 6)} ${R(baseY + 8)} L ${R(cfg.cx + wb + 6)} ${R(baseY + 8)} C ${R(cfg.cx + wb + 4)} ${R(baseY - 10)} ${R(cfg.cx + w + 1)} ${R(jawY + 46)} ${R(cfg.cx + w - 6)} ${R(jawY)} Z`, p.skin) +
      path(`M ${R(cfg.cx - w + 4)} ${R(jawY - 6)} C ${R(cfg.cx - w - 4)} ${R(jawY + 40)} ${R(cfg.cx - wb + 6)} ${R(baseY + 4)} ${R(cfg.cx - wb + 6)} ${R(baseY + 8)} L ${R(cfg.cx - wb + 26)} ${R(baseY + 8)} C ${R(cfg.cx - wb + 22)} ${R(baseY - 22)} ${R(cfg.cx - w + 14)} ${R(jawY + 30)} ${R(cfg.cx - w + 4)} ${R(jawY - 6)} Z`, p.skinShade, 'opacity=".7"');
  }

  /* 手：掌 + 四指 + 拇指 +（可选）美甲 */
  function handShape(x, y, ang, s, skin, nail) {
    let g = `<g transform="translate(${R(x)} ${R(y)}) rotate(${R(ang)}) scale(${R(s)})">`;
    g += path('M -27 -24 C -34 10 -28 40 -12 50 C 6 60 28 54 38 36 C 46 20 44 -10 36 -26 C 22 -48 -14 -50 -27 -24 Z', skin, 'stroke="rgba(120,80,60,.20)" stroke-width="1.6"');
    g += path('M -24 -18 C -28 -6 -26 16 -16 30', 'none', 'stroke="rgba(150,110,92,.30)" stroke-width="2.6" fill="none"');
    const fw = 9.6;
    for (let i = 0; i < 4; i++) {
      const fx = -20 + i * 15, len = 31 - Math.abs(i - 1) * 7;
      g += path(`M ${R(fx - fw)} -20 C ${R(fx - fw - 1)} ${R(-20 - len)} ${R(fx + fw + 1)} ${R(-20 - len)} ${R(fx + fw)} -20 Z`, skin, 'stroke="rgba(120,80,60,.20)" stroke-width="1.5"');
      if (nail) {
        g += path(`M ${R(fx - fw + 2)} -20 C ${R(fx - fw + 1)} ${R(-20 - len + 5)} ${R(fx + fw - 1)} ${R(-20 - len + 5)} ${R(fx + fw - 2)} -20 Z`, nail === 'cat' ? '#F5A6B4' : '#33333A');
      }
    }
    g += path('M -27 -12 C -48 -8 -58 10 -48 25 C -39 36 -20 31 -14 16 Z', skin, 'stroke="rgba(120,80,60,.20)" stroke-width="1.5"');
    if (nail === 'cat') {
      g += `<g transform="translate(2 -46)">
        ${circle(0, 0, 13, '#FFFFFF', 'opacity=".94"')}
        ${path('M -10 -7 l -4 -10 l 11 3 Z M 10 -7 l 4 -10 l -11 3 Z', '#F5A6B4')}
        ${circle(-4.6, -1, 2.1, '#3A2A28')}${circle(4.6, -1, 2.1, '#3A2A28')}
        ${path('M -4 6 q 4 4 8 0', 'none', 'stroke="#3A2A28" stroke-width="1.8" fill="none"')}</g>`;
    } else if (nail === 'cool') {
      g += path('M -8 -58 l -3 -9 l 9 4 Z M 8 -58 l 3 -9 l -9 4 Z', '#F5A6B4', 'opacity=".9"');
    }
    return g + '</g>';
  }

  /* 手臂：画在躯干剪影"里面"，靠接缝线和一层暗面分层 */
  function armsOf(p, cfg, spec, sleeve, mode) {
    const c = cfg.cx, half = spec.half;
    const ySP = H(cfg, 0, cfg.shoulderY).y + spec.drop;
    const aw = cfg.headW * (spec.male ? 0.47 : 0.45);   /* 上臂宽 */
    const y0 = ySP + 10, y1 = 966;
    const L = c - half, Rr = c + half;
    const seam = 'rgba(58,40,30,.20)';
    let s = '';
    if (mode === 'nails') {
      const lE = { x: c - half + 66, y: ySP + 150 }, rE = { x: c + half - 66, y: ySP + 150 };
      const lW = { x: c - 128, y: ySP + 104 }, rW = { x: c + 128, y: ySP + 104 };
      s += path(`M ${R(L + 20)} ${R(y0)} C ${R(L - 4)} ${R(y0 + 92)} ${R(lE.x - 34)} ${R(lE.y - 34)} ${R(lW.x - 30)} ${R(lW.y + 16)} L ${R(lW.x + 30)} ${R(lW.y - 20)} C ${R(lE.x + 24)} ${R(lE.y - 62)} ${R(L + aw + 6)} ${R(y0 + 104)} ${R(L + aw + 10)} ${R(y0)} Z`, sleeve);
      s += path(`M ${R(Rr - 20)} ${R(y0)} C ${R(Rr + 4)} ${R(y0 + 92)} ${R(rE.x + 34)} ${R(rE.y - 34)} ${R(rW.x + 30)} ${R(rW.y + 16)} L ${R(rW.x - 30)} ${R(rW.y - 20)} C ${R(rE.x - 24)} ${R(rE.y - 62)} ${R(Rr - aw - 6)} ${R(y0 + 104)} ${R(Rr - aw - 10)} ${R(y0)} Z`, sleeve);
      s += handShape(lW.x, lW.y, -18, 1.0, p.skin, 'cat');
      s += handShape(rW.x, rW.y, 18, 1.0, p.skin, 'cool');
      return s;
    }
    if (mode === 'reach') {
      const yR = y0, yB = y1;
      s += path(`M ${R(Rr - aw - 4)} ${R(yR)} C ${R(Rr - aw + 8)} ${R(yR + 160)} ${R(Rr - aw + 2)} ${R(yB - 160)} ${R(Rr - aw + 6)} ${R(yB)} L ${R(Rr - 6)} ${R(yB)} C ${R(Rr - 4)} ${R(yB - 170)} ${R(Rr - 2)} ${R(yR + 170)} ${R(Rr - 14)} ${R(yR)} Z`, sleeve);
      s += path(`M ${R(L + aw - 6)} ${R(yR + 4)} C ${R(L + aw - 40)} ${R(yR + 46)} ${R(c - 250)} ${R(yR + 30)} ${R(c - 296)} ${R(yR + 48)} L ${R(c - 294)} ${R(yR + 92)} C ${R(c - 250)} ${R(yR + 74)} ${R(L + aw - 30)} ${R(yR + 92)} ${R(L + aw - 2)} ${R(yR + 60)} Z`, sleeve);
      s += stroke(`M ${R(L + aw + 4)} ${R(yR + 60)} C ${R(L + aw - 24)} ${R(yR + 84)} ${R(L + aw - 24)} ${R(yB - 120)} ${R(L + aw + 2)} ${R(yB - 10)}`, seam, 2.2);
      s += handShape(c - 302, yR + 68, -74, 0.94, p.skin, null);
      s += handShape((Rr - aw / 2 - 6), yB + 24, 8, 1.0, p.skin, null);
      return s;
    }
    /* 自然下垂：两条手臂在剪影内部，接缝线在腿/躯干之间 */
    s += path(`M ${R(L + 16)} ${R(y0)} C ${R(L + 4)} ${R(y0 + 190)} ${R(L + 8)} ${R(y1 - 190)} ${R(L + 14)} ${R(y1)} L ${R(L + aw)} ${R(y1)} C ${R(L + aw - 4)} ${R(y1 - 200)} ${R(L + aw - 2)} ${R(y0 + 200)} ${R(L + aw + 4)} ${R(y0)} Z`, sleeve);
    s += path(`M ${R(Rr - 16)} ${R(y0)} C ${R(Rr - 4)} ${R(y0 + 190)} ${R(Rr - 8)} ${R(y1 - 190)} ${R(Rr - 14)} ${R(y1)} L ${R(Rr - aw)} ${R(y1)} C ${R(Rr - aw + 4)} ${R(y1 - 200)} ${R(Rr - aw + 2)} ${R(y0 + 200)} ${R(Rr - aw - 4)} ${R(y0)} Z`, sleeve);
    s += path(`M ${R(L + 16)} ${R(y0)} C ${R(L + 4)} ${R(y0 + 190)} ${R(L + 8)} ${R(y1 - 190)} ${R(L + 14)} ${R(y1)} L ${R(L + aw)} ${R(y1)} C ${R(L + aw - 4)} ${R(y1 - 200)} ${R(L + aw - 2)} ${R(y0 + 200)} ${R(L + aw + 4)} ${R(y0)} Z`, '#000000', 'opacity=".055"');
    s += path(`M ${R(Rr - 16)} ${R(y0)} C ${R(Rr - 4)} ${R(y0 + 190)} ${R(Rr - 8)} ${R(y1 - 190)} ${R(Rr - 14)} ${R(y1)} L ${R(Rr - aw)} ${R(y1)} C ${R(Rr - aw + 4)} ${R(y1 - 200)} ${R(Rr - aw + 2)} ${R(y0 + 200)} ${R(Rr - aw - 4)} ${R(y0)} Z`, '#000000', 'opacity=".055"');
    s += stroke(`M ${R(L + aw + 2)} ${R(y0 + 30)} C ${R(L + aw - 10)} ${R(y0 + 250)} ${R(L + aw - 10)} ${R(y1 - 260)} ${R(L + aw + 2)} ${R(y1 - 40)}`, seam, 2.4);
    s += stroke(`M ${R(Rr - aw - 2)} ${R(y0 + 30)} C ${R(Rr - aw + 10)} ${R(y0 + 250)} ${R(Rr - aw + 10)} ${R(y1 - 260)} ${R(Rr - aw - 2)} ${R(y1 - 40)}`, seam, 2.4);
    s += handShape(L + aw / 2 + 4, y1 + 4, -8, 1.0, p.skin, null);
    s += handShape(Rr - aw / 2 - 4, y1 + 4, 8, 1.0, p.skin, null);
    return s;
  }
  armsOf.wrist = function (cfg, spec, mode, side) {
    const c = cfg.cx, half = spec.half;
    const ySP = H(cfg, 0, cfg.shoulderY).y + spec.drop;
    if (mode === 'nails') return { x: c + side * 128, y: ySP + 112 };
    const aw = cfg.headW * (spec.male ? 0.47 : 0.45);
    return { x: c + side * (half - aw / 2 - 4), y: 934 };
  };

  /* ---------------- 服装（雅） ---------------- */
  function outfitYa(p, cfg, outfit) {
    const c = cfg.cx;
    let s = '';
    if (outfit === 'swim') {
      s += torsoFill(cfg, 'swim', p.skin);
      s += path(`M ${R(c - 128)} ${R(H(cfg, 0, 1.30).y)} C ${R(c - 90)} ${R(H(cfg, 0, 1.46).y)} ${R(c - 40)} ${R(H(cfg, 0, 1.50).y)} ${R(c)} ${R(H(cfg, 0, 1.50).y)} C ${R(c + 40)} ${R(H(cfg, 0, 1.50).y)} ${R(c + 90)} ${R(H(cfg, 0, 1.46).y)} ${R(c + 128)} ${R(H(cfg, 0, 1.30).y)}`, 'none', `stroke="#F7F4EC" stroke-width="9" fill="none"`);
      s += path(`M ${R(c - 118)} ${R(H(cfg, 0, 1.46).y)} C ${R(c - 70)} ${R(H(cfg, 0, 1.42).y)} ${R(c + 70)} ${R(H(cfg, 0, 1.42).y)} ${R(c + 118)} ${R(H(cfg, 0, 1.46).y)} L ${R(c + 112)} ${R(H(cfg, 0, 1.62).y)} C ${R(c + 58)} ${R(H(cfg, 0, 1.68).y)} ${R(c - 58)} ${R(H(cfg, 0, 1.68).y)} ${R(c - 112)} ${R(H(cfg, 0, 1.62).y)} Z`, '#F7F4EC');
      s += path(`M ${R(c - 114)} ${R(H(cfg, 0, 1.48).y)} C ${R(c - 60)} ${R(H(cfg, 0, 1.53).y)} ${R(c + 60)} ${R(H(cfg, 0, 1.53).y)} ${R(c + 114)} ${R(H(cfg, 0, 1.48).y)} L ${R(c + 112)} ${R(H(cfg, 0, 1.55).y)} C ${R(c + 58)} ${R(H(cfg, 0, 1.60).y)} ${R(c - 58)} ${R(H(cfg, 0, 1.60).y)} ${R(c - 112)} ${R(H(cfg, 0, 1.55).y)} Z`, '#9FC6DE');
      s += stroke(`M ${R(c - 100)} ${R(H(cfg, 0, 1.72).y)} C ${R(c - 40)} ${R(H(cfg, 0, 1.76).y)} ${R(c + 40)} ${R(H(cfg, 0, 1.76).y)} ${R(c + 100)} ${R(H(cfg, 0, 1.72).y)}`, '#FFFFFF', 3.4, 'opacity=".75"');
      s += path(`M ${R(c - 118)} ${R(H(cfg, 0, 1.78).y)} C ${R(c - 60)} ${R(H(cfg, 0, 1.83).y)} ${R(c + 60)} ${R(H(cfg, 0, 1.83).y)} ${R(c + 118)} ${R(H(cfg, 0, 1.78).y)} L ${R(c + 126)} 1200 L ${R(c - 126)} 1200 Z`, '#F7F4EC');
    } else if (outfit === 'winter') {
      s += torsoFill(cfg, 'puffy', '#F7F1E6');
      s += path(`M ${R(c - 58)} ${R(H(cfg, 0, 1.28).y)} C ${R(c - 50)} ${R(H(cfg, 0, 1.70).y)} ${R(c - 46)} 900 ${R(c - 44)} 1200 L ${R(c + 44)} 1200 C ${R(c + 46)} 900 ${R(c + 50)} ${R(H(cfg, 0, 1.70).y)} ${R(c + 58)} ${R(H(cfg, 0, 1.28).y)} Z`, '#EBE3D4', 'opacity=".92"');
      for (let i = 0; i < 5; i++) {
        const y = H(cfg, 0, 1.60 + i * 0.37).y;
        s += stroke(`M ${R(c - 224)} ${R(y)} C ${R(c)} ${R(y + 26)} ${R(c + 224)} ${R(y + 26)} ${R(c + 224)} ${R(y)}`, '#DFD6C4', 4, 'opacity=".75"');
      }
      s += stroke(`M ${R(c)} ${R(H(cfg, 0, 1.30).y)} L ${R(c)} 1200`, '#D6CBB6', 4, 'opacity=".85"');
      const sy = H(cfg, 0, 1.40).y;
      s += path(`M ${R(c - 128)} ${R(sy - 32)} C ${R(c - 62)} ${R(sy - 56)} ${R(c + 62)} ${R(sy - 56)} ${R(c + 128)} ${R(sy - 32)} C ${R(c + 136)} ${R(sy + 16)} ${R(c + 118)} ${R(sy + 56)} ${R(c + 68)} ${R(sy + 66)} C ${R(c + 12)} ${R(sy + 76)} ${R(c - 76)} ${R(sy + 70)} ${R(c - 120)} ${R(sy + 40)} C ${R(c - 136)} ${R(sy + 12)} ${R(c - 136)} ${R(sy - 10)} ${R(c - 128)} ${R(sy - 32)} Z`, p.scarf);
      s += path(`M ${R(c - 104)} ${R(sy - 24)} C ${R(c - 44)} ${R(sy - 44)} ${R(c + 44)} ${R(sy - 44)} ${R(c + 104)} ${R(sy - 24)}`, 'none', `stroke="#FFFFFF" stroke-width="3" opacity=".32" fill="none"`);
      s += path(`M ${R(c - 92)} ${R(sy + 46)} C ${R(c - 114)} ${R(sy + 136)} ${R(c - 104)} ${R(sy + 220)} ${R(c - 72)} ${R(sy + 284)} L ${R(c - 8)} ${R(sy + 262)} C ${R(c - 30)} ${R(sy + 196)} ${R(c - 34)} ${R(sy + 116)} ${R(c - 30)} ${R(sy + 40)} Z`, p.scarf);
      s += stroke(`M ${R(c - 66)} ${R(sy + 62)} C ${R(c - 84)} ${R(sy + 146)} ${R(c - 78)} ${R(sy + 220)} ${R(c - 50)} ${R(sy + 268)}`, '#FFFFFF', 2.4, 'opacity=".22"');
    } else if (outfit === 'academic') {
      s += torsoFill(cfg, 'blazer', '#D8D3C4');
      const y0 = H(cfg, 0, cfg.neckTop - 0.02).y;
      s += path(`M ${R(c - 78)} ${R(y0)} L ${R(c)} ${R(y0 + 172)} L ${R(c + 78)} ${R(y0)} Z`, p.accent);
      s += path(`M ${R(c - 112)} ${R(y0 - 6)} L ${R(c - 46)} ${R(y0 + 42)} L ${R(c - 14)} ${R(y0 + 200)} L ${R(c - 100)} ${R(y0 + 154)} Z`, '#CCC6B5');
      s += path(`M ${R(c + 112)} ${R(y0 - 6)} L ${R(c + 46)} ${R(y0 + 42)} L ${R(c + 14)} ${R(y0 + 200)} L ${R(c + 100)} ${R(y0 + 154)} Z`, '#CCC6B5');
      s += path(`M ${R(c - 48)} ${R(y0 + 40)} L ${R(c)} ${R(y0 + 172)} L ${R(c + 48)} ${R(y0 + 40)} L ${R(c + 60)} ${R(y0 + 54)} L ${R(c)} ${R(y0 + 200)} L ${R(c - 60)} ${R(y0 + 54)} Z`, '#EFEBE0');
      s += circle(c - 64, H(cfg, 0, 1.72).y, 7, '#B9B3A2') + circle(c - 64, H(cfg, 0, 1.94).y, 7, '#B9B3A2');
      s += stroke(`M ${R(c - 36)} ${R(y0 + 18)} Q ${R(c)} ${R(y0 + 54)} ${R(c + 36)} ${R(y0 + 18)}`, '#D8DCE2', 2.4);
      s += circle(c, H(cfg, 0, cfg.neckTop + 0.26).y, 4.4, '#E8ECF0', 'stroke="#B8BEC6" stroke-width="1.4"');
      s += stroke(`M ${R(c - 150)} ${R(H(cfg, 0, 1.62).y)} C ${R(c - 100)} ${R(H(cfg, 0, 1.68).y)} ${R(c - 60)} ${R(H(cfg, 0, 1.72).y)} ${R(c - 30)} ${R(H(cfg, 0, 1.78).y)}`, '#C6C1B2', 2.4, 'opacity=".7"');
      s += stroke(`M ${R(c + 150)} ${R(H(cfg, 0, 1.62).y)} C ${R(c + 100)} ${R(H(cfg, 0, 1.68).y)} ${R(c + 60)} ${R(H(cfg, 0, 1.72).y)} ${R(c + 30)} ${R(H(cfg, 0, 1.78).y)}`, '#C6C1B2', 2.4, 'opacity=".7"');
    } else if (outfit === 'home') {
      s += torsoFill(cfg, 'hoodie', '#E8E2D6');
      const y0 = H(cfg, 0, cfg.neckTop - 0.02).y;
      s += path(`M ${R(c - 142)} ${R(y0 + 52)} C ${R(c - 104)} ${R(y0 - 16)} ${R(c + 104)} ${R(y0 - 16)} ${R(c + 142)} ${R(y0 + 52)} C ${R(c + 86)} ${R(y0 + 100)} ${R(c - 86)} ${R(y0 + 100)} ${R(c - 142)} ${R(y0 + 52)} Z`, '#DCD5C6');
      s += stroke(`M ${R(c - 32)} ${R(y0 + 86)} L ${R(c - 28)} ${R(y0 + 190)}`, '#C9B79E', 5);
      s += stroke(`M ${R(c + 32)} ${R(y0 + 86)} L ${R(c + 28)} ${R(y0 + 190)}`, '#C9B79E', 5);
      s += circle(c - 28, H(cfg, 0, 1.74).y, 6, '#C9B79E') + circle(c + 28, H(cfg, 0, 1.74).y, 6, '#C9B79E');
      const py = H(cfg, 0, 1.92).y;
      s += path(`M ${R(c - 132)} ${R(py)} L ${R(c + 132)} ${R(py)} L ${R(c + 122)} ${R(py + 132)} L ${R(c - 122)} ${R(py + 132)} Z`, '#D8D2C4', 'opacity=".7"');
      s += stroke(`M ${R(c - 132)} ${R(py)} L ${R(c - 122)} ${R(py + 132)}`, '#C9C2B4', 2.6);
    } else if (outfit === 'dress') {
      s += torsoFill(cfg, 'shirt', '#F2E4E6');
      const y0 = H(cfg, 0, cfg.neckTop - 0.02).y;
      s += path(`M ${R(c - 86)} ${R(y0 - 2)} C ${R(c - 54)} ${R(y0 + 58)} ${R(c + 54)} ${R(y0 + 58)} ${R(c + 86)} ${R(y0 - 2)} L ${R(c + 102)} ${R(y0 + 28)} C ${R(c + 58)} ${R(y0 + 98)} ${R(c - 58)} ${R(y0 + 98)} ${R(c - 102)} ${R(y0 + 28)} Z`, '#FBF3E6');
      s += stroke(`M ${R(c - 92)} ${R(y0 + 10)} C ${R(c - 54)} ${R(y0 + 66)} ${R(c + 54)} ${R(y0 + 66)} ${R(c + 92)} ${R(y0 + 10)}`, '#E0C8CC', 3.4);
      const wy = H(cfg, 0, 1.92).y;
      s += stroke(`M ${R(c - 158)} ${R(wy)} C ${R(c)} ${R(wy + 28)} ${R(c + 158)} ${R(wy)} ${R(c + 158)} ${R(wy)}`, '#E4CDD2', 7);
      s += path(`M ${R(c - 36)} ${R(wy - 6)} q ${R(36)} ${R(-26)} ${R(36)} ${R(8)} q 0 ${R(-34)} ${R(36)} ${R(-8)} q ${R(-32)} ${R(20)} ${R(-72)} 0 Z`, '#D98A8A');
      for (let i = 0; i < 5; i++) {
        const x = c - 136 + i * 68;
        s += stroke(`M ${R(x)} ${R(wy + 22)} L ${R(x - 14)} 1200`, '#E4CDD2', 3, 'opacity=".7"');
      }
    } else {
      /* casual：米白针织开衫 + 浅色内搭 + 牛仔裤 */
      s += torsoFill(cfg, 'jacket', 'url(#casualYa)');
      const y0 = H(cfg, 0, cfg.neckTop - 0.02).y;
      s += path(`M ${R(c - 72)} ${R(y0)} C ${R(c - 64)} ${R(y0 + 160)} ${R(c - 62)} 900 ${R(c - 60)} 1200 L ${R(c + 60)} 1200 C ${R(c + 62)} 900 ${R(c + 64)} ${R(y0 + 160)} ${R(c + 72)} ${R(y0)} Z`, p.accent);
      s += path(`M ${R(c - 232)} ${R(y0 + 16)} C ${R(c - 240)} ${R(y0 + 180)} ${R(c - 232)} 900 ${R(c - 228)} 1200 L ${R(c - 72)} 1200 C ${R(c - 78)} 900 ${R(c - 98)} ${R(y0 + 200)} ${R(c - 92)} ${R(y0 + 34)} Z`, p.cloth);
      s += path(`M ${R(c + 232)} ${R(y0 + 16)} C ${R(c + 240)} ${R(y0 + 180)} ${R(c + 232)} 900 ${R(c + 228)} 1200 L ${R(c + 72)} 1200 C ${R(c + 78)} 900 ${R(c + 98)} ${R(y0 + 200)} ${R(c + 92)} ${R(y0 + 34)} Z`, p.cloth);
      for (let i = 0; i < 8; i++) {
        const x = c - 226 + i * 19;
        s += stroke(`M ${R(x)} ${R(y0 + 50)} L ${R(x - 8)} 1200`, p.clothDeep, 2.4, 'opacity=".42"');
        s += stroke(`M ${R(2 * c - x)} ${R(y0 + 50)} L ${R(2 * c - x + 8)} 1200`, p.clothDeep, 2.4, 'opacity=".42"');
      }
      s += stroke(`M ${R(c - 92)} ${R(y0 + 34)} C ${R(c - 98)} ${R(y0 + 200)} ${R(c - 78)} 900 ${R(c - 72)} 1200`, p.clothShade, 3.2);
      s += stroke(`M ${R(c + 92)} ${R(y0 + 34)} C ${R(c + 98)} ${R(y0 + 200)} ${R(c + 78)} 900 ${R(c + 72)} 1200`, p.clothShade, 3.2);
      s += stroke(`M ${R(c - 34)} ${R(y0 + 34)} Q ${R(c)} ${R(y0 + 78)} ${R(c + 34)} ${R(y0 + 34)}`, '#D8DCE2', 2.4);
      s += circle(c, H(cfg, 0, cfg.neckTop + 0.34).y, 4.4, '#E8ECF0', 'stroke="#B8BEC6" stroke-width="1.4"');
      const jy = H(cfg, 0, 2.02).y;
      s += path(`M ${R(c - 128)} ${R(jy)} L ${R(c + 128)} ${R(jy)} L ${R(c + 120)} 1200 L ${R(c - 120)} 1200 Z`, '#B9C4D2');
      s += stroke(`M ${R(c)} ${R(jy)} L ${R(c)} 1200`, '#9EAAC0', 3, 'opacity=".8"');
    }
    return s;
  }
  function sleeveYa(outfit) {
    return outfit === 'winter' ? '#F7F1E6' : outfit === 'academic' ? '#D8D3C4'
      : outfit === 'swim' ? C.ya.skin : outfit === 'home' ? '#E8E2D6'
        : outfit === 'dress' ? '#F2E4E6' : C.ya.cloth;
  }
  function clothClip(cfg, sp, outfit) {
    const id = 'bs' + cfg.tag + outfit;
    const yTop = H(cfg, 0, cfg.neckTop - 0.42).y;
    const yBot = H(cfg, 0, cfg.shoulderY).y + sp.drop + 80;
    return `<defs><clipPath id="${id}">` +
      path(torsoSilhouette(cfg, sp), 'none') +
      `<rect x="${R(cfg.cx - 166)}" y="${R(yTop)}" width="332" height="${R(yBot - yTop)}"/></clipPath></defs>` +
      `<g clip-path="url(#${id})">`;
  }
  function bodyYa(p, cfg, outfit, act) {
    const sp = torsoSpec(cfg, outfit === 'swim' ? 'swim' : outfit === 'winter' ? 'puffy'
      : outfit === 'academic' ? 'blazer' : outfit === 'home' ? 'hoodie' : outfit === 'dress' ? 'shirt' : 'jacket');
    const neckS = neck(cfg, p);
    let s = neckS + clothClip(cfg, sp, outfit) + outfitYa(p, cfg, outfit) + '</g>';
    s += armsOf(p, cfg, sp, sleeveYa(outfit), 'down');
    /* 左手腕红绳（她的左手 = 观者左侧） */
    const w = armsOf.wrist(cfg, sp, 'down', -1);
    s += `<g transform="rotate(-9 ${R(w.x)} ${R(w.y)})">` +
      stroke(`M ${R(w.x - 34)} ${R(w.y - 26)} q ${R(34)} ${R(14)} ${R(66)} ${R(-2)}`, p.red, 5) +
      stroke(`M ${R(w.x - 26)} ${R(w.y - 8)} q ${R(28)} ${R(12)} ${R(52)} ${R(-2)}`, p.red, 3, 'opacity=".85"') + '</g>';
    return s;
  }

  /* ---------------- 服装（金） ---------------- */
  function outfitJin(p, cfg, outfit) {
    const c = cfg.cx;
    let s = '';
    if (outfit === 'swim') {
      s += torsoFill(cfg, 'swim', p.skin);
      s += path(`M ${R(c - 152)} ${R(H(cfg, 0, 1.50).y)} C ${R(c - 80)} ${R(H(cfg, 0, 1.45).y)} ${R(c + 80)} ${R(H(cfg, 0, 1.45).y)} ${R(c + 152)} ${R(H(cfg, 0, 1.50).y)} L ${R(c + 160)} 1200 L ${R(c - 160)} 1200 Z`, '#2E3A46');
      s += stroke(`M ${R(c - 140)} ${R(H(cfg, 0, 1.56).y)} C ${R(c - 70)} ${R(H(cfg, 0, 1.51).y)} ${R(c + 70)} ${R(H(cfg, 0, 1.51).y)} ${R(c + 140)} ${R(H(cfg, 0, 1.56).y)}`, '#1E2A36', 5);
      s += path(`M ${R(c - 88)} ${R(H(cfg, 0, 1.46).y)} C ${R(c - 30)} ${R(H(cfg, 0, 1.40).y)} ${R(c + 30)} ${R(H(cfg, 0, 1.40).y)} ${R(c + 88)} ${R(H(cfg, 0, 1.46).y)}`, 'none', `stroke="#3E4C5A" stroke-width="4" fill="none"`);
    } else if (outfit === 'winter') {
      s += torsoFill(cfg, 'puffy', p.coat);
      s += path(`M ${R(c - 74)} ${R(H(cfg, 0, 1.28).y)} C ${R(c - 66)} ${R(H(cfg, 0, 1.72).y)} ${R(c - 60)} 900 ${R(c - 58)} 1200 L ${R(c + 58)} 1200 C ${R(c + 60)} 900 ${R(c + 66)} ${R(H(cfg, 0, 1.72).y)} ${R(c + 74)} ${R(H(cfg, 0, 1.28).y)} Z`, '#2A2E34');
      for (let i = 0; i < 5; i++) {
        const y = H(cfg, 0, 1.62 + i * 0.37).y;
        s += stroke(`M ${R(c - 248)} ${R(y)} C ${R(c)} ${R(y + 28)} ${R(c + 248)} ${R(y + 28)} ${R(c + 248)} ${R(y)}`, '#33383F', 4.5, 'opacity=".8"');
      }
      s += stroke(`M ${R(c)} ${R(H(cfg, 0, 1.30).y)} L ${R(c)} 1200`, '#14171A', 4);
      const sy = H(cfg, 0, 1.40).y;
      s += path(`M ${R(c - 148)} ${R(sy - 32)} C ${R(c - 74)} ${R(sy - 58)} ${R(c + 74)} ${R(sy - 58)} ${R(c + 148)} ${R(sy - 32)} C ${R(c + 158)} ${R(sy + 20)} ${R(c + 138)} ${R(sy + 62)} ${R(c + 78)} ${R(sy + 72)} C ${R(c + 14)} ${R(sy + 82)} ${R(c - 88)} ${R(sy + 76)} ${R(c - 140)} ${R(sy + 44)} C ${R(c - 158)} ${R(sy + 14)} ${R(c - 158)} ${R(sy - 8)} ${R(c - 148)} ${R(sy - 32)} Z`, p.scarf);
      s += path(`M ${R(c - 116)} ${R(sy + 50)} C ${R(c - 138)} ${R(sy + 154)} ${R(c - 124)} ${R(sy + 246)} ${R(c - 86)} ${R(sy + 306)} L ${R(c - 12)} ${R(sy + 280)} C ${R(c - 38)} ${R(sy + 210)} ${R(c - 46)} ${R(sy + 122)} ${R(c - 38)} ${R(sy + 44)} Z`, p.scarf);
      s += stroke(`M ${R(c - 92)} ${R(sy + 66)} C ${R(c - 110)} ${R(sy + 160)} ${R(c - 100)} ${R(sy + 240)} ${R(c - 66)} ${R(sy + 288)}`, '#FFFFFF', 2.4, 'opacity=".18"');
    } else if (outfit === 'formal') {
      s += torsoFill(cfg, 'shirt', p.white);
      const y0 = H(cfg, 0, cfg.neckTop - 0.02).y;
      s += path(`M ${R(c - 94)} ${R(y0 - 4)} L ${R(c - 22)} ${R(y0)} L ${R(c - 10)} ${R(y0 + 84)} L ${R(c - 78)} ${R(y0 + 66)} Z`, p.whiteShade, 'opacity=".8"');
      s += path(`M ${R(c + 94)} ${R(y0 - 4)} L ${R(c + 22)} ${R(y0)} L ${R(c + 10)} ${R(y0 + 84)} L ${R(c + 78)} ${R(y0 + 66)} Z`, p.whiteShade, 'opacity=".8"');
      s += path(`M ${R(c - 32)} ${R(y0)} L ${R(c)} ${R(y0 + 56)} L ${R(c + 32)} ${R(y0)} L ${R(c + 9)} ${R(y0 + 4)} L ${R(c)} ${R(y0 + 32)} L ${R(c - 9)} ${R(y0 + 4)} Z`, '#E6E1D6');
      s += stroke(`M ${R(c - 24)} ${R(y0 + 26)} L ${R(c - 22)} 1200`, '#DAD5CB', 4);
      s += stroke(`M ${R(c + 24)} ${R(y0 + 26)} L ${R(c + 22)} 1200`, '#DAD5CB', 4);
      for (let i = 0; i < 3; i++) {
        const by = y0 + 164 + i * 158;
        s += circle(c, by, 6.5, '#CFC9BE') + circle(c - 2, by - 2, 2.6, '#FFFFFF', 'opacity=".6"');
      }
      s += stroke(`M ${R(c - 252)} 990 C ${R(c - 190)} 1004 ${R(c - 140)} 1004 ${R(c - 120)} 992`, '#DAD5CB', 4);
      s += stroke(`M ${R(c + 252)} 990 C ${R(c + 190)} 1004 ${R(c + 140)} 1004 ${R(c + 120)} 992`, '#DAD5CB', 4);
    } else if (outfit === 'jk') {
      s += torsoFill(cfg, 'shirt', '#EDEFF3');
      const y0 = H(cfg, 0, cfg.neckTop - 0.02).y;
      s += path(`M ${R(c - 140)} ${R(y0 - 6)} C ${R(c - 76)} ${R(y0 + 48)} ${R(c + 76)} ${R(y0 + 48)} ${R(c + 140)} ${R(y0 - 6)} L ${R(c + 148)} ${R(y0 + 36)} C ${R(c + 82)} ${R(y0 + 96)} ${R(c - 82)} ${R(y0 + 96)} ${R(c - 148)} ${R(y0 + 36)} Z`, '#4A5C86');
      s += stroke(`M ${R(c - 132)} ${R(y0 + 28)} C ${R(c - 74)} ${R(y0 + 76)} ${R(c + 74)} ${R(y0 + 76)} ${R(c + 132)} ${R(y0 + 28)}`, '#F2F4F8', 4, 'opacity=".9"');
      s += path(`M ${R(c - 50)} ${R(y0 + 66)} L ${R(c)} ${R(y0 + 126)} L ${R(c + 50)} ${R(y0 + 66)} L ${R(c + 32)} ${R(y0 + 56)} L ${R(c)} ${R(y0 + 100)} L ${R(c - 32)} ${R(y0 + 56)} Z`, '#F7F8FA');
      s += path(`M ${R(c - 44)} ${R(y0 + 100)} L ${R(c - 4)} ${R(y0 + 122)} L ${R(c - 4)} ${R(y0 + 156)} L ${R(c - 44)} ${R(y0 + 178)} Z`, '#C9556E');
      s += path(`M ${R(c + 44)} ${R(y0 + 100)} L ${R(c + 4)} ${R(y0 + 122)} L ${R(c + 4)} ${R(y0 + 156)} L ${R(c + 44)} ${R(y0 + 178)} Z`, '#C9556E');
      s += circle(c, y0 + 139, 13, '#B34A60');
      const wy = H(cfg, 0, 1.98).y;
      s += path(`M ${R(c - 146)} ${R(wy)} L ${R(c + 146)} ${R(wy)} L ${R(c + 226)} 1200 L ${R(c - 226)} 1200 Z`, '#4A5C86');
      for (let i = 0; i < 9; i++) {
        const x = c - 128 + i * 32;
        s += path(`M ${R(x)} ${R(wy + 6)} L ${R(x - 24)} 1200 L ${R(x - 9)} 1200 L ${R(x + 10)} ${R(wy + 6)} Z`, '#3E4E74', 'opacity=".85"');
      }
      s += stroke(`M ${R(c - 146)} ${R(wy)} L ${R(c + 146)} ${R(wy)}`, '#33415F', 7);
    } else if (outfit === 'plaid') {
      s += torsoFill(cfg, 'shirt', 'url(#plaidJin)');
      const y0 = H(cfg, 0, cfg.neckTop - 0.02).y;
      s += path(`M ${R(c - 100)} ${R(y0 - 4)} C ${R(c - 62)} ${R(y0 + 46)} ${R(c + 62)} ${R(y0 + 46)} ${R(c + 100)} ${R(y0 - 4)} L ${R(c + 76)} ${R(y0 + 10)} C ${R(c + 40)} ${R(y0 + 42)} ${R(c - 40)} ${R(y0 + 42)} ${R(c - 76)} ${R(y0 + 10)} Z`, p.plaidLine);
      for (let i = 0; i < 11; i++) {
        const y = y0 + 70 + i * 44;
        s += stroke(`M ${R(c - 266)} ${R(y)} L ${R(c + 266)} ${R(y)}`, p.plaidLine, 4, 'opacity=".34"');
      }
      for (let i = 0; i < 11; i++) {
        const x = c - 240 + i * 48;
        s += stroke(`M ${R(x)} ${R(y0 + 24)} L ${R(x - 20)} 1200`, p.plaidLine, 4, 'opacity=".3"');
      }
      for (let i = 0; i < 3; i++) {
        const by = y0 + 190 + i * 170;
        s += circle(c + 6, by, 6.5, '#E6E1D6') + circle(c + 6, by, 6.5, 'none', `stroke="${p.plaidLine}" stroke-width="1.6"`);
      }
      s += stroke(`M ${R(c - 30)} ${R(y0 + 28)} L ${R(c - 28)} 1200`, p.plaidLine, 3.4, 'opacity=".8"');
    } else {
      /* casual / home / nails：卫衣 + 外套 / 居家卫衣 */
      const home = outfit === 'home';
      s += torsoFill(cfg, home ? 'hoodie' : 'jacket', home ? '#363B45' : 'url(#casualJin)');
      const y0 = H(cfg, 0, cfg.neckTop - 0.02).y;
      if (home) {
        s += path(`M ${R(c - 158)} ${R(y0 + 50)} C ${R(c - 116)} ${R(y0 - 18)} ${R(c + 116)} ${R(y0 - 18)} ${R(c + 158)} ${R(y0 + 50)} C ${R(c + 96)} ${R(y0 + 100)} ${R(c - 96)} ${R(y0 + 100)} ${R(c - 158)} ${R(y0 + 50)} Z`, '#42474F');
        s += stroke(`M ${R(c - 34)} ${R(y0 + 84)} L ${R(c - 30)} ${R(y0 + 200)}`, '#9AA0A8', 5);
        s += stroke(`M ${R(c + 34)} ${R(y0 + 84)} L ${R(c + 30)} ${R(y0 + 200)}`, '#9AA0A8', 5);
        s += path(`M ${R(c - 146)} ${R(H(cfg, 0, 1.98).y)} L ${R(c + 146)} ${R(H(cfg, 0, 1.98).y)} L ${R(c + 136)} ${R(H(cfg, 0, 2.16).y)} L ${R(c - 136)} ${R(H(cfg, 0, 2.16).y)} Z`, '#2E323B', 'opacity=".7"');
      } else {
        s += path(`M ${R(c - 96)} ${R(y0 - 2)} C ${R(c - 58)} ${R(y0 + 48)} ${R(c + 58)} ${R(y0 + 48)} ${R(c + 96)} ${R(y0 - 2)} L ${R(c + 72)} ${R(y0 + 12)} C ${R(c + 38)} ${R(y0 + 44)} ${R(c - 38)} ${R(y0 + 44)} ${R(c - 72)} ${R(y0 + 12)} Z`, p.clothDeep);
        s += path(`M ${R(c - 82)} ${R(y0)} C ${R(c - 74)} ${R(y0 + 170)} ${R(c - 70)} 900 ${R(c - 68)} 1200 L ${R(c + 68)} 1200 C ${R(c + 70)} 900 ${R(c + 74)} ${R(y0 + 170)} ${R(c + 82)} ${R(y0)} Z`, '#4A505C');
        s += stroke(`M ${R(c)} ${R(y0 + 96)} L ${R(c)} 1200`, '#C9CCD2', 3);
        s += circle(c, H(cfg, 0, 1.84).y, 7, '#B9BEC6');
        s += stroke(`M ${R(c - 58)} ${R(y0 + 110)} C ${R(c - 74)} ${R(y0 + 300)} ${R(c - 70)} 1000 ${R(c - 66)} 1200`, p.clothShade, 12, 'opacity=".45"');
        s += stroke(`M ${R(c + 58)} ${R(y0 + 110)} C ${R(c + 74)} ${R(y0 + 300)} ${R(c + 70)} 1000 ${R(c + 66)} 1200`, p.clothShade, 12, 'opacity=".45"');
        s += stroke(`M ${R(c - 172)} ${R(H(cfg, 0, 2.02).y)} L ${R(c + 172)} ${R(H(cfg, 0, 2.02).y)}`, '#12151A', 3.4, 'opacity=".45"');
      }
    }
    return s;
  }
  function sleeveJin(outfit) {
    return (outfit === 'formal' || outfit === 'jk') ? C.jin.white : outfit === 'swim' ? C.jin.skin
      : outfit === 'plaid' ? C.jin.plaid : outfit === 'winter' ? C.jin.coat
        : outfit === 'home' ? '#363B45' : C.jin.cloth;
  }
  function bodyJin(p, cfg, outfit, act) {
    const sp = torsoSpec(cfg, outfit === 'swim' ? 'swim' : outfit === 'winter' ? 'puffy'
      : outfit === 'home' ? 'hoodie' : outfit === 'formal' || outfit === 'jk' || outfit === 'plaid' ? 'shirt' : 'jacket');
    let s = neck(cfg, p) + clothClip(cfg, sp, outfit) + outfitJin(p, cfg, outfit) + '</g>';
    s += armsOf(p, cfg, sp, sleeveJin(outfit), outfit === 'nails' ? 'nails' : 'down');
    /* 左手腕旧腕表（观者左侧） */
    const w = armsOf.wrist(cfg, sp, 'down', -1);
    s += `<g transform="rotate(-10 ${R(w.x)} ${R(w.y)})">
      ${stroke(`M ${R(w.x - 34)} ${R(w.y - 22)} q ${R(34)} ${R(14)} ${R(66)} ${R(-2)}`, '#6A5A46', 13)}
      ${circle(w.x, w.y - 46, 17, '#E8E2D2', 'stroke="#8C7A62" stroke-width="3.4"')}
      ${circle(w.x, w.y - 46, 12, '#FBF7EC', 'stroke="#B8A88E" stroke-width="1.6"')}
      ${stroke(`M ${R(w.x)} ${R(w.y - 56)} L ${R(w.x)} ${R(w.y - 46)} L ${R(w.x + 8)} ${R(w.y - 41)}`, '#4A4038', 3.4)}</g>`;
    /* Ginpu 钥匙扣：随身小物，挂在观者右侧腰间（本作原创企鹅玩偶，与 cg_ginpu.svg 同一套配色） */
    if (outfit === 'casual' || outfit === 'nails' || outfit === 'home') {
      s += `<g transform="translate(${R(cfg.cx + cfg.shoulderHalf - 56)} 1036)">
        ${circle(0, 0, 17, '#3B4A63', 'stroke="#8A9CBB" stroke-width="3"')}
        ${path('M -7 13 C -7 0 -6 -9 0 -9 C 6 -9 7 0 7 13 Z', '#F6F2E9')}
        ${path('M -2.6 13 L 2.6 13 L 0 -9 Z', '#D3E5F7')}
        ${path('M -5.5 -2.5 L 5.5 -2.5 L 0 5.5 Z', '#F2C44F')}
        ${circle(-6, -8, 2.8, '#FCFAF6')}${circle(6, -8, 2.8, '#FCFAF6')}
        ${circle(-6, -8, 1.7, '#16171C')}${circle(6, -8, 1.7, '#16171C')}
        ${stroke('M -4 -20 C -7 -26 -3 -29 0 -26', '#3B4A63', 2.4)}
        ${circle(-11.5, -3, 3, '#E9838F', 'opacity="0.5"')}${circle(11.5, -3, 3, '#E9838F', 'opacity="0.5"')}</g>`;
    }
    return s;
  }

  /* ============================================================
   *  十一、动作变换与合成
   * ============================================================ */
  const SC = 'translate(360 0) scale(1.02 0.97) translate(-360 0)';
  const ACT_BODY = {
    idle: '', sit: 'translate(0 104) ' + SC, lean: 'translate(16 22) rotate(4 360 900)',
    bow: 'translate(0 30) rotate(6.5 360 700)', reach: 'translate(-4 8)', turn: 'translate(18 6) rotate(-5 360 820)',
    hug_open: 'translate(0 -8) translate(360 0) scale(1.03) translate(-360 0)', shy_hide: 'translate(0 16)',
    sleepy: 'translate(6 22) rotate(5 360 700)', look_up: 'translate(-4 -16)'
  };
  const ACT_BODY_JIN = {
    idle: '', sit: 'translate(0 104) ' + SC, lean: 'translate(-14 20) rotate(-3 360 900)',
    bow: 'translate(0 30) rotate(7 360 700)', reach: 'translate(4 8)', turn: 'translate(-18 6) rotate(5 360 820)',
    hug_open: 'translate(0 -8) translate(360 0) scale(1.03) translate(-360 0)', shy_hide: 'translate(0 16)',
    sleepy: 'translate(-6 24) rotate(-6 360 700)', look_up: 'translate(4 -16)'
  };
  /* 头部/颈部锚点：所有头转动都绕这里，避免头"脱开"脖子 */
  function neckAnchor(cfg) { return H(cfg, 0, cfg.neckTop + 0.06); }

  function drawYa(m, act, outfit) {
    const p = C.ya, cfg = Object.assign({ tag: 'Ya' }, FACE.ya);
    const han = (act === 'nails') ? 'nails' : 'down';
    const body = bodyYa(p, cfg, outfit, han === 'nails' ? 'nails' : act);
    const na = neckAnchor(cfg);
    const headTilt = (m.tilt || 0) * 0.9 + (act === 'sleepy' ? 4 : 0) + (act === 'look_up' ? -2 : 0);
    const head = headOf('ya', m, cfg, p, outfit);
    return `<g transform="${ACT_BODY[act] || ''}">${body}` +
      `<g transform="${rot(headTilt, na.x, na.y)}">${head}</g></g>`;
  }

  function drawJin(m, act, outfit) {
    const p = C.jin, cfg = Object.assign({ tag: 'Jin' }, FACE.jin);
    const body = bodyJin(p, cfg, outfit, act);
    const na = neckAnchor(cfg);
    const headTilt = (m.tilt || 0) * 0.9 + (act === 'sleepy' ? -4 : 0) + (act === 'look_up' ? 2 : 0);
    const head = headOf('jin', m, cfg, p, outfit);
    return `<g transform="${ACT_BODY_JIN[act] || ''}">${body}` +
      `<g transform="${rot(headTilt, na.x, na.y)}">${head}</g></g>`;
  }

  function defsFor(charId) {
    const p = C[charId];
    const tag = charId === 'ya' ? 'Ya' : 'Jin';
    let d = lin('skin' + tag, 0, 240, 0, 620,
      [[0, p.skin], [0.42, p.skin], [1, p.skinShade]])   /* 顶部不再用近白色：否则裸露的额头会成一条惨白横带 */ +
      lin('hair' + tag, 0, 210, 0, 700,
        [[0, p.hairHi], [0.34, p.hair], [1, p.hairShade]]) +
      `<radialGradient id="iris${tag}" gradientUnits="objectBoundingBox" cx="0.40" cy="0.30" r="0.80">
        <stop offset="0" stop-color="${p.irisA}"/><stop offset="0.60" stop-color="${p.irisB}"/><stop offset="1" stop-color="#2A1A14"/></radialGradient>`;
    if (charId === 'ya') {
      d += lin('casualYa', 0, 560, 0, 1240, [[0, '#FFFCF6'], [0.5, p.cloth], [1, p.clothShade]]);
    } else {
      d += lin('casualJin', 0, 550, 0, 1240, [[0, '#4C525E'], [0.5, p.cloth], [1, p.clothDeep]]);
      d += lin('plaidJin', 0, 550, 0, 1240, [[0, '#51709A'], [0.5, p.plaid], [1, p.plaidLine]]);
    }
    return d;
  }

  /* ============================================================
   *  十二、对外接口
   * ============================================================ */
  YJ.art = {
    W: 720, H: 1080,
    /* 供自检脚本读取关键比例（不参与绘制） */
    _measure(charId) {
      const cfg = Object.assign({ tag: charId === 'ya' ? 'Ya' : 'Jin' }, FACE[charId]);
      const sp = torsoSpec(cfg, 'casual');
      const headW = cfg.headW, headH = cfg.headH;
      const headWp = headW, headHp = headH - 0.012 * headH - (1 - 1.030) * headH;
      const shY = H(cfg, 0, cfg.shoulderY).y + sp.drop;
      return {
        headW: headWp, headH: Math.round(0.012 * headH + (1.030 - 0.012) * headH),
        neckW: cfg.neckW, shoulderY: Math.round(shY),
        shoulderSpan: Math.round(sp.half * 2),
        maxW: Math.round(sp.half * 2),
        armDelt: Math.round(sp.should * 2)
      };
    },
    MOODS, COLORS: C, HAND_KINDS: { hold: '牵手', cat_nails: '猫猫美甲', cool_nails: '酷酷美甲', gift: '递出猫猫明信片' },

    characterBody(charId, expr, act, opts) {
      opts = opts || {};
      const base = MOODS[expr] ? MOODS[expr] : MOODS.neutral;
      const m = Object.assign({}, MOODS.neutral, base, opts.mood || {});
      const ch = (YJ.characters && YJ.characters[charId]) || { outfits: ['casual'], defaultOutfit: 'casual' };
      let outfit = opts.outfit || ch.defaultOutfit || 'casual';
      if (ch.outfits && ch.outfits.indexOf(outfit) < 0) outfit = ch.defaultOutfit || 'casual';
      const a = act || 'idle';
      let content;
      try {
        content = charId === 'jin' ? drawJin(m, a, outfit) : drawYa(m, a, outfit);
      } catch (e) {
        content = drawYa(m, 'idle', 'casual');
      }
      /* 上半身整体微倾（与头部倾斜叠加，做出"整个人的姿态"） */
      const tilt = 0;
      return {
        defs: defsFor(charId),
        /* 画布配平：按 Chrome getBBox 实测墨迹包围盒精算（原始 x=-88..626 / y=-121..1245）⇒
           目标：头发最高点 y≈110、躯干底端 y≈1080 被画布裁切、水平中心 x=360
           ≈ 画布高的 1/3.6 ~ 1/3.2；躯干一直画到 y=1200，被画布底边裁切。 */
        content: `<g transform="translate(136.5 117.1) scale(0.8024)">\n${content}\n</g>`,
        mood: m, outfit: outfit
      };
    },

    characterSVG(charId, expr, act, opts) {
      const b = this.characterBody(charId, expr, act, opts);
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 1080" width="720" height="1080">
<defs>${b.defs}</defs>
${b.content}
</svg>`;
    },

    /* ---------------- 手部特写 ----------------
     * v4 重画（2026-10 · 修"面包 + 香肠 + 悬空手表"）：
     * 旧版把"手掌"画成一个大椭圆、四根手指画成四根互不相连的锥形块贴在椭圆上，
     * 于是读起来是"两块面包 / 五根香肠"；牵手那张还叠了一只悬空的手表。
     * 本版改成按解剖分层拼一只连续的手：
     *   拇指·四指（锥形指节 + 圆指尖）→ 手背（掌指关节脊线，盖住所有指根）
     *   → 剪影遮罩投影（剪影 − 反向偏移的剪影 = 右下侧一圈 cel 阴影）
     *   → 描边 / 指节褶 / 肌腱线 / 高光 / 指甲（含甲油、月牙、反光、银线）
     *
     * 局部坐标系（背侧视角，dorsal）：原点 = 掌指关节连线中点；x 向右，y 朝手腕为正；
     * 四指朝 −y 长出（中指最长），拇指朝左上；手腕一直画到 y=980。
     * 之所以要这么定：handSVG 画布是 720×1080，#hand-layer 用
     * preserveAspectRatio="xMidYMid slice" 铺满 16:9 舞台 ⇒ 玩家实际只看得到
     * 画布中间那条横带（y ∈ 540 ± 202.5，即 [337.5, 742.5]）。
     * 所以构图必须压在这条带里，而手腕必定被裁掉 —— 不会再出现"被切断的手"，
     * 画在手腕上的手表/红绳也就没有位置了（旧版那只悬空手表正是因此显得怪）。
     */
    handSVG(kind) {
      const kk = 0.5523;
      /* 未知 kind 一律回退 hold（与旧版一致：宁可显示"两只手"，也不要因为剧本里写错
         一个字母就静默变成"递明信片"）。 */
      const NAIL_KINDS = ['both_nails', 'both_cat', 'both_cool', 'mixed_left_cat', 'mixed_right_cat', 'butterfly_nails'];
      const SINGLE_KINDS = ['cat_nails', 'cool_nails', 'butterfly_one'];
      const K = SINGLE_KINDS.concat(['gift']).concat(NAIL_KINDS).indexOf(kind) >= 0 ? kind : 'hold';
      /* 穿戴甲（粉色蝴蝶）的调色板：单手 butterfly_one 与双手 butterfly_nails 共用，
         左右手的粉各一档，都是"粉底 + 每片甲面一只蝴蝶"，没有黑、没有银线。 */
      const FLY = {
        left: { plate: '#F9C6D5', edge: '#E79CB4', cuticle: '#E599B0' },
        right: { plate: '#F4A9BE', edge: '#E07F9C', cuticle: '#DC7C98' }
      };
      const FLYACC = {
        left: { wing: '#EC91AE', ink: '#C9546F', dot: '#FFFAF4' },
        right: { wing: '#E27D9C', ink: '#B94463', dot: '#FFF8F2' }
      };
      /* 手指定义：bx/by = 指根中心，ang = 张开角，L = 指根到指尖圆心的距离 */
      const FING = [
        { bx: -60, by: 12, ang: -8, L: 128, wb: 20.6, wt: 17.0 },  /* 食指 */
        { bx: -20, by: 0, ang: -2, L: 143, wb: 22.0, wt: 18.2 },  /* 中指（最长） */
        { bx: 22, by: 5, ang: 5, L: 133, wb: 20.6, wt: 17.0 },  /* 无名指 */
        { bx: 58, by: 26, ang: 12, L: 101, wb: 17.2, wt: 14.4 }   /* 小指 */
      ];
      const THUMB = { bx: -44, by: 172, ang: -40, L: 156, wb: 31, wt: 24 };
      /* 手背：掌指关节脊线（中指最高、小指最低）→ 尺侧 → 手腕带 → 桡侧/大鱼际 */
      const PALM = 'M -84 22 C -82 2 -74 -6 -58 -1 C -46 3 -33 -6 -20 -11 ' +
        'C -6 -15 8 -10 22 -6 C 42 0 58 10 68 24 C 79 40 86 62 88 88 ' +
        'C 90 130 85 168 77 194 C 70 220 61 262 57 316 C 55 420 56 700 56 980 ' +
        'L -50 980 C -48 700 -47 420 -49 316 C -51 262 -58 248 -66 214 ' +
        'C -73 186 -77 160 -78 140 C -80 100 -82 60 -84 22 Z';

      /* 单指轮廓：锥形 + 半圆指尖（原点=指根中心，指向 −y） */
      function fPath(f, slim) {
        const L = f.L, wb = f.wb * slim, wt = f.wt * slim;
        return `M ${R(-wb)} 0`
          + ` C ${R(-wb)} ${R(-L * .42)} ${R(-wt)} ${R(-L * .68)} ${R(-wt)} ${R(-L)}`
          + ` C ${R(-wt)} ${R(-L - wt * kk)} ${R(-wt * kk)} ${R(-L - wt)} 0 ${R(-L - wt)}`
          + ` C ${R(wt * kk)} ${R(-L - wt)} ${R(wt)} ${R(-L - wt * kk)} ${R(wt)} ${R(-L)}`
          + ` C ${R(wt)} ${R(-L * .68)} ${R(wb)} ${R(-L * .42)} ${R(wb)} 0 Z`;
      }
      /* 指甲：方圆形（squoval），甲根是向指根鼓的弧、甲尖是圆角 */
      function fNail(f, slim) {
        const L = f.L, wt = f.wt * slim, T = L + wt;
        const y0 = T * .735, y1 = T * .955, nw = wt * .76, ym = y0 + (y1 - y0) * .42;
        return `M ${R(-nw * .84)} ${R(-(y0 - 3))}`
          + ` C ${R(-nw * 1.06)} ${R(-(y0 + 4))} ${R(-nw * 1.03)} ${R(-(ym - 5))} ${R(-nw)} ${R(-ym)}`
          + ` C ${R(-nw * .98)} ${R(-(y1 - 4))} ${R(-nw * .80)} ${R(-y1)} ${R(-nw * .50)} ${R(-(y1 + 1.5))}`
          + ` C ${R(-nw * .20)} ${R(-(y1 + 2.6))} ${R(nw * .20)} ${R(-(y1 + 2.6))} ${R(nw * .50)} ${R(-(y1 + 1.5))}`
          + ` C ${R(nw * .80)} ${R(-y1)} ${R(nw * .98)} ${R(-(y1 - 4))} ${R(nw)} ${R(-ym)}`
          + ` C ${R(nw * 1.03)} ${R(-(ym - 5))} ${R(nw * 1.06)} ${R(-(y0 + 4))} ${R(nw * .84)} ${R(-(y0 - 3))}`
          + ` C ${R(nw * .45)} ${R(-y0)} ${R(-nw * .45)} ${R(-y0)} ${R(-nw * .84)} ${R(-(y0 - 3))} Z`;
      }

      /* 一只手（背侧视角）。
         o: { uid, skin, shade, deep, line, crease, hi, slim, nail, nailThumb, cat, tail, paw,
              catFill, catInk, pink:{plate,edge,cuticle}, black:{plate,edge,sheen,line}, sdx, sdy }
         · nail  : 'plain'（素甲）| 'pink'（猫猫款粉底）| 'black'（磨砂黑）
         · cat   : 无名指甲面画小猫脸；tail: 中指甲面画卷尾巴；paw: 中指甲面画小肉垫
         · pink / black：按手给不同的甲油配色（"两只手同款"时用细微色差区分左右手） */
      function dorsalHand(o) {
        const slim = o.slim || 1, uid = o.uid;
        const tail = o.tail === undefined ? !!o.cat : !!o.tail;
        const catFill = o.catFill || '#FFFFFF', catInk = o.catInk || '#3A2A28';
        const under = [];
        const put = (f, role) => under.push({
          d: fPath(f, slim), f,
          t: `translate(${R(f.bx)} ${R(f.by)}) rotate(${R(f.ang)})`, role
        });
        put(THUMB, 'thumb'); put(FING[3], 'p4'); put(FING[2], 'p3');
        put(FING[1], 'p2'); put(FING[0], 'p1');
        const mk = (p, extra) => `<path d="${p.d}"${p.t ? ` transform="${p.t}"` : ''}${extra}/>`;
        const all = under.concat([{ d: PALM, t: '', role: 'palm' }]);
        /* 剪影遮罩：白 = 剪影；再压一份反向偏移的黑剪影 ⇒ 只留右下侧一条 cel 阴影 */
        const sil = all.map(p => mk(p, ' fill="#fff"')).join('');
        const sil2 = all.map(p => mk(p, ' fill="#000"')).join('');
        const defs =
          `<mask id="hm_${uid}" maskUnits="userSpaceOnUse" x="-420" y="-420" width="900" height="1600">` +
          sil + `<g transform="translate(${R(-(o.sdx || 10))} ${R(-(o.sdy || 12))})">` + sil2 + '</g></mask>' +
          `<mask id="hp_${uid}" maskUnits="userSpaceOnUse" x="-420" y="-420" width="900" height="1600">` +
          '<rect x="-420" y="-420" width="900" height="1600" fill="#fff"/>' +
          mk({ d: PALM }, ' fill="#000"') + '</mask>' +
          `<mask id="hs_${uid}" maskUnits="userSpaceOnUse" x="-420" y="-420" width="900" height="1600">` +
          sil + '</mask>' +
          `<linearGradient id="hg_${uid}" gradientUnits="userSpaceOnUse" x1="0" y1="-30" x2="0" y2="330">` +
          '<stop offset="0" stop-color="#B8846A" stop-opacity="0"/>' +
          '<stop offset="0.38" stop-color="#B8846A" stop-opacity="0.16"/>' +
          '<stop offset="1" stop-color="#A87760" stop-opacity="0.42"/></linearGradient>';
        let g = under.map(p => mk(p, ` fill="${o.skin}"`)).join('');
        g += mk({ d: PALM }, ` fill="${o.skin}"`);
        g += `<rect x="-420" y="-420" width="900" height="1600" fill="${o.shade}" opacity=".88" mask="url(#hm_${uid})"/>`;
        /* 指根/指间压深，避免"香肠浮在手背上" */
        g += `<g mask="url(#hp_${uid})" opacity=".5">`
          + `<path d="M -86 6 C -60 -2 -20 4 20 0 C 46 -3 66 12 78 26 C 60 34 34 30 4 30 C -30 30 -62 34 -86 26 Z" fill="${o.deep}" opacity=".45"/>`
          + '</g>';
        g += `<rect x="-420" y="-420" width="900" height="1600" fill="url(#hg_${uid})" mask="url(#hs_${uid})"/>`;
        g += `<g mask="url(#hp_${uid})">` +
          under.map(p => mk(p, ` fill="none" stroke="${o.line}" stroke-width="3.8"`)).join('') + '</g>';
        g += mk({ d: PALM }, ` fill="none" stroke="${o.line}" stroke-width="3.8"`);
        /* ---- 手背肌腱线 + 指节褶 + 指甲 ---- */
        g += `<g fill="none" stroke="${o.crease}" stroke-width="3" stroke-linecap="round" opacity=".3">`
          + `<path d="M -58 16 C -48 78 -36 150 -24 208"/>`
          + `<path d="M -16 6 C -14 78 -13 150 -14 212"/>`
          + `<path d="M 46 30 C 54 96 56 152 52 208"/>`
          + '</g>';
        under.forEach(p => {
          const f = p.f, T = f.L + f.wt * slim;
          const wAt = t => (f.wb + (f.wt - f.wb) * t) * slim;
          let d = '';
          /* 指节褶（近端指间关节，两小道） */
          [.49].forEach((t, j) => {
            const y = -T * t, w = wAt(t) * .62 * (p.role === 'thumb' ? 1.15 : 1);
            d += `<path d="M ${R(-w)} ${R(y + w * .16)} Q 0 ${R(y - w * .18)} ${R(w)} ${R(y + w * .16)}" fill="none" stroke="${o.crease}" stroke-width="2.6" opacity=".42" stroke-linecap="round"/>`;
          });
          /* 指甲 */
          const y0 = T * .735, y1 = T * .955, nw = f.wt * slim * .76;
          const cy = -(y0 + (y1 - y0) * .42);
          const style = p.role === 'thumb' ? (o.nailThumb || o.nail) : o.nail;
          const pk = o.pink || {};
          const bk = o.black || {};
          const isPinkNail = style === 'pink' || style === 'butterfly';   /* 蝴蝶款也是粉底 */
          const plate = isPinkNail ? (pk.plate || '#F5A6B4') : style === 'black' ? (bk.plate || '#33333A') : '#F1D8C8';
          const edge = isPinkNail ? (pk.edge || '#E4889B') : style === 'black' ? (bk.edge || '#1C1C22') : '#DFBCA7';
          let n = `<path d="${fNail(f, slim)}" fill="${plate}" stroke="${edge}" stroke-width="2.2"/>`;
          if (style === 'pink') {
            /* 甲油反光：贴着甲面左缘的一道月牙 + 一个小亮点（限色平涂的高光画法） */
            const gy1 = y0 + (y1 - y0) * .18, gy2 = y0 + (y1 - y0) * .56, gy3 = y1 - 3;
            n += `<path d="M ${R(-nw * .70)} ${R(-gy1)} C ${R(-nw * .92)} ${R(-gy2)} ${R(-nw * .78)} ${R(-gy3)} ${R(-nw * .42)} ${R(-gy3 - 1)} C ${R(-nw * .62)} ${R(-gy2)} ${R(-nw * .58)} ${R(-gy1 - 6)} ${R(-nw * .70)} ${R(-gy1)} Z" fill="#FFFFFF" opacity=".42"/>`;
            n += `<ellipse cx="${R(-nw * .42)}" cy="${R(-(y0 + (y1 - y0) * .30))}" rx="${R(nw * .17)}" ry="${R((y1 - y0) * .12)}" fill="#FFFFFF" opacity=".85"/>`;
            n += `<path d="M ${R(-nw * .74)} ${R(-(y0 - 3))} Q 0 ${R(-(y0 - 7))} ${R(nw * .74)} ${R(-(y0 - 3))}" fill="none" stroke="${pk.cuticle || '#D9808F'}" stroke-width="1.8" opacity=".5"/>`;
          } else if (style === 'black') {
            n += `<ellipse cx="${R(-nw * .22)}" cy="${R(cy)}" rx="${R(nw * .56)}" ry="${R((y1 - y0) * .32)}" fill="${bk.sheen || '#5C5C68'}" opacity=".5"/>`;
            /* 剧本 c8_90 原文："另一只手是磨砂黑，**只有中指上一条很细的银线**"
               ⇒ 银线只画在中指（p2）那一片甲面，其余黑甲保持纯磨砂（只留哑光高光）。 */
            if (p.role === 'p2') {
              n += `<path d="M ${R(-nw * .12)} ${R(-(y0 - 1))} L ${R(-nw * .12)} ${R(-(y1 - 3))}" stroke="${bk.line || '#C9CCD2'}" stroke-width="2.3" stroke-linecap="round" opacity=".9"/>`;
            }
          } else if (style === 'butterfly') {
            /* 穿戴甲（第 9 章义乌段落）：甜粉底 + 甲尖一层更深的粉（深浅渐变）+ 每片一只小蝴蝶
               —— 与第 8 章"猫猫款 / 磨砂黑"完全不同的另一套：全图粉，没有黑、没有银线。 */
            const fly = o.fly || {};
            const wing = fly.wing || '#FFFBF6', ink = fly.ink || '#D9647F', dot = fly.dot || '#F2A0B6';
            const bw = nw * .76, bh = (y1 - y0) * .34;
            const tipY = y1 - (y1 - y0) * .55;
            /* 甲尖深粉渐层 */
            n += `<path d="M ${R(-nw * 1.06)} ${R(-tipY)} C ${R(-nw * .4)} ${R(-(tipY + (y1 - y0) * .16))} ${R(nw * .4)} ${R(-(tipY + (y1 - y0) * .16))} ${R(nw * 1.06)} ${R(-tipY)} L ${R(nw * 1.06)} ${R(-(y1 - 2))} L ${R(-nw * 1.06)} ${R(-(y1 - 2))} Z" fill="${ink}" opacity=".2"/>`;
            /* 甲油反光（与其它 kind 同一套画法） */
            const fy1 = y0 + (y1 - y0) * .18, fy2 = y0 + (y1 - y0) * .56, fy3 = y1 - 3;
            n += `<path d="M ${R(-nw * .70)} ${R(-fy1)} C ${R(-nw * .92)} ${R(-fy2)} ${R(-nw * .78)} ${R(-fy3)} ${R(-nw * .42)} ${R(-fy3 - 1)} C ${R(-nw * .62)} ${R(-fy2)} ${R(-nw * .58)} ${R(-fy1 - 6)} ${R(-nw * .70)} ${R(-fy1)} Z" fill="#FFFFFF" opacity=".24"/>`;
            /* 蝴蝶：上翼 ×2（水滴形，斜向上）+ 下翼 ×2（小圆叶，斜向下）+ 细身体 + 触角
               —— 用"两面翅膀 + 身体 + 两根带圆头的触角"而不是四个圆点，保证一眼读成蝴蝶。 */
            const uy = -bh * .42, ly = bh * .52;
            const wingP = (sx) => `M 0 ${R(-bh * .30)}`
              + ` C ${R(sx * bw * .34)} ${R(-bh * .70)} ${R(sx * bw * .90)} ${R(-bh * 1.02)} ${R(sx * bw)} ${R(-bh * .50)}`
              + ` C ${R(sx * bw * 1.04)} ${R(-bh * .10)} ${R(sx * bw * .60)} ${R(bh * .10)} 0 ${R(bh * .04)} Z`;
            const lowP = (sx) => `M 0 ${R(bh * .18)}`
              + ` C ${R(sx * bw * .40)} ${R(bh * .30)} ${R(sx * bw * .68)} ${R(bh * .70)} ${R(sx * bw * .52)} ${R(bh * 1.02)}`
              + ` C ${R(sx * bw * .30)} ${R(bh * 1.22)} ${R(sx * bw * .06)} ${R(bh * .92)} 0 ${R(bh * .70)} Z`;
            n += `<g transform="translate(0 ${R(cy)})">`
              + `<path d="${wingP(-1)}" fill="${wing}" stroke="${ink}" stroke-width="1.5"/>`
              + `<path d="${wingP(1)}" fill="${wing}" stroke="${ink}" stroke-width="1.5"/>`
              + `<path d="${lowP(-1)}" fill="${wing}" stroke="${ink}" stroke-width="1.4"/>`
              + `<path d="${lowP(1)}" fill="${wing}" stroke="${ink}" stroke-width="1.4"/>`
              + `<ellipse cx="0" cy="${R(bh * .18)}" rx="${R(nw * .10)}" ry="${R(bh * .70)}" fill="${ink}"/>`
              + `<circle cx="${R(-bw * .40)}" cy="${R(-bh * .52)}" r="${R(nw * .10)}" fill="${dot}"/>`
              + `<circle cx="${R(bw * .40)}" cy="${R(-bh * .52)}" r="${R(nw * .10)}" fill="${dot}"/>`
              + `<path d="M ${R(-nw * .06)} ${R(-bh * .52)} C ${R(-bw * .22)} ${R(-bh * .86)} ${R(-bw * .40)} ${R(-bh * 1.02)} ${R(-bw * .52)} ${R(-bh * 1.20)}" fill="none" stroke="${ink}" stroke-width="1.3" stroke-linecap="round"/>`
              + `<path d="M ${R(nw * .06)} ${R(-bh * .52)} C ${R(bw * .22)} ${R(-bh * .86)} ${R(bw * .40)} ${R(-bh * 1.02)} ${R(bw * .52)} ${R(-bh * 1.20)}" fill="none" stroke="${ink}" stroke-width="1.3" stroke-linecap="round"/>`
              + `<circle cx="${R(-bw * .52)}" cy="${R(-bh * 1.20)}" r="${R(nw * .075)}" fill="${ink}"/>`
              + `<circle cx="${R(bw * .52)}" cy="${R(-bh * 1.20)}" r="${R(nw * .075)}" fill="${ink}"/>`
              + '</g>';
          } else {
            n += `<path d="M ${R(-nw * .46)} ${R(-(y0 - 4))} C ${R(-nw * .26)} ${R(-(y0 - 11))} ${R(nw * .26)} ${R(-(y0 - 11))} ${R(nw * .46)} ${R(-(y0 - 4))} C ${R(nw * .26)} ${R(-(y0 - 5))} ${R(-nw * .26)} ${R(-(y0 - 5))} ${R(-nw * .46)} ${R(-(y0 - 4))} Z" fill="#FDF1E8" opacity=".7"/>`;
            n += `<ellipse cx="${R(-nw * .32)}" cy="${R(cy)}" rx="${R(nw * .22)}" ry="${R((y1 - y0) * .30)}" fill="#FFFFFF" opacity=".5"/>`;
            n += `<path d="M ${R(-nw * .55)} ${R(-(y1 - 3))} Q 0 ${R(-(y1 + 2))} ${R(nw * .55)} ${R(-(y1 - 3))}" fill="none" stroke="#E9C7B3" stroke-width="2.2" opacity=".8"/>`;
          }
          if (o.paw && p.role === 'p2') {
            /* 猫猫款（左手）：中指指甲上一枚小肉垫 —— 与右手的"卷尾巴"区分开，两只都还是猫猫 */
            const pr = nw * .40;
            n += `<g fill="${catFill}" opacity=".95">`
              + `<ellipse cx="0" cy="${R(-(y1 - 12))}" rx="${R(pr * .80)}" ry="${R(pr * .62)}"/>`
              + `<circle cx="${R(-pr * .64)}" cy="${R(-(y1 - 19))}" r="${R(pr * .27)}"/>`
              + `<circle cx="0" cy="${R(-(y1 - 21))}" r="${R(pr * .29)}"/>`
              + `<circle cx="${R(pr * .64)}" cy="${R(-(y1 - 19))}" r="${R(pr * .27)}"/>`
              + '</g>';
          }
          if (tail && p.role === 'p2') {
            /* 猫猫款：中指指甲上画一条翘起的小尾巴（必须留在甲面内） */
            n += `<path d="M ${R(-nw * .58)} ${R(-(y1 - 5))} C ${R(nw * .22)} ${R(-(y1 - 5))} ${R(nw * .62)} ${R(-(y1 - 13))} ${R(-nw * .02)} ${R(-(y1 - 15))} C ${R(-nw * .55)} ${R(-(y1 - 17))} ${R(-nw * .36)} ${R(-(y1 - 25))} ${R(nw * .34)} ${R(-(y1 - 23))}" fill="none" stroke="${catFill}" stroke-width="2.4" stroke-linecap="round" opacity=".9"/>`;
          }
          if (o.cat && p.role === 'p3') {
            /* 猫猫款：一只小猫在指甲上 + 一条翘起的尾巴 */
            const r = nw * .74;
            n += `<g transform="translate(0 ${R(cy + nw * .10)})">
              <path d="M ${R(-r * 1.02)} ${R(-r * .52)} l ${R(-r * .18)} ${R(-r * .72)} l ${R(r * .62)} ${R(r * .36)} Z" fill="${catFill}"/>
              <path d="M ${R(r * 1.02)} ${R(-r * .52)} l ${R(r * .18)} ${R(-r * .72)} l ${R(-r * .62)} ${R(r * .36)} Z" fill="${catFill}"/>
              <circle cx="0" cy="0" r="${R(r)}" fill="${catFill}"/>
              <circle cx="${R(-r * .34)}" cy="${R(-r * .12)}" r="${R(r * .17)}" fill="${catInk}"/>
              <circle cx="${R(r * .34)}" cy="${R(-r * .12)}" r="${R(r * .17)}" fill="${catInk}"/>
              <path d="M ${R(-r * .22)} ${R(r * .38)} q ${R(r * .22)} ${R(r * .26)} ${R(r * .44)} 0" fill="none" stroke="${catInk}" stroke-width="${R(r * .13)}" stroke-linecap="round"/>
            </g>`;
          }
          g += `<g transform="${p.t}">${d}${n}</g>`;
        });
        /* 桡侧高光（光从左上来） */
        g += `<path d="M -87 34 C -89 78 -86 120 -80 152 C -76 124 -75 78 -77 40 Z" fill="${o.hi}" opacity=".3"/>`;
        return { defs, g, all, slim };
      }

      let defs = '', body = '';
      const single = (uid, o, place) => {
        const h = dorsalHand(Object.assign({ uid }, o));
        defs += h.defs;
        body += `<g transform="${place}">${h.g}</g>`;
      };

      if (K === 'cat_nails') {
        single('cN', { skin: '#FBE7DA', shade: '#EDC7B4', deep: '#DDB49E', line: '#C99A88', crease: '#D8AC96', hi: '#FFF6EF', slim: .94, nail: 'pink', cat: true }, 'translate(392 600) rotate(-21) scale(1.34)');
      } else if (K === 'butterfly_one') {
        /* 单手穿戴甲：抬头看自己一只手（第 9 章义乌段落的那种镜头） */
        single('bF', {
          skin: '#F6E2D2', shade: '#E4C6B0', deep: '#D0AC94', line: '#BE8E7B',
          crease: '#CFA08A', hi: '#FFF4EA', slim: 1.02, nail: 'butterfly',
          pink: FLY.right, fly: FLYACC.right
        }, 'translate(366 602) rotate(-9) scale(1.32)');
      } else if (K === 'cool_nails') {
        single('cC', { skin: '#F6E2D2', shade: '#E0BFA8', deep: '#CFA88E', line: '#C0917F', crease: '#CFA08A', hi: '#FFF4EA', slim: 1.09, nail: 'black' }, 'translate(330 588) rotate(15) scale(1.27)');
      } else if (K === 'hold' || NAIL_KINDS.indexOf(K) >= 0) {
        /* ── 同一个"两只手"底稿，只换指甲款式 ──
         * 剧情里的选项是"左手做猫猫 / 右手做黑的 / 两只都做猫猫…"，所以：
         *   · 左手/右手 = 画面左/右（金是第一人称视角，低头看自己的手 ⇒ 他的左手在画面左）
         *   · 同一场景切换选项时，**手型·肤色·构图·手指角度完全一致**，只有甲油与图案变，
         *     玩家不会觉得"换选项把手的颜色也换了"。
         * 款式表（每项 = [画面左, 画面右]）：
         *   hold            [素甲, 素甲]        —— 60 个节点的默认值
         *   both_nails      [酷黑, 猫猫]        —— 别名 = mixed_right_cat（保持既有行为）
         *   mixed_right_cat [酷黑, 猫猫]
         *   mixed_left_cat  [猫猫, 酷黑]
         *   both_cat        [猫猫, 猫猫]
         *   both_cool       [酷黑, 酷黑]
         *   butterfly_nails [蝴蝶, 蝴蝶]        —— 穿戴甲（第 9 章义乌段落），全图粉、无黑无银线
         */
        const STYLE = {
          hold: [null, null],
          both_nails: ['cool', 'cat'],
          mixed_right_cat: ['cool', 'cat'],
          mixed_left_cat: ['cat', 'cool'],
          both_cat: ['cat', 'cat'],
          both_cool: ['cool', 'cool'],
          butterfly_nails: ['fly', 'fly']
        }[K];
        /* 猫猫款（粉/奶白）：左右手用不同粉底 + 不同图案（卷尾巴 / 小肉垫），一眼看都是猫猫 */
        const CAT = {
          left: { plate: '#F9BCC9', edge: '#E79AAB', cuticle: '#E498A8', catFill: '#FFFFFF', catInk: '#3A2A28' },
          right: { plate: '#F5A6B4', edge: '#E4889B', cuticle: '#D9808F', catFill: '#FFFFFF', catInk: '#3A2A28' }
        };
        /* 酷黑款（磨砂黑 + 一条银线）：左右手黑度/银线亮度略有差别 */
        const COOL = {
          left: { plate: '#33333A', edge: '#1C1C22', sheen: '#5C5C68', line: '#C9CCD2' },
          right: { plate: '#2A2A31', edge: '#151519', sheen: '#4B4B57', line: '#DDE1E6' }
        };
        const nailOpts = side => {
          const st = STYLE[side === 'l' ? 0 : 1];
          if (st === 'cat') {
            return { nail: 'pink', cat: true, paw: side === 'l', tail: side === 'r', pink: CAT[side === 'l' ? 'left' : 'right'] };
          }
          if (st === 'cool') return { nail: 'black', black: COOL[side === 'l' ? 'left' : 'right'] };
          if (st === 'fly') {
            return { nail: 'butterfly', pink: FLY[side === 'l' ? 'left' : 'right'], fly: FLYACC[side === 'l' ? 'left' : 'right'] };
          }
          return { nail: 'plain' };
        };
        /* 金（左，稍大稍深）与雅（右，稍小稍粉）各自完整地出现在画面里，
           两掌在中下部相接，手指在中上部交叠 —— 不再把两只手叠成"七指怪手"。
           雅的拇指天然压在金的手背上（她画在上层），这就是"牵住"的读点。 */
        /* 摆位分两种：
         * · `hold`（两只手相握）—— 两手大幅交叠、手指互相穿插，这才是"握"；
         * · 美甲那一组（both_cat / both_cool / both_nails / mixed_left_cat / mixed_right_cat / butterfly_nails）
         *   —— 剧本是"两只手放在桌上凑在一起"，
         *   而且玩家要一眼看出**猫猫在哪只手**，所以把两手**分开摆在左右两侧**、只在中线轻轻相接。
         *   （旧版两手交叠太深，左手的手指伸到右手那一侧，导致 mixed_left/right 的区别被糊掉。） */
        const HOLD_POSE = K === 'hold';
        const HIM = HOLD_POSE ? 'translate(330 606) rotate(20) scale(1.26)' : 'translate(322 612) rotate(14) scale(1.22)';
        const HER = HOLD_POSE ? 'translate(520 584) rotate(-20) scale(1.08)' : 'translate(548 592) rotate(-14) scale(1.10)';
        /* 肤色：美甲那几张都是"金低头看自己的两只手"（她给他做的美甲）⇒ **两只手同一套肤色**、
           同样粗细，只靠左右旋转（+20° / −20°）与摆位区分。
           而 `hold` 是"他和她两个人的手相握"，仍然是两种肤色（金偏深 / 雅偏浅）—— 保持原样。 */
        const SKIN_JIN = { skin: '#F6E2D2', shade: '#E4C6B0', deep: '#D0AC94', line: '#BE8E7B', crease: '#CFA08A', hi: '#FFF4EA', slim: 1.0 };
        const SKIN_YA = { skin: '#FBE7DA', shade: '#EFCDBB', deep: '#E0B49E', line: '#C99A88', crease: '#D8AC96', hi: '#FFF6EF', slim: .9 };
        const duo = K === 'hold' ? { l: SKIN_JIN, r: SKIN_YA } : { l: SKIN_JIN, r: SKIN_JIN };
        const him = dorsalHand(Object.assign({ uid: 'hB' }, duo.l, nailOpts('l')));
        const her = dorsalHand(Object.assign({ uid: 'hA' }, duo.r, nailOpts('r')));
        defs += him.defs + her.defs +
          '<filter id="hs_' + K + '" x="-40%" y="-40%" width="180%" height="180%">' +
          '<feGaussianBlur stdDeviation="8"/></filter>';
        body += `<g transform="${HIM}">${him.g}</g>`;
        /* 她压在他手背上的那一层要在他的手背上留一道接触阴影（注意必须套在 HER 变换里） */
        body += `<g transform="${HER}"><g opacity=".4" filter="url(#hs_${K})">` +
          '<g transform="translate(7 11)">' +
          her.all.map(p => `<path d="${p.d}"${p.t ? ` transform="${p.t}"` : ''} fill="#8A5B44"/>`).join('') +
          '</g></g>' + her.g + '</g>';
      } else if (K === 'gift') {
        /* gift：递猫猫明信片 —— 手背在卡后面，拇指/虎口压在卡片前沿 */
        const h = dorsalHand({
          uid: 'gH', skin: '#F6E2D2', shade: '#E0BFA8', deep: '#CFA88E', line: '#C0917F',
          crease: '#CFA08A', hi: '#FFF4EA', slim: 1.04, nail: 'plain'
        });
        defs += h.defs;
        body += `<g transform="translate(548 528) rotate(-7)">
          <rect x="-118" y="-80" width="236" height="160" rx="6" fill="#FFFBF2" stroke="#DED2BE" stroke-width="3.4"/>
          <rect x="-110" y="-72" width="220" height="144" rx="3" fill="none" stroke="#EDE3D2" stroke-width="1.8"/>
          <path d="M -84 -38 h 168 M -84 -14 h 142 M -84 10 h 158 M -84 34 h 132" stroke="#D8CDBA" stroke-width="3.4" stroke-linecap="round"/>
          <circle cx="62" cy="-38" r="24" fill="#F7E4D8"/>
          <path d="M 48 -49 l -7 -17 l 17 6 Z M 76 -49 l 7 -17 l -17 6 Z" fill="#E8A0A8"/>
          <circle cx="56" cy="-40" r="3.4" fill="#3A2A28"/><circle cx="68" cy="-40" r="3.4" fill="#3A2A28"/>
          <path d="M 57 -30 q 5 5 10 0" fill="none" stroke="#3A2A28" stroke-width="2.4" stroke-linecap="round"/>
        </g>`;
        /* 整只手压在卡片上：指节与拇指天然盖住卡片前沿，没有"切断的手指" */
        body += `<g transform="translate(384 604) rotate(-38) scale(.97)">${h.g}</g>`;
      }

      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 1080" width="720" height="1080" preserveAspectRatio="xMidYMid slice"><defs>${defs}</defs>
<rect width="720" height="1080" fill="rgba(18,14,22,0.60)"/>
${body}
</svg>`;
    },

    /* ---------------- 背景兜底 ---------------- */
    bgFallback(scene) {
      const map = {
        dorm: ['#3A3450', '#26223A', '#161426'], forum: ['#2A3040', '#1C2230', '#121724'],
        idv_map: ['#2C3550', '#1A2238', '#0E1220'], campus_gate: ['#D8E4EE', '#AFBFD0', '#7E8E9E'],
        street_cn: ['#E8D3B8', '#B08E6E', '#5E4A38'], bench_night: ['#2A3350', '#1A2138', '#101524'],
        airport: ['#3C4258', '#262C3E', '#161A26'], station: ['#DCD8D0', '#A8A49C', '#6A6660'],
        hotel: ['#E4D8CC', '#B8A896', '#6E6054'], conference: ['#E8ECF0', '#B8C0C8', '#6E767E'],
        theatre: ['#3A2438', '#26162A', '#140C18'], kitchen: ['#F0E4D4', '#C8B49C', '#7E6E5C'],
        nail_salon: ['#F6E8EE', '#D8B8C8', '#8E6E80'], home_living: ['#F1E6D8', '#C9B49C', '#7E6A58'],
        home_yard: ['#26304C', '#18203A', '#0E1224'], beach: ['#BFE4F2', '#6FB6D8', '#2E6E92'],
        underwater: ['#2E7EA8', '#1A5680', '#0C2E48'], mall: ['#F2EDE4', '#C8C0B4', '#847C70'],
        starfield: ['#182046', '#0E1430', '#06080F'], shanghai_night: ['#2A2440', '#1A1630', '#0C0A18'],
        /* 兼容旧场景 id（ui.js 兜底调用） */
        room_night: ['#2E2A3E', '#1E1A2C', '#12101C'], riverside_night: ['#242E4A', '#161E34', '#0C1020'],
        riverside_dusk: ['#F0C9A8', '#C08A70', '#5E4038'], cafe_day: ['#F2E6D6', '#C8B39A', '#7E6A58'],
        cafe_evening: ['#3E3244', '#28203A', '#161024'], street_rain: ['#5A6470', '#3E4854', '#242C36'],
        street_night: ['#262E46', '#1A2036', '#0E1222'], park_autumn: ['#E4C89A', '#B08E62', '#5E4A34'],
        school_afternoon: ['#E8E0CC', '#C0B49A', '#7E7460']
      }[scene] || ['#E8D9BE', '#B49A78', '#5E5040'];
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900">
<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="${map[0]}"/><stop offset="0.55" stop-color="${map[1]}"/><stop offset="1" stop-color="${map[2]}"/>
</linearGradient><radialGradient id="v" cx="0.5" cy="0.45" r="0.75">
<stop offset="0.5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.35"/></radialGradient></defs>
<rect width="1600" height="900" fill="url(#g)"/>
<rect y="620" width="1600" height="280" fill="${map[2]}" opacity="0.35"/>
<rect width="1600" height="900" fill="url(#v)"/>
</svg>`;
      return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    },

    /* ---------------- 氛围特效 ---------------- */
    effectSVG(kind, seed) {
      const rnd = (i) => { const x = Math.sin((seed || 7) * 12.9898 + i * 78.233) * 43758.5453; return x - Math.floor(x); };
      if (kind === 'rain') {
        let s = '';
        for (let i = 0; i < 90; i++) {
          const x = rnd(i) * 1600, y = rnd(i + 100) * 900, len = 40 + rnd(i + 200) * 60;
          s += `<line x1="${R(x)}" y1="${R(y)}" x2="${R(x - 14)}" y2="${R(y + len)}" stroke="#DCEAF2" stroke-width="${R(1 + rnd(i + 300) * 1.6)}" opacity="${R(0.18 + rnd(i + 400) * 0.3)}" stroke-linecap="round"/>`;
        }
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" preserveAspectRatio="none">${s}</svg>`;
      }
      if (kind === 'petals' || kind === 'snow') {
        const col = kind === 'snow' ? '#FFFFFF' : '#E6A661';
        let s = '';
        for (let i = 0; i < 30; i++) {
          const x = rnd(i) * 1600, y = rnd(i + 50) * 900, r = 4 + rnd(i + 90) * 8;
          s += `<circle cx="${R(x)}" cy="${R(y)}" r="${R(r)}" fill="${col}" opacity="${R(0.3 + rnd(i) * 0.45)}"/>`;
        }
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" preserveAspectRatio="none">${s}</svg>`;
      }
      if (kind === 'bloom') {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" preserveAspectRatio="none">
<defs><radialGradient id="b" cx="0.32" cy="0.28" r="0.62"><stop offset="0" stop-color="#FFEFC8" stop-opacity="0.4"/><stop offset="1" stop-color="#FFEFC8" stop-opacity="0"/></radialGradient></defs>
<rect width="1600" height="900" fill="url(#b)"/></svg>`;
      }
      if (kind === 'nightglow') {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" preserveAspectRatio="none">
<defs><radialGradient id="n" cx="0.7" cy="0.2" r="0.5"><stop offset="0" stop-color="#8FB6FF" stop-opacity="0.26"/><stop offset="1" stop-color="#8FB6FF" stop-opacity="0"/></radialGradient></defs>
<rect width="1600" height="900" fill="url(#n)"/></svg>`;
      }
      return '';
    },

    /* ---------------- CG 合成 ---------------- */
    composeCG(opts) {
      const bg = opts.bgContent || '';
      const cast = opts.cast || [];
      const slots = { left: 330, center: 800, right: 1270 };
      let figures = '';
      const defsAll = [];
      cast.forEach((c, i) => {
        const b = this.characterBody(c.id, c.expr || 'neutral', c.act || 'idle', { outfit: c.outfit });
        let defs = b.defs, content = b.content;
        if (cast.length > 1) {
          const suffix = c.id + i;
          ['skinYa', 'skinJin', 'hairYa', 'hairJin', 'irisYa', 'irisJin', 'casualYa', 'casualJin', 'plaidJin'].forEach(id => {
            const re = new RegExp(id, 'g');
            defs = defs.replace(re, id + suffix);
            content = content.replace(re, id + suffix);
          });
        }
        defsAll.push(defs);
        const scale = c.scale || 0.98;
        const px = (c.x != null ? c.x : slots[c.pos || 'center']) - 720 * scale / 2;
        const py = c.y != null ? c.y : 900 - 1080 * scale;
        const sx = c.flip ? -scale : scale;
        figures += `<g transform="translate(${R(px)} ${R(py)}) scale(${R(sx)} ${R(scale)})"${c.dim ? ' opacity="0.74"' : ''}>${content}</g>`;
      });
      const fx = opts.effects || [];
      let fxSvg = '';
      fx.forEach(f => {
        const e = this.effectSVG(f, opts.seed || 3);
        fxSvg += e.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
      });
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="1600" height="900">
<defs>${defsAll.join('')}${opts.bgDefs || ''}
<radialGradient id="cgVig" cx="0.5" cy="0.46" r="0.8">
  <stop offset="0.45" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.42"/></radialGradient>
<linearGradient id="cgTop" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#1A1424" stop-opacity="0.3"/><stop offset="0.35" stop-color="#1A1424" stop-opacity="0"/></linearGradient>
</defs>
${bg}
${figures}
${fxSvg}
<rect width="1600" height="900" fill="url(#cgTop)"/>
<rect width="1600" height="900" fill="url(#cgVig)"/>
</svg>`;
    }
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);
