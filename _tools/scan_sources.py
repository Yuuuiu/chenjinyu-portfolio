# -*- coding: utf-8 -*-
"""探查作品集素材源文件存在情况（只读，不修改任何素材）"""
import os, sys, glob, json

sys.stdout.reconfigure(encoding='utf-8')

BASE = {
    'td_dir': r'D:\大四的课程总汇\可持续化\6种新效果+1种空间',
    'tiehuo_submit': r'D:\大四的课程总汇\可持续化\比赛提交（铁火生花）\【2026数媒竞赛】__学校+姓名__+《铁火生花》',
    'ai_images': r'D:\AI作品\images',
    'xiuzang': r'D:\AI作品\绣藏',
    'd2_shi': r'D:\大二的课程总汇\大二：视听语言',
    'd2_media': r'D:\大二的课程总汇\大二：融媒体(抖音）',
    'd2_comp': r'D:\大二的课程总汇\大二（上）：综合创作',
    'd4_topic': r'D:\大四的课程总汇\专题课程',
    'd3_tech3': r'D:\大三的课程总汇\大三（下）：数字媒体技术3',
    'd3_tech4': r'D:\大三的课程总汇\大三（下）：数字媒体技术4',
    'daily': r'D:\AI接单素材\deepseekapi\日常',
    'portfolio': r'D:\AI接单素材\deepseekapi\日常\作品集',
}

def check(label, path):
    if os.path.isdir(path):
        print(f'[DIR ] {label}: {path}')
        return True
    elif os.path.isfile(path):
        print(f'[FILE] {label}: {path}  ({os.path.getsize(path)} bytes)')
        return True
    else:
        print(f'[MISS] {label}: {path}')
        return False

print('=' * 90)
print('一、板块 07 图片素材')
check('TD截图目录', BASE['td_dir'])
for i in (1, 2, 3, 4):
    check(f'TD截图 {i}.png', os.path.join(BASE['td_dir'], f'{i}.png'))
concept = os.path.join(BASE['tiehuo_submit'], '_附件_分镜与设计', 'T3_v2_设计概念卡.png')
check('设计概念卡', concept)
check('即梦图目录', BASE['ai_images'])
if os.path.isdir(BASE['ai_images']):
    pngs = sorted(glob.glob(os.path.join(BASE['ai_images'], '*.png')))
    jpgs = sorted(glob.glob(os.path.join(BASE['ai_images'], '*.jpg')))
    jpegs = sorted(glob.glob(os.path.join(BASE['ai_images'], '*.jpeg')))
    print(f'  AI作品/images 共 {len(pngs)+len(jpgs)+len(jpegs)} 个图片文件 (png={len(pngs)}, jpg={len(jpgs)}, jpeg={len(jpegs)})')
    for p in (pngs + jpgs + jpegs)[:40]:
        print('   ', os.path.basename(p), os.path.getsize(p))

print()
print('=' * 90)
print('二、板块 07 docx / md')
check('铁火生花分镜脚本V1.docx', os.path.join(BASE['tiehuo_submit'], '_附件_分镜与设计', '20261007铁火生花_分镜脚本_V1.docx'))
check('人工智能工具使用情况说明.docx', os.path.join(BASE['tiehuo_submit'], '10_提交压缩包', '《铁火生花》', '人工智能工具使用情况说明', '人工智能工具使用情况说明.docx'))
check('技术展示段落说明.md', os.path.join(BASE['daily'], '01_铁火生花（打铁花非遗数字作品）', '_铁火成莲初剪', '技术展示段落说明.md'))
check('创作灵感_创意来源.md', os.path.join(BASE['daily'], '01_铁火生花（打铁花非遗数字作品）', '_铁火成莲初剪', '创作灵感_创意来源.md'))
check('剪辑文案建议.md', os.path.join(BASE['daily'], '02_10月5日视频提取与文案建议', '_视频提取', '剪辑文案建议.md'))
# 也看看 01_铁火生花 目录里有什么
tiehuo_daily = os.path.join(BASE['daily'], '01_铁火生花（打铁花非遗数字作品）')
if os.path.isdir(tiehuo_daily):
    print('  [LIST] 01_铁火生花（打铁花非遗数字作品）目录:')
    for root, dirs, files in os.walk(tiehuo_daily):
        depth = root[len(tiehuo_daily):].count(os.sep)
        if depth <= 2:
            print('    ' + '  ' * depth + os.path.basename(root) + '/')
            for f in files:
                print('    ' + '  ' * (depth + 1) + f)

