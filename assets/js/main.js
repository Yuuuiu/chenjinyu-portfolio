/* =====================================================================
   陈锦育 · 个人作品集 —— 前端脚本
   数据源：本文件内维护（与 _build/build_manifest.json 一致的 works 部分 +
   新增 创作过程 / 文字策划 / 技术代码 三个板块数据）
   纯原生 JS，无任何外部依赖
   ===================================================================== */
(function () {
  'use strict';

  /* ==================== 数据：方向（八个内容方向） ==================== */
  var DIRECTIONS = [
    {
      id: 'ai',
      num: '壹',
      name: 'AI 影像 · AIGC 创作',
      en: 'AI VIDEO',
      tagline: '文生图 · 图生视频 · AI 数字人 · 全流程生成',
      desc: '以即梦等 AIGC 工具完成从世界观设定、分镜脚本到视频生成的完整创作管线'
    },
    {
      id: 'interactive',
      num: '贰',
      name: '交互装置 · 新媒体艺术',
      en: 'INTERACTIVE ART',
      tagline: 'TouchDesigner · 手势识别 · 粒子系统 · 沉浸空间',
      desc: '非遗数字化与情绪可视化方向的实时交互装置，4 项国家级奖项所在'
    },
    {
      id: 'film',
      num: '叁',
      name: '影视创作 · 动态影像',
      en: 'FILM & MOTION',
      tagline: '拍摄 · 剪辑 · 调色 · After Effects',
      desc: '从剧本策划、实地拍摄到剪辑调色的完整短片创作'
    },
    {
      id: 'threed',
      num: '肆',
      name: '三维建模 · 数字场景',
      en: '3D ART',
      tagline: 'C4D · Blender · 场景建模',
      desc: 'C4D / Blender 三维场景与角色创作，覆盖建模、材质、灯光与渲染'
    },
    {
      id: 'gallery',
      num: '伍',
      name: '视觉设计 · 展板与衍生品',
      en: 'DESIGN & ARTWORK',
      tagline: '展板 · 海报 · 文创衍生品',
      desc: '竞赛展板、课程海报与「青铜遗韵」系列文创衍生品等静态视觉设计'
    },
    {
      id: 'process',
      num: '陆',
      name: '创作过程 · 工作流',
      en: 'PROCESS & WORKFLOW',
      tagline: '概念 · 分镜 · AI 生成 · 技术实现',
      desc: '从概念卡、分镜脚本到即梦生成与 TouchDesigner 实现的完整创作工作流',
      countLabel: '素材 14 件'
    },
    {
      id: 'writing',
      num: '柒',
      name: '文字与策划',
      en: 'WRITING & PLANNING',
      tagline: '世界观设定 · 剧本 · 分镜 · 运营方案',
      desc: '世界观、剧本分镜与商业策划类文档，覆盖新媒体策划全流程',
      countLabel: '文档 9 份'
    },
    {
      id: 'code',
      num: '捌',
      name: '技术代码',
      en: 'CODE & TOOLS',
      tagline: 'Processing · PowerShell · TD 工程',
      desc: '音画互动源码与成片构建脚本，展示工程化实现能力',
      countLabel: '代码 4 项'
    }
  ];

  var WORKS = [
    /* ---- 壹 · AI 影像 ---- */
    {
      id: 'ai_doubao', dir: 'ai',
      title: '《小奶与小美》',
      year: '2026', tags: ['AI数字人', '口播', '即梦'],
      desc: 'AI 数字人系列作品，全流程 AI 生成的虚拟主持人节目。',
      credit: '独立创作'
    },
    {
      id: 'ai_cannes', dir: 'ai',
      title: '《倒退的棕榈叶》',
      year: '2026', tags: ['AI影像', '短片'],
      desc: 'AI 生成影像系列短片。',
      credit: '独立创作'
    },
    {
      id: 'ai_xiuzhang', dir: 'ai',
      title: '《绣藏》',
      year: '2026', tags: ['AI漫剧', '非遗', '国风'],
      desc: '非遗题材 AI 漫剧 PV：「道藏三千」世界观设定、剧本与分镜全流程创作。',
      credit: '西湖新风 AI 漫剧创作大赛参赛作品'
    },
    {
      id: 'ai_yangyangtang', dir: 'ai',
      title: '《盐阳叹》',
      year: '2026', tags: ['AI影像', '文化题材'],
      desc: '文化题材 AI 影像作品。',
      credit: '中国好创意大赛 · 应用组国家级二等奖'
    },
    {
      id: 'ai_dasheng', dir: 'ai',
      title: '《灾厄战线》',
      year: '2026', tags: ['AI影像', '即梦', '概念片'],
      desc: '即梦 AI 影像概念片完整成片（1′36″），灾难场景叙事与镜头语言设计。',
      credit: '独立创作'
    },
    {
      id: 'ai_yegou', dir: 'ai',
      title: '《野生狗奶》',
      year: '2026', tags: ['AI影像', '剧情短片'],
      desc: 'AI 生成剧情短片（4′07″），完整叙事与镜头调度练习。',
      credit: '独立创作'
    },
    /* ---- 贰 · 交互装置 ---- */
    {
      id: 'itd_ironfire', dir: 'interactive',
      title: '《铁火生花》IRON FIRE BLOOM',
      year: '2026', tags: ['TouchDesigner', 'GPU粒子', '手势交互', '非遗数字化'],
      desc: '非遗打铁花数字沉浸式交互装置成片（2′44″）。手势与位置实时驱动粒子：靠近聚拢、挥手迸发、伸手成莲。',
      credit: '第十四届全国大学生数字媒体科技作品及创意竞赛参赛作品（编号 328499）'
    },
    {
      id: 'itd_yixiu', dir: 'interactive',
      title: '《一绣成祥》',
      year: '2026', tags: ['TouchDesigner', '粒子系统', '手势识别', '壮锦'],
      desc: '壮锦·绣球非遗数字交互装置。米兰设计周国家级三等奖；第二届高校 AIGC 数字艺术设计大赛参赛（队长）。',
      credit: '米兰设计周 · 国家级三等奖 · 队长（指导教师：李紫阳、程思、刘琼）'
    },
    {
      id: 'itd_honghua', dir: 'interactive',
      title: '《红花峰林十六点·互动地图》',
      year: '2026', tags: ['TouchDesigner', '文旅', '互动地图'],
      desc: '恩施文旅融合创新计时赛作品，中国好创意大赛国家级三等奖。红花峰林景区十六景点交互游览地图。',
      credit: '中国好创意大赛 · 国家级三等奖（“跃动峡谷，潮玩清江”文旅融合与创新计时赛）'
    },
    {
      id: 'itd_shange', dir: 'interactive',
      title: '《山歌回音壁》声音与灯光互动装置',
      year: '2026', tags: ['Processing', '音画互动', '声光装置'],
      desc: '中国好创意大赛（学术组）国家级二等奖。声音信号实时驱动灯光与画面联动的音画互动装置。',
      credit: '中国好创意大赛 · 学术组国家级二等奖'
    },
    {
      id: 'itd_xinmai', dir: 'interactive',
      title: '《心脉·花影》情绪交互装置',
      year: '2025', tags: ['TouchDesigner', '心率传感', 'MediaPipe', '情绪可视化'],
      desc: '情绪可视化交互装置：心率传感器与摄像头手势识别（MediaPipe）实时驱动流体粒子花影，将情绪数据转译为可视化的花与影。',
      credit: '独立创作 · 交互装置设计课程'
    },
    /* ---- 肆 · 三维建模（2 件） ---- */
    {
      id: 'td_tongxiang', dir: 'threed',
      title: '《铜香月影》',
      year: '2025', tags: ['Blender', '场景', '青铜'],
      desc: '铜鼎与石柱的东方历史场景：古朴纹理、雕刻与自然环境，数字媒体技术1（Blender）结课作品。',
      credit: '独立创作'
    },
    {
      id: 'td_qiuyue', dir: 'threed',
      title: '《秋月共赏》',
      year: '2024', tags: ['C4D', 'Octane', '场景建模'],
      desc: '中秋月夜三维场景：传统建筑、灯笼、荷花，Octane 渲染。软件应用2（C4D）结课作品。',
      credit: '独立创作'
    },
    /* ---- 叁 · 影视创作 ---- */
    {
      id: 'film_hucheng', dir: 'film',
      title: '《湖城烟雨》',
      year: '2025', tags: ['实拍', '剪辑', '调色'],
      desc: '雨中东湖诗意影像：刻意等待雨天拍摄，栈桥、磨山与雨中行人，冷调水墨调色。综合创作3 结课作品。',
      credit: '与焦星宇合作 · 指导教师：彭隽'
    },
    {
      id: 'film_qiehuang', dir: 'film',
      title: '《茄香味俱全》',
      year: '2025', tags: ['短片', '剧本', '剪辑'],
      desc: '泡面品牌创意短片：从超市选购到宿舍煮食的线性叙事，暖色调视听语言，传递家的味道。',
      credit: '独立创作 · 指导教师：刘琼'
    },
    {
      id: 'film_wusheng', dir: 'film',
      title: '《无声暗涌》',
      year: '2025', tags: ['After Effects', '动态影像', '情绪'],
      desc: '“情绪物质化”动态影像实验：粘稠液体、机械结构与失真画面外化压抑情绪，动态逆向构建情绪循环。',
      credit: '独立创作'
    },
    {
      id: 'film_wukong', dir: 'film',
      title: '《悟空不想打工》',
      year: '2024', tags: ['动态影像', 'IP设计'],
      desc: '孙悟空 IP 现代“打工人”形象再设计动态影像：齐天大圣→孙行者→斗战胜佛的三阶段演绎。',
      credit: '与钟科、焦星宇合作 · 综合创作1'
    },
    {
      id: 'film_silu', dir: 'film',
      title: '《丝路新篇》',
      year: '2025', tags: ['AI生成', '实拍', '剪辑合成'],
      desc: '丝绸之路主题影视创作：AI 生成画面与实拍素材的剪辑合成成片（2′12″）。',
      credit: '独立创作 · 影视创作课程'
    },
    {
      id: 'film_poster', dir: 'film',
      title: '《动态海报》',
      year: '2024', tags: ['动态海报', '视觉传播', 'AE'],
      desc: '视觉传播课程动态海报作品：平面海报的动态化演绎（40″）。',
      credit: '独立创作 · 视觉传播课程'
    },
    {
      id: 'film_sheji', dir: 'film',
      title: '《设计基础 · 动态影像》',
      year: '2024', tags: ['动态影像', '构成', '实验'],
      desc: '设计基础课程动态影像实验：平面构成元素的动态表达（37″）。',
      credit: '独立创作 · 设计基础课程'
    }
  ];

  /* ==================== 数据（视觉设计画廊） ==================== */
  var GALLERY = [
    {
      group: '文创衍生品', en: 'CULTURAL & CREATIVE PRODUCTS', portrait: false,
      items: [
        { src: 'images/gallery/fan_1.jpg', title: '折扇 · 设计一', desc: '青铜遗韵 · 文创衍生' },
        { src: 'images/gallery/fan_2.jpg', title: '折扇 · 设计二', desc: '青铜遗韵 · 文创衍生' },
        { src: 'images/gallery/fan_3.jpg', title: '折扇 · 设计三', desc: '青铜遗韵 · 文创衍生' },
        { src: 'images/gallery/coaster.jpg', title: '杯垫', desc: '青铜遗韵 · 文创衍生' },
        { src: 'images/gallery/pillow.jpg', title: '抱枕', desc: '青铜遗韵 · 文创衍生' },
        { src: 'images/gallery/badge_1.jpg', title: '金属徽章 · 款式一', desc: '青铜遗韵 · 文创衍生' },
        { src: 'images/gallery/badge_2.jpg', title: '金属徽章 · 款式二', desc: '青铜遗韵 · 文创衍生' },
        { src: 'images/gallery/badge_3.jpg', title: '金属徽章 · 款式三', desc: '青铜遗韵 · 文创衍生' },
        { src: 'images/gallery/bag_1.jpg', title: '手提纸袋 · 设计一', desc: '青铜遗韵 · 文创衍生' },
        { src: 'images/gallery/bag_2.jpg', title: '手提纸袋 · 设计二', desc: '青铜遗韵 · 文创衍生' },
        { src: 'images/gallery/bag_3.jpg', title: '手提纸袋 · 设计三', desc: '青铜遗韵 · 文创衍生' },
        { src: 'images/gallery/keychain_1.jpg', title: '钥匙扣 · 款式一', desc: '青铜遗韵 · 文创衍生' },
        { src: 'images/gallery/keychain_2.jpg', title: '钥匙扣 · 款式二', desc: '青铜遗韵 · 文创衍生' },
        { src: 'images/gallery/keychain_3.jpg', title: '钥匙扣 · 款式三', desc: '青铜遗韵 · 文创衍生' },
        { src: 'images/gallery/mousepad_1.jpg', title: '鼠标垫样机 · 一', desc: '青铜遗韵 · 文创衍生' },
        { src: 'images/gallery/mousepad_2.jpg', title: '鼠标垫样机 · 二', desc: '青铜遗韵 · 文创衍生' },
        { src: 'images/gallery/mousepad_3.jpg', title: '鼠标垫样机 · 三', desc: '青铜遗韵 · 文创衍生' },
        { src: 'images/gallery/wall_ad_1.jpg', title: '挂墙广告 · 一', desc: '青铜遗韵 · 文创衍生' },
        { src: 'images/gallery/wall_ad_2.jpg', title: '挂墙广告 · 二', desc: '青铜遗韵 · 文创衍生' }
      ]
    },
    {
      group: '展板设计', en: 'EXHIBITION BOARDS', portrait: true,
      items: [
        { src: 'images/gallery/board_ironfire.jpg', title: '《铁火生花》展板', desc: '非遗打铁花数字交互装置 · 数媒竞赛' },
        { src: 'images/gallery/board_yixiu.jpg', title: '《一绣成祥》展板', desc: '壮锦绣球非遗数字交互 · 米兰设计周' },
        { src: 'images/gallery/board_qiehuang.jpg', title: '《茄香味俱全》展板', desc: '视听语言课程结课' },
        { src: 'images/gallery/board_wusheng.jpg', title: '《无声暗涌》展板', desc: '情绪物质化动态影像 · Ae 结课' },
        { src: 'images/gallery/board_qingtong.jpg', title: '《青铜遗韵》展板', desc: '观察与表现课程 · 组队比赛' },
        { src: 'images/gallery/board_designbasics.jpg', title: '设计基础展板', desc: '大一设计基础课程' },
        { src: 'images/gallery/board_webdesign.jpg', title: '网页设计展板', desc: '网页设计课程结课' },
        { src: 'images/gallery/board_enshi.jpg', title: '恩施文旅展板', desc: '文旅融合创新计时赛' }
      ]
    },
    {
      group: '海报设计', en: 'POSTER DESIGN', portrait: true,
      items: [
        { src: 'images/gallery/poster_qiehuang.jpg', title: '《茄香味俱全》海报', desc: '视听语言课程结课' },
        { src: 'images/gallery/poster_qingtong.jpg', title: '《青铜遗韵》海报', desc: '观察与表现课程 · 组队比赛' },
        { src: 'images/gallery/poster_xiuzang_1.jpg', title: '《绣藏》海报 · 一', desc: '西湖新风 AI 漫剧大赛' },
        { src: 'images/gallery/poster_xiuzang_2.jpg', title: '《绣藏》海报 · 二', desc: '西湖新风 AI 漫剧大赛' },
        { src: 'images/gallery/poster_xiuzang_3.jpg', title: '《绣藏》海报 · 三', desc: '西湖新风 AI 漫剧大赛' },
        { src: 'images/gallery/poster_hucheng_1.jpg', title: '《湖城烟雨》海报 · 一', desc: '综合创作课程 · 与焦星宇合作' },
        { src: 'images/gallery/poster_hucheng_2.jpg', title: '《湖城烟雨》海报 · 二', desc: '综合创作课程 · 与焦星宇合作' }
      ]
    }
  ];

  /* ==================== 数据（陆 · 创作过程 / 工作流） ==================== */

  /* 创作流程五步 */
  var PROCESS_STEPS = [
    { num: '01', name: '概念', desc: '设计概念卡定世界观与黑金东方视觉调性' },
    { num: '02', name: '生成', desc: '即梦 / MJ 提示词文生图，产出关键画面' },
    { num: '03', name: '分镜', desc: '分镜脚本 V1 编排镜头、时间与音画关系' },
    { num: '04', name: '技术', desc: 'TouchDesigner GPU 粒子实时交互实现' },
    { num: '05', name: '成片', desc: '脚本化剪辑、调色与合成，输出 2′44″ 成片' }
  ];

  /* 创作过程图片组（复用画廊与灯箱逻辑） */
  var PROCESS_GALLERY = [
    {
      group: '概念与生成', en: 'CONCEPT & GENERATION', portrait: false,
      items: [
        { src: 'images/process/concept_card.jpg', title: '设计概念卡 T3_v2', desc: '《铁火生花》片头概念卡：定世界观与视觉基调，八层羽化色块 + 精确居中的排版' },
        { src: 'images/process/ai_gen_1.jpg', title: '即梦生成 · 4K 主视觉', desc: '即梦文生图产出的 4K 主视觉画面（2026.09）' },
        { src: 'images/process/ai_gen_2.jpg', title: 'MJ 生成 · 场景概念', desc: 'MJ 文生图产出的场景概念画面（2026.09）' },
        { src: 'images/process/ai_gen_3.jpg', title: 'AI 生成 · 分镜参考 一', desc: '即梦 / MJ 生成的分镜参考画面 · 之一' },
        { src: 'images/process/ai_gen_4.jpg', title: 'AI 生成 · 分镜参考 二', desc: '即梦 / MJ 生成的分镜参考画面 · 之二' }
      ]
    },
    {
      group: 'TD 效果测试', en: 'TOUCHDESIGNER EFFECT TESTS', portrait: false,
      items: [
        { src: 'images/process/td_1.jpg', title: 'TD 效果测试 · 一', desc: 'TouchDesigner 实时粒子效果实测截图（6 种新效果 + 1 种空间）' },
        { src: 'images/process/td_2.jpg', title: 'TD 效果测试 · 二', desc: 'TouchDesigner 实时粒子效果实测截图' },
        { src: 'images/process/td_3.jpg', title: 'TD 效果测试 · 三', desc: 'TouchDesigner 实时粒子效果实测截图' },
        { src: 'images/process/td_4.jpg', title: 'TD 效果测试 · 四', desc: 'TouchDesigner 空间交互效果实测截图' }
      ]
    }
  ];

  /* 创作过程：文案摘录（来源 md，截取核心段落） */
  var PROCESS_QUOTES = [
    {
      title: '创作灵感 · 创意来源',
      src: '01_铁火生花（打铁花非遗数字作品）· 创作灵感_创意来源.md',
      text: '第一次看打铁花，是屏幕上一段影像：1600℃ 的铁水被木棒击向夜空，半秒里炸成漫天星雨……铁是硬的、滚烫的、会冷却的；花是柔的、静的、会再开的。我们想把这个矛盾收进一个词，于是有了《铁火生花》——不写铁花如何熄灭，而写它如何生花。',
      foot: '技术上以 TouchDesigner 实时生成为核心：火花、锤打、涟漪、莲火四种视觉元素被转译为 GPU 粒子与图像粒子；观众的手势与位置实时驱动画面——靠近，星火聚拢；挥手，铁花迸发；伸手，莲在掌中绽开。'
    },
    {
      title: '技术展示 · 段落说明',
      src: '01_铁火生花（打铁花非遗数字作品）· 技术展示段落说明.md',
      text: '技术展示段由 4 条录屏各出一条：选片不是凭感觉——把候选片段的平均 R/G/B、亮度、边缘能量算成特征向量，再按「最大最小距离」挑一组彼此差最远的，保证四个画面真的不同。',
      foot: '入点同样量化：先做逐秒亮度 / 细节曲线，再取每条曲线里效果最饱满、且不跨越录屏内部跳变点的 6 秒；源 2496×1440 只裁底部 36px 成 16:9，Lanczos 缩放到 1080p，单次 h264_nvenc 编码。'
    },
    {
      title: '剪辑文案 · 建议与拆解',
      src: '02_10月5日视频提取与文案建议· 剪辑文案建议.md',
      text: '全片 100% 是 CG / 数字粒子特效，叙事弧线非常清楚：火 → 打铁花 → 金莲 → 落水。天然的「淬炼—碎裂—重生/开花」三段式隐喻，文案不是「提炼」而是「赋予」。',
      foot: '发布文案方向 A（东方美学 · 治愈向）：「一束火落下来，是开端。被击碎的那一刻，万点金光散成星辰。而后它们沉进水面，开成了莲。——从炽烈到寂静，两分十七秒。」'
    }
  ];

  /* 创作过程：文档（PDF 新窗口打开） */
  var PROCESS_DOCS = [
    {
      href: 'docs/ironfire_storyboard.pdf', tag: '分镜脚本',
      title: '《铁火生花》分镜脚本 V1',
      desc: '打铁花非遗数字装置成片的分镜脚本：镜头、时间码与画面说明逐镜编排。',
      foot: 'DOCX 原件 · 2026.10.07'
    },
    {
      href: 'docs/ironfire_ai_tools.pdf', tag: 'AI 工具说明',
      title: '人工智能工具使用情况说明',
      desc: '参赛提交材料：全流程各环节所用 AI 工具、用途与使用方式说明。',
      foot: '第十四届全国大学生数媒竞赛 · 参赛附件'
    }
  ];

  /* ==================== 数据（柒 · 文字与策划） ==================== */
  var WRITING_DOCS = [
    {
      href: 'docs/daozang_worldbuilding.pdf', tag: '世界观设定',
      title: '《道藏三千：非遗证道录》完整设定集',
      desc: '《绣藏》世界观完整设定：非遗证道宇宙的体系、角色与力量逻辑。',
      foot: '《绣藏》AI 漫剧 · 世界观文档'
    },
    {
      href: 'docs/xiuzang_pv_storyboard.pdf', tag: '分镜脚本',
      title: '《绣藏》PV 分镜',
      desc: 'AI 漫剧 PV 的镜头级分镜：画面、运镜与节奏设计。',
      foot: '《绣藏》AI 漫剧 · 分镜'
    },
    {
      href: 'docs/xiuzang_script.pdf', tag: '剧本',
      title: '《绣藏》剧本',
      desc: '非遗题材 AI 漫剧完整剧本。',
      foot: '《绣藏》AI 漫剧 · 剧本'
    },
    {
      href: 'docs/ironfire_storyboard.pdf', tag: '分镜脚本',
      title: '《铁火生花》分镜脚本 V1',
      desc: '打铁花非遗数字装置成片分镜（与创作过程板块同源）。',
      foot: '数媒竞赛参赛 · 附件分镜'
    },
    {
      href: 'docs/qiehuang_script.pdf', tag: '剧本',
      title: '《茄皇》剧本',
      desc: '泡面品牌创意短片剧本：线性叙事与暖调视听语言设计。',
      foot: '大二 · 视听语言课程结课'
    },
    {
      href: 'docs/zaoba_script.pdf', tag: '剧本',
      title: '《这个早八不太好上》剧本',
      desc: '校园题材短片剧本。',
      foot: '大二 · 视听语言课程'
    },
    {
      href: 'docs/douyin_operations_report.pdf', tag: '运营方案',
      title: '新媒体账号运营报告',
      desc: '抖音账号运营实践与复盘报告：定位、内容、数据与迭代。',
      foot: '大二 · 融媒体（抖音）课程 · 第八组：焦星宇、陈锦育、党成坤'
    },
    {
      href: 'docs/shiyun_business_plan.pdf', tag: '商业计划书',
      title: '《食韵中华》商业计划书',
      desc: '互联网+ 高教主赛道参赛商业计划书：项目定位、模式与运营规划。',
      foot: '大二（上）· 综合创作课程'
    },
    {
      href: 'docs/dunhuang_project_plan.pdf', tag: '项目管理',
      title: '项目管理章程与传播方案',
      desc: '《文化挪用视角下的敦煌文化数字媒体艺术研究》项目管理章程与传播方案。',
      foot: '大四 · 专题课程 · 第三组：陈锦育、吴灿、陆建民'
    }
  ];

  /* ==================== 数据（捌 · 技术代码） ==================== */
  var CODES = [
    {
      file: 'docs/code/audio_visual_interaction.pde', lang: 'Processing',
      name: 'audio_visual_interaction.pde',
      title: '山歌回音壁 · 音画互动核心源码',
      desc: '《山歌回音壁》声光互动装置核心：声音信号实时驱动灯光与画面联动（国二作品同源）。'
    },
    {
      file: 'docs/code/realtime_interactive.pde', lang: 'Processing',
      name: 'realtime_interactive.pde',
      title: '实时互动展示 · Processing 源文件',
      desc: '实时互动展示作业源码：交互式实时视觉（数字媒体技术3 课程）。'
    },
    {
      file: 'docs/code/build_v18.ps1', lang: 'PowerShell',
      name: 'build_v18.ps1',
      title: '《铁火生花》成片构建脚本 v18',
      desc: 'ffmpeg 工程化脚本：分段剪接、滤镜图、字幕卡叠加与单次编码，一键产出 2′44″ 成片。'
    },
    {
      file: 'docs/code/gen_cards.ps1', lang: 'PowerShell',
      name: 'gen_cards.ps1',
      title: '卡片批量生成脚本',
      desc: '概念卡 / 字幕卡批量生成脚本：自动化制卡，保证全片字卡风格统一。'
    }
  ];

  /* TD 工程清单（.toe 过大不拷贝，仅文本说明） */
  var TD_PROJECTS = [
    {
      title: '《铁火生花》TD 工程（参赛源文件）',
      path: '比赛提交（铁火生花）\\…\\10_提交压缩包\\《铁火生花》\\作品及成果文件\\TD工程文件\\',
      note: '.toe 工程过大，此处仅列清单；如需源文件请直接联系本人。',
      groups: [
        { name: 'TD效果技术 · 图像粒子跟随鼠标交互移动', items: ['钟楼粒子2跟随鼠标.toe', '钟楼粒子2跟随鼠标.5.toe（版本）'] },
        { name: 'TD效果技术 · 图片转湍流粒子效果', items: ['图片转粒子效果.toe', '图片转粒子效果.1.toe（版本）'] },
        { name: 'TD空间交互源文件 · 沉浸式互动空间', items: ['NewProject.toe', 'NewProject.4.toe（版本）'] },
        { name: 'TD空间交互源文件 · 粒子拉线', items: ['粒子拉线.toe', '粒子拉线.3.toe（版本）'] }
      ]
    },
    {
      title: '沉浸式交互空间（课程作业）',
      path: '大三（下）· 数字媒体技术4 · 沉浸式交互空间2\\沉浸式交互空间.toe',
      note: '课程交互空间工程（32 KB），同样仅列清单。',
      groups: []
    }
  ];

  /* ==================== 数据（hero 精选作品快捷入口） ==================== */
  var FEATURED = [
    {
      href: '#work-itd_shange',
      title: '《山歌回音壁》',
      sub: '声光互动装置',
      award: '中国好创意 · 国家级二等奖'
    },
    {
      href: '#work-itd_yixiu',
      title: '《一绣成祥》',
      sub: '非遗 AIGC 交互装置',
      award: '米兰设计周 · 国家级三等奖 · 队长'
    },
    {
      href: '#work-ai_xiuzhang',
      title: '《绣藏》',
      sub: 'AI 漫剧',
      award: '西湖新风 AI 漫剧创作大赛'
    }
  ];

  /* ==================== 工具函数 ==================== */
  function byId(id) { return document.getElementById(id); }
  function findWork(id) {
    for (var i = 0; i < WORKS.length; i++) {
      if (WORKS[i].id === id) { return WORKS[i]; }
    }
    return null;
  }

  /* ==================== 渲染：方向入口卡片 ==================== */
  function renderDirections() {
    var grid = byId('directionsGrid');
    if (!grid) { return; }
    var counts = {};
    WORKS.forEach(function (w) { counts[w.dir] = (counts[w.dir] || 0) + 1; });
    counts.gallery = GALLERY.reduce(function (n, g) { return n + g.items.length; }, 0);

    grid.innerHTML = DIRECTIONS.map(function (d) {
      var chipText = d.countLabel || ('作品 ' + (counts[d.id] || 0) + ' 件');
      return '' +
        '<a class="dir-card reveal" href="#' + d.id + '">' +
          '<div class="dir-num">' + d.num + '</div>' +
          '<div class="dir-en">' + d.en + '</div>' +
          '<h3 class="dir-name">' + d.name + '</h3>' +
          '<p class="dir-tagline">' + d.tagline + '</p>' +
          '<div class="dir-count">' +
            '<span class="count-chip">' + chipText + '</span>' +
            '<span class="dir-arrow">→</span>' +
          '</div>' +
        '</a>';
    }).join('');
  }

  /* ==================== 渲染：作品卡片网格 ==================== */
  function renderWorks() {
    DIRECTIONS.forEach(function (d) {
      var grid = byId('grid-' + d.id);
      var list = WORKS.filter(function (w) { return w.dir === d.id; });
      if (!grid || !list.length) { return; }

      grid.innerHTML = list.map(function (w) {
        return '' +
          '<article class="work-card reveal" role="button" tabindex="0"' +
            ' id="work-' + w.id + '" data-id="' + w.id + '" aria-label="播放 ' + w.title + '">' +
            '<div class="cover">' +
              '<img class="work-poster" src="images/posters/' + w.id + '.jpg"' +
                ' alt="' + w.title + ' 封面" loading="lazy">' +
              '<div class="cover-overlay">' +
                '<div class="play-wrap">' +
                  '<span class="play-btn"><span class="play-tri"></span></span>' +
                  '<span class="play-hint">播放</span>' +
                '</div>' +
              '</div>' +
              '<span class="year-chip">' + w.year + '</span>' +
            '</div>' +
            '<div class="work-body">' +
              '<h3 class="work-title">' + w.title + '</h3>' +
              '<ul class="tags">' +
                w.tags.map(function (t) { return '<li>' + t + '</li>'; }).join('') +
              '</ul>' +
              '<p class="work-desc">' + w.desc + '</p>' +
              '<p class="work-credit">' + w.credit + '</p>' +
            '</div>' +
          '</article>';
      }).join('');
    });
  }

  /* ==================== 渲染：视觉设计画廊 ==================== */
  function renderGallery() {
    var wrap = byId('galleryWrap');
    if (!wrap) { return; }
    var idx0 = 0;
    wrap.innerHTML = GALLERY.map(function (g) {
      var base = idx0;
      idx0 += g.items.length;
      return '' +
        '<div class="gallery-group reveal">' +
          '<div class="gallery-group-head">' +
            '<span class="g-group-name">' + g.group + '</span>' +
            '<span class="g-group-en">' + g.en + '</span>' +
            '<span class="g-group-count">' + g.items.length + ' 件</span>' +
          '</div>' +
          '<div class="gallery-grid">' +
            g.items.map(function (it, i) {
              return '' +
                '<figure class="gallery-item' + (g.portrait ? ' g-portrait' : '') + '"' +
                  ' role="button" tabindex="0" data-index="' + (base + i) + '"' +
                  ' aria-label="查看 ' + it.title + '">' +
                  '<div class="g-thumb">' +
                    '<img src="' + it.src + '" alt="' + it.title + ' · ' + g.group + '" loading="lazy">' +
                    '<span class="g-zoom" aria-hidden="true">＋</span>' +
                  '</div>' +
                  '<figcaption>' +
                    '<span class="g-title">' + it.title + '</span>' +
                    '<span class="g-desc">' + it.desc + '</span>' +
                  '</figcaption>' +
                '</figure>';
            }).join('') +
          '</div>' +
        '</div>';
    }).join('');
  }

  /* ==================== 渲染：hero 精选作品快捷入口 ==================== */
  function renderFeatured() {
    var grid = byId('featuredGrid');
    if (!grid) { return; }
    grid.innerHTML = FEATURED.map(function (f) {
      return '' +
        '<a class="featured-card reveal" href="' + f.href + '">' +
          '<h3 class="featured-title">' + f.title + '</h3>' +
          '<p class="featured-sub">' + f.sub + '</p>' +
          '<p class="featured-award">' + f.award + '</p>' +
        '</a>';
    }).join('');
  }

  /* ==================== 渲染：陆 · 创作过程 ==================== */
  function renderProcess() {
    var wrap = byId('processWrap');
    if (!wrap) { return; }

    var stepsHtml =
      '<ol class="process-steps reveal">' +
        PROCESS_STEPS.map(function (s) {
          return '<li class="step"><span class="step-num">' + s.num + '</span>' +
            '<h4 class="step-name">' + s.name + '</h4>' +
            '<p class="step-desc">' + s.desc + '</p></li>';
        }).join('') +
      '</ol>';

    /* 创作过程画廊的灯箱索引 = 视觉设计画廊总数之后继续编号 */
    var base = GALLERY.reduce(function (n, g) { return n + g.items.length; }, 0);
    var galleryHtml = PROCESS_GALLERY.map(function (g) {
      var b = base;
      base += g.items.length;
      return '' +
        '<div class="gallery-group reveal">' +
          '<div class="gallery-group-head">' +
            '<span class="g-group-name">' + g.group + '</span>' +
            '<span class="g-group-en">' + g.en + '</span>' +
            '<span class="g-group-count">' + g.items.length + ' 件 · 点击查看大图</span>' +
          '</div>' +
          '<div class="gallery-grid">' +
            g.items.map(function (it, i) {
              return '' +
                '<figure class="gallery-item' + (g.portrait ? ' g-portrait' : '') + '"' +
                  ' role="button" tabindex="0" data-index="' + (b + i) + '"' +
                  ' aria-label="查看 ' + it.title + '">' +
                  '<div class="g-thumb">' +
                    '<img src="' + it.src + '" alt="' + it.title + ' · ' + g.group + '" loading="lazy">' +
                    '<span class="g-zoom" aria-hidden="true">＋</span>' +
                  '</div>' +
                  '<figcaption>' +
                    '<span class="g-title">' + it.title + '</span>' +
                    '<span class="g-desc">' + it.desc + '</span>' +
                  '</figcaption>' +
                '</figure>';
            }).join('') +
          '</div>' +
        '</div>';
    }).join('');

    var quotesHtml =
      '<div class="process-block reveal">' +
        '<div class="process-block-head">' +
          '<span class="pb-name">文案与拆解摘录</span>' +
          '<span class="pb-en">WRITING EXCERPTS</span>' +
        '</div>' +
        '<div class="quote-grid">' +
          PROCESS_QUOTES.map(function (q) {
            return '<blockquote class="quote-card">' +
              '<span class="quote-mark" aria-hidden="true">“</span>' +
              '<p class="quote-text">' + q.text + '</p>' +
              '<p class="quote-foot">' + q.foot + '</p>' +
              '<cite class="quote-src">' + q.title + ' · ' + q.src + '</cite>' +
            '</blockquote>';
          }).join('') +
        '</div>' +
      '</div>';

    var docsHtml =
      '<div class="process-block reveal">' +
        '<div class="process-block-head">' +
          '<span class="pb-name">过程文档</span>' +
          '<span class="pb-en">PROCESS DOCUMENTS</span>' +
        '</div>' +
        '<div class="docs-grid">' + renderDocCards(PROCESS_DOCS) + '</div>' +
      '</div>';

    wrap.innerHTML = stepsHtml + galleryHtml + quotesHtml + docsHtml;
  }

  function renderDocCards(docs) {
    return docs.map(function (d) {
      return '' +
        '<a class="doc-card" href="' + d.href + '" target="_blank" rel="noopener">' +
          '<div class="doc-top">' +
            '<span class="doc-tag">' + d.tag + '</span>' +
            '<span class="doc-arrow" aria-hidden="true">↗</span>' +
          '</div>' +
          '<h3 class="doc-title">' + d.title + '</h3>' +
          '<p class="doc-desc">' + d.desc + '</p>' +
          '<p class="doc-foot">' + d.foot + '<span class="doc-open">查看 PDF</span></p>' +
        '</a>';
    }).join('');
  }

  /* ==================== 渲染：柒 · 文字与策划 ==================== */
  function renderWriting() {
    var wrap = byId('writingWrap');
    if (!wrap) { return; }
    wrap.innerHTML =
      '<div class="docs-grid reveal">' + renderDocCards(WRITING_DOCS) + '</div>';
  }

  /* ==================== 渲染：捌 · 技术代码 ==================== */
  function renderCode() {
    var wrap = byId('codeWrap');
    if (!wrap) { return; }

    var codeHtml = CODES.map(function (c) {
      return '' +
        '<a class="code-card" href="' + c.file + '" download="' + c.name + '">' +
          '<div class="doc-top">' +
            '<span class="doc-tag code-lang">' + c.lang + '</span>' +
            '<span class="doc-arrow" aria-hidden="true">↓</span>' +
          '</div>' +
          '<p class="code-file">' + c.name + '</p>' +
          '<h3 class="doc-title">' + c.title + '</h3>' +
          '<p class="doc-desc">' + c.desc + '</p>' +
          '<p class="doc-foot"><span class="doc-open">下载源文件</span></p>' +
        '</a>';
    }).join('');

    var tdHtml = TD_PROJECTS.map(function (t) {
      var groupsHtml = t.groups.length ? (
        '<ul class="td-list">' +
          t.groups.map(function (g) {
            return '<li><b>' + g.name + '</b><span>' + g.items.join('　·　') + '</span></li>';
          }).join('') +
        '</ul>'
      ) : '';
      return '' +
        '<article class="td-card">' +
          '<div class="doc-top">' +
            '<span class="doc-tag td-tag">TouchDesigner</span>' +
            '<span class="td-note">' + t.note + '</span>' +
          '</div>' +
          '<h3 class="doc-title">' + t.title + '</h3>' +
          '<p class="td-path">' + t.path + '</p>' +
          groupsHtml +
        '</article>';
    }).join('');

    wrap.innerHTML =
      '<div class="process-block">' +
        '<div class="process-block-head">' +
          '<span class="pb-name">源码与脚本 · 可下载</span>' +
          '<span class="pb-en">SOURCE CODE</span>' +
        '</div>' +
        '<div class="code-grid reveal">' + codeHtml + '</div>' +
      '</div>' +
      '<div class="process-block reveal">' +
        '<div class="process-block-head">' +
          '<span class="pb-name">TD 工程清单 · 文本说明</span>' +
          '<span class="pb-en">TOUCHDESIGNER PROJECTS</span>' +
        '</div>' +
        '<div class="td-wrap">' + tdHtml + '</div>' +
      '</div>';
  }

  /* ==================== 图片灯箱查看器（画廊 + 创作过程共用） ==================== */
  var lightbox = byId('lightbox');
  var lightboxBackdrop = byId('lightboxBackdrop');
  var lightboxCloseBtn = byId('lightboxClose');
  var lightboxPrevBtn = byId('lightboxPrev');
  var lightboxNextBtn = byId('lightboxNext');
  var lightboxStage = byId('lightboxStage');
  var lightboxImg = byId('lightboxImg');
  var lightboxTitle = byId('lightboxTitle');
  var lightboxDesc = byId('lightboxDesc');
  var lightboxCount = byId('lightboxCount');

  /* 全局照片清单：视觉设计画廊与创作过程画廊共用同一灯箱 */
  var photoFlat = [];
  GALLERY.forEach(function (g) {
    g.items.forEach(function (it) { photoFlat.push({ group: g.group, item: it }); });
  });
  PROCESS_GALLERY.forEach(function (g) {
    g.items.forEach(function (it) { photoFlat.push({ group: g.group, item: it }); });
  });

  var lbIndex = 0;
  var lbLastFocus = null;

  function showLightboxItem() {
    var entry = photoFlat[lbIndex];
    if (!entry) { return; }
    lightboxImg.src = entry.item.src;
    lightboxImg.alt = entry.item.title + ' · ' + entry.group;
    lightboxTitle.textContent = entry.item.title;
    lightboxDesc.textContent = entry.item.desc + '　·　' + entry.group;
    lightboxCount.textContent = (lbIndex + 1) + ' / ' + photoFlat.length;
  }

  function openLightbox(i) {
    if (!lightbox || !photoFlat.length) { return; }
    lbIndex = i;
    lbLastFocus = document.activeElement;
    showLightboxItem();
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lb-open');
    if (lightboxCloseBtn) { lightboxCloseBtn.focus(); }
  }

  function closeLightbox() {
    if (!lightbox) { return; }
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lb-open');
    if (lightboxImg) { lightboxImg.removeAttribute('src'); }
    if (lbLastFocus && typeof lbLastFocus.focus === 'function') { lbLastFocus.focus(); }
  }

  function stepLightbox(delta) {
    if (!photoFlat.length) { return; }
    lbIndex = (lbIndex + delta + photoFlat.length) % photoFlat.length;
    showLightboxItem();
  }

  /* 画廊卡片点击（事件委托） */
  document.addEventListener('click', function (e) {
    var item = e.target && e.target.closest ? e.target.closest('.gallery-item') : null;
    if (item) { openLightbox(parseInt(item.getAttribute('data-index'), 10)); }
  });

  /* 灯箱键盘：ESC 关闭；方向键切换；Enter/Space 打开卡片 */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox && lightbox.classList.contains('open')) {
      closeLightbox();
      return;
    }
    if (!lightbox || !lightbox.classList.contains('open')) {
      if ((e.key === 'Enter' || e.key === ' ') &&
          e.target && e.target.classList && e.target.classList.contains('gallery-item')) {
        e.preventDefault();
        openLightbox(parseInt(e.target.getAttribute('data-index'), 10));
      }
      return;
    }
    if (e.key === 'ArrowLeft') { e.preventDefault(); stepLightbox(-1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); stepLightbox(1); }
  });

  if (lightboxCloseBtn) { lightboxCloseBtn.addEventListener('click', closeLightbox); }
  if (lightboxPrevBtn) { lightboxPrevBtn.addEventListener('click', function () { stepLightbox(-1); }); }
  if (lightboxNextBtn) { lightboxNextBtn.addEventListener('click', function () { stepLightbox(1); }); }
  /* 点击遮罩（或灯箱空白处）关闭 */
  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightboxBackdrop || e.target === lightboxStage) { closeLightbox(); }
    });
  }

  /* ==================== 全屏弹层播放器 ==================== */
  var modal = byId('playerModal');
  var modalBackdrop = byId('modalBackdrop');
  var modalCloseBtn = byId('modalClose');
  var modalVideo = byId('modalVideo');
  var modalTitle = byId('modalTitle');
  var modalSub = byId('modalSub');
  var lastFocus = null;

  function openPlayer(id) {
    var work = findWork(id);
    if (!work || !modal) { return; }
    lastFocus = document.activeElement;

    var wrap = byId('modalVideoWrap');
    var bili = byId('modalBili');

    /* 若作品配置了 B 站 BV 号：用国内 CDN 的 B 站播放器嵌入（秒开） */
    if (work.bili && wrap && bili) {
      wrap.classList.add('bili-mode');
      bili.classList.add('active');
      bili.innerHTML = '<iframe src="//player.bilibili.com/player.html?bvid=' + encodeURIComponent(work.bili) +
        '&page=1&autoplay=1&high_quality=1&danmaku=0&as_wide=1" scrolling="no" frameborder="0" allowfullscreen></iframe>';
      modalVideo.removeAttribute('src');
      modalVideo.load();
    } else {
      if (wrap) { wrap.classList.remove('bili-mode'); }
      if (bili) { bili.classList.remove('active'); bili.innerHTML = ''; }
      modalVideo.setAttribute('src', 'videos/' + work.id + '.mp4');
      modalVideo.setAttribute('poster', 'images/posters/' + work.id + '.jpg');
      modalVideo.autoplay = true;
    }

    modalTitle.textContent = work.title;
    modalSub.innerHTML = '<b>' + work.year + '</b>' + work.credit;

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    if (modalCloseBtn) { modalCloseBtn.focus(); }
  }

  function closePlayer() {
    if (!modal) { return; }
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    modalVideo.pause();
    modalVideo.removeAttribute('src');
    modalVideo.load();
    var bili = byId('modalBili');
    if (bili) { bili.innerHTML = ''; bili.classList.remove('active'); }
    var wrap = byId('modalVideoWrap');
    if (wrap) { wrap.classList.remove('bili-mode'); }
    if (lastFocus && typeof lastFocus.focus === 'function') { lastFocus.focus(); }
  }

  /* 卡片点击（事件委托） */
  document.addEventListener('click', function (e) {
    var card = e.target && e.target.closest ? e.target.closest('.work-card') : null;
    if (card) { openPlayer(card.getAttribute('data-id')); }
  });

  /* 键盘：ESC 关闭弹层；Enter/Space 打开卡片 */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
      closePlayer();
      return;
    }
    if ((e.key === 'Enter' || e.key === ' ') &&
        e.target && e.target.classList && e.target.classList.contains('work-card')) {
      e.preventDefault();
      openPlayer(e.target.getAttribute('data-id'));
    }
  });

  if (modalCloseBtn) { modalCloseBtn.addEventListener('click', closePlayer); }
  if (modalBackdrop) { modalBackdrop.addEventListener('click', closePlayer); }

  /* 封面缺失时的优雅降级 */
  document.addEventListener('error', function (e) {
    var t = e.target;
    if (t && t.tagName === 'IMG' && t.classList && t.classList.contains('work-poster')) {
      t.style.display = 'none';
      var cover = t.closest ? t.closest('.cover') : null;
      if (cover) { cover.classList.add('no-poster'); }
    }
  }, true);

  /* ==================== 移动端导航折叠 ==================== */
  var navToggle = byId('navToggle');
  var siteNav = byId('siteNav');

  if (navToggle && siteNav) {
    navToggle.addEventListener('click', function () {
      var open = siteNav.classList.toggle('open');
      navToggle.classList.toggle('open', open);
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    siteNav.addEventListener('click', function (e) {
      if (e.target && e.target.tagName === 'A') {
        siteNav.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ==================== 滚动渐入动画 ==================== */
  function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ==================== 当前区块导航高亮 ==================== */
  function initActiveNav() {
    var links = Array.prototype.slice.call(
      document.querySelectorAll('.site-nav a[href^="#"]')
    );
    var map = {};
    links.forEach(function (a) {
      var id = a.getAttribute('href').slice(1);
      var sec = byId(id);
      if (sec) { map[id] = a; }
    });

    if (!('IntersectionObserver' in window)) { return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) { return; }
        links.forEach(function (a) { a.classList.remove('active'); });
        var link = map[entry.target.id];
        if (link) { link.classList.add('active'); }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });

    Object.keys(map).forEach(function (id) {
      var el = byId(id);
      if (el) { io.observe(el); }
    });
  }

  /* ==================== 金色粒子背景 ==================== */
  function initParticles() {
    var host = byId('particles');
    if (!host) { return; }
    var count = window.innerWidth < 680 ? 26 : 55;
    var frag = document.createDocumentFragment();

    for (var i = 0; i < count; i++) {
      var s = document.createElement('span');
      var size = 2 + Math.random() * 3;
      s.style.left = (Math.random() * 100).toFixed(2) + '%';
      s.style.top = (20 + Math.random() * 80).toFixed(2) + '%';
      s.style.width = size.toFixed(1) + 'px';
      s.style.height = size.toFixed(1) + 'px';
      s.style.setProperty('--dx', ((Math.random() - 0.5) * 120).toFixed(0) + 'px');
      s.style.setProperty('--o', (0.25 + Math.random() * 0.5).toFixed(2));
      s.style.animationDuration = (12 + Math.random() * 18).toFixed(1) + 's';
      s.style.animationDelay = (-Math.random() * 30).toFixed(1) + 's';
      frag.appendChild(s);
    }
    host.appendChild(frag);
  }

  /* ==================== 启动 ==================== */
  renderFeatured();
  renderDirections();
  renderWorks();
  renderGallery();
  renderProcess();
  renderWriting();
  renderCode();
  initReveal();
  initActiveNav();
  initParticles();
})();
