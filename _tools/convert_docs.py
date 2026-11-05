# -*- coding: utf-8 -*-
"""板块07/08 docx -> PDF 批量转换驱动（LibreOffice Kit CLI）"""
import os, sys, subprocess, time, shutil

sys.stdout.reconfigure(encoding='utf-8')

NODE = r'C:\Users\yu\AppData\Local\Programs\DeepSeek Harness\resources\runtime\primary-runtime\dependencies\node\bin\node.exe'
CLI = r'C:\Users\yu\AppData\Local\Programs\DeepSeek Harness\resources\app.asar.unpacked\dsh\node_modules\@deepseek-ai\libreoffice-kit\lib\cli.js'
ROOT = r'D:\AI接单素材\deepseekapi\日常\作品集'
DOCS_DIR = os.path.join(ROOT, 'docs')

TI = r'D:\大四的课程总汇\可持续化\比赛提交（铁火生花）\【2026数媒竞赛】__学校+姓名__+《铁火生花》'

JOBS = [
    # (来源 docx, 输出 pdf, 标签)
    (os.path.join(TI, '_附件_分镜与设计', '20261007铁火生花_分镜脚本_V1.docx'), 'ironfire_storyboard.pdf', '铁火生花分镜脚本V1'),
    (os.path.join(TI, '10_提交压缩包', '《铁火生花》', '人工智能工具使用情况说明', '人工智能工具使用情况说明.docx'), 'ironfire_ai_tools.pdf', '人工智能工具使用情况说明'),
    (r'D:\AI作品\绣藏\《道藏三千：非遗证道录》完整设定集.docx', 'daozang_worldbuilding.pdf', '道藏三千设定集'),
    (r'D:\AI作品\绣藏\pv分镜（1）.docx', 'xiuzang_pv_storyboard.pdf', '绣藏PV分镜'),
    (r'D:\AI作品\绣藏\剧本.docx', 'xiuzang_script.pdf', '绣藏剧本'),
    (r'D:\大二的课程总汇\大二：视听语言\结课\《茄皇》剧本.docx', 'qiehuang_script.pdf', '茄皇剧本'),
    (r'D:\大二的课程总汇\大二：视听语言\《这个早八不太好上》剧本.docx', 'zaoba_script.pdf', '早八剧本'),
    (r'D:\大二的课程总汇\大二：融媒体(抖音）\第八组运营报告.docx', 'douyin_operations_report.pdf', '抖音运营报告'),
    (r'D:\大二的课程总汇\大二（上）：综合创作\高教主赛道商业计划书.docx', 'shiyun_business_plan.pdf', '食韵中华商业计划书'),
    (r'D:\大四的课程总汇\专题课程\第三组—陈锦育吴灿陆建民《文化挪用视角下的敦煌文化数字媒体艺术研究》项目管理章程与传播方案.docx', 'dunhuang_project_plan.pdf', '敦煌项目管理章程'),
]

os.makedirs(DOCS_DIR, exist_ok=True)

results = []
for src, dst, label in JOBS:
    out = os.path.join(DOCS_DIR, dst)
    # 输出已存在则先删（EEXIST）
    if os.path.exists(out):
        os.remove(out)
    if not os.path.isfile(src):
        results.append((label, 'MISSING-SOURCE', 0))
        print(f'[MISS] {label}: 源不存在 {src}', flush=True)
        continue
    t0 = time.time()
    print(f'[开始] {label}  ({os.path.getsize(src)//1024} KB)', flush=True)
    try:
        p = subprocess.run(
            [NODE, CLI, 'convert', '--input', src, '--output', out],
            capture_output=True, text=True, encoding='utf-8', errors='replace',
            timeout=1500,
        )
        dt = time.time() - t0
        ok = os.path.isfile(out) and os.path.getsize(out) > 0
        sig = b''
        if ok:
            with open(out, 'rb') as f:
                sig = f.read(5)
        valid = sig == b'%PDF-'
        size = os.path.getsize(out) if ok else 0
        status = 'OK' if (p.returncode == 0 and valid) else f'FAIL rc={p.returncode}'
        results.append((label, status, size))
        print(f'[{status}] {label} -> {dst}  {size//1024} KB  用时 {dt:.1f}s  pdf签名={sig!r}', flush=True)
        if p.stdout.strip():
            print('  stdout: ' + p.stdout.strip()[:300], flush=True)
        if p.stderr.strip():
            print('  stderr: ' + p.stderr.strip()[:500], flush=True)
    except subprocess.TimeoutExpired:
        results.append((label, 'TIMEOUT', 0))
        print(f'[TIMEOUT] {label} 超过 1500s', flush=True)
    except Exception as e:
        results.append((label, f'ERROR {e}', 0))
        print(f'[ERROR] {label}: {e}', flush=True)

print()
print('== 汇总 ==')
for label, status, size in results:
    print(f'  {label}: {status} ({size//1024} KB)')
