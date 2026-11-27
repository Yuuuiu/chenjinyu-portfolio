/* =====================================================================
   陈锦育 · 个人作品集 —— 前端脚本
   数据源：本文件内维护（纯原生 JS，无任何外部依赖）
   支持：Tab 无障碍与 URL Hash 深链接、弹窗项目信息表、上下部切换与失败重试、SVG 兜底
   ===================================================================== */
(function () {
  'use strict';

  /* ==================== 资源源 ==================== */
  /* 国内加速：视频与图片全部托管在阿里云 OSS（上海），GitHub Pages 只承载 HTML/CSS/JS */
  var LOCAL_PREVIEW = window.location.protocol === 'file:' || /^(localhost|127\.0\.0\.1|\[::1\]|(?:10\.\d+|192\.168|172\.(?:1[6-9]|2\d|3[01]))\.\d+\.\d+)$/.test(window.location.hostname);
  var VIDEO_BASE = LOCAL_PREVIEW ? 'videos/' : 'https://chenjinyu-portfolio.oss-cn-shanghai.aliyuncs.com/videos/';
  var IMG_BASE = 'https://chenjinyu-portfolio.oss-cn-shanghai.aliyuncs.com/';

  /* 图片路径统一转换：本地相对路径 → OSS 直链 */
  var FILE_BASE = LOCAL_PREVIEW ? '' : IMG_BASE;
  function fileUrl(p) {
    if (!p) { return p; }
    if (/^https?:/i.test(p)) { return p; }
    return FILE_BASE + encodeURI(p);
  }

  function imgUrl(p) {
    if (!p) { return p; }
    if (p.indexOf('assets/') === 0) {
      return LOCAL_PREVIEW ? p : (IMG_BASE + 'images/' + p.split('/').pop());
    }
    if (p.indexOf('http') === 0) { return p; }
    if (LOCAL_PREVIEW) { return p; }
    return IMG_BASE + p.replace(/^\.?\//, '');
  }

  /* 内联 SVG 占位图（图片加载失败时兜底，避免破图） */
  function fallbackSvg(label) {
    var safe = String(label || '作品画面').replace(/[<>&"']/g, '').slice(0, 22);
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360">' +
      '<rect width="640" height="360" fill="#EFEEEA"/>' +
      '<rect x="20" y="20" width="600" height="320" fill="none" stroke="#DCDAD3" stroke-width="1"/>' +
      '<text x="320" y="176" text-anchor="middle" fill="#6E6E6E" font-size="18" font-family="Microsoft YaHei,PingFang SC,sans-serif">' + safe + '</text>' +
      '<text x="320" y="206" text-anchor="middle" fill="#9A9A9A" font-size="12" font-family="sans-serif">IMAGE LOADING UNAVAILABLE</text>' +
      '</svg>';
    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
  }

  /* ==================== 数据：方向（七个内容方向，聚焦 AI 主线） ==================== */
  var DIRECTIONS = [
    {
      id: 'ai',
      num: '壹',
      name: 'AI 影像 · AIGC 全流程',
      en: 'AI VIDEO & AIGC',
      tagline: 'AI 漫剧 · 角色一致性 · 分镜生成 · 全流程成片',
      desc: '以即梦 / Midjourney 等 AIGC 工具完成从世界观设定、分镜脚本到视频生成的完整创作管线'
    },
    {
      id: 'interactive',
      num: '贰',
      name: '交互装置 · 新媒体艺术',
      en: 'INTERACTIVE ART',
      tagline: 'TouchDesigner · 手势识别 · 粒子系统 · 获奖背书',
      desc: '围绕非遗数字化与情绪可视化的实时交互探索，涵盖多部国家级获奖作品'
    },
    {
      id: 'film',
      num: '叁',
      name: '影视创作 · 动态影像',
      en: 'FILM & MOTION',
      tagline: '视听语言 · 拍摄剪辑 · 调色 · After Effects',
      desc: '从剧本策划、实地拍摄到剪辑调色的完整短片创作，支撑 AI 影像叙事与剪辑'
    },
    {
      id: 'gallery',
      num: '肆',
      name: '平面 IP 与视觉设计',
      en: 'IP & VISUAL DESIGN',
      tagline: '角色 IP · AI 海报 · 竞赛展板 · 文创衍生',
      desc: '合并呈现文旅/文物拟人 IP、AI 影像主视觉海报、竞赛展板与「青铜遗韵」文创衍生品'
    },
    {
      id: 'process',
      num: '伍',
      name: '创作过程 · 工作流',
      en: 'PROCESS & WORKFLOW',
      tagline: '三视图锚定 · 提示词记录 · 概念分镜 · TD 节点',
      desc: '展开 AI 角色三视图、提示词迭代、分镜原画与 TouchDesigner 实现的完整工作流',
      countLabel: '过程图 32 张'
    },
    {
      id: 'writing',
      num: '陆',
      name: '文字与策划',
      en: 'WRITING & PLANNING',
      tagline: '世界观设定 · 剧本 · 分镜 · 运营方案',
      desc: '世界观、剧本分镜与商业策划类文档，覆盖新媒体与 AI 漫剧前期全流程',
      countLabel: '文档 9 份'
    },
    {
      id: 'code',
      num: '柒',
      name: '技术代码 · 提效脚本',
      en: 'CODE & TOOLS',
      tagline: 'ffmpeg 自动化 · PowerShell · Processing · TD',
      desc: '成片自动化构建脚本与音画互动源码，展示工程化提效与实时实现能力',
      countLabel: '源码 4 项'
    }
  ];

  var WORKS = [
    /* ---- 壹 · AI 影像（主创 · 全程参与 · 团队协作） ---- */
    {
      id: 'ai_xiuzhang', dir: 'ai',
      duration: '2:56',
      title: '《绣藏》',
      year: '2026', tags: ['AI漫剧', '全流程管线', '非遗国风'],
      role: '主创 · 全程参与（概念 / 分镜 / AI 生成 / 剪辑）',
      team: '团队协作',
      tools: ['即梦', 'Midjourney', 'After Effects', '剪辑合成'],
      result: '', scale: '', teamSize: '',
      desc: '「道藏三千：非遗证道录」AI 漫剧参赛作品：以道家符箓与非遗纹样构建世界观，主创推进设定集、剧本、概念设计与 PV 分镜全流程。',
      credit: '',
      highlight: '西湖新风 AI 漫剧创作大赛 · 全流程含设定集与 PV 分镜'
    },
    {
      id: 'ai_yangyangtang', dir: 'ai',
      duration: '1:04',
      title: '《盐阳叹》',
      year: '2026', tags: ['AI影像诗', '水墨流体', '文化题材'],
      role: '主创 · 全程参与（概念 / 分镜 / AI 生成 / 剪辑）',
      team: '团队协作',
      tools: ['即梦', 'AIGC 视频生成', '后期调色剪辑'],
      result: '', scale: '', teamSize: '',
      desc: '水墨与流体抽象的 AI 影像诗：金色流线、蓝雾与星屑在画面中聚散，以「盐阳」古意为题呈现东方意象的情绪流动。',
      credit: '',
      highlight: '中国好创意大赛 · 应用组国家级二等奖'
    },
    {
      id: 'ai_cannes', dir: 'ai',
      duration: '3:55',
      title: '《倒退的棕榈叶》',
      year: '2026', tags: ['AI剧情短片', '电影感', '情绪叙事'],
      role: '主创 · 全程参与（概念 / 分镜 / AI 生成 / 剪辑）',
      team: '团队协作',
      tools: ['即梦', 'Midjourney', '剪辑调色'],
      result: '', scale: '', teamSize: '',
      desc: '真实感 AI 剧情短片：疲惫的设计师驾车、伏案绘图，与白发角色的往事在镜头间交织，探讨创作与时间。',
      credit: '',
      highlight: '电影感真实系 AI 剧情短片 · 含主视觉海报系列'
    },
    {
      id: 'ai_dasheng', dir: 'ai',
      duration: '1:36',
      title: '《灾厄战线》',
      year: '2026', tags: ['AI概念片', '暗黑科幻', '即梦'],
      role: '主创 · 全程参与（概念 / 分镜 / AI 生成 / 剪辑）',
      team: '团队协作',
      tools: ['即梦', 'AIGC 视频生成', '剪辑合成'],
      result: '', scale: '', teamSize: '',
      desc: '暗黑科幻 AI 概念短片：废墟战场上女性战士与巨兽对峙，「灾厄降临」世界观的大场面动态探索。',
      credit: '',
      highlight: '暗黑科幻大场面 · 概念预告片视觉探索'
    },
    {
      id: 'ai_doubao', dir: 'ai',
      duration: '2:20',
      title: '《小奶与小美》',
      year: '2026', tags: ['AI数字人', '口播叙事', '废土科幻'],
      role: '主创 · 全程参与（概念 / 分镜 / AI 生成 / 剪辑）',
      team: '团队协作',
      tools: ['即梦', 'AI 数字人', '剪辑合成'],
      result: '', scale: '', teamSize: '',
      desc: 'AI 废土科幻短片：橙色沙海中的异星生物与巨型光柱，数字人角色串联起荒芜世界里的日常对话。',
      credit: '',
      highlight: 'AI 数字人口播 × 废土科幻场景融合'
    },
    {
      id: 'ai_yegou', dir: 'ai',
      title: '《野生狗奶》',
      year: '2026', tags: ['AI喜剧短片', '多角色动作', '剧本改编'],
      duration: '4:07',
      role: '主创 · 全程参与（概念 / 分镜 / AI 生成 / 剪辑）',
      team: '团队协作',
      tools: ['即梦', 'AIGC 视频生成', '剪辑配音'],
      result: '', scale: '', teamSize: '',
      desc: '动作喜剧 AI 短片：废墟中五人争夺一箱「野生狗奶」，古装角色与现代包装碰撞出穿越式笑点（150 秒剧本改编）。',
      credit: '',
      highlight: '多角色快节奏动作喜剧 · 150 秒剧本改编'
    },
    /* ---- 贰 · 交互装置 ---- */
    {
      id: 'itd_shange', dir: 'interactive',
      duration: '0:59',
      title: '《山歌回音壁》声音与灯光互动装置',
      year: '2026', tags: ['Processing', '音画互动', '声光装置'],
      role: '独立创作（概念 / 音画程序 / 声光联动）',
      team: '独立完成',
      tools: ['Processing', '音画互动', '灯光联动'],
      poster: 'assets/images/itd_shange_v2.jpg',
      result: '', scale: '', teamSize: '',
      desc: '声音与灯光交互装置：以《文山·沉积之书》影像为呈现载体，观众的声音与动作驱动灯光与画面回应，把「山歌」转译为空间中的声光回响。',
      credit: '独立创作 · 中国好创意大赛 · 学术组国家级二等奖'
    },
    {
      id: 'itd_yixiu', dir: 'interactive',
      duration: '3:33',
      title: '《一绣成祥》',
      year: '2026', tags: ['TouchDesigner', '粒子系统', '手势识别', '壮锦'],
      role: '独立创作 · 队长（TD 粒子 / 手势交互 / 展板）',
      team: '独立完成',
      tools: ['TouchDesigner', '粒子系统', '手势识别'],
      result: '', scale: '', teamSize: '',
      desc: '壮锦·绣球非遗数字交互装置：蛙纹、花卉、祥云纹样转译为粒子，观众以自然手势操控纹样汇聚生长与解构重组。',
      credit: '独立创作 · 队长 · 米兰设计周国家级三等奖（指导教师：李紫阳、程思、刘琼）'
    },
    {
      id: 'itd_ironfire', dir: 'interactive',
      title: '《铁火生花》IRON FIRE BLOOM',
      year: '2026', tags: ['TouchDesigner', 'GPU粒子', '手势交互', '非遗数字化'],
      duration: '1:54',
      role: '独立创作（概念 / 分镜 / TD 粒子 / 脚本成片）',
      team: '独立完成',
      tools: ['TouchDesigner', 'GPU 粒子', 'PowerShell / ffmpeg'],
      result: '', scale: '', teamSize: '',
      desc: '非遗打铁花数字交互装置：1600℃ 铁水转译为 GPU 粒子，观众手势驱动铁火熔炼、迸发与绽放，让「看一次少一次」的打铁花可以被反复走近、反复体验。',
      credit: '独立创作 · 第十四届全国大学生数字媒体科技作品及创意竞赛参赛作品（编号 328499）'
    },
    {
      id: 'itd_honghua', dir: 'interactive', videoFile: 'itd_honghua-v2.mp4',
      duration: '2:18',
      title: '《红花峰林十六点·互动地图》',
      year: '2026', tags: ['TouchDesigner', '文旅', '互动地图'],
      role: '交互视觉与地图实现',
      team: '计时赛团队',
      tools: ['TouchDesigner', '互动地图'],
      result: '', scale: '', teamSize: '',
      desc: '恩施文旅融合创新计时赛作品，中国好创意大赛国家级三等奖。红花峰林景区十六景点交互游览地图。',
      credit: '中国好创意大赛 · 国家级三等奖（“跃动峡谷，潮玩清江”文旅融合与创新计时赛）'
    },
    {
      id: 'itd_xinmai', dir: 'interactive',
      duration: '2:24',
      title: '《心脉·花影》情绪交互装置',
      year: '2025', tags: ['TouchDesigner', '心率传感', 'MediaPipe', '情绪可视化'],
      role: '组长（传感器接入 / 流体粒子交互）',
      team: '第九组协作',
      tools: ['TouchDesigner', 'MediaPipe', '心率传感'],
      result: '', scale: '', teamSize: '',
      desc: '情绪可视化交互装置：心率传感与面部微表情（MediaPipe）实时驱动流体粒子，「心脉」被翻译成花与影。',
      credit: '组长（第九组）· 交互装置设计课程'
    },
    /* ---- 叁 · 影视创作 ---- */
    {
      id: 'film_wusheng', dir: 'film',
      duration: '0:59',
      title: '《无声暗涌》',
      year: '2025', tags: ['After Effects', '动态影像', '情绪'],
      role: '独立创作（概念 / 动态视觉 / 后期合成）',
      team: '独立完成',
      tools: ['After Effects', '动态图形合成'],
      result: '', scale: '', teamSize: '',
      desc: '情绪物质化实验影像：缓慢流动的粘稠液体、机械与生物组织的碰撞、闪烁噪点，把难以宣泄的压抑转成视觉系统。',
      credit: '独立创作'
    },
    {
      id: 'film_silu', dir: 'film',
      duration: '3:03',
      title: '《丝路新篇》',
      year: '2025', tags: ['AI生成', '实拍', '剪辑合成'],
      role: '独立创作（AI 生成 / 实拍素材整合 / 剪辑）',
      team: '独立完成',
      tools: ['AI 生成', '实拍', '剪辑合成'],
      result: '', scale: '', teamSize: '',
      desc: '丝绸之路主题影像：融合 AI 生成与实拍画面，从沙漠公路到森林、雪地、戈壁与城市高架，跨越古今讲述丝路传承。',
      credit: '独立创作 · 影视创作课程'
    },
    {
      id: 'film_hucheng', dir: 'film',
      duration: '1:36',
      title: '《湖城烟雨》',
      year: '2025', tags: ['实拍', '剪辑', '调色'],
      role: '拍摄 / 剪辑 / 调色',
      team: '双人合作（与焦星宇）',
      tools: ['实拍', '剪辑调色'],
      result: '', scale: '', teamSize: '',
      desc: '雨中东湖的影像实验：刻意等待雨天拍摄，栈桥、荷叶、古亭在雨雾中如水墨，探索城市与自然的关系。',
      credit: '与焦星宇合作 · 指导教师：彭隽'
    },
    {
      id: 'film_qiehuang', dir: 'film',
      duration: '3:00',
      title: '《茄香味俱全》',
      year: '2025', tags: ['短片', '剧本', '剪辑'],
      role: '独立创作（剧本 / 拍摄 / 剪辑）',
      team: '独立完成',
      tools: ['剧本', '实拍', '剪辑调色'],
      result: '', scale: '', teamSize: '',
      desc: '暖色调泡面创意短片：主角小吴从超市选购「茄皇」到宿舍煮食的线性叙事，把对家的思念藏进一碗面。',
      credit: '独立创作 · 指导教师：刘琼'
    },
    {
      id: 'film_zaoba', dir: 'film',
      duration: '1:58',
      title: '《这节早八不太好上》',
      year: '2025', tags: ['短片', '剧本', '视听语言'],
      role: '独立创作（剧本 / 手持拍摄 / 剪辑）',
      team: '独立完成',
      tools: ['剧本', '实拍', '视听剪辑'],
      result: '', scale: '', teamSize: '',
      desc: '视听语言课程短片：以暗调光影与手持镜头记录「早八」前后的宿舍深夜，把起床的挣扎拍成一场小型战役。',
      credit: '独立创作 · 视听语言课程'
    }
  ];

  /* ==================== 数据（平面 IP 与视觉设计画廊 · 合并 Tab 切换） ==================== */
  var GALLERY = [
    {
      slug: 'ip',
      group: '平面 IP 设计', en: '2D IP DESIGN', portrait: true,
      intro: '文旅角色（红仓 / 江仓）、青铜文物拟人（古器争鸣）与品牌 IP 的三视图、标准色与延展应用。',
      items: [
        { src: 'images/gallery/board_hongcang_v2.jpg', title: '《红仓》「山仓之灵」IP 设计', desc: '红花峰林文旅 IP · 三视图 / 表情 / 标准色 / 延展服饰与动作（恩施土家族文化）' },
        { src: 'images/gallery/ip_jiangcang_v2.jpg', title: '《江仓》「水仓之灵」IP 设计', desc: '清江文旅 IP · 三视图 / 表情 / 标准色 / 延展动作（与红仓为兄妹角色）' },
        { src: 'images/gallery/ip_guqi_1.jpg', title: '《古器争鸣》文物拟人 IP · 展板一', desc: '青铜器拟人角色卡牌设计 · 组队项目' },
        { src: 'images/gallery/ip_guqi_2.jpg', title: '《古器争鸣》文物拟人 IP · 展板二', desc: '青铜器拟人角色卡牌设计 · 组队项目' },
        { src: 'images/gallery/board_adcal.jpg', title: '《AD钙奶 · 成长营养搭子》品牌 IP', desc: '消费心理与品牌传播课程 · 品牌 IP 视觉' },
        { src: 'images/gallery/board_designbasics.jpg', title: '《三月三的起源与流传》游戏角色 IP', desc: '设计基础课程 · 民族文化角色设定与游戏界面延展' },
        { src: 'images/gallery/ip_wenchuang.jpg', title: 'IP 文创衍生设计', desc: '体验设计课程 · IP 衍生品设计方案' }
      ]
    },
    {
      slug: 'aiassets',
      group: 'AI 资产 · 角色与场景', en: 'AI ASSETS · CHARACTER & SCENE', portrait: false,
      intro: 'AI 视觉开发素材：角色三视图锚定与场景概念，来自《无限流》《大圣归来》等项目的制作过程资产。',
      items: [
        { src: 'assets/images/assets/assets_wx_bus.jpg', title: '《无限流》场景 · 大巴车厢', desc: 'AI 场景概念 · 短剧视觉开发' },
        { src: 'assets/images/assets/assets_wx_puppet.jpg', title: '《无限流》角色 · 木偶人三视图', desc: 'AI 角色设定 · 三视图锚定' },
        { src: 'assets/images/assets/assets_wx_man.jpg', title: '《无限流》角色 · 中年男性三视图', desc: 'AI 角色设定 · 三视图锚定' },
        { src: 'assets/images/assets/assets_wx_woman.jpg', title: '《无限流》角色 · 女性三视图', desc: 'AI 角色设定 · 三视图锚定' },
        { src: 'assets/images/assets/assets_wx_theater.jpg', title: '《无限流》场景 · 戏台夜色', desc: 'AI 场景概念 · 氛围光效' },
        { src: 'assets/images/assets/assets_wx_passengers.jpg', title: '《无限流》场景 · 大巴乘客', desc: 'AI 场景概念 · 群像构图' },
        { src: 'assets/images/assets/assets_ds_mammoth.jpg', title: '《大圣归来》概念 · 巨兽', desc: 'AI 概念设计 · 神兽' },
        { src: 'assets/images/assets/assets_ds_dragon.jpg', title: '《大圣归来》概念 · 龙形神兽', desc: 'AI 概念设计 · 场景' },
        { src: 'assets/images/assets/assets_ds_boy.jpg', title: '《大圣归来》角色 · 少年三视图', desc: 'AI 角色设定 · 三视图' },
        { src: 'assets/images/assets/assets_ds_girl.jpg', title: '《大圣归来》角色 · 少女三视图', desc: 'AI 角色设定 · 三视图' }
      ]
    },
    {
      slug: 'shanhai',
      group: 'AI 概念 · 山海经', en: 'AI CONCEPT · MYTHICAL CREATURES', portrait: false,
      intro: 'AI 概念设计：山海经神兽与神话场景（《天问》项目与练习），均为个人 AI 生成 + 后期调色输出。',
      items: [
        { src: 'assets/images/assets2/shanhai_qilin.jpg', title: '《山海经》概念 · 麒麟', desc: 'AI 概念设计 · 神兽 · 3840×2160' },
        { src: 'assets/images/assets2/shanhai_phoenix.jpg', title: '《山海经》概念 · 白凤', desc: 'AI 概念设计 · 神鸟 · 祥云场景' },
        { src: 'assets/images/assets2/shanhai_goat.jpg', title: '《山海经》概念 · 白泽', desc: 'AI 概念设计 · 神兽 · 云海' },
        { src: 'assets/images/assets2/shanhai_tiger.jpg', title: '《山海经》概念 · 翼虎', desc: 'AI 概念设计 · 神兽 · 城阙' },
        { src: 'assets/images/assets2/shanhai_dragon.jpg', title: '《山海经》概念 · 青龙', desc: 'AI 概念设计 · 龙形神兽' },
        { src: 'assets/images/assets2/concept_tianwen.jpg', title: '《天问》概念 · 青鸾', desc: 'AI 场景概念 · 神话叙事 · 5504×3072' },
        { src: 'assets/images/assets2/concept_gate.jpg', title: '《天问》概念 · 山门', desc: 'AI 场景概念 · 巨门与瀑布' },
        { src: 'assets/images/assets2/concept_aoyu.jpg', title: '《天问》概念 · 傲羽神兽', desc: 'AI 概念设计 · 巨兽与宫阙' },
        { src: 'assets/images/assets2/concept_qilin_run.jpg', title: '《天问》概念 · 麒麟踏雪', desc: 'AI 概念设计 · 动态构图' },
        { src: 'assets/images/assets2/concept_pegasus.jpg', title: '《天问》概念 · 天马', desc: 'AI 场景概念 · 山峦仙境' },
        { src: 'assets/images/assets2/char_girl.jpg', title: 'AI 角色设计 · 少女三视图', desc: 'AI 角色设定 · 三视图与服装细节' }
      ]
    },
    {
      slug: 'projall',
      group: 'AI 项目 · 画面全览', en: 'AI PROJECTS · FRAMES', portrait: false,
      intro: 'AI 视觉开发项目过程画面（项目 1–5、黑豆、奶龙）。',
      items: [
        { src: 'assets/images/bulk/proj_01.jpg', title: '《项目4》· 画面 01', desc: 'AI 视觉开发 · 项目过程画面' },
        { src: 'assets/images/bulk/proj_02.jpg', title: '《项目4》· 画面 02', desc: 'AI 视觉开发 · 项目过程画面' },
        { src: 'assets/images/bulk/proj_03.jpg', title: '《项目4》· 画面 03', desc: 'AI 视觉开发 · 项目过程画面' },
        { src: 'assets/images/bulk/proj_04.jpg', title: '《项目4》· 画面 04', desc: 'AI 视觉开发 · 项目过程画面' },
        { src: 'assets/images/bulk/proj_05.jpg', title: '《项目4》· 画面 05', desc: 'AI 视觉开发 · 项目过程画面' },
        { src: 'assets/images/bulk/proj_06.jpg', title: '《项目4》· 画面 06', desc: 'AI 视觉开发 · 项目过程画面' },
        { src: 'assets/images/bulk/proj_07.jpg', title: '《项目4》· 画面 07', desc: 'AI 视觉开发 · 项目过程画面' },
        { src: 'assets/images/bulk/proj_08.jpg', title: '《项目4》· 画面 08', desc: 'AI 视觉开发 · 项目过程画面' },
        { src: 'assets/images/bulk/proj_09.jpg', title: '《项目4》· 画面 09', desc: 'AI 视觉开发 · 项目过程画面' },
        { src: 'assets/images/bulk/proj_10.jpg', title: '《项目4》· 画面 10', desc: 'AI 视觉开发 · 项目过程画面' },
        { src: 'assets/images/bulk/proj_11.jpg', title: '《项目4》· 画面 11', desc: 'AI 视觉开发 · 项目过程画面' },
        { src: 'assets/images/bulk/proj_12.jpg', title: '《项目4》· 画面 12', desc: 'AI 视觉开发 · 项目过程画面' },
        { src: 'assets/images/bulk/proj_13.jpg', title: '《项目5》· 画面 13', desc: 'AI 视觉开发 · 项目过程画面' },
        { src: 'assets/images/bulk/proj_14.jpg', title: '《项目5》· 画面 14', desc: 'AI 视觉开发 · 项目过程画面' },
        { src: 'assets/images/bulk/proj_15.jpg', title: '《项目5》· 画面 15', desc: 'AI 视觉开发 · 项目过程画面' },
        { src: 'assets/images/bulk/proj_16.jpg', title: '《项目5》· 画面 16', desc: 'AI 视觉开发 · 项目过程画面' },
        { src: 'assets/images/bulk/proj_17.jpg', title: '《项目5》· 画面 17', desc: 'AI 视觉开发 · 项目过程画面' },
        { src: 'assets/images/bulk/proj_18.jpg', title: '《项目5》· 画面 18', desc: 'AI 视觉开发 · 项目过程画面' },
        { src: 'assets/images/bulk/proj_19.jpg', title: '《项目5》· 画面 19', desc: 'AI 视觉开发 · 项目过程画面' },
        { src: 'assets/images/bulk/proj_20.jpg', title: '《项目5》· 画面 20', desc: 'AI 视觉开发 · 项目过程画面' },
        { src: 'assets/images/bulk/proj_21.jpg', title: '《项目5》· 画面 21', desc: 'AI 视觉开发 · 项目过程画面' },
        { src: 'assets/images/bulk/proj_22.jpg', title: '《项目5》· 画面 22', desc: 'AI 视觉开发 · 项目过程画面' },
        { src: 'assets/images/bulk/proj_23.jpg', title: '《项目5》· 画面 23', desc: 'AI 视觉开发 · 项目过程画面' },
        { src: 'assets/images/bulk/proj_24.jpg', title: '《项目5》· 画面 24', desc: 'AI 视觉开发 · 项目过程画面' },
        { src: 'assets/images/bulk/proj_25.jpg', title: '《项目3》· 画面 25', desc: 'AI 视觉开发 · 项目过程画面' },
        { src: 'assets/images/bulk/proj_26.jpg', title: '《项目3》· 画面 26', desc: 'AI 视觉开发 · 项目过程画面' },
        { src: 'assets/images/bulk/proj_27.jpg', title: '《项目3》· 画面 27', desc: 'AI 视觉开发 · 项目过程画面' },
        { src: 'assets/images/bulk/proj_28.jpg', title: '《项目3》· 画面 28', desc: 'AI 视觉开发 · 项目过程画面' },
        { src: 'assets/images/bulk/proj_29.jpg', title: '《项目3》· 画面 29', desc: 'AI 视觉开发 · 项目过程画面' },
        { src: 'assets/images/bulk/proj_30.jpg', title: '《项目3》· 画面 30', desc: 'AI 视觉开发 · 项目过程画面' },
        { src: 'assets/images/bulk/proj_31.jpg', title: '《项目2》· 画面 31', desc: 'AI 视觉开发 · 项目过程画面' },
        { src: 'assets/images/bulk/proj_32.jpg', title: '《项目2》· 画面 32', desc: 'AI 视觉开发 · 项目过程画面' },
        { src: 'assets/images/bulk/proj_33.jpg', title: '《项目2》· 画面 33', desc: 'AI 视觉开发 · 项目过程画面' },
        { src: 'assets/images/bulk/proj_34.jpg', title: '《项目2》· 画面 34', desc: 'AI 视觉开发 · 项目过程画面' },
        { src: 'assets/images/bulk/proj_35.jpg', title: '《项目1》· 画面 35', desc: 'AI 视觉开发 · 项目过程画面' },
        { src: 'assets/images/bulk/proj_36.jpg', title: '《项目1》· 画面 36', desc: 'AI 视觉开发 · 项目过程画面' },
        { src: 'assets/images/bulk/proj_37.jpg', title: '《项目1》· 画面 37', desc: 'AI 视觉开发 · 项目过程画面' },
        { src: 'assets/images/bulk/proj_38.jpg', title: '《项目1》· 画面 38', desc: 'AI 视觉开发 · 项目过程画面' },
        { src: 'assets/images/bulk/proj_39.jpg', title: '《黑豆》· 画面 39', desc: 'AI 视觉开发 · 项目过程画面' },
        { src: 'assets/images/bulk/proj_40.jpg', title: '《黑豆》· 画面 40', desc: 'AI 视觉开发 · 项目过程画面' },
        { src: 'assets/images/bulk/proj_41.jpg', title: '《黑豆》· 画面 41', desc: 'AI 视觉开发 · 项目过程画面' },
        { src: 'assets/images/bulk/proj_42.jpg', title: '《黑豆》· 画面 42', desc: 'AI 视觉开发 · 项目过程画面' },
        { src: 'assets/images/bulk/proj_43.jpg', title: '《黑豆》· 画面 43', desc: 'AI 视觉开发 · 项目过程画面' },
        { src: 'assets/images/bulk/proj_44.jpg', title: '《黑豆》· 画面 44', desc: 'AI 视觉开发 · 项目过程画面' },
        { src: 'assets/images/bulk/proj_45.jpg', title: '《奶龙第1集》· 画面 45', desc: 'AI 视觉开发 · 项目过程画面' },
        { src: 'assets/images/bulk/proj_46.jpg', title: '《奶龙第1集》· 画面 46', desc: 'AI 视觉开发 · 项目过程画面' },
        { src: 'assets/images/bulk/proj_47.jpg', title: '《奶龙第1集》· 画面 47', desc: 'AI 视觉开发 · 项目过程画面' },
        { src: 'assets/images/bulk/proj_48.jpg', title: '《奶龙第1集》· 画面 48', desc: 'AI 视觉开发 · 项目过程画面' },
        { src: 'assets/images/bulk/proj_49.jpg', title: '《奶龙第1集》· 画面 49', desc: 'AI 视觉开发 · 项目过程画面' },
        { src: 'assets/images/bulk/proj_50.jpg', title: '《奶龙第1集》· 画面 50', desc: 'AI 视觉开发 · 项目过程画面' }
      ]
    },
    {
      slug: 'charall',
      group: 'AI 角色 · 三视图合集', en: 'AI CHARACTERS · TURNAROUND', portrait: false,
      intro: 'AI 角色设计三视图与服装细节。',
      items: [
        { src: 'assets/images/bulk/char_01.jpg', title: 'AI 角色设定 · 01', desc: 'AI 角色设计 · 三视图与服装细节' },
        { src: 'assets/images/bulk/char_02.jpg', title: 'AI 角色设定 · 02', desc: 'AI 角色设计 · 三视图与服装细节' },
        { src: 'assets/images/bulk/char_03.jpg', title: 'AI 角色设定 · 03', desc: 'AI 角色设计 · 三视图与服装细节' },
        { src: 'assets/images/bulk/char_04.jpg', title: 'AI 角色设定 · 04', desc: 'AI 角色设计 · 三视图与服装细节' },
        { src: 'assets/images/bulk/char_05.jpg', title: 'AI 角色设定 · 05', desc: 'AI 角色设计 · 三视图与服装细节' },
        { src: 'assets/images/bulk/char_06.jpg', title: 'AI 角色设定 · 06', desc: 'AI 角色设计 · 三视图与服装细节' },
        { src: 'assets/images/bulk/char_07.jpg', title: 'AI 角色设定 · 07', desc: 'AI 角色设计 · 三视图与服装细节' },
        { src: 'assets/images/bulk/char_08.jpg', title: 'AI 角色设定 · 08', desc: 'AI 角色设计 · 三视图与服装细节' },
        { src: 'assets/images/bulk/char_09.jpg', title: 'AI 角色设定 · 09', desc: 'AI 角色设计 · 三视图与服装细节' }
      ]
    },
    {
      slug: 'ipblindbox',
      group: 'IP 衍生品 · 文旅盲盒', en: 'IP DESIGN · BLIND BOX', portrait: false,
      intro: '文旅 IP 盲盒设计：武当山、老君山主题角色的三视图、配色与隐藏款造型。',
      items: [
        { src: 'assets/images/assets3/ip_wudang_san.jpg', title: '《武当山》IP · 玄小武三视图', desc: '文旅 IP 盲盒设计 · 三视图与配色' },
        { src: 'assets/images/assets3/ip_wudang_xw.jpg', title: '《武当山》IP · 寻道记 六常规 + 隐藏款', desc: '文旅 IP 盲盒设计 · 整套角色' },
        { src: 'assets/images/assets3/ip_laojun_san.jpg', title: '《老君山》IP · 云山小君三视图', desc: '文旅 IP 盲盒设计 · 三视图与配色' },
        { src: 'assets/images/assets3/ip_wudang_hidden.jpg', title: '《武当山》IP · 金顶问天隐藏款', desc: '文旅 IP 盲盒设计 · 隐藏款造型' }
      ]
    },
    {
      slug: 'team',
      group: '团队项目 · 像素创研', en: 'TEAM PROJECTS · PIXEL LAB', portrait: true,
      intro: '与团队协作完成的 AI 视觉海报系列（参与视觉与制作），含《IRON CLAW》《WILD WING》《CHICK SQUAD》《NOVA》《GALAXY GUARDIANS》。',
      items: [
        { src: 'assets/images/team/team_iron_claw.jpg', title: '《IRON CLAW》海报', desc: '团队协作项目 · AI 视觉与海报参与制作' },
        { src: 'assets/images/team/team_wild_wing.jpg', title: '《WILD WING》海报', desc: '团队协作项目 · AI 视觉与海报参与制作' },
        { src: 'assets/images/team/team_chick_squad.jpg', title: '《CHICK SQUAD》海报', desc: '团队协作项目 · AI 视觉与海报参与制作' },
        { src: 'assets/images/team/team_nova.jpg', title: '《NOVA》海报', desc: '团队协作项目 · AI 视觉与海报参与制作' },
        { src: 'assets/images/team/team_galaxy.jpg', title: '《GALAXY GUARDIANS》海报', desc: '团队协作项目 · 横版群像视觉' }
      ]
    },
    {
      slug: 'poster',
      group: '海报设计', en: 'POSTER DESIGN', portrait: true,
      intro: '《绣藏》《倒退的棕榈叶》等 AI 影像与影视短片主海报，以及《盐阳叹》《灾厄战线》《野生狗奶》《丝路新篇》的 AI 视觉延展海报（标注非原画/实拍）。',
      items: [
        { src: 'images/gallery/poster_xiuzang_2.jpg', title: '《绣藏》主海报', desc: '西湖新风 AI 漫剧大赛 · 角色冲突主视觉' },
        { src: 'images/gallery/poster_xiuzang_1.jpg', title: '《绣藏》人物海报', desc: '西湖新风 AI 漫剧大赛 · 角色形象主视觉' },
        { src: 'images/gallery/poster_xiuzang_3.jpg', title: '《绣藏》场景海报', desc: '西湖新风 AI 漫剧大赛 · 世界观场景延展' },
        { src: 'images/gallery/poster_bear_2.jpg', title: '《倒退的棕榈叶》主海报', desc: 'AI 影像概念主视觉' },
        { src: 'images/gallery/poster_bear_3.jpg', title: '《倒退的棕榈叶》人物海报', desc: 'AI 影像概念角色延展' },
        { src: 'images/gallery/poster_bear_5.jpg', title: '《倒退的棕榈叶》场景海报', desc: 'AI 影像概念场景延展' },
        { src: 'images/gallery/poster_qingtong.jpg', title: '《青铜遗韵》海报', desc: '观察与表现课程 · 组队比赛' },
        { src: 'images/gallery/poster_hucheng_1.jpg', title: '《湖城烟雨》海报', desc: '综合创作课程 · 与焦星宇合作' },
        { src: 'images/gallery/poster_qiehuang.jpg', title: '《茄香味俱全》海报', desc: '视听语言课程结课' },
        { src: 'assets/images/gen_ai_yangyangtang_1.jpg', title: '《盐阳叹》视觉延展海报', desc: 'AI 视觉延展（练习）· 东方水墨流体主视觉，非原画/实拍' },
        { src: 'assets/images/gen_ai_dasheng_1.jpg', title: '《灾厄战线》概念横幅', desc: 'AI 视觉延展（练习）· 16:9 宽银幕概念，非原画/实拍' },
        { src: 'assets/images/gen_ai_yegou_1.jpg', title: '《野生狗奶》视觉延展海报', desc: 'AI 视觉延展（练习）· 废墟群像喜剧，非原画/实拍' },
        { src: 'assets/images/gen_film_silu_1_v2.jpg', title: '《丝路新篇》视觉延展海报', desc: 'AI 视觉延展（练习）· 跨时空三段切片，非原画/实拍' },
      ]
    },
    {
      slug: 'board',
      group: '展板设计', en: 'EXHIBITION BOARDS', portrait: true,
      intro: '《铁火生花》《一绣成祥》等竞赛汇报展板与课程综合展示版式。',
      items: [
        { src: 'images/gallery/board_ironfire.jpg', title: '《铁火生花》展板', desc: '非遗打铁花数字交互装置 · 数媒竞赛' },
        { src: 'images/gallery/board_yixiu.jpg', title: '《一绣成祥》展板', desc: '壮锦绣球非遗数字交互 · 米兰设计周' },
        { src: 'images/gallery/board_enshi.jpg', title: '恩施文旅展板', desc: '文旅融合创新计时赛' },
        { src: 'images/gallery/board_wusheng.jpg', title: '《无声暗涌》展板', desc: '情绪物质化动态影像 · Ae 结课' },
        { src: 'images/gallery/board_guhuai.jpg', title: '《孤怀楚殇》前期内容展板', desc: '屈原文化数字创作 · 综合创作5（第十组）' },
        { src: 'images/gallery/board_qiehuang.jpg', title: '《茄香味俱全》展板', desc: '视听语言课程结课' }
      ]
    },
    {
      slug: 'merch',
      group: '文创衍生品', en: 'CULTURAL & CREATIVE PRODUCTS', portrait: false,
      intro: '《青铜遗韵》系列文创的折扇、徽章、纸袋、抱枕与线下物料延展（默认展示精选 8 件，可展开全部）。',
      items: [
        { src: 'images/gallery/fan_1.jpg', title: '折扇 · 设计一', desc: '《青铜遗韵》文创 · 折扇：青铜云雷纹与兽面纹转译到扇面，国风便携衍生' },
        { src: 'images/gallery/badge_1.jpg', title: '金属徽章 · 款式一', desc: '《青铜遗韵》文创 · 金属徽章：青绿色青铜器造型珐琅徽章' },
        { src: 'images/gallery/bag_1.jpg', title: '手提纸袋 · 设计一', desc: '《青铜遗韵》文创 · 手提纸袋：主视觉款，包装延展设计' },
        { src: 'images/gallery/coaster.jpg', title: '杯垫', desc: '《青铜遗韵》文创 · 杯垫：青铜器纹样圆形排版，日常器物衍生' },
        { src: 'images/gallery/pillow.jpg', title: '抱枕', desc: '《青铜遗韵》文创 · 抱枕：青铜纹样满版印花的家居衍生' },
        { src: 'images/gallery/wall_ad_1.jpg', title: '挂墙广告 · 一', desc: '《青铜遗韵》文创 · 挂墙广告：线下展示物料，主视觉延展' },
        { src: 'images/gallery/fan_2.jpg', title: '折扇 · 设计二', desc: '《青铜遗韵》文创 · 折扇：线描青铜纹样版本，素雅黑白' },
        { src: 'images/gallery/fan_3.jpg', title: '折扇 · 设计三', desc: '《青铜遗韵》文创 · 折扇：青绿山水与青铜器组合的彩绘版本' },
        { src: 'images/gallery/badge_2.jpg', title: '金属徽章 · 款式二', desc: '《青铜遗韵》文创 · 金属徽章：鼎器纹样款' },
        { src: 'images/gallery/badge_3.jpg', title: '金属徽章 · 款式三', desc: '《青铜遗韵》文创 · 金属徽章：线描纹样款' },
        { src: 'images/gallery/bag_2.jpg', title: '手提纸袋 · 设计二', desc: '《青铜遗韵》文创 · 手提纸袋：线描款包装' },
        { src: 'images/gallery/bag_3.jpg', title: '手提纸袋 · 设计三', desc: '《青铜遗韵》文创 · 手提纸袋：青绿款包装' },
        { src: 'images/gallery/keychain_1.jpg', title: '钥匙扣 · 款式一', desc: '《青铜遗韵》文创 · 钥匙扣：青铜器造型金属挂件' },
        { src: 'images/gallery/keychain_2.jpg', title: '钥匙扣 · 款式二', desc: '《青铜遗韵》文创 · 钥匙扣：瑞兽纹样款' },
        { src: 'images/gallery/keychain_3.jpg', title: '钥匙扣 · 款式三', desc: '《青铜遗韵》文创 · 钥匙扣：青绿彩绘款' },
        { src: 'images/gallery/mousepad_1.jpg', title: '鼠标垫 · 一', desc: '《青铜遗韵》文创 · 鼠标垫：青铜纹样桌面衍生' },
        { src: 'images/gallery/mousepad_2.jpg', title: '鼠标垫 · 二', desc: '《青铜遗韵》文创 · 鼠标垫：线描纹样款' },
        { src: 'images/gallery/mousepad_3.jpg', title: '鼠标垫 · 三', desc: '《青铜遗韵》文创 · 鼠标垫：彩绘款' },
        { src: 'images/gallery/wall_ad_2.jpg', title: '挂墙广告 · 二', desc: '《青铜遗韵》文创 · 挂墙广告：空间展示效果' }
      ]
    },
    {
      slug: 'yumeng',
      group: '工作室 IP · 商业视觉', en: 'STUDIO IP & COMMERCIAL', portrait: false,
      intro: '「宇梦造物」工作室品牌 VI、IP 吉祥物与《锦息》产品概念短片的视觉提案（AI 视觉 + 版式设计 · 工作室自研提案）。',
      items: [
        { src: 'assets/images/yumeng_vi_identity.jpg', title: '《宇梦造物》工作室 VI 视觉', desc: '工作室品牌基础系统：标志、名片、文件夹、色卡与印刷物料视觉' },
        { src: 'assets/images/yumeng_ip_mascot.jpg', title: '《宇梦造物》IP 吉祥物 · 星礼', desc: '3D 角色 IP：暗色礼官造型 + 全息头部，工作室人格化形象' },
        { src: 'assets/images/jinxi_keyframe_01_drop.jpg', title: '《锦息》产品概念短片 · 关键帧一', desc: '金色香液滴入水面、东方纹样随涟漪展开的产品概念镜头' },
        { src: 'assets/images/jinxi_keyframe_02_bottle.jpg', title: '《锦息》产品概念短片 · 关键帧二', desc: '产品与光雾氛围的概念镜头，商业向产品视觉提案' }
      ]
    }
  ];

  /* ==================== 数据（伍 · 创作过程 / 工作流） ==================== */
  var PROCESS_STEPS = [
    { num: '01', name: '概念与叙事', desc: '以文化主题组织世界观、视觉方向与创作立意' },
    { num: '02', name: '分镜与定妆', desc: '将叙事拆为镜头与角色三视图，锚定画风一致性' },
    { num: '03', name: 'AIGC 生成', desc: '即梦 / MJ 提示词迭代产出高精画面与动态镜头' },
    { num: '04', name: '实时交互', desc: '交互作品通过 TD / Processing 建立输入与视觉反馈' },
    { num: '05', name: '剪辑与脚本', desc: '完成剪辑合成与 ffmpeg 脚本批处理，延展海报与展板' }
  ];

  /* 创作过程图片组（按项目聚类加前缀，AI 强相关分组置顶） */
  var PROCESS_GALLERY = [
    {
      slug: 'concept',
      group: '绣藏 · 概念与分镜', en: 'XIUZANG CONCEPT & STORYBOARD', portrait: false,
      intro: '《绣藏》概念设计、PV 分镜原画与即梦 / MJ 场景探索，展示从概念定调到镜头构图的推演。',
      items: [
        { src: 'images/process/concept_xiuzang_1.jpg', title: '《绣藏》概念设计 · 第一页', desc: 'AI 漫剧参赛作品的概念设计文档（世界观 / 角色 / 视觉基调）' },
        { src: 'images/process/concept_xiuzang_2.jpg', title: '《绣藏》概念设计 · 第二页', desc: 'AI 漫剧参赛作品的概念设计文档（场景 / 镜头 / 风格参考）' },
        { src: 'images/process/xiuzang_frame_beast_1.jpg', title: '《绣藏》分镜原画 · 神兽一', desc: 'PV 分镜原画 · 神兽角色与镜头构图' },
        { src: 'images/process/xiuzang_frame_catastrophe_1.jpg', title: '《绣藏》分镜原画 · 灾厄战线一', desc: 'PV 分镜原画 · 灾厄战线场面与动作设计' },
        { src: 'images/process/ai_gen_1.jpg', title: '即梦生成 · 4K 主视觉', desc: '即梦文生图产出的 4K 主视觉画面（2026.09）' },
        { src: 'images/process/ai_gen_2.jpg', title: 'MJ 生成 · 场景概念', desc: 'MJ 文生图产出的场景概念画面（2026.09）' },
        { src: 'images/process/ai_gen_3.jpg', title: 'AI 生成 · 分镜参考 一', desc: '即梦 / MJ 生成的分镜参考画面 · 之一' },
        { src: 'images/process/ai_gen_4.jpg', title: 'AI 生成 · 分镜参考 二', desc: '即梦 / MJ 生成的分镜参考画面 · 之二' },
        { src: 'images/process/xiuzang_frame_beast_2.jpg', title: '《绣藏》分镜原画 · 神兽二', desc: 'PV 分镜原画 · 神兽角色与镜头构图' },
        { src: 'images/process/xiuzang_frame_beast_3.jpg', title: '《绣藏》分镜原画 · 神兽三', desc: 'PV 分镜原画 · 神兽角色与镜头构图' },
        { src: 'images/process/xiuzang_frame_catastrophe_2.jpg', title: '《绣藏》分镜原画 · 灾厄战线二', desc: 'PV 分镜原画 · 灾厄战线场面与动作设计' },
        { src: 'images/process/xiuzang_frame_catastrophe_3.jpg', title: '《绣藏》分镜原画 · 灾厄战线三', desc: 'PV 分镜原画 · 灾厄战线场面与动作设计' },
        { src: 'images/process/concept_card.jpg', title: '《铁火生花》片头设计概念卡', desc: '《铁火生花》片头概念卡：定世界观与视觉基调，八层羽化色块 + 精确居中的排版' }
      ]
    },
    {
      slug: 'charsheet',
      group: 'AI · 角色三视图', en: 'CHARACTER CONSISTENCY', portrait: true,
      intro: 'AI 漫剧前期定妆与换装测试：通过面部特写 + 正侧背三视图锚定同一角色，控制多镜头一致性。',
      items: [
        { src: 'images/process/charsheet_girl_1.jpg', title: '少女角色三视图 · 无头正面版', desc: 'AI 短剧角色定妆：左侧面部特写 + 正面无头身体 / 侧背全身，保证角色一致性' },
        { src: 'images/process/charsheet_girl_2.jpg', title: '少女角色三视图 · 经典版', desc: '同一角色的面部特写 + 正 / 侧 / 背三视图（同一张脸、同一服装）' },
        { src: 'images/process/charsheet_boy_1.jpg', title: '男性角色定妆三视图', desc: '写实国漫风角色定妆：服装与比例三视图，用于短剧分镜前的角色锚定' },
        { src: 'images/process/charsheet_boy_2.jpg', title: '男性角色换装三视图', desc: '「图一人物 + 图二服装」换装提示词测试：保持人物不变、仅替换服装' }
      ]
    },
    {
      slug: 'prompt',
      group: '即梦 · 提示词记录', en: 'PROMPTS & GENERATION LOG', portrait: false,
      intro: '提示词与产出画面一一对应的迭代记录，聚焦机位、光影氛围与空间构图控制。',
      items: [
        { src: 'images/process/prompt_1.jpg', title: '即梦生成记录 · 提示词（一）', desc: '提示词 ↔ 产出画面一一对应：镜头空间、摄影机位置、光影设定' },
        { src: 'images/process/prompt_2.jpg', title: '即梦生成记录 · 提示词（二）', desc: '提示词 ↔ 产出画面一一对应：继续迭代的场景与角色镜头' }
      ]
    },
    {
      slug: 'storyboard',
      group: '铁火生花 · 分镜脚本', en: 'IRON FIRE STORYBOARD', portrait: false,
      intro: '《铁火生花》V1 定稿分镜：逐镜拆解景别、运镜、时长与音效节点。',
      items: [
        { src: 'images/process/storyboard_1.jpg', title: '《铁火生花》分镜脚本 · 第一页', desc: '核心创意、时长规划、概念与立意、镜头表格（V1 定稿）' },
        { src: 'images/process/storyboard_2.jpg', title: '《铁火生花》分镜脚本 · 第二页', desc: '分镜画面与镜号表格：景别 / 运镜 / 时长 / 音效' },
        { src: 'images/process/storyboard_3.jpg', title: '《铁火生花》分镜脚本 · 第三页', desc: '逐镜拆解与执行标注' },
        { src: 'images/process/storyboard_4.jpg', title: '《铁火生花》分镜脚本 · 第四页', desc: '末段镜头与场次收束' }
      ]
    },
    {
      slug: 'td',
      group: 'TD · 交互节点界面', en: 'TOUCHDESIGNER WORKFLOW', portrait: false,
      intro: 'TouchDesigner 实时粒子、Feedback 反馈合成与流体交互的工程节点实拍。',
      items: [
        { src: 'images/process/td_1.jpg', title: 'TD 节点网络 · 粒子系统', desc: 'TouchDesigner 实时粒子节点网络（工程界面实拍）' },
        { src: 'images/process/td_2.jpg', title: 'TD 节点网络 · 反馈与合成', desc: 'Feedback / Composite 节点链路搭建过程' },
        { src: 'images/process/td_3.jpg', title: 'TD 节点网络 · 图案生成', desc: '图案生成与色彩映射节点网络' },
        { src: 'images/process/td_4.jpg', title: 'TD 节点网络 · 流体交互', desc: '流体交互效果节点网络与实时预览' }
      ]
    },
    {
      slug: 'fanart',
      group: '二创练习 · 非商用海报', en: 'FAN-ART POSTERS (PRACTICE)', portrait: false,
      intro: 'AI 群像构图与电影感压字排版的个人二创练习，仅作学习展示，非商用。',
      items: [
        { src: 'images/process/ultra_poster_1.jpg', title: '《GALAXY GUARDIANS》二创海报', desc: 'AI 二创练习 · 非商用：战队式群像海报，字体与人物层次排版' },
        { src: 'images/process/ultra_poster_2.jpg', title: '《ULTRAAX》二创海报', desc: 'AI 二创练习 · 非商用：大标题压字与英雄群像构图' },
        { src: 'images/process/ultra_poster_3.jpg', title: '《NOVA FORCE》二创海报', desc: 'AI 二创练习 · 非商用：竖版电影海报，冷色调与光效设计' },
        { src: 'images/process/ultra_poster_4.jpg', title: '《GALAXY GUARDIANS》二创海报 · 二', desc: 'AI 二创练习 · 非商用：另一版群像构图与色彩方案' }
      ]
    },
    {
      slug: 'overview',
      group: '通用 · 工作流总览', en: 'WORKFLOW OVERVIEW', portrait: false,
      intro: '横向对照《铁火生花》《绣藏》《山歌回音壁》三个项目的制作路径与关键产出物。',
      items: [
        { src: 'assets/images/workflow-overview.svg', title: '创作路径 · 三个项目的制作展开', desc: '《铁火生花》《绣藏》《山歌回音壁》各自的制作路径与对应材料；不同作品按主题选择制作方式。' }
      ]
    }
  ];

  /* 创作过程：文案摘录 */
  var PROCESS_QUOTES = [
    {
      title: '创作灵感 · 创意来源',
      src: '《铁火生花》创作阐述',
      text: '第一次看打铁花，是屏幕上一段影像：1600℃ 的铁水被木棒击向夜空，半秒里炸成漫天星雨……铁是硬的、滚烫的、会冷却的；花是柔的、静的、会再开的。我们想把这个矛盾收进一个词，于是有了《铁火生花》——不写铁花如何熄灭，而写它如何生花。',
      foot: '技术上以 TouchDesigner 实时生成为核心：火花、锤打、涟漪、莲火四种视觉元素被转译为 GPU 粒子与图像粒子；观众的手势与位置实时驱动画面——靠近，星火聚拢；挥手，铁花迸发；伸手，莲在掌中绽开。'
    },
    {
      title: '技术展示 · 工程化选片说明',
      src: '《铁火生花》成片自动化说明',
      text: '技术展示段由 4 条录屏各出一条：选片不是凭感觉——把候选片段的平均 R/G/B、亮度、边缘能量算成特征向量，再按「最大最小距离」挑一组彼此差最远的，保证四个画面真的不同。',
      foot: '入点同样量化：先做逐秒亮度 / 细节曲线，再取每条曲线里效果最饱满、且不跨越录屏内部跳变点的 6 秒；源 2496×1440 只裁底部 36px 成 16:9，Lanczos 缩放到 1080p，单次 h264_nvenc 编码。'
    },
    {
      title: '剪辑文案 · 叙事拆解',
      src: '东方美学视觉剪辑笔记',
      text: '全片 100% 是 CG / 数字粒子特效，叙事弧线非常清楚：火 → 打铁花 → 金莲 → 落水。天然的「淬炼—碎裂—重生/开花」三段式隐喻，文案不是「提炼」而是「赋予」。',
      foot: '发布文案方向（东方美学 · 治愈向）：「一束火落下来，是开端。被击碎的那一刻，万点金光散成星辰。而后它们沉进水面，开成了莲。」'
    }
  ];

  /* 创作过程：文档（PDF 新窗口打开） */
  var PROCESS_DOCS = [
    {
      href: fileUrl('docs/ironfire_storyboard.pdf'), meta: '分镜 · 0.5 MB', tag: '分镜脚本',
      title: '《铁火生花》分镜脚本 V1',
      desc: '打铁花非遗数字装置成片的分镜脚本：镜头、时间码与画面说明逐镜编排。',
      foot: 'DOCX 原件 · 2026.10.07'
    },
    {
      href: fileUrl('docs/ironfire_ai_tools.pdf'), meta: '参赛附件', tag: 'AI 工具说明',
      title: '人工智能工具使用情况说明',
      desc: '参赛提交材料：全流程各环节所用 AI 工具、用途与使用方式说明。',
      foot: '第十四届全国大学生数媒竞赛 · 参赛附件'
    }
  ];

  /* ==================== 数据（陆 · 文字与策划） ==================== */
  var WRITING_DOCS = [
    {
      href: fileUrl('docs/daozang_worldbuilding.pdf'), meta: '191 页 · 2.0 MB', tag: '世界观设定',
      title: '《道藏三千：非遗证道录》完整设定集',
      desc: '《绣藏》世界观完整设定：非遗证道宇宙的体系、角色与力量逻辑。',
      foot: '《绣藏》AI 漫剧 · 世界观文档'
    },
    {
      href: 'https://chenjinyu-portfolio.oss-cn-shanghai.aliyuncs.com/docs/xiuzang_pv_storyboard.pdf', meta: '分镜原稿 · 71 MB', tag: '分镜脚本',
      title: '《绣藏》PV 分镜',
      desc: 'AI 漫剧 PV 的镜头级分镜：画面、运镜与节奏设计。',
      foot: '《绣藏》AI 漫剧 · 分镜'
    },
    {
      href: fileUrl('docs/xiuzang_script.pdf'), meta: '剧本 · 0.4 MB', tag: '剧本',
      title: '《绣藏》剧本',
      desc: '非遗题材 AI 漫剧完整剧本。',
      foot: '《绣藏》AI 漫剧 · 剧本'
    },
    {
      href: fileUrl('docs/ironfire_storyboard.pdf'), meta: '分镜 · 0.5 MB', tag: '分镜脚本',
      title: '《铁火生花》分镜脚本 V1',
      desc: '打铁花非遗数字装置成片分镜（与创作过程板块同源）。',
      foot: '数媒竞赛参赛 · 附件分镜'
    },
    {
      href: fileUrl('docs/qiehuang_script.pdf'), meta: '剧本 · 0.2 MB', tag: '剧本',
      title: '《茄皇》剧本',
      desc: '泡面品牌创意短片剧本：线性叙事与暖调视听语言设计。',
      foot: '大二 · 视听语言课程结课'
    },
    {
      href: fileUrl('docs/zaoba_script.pdf'), meta: '剧本 · 0.2 MB', tag: '剧本',
      title: '《这个早八不太好上》剧本',
      desc: '校园题材短片剧本。',
      foot: '大二 · 视听语言课程'
    },
    {
      href: fileUrl('docs/douyin_operations_report.pdf'), meta: '运营报告 · 0.3 MB', tag: '运营方案',
      title: '新媒体账号运营报告',
      desc: '抖音账号运营实践与复盘报告：定位、内容、数据与迭代。',
      foot: '大二 · 融媒体课程 · 小组合作'
    },
    {
      href: fileUrl('docs/shiyun_business_plan.pdf'), meta: '商业计划 · 0.5 MB', tag: '商业计划书',
      title: '《食韵中华》商业计划书',
      desc: '互联网+ 高教主赛道参赛商业计划书：项目定位、模式与运营规划。',
      foot: '大二（上）· 综合创作课程'
    },
    {
      href: fileUrl('docs/dunhuang_project_plan.pdf'), meta: '项目章程 · 0.3 MB', tag: '项目管理',
      title: '项目管理章程与传播方案',
      desc: '《文化挪用视角下的敦煌文化数字媒体艺术研究》项目管理章程与传播方案。',
      foot: '大四专题 · 第三组（陈锦育等）'
    },
    {
      href: fileUrl('docs/yumeng_studio_ip_plan.pptx'), meta: '提案 · 8.5 MB', tag: '品牌提案',
      title: '《宇梦造物》工作室 IP 全案提案',
      desc: '工作室品牌定位、VI 基础系统、IP 吉祥物与商业短片视觉方向的全案提案（PPTX）。',
      foot: '工作室项目 · 自研提案'
    },
    {
      href: fileUrl('docs/yumeng_jinxi_storyboard.md'), meta: '分镜 · 文本', tag: '分镜与提示词',
      title: '《锦息》分镜与提示词',
      desc: '产品概念短片的分镜规划、镜头描述与 AI 生成提示词记录。',
      foot: '商业向 AI 概念短片 · 分镜文档'
    }
  ];

  /* ==================== 数据（柒 · 技术代码） ==================== */
  var CODES = [
    {
      file: 'docs/code/build_v18.ps1', lang: 'PowerShell / ffmpeg',
      name: 'build_v18.ps1',
      title: '《铁火生花》成片自动化构建脚本',
      desc: 'ffmpeg 工程化脚本：分段剪接、滤镜图、字幕卡叠加与单次硬件编码，一键产出 2′44″ 成片。'
    },
    {
      file: 'docs/code/gen_cards.ps1', lang: 'PowerShell',
      name: 'gen_cards.ps1',
      title: '概念卡 / 字幕卡批量生成脚本',
      desc: '自动化批量制卡脚本：统一全片字卡排版与配色规范，显著提升视频后期出片效率。'
    },
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
    }
  ];

  /* TD 工程清单（.toe 过大不拷贝，仅文本说明） */
  var TD_PROJECTS = [
    {
      title: '《铁火生花》触碰交互工程（参赛源文件）',
      path: '参赛提交包 · TD 工程文件（.toe 源文件）',
      note: '.toe 工程体积较大未直接托管；如需源文件请联系本人。',
      groups: [
        { name: '图像粒子跟随鼠标交互', items: ['主工程文件', '版本迭代文件'] },
        { name: '图片转湍流粒子效果', items: ['主工程文件', '版本迭代文件'] },
        { name: '沉浸式互动空间', items: ['主工程文件', '版本迭代文件'] },
        { name: '粒子拉线交互', items: ['主工程文件', '版本迭代文件'] }
      ]
    },
    {
      title: '沉浸式交互空间 · 课程练习工程',
      path: '大三（下）· 数字媒体技术4 · 课程作业',
      note: 'TouchDesigner 交互空间练习工程，按需提供源文件。',
      groups: []
    }
  ];

  /* ==================== 数据（hero 精选作品快捷入口：2 AI + 1 获奖交互） ==================== */
  var FEATURED = [
    {
      href: '#work-ai_xiuzhang',
      title: '《绣藏》',
      sub: 'AI 漫剧 · 全流程管线',
      award: '西湖新风 AI 漫剧大赛 · 含设定集与分镜拆解'
    },
    {
      href: '#work-ai_yangyangtang',
      title: '《盐阳叹》',
      sub: 'AI 影像诗 · 东方流体视觉',
      award: '中国好创意大赛 · 应用组国家级二等奖'
    },
    {
      href: '#work-itd_shange',
      title: '《山歌回音壁》',
      sub: '声光互动装置',
      award: '中国好创意大赛 · 学术组国家级二等奖'
    }
  ];

  /* 项目说明只关联已能确认归属的材料；通用生成练习保留在过程区。 */
  var PROJECT_NOTES = {
    ai_xiuzhang: {
      focus: '世界观设定 / 角色与分镜管线 / AI 漫剧全流程',
      idea: '从 191 页《道藏三千：非遗证道录》世界观出发，将道家符箓与非遗纹样转译为可落地生产的 AI 漫剧角色、场景与 PV 镜头叙事。',
      steps: [
        { title: '世界观与剧本', text: '先搭建完整非遗证道体系与角色设定，再输出完整剧本文本，确保长线叙事逻辑自洽。' },
        { title: '概念与 PV 分镜', text: '完成两版概念设计定调视觉基调，逐镜绘制神兽与灾厄战线 PV 分镜原画，锚定构图与运镜。' },
        { title: 'AI 生成与成片交付', text: '结合即梦等 AIGC 工具完成画面与动态生成，配合后期剪辑与主视觉海报延展，团队协作完成西湖新风 AI 漫剧创作大赛提交。' }
      ],
      images: [
        'images/process/concept_xiuzang_1.jpg',
        'images/process/concept_xiuzang_2.jpg',
        'images/process/xiuzang_frame_beast_1.jpg',
        'images/process/xiuzang_frame_catastrophe_1.jpg',
        'images/gallery/poster_xiuzang_2.jpg',
        'images/gallery/poster_xiuzang_3.jpg'
      ],
      docs: [
        { href: fileUrl('docs/daozang_worldbuilding.pdf'), label: '完整世界观设定（191 页）', kind: 'PDF' },
        { href: fileUrl('docs/xiuzang_script.pdf'), label: '完整剧本', kind: 'PDF' },
        { href: 'https://chenjinyu-portfolio.oss-cn-shanghai.aliyuncs.com/docs/xiuzang_pv_storyboard.pdf', label: 'PV 分镜原稿', kind: 'PDF' }
      ]
    },
    ai_yangyangtang: {
      focus: 'AI 影像诗 / 东方美学视觉转译 / 国家级二等奖',
      idea: '围绕「盐阳」东方古意展开非写实 AI 影像探索，用金色流线、蓝雾与星屑的聚散构建诗意情绪流动。海报为 AI 视觉延展（练习），非原画/实拍。',
      steps: [
        { title: '东方意象提炼', text: '将传统水墨留白与抽象流体光影结合，避免常见 AI 画面的堆砌感，建立高辨识度色调。' },
        { title: '动态质感与连贯控制', text: '通过多轮提示词约束光影方向与粒子密度，保证镜头切换时流体形态自然过渡。' },
        { title: '音画剪辑与获奖成果', text: '配合配乐呼吸感完成节奏剪辑与调色，获中国好创意大赛应用组国家级二等奖。' }
      ],
      images: [
        'assets/images/gen_ai_yangyangtang_1.jpg'
      ],
      docs: []
    },
    ai_cannes: {
      focus: '电影感 AI 剧情短片 / 角色情绪叙事 / 系列主视觉',
      idea: '聚焦创作者与时间的关系，用写实电影光影表现设计师伏案与回忆交织的细腻情绪。',
      steps: [
        { title: '情绪剧本与镜头设计', text: '以驾车、夜灯、伏案绘图等生活化场景串联回忆线，强调电影景深与低饱和氛围。' },
        { title: '真实感角色与场景生成', text: '迭代人物神态与环境光影，兼顾主角色与白发回忆角色在不同景别下的一致性。' },
        { title: '成片剪辑与海报延展', text: '完成短片剪辑调色，并同步输出主海报、人物海报与场景海报三联视觉方案。' }
      ],
      images: [
        'images/gallery/poster_bear_2.jpg',
        'images/gallery/poster_bear_3.jpg',
        'images/gallery/poster_bear_5.jpg'
      ],
      docs: []
    },
    itd_ironfire: {
      focus: '非遗视觉转译 / 实时粒子 / ffmpeg 成片自动化',
      idea: '将打铁花的火光、迸发与绽放转译为数字粒子，以交互视觉延续这一非遗主题的观看体验，并用脚本实现成片工程化构建。',
      steps: [
        { title: '概念与镜头', text: '概念卡确定黑金视觉基调，分镜脚本编排镜头、时长与声音。' },
        { title: '交互与视觉', text: '使用 TouchDesigner 制作粒子视觉，工程清单包含图像粒子跟随、湍流与沉浸式空间。' },
        { title: '成片自动化工具', text: '编写 PowerShell + ffmpeg 构建脚本与批量字卡脚本，自动完成分段剪接、字卡叠加与硬件编码。' }
      ],
      images: ['images/process/concept_card.jpg', 'images/process/storyboard_1.jpg', 'images/gallery/board_ironfire.jpg'],
      docs: [
        { href: fileUrl('docs/ironfire_storyboard.pdf'), label: '分镜脚本', kind: 'PDF' },
        { href: fileUrl('docs/ironfire_ai_tools.pdf'), label: 'AI 工具使用说明', kind: 'PDF' },
        { href: fileUrl('docs/code/build_v18.ps1'), label: '成片构建脚本', kind: '源码', download: true },
        { href: fileUrl('docs/code/gen_cards.ps1'), label: '批量字卡脚本', kind: '源码', download: true }
      ]
    },
    itd_yixiu: {
      focus: '非遗纹样 / 手势识别 / 粒子视觉',
      idea: '以壮锦与绣球为主题，将蛙纹、花卉、祥云组织为可汇聚、解构与重组的粒子视觉。',
      steps: [
        { title: '文化元素', text: '围绕壮锦、绣球与传统纹样建立视觉主题，保留图案的识别特征。' },
        { title: '交互表达', text: '通过 TouchDesigner 与手势识别，将观众动作与纹样变化连接起来。' },
        { title: '成果呈现', text: '以作品视频与竞赛展板呈现方案，获米兰设计周国家级三等奖。' }
      ],
      images: ['images/gallery/board_yixiu.jpg'],
      docs: []
    },
    itd_shange: {
      focus: 'Processing / 音画互动 / 声光表达',
      idea: '以声音与视觉的实时关联为创作方向，将「山歌」延展为空间中的声光回应。',
      steps: [
        { title: '主题', text: '围绕山歌与回响构思声音、灯光和视觉之间的关系。' },
        { title: '实现', text: '以 Processing 音画互动为技术基础，相关核心源码可供阅读。' },
        { title: '成果', text: '获中国好创意大赛学术组国家级二等奖。' }
      ],
      images: [],
      docs: [{ href: fileUrl('docs/code/audio_visual_interaction.pde'), label: '音画互动核心源码', kind: '源码', download: true }]
    },
    ai_dasheng: {
      focus: '暗黑科幻概念片 / 废墟战场大场面 / 即梦动态探索',
      idea: '围绕「灾厄降临」世界观，探索女性战士与巨兽对峙的高反差暗黑科幻视觉与大场面镜头张力。横幅海报为 AI 视觉延展（练习），非原画/实拍。',
      steps: [
        { title: '世界观与氛围定调', text: '确立低饱和废墟质感与巨物压迫感，统一光影方向、烟尘层次与角色装备细节。' },
        { title: '关键镜头与动态生成', text: '借助即梦等工具迭代关键帧与图生视频，控制人物动作幅度与巨兽压迫镜头的稳定性。' },
        { title: '节奏剪辑与音效强化', text: '团队协作完成短片剪辑、色调统一与氛围音效合成，形成高冲击力的概念预告短片。' }
      ],
      images: [
        'assets/images/dasheng_cover_1.jpg',
        'assets/images/dasheng_cover_2.jpg',
        'assets/images/gen_ai_dasheng_1.jpg'
      ],
      docs: []
    },
    ai_doubao: {
      focus: 'AI 数字人口播 / 废土科幻场景 / 角色叙事融合',
      idea: '把数字人口播与橙色沙海、巨型光柱的废土科幻场景结合，用日常对话反衬荒芜世界的陌生感。',
      steps: [
        { title: '角色与对话设计', text: '设定两位角色的口播互动节奏与性格反差，让废土背景下的对话保持轻松与记忆点。' },
        { title: '数字人与场景协同', text: '结合即梦与 AI 数字人工具生成角色口型与异星场景，兼顾人物表现力与画面氛围统一。' },
        { title: '后期合成与成片输出', text: '团队协作完成剪辑衔接、字幕排版与整体调色，输出完整 AI 数字人剧情短片。' }
      ],
      images: [],
      docs: []
    },
    ai_yegou: {
      focus: '150 秒剧本改编 / 多角色动作喜剧 / 快节奏剪辑',
      idea: '基于 150 秒喜剧剧本，在废墟场景中围绕「野生狗奶」展开五人争夺，用古装角色与现代包装制造穿越反差笑点。海报为 AI 视觉延展（练习），非原画/实拍。',
      steps: [
        { title: '剧本拆解与分镜节奏', text: '将 150 秒剧本拆解为紧凑的冲突段落，规划五位角色的出场顺序与喜剧包袱节点。' },
        { title: '多角色生成与反差控制', text: '通过即梦等工具生成古装人物与现代包装的混搭画面，保持多角色同场时的视觉辨识度。' },
        { title: '动作剪辑与配音合成', text: '团队协作完成快节奏卡点剪辑与配音音效配合，强化动作喜剧的观看流畅度。' }
      ],
      images: [
        'assets/images/gen_ai_yegou_1.jpg'
      ],
      docs: []
    },
    itd_honghua: {
      focus: 'TouchDesigner 互动地图 / 恩施文旅计时赛 / 国家级三等奖',
      idea: '围绕恩施红花峰林景区十六个核心景点，构建可交互游览的数字文旅地图，并结合《红仓》《江仓》文旅 IP 延展视觉体验。',
      steps: [
        { title: '文旅调研与景点梳理', text: '提炼红花峰林与清江地域文化符号，将十六处景点组织为清晰的空间游览动线。' },
        { title: 'TD 互动地图实现', text: '在计时赛周期内使用 TouchDesigner 完成地图交互逻辑与视觉反馈，兼顾导览清晰度与趣味性。' },
        { title: '展板呈现与获奖成果', text: '配合恩施文旅展板与角色 IP 视觉完成汇报展示，获中国好创意大赛国家级三等奖。' }
      ],
      images: [
        'images/gallery/board_enshi.jpg',
        'images/gallery/board_hongcang_v2.jpg',
        'images/gallery/ip_jiangcang_v2.jpg'
      ],
      docs: []
    },
    itd_xinmai: {
      focus: '心率传感 + MediaPipe / 情绪可视化 / 实时流体粒子',
      idea: '将不可见的生理心率与面部微表情转译为实时流动的花影粒子，让观众的情绪波动在空间中具象可见。',
      steps: [
        { title: '多模态数据采集', text: '接入心率传感器与 MediaPipe 面部微表情识别，提取可驱动视觉变化的实时情绪参数。' },
        { title: '流体粒子视觉映射', text: '在 TouchDesigner 中建立参数到粒子形态、流速与色彩的映射关系，呈现「心脉生花」的视觉隐喻。' },
        { title: '小组协同与联调展示', text: '作为第九组组长统筹方案与实时联调，完成交互装置设计课程的现场体验演示。' }
      ],
      images: [
        'assets/images/xinmai_board_1.jpg',
        'assets/images/xinmai_board_2.jpg',
        'assets/images/xinmai_board_3.jpg'
      ],
      docs: [
        { href: fileUrl('docs/xinmai_design.pdf'), label: '多感官情绪互动装置设计', kind: 'PDF' },
        { href: fileUrl('docs/xinmai_tech.pdf'), label: '交互装置技术方案', kind: 'PDF' },
        { href: fileUrl('docs/xinmai_aesthetic.pdf'), label: '交互美学与情感共生方案', kind: 'PDF' }
      ]
    },
    film_wusheng: {
      focus: 'After Effects 动态视觉 / 情绪物质化 / 实验影像',
      idea: '把难以宣泄的压抑情绪转译为粘稠液体、机械与生物组织碰撞及闪烁噪点，建立克制而具压迫感的实验视觉系统。',
      steps: [
        { title: '情绪意象转译', text: '从材质质感与运动阻尼出发，确立暗调实验影像的视觉母题与节奏推进。' },
        { title: 'AE 动态图形合成', text: '独立完成 After Effects 材质合成、噪点闪烁与镜头转场，突出声音与画面的张力。' },
        { title: '成片与展板收束', text: '同步输出动态成片与结课展示展板，完整呈现实验影像的视觉概念。' }
      ],
      images: ['images/gallery/board_wusheng.jpg'],
      docs: []
    },
    film_silu: {
      focus: 'AI 生成 × 实拍混剪 / 丝绸之路主题 / 跨时空叙事',
      idea: '结合 AI 生成画面与实拍素材，串联沙漠公路、森林、雪地、戈壁与城市高架，跨越古今呈现丝绸之路的延续与变迁。海报为 AI 视觉延展（练习），非原画/实拍。',
      steps: [
        { title: '主题结构与场景串联', text: '按地理与时间双线索组织地貌切换，建立从古丝路到现代交通的视觉呼应。' },
        { title: 'AI 与实拍风格融合', text: '统一 AI 生成镜头与实拍镜头的色彩影调与运动速度，减少跨媒介拼接割裂感。' },
        { title: '节奏剪辑与音乐合成', text: '独立完成全片剪辑合成与调色，作为影视创作课程结课作品呈现。' }
      ],
      images: [
        'assets/images/gen_film_silu_1_v2.jpg'
      ],
      docs: []
    },
    film_hucheng: {
      focus: '雨景实拍实验 / 水墨影调调色 / 城市与自然',
      idea: '刻意等待雨天前往东湖实地拍摄，以栈桥、荷叶与古亭在雨雾中的朦胧层次，探索城市空间与东方水墨意境的契合。',
      steps: [
        { title: '气候等待与实地采风', text: '选择雨雾天气进行实拍，捕捉水面涟漪、雨幕反光与建筑剪影的自然肌理。' },
        { title: '剪辑节奏与水墨调色', text: '与焦星宇合作完成镜头筛选、舒缓节奏剪辑与低饱和水墨风调色。' },
        { title: '影像与海报延展', text: '同步完成《湖城烟雨》主题海报设计，统一短片与平面视觉气质。' }
      ],
      images: ['images/gallery/poster_hucheng_1.jpg'],
      docs: []
    },
    film_qiehuang: {
      focus: '暖调创意短片 / 剧本到成片 / 海报与展板全套',
      idea: '以主角小吴从超市选购「茄皇」到宿舍煮食的日常线性叙事，借暖色调光影把对家的思念藏进一碗泡面里。',
      steps: [
        { title: '剧本与视听策划', text: '独立撰写《茄皇》短片剧本，规划超市到宿舍的场景过渡与情感升温节点。' },
        { title: '实拍与暖调剪辑', text: '突出食物热气、近景细节与暖色灯光，强化治愈日常的观看体验。' },
        { title: '平面物料完整延展', text: '同步产出结课海报与展示展板，并保留完整剧本文档可供查阅。' }
      ],
      images: [
        'images/gallery/poster_qiehuang.jpg',
        'images/gallery/board_qiehuang.jpg'
      ],
      docs: [
        { href: fileUrl('docs/qiehuang_script.pdf'), label: '《茄皇》完整剧本', kind: 'PDF' }
      ]
    },
    film_zaoba: {
      focus: '校园题材短片 / 暗调手持镜头 / 视听语言训练',
      idea: '以暗调光影与手持跟拍记录「早八」前后的宿舍深夜，把大学生起床的挣扎拍成一场充满张力的小型战役。',
      steps: [
        { title: '校园剧本创作', text: '围绕宿舍夜戏与清晨闹钟冲突撰写短片剧本，构建贴近真实生活的戏剧张力。' },
        { title: '暗调光影与手持拍摄', text: '运用明暗对比与贴身手持运镜放大紧迫感，强化视听语言的情绪调度。' },
        { title: '剪辑成片与剧本归档', text: '独立完成剪辑与声效设计，完整保留短片成片与原剧本 PDF。' }
      ],
      images: [],
      docs: [
        { href: fileUrl('docs/zaoba_script.pdf'), label: '《这个早八不太好上》剧本', kind: 'PDF' }
      ]
    }
  };

  /* ==================== 工具函数 ==================== */
  function byId(id) { return document.getElementById(id); }
  function findWorkIndex(id) {
    for (var i = 0; i < WORKS.length; i++) {
      if (WORKS[i].id === id) { return i; }
    }
    return -1;
  }
  function findWork(id) {
    var idx = findWorkIndex(id);
    return idx >= 0 ? WORKS[idx] : null;
  }

  /* ==================== 渲染：方向入口卡片 ==================== */
  function renderDirections() {
    var grid = byId('directionsGrid');
    if (!grid) { return; }
    var counts = {};
    WORKS.forEach(function (w) { counts[w.dir] = (counts[w.dir] || 0) + 1; });
    counts.gallery = GALLERY.reduce(function (n, g) { return n + g.items.length; }, 0);
    counts.process = PROCESS_GALLERY.reduce(function (n, g) { return n + g.items.length; }, 0);
    if (byId('aiCount')) { byId('aiCount').textContent = counts.ai || 0; }
    if (byId('videoCount')) { byId('videoCount').textContent = WORKS.length; }
    if (byId('photoCount')) { byId('photoCount').textContent = counts.gallery + counts.process; }
    if (byId('writingCount')) { byId('writingCount').textContent = WRITING_DOCS.length; }

    grid.innerHTML = DIRECTIONS.map(function (d) {
      var chipText = d.id === 'process' ? ('过程图 ' + counts.process + ' 张') :
        (d.id === 'gallery' ? ('4 类 · ' + counts.gallery + ' 件') :
          (d.countLabel || ('作品 ' + (counts[d.id] || 0) + ' 件')));
      return '' +
        '<a class="dir-card reveal" href="#' + d.id + '">' +
          '<div class="dir-num">' + d.num + '</div>' +
          '<div class="dir-en">' + d.en + '</div>' +
          '<p class="dir-name">' + d.name + '</p>' +
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
        var noteObj = PROJECT_NOTES[w.id];
        var hasCase = !!noteObj;
        var hasRichAssets = !!(noteObj && ((noteObj.images && noteObj.images.length) || (noteObj.docs && noteObj.docs.length)));
        return '' +
          '<article class="work-card reveal" role="button" tabindex="0"' +
            ' id="work-' + w.id + '" data-id="' + w.id + '"' +
            (w.videoFile ? ' data-video="' + w.videoFile + '"' : '') +
            ' aria-label="播放 ' + w.title + '">' +
            '<div class="cover">' +
              '<img class="work-poster" src="' + imgUrl(w.poster || ('images/posters/' + w.id + '.jpg')) + '"' +
                ' alt="' + w.title + ' 封面" width="640" height="360" loading="lazy" decoding="async">' +
              '<div class="cover-overlay">' +
                '<div class="play-wrap">' +
                  '<span class="play-btn"><span class="play-tri"></span></span>' +
                  '<span class="play-hint">' + (hasCase ? '播放 · 看拆解' : '播放') + '</span>' +
                '</div>' +
              '</div>' +
              (hasRichAssets ? '<span class="case-badge">含拆解与材料</span>' : (hasCase ? '<span class="case-badge case-badge-lite">含案例拆解</span>' : '')) +
              '<span class="year-chip">' + w.year + '</span>' +
            '</div>' +
            '<div class="work-body">' +
              '<h3 class="work-title">' + w.title + '</h3>' +
              '<ul class="tags">' +
                w.tags.map(function (t) { return '<li>' + t + '</li>'; }).join('') +
              '</ul>' +
              '<p class="work-desc">' + w.desc + '</p>' +
              (w.highlight ? '<p class="work-award">' + w.highlight + '</p>' : '') +
              (w.credit ? '<p class="work-credit">' + w.credit + '</p>' : '') +
            '</div>' +
          '</article>';
      }).join('');
    });
  }

  /* ==================== 渲染：平面 IP 与视觉设计（无障碍 Tab + 深链接 + 导语） ==================== */
  function renderGallery() {
    var wrap = byId('galleryWrap');
    if (!wrap) { return; }
    var idx0 = 0;

    var tabsHtml = '<div class="gallery-tabs reveal" role="tablist" aria-label="视觉设计分类" data-tablist-scope="gallery">' +
      GALLERY.map(function (g, gi) {
        var tabId = 'tab-gallery-' + g.slug;
        var panelId = 'panel-gallery-' + g.slug;
        return '<button class="gallery-tab' + (gi === 0 ? ' active' : '') + '" type="button" role="tab"' +
          ' id="' + tabId + '" aria-controls="' + panelId + '"' +
          ' aria-selected="' + (gi === 0 ? 'true' : 'false') + '" tabindex="' + (gi === 0 ? '0' : '-1') + '"' +
          ' data-tab-scope="gallery" data-tab-idx="' + gi + '" data-tab-slug="' + g.slug + '">' +
          g.group + '<span>' + g.items.length + '</span></button>';
      }).join('') +
    '</div>';

    var panelsHtml = GALLERY.map(function (g, gi) {
      var base = idx0;
      idx0 += g.items.length;
      var tabId = 'tab-gallery-' + g.slug;
      var panelId = 'panel-gallery-' + g.slug;
      var wAttr = g.portrait ? 'width="360" height="480"' : 'width="480" height="360"';
      return '' +
        '<div class="gallery-group tab-panel reveal' + (gi === 0 ? ' active' : '') + '"' +
          ' id="' + panelId + '" role="tabpanel" aria-labelledby="' + tabId + '"' +
          ' data-panel-scope="gallery" data-panel-idx="' + gi + '" data-panel-slug="' + g.slug + '">' +
          '<div class="gallery-group-head">' +
            '<span class="g-group-name">' + g.group + '</span>' +
            '<span class="g-group-en">' + g.en + '</span>' +
            '<span class="g-group-count">' + g.items.length + ' 件 · 点击查看大图</span>' +
          '</div>' +
          (g.intro ? '<p class="g-group-intro">' + g.intro + '</p>' : '') +
          '<div class="gallery-grid">' +
            g.items.map(function (it, i) {
              return '' +
                '<figure class="gallery-item' + (g.portrait ? ' g-portrait' : '') + (it.href ? ' is-link' : '') + '"' +
                  ' role="button" tabindex="0" data-index="' + (base + i) + '"' +
                  (it.href ? ' data-href="' + it.href + '"' : '') +
                  ' aria-label="查看 ' + it.title + '">' +
                  '<div class="g-thumb">' +
                    '<img src="' + imgUrl(it.src) + '" alt="' + it.title + ' · ' + g.group + '" ' + wAttr + ' loading="lazy" decoding="async">' +
                    '<span class="g-zoom" aria-hidden="true">' + (it.href ? '↗' : '＋') + '</span>' +
                  '</div>' +
                  '<figcaption>' +
                    '<span class="g-title">' + it.title + '</span>' +
                    '<span class="g-desc">' + it.desc + '</span>' +
                  '</figcaption>' +
                '</figure>';
            }).join('') +
          '</div>' +
          (g.items.length > 8 ? '<div class="gallery-expand-wrap"><button class="gallery-expand" type="button" data-total="' + g.items.length + '">展开全部 ' + g.items.length + ' 件 ＋</button></div>' : '') +
        '</div>';
    }).join('');

    wrap.innerHTML = tabsHtml + panelsHtml;
  }

  /* ==================== 渲染：hero 精选作品快捷入口（首屏高优先级加载） ==================== */
  function renderFeatured() {
    var grid = byId('featuredGrid');
    if (!grid) { return; }
    grid.innerHTML = FEATURED.map(function (f) {
      var work = findWork(f.href.replace('#work-', ''));
      if (!work) { return ''; }
      return '' +
        '<a class="featured-card reveal visible" href="' + f.href + '" data-open-work="' + work.id + '">' +
          '<div class="featured-cover"><img src="' + imgUrl(work.poster || ('images/posters/' + work.id + '.jpg')) + '" alt="' + f.title + ' 作品画面" width="480" height="270" decoding="async" fetchpriority="high">' +
          '<span class="featured-play" aria-hidden="true">▶</span></div>' +
          '<div class="featured-body">' +
          '<p class="featured-title">' + f.title + '</p>' +
          '<p class="featured-sub">' + f.sub + '</p>' +
          '<p class="featured-award">' + f.award + '</p>' +
          '<span class="featured-open">观看成片与案例拆解 ↗</span></div>' +
        '</a>';
    }).join('');
  }

  /* ==================== 渲染：伍 · 创作过程（无障碍 Tab + 项目聚类 + 导语） ==================== */
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

    var tabsHtml = '<div class="gallery-tabs reveal" role="tablist" aria-label="创作过程分类" data-tablist-scope="process">' +
      PROCESS_GALLERY.map(function (g, gi) {
        var tabId = 'tab-process-' + g.slug;
        var panelId = 'panel-process-' + g.slug;
        return '<button class="gallery-tab' + (gi === 0 ? ' active' : '') + '" type="button" role="tab"' +
          ' id="' + tabId + '" aria-controls="' + panelId + '"' +
          ' aria-selected="' + (gi === 0 ? 'true' : 'false') + '" tabindex="' + (gi === 0 ? '0' : '-1') + '"' +
          ' data-tab-scope="process" data-tab-idx="' + gi + '" data-tab-slug="' + g.slug + '">' +
          g.group + '<span>' + g.items.length + '</span></button>';
      }).join('') +
    '</div>';

    var base = GALLERY.reduce(function (n, g) { return n + g.items.length; }, 0);
    var galleryHtml = PROCESS_GALLERY.map(function (g, gi) {
      var b = base;
      base += g.items.length;
      var tabId = 'tab-process-' + g.slug;
      var panelId = 'panel-process-' + g.slug;
      var wAttr = g.portrait ? 'width="360" height="480"' : 'width="480" height="360"';
      return '' +
        '<div class="gallery-group tab-panel reveal' + (gi === 0 ? ' active' : '') + '"' +
          ' id="' + panelId + '" role="tabpanel" aria-labelledby="' + tabId + '"' +
          ' data-panel-scope="process" data-panel-idx="' + gi + '" data-panel-slug="' + g.slug + '">' +
          '<div class="gallery-group-head">' +
            '<span class="g-group-name">' + g.group + '</span>' +
            '<span class="g-group-en">' + g.en + '</span>' +
            '<span class="g-group-count">' + g.items.length + ' 件 · 点击查看大图</span>' +
          '</div>' +
          (g.intro ? '<p class="g-group-intro">' + g.intro + '</p>' : '') +
          '<div class="gallery-grid">' +
            g.items.map(function (it, i) {
              return '' +
                '<figure class="gallery-item' + (g.portrait ? ' g-portrait' : '') + '"' +
                  ' role="button" tabindex="0" data-index="' + (b + i) + '"' +
                  ' aria-label="查看 ' + it.title + '">' +
                  '<div class="g-thumb">' +
                    '<img src="' + imgUrl(it.src) + '" alt="' + it.title + ' · ' + g.group + '" ' + wAttr + ' loading="lazy" decoding="async">' +
                    '<span class="g-zoom" aria-hidden="true">＋</span>' +
                  '</div>' +
                  '<figcaption>' +
                    '<span class="g-title">' + it.title + '</span>' +
                    '<span class="g-desc">' + it.desc + '</span>' +
                  '</figcaption>' +
                '</figure>';
            }).join('') +
          '</div>' +
          (g.items.length > 8 ? '<div class="gallery-expand-wrap"><button class="gallery-expand" type="button" data-total="' + g.items.length + '">展开全部 ' + g.items.length + ' 件 ＋</button></div>' : '') +
        '</div>';
    }).join('');

    var quotesHtml =
      '<div class="process-block reveal">' +
        '<div class="process-block-head">' +
          '<span class="pb-name">创作笔记与工程化拆解</span>' +
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

    var projectHtml = '<div class="process-projects reveal">' + ['ai_xiuzhang', 'ai_cannes', 'itd_ironfire'].map(function (id) {
      var work = findWork(id);
      if (!work || !PROJECT_NOTES[id]) { return ''; }
      return '<button class="process-project" type="button" data-open-work="' + id + '">' +
        '<span class="process-project-label">深度案例拆解</span><strong>' + work.title + '</strong>' +
        '<span>' + PROJECT_NOTES[id].focus + '</span><span class="process-project-open">查看成片与工作流材料 ↗</span></button>';
    }).join('') + '</div>';

    wrap.innerHTML = projectHtml + stepsHtml + tabsHtml + galleryHtml + quotesHtml + docsHtml;
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
          '<p class="doc-foot"><span class="doc-foot-info">' + d.foot + (d.meta ? '<span class="doc-meta">' + d.meta + '</span>' : '') + '</span><span class="doc-open">查看 PDF ↗</span></p>' +
        '</a>';
    }).join('');
  }

  /* ==================== 渲染：陆 · 文字与策划 ==================== */
  function renderWriting() {
    var wrap = byId('writingWrap');
    if (!wrap) { return; }
    wrap.innerHTML =
      '<div class="docs-grid reveal">' + renderDocCards(WRITING_DOCS) + '</div>';
  }

  /* ==================== 渲染：柒 · 技术代码 ==================== */
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
          '<span class="pb-name">源码与自动化脚本 · 可下载</span>' +
          '<span class="pb-en">SOURCE CODE &amp; SCRIPTS</span>' +
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

  /* ==================== Tab 切换（无障碍 + 键盘 ←/→ + Hash 深链接 + 移动端居中） ==================== */
  function activateTab(scope, slugOrIdx, opts) {
    opts = opts || {};
    var tabs = document.querySelectorAll('.gallery-tab[data-tab-scope="' + scope + '"]');
    var panels = document.querySelectorAll('.tab-panel[data-panel-scope="' + scope + '"]');
    if (!tabs.length) { return false; }

    var targetBtn = null;
    for (var i = 0; i < tabs.length; i++) {
      if (tabs[i].getAttribute('data-tab-slug') === String(slugOrIdx) ||
          tabs[i].getAttribute('data-tab-idx') === String(slugOrIdx)) {
        targetBtn = tabs[i];
        break;
      }
    }
    if (!targetBtn) { return false; }

    var idx = targetBtn.getAttribute('data-tab-idx');
    var slug = targetBtn.getAttribute('data-tab-slug');

    for (var t = 0; t < tabs.length; t++) {
      var isCur = tabs[t].getAttribute('data-tab-idx') === idx;
      tabs[t].classList.toggle('active', isCur);
      tabs[t].setAttribute('aria-selected', isCur ? 'true' : 'false');
      tabs[t].setAttribute('tabindex', isCur ? '0' : '-1');
    }
    for (var p = 0; p < panels.length; p++) {
      var match = panels[p].getAttribute('data-panel-idx') === idx;
      panels[p].classList.toggle('active', match);
      if (match) { panels[p].classList.add('visible', 'force-visible'); }
    }

    if (opts.scrollTab && targetBtn.scrollIntoView) {
      try { targetBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' }); } catch (err) {}
    }
    if (opts.focusTab) { targetBtn.focus(); }
    if (opts.updateHash && slug && window.history && window.history.replaceState) {
      try { window.history.replaceState(null, '', '#' + scope + '-' + slug); } catch (err) {}
    }
    if (opts.scrollSection) {
      var sec = byId(scope);
      if (sec) {
        revealSectionById(scope);
        sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    return true;
  }

  function applyHashTab(scrollToSection) {
    var h = (location.hash || '').replace(/^#/, '');
    var m = h.match(/^(gallery|process)-([a-z0-9_-]+)$/i);
    if (!m) { return false; }
    return activateTab(m[1], m[2], { scrollTab: true, scrollSection: !!scrollToSection });
  }

  function initGalleryTabs() {
    document.addEventListener('click', function (e) {
      var btn = e.target && e.target.closest ? e.target.closest('.gallery-tab') : null;
      if (!btn) { return; }
      activateTab(btn.getAttribute('data-tab-scope'), btn.getAttribute('data-tab-slug'), {
        scrollTab: true,
        updateHash: true
      });
    });

    /* 键盘 ← / → / Home / End 切换 Tab */
    document.addEventListener('keydown', function (e) {
      var btn = e.target && e.target.closest ? e.target.closest('.gallery-tab') : null;
      if (!btn) { return; }
      if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].indexOf(e.key) === -1) { return; }
      e.preventDefault();
      var scope = btn.getAttribute('data-tab-scope');
      var tabs = Array.prototype.slice.call(document.querySelectorAll('.gallery-tab[data-tab-scope="' + scope + '"]'));
      var cur = tabs.indexOf(btn);
      if (cur < 0) { return; }
      var next = cur;
      if (e.key === 'ArrowRight') { next = (cur + 1) % tabs.length; }
      else if (e.key === 'ArrowLeft') { next = (cur - 1 + tabs.length) % tabs.length; }
      else if (e.key === 'Home') { next = 0; }
      else if (e.key === 'End') { next = tabs.length - 1; }
      activateTab(scope, tabs[next].getAttribute('data-tab-slug'), {
        scrollTab: true,
        focusTab: true,
        updateHash: true
      });
    });

    /* 拦截站内 #gallery-xxx / #process-xxx 快捷链接 */
    document.addEventListener('click', function (e) {
      var a = e.target && e.target.closest ? e.target.closest('a[href^="#gallery-"], a[href^="#process-"]') : null;
      if (!a) { return; }
      var h = a.getAttribute('href').slice(1);
      var m = h.match(/^(gallery|process)-([a-z0-9_-]+)$/i);
      if (!m) { return; }
      e.preventDefault();
      activateTab(m[1], m[2], { scrollTab: true, updateHash: true, scrollSection: true });
    });

    window.addEventListener('hashchange', function () { applyHashTab(true); });
    applyHashTab(true);
  }

  function initGalleryExpand() {
    document.addEventListener('click', function (e) {
      var btn = e.target && e.target.closest ? e.target.closest('.gallery-expand') : null;
      if (!btn) { return; }
      var group = btn.closest('.gallery-group');
      if (!group) { return; }
      var expanded = group.classList.toggle('expanded');
      var total = btn.getAttribute('data-total') || '';
      btn.textContent = expanded ? '收起 －' : ('展开全部 ' + total + ' 件 ＋');
      if (!expanded) {
        group.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  function initCopyButtons() {
    document.addEventListener('click', function (e) {
      var btn = e.target && e.target.closest ? e.target.closest('[data-copy-text]') : null;
      if (!btn) { return; }
      var text = btn.getAttribute('data-copy-text') || '';
      function done() {
        var old = btn.textContent;
        btn.textContent = '已复制 ✓';
        btn.classList.add('copied');
        setTimeout(function () { btn.textContent = old; btn.classList.remove('copied'); }, 1600);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(function () { fallback(); });
      } else { fallback(); }
      function fallback() {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); done(); } catch (err) {}
        document.body.removeChild(ta);
      }
    });
  }


  /* ==================== 关于我：点击复制电话/邮箱/微信 ==================== */
  function initCopyableMeta() {
    document.addEventListener('click', function (e) {
      var dd = e.target && e.target.closest ? e.target.closest('[data-copyable]') : null;
      if (!dd) { return; }
      var text = (dd.textContent || '').trim();
      if (!text) { return; }
      var old = dd.getAttribute('data-original') || dd.innerHTML;
      dd.setAttribute('data-original', old);
      function done() {
        dd.classList.add('copied');
        dd.innerHTML = '<span class="copied-tip">已复制 ✓</span>';
        setTimeout(function () { dd.innerHTML = old; dd.classList.remove('copied'); }, 1500);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(function () { fallback(); });
      } else { fallback(); }
      function fallback() {
        var ta = document.createElement('textarea');
        ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); done(); } catch (err) {}
        document.body.removeChild(ta);
      }
    });
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

  var photoFlat = [];
  GALLERY.forEach(function (g) {
    g.items.forEach(function (it) { photoFlat.push({ group: g.group, item: it }); });
  });
  PROCESS_GALLERY.forEach(function (g) {
    g.items.forEach(function (it) { photoFlat.push({ group: g.group, item: it }); });
  });

  /* 案例拆解专用附图（含 AI 视觉延展海报）注册进灯箱索引，不新建画廊分组、不影响 73 张图集计数 */
  var CASE_IMAGE_META = {
    'assets/images/gen_ai_yangyangtang_1.jpg': { title: '《盐阳叹》视觉延展海报（AI 视觉延展）', desc: '海报为 AI 视觉延展（练习），非原画/实拍 · 东方水墨流体主视觉' },
    'assets/images/gen_film_silu_1_v2.jpg': { title: '《丝路新篇》视觉延展海报（AI 视觉延展）', desc: '海报为 AI 视觉延展（练习），非原画/实拍 · 跨时空三段切片' },
    'assets/images/gen_ai_yegou_1.jpg': { title: '《野生狗奶》视觉延展海报（AI 视觉延展）', desc: '海报为 AI 视觉延展（练习），非原画/实拍 · 废墟群像喜剧' },
    'assets/images/gen_ai_dasheng_1.jpg': { title: '《灾厄战线》概念横幅（AI 视觉延展）', desc: '横幅海报为 AI 视觉延展（练习），非原画/实拍 · 16:9 宽银幕概念' }
  };
  Object.keys(PROJECT_NOTES).forEach(function (wid) {
    var note = PROJECT_NOTES[wid];
    var work = findWork(wid);
    if (!note || !note.images || !note.images.length) { return; }
    note.images.forEach(function (src, idx) {
      var exists = false;
      for (var i = 0; i < photoFlat.length; i++) {
        if (photoFlat[i].item.src === src) { exists = true; break; }
      }
      if (!exists) {
        var meta = CASE_IMAGE_META[src] || {
          title: (work ? work.title : wid) + ' · 配套视觉 ' + (idx + 1),
          desc: work ? work.title + ' 案例拆解配套视觉材料' : '案例拆解配套视觉材料'
        };
        photoFlat.push({ group: CASE_IMAGE_META[src] ? 'AI 视觉延展' : '案例配套材料', item: { src: src, title: meta.title, desc: meta.desc } });
      }
    });
  });

  var lbIndex = 0;
  var lbLastFocus = null;

  function showLightboxItem() {
    var entry = photoFlat[lbIndex];
    if (!entry) { return; }
    lightboxImg.dataset.fallbackDone = '';
    lightboxImg.src = imgUrl(entry.item.src);
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

  document.addEventListener('click', function (e) {
    var item = e.target && e.target.closest ? e.target.closest('.gallery-item') : null;
    if (!item) { return; }
    var ext = item.getAttribute('data-href');
    if (ext) { window.open(ext, '_blank', 'noopener'); return; }
    openLightbox(parseInt(item.getAttribute('data-index'), 10));
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox && lightbox.classList.contains('open')) {
      e.preventDefault();
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
  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightboxBackdrop || e.target === lightboxStage) { closeLightbox(); }
    });
  }

  /* ==================== 全屏弹层播放器（项目信息表 + 上/下一部 + 加载失败重试） ==================== */
  var modal = byId('playerModal');
  var modalBackdrop = byId('modalBackdrop');
  var modalCloseBtn = byId('modalClose');
  var modalPrevBtn = byId('modalPrev');
  var modalNextBtn = byId('modalNext');
  var modalIndexEl = byId('modalIndex');
  var modalVideo = byId('modalVideo');
  var modalVideoError = byId('modalVideoError');
  var modalRetryBtn = byId('modalRetryBtn');
  var modalTitle = byId('modalTitle');
  var modalSub = byId('modalSub');
  var modalFacts = byId('modalFacts');
  var lastFocus = null;
  var currentWorkIdx = -1;
  var currentVideoUrl = '';

  function renderProjectFacts(work) {
    if (!modalFacts) { return; }
    var rows = [];
    if (work.role) { rows.push({ k: '担任角色', v: work.role }); }
    if (work.team) { rows.push({ k: '协作方式', v: work.team }); }
    if (work.tools && work.tools.length) { rows.push({ k: '核心工具', v: work.tools.join(' · ') }); }
    if (work.duration) { rows.push({ k: '作品时长', v: work.duration }); }
    if (work.result) { rows.push({ k: '成果与数据', v: work.result }); }
    if (work.scale) { rows.push({ k: '项目场景', v: work.scale }); }
    if (work.teamSize) { rows.push({ k: '团队规模', v: work.teamSize }); }
    if (!rows.length) {
      modalFacts.innerHTML = '';
      modalFacts.hidden = true;
      return;
    }
    modalFacts.hidden = false;
    modalFacts.innerHTML = rows.map(function (r) {
      return '<div><dt>' + r.k + '</dt><dd>' + r.v + '</dd></div>';
    }).join('');
  }

  function renderProjectNotes(id) {
    var note = PROJECT_NOTES[id];
    if (!note) { return ''; }
    var photos = note.images.map(function (src) {
      var index = -1;
      for (var i = 0; i < photoFlat.length; i++) {
        if (photoFlat[i].item.src === src) { index = i; break; }
      }
      if (index < 0) { return ''; }
      var item = photoFlat[index].item;
      return '<button class="case-photo" type="button" data-case-photo="' + index + '">' +
        '<img src="' + imgUrl(src) + '" alt="' + item.title + '" width="320" height="240" loading="lazy" decoding="async">' +
        '<span>' + item.title + ' ＋</span></button>';
    }).join('');
    return '<section class="project-note" aria-label="案例拆解">' +
      '<p class="case-kicker">CASE STUDY · 工作流与案例拆解</p>' +
      '<h4 class="case-focus">' + note.focus + '</h4><p class="case-idea">' + note.idea + '</p>' +
      '<ol class="case-steps">' + note.steps.map(function (step, i) {
        return '<li><span class="case-step-num">0' + (i + 1) + '</span><h5>' + step.title + '</h5><p>' + step.text + '</p></li>';
      }).join('') + '</ol>' +
      (photos ? '<div class="case-photos">' + photos + '</div>' : '') +
      (note.docs.length ? '<div class="case-links">' + note.docs.map(function (doc) {
        return '<a href="' + doc.href + '" ' + (doc.download ? 'download' : 'target="_blank" rel="noopener"') + '>' +
          '<span>' + doc.label + '</span><small>' + doc.kind + (doc.download ? ' ↓' : ' ↗') + '</small></a>';
      }).join('') + '</div>' : '') + '</section>';
  }

  function hideVideoError() {
    if (modalVideoError) { modalVideoError.hidden = true; }
  }

  function showVideoError() {
    if (modal && modal.classList.contains('open') && modalVideoError && currentVideoUrl) {
      modalVideoError.hidden = false;
    }
  }


  /* ==================== 个人 Showreel 播放 ==================== */
  var SHOWREEL_SRC = LOCAL_PREVIEW ? 'assets/videos/chenjinyu_showreel_60s_1080p.mp4'
    : 'https://chenjinyu-portfolio.oss-cn-shanghai.aliyuncs.com/videos/chenjinyu_showreel_60s_1080p.mp4';
  var SHOWREEL_POSTER = imgUrl('assets/images/showreel_cover.jpg');

  function openShowreel() {
    if (!modal) { return; }
    var escHint = document.querySelector('.modal-esc-hint');
    if (escHint) { escHint.textContent = 'ESC 关闭'; }
    var wasOpen = modal.classList.contains('open');
    if (!wasOpen) { lastFocus = document.activeElement; }
    currentWorkIdx = -1;
    hideVideoError();
    modal.classList.add('showreel-mode');

    var wrap = byId('modalVideoWrap');
    var bili = byId('modalBili');
    if (wrap) { wrap.classList.remove('bili-mode'); }
    if (bili) { bili.classList.remove('active'); bili.innerHTML = ''; }

    currentVideoUrl = SHOWREEL_SRC;
    modalVideo.pause();
    modalVideo.setAttribute('preload', 'auto');
    modalVideo.setAttribute('poster', SHOWREEL_POSTER);
    modalVideo.setAttribute('src', SHOWREEL_SRC);
    modalVideo.autoplay = true;
    modalVideo.load();
    var playPromise = modalVideo.play();
    if (playPromise && playPromise.catch) { playPromise.catch(function () {}); }

    if (modalIndexEl) { modalIndexEl.textContent = 'SHOWREEL'; }
    if (modalTitle) { modalTitle.textContent = '个人 Showreel · 60 秒'; }
    if (modalSub) { modalSub.innerHTML = '<b>2026</b>混剪 · 16 部作品高光片段'; }
    renderProjectFacts({});
    byId('modalDescription').textContent = '从 16 部作品中精选的 60 秒混剪：打铁花非遗数字装置、东方水墨 AI 影像、AI 漫剧与实时交互装置。';
    byId('modalTags').innerHTML = '<li>Showreel</li><li>2026</li><li>1080p</li>';
    byId('modalCase').innerHTML = '';

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    byId('modalContent').scrollTop = 0;
    if (modalCloseBtn) { modalCloseBtn.focus(); }
  }

  function openPlayer(id, keepFocus) {
    var escHint = document.querySelector('.modal-esc-hint');
    if (escHint) { escHint.textContent = 'ESC 关闭 · ←/→ 切换'; }
    var idx = findWorkIndex(id);
    if (idx < 0 || !modal) { return; }
    var work = WORKS[idx];
    var wasOpen = modal.classList.contains('open');
    if (!wasOpen) { lastFocus = document.activeElement; }
    currentWorkIdx = idx;
    hideVideoError();

    var wrap = byId('modalVideoWrap');
    var bili = byId('modalBili');

    if (work.bili && wrap && bili) {
      currentVideoUrl = '';
      wrap.classList.add('bili-mode');
      bili.classList.add('active');
      bili.innerHTML = '<iframe src="//player.bilibili.com/player.html?bvid=' + encodeURIComponent(work.bili) +
        '&page=1&autoplay=0&high_quality=1&danmaku=0&as_wide=1" scrolling="no" frameborder="0" allowfullscreen></iframe>';
      modalVideo.removeAttribute('src');
      modalVideo.load();
    } else {
      if (wrap) { wrap.classList.remove('bili-mode'); }
      if (bili) { bili.classList.remove('active'); bili.innerHTML = ''; }
      currentVideoUrl = VIDEO_BASE + ((!LOCAL_PREVIEW && work.videoFile) || (work.id + '.mp4'));
      modalVideo.pause();
      modalVideo.setAttribute('preload', 'none');
      modalVideo.setAttribute('poster', imgUrl(work.poster || ('images/posters/' + work.id + '.jpg')));
      modalVideo.setAttribute('src', currentVideoUrl);
      modalVideo.autoplay = false;
    }

    if (modalIndexEl) { modalIndexEl.textContent = (idx + 1) + ' / ' + WORKS.length; }
    modalTitle.textContent = work.title;
    modalSub.innerHTML = '<b>' + work.year + '</b>' + (work.credit || work.highlight || '');
    renderProjectFacts(work);
    byId('modalDescription').textContent = work.desc;
    byId('modalTags').innerHTML = work.tags.map(function (tag) { return '<li>' + tag + '</li>'; }).join('');
    byId('modalCase').innerHTML = renderProjectNotes(id);

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    byId('modalContent').scrollTop = 0;
    if (!keepFocus && modalCloseBtn) { modalCloseBtn.focus(); }
  }

  function stepPlayer(delta) {
    if (currentWorkIdx < 0 || !WORKS.length) { return; }
    var next = (currentWorkIdx + delta + WORKS.length) % WORKS.length;
    openPlayer(WORKS[next].id, true);
  }

  function closePlayer() {
    if (!modal) { return; }
    currentVideoUrl = '';
    hideVideoError();
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
    modal.classList.remove('showreel-mode');
    modalVideo.autoplay = false;
    modalVideo.setAttribute('preload', 'none');
    if (lastFocus && typeof lastFocus.focus === 'function') { lastFocus.focus(); }
  }

  if (modalVideo) {
    modalVideo.addEventListener('error', showVideoError);
    modalVideo.addEventListener('loadeddata', hideVideoError);
    modalVideo.addEventListener('playing', hideVideoError);
  }
  if (modalRetryBtn) {
    modalRetryBtn.addEventListener('click', function () {
      if (!currentVideoUrl || !modalVideo) { return; }
      hideVideoError();
      var sep = currentVideoUrl.indexOf('?') === -1 ? '?' : '&';
      modalVideo.setAttribute('src', currentVideoUrl + sep + 'retry=' + Date.now());
      modalVideo.load();
      var p = modalVideo.play();
      if (p && p.catch) { p.catch(function () {}); }
    });
  }
  if (modalPrevBtn) { modalPrevBtn.addEventListener('click', function () { stepPlayer(-1); }); }
  if (modalNextBtn) { modalNextBtn.addEventListener('click', function () { stepPlayer(1); }); }

  document.addEventListener('click', function (e) {
    var showreelBtn = e.target && e.target.closest ? e.target.closest('[data-showreel]') : null;
    if (showreelBtn) {
      e.preventDefault();
      openShowreel();
      return;
    }
    var opener = e.target && e.target.closest ? e.target.closest('[data-open-work]') : null;
    if (opener) {
      e.preventDefault();
      openPlayer(opener.getAttribute('data-open-work'));
      return;
    }
    var photo = e.target && e.target.closest ? e.target.closest('[data-case-photo]') : null;
    if (photo) {
      modalVideo.pause();
      openLightbox(parseInt(photo.getAttribute('data-case-photo'), 10));
      return;
    }
    var card = e.target && e.target.closest ? e.target.closest('.work-card') : null;
    if (card) { openPlayer(card.getAttribute('data-id')); }
  });

  /* 键盘：ESC 关闭弹层；←/→ 切换作品；Enter/Space 打开卡片 */
  document.addEventListener('keydown', function (e) {
    if (e.defaultPrevented || (lightbox && lightbox.classList.contains('open'))) { return; }
    if (modal && modal.classList.contains('open')) {
      if (e.key === 'Escape') { e.preventDefault(); closePlayer(); return; }
      if (modal.classList.contains('showreel-mode')) { return; }
      if (e.key === 'ArrowLeft' && document.activeElement !== modalVideo) { e.preventDefault(); stepPlayer(-1); return; }
      if (e.key === 'ArrowRight' && document.activeElement !== modalVideo) { e.preventDefault(); stepPlayer(1); return; }
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

  /* 弹层与灯箱焦点陷阱 */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') { return; }
    var panel = lightbox && lightbox.classList.contains('open') ? lightbox :
      (modal && modal.classList.contains('open') ? modal : null);
    if (!panel) { return; }
    var controls = Array.prototype.filter.call(panel.querySelectorAll('button, a[href], video[controls], [tabindex="0"]'), function (el) {
      return el.getClientRects().length && !el.disabled && !el.hidden;
    });
    var first = controls[0], last = controls[controls.length - 1];
    if (!first) { return; }
    if (!panel.contains(document.activeElement) || (e.shiftKey && document.activeElement === first)) {
      e.preventDefault(); (e.shiftKey ? last : first).focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  });

  /* 全局图片失败兜底：替换为内联 SVG 占位（灰底 + 作品名），避免破图 */
  document.addEventListener('error', function (e) {
    var t = e.target;
    if (!t || t.tagName !== 'IMG') { return; }
    if (t.dataset.fallbackDone === '1') { return; }
    t.dataset.fallbackDone = '1';
    t.src = fallbackSvg(t.getAttribute('alt') || '作品画面');
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

  /* ==================== 导航「更多」下拉 ==================== */
  (function () {
    var navMore = document.querySelector('.nav-more');
    var navMoreToggle = byId('navMoreToggle');
    if (!navMore || !navMoreToggle) { return; }
    function setOpen(open) {
      navMore.classList.toggle('open', open);
      navMoreToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    navMoreToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      setOpen(!navMore.classList.contains('open'));
    });
    document.addEventListener('click', function (e) {
      if (navMore.classList.contains('open') && !navMore.contains(e.target)) { setOpen(false); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { setOpen(false); }
    });
    [].forEach.call(navMore.querySelectorAll('a'), function (a) {
      a.addEventListener('click', function () { setOpen(false); });
    });
  })();

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
    }, { threshold: 0.01, rootMargin: '0px 0px 40px 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ==================== 锚点跳转：即时强制显示目标区域（杜绝白屏） ==================== */
  function revealSectionById(id) {
    if (!id) { return; }
    var sec = byId(id);
    if (!sec) { return; }
    var els = sec.querySelectorAll('.reveal');
    for (var i = 0; i < els.length; i++) {
      els[i].classList.add('visible', 'force-visible');
    }
    var cards = sec.querySelectorAll('.work-card, .gallery-item, .dir-card');
    for (var j = 0; j < cards.length; j++) {
      cards[j].classList.add('reveal-in');
    }
  }

  function initAnchorReveal() {
    document.addEventListener('click', function (e) {
      var a = e.target && e.target.closest ? e.target.closest('a[href^="#"]') : null;
      if (!a) { return; }
      var id = a.getAttribute('href').slice(1);
      if (!id) { return; }
      var secId = id.replace(/-(ip|poster|board|merch|concept|charsheet|prompt|storyboard|td|fanart|overview)$/i, '');
      revealSectionById(secId);
      setTimeout(function () { revealSectionById(secId); }, 120);
    });
    window.addEventListener('hashchange', function () {
      var h = location.hash.slice(1).replace(/-(ip|poster|board|merch|concept|charsheet|prompt|storyboard|td|fanart|overview)$/i, '');
      revealSectionById(h);
    });
    if (location.hash.length > 1) {
      var h0 = location.hash.slice(1).replace(/-(ip|poster|board|merch|concept|charsheet|prompt|storyboard|td|fanart|overview)$/i, '');
      revealSectionById(h0);
      setTimeout(function () { revealSectionById(h0); }, 200);
    }
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
        links.forEach(function (a) { a.classList.remove('active'); a.removeAttribute('aria-current'); });
        var link = map[entry.target.id];
        if (link) { link.classList.add('active'); link.setAttribute('aria-current', 'true'); }
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
  initAnchorReveal();
  initGalleryTabs();
  initGalleryExpand();
  initCopyButtons();
  initCopyableMeta();
  initActiveNav();
  initParticles();
})();