print()
print('=' * 90)
print('三、板块 08 docx 清单')
check('1 道藏三千设定集', os.path.join(BASE['xiuzang'], '《道藏三千：非遗证道录》完整设定集.docx'))
check('2 绣藏pv分镜', os.path.join(BASE['xiuzang'], 'pv分镜（1）.docx'))
check('3 绣藏剧本', os.path.join(BASE['xiuzang'], '剧本.docx'))
check('4 铁火生花分镜(同07)', os.path.join(BASE['tiehuo_submit'], '_附件_分镜与设计', '20261007铁火生花_分镜脚本_V1.docx'))
check('5 茄皇剧本', os.path.join(BASE['d2_shi'], '结课', '《茄皇》剧本.docx'))
check('6 早八剧本', os.path.join(BASE['d2_shi'], '《这个早八不太好上》剧本.docx'))
check('7 抖音运营报告', os.path.join(BASE['d2_media'], '第八组运营报告.docx'))
check('8 商业计划书', os.path.join(BASE['d2_comp'], '高教主赛道商业计划书.docx'))
check('9 项目管理章程', os.path.join(BASE['d4_topic'], '第三组—陈锦育吴灿陆建民《文化挪用视角下的敦煌文化数字媒体艺术研究》项目管理章程与传播方案.docx'))

print()
print('=' * 90)
print('四、板块 09 代码 / 工程')
check('音画互动processing目录', os.path.join(BASE['d3_tech3'], '平3', '23407070213陈锦育', '音画互动proessing'))
pde1 = os.path.join(BASE['d3_tech3'], '平3', '23407070213陈锦育', '音画互动proessing', 'sketch____26.pde')
check('sketch____26.pde', pde1)
check('实时互动展示processing目录', os.path.join(BASE['d3_tech3'], '平二', '平二：23407070213陈锦育', '实时互动展示processing', 'sketch____27'))
pde2 = os.path.join(BASE['d3_tech3'], '平二', '平二：23407070213陈锦育', '实时互动展示processing', 'sketch____27', 'sketch____27.pde')
check('sketch____27.pde', pde2)
chujian = os.path.join(BASE['daily'], '01_铁火生花（打铁花非遗数字作品）', '_铁火成莲初剪')
check('build_v18.ps1', os.path.join(chujian, 'build_v18.ps1'))
check('gen_cards.ps1', os.path.join(chujian, 'gen_cards.ps1'))
if os.path.isdir(chujian):
    print('  [LIST] _铁火成莲初剪 目录 *.ps1 / *.py / *.md:')
    for f in sorted(os.listdir(chujian)):
        if f.lower().endswith(('.ps1', '.py', '.md', '.bat')):
            print('   ', f)
td_proj = os.path.join(BASE['tiehuo_submit'], '10_提交压缩包', '《铁火生花》', '作品及成果文件', 'TD工程文件')
check('TD工程文件目录', td_proj)
if os.path.isdir(td_proj):
    print('  [LIST] TD工程文件目录:')
    for root, dirs, files in os.walk(td_proj):
        depth = root[len(td_proj):].count(os.sep)
        if depth <= 2:
            print('    ' + '  ' * depth + os.path.basename(root) + '/')
            for f in files:
                print('    ' + '  ' * (depth + 1) + f)
check('沉浸式交互空间.toe', os.path.join(BASE['d3_tech4'], '1', '数字媒体技术4', '沉浸式交互空间2', '沉浸式交互空间.toe'))

print()
print('=' * 90)
print('五、作品集当前目录结构')
for root, dirs, files in os.walk(BASE['portfolio']):
    depth = root[len(BASE['portfolio']):].count(os.sep)
    if depth <= 2 and not any(seg in root for seg in ('node_modules', '.git')):
        print('  ' + '  ' * depth + os.path.basename(root) + '/')
        if depth <= 1:
            for f in files:
                print('  ' + '  ' * (depth + 1) + f)
