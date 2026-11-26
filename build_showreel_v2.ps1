<#
.SYNOPSIS
  陈锦育 · 60 秒个人 Showreel 一键自动化剪辑脚本（基于本地原片 + ffmpeg）
.DESCRIPTION
  1. 自动读取本地 videos\ 下的核心作品原片，统一规范至 1920x1080 / 30fps / yuv420p；
  2. 按「蓄力片头 → 主题快切 → 3 部代表作展示 → 交互与工作流快切 → 黑金名片片尾」五段结构剪辑；
  3. 自动导出两版文件：
     - videos\showreel_60s.mp4          （1080p 高清母版，用于网站与投递）
     - videos\showreel_60s_preview.mp4  （720p 轻量审片版，约 12-18 MB，可直接上传给 AI 逐秒审片精修）
.EXAMPLE
  .\build_showreel_60s.ps1
  .\build_showreel_60s.ps1 -BgmPath "music\bgm.mp3"
#>

param(
  [string]$VideosDir = "videos",
  [string]$BgmPath   = "",
  [string]$OutMaster = "videos\showreel_v2.mp4",
  [string]$OutReview = "videos\showreel_v2_preview.mp4"
)

$ErrorActionPreference = "Stop"

# ---------- 1. 环境检查 ----------
if (-not (Get-Command ffmpeg -ErrorAction SilentlyContinue)) {
  Write-Error "未检测到 ffmpeg，请先确认 ffmpeg 已加入系统 PATH。"
  exit 1
}

# 查找 Windows 中文字体（用于左下角极简作品名与片头片尾字卡）
$FontCandidates = @(
  "C:/Windows/Fonts/msyhbd.ttc",
  "C:/Windows/Fonts/msyh.ttc",
  "C:/Windows/Fonts/simhei.ttf"
)
$FontFile = $FontCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $FontFile) {
  Write-Warning "未找到微软雅黑/黑体字体，将跳过文字叠加。"
}
$FontEsc = if ($FontFile) { $FontFile -replace ":", "\:" } else { "" }

# ---------- 2. 剪辑分镜表（可直接修改 Start/Dur 微调出片节奏） ----------
# 结构：片头 2.0s + 主题快切 14.0s + 3 部代表作 24.0s + 交互/收尾段 14.0s + 片尾名片 4.5s ≈ 58.5s
$Clips = @(
  # Act 2: 主题快切（每镜 2.0s，建立视觉密度）
  @{ File = "itd_ironfire.mp4";    Start = 12; Dur = 2.0; Label = "" },
  @{ File = "ai_yangyangtang.mp4"; Start = 8;  Dur = 2.0; Label = "" },
  @{ File = "ai_xiuzhang.mp4";     Start = 15; Dur = 2.0; Label = "" },
  @{ File = "ai_dasheng.mp4";      Start = 10; Dur = 2.0; Label = "" },
  @{ File = "itd_xinmai.mp4";      Start = 18; Dur = 2.0; Label = "" },
  @{ File = "ai_yegou.mp4";        Start = 20; Dur = 2.0; Label = "" },
  @{ File = "itd_shange.mp4";      Start = 10; Dur = 2.0; Label = "" },

  # Act 3: 3 部核心代表作（每部 8.0s，左下角极简白字标作品名与技术点）
  @{ File = "ai_xiuzhang.mp4";     Start = 35; Dur = 8.0; Label = "《绣藏》  AI 漫剧 · 全流程管线" },
  @{ File = "ai_yangyangtang.mp4"; Start = 22; Dur = 8.0; Label = "《盐阳叹》  中国好创意 · 国家级二等奖" },
  @{ File = "itd_ironfire.mp4";    Start = 32; Dur = 8.0; Label = "《铁火生花》  TouchDesigner GPU 粒子" },

  # Act 4: 交互装置与多题材收束（共 14.0s）
  @{ File = "itd_shange.mp4";      Start = 6;  Dur = 3.0; Label = "《山歌回音壁》  声光互动 · 国家级二等奖" },
  @{ File = "itd_yixiu.mp4";       Start = 30; Dur = 4.0; Label = "《一绣成祥》  米兰设计周 · 国家级三等奖" },
  @{ File = "ai_cannes.mp4";       Start = 45; Dur = 3.0; Label = "《倒退的棕榈叶》  电影感 AI 剧情短片" },
  @{ File = "ai_dasheng.mp4";      Start = 28; Dur = 3.0; Label = "《灾厄战线》  暗黑科幻 AI 概念片" }
)

