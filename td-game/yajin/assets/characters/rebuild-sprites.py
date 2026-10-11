#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""《你好！一周年》角色位图立绘重建脚本（可重现，纯标准库，无第三方依赖）。

素材：OpenGameArt "VIsual novel Character Sprite" by FALLiNG_AiR —— CC0 1.0（公有领域）
      https://opengameart.org/content/visual-novel-character-sprite
      https://opengameart.org/sites/default/files/character_5.zip

用法：
    python3 assets/characters/rebuild-sprites.py                    # 缺素材会自动下载到 .cache/
    python3 assets/characters/rebuild-sprites.py 0.62 0.022 70      # 半身取景比例 / 参考头顶留白 / 顶部留白(px)

产物：assets/characters/ya/<表情>@any.png 与 assets/characters/jin/<表情>@any.png（各 720×1080 RGBA）
之后请运行：npm run build:sprites && npm run check:sprites

注意：本脚本只负责"生成 PNG"，游戏运行时不需要它，也不需要 Python。
详见同目录 CREDITS.md。
"""
import os
import sys
import math
import zlib
import struct
import colorsys
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = HERE
CACHE = os.path.join(HERE, '.cache')
SRC_ZIP = os.path.join(CACHE, 'character_5.zip')
SRC_URL = 'https://opengameart.org/sites/default/files/character_5.zip'
W, H = 720, 1080


def ensure_source():
    """下载并解压 CC0 素材包（幂等）。"""
    import zipfile
    if not os.path.isdir(os.path.join(CACHE, 'character_5')):
        os.makedirs(CACHE, exist_ok=True)
        if not os.path.exists(SRC_ZIP):
            print('下载素材包：' + SRC_URL)
            urllib.request.urlretrieve(SRC_URL, SRC_ZIP)
        print('解压到 ' + CACHE)
        with zipfile.ZipFile(SRC_ZIP) as z:
            z.extractall(CACHE)
    for cand in ('character_5', 'character_5/character_5', ''):
        p = os.path.join(CACHE, cand, 'cha 1', 'image')
        if os.path.isdir(p):
            # 返回"包含 cha 1 / cha 5 的目录"
            return os.path.dirname(os.path.dirname(p))
    raise SystemExit('解压后找不到 "cha 1/image" 目录，请检查素材包结构')

SIG = b'\x89PNG\r\n\x1a\n'


def _paeth(a, b, c):
    p = a + b - c
    pa, pb, pc = abs(p - a), abs(p - b), abs(p - c)
    if pa <= pb and pa <= pc:
        return a
    if pb <= pc:
        return b
    return c


def read_png(path):
    """Return (w, h, bytearray RGBA)."""
    data = open(path, 'rb').read()
    if data[:8] != SIG:
        raise ValueError('not a png: %s' % path)
    pos = 8
    idat = bytearray()
    plte = None
    trns = None
    w = h = bitdepth = colortype = interlace = None
    while pos < len(data):
        (length,) = struct.unpack('>I', data[pos:pos + 4])
        ctype = data[pos + 4:pos + 8]
        chunk = data[pos + 8:pos + 8 + length]
        pos += 12 + length
        if ctype == b'IHDR':
            w, h, bitdepth, colortype, _comp, _filt, interlace = struct.unpack('>IIBBBBB', chunk)
        elif ctype == b'PLTE':
            plte = chunk
        elif ctype == b'tRNS':
            trns = chunk
        elif ctype == b'IDAT':
            idat += chunk
        elif ctype == b'IEND':
            break
    if interlace:
        raise ValueError('interlaced PNG not supported: %s' % path)
    raw = zlib.decompress(bytes(idat))
    nch = {0: 1, 2: 3, 3: 1, 4: 2, 6: 4}[colortype]
    bpp = max(1, nch * bitdepth // 8)
    stride = (w * nch * bitdepth + 7) // 8
    out = bytearray(stride * h)
    prev = bytearray(stride)
    p = 0
    for y in range(h):
        ft = raw[p]
        p += 1
        line = bytearray(raw[p:p + stride])
        p += stride
        if ft == 1:
            for i in range(bpp, stride):
                line[i] = (line[i] + line[i - bpp]) & 0xFF
        elif ft == 2:
            for i in range(stride):
                line[i] = (line[i] + prev[i]) & 0xFF
        elif ft == 3:
            for i in range(stride):
                a = line[i - bpp] if i >= bpp else 0
                line[i] = (line[i] + ((a + prev[i]) >> 1)) & 0xFF
        elif ft == 4:
            for i in range(stride):
                a = line[i - bpp] if i >= bpp else 0
                c = prev[i - bpp] if i >= bpp else 0
                line[i] = (line[i] + _paeth(a, prev[i], c)) & 0xFF
        elif ft != 0:
            raise ValueError('bad filter %d' % ft)
        out[y * stride:(y + 1) * stride] = line
        prev = line

    rgba = bytearray(w * h * 4)
    if bitdepth == 8:
        for y in range(h):
            base = y * stride
            o = y * w * 4
            if colortype == 6:
                rgba[o:o + w * 4] = out[base:base + w * 4]
            elif colortype == 2:
                for x in range(w):
                    s = base + x * 3
                    d = o + x * 4
                    rgba[d:d + 3] = out[s:s + 3]
                    rgba[d + 3] = 255
            elif colortype == 4:
                for x in range(w):
                    s = base + x * 2
                    d = o + x * 4
                    g = out[s]
                    rgba[d] = rgba[d + 1] = rgba[d + 2] = g
                    rgba[d + 3] = out[s + 1]
            elif colortype == 0:
                for x in range(w):
                    g = out[base + x]
                    d = o + x * 4
                    rgba[d] = rgba[d + 1] = rgba[d + 2] = g
                    rgba[d + 3] = 255
            elif colortype == 3:
                for x in range(w):
                    i = out[base + x]
                    d = o + x * 4
                    rgba[d] = plte[i * 3]
                    rgba[d + 1] = plte[i * 3 + 1]
                    rgba[d + 2] = plte[i * 3 + 2]
                    rgba[d + 3] = trns[i] if (trns and i < len(trns)) else 255
    elif bitdepth == 16:
        step = nch * 2
        for y in range(h):
            base = y * stride
            o = y * w * 4
            for x in range(w):
                s = base + x * step
                d = o + x * 4
                if colortype == 6:
                    rgba[d] = out[s]; rgba[d + 1] = out[s + 2]
                    rgba[d + 2] = out[s + 4]; rgba[d + 3] = out[s + 6]
                elif colortype == 2:
                    rgba[d] = out[s]; rgba[d + 1] = out[s + 2]
                    rgba[d + 2] = out[s + 4]; rgba[d + 3] = 255
                elif colortype == 4:
                    g = out[s]
                    rgba[d] = rgba[d + 1] = rgba[d + 2] = g
                    rgba[d + 3] = out[s + 2]
                elif colortype == 0:
                    g = out[s]
                    rgba[d] = rgba[d + 1] = rgba[d + 2] = g
                    rgba[d + 3] = 255
                else:
                    raise ValueError('16-bit palette unsupported')
    else:  # sub-byte depths (palette / greyscale only)
        maxv = (1 << bitdepth) - 1
        for y in range(h):
            base = y * stride
            o = y * w * 4
            for x in range(w):
                bit = x * bitdepth
                byte = out[base + (bit >> 3)]
                shift = 8 - bitdepth - (bit & 7)
                v = (byte >> shift) & maxv
                d = o + x * 4
                if colortype == 3:
                    rgba[d] = plte[v * 3]
                    rgba[d + 1] = plte[v * 3 + 1]
                    rgba[d + 2] = plte[v * 3 + 2]
                    rgba[d + 3] = trns[v] if (trns and v < len(trns)) else 255
                else:
                    g = v * 255 // maxv
                    rgba[d] = rgba[d + 1] = rgba[d + 2] = g
                    rgba[d + 3] = 255
    return w, h, rgba


def write_png(path, w, h, rgba):
    raw = bytearray()
    stride = w * 4
    for y in range(h):
        raw.append(0)
        raw += rgba[y * stride:(y + 1) * stride]

    def chunk(tag, payload):
        body = tag + payload
        return struct.pack('>I', len(payload)) + body + struct.pack('>I', zlib.crc32(body) & 0xFFFFFFFF)

    data = SIG
    data += chunk(b'IHDR', struct.pack('>IIBBBBB', w, h, 8, 6, 0, 0, 0))
    data += chunk(b'IDAT', zlib.compress(bytes(raw), 9))
    data += chunk(b'IEND', b'')
    open(path, 'wb').write(data)


def alpha_bbox(w, h, rgba, thresh=8):
    """Tight bbox of pixels with alpha > thresh. Returns (x0, y0, x1, y1) exclusive."""
    x0, y0, x1, y1 = w, h, 0, 0
    for y in range(h):
        row = y * w * 4
        found = False
        for x in range(w):
            if rgba[row + x * 4 + 3] > thresh:
                if x < x0:
                    x0 = x
                if x >= x1:
                    x1 = x + 1
                found = True
        if found:
            if y < y0:
                y0 = y
            y1 = y + 1
    if x1 <= x0 or y1 <= y0:
        return (0, 0, w, h)
    return (x0, y0, x1, y1)


def _premult(rgba):
    prem = bytearray(len(rgba))
    for i in range(0, len(rgba), 4):
        a = rgba[i + 3]
        prem[i] = rgba[i] * a // 255
        prem[i + 1] = rgba[i + 1] * a // 255
        prem[i + 2] = rgba[i + 2] * a // 255
        prem[i + 3] = a
    return prem


def resize(rgba, w, h, nw, nh):
    """Alpha-aware resize (box average when downscaling, bilinear when upscaling)."""
    prem = _premult(rgba)
    out = bytearray(nw * nh * 4)
    sx = w / nw
    sy = h / nh
    down = sx > 1.05 or sy > 1.05
    if down:
        for dy in range(nh):
            y0 = dy * sy
            y1 = min(h, (dy + 1) * sy)
            iy0, iy1 = int(y0), max(int(y0) + 1, int(y1 + 0.9999))
            for dx in range(nw):
                x0 = dx * sx
                x1 = min(w, (dx + 1) * sx)
                ix0, ix1 = int(x0), max(int(x0) + 1, int(x1 + 0.9999))
                sr = sg = sb = sa = 0
                n = 0
                for yy in range(iy0, iy1):
                    base = yy * w * 4
                    for xx in range(ix0, ix1):
                        i = base + xx * 4
                        sr += prem[i]; sg += prem[i + 1]; sb += prem[i + 2]; sa += prem[i + 3]
                        n += 1
                if not n:
                    continue
                a = sa // n
                o = (dy * nw + dx) * 4
                if a > 0:
                    out[o] = min(255, sr // n * 255 // a)
                    out[o + 1] = min(255, sg // n * 255 // a)
                    out[o + 2] = min(255, sb // n * 255 // a)
                out[o + 3] = a
    else:
        for dy in range(nh):
            fy = (dy + 0.5) * sy - 0.5
            y0 = int(fy // 1)
            ty = fy - y0
            y0 = max(0, min(h - 1, y0))
            y1 = max(0, min(h - 1, y0 + 1))
            for dx in range(nw):
                fx = (dx + 0.5) * sx - 0.5
                x0 = int(fx // 1)
                tx = fx - x0
                x0 = max(0, min(w - 1, x0))
                x1 = max(0, min(w - 1, x0 + 1))
                o = (dy * nw + dx) * 4
                acc = [0.0, 0.0, 0.0, 0.0]
                for yy, wy in ((y0, 1 - ty), (y1, ty)):
                    for xx, wx in ((x0, 1 - tx), (x1, tx)):
                        wt = wx * wy
                        if wt == 0:
                            continue
                        i = (yy * w + xx) * 4
                        acc[0] += prem[i] * wt
                        acc[1] += prem[i + 1] * wt
                        acc[2] += prem[i + 2] * wt
                        acc[3] += prem[i + 3] * wt
                a = int(acc[3] + 0.5)
                if a > 0:
                    out[o] = min(255, int(acc[0] / acc[3] * 255 + 0.5))
                    out[o + 1] = min(255, int(acc[1] / acc[3] * 255 + 0.5))
                    out[o + 2] = min(255, int(acc[2] / acc[3] * 255 + 0.5))
                out[o + 3] = a
    return out


def crop(rgba, w, h, x0, y0, x1, y1):
    """Crop to [x0,x1) x [y0,y1); out-of-range areas become transparent."""
    cw, ch = x1 - x0, y1 - y0
    out = bytearray(cw * ch * 4)
    for y in range(ch):
        sy = y0 + y
        if sy < 0 or sy >= h:
            continue
        for x in range(cw):
            sx = x0 + x
            if sx < 0 or sx >= w:
                continue
            i = (sy * w + sx) * 4
            o = (y * cw + x) * 4
            out[o:o + 4] = rgba[i:i + 4]
    return out


# ===== 素材包与表情映射 =====



YA_MAP = {
    'neutral':   'pl1 concept.png',
    'smile':     'pl1 happy.png',
    'laugh':     'pl1 happy.png',
    'shy':       'pl1 blink.png',      # + 程序化腮红
    'blush':     'pl1 concept.png',    # + 程序化腮红
    'tease':     'pl1 plot.png',
    'pout':      'pl1 angry.png',
    'surprised': 'pl1 surprise.png',
    'worried':   'pl1 sad.png',
    'sad':       'pl1 sad.png',
    'cry':       'pl1 sadhappy.png',
    'serious':   'pl1 serious.png',
    'sleepy':    'pl1 blink.png',
    'proud':     'pl1 happy.png',
    'excited':   'pl1 happy.png',
    'soft':      'pl1 concept.png',
}
JIN_MAP = {
    'neutral':   'pl5.png',
    'smile':     'pl5 blink.png',
    'shy':       'pl5 shy.png',
    'awkward':   'pl5 doubt.png',
    'blank':     'pl5.png',
    'surprised': 'pl5 surprise.png',
    'panic':     'pl5 hate.png',
    'moved':     'pl5 sad.png',
    'cry':       'pl5 sad.png',
    'serious':   'pl5 hate.png',
    'sleepy':    'pl5 blink.png',
    'soft':      'pl5 blink.png',
    'guilty':    'pl5 plot.png',
    'laugh':     'pl5 scoff.png',
}

JOBS = [
    # cid, source subdir, expression map, hue rotation (deg), theme tint (rgb, amount)
    ('ya',  'cha 1/image', YA_MAP, -150.0, None),
    ('jin', 'cha 5/image', JIN_MAP, 0.0, ((0x8E, 0x9B, 0xB5), 0.50)),
]

# 素材包里完全没有"脸红"差分 —— 在输出图上补一对柔和的腮红（CC0 允许修改）
# 坐标以"原取景（bust=0.62 / headroom=0.022）下的 720×1080 输出像素"给出；
# 出图时用 map_cheeks() 按同一套换算投到当前取景，改取景不会让腮红跑偏。
BLUSH_EXPR = ('blush', 'shy')
CHEEKS_REF = [(307, 347, 32, 18), (417, 347, 32, 18)]

# 顶部留白（输出像素）：头顶离画布上沿至少留这么多。
# 原先只有 ~2%（约 23px），立绘在游戏里"贴底对齐 + 画布高度固定"，
# 头顶几乎贴住画布上沿，看起来像被切平（终验走查：非透明像素从第 23 行才开始）。
# 现在把取景窗整体加高到能容纳 HEAD_PX 的留白 —— 人物等比缩小一点点，
# 头顶不会被裁、也不会变形，底部裁切位置（相对头顶）保持不变。
HEAD_PX = 70


def map_cheeks(geo_ref, geo_new):
    """把腮红坐标（旧取景下的 720×1080 输出像素）换算到新取景。

    两种取景都是"源图的一块矩形 -> 720×1080"，所以先把输出像素还原成源图坐标，
    再按新取景投回去；半径按同一比例缩放。geo = (cw, ch, x0, y0)。"""
    cw_r, ch_r, x0_r, y0_r = geo_ref
    cw_n, ch_n, x0_n, y0_n = geo_new
    out = []
    for (px, py, rx, ry) in CHEEKS_REF:
        sx = x0_r + px * cw_r / float(W)
        sy = y0_r + py * ch_r / float(H)
        out.append(((sx - x0_n) * W / float(cw_n),
                    (sy - y0_n) * H / float(ch_n),
                    rx * cw_r / float(cw_n),
                    ry * ch_r / float(ch_n)))
    return out


def _luma(r, g, b):
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255.0


def add_blush(rgba, w, h, spots, col=(232, 122, 140), peak=0.55, rot=-0.18):
    """Paint soft anime cheek blush blobs. spots = [(cx, cy, rx, ry), ...]"""
    import math
    cos_r, sin_r = math.cos(rot), math.sin(rot)
    for (cx, cy, rx, ry) in spots:
        for y in range(max(0, int(cy - rx - 4)), min(h, int(cy + rx + 4))):
            for x in range(max(0, int(cx - rx - 4)), min(w, int(cx + rx + 4))):
                dx, dy = x - cx, y - cy
                u = (dx * cos_r + dy * sin_r) / rx
                v = (-dx * sin_r + dy * cos_r) / ry
                d = math.sqrt(u * u + v * v)
                if d >= 1.0:
                    continue
                i = (y * w + x) * 4
                if rgba[i + 3] < 16:
                    continue
                a = peak * (1.0 - d * d) ** 1.5
                for k in range(3):
                    rgba[i + k] = int(rgba[i + k] * (1 - a) + col[k] * a + 0.5)
    return rgba


def tint(rgba, col, amt):
    """Push the (near-grey) artwork toward a theme colour while keeping luminance."""
    cr, cg, cb = col
    cl = max(1e-6, _luma(cr, cg, cb))
    out = bytearray(len(rgba))
    for i in range(0, len(rgba), 4):
        L = _luma(rgba[i], rgba[i + 1], rgba[i + 2])
        for k, c in enumerate((cr, cg, cb)):
            t = c * L / cl
            out[i + k] = min(255, int(rgba[i + k] * (1 - amt) + t * amt + 0.5))
        out[i + 3] = rgba[i + 3]
    return out


def hue_rotate(rgba, deg):
    """Rotate hue of every pixel (HLS). Near-grey pixels are unaffected."""
    if not deg:
        return rgba
    out = bytearray(len(rgba))
    d = (deg % 360.0) / 360.0
    for i in range(0, len(rgba), 4):
        h, l, s = colorsys.rgb_to_hls(rgba[i] / 255, rgba[i + 1] / 255, rgba[i + 2] / 255)
        r, g, b = colorsys.hls_to_rgb((h + d) % 1.0, l, s)
        out[i] = int(r * 255 + 0.5)
        out[i + 1] = int(g * 255 + 0.5)
        out[i + 2] = int(b * 255 + 0.5)
        out[i + 3] = rgba[i + 3]
    return out


def head_center_x(w, px, bb):
    y0, y1 = bb[1], bb[3]
    band = y0 + int((y1 - y0) * 0.18)
    xs = []
    for y in range(y0, band):
        row = y * w * 4
        for x in range(bb[0], bb[2]):
            if px[row + x * 4 + 3] > 8:
                xs.append(x)
    if not xs:
        return (bb[0] + bb[2]) // 2
    xs.sort()
    return xs[len(xs) // 2]


def main(bust=0.62, headroom=0.022, head_px=HEAD_PX):
    src_root = ensure_source()
    cache = {}
    for cid, sub, mapping, hue, tnt in JOBS:
        dst = os.path.join(OUT, cid)
        os.makedirs(dst, exist_ok=True)
        for expr, src in mapping.items():
            key = (sub, src)
            if key not in cache:
                w, h, px = read_png(os.path.join(src_root, sub, src))
                bb = alpha_bbox(w, h, px)
                cache[key] = (w, h, px, bb)
            w, h, px, bb = cache[key]
            fh = bb[3] - bb[1]
            cx = head_center_x(w, px, bb)
            # ―― 原取景（"底部对齐"的基准）――
            ch_ref = int(fh * bust)
            cw_ref = int(round(ch_ref * W / H))
            y0_ref = bb[1] - int(ch_ref * headroom)
            x0_ref = cx - cw_ref // 2
            # ―― 当前取景：把窗口加高到顶部留出 head_px 像素 ――
            # 冠顶以下的保留量（= 原取的底部裁切位置）不变，窗口变高 → 人物等比缩小一点
            ch = int(round((y0_ref + ch_ref - bb[1]) / (1.0 - float(head_px) / H)))
            cw = int(round(ch * W / H))
            if cw > w:                      # 极端比例：宁可再缩一点，也不左右裁
                ch = int(round(w * H / float(W)))
                cw = int(round(ch * W / H))
            y0 = bb[1] - int(round(head_px * ch / float(H)))
            if y0 < 0:                      # 画稿头顶本就贴着图片上沿：能留多少留多少
                y0 = 0
            x0 = cx - cw // 2
            if x0 < 0:
                x0 = 0
            if x0 + cw > w:
                x0 = max(0, w - cw)
            sub_img = crop(px, w, h, x0, y0, x0 + cw, y0 + ch)
            out = resize(sub_img, cw, ch, W, H)
            out = hue_rotate(out, hue)
            if tnt:
                out = tint(out, tnt[0], tnt[1])
            if expr in BLUSH_EXPR:
                out = add_blush(out, W, H, map_cheeks((cw_ref, ch_ref, x0_ref, y0_ref), (cw, ch, x0, y0)))
            write_png(os.path.join(dst, expr + '@any.png'), W, H, out)
            print('  %-3s %-10s <- %-18s crop=%dx%d@(%d,%d)' % (cid, expr, src, cw, ch, x0, y0))
    print('done')


if __name__ == '__main__':
    b = float(sys.argv[1]) if len(sys.argv) > 1 else 0.62
    hr = float(sys.argv[2]) if len(sys.argv) > 2 else 0.022
    hp = int(sys.argv[3]) if len(sys.argv) > 3 else HEAD_PX
    main(b, hr, hp)
