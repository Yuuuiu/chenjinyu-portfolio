# -*- coding: utf-8 -*-
"""分析 D:\\AI作品\\images 图片：尺寸 + 色彩指标 + 感知哈希，用于挑选有代表性的图"""
import os, sys, glob, hashlib
from PIL import Image
import PIL.ImageStat as Stat

sys.stdout.reconfigure(encoding='utf-8')

IMG_DIR = r'D:\AI作品\images'
AI_ROOT = r'D:\AI作品'

print('== D:\\AI作品 目录 ==')
for root, dirs, files in os.walk(AI_ROOT):
    depth = root[len(AI_ROOT):].count(os.sep)
    if depth <= 1:
        print('  ' + '  ' * depth + os.path.basename(root) + '/')
        for f in files[:20]:
            print('  ' + '  ' * (depth + 1) + f)
        if len(files) > 20:
            print('  ' + '  ' * (depth + 1) + f'... 共 {len(files)} 个文件')

print()
print('== 图片指标 ==')

def colorfulness(img_rgb_small):
    # Hasler-Süsstrunk 色彩丰富度近似
    import numpy as np
    a = np.asarray(img_rgb_small, dtype=np.float64) / 255.0
    rg = a[:, :, 0] - a[:, :, 1]
    yb = 0.5 * (a[:, :, 0] + a[:, :, 1]) - a[:, :, 2]
    return float(np.sqrt(np.var(rg) + np.var(yb)) + 0.3 * np.sqrt(np.mean(rg) ** 2 + np.mean(yb) ** 2))

for p in sorted(glob.glob(os.path.join(IMG_DIR, '*'))):
    name = os.path.basename(p)
    try:
        im = Image.open(p)
        im_small = im.convert('RGB')
        im_small.thumbnail((256, 256))
        st = Stat.Stat(im_small)
        mean = tuple(round(m, 1) for m in st.mean)
        stddev = tuple(round(s, 1) for s in st.stddev)
        cf = colorfulness(im_small)
        # 简单感知哈希（8x8 灰度）
        g = im_small.convert('L').resize((8, 8))
        px = list(g.getdata())
        avg = sum(px) / len(px)
        phash = ''.join('1' if v > avg else '0' for v in px)
        print(f'{name}\n  size={im.size}  meanRGB={mean}  stdRGB={stddev}  colorfulness={cf:.3f}\n  phash={phash}')
    except Exception as e:
        print(f'{name}  ERROR: {e}')