$TmpDir = Join-Path $env:TEMP ("showreel_build_" + [guid]::NewGuid().ToString("N").Substring(0, 8))
New-Item -ItemType Directory -Path $TmpDir -Force | Out-Null
$SegmentList = New-Object System.Collections.Generic.List[string]

function Make-TitleCard {
  param([string]$OutPath, [double]$Dur, [string]$Line1, [string]$Line2, [string]$Line3 = "")
  $vf = "format=yuv420p"
  if ($FontEsc) {
    $l1 = $Line1 -replace "'", "\'"
    $l2 = $Line2 -replace "'", "\'"
    $vf = "drawtext=fontfile='$FontEsc':text='$l1':fontcolor=#FAFAF9:fontsize=46:x=(w-text_w)/2:y=(h-text_h)/2-28," +
          "drawtext=fontfile='$FontEsc':text='$l2':fontcolor=#B8B5AC:fontsize=20:x=(w-text_w)/2:y=(h-text_h)/2+30"
    if ($Line3) {
      $l3 = $Line3 -replace "'", "\'"
      $vf += ",drawtext=fontfile='$FontEsc':text='$l3':fontcolor=#8C8980:fontsize=16:x=(w-text_w)/2:y=(h-text_h)/2+72"
    }
    $vf += ",fade=t=in:st=0:d=0.4,fade=t=out:st=$([math]::Max(0, $Dur - 0.5)):d=0.5,format=yuv420p"
  }
  & ffmpeg -y -v error -f lavfi -i "color=c=#111111:s=1920x1080:r=30:d=$Dur" -vf $vf -an -c:v libx264 -crf 18 -preset medium $OutPath
}

Write-Host "[1/4] 生成蓄力黑金片头..." -ForegroundColor Cyan
$IntroFile = Join-Path $TmpDir "00_intro.mp4"
Make-TitleCard -OutPath $IntroFile -Dur 2.0 -Line1 "陈锦育 · CHEN JINYU" -Line2 "AIGC 影像创作  ×  交互装置  ·  SHOWREEL"
$SegmentList.Add($IntroFile)

Write-Host "[2/4] 裁切并规范化高光片段..." -ForegroundColor Cyan
$idx = 1
foreach ($c in $Clips) {
  $src = Join-Path $VideosDir $c.File
  if (-not (Test-Path $src)) {
    Write-Warning "跳过缺失文件：$src"
    continue
  }
  $segOut = Join-Path $TmpDir ("{0:D2}_{1}" -f $idx, $c.File)
  $vf = "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:800:0:(ih-800)/2,pad=1920:1080:0:(1080-800)/2:color=#111111,setsar=1,fps=30"
  if ($c.Label -and $FontEsc) {
    $lbl = $c.Label -replace "'", "\'"
    $vf += ",drawtext=fontfile='$FontEsc':text='$lbl':fontcolor=white@0.88:fontsize=30:x=56:y=h-76:box=1:boxcolor=black@0.38:boxborderw=10:enable='between(t,0.2,$([math]::Max(0.8, $c.Dur - 0.3)))'"
  }
  $vf += ",format=yuv420p"
  & ffmpeg -y -v error -ss $c.Start -t $c.Dur -i $src -vf $vf -an -c:v libx264 -crf 18 -preset medium $segOut
  $SegmentList.Add($segOut)
  $idx++
}

