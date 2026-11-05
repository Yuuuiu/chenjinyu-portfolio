# -*- coding: utf-8 -*-
"""板块07/09 素材加工：Pillow 压缩图片到 images/process/，拷贝代码到 docs/code/"""
import os, sys, shutil
from PIL import Image

sys.stdout.reconfigure(encoding='utf-8')

ROOT = r'D:\AI接单素材\deepseekapi\日常\作品集'
PROC_DIR = os.path.join(ROOT, 'images', 'process')
CODE_DIR = os.path.join(ROOT, 'docs', 'code')

MAX_EDGE = 1600
QUALITY = 82

IMAGES = [
    (r'D:\大四的课程总汇\可持续化\6种新效果+1种空间\1.png', 'td_1.jpg'),
    (r'D:\大四的课程总汇\可持续化\6种新效果+1种空间\2.png', 'td_2.jpg'),
    (r'D:\大四的课程总汇\可持续化\6种新效果+1种空间\3.png', 'td_3.jpg'),
    (r'D:\大四的课程总汇\可持续化\6种新效果+1种空间\4.png', 'td_4.jpg'),
    (r'D:\大四的课程总汇\可持续化\比赛提交（铁火生花）\【2026数媒竞赛】__学校+姓名__+《铁火生花》\_附件_分镜与设计\T3_v2_设计概念卡.png', 'concept_card.jpg'),
    (r'D:\AI作品\images\20260906_708004-5_1sfkjt3_rvlsrrjc.png', 'ai_gen_1.jpg'),
    (r'D:\AI作品\images\20260906_101412-4_1o1kq03_t8cbsaw8.png', 'ai_gen_2.jpg'),
    (r'D:\AI作品\images\20260906_mj_10141_44orvz__split_2.png', 'ai_gen_3.jpg'),
    (r'D:\AI作品\images\20260906_mj_10141_4onz9x__split_0.png', 'ai_gen_4.jpg'),
]

CODES = [
    (r'D:\大三的课程总汇\大三（下）：数字媒体技术3\平3\23407070213陈锦育\音画互动proessing\sketch____26.pde', 'audio_visual_interaction.pde'),
    (r'D:\大三的课程总汇\大三（下）：数字媒体技术3\平二\平二：23407070213陈锦育\实时互动展示processing\sketch____27\sketch____27.pde', 'realtime_interactive.pde'),
    (r'D:\AI接单素材\deepseekapi\日常\01_铁火生花（打铁花非遗数字作品）\_铁火成莲初剪\build_v18.ps1', 'build_v18.ps1'),
    (r'D:\AI接单素材\deepseekapi\日常\01_铁火生花（打铁花非遗数字作品）\_铁火成莲初剪\gen_cards.ps1', 'gen_cards.ps1'),
]

os.makedirs(PROC_DIR, exist_ok=True)
os.makedirs(CODE_DIR, exist_ok=True)

print('== 图片压缩 ==')
for src, dst in IMAGES:
    out = os.path.join(PROC_DIR, dst)
    if not os.path.isfile(src):
        print(f'[SKIP-缺源] {dst} <- {src}')
        continue
    if os.path.exists(out):
        os.remove(out)
    im = Image.open(src)
    im.load()
    if im.mode in ('RGBA', 'P', 'LA'):
        # 转 RGB：白底合成，避免透明变黑
        if im.mode in ('RGBA', 'LA'):
            bg = Image.new('RGB', im.size, (250, 250, 249))
            bg.paste(im, mask=im.split()[-1])
            im = bg
        else:
            im = im.convert('RGB')
    else:
        im = im.convert('RGB')
    w, h = im.size
    scale = min(1.0, MAX_EDGE / max(w, h))
    if scale < 1.0:
        im = im.resize((round(w * scale), round(h * scale)), Image.LANCZOS)
    im.save(out, 'JPEG', quality=QUALITY, optimize=True, progressive=True)
    print(f'[OK] {dst}  {w}x{h} -> {im.size[0]}x{im.size[1]}  {os.path.getsize(out)} bytes')

print()
print('== 代码拷贝 ==')
for src, dst in CODES:
    out = os.path.join(CODE_DIR, dst)
    if not os.path.isfile(src):
        print(f'[SKIP-缺源] {dst} <- {src}')
        continue
    shutil.copyfile(src, out)
    # 确保 UTF-8（.pde 若为 GBK 也保留原样？为可读性统一尝试转 UTF-8）
    try:
        raw = open(out, 'rb').read()
        text = raw.decode('utf-8-sig')
        open(out, 'w', encoding='utf-8', newline='\n').write(text.lstrip('\ufeff'))
        print(f'[OK] {dst}  {len(text)} chars (UTF-8)')
    except UnicodeDecodeError:
        # 尝试 GBK 转 UTF-8
        text = raw.decode('gbk', errors='replace')
        open(out, 'w', encoding='utf-8', newline='\n').write(text)
        print(f'[OK] {dst}  {len(text)} chars (GBK->UTF-8)')

print()
print('完成。')
