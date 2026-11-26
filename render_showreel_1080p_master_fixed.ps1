<#
.SYNOPSIS
  陈锦育 · 60 秒 Showreel 原片 1080p 母版一键渲染脚本（使用视觉精挑时间码 + 电影级字卡 PNG）
.DESCRIPTION
  本脚本已自动加上代理片段起点偏移（+3s / +0s），直接对接你本地 1080p 原片 videos\*.mp4，
  并叠加 showreel_overlays\ 内的电影级透明 PNG 字卡与《铁火生花》真实配乐（-14 LUFS 标准化）。
#>
param(
  [string]$VideosDir = "videos",
  [string]$BgmFile   = "videos\itd_ironfire.mp4",
  [string]$OutFile   = "videos\chenjinyu_showreel_60s_1080p.mp4"
)
$ErrorActionPreference = "Stop"
if (-not (Get-Command ffmpeg -ErrorAction SilentlyContinue)) { Write-Error "未检测到 ffmpeg"; exit 1 }

$Shots = @(
  @{ Id="01_hook_fire"; File="itd_ironfire.mp4";    Start=74.8; Dur=2.5; Ov="" },
  @{ Id="02_fast_yy";   File="ai_yangyangtang.mp4"; Start=2.5;  Dur=2.0; Ov="" },
  @{ Id="03_fast_xz";   File="ai_xiuzhang.mp4";     Start=30.0; Dur=2.0; Ov="" },
  @{ Id="04_fast_ds";   File="ai_dasheng.mp4";      Start=41.5; Dur=2.0; Ov="" },
  @{ Id="05_fast_yx";   File="itd_yixiu.mp4";       Start=86.0; Dur=2.0; Ov="" },
  @{ Id="06_fast_yg";   File="ai_yegou.mp4";        Start=41.5; Dur=2.0; Ov="" },
  @{ Id="07_xz_a";      File="ai_xiuzhang.mp4";     Start=41.5; Dur=3.5; Ov="showreel_overlays\ov_07_xz_a.png" },
  @{ Id="08_xz_b";      File="ai_xiuzhang.mp4";     Start=63.5; Dur=4.0; Ov="showreel_overlays\ov_07_xz_a.png" },
  @{ Id="09_yy_a";      File="ai_yangyangtang.mp4"; Start=19.0; Dur=3.5; Ov="showreel_overlays\ov_09_yy_a.png" },
  @{ Id="10_yy_b";      File="ai_yangyangtang.mp4"; Start=43.0; Dur=4.0; Ov="showreel_overlays\ov_09_yy_a.png" },
  @{ Id="11_fire_a";    File="itd_ironfire.mp4";    Start=41.5; Dur=3.5; Ov="showreel_overlays\ov_11_fire_a.png" },
  @{ Id="12_fire_b";    File="itd_ironfire.mp4";    Start=52.5; Dur=4.0; Ov="showreel_overlays\ov_11_fire_a.png" },
  @{ Id="13_ds_a";      File="ai_dasheng.mp4";      Start=52.5; Dur=3.0; Ov="showreel_overlays\ov_13_ds_a.png" },
  @{ Id="14_ds_b";      File="ai_dasheng.mp4";      Start=86.0; Dur=3.0; Ov="showreel_overlays\ov_13_ds_a.png" },
  @{ Id="15_shange";    File="itd_shange.mp4";      Start=24.5; Dur=3.5; Ov="showreel_overlays\ov_15_shange.png" },
  @{ Id="16_yixiu";     File="itd_yixiu.mp4";       Start=75.0; Dur=3.5; Ov="showreel_overlays\ov_16_yixiu.png" },
  @{ Id="17_xinmai";    File="itd_xinmai.mp4";      Start=64.0; Dur=3.0; Ov="showreel_overlays\ov_17_xinmai.png" },
  @{ Id="18_climax_yy"; File="ai_yangyangtang.mp4"; Start=58.5; Dur=3.0; Ov="" }
)

$Tmp = Join-Path $env:TEMP ("sr1080_" + [guid]::NewGuid().ToString("N").Substring(0,8))
New-Item -ItemType Directory -Path $Tmp -Force | Out-Null
$Segs = New-Object System.Collections.Generic.List[string]

$Intro = Join-Path $Tmp "00_intro.mp4"
& ffmpeg -y -v error -loop 1 -t 2.2 -i "showreel_overlays\00_intro.png" -vf "scale=1920:1080,fade=t=in:st=0:d=0.4,fade=t=out:st=1.8:d=0.4,format=yuv420p" -r 30 -an -c:v libx264 -crf 17 -preset medium $Intro
$Segs.Add($Intro)

foreach ($s in $Shots) {
  $src = Join-Path $VideosDir $s.File
  if (-not (Test-Path $src)) { Write-Warning "缺失：$src"; continue }
  $out = Join-Path $Tmp ($s.Id + ".mp4")
  $base = "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,setsar=1,fps=30,eq=contrast=1.04:saturation=0.96"
  if ($s.Ov -and (Test-Path $s.Ov)) {
    $fadeOut = [math]::Max(0.5, $s.Dur - 0.35)
    $fc = "[0:v]$base[bg];[1:v]scale=1920:1080,format=rgba,fade=t=in:st=0.1:d=0.3:alpha=1,fade=t=out:st=${fadeOut}:d=0.3:alpha=1[ov];[bg][ov]overlay=0:0:shortest=1,format=yuv420p[v]"
    & ffmpeg -y -v error -ss $s.Start -t $s.Dur -i $src -loop 1 -t $s.Dur -i $s.Ov -filter_complex $fc -map "[v]" -an -c:v libx264 -crf 17 -preset medium $out
  } else {
    $vf = $base + ",format=yuv420p"
    & ffmpeg -y -v error -ss $s.Start -t $s.Dur -i $src -vf $vf -an -c:v libx264 -crf 17 -preset medium $out
  }
  $Segs.Add($out)
}

$Outro = Join-Path $Tmp "99_outro.mp4"
& ffmpeg -y -v error -loop 1 -t 3.8 -i "showreel_overlays\99_outro.png" -vf "scale=1920:1080,fade=t=in:st=0:d=0.45,fade=t=out:st=3.2:d=0.6,format=yuv420p" -r 30 -an -c:v libx264 -crf 17 -preset medium $Outro
$Segs.Add($Outro)

$Concat = Join-Path $Tmp "concat.txt"
$Segs | ForEach-Object { "file '$($_ -replace '\\', '/')'" } | Set-Content -Path $Concat -Encoding ASCII
$Raw = Join-Path $Tmp "raw.mp4"
& ffmpeg -y -v error -f concat -safe 0 -i $Concat -c copy $Raw

& ffmpeg -y -v error -i $Raw -ss 5.0 -t 59.84 -i $BgmFile -map 0:v:0 -map 1:a:0 -c:v copy -af "loudnorm=I=-14:TP=-1.5:LRA=11,afade=t=in:st=0:d=0.8,afade=t=out:st=57.0:d=2.8" -c:a aac -b:a 192k -movflags +faststart $OutFile
Remove-Item $Tmp -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "1080p 高清母版已完成：$OutFile" -ForegroundColor Green