# 可选：若本地有工作流过程图，插入 3 秒工作流证据快切（每张 1.0s）
$WorkflowImgs = @(
  @{ Path = "images\process\charsheet_girl_2.jpg"; Label = "WORKFLOW  ·  AI 角色三视图一致性锚定" },
  @{ Path = "images\process\prompt_1.jpg";         Label = "WORKFLOW  ·  即梦提示词与光影迭代记录" },
  @{ Path = "images\process\td_1.jpg";             Label = "WORKFLOW  ·  TouchDesigner 实时粒子节点" }
)
foreach ($wi in $WorkflowImgs) {
  if (Test-Path $wi.Path) {
    $segOut = Join-Path $TmpDir ("{0:D2}_wf.mp4" -f $idx)
    "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:800:0:(ih-800)/2,pad=1920:1080:0:(1080-800)/2:color=#111111,setsar=1,fps=30"
    if ($FontEsc) {
      $lbl = $wi.Label -replace "'", "\'"
      $vf += ",drawtext=fontfile='$FontEsc':text='$lbl':fontcolor=white@0.85:fontsize=22:x=56:y=h-74:box=1:boxcolor=black@0.45:boxborderw=10"
    }
    $vf += ",format=yuv420p"
    & ffmpeg -y -v error -loop 1 -t 1.0 -i $wi.Path -vf $vf -an -c:v libx264 -crf 18 -preset medium $segOut
    $SegmentList.Add($segOut)
    $idx++
  }
}

Write-Host "[3/4] 生成片尾名片并拼接成片..." -ForegroundColor Cyan
$OutroFile = Join-Path $TmpDir "99_outro.mp4"
Make-TitleCard -OutPath $OutroFile -Dur 4.5 -Line1 "陈锦育 · CHEN JINYU" -Line2 "AIGC 视觉 / 漫剧编导 / 交互装置  ·  2027 届" -Line3 "yuuuiu.github.io/chenjinyu-portfolio  ·  1426263349@qq.com"
$SegmentList.Add($OutroFile)

$ConcatTxt = Join-Path $TmpDir "concat.txt"
$SegmentList | ForEach-Object { "file '$($_ -replace '\\', '/')'" } | Set-Content -Path $ConcatTxt -Encoding ASCII

$RawConcat = Join-Path $TmpDir "raw_master.mp4"
& ffmpeg -y -v error -f concat -safe 0 -i $ConcatTxt -c copy $RawConcat

$OutDir = Split-Path -Parent $OutMaster
if ($OutDir -and -not (Test-Path $OutDir)) { New-Item -ItemType Directory -Path $OutDir -Force | Out-Null }

if ($BgmPath -and (Test-Path $BgmPath)) {
  Write-Host "[4/4] 混入 BGM 并做 -14 LUFS 响度标准化..." -ForegroundColor Cyan
  & ffmpeg -y -v error -i $RawConcat -i $BgmPath -map 0:v:0 -map 1:a:0 -shortest `
    -c:v copy -af "loudnorm=I=-14:TP=-1.5:LRA=11,afade=t=in:st=0:d=0.6,afade=t=out:st=56:d=2.5" `
    -c:a aac -b:a 192k -movflags +faststart $OutMaster
} else {
  Write-Host "[4/4] 导出无 BGM 高清母版（后续可传 -BgmPath 混入配乐）..." -ForegroundColor Cyan
  & ffmpeg -y -v error -i $RawConcat -c:v copy -movflags +faststart $OutMaster
}

# 同步压制 720p 审片版（约 12-18 MB，方便直接发给 AI 逐秒审片）
& ffmpeg -y -v error -i $OutMaster -vf "scale=-2:720" -c:v libx264 -crf 25 -preset fast -c:a aac -b:a 128k -movflags +faststart $OutReview

Remove-Item $TmpDir -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "`n完成！已生成：" -ForegroundColor Green
Write-Host "  1080p 母版：$OutMaster" -ForegroundColor Green
Write-Host "  720p 审片版：$OutReview（可直接上传给 AI 看画面精修时间码）" -ForegroundColor Yellow
