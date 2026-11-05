# -*- coding: utf-8 -*-
"""回退：绣藏 PV 分镜 docx 超 LO Kit 输入上限，拷贝源目录已有同名 PDF"""
import os, sys, shutil

sys.stdout.reconfigure(encoding='utf-8')

SRC = r'D:\AI作品\绣藏\pv分镜（1）.pdf'
DST = r'D:\AI接单素材\deepseekapi\日常\作品集\docs\xiuzang_pv_storyboard.pdf'

if os.path.exists(DST):
    os.remove(DST)
if not os.path.isfile(SRC):
    print('[FAIL] 源 PDF 不存在:', SRC)
    sys.exit(1)

shutil.copyfile(SRC, DST)
with open(DST, 'rb') as f:
    sig = f.read(5)
size = os.path.getsize(DST)
print(f'[OK] 拷贝 {size} bytes  pdf签名={sig!r}  有效={sig == b"%PDF-"}')
