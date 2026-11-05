$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$root  = $PSScriptRoot
if (-not $root) { $root = Split-Path -Parent $MyInvocation.MyCommand.Definition }

# Output dir and anti-aliasing hint are overridable so the SAME layout code can
# emit a crisper card set with zero risk of the layout drifting:
#   $env:CARDS_DIR='cards_sharp'; $env:CARDS_AA='gridfit'
$sub    = if ($env:CARDS_DIR) { $env:CARDS_DIR } else { 'cards' }
$outDir = Join-Path $root $sub
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

$aaHint = [System.Drawing.Text.TextRenderingHint]::AntiAlias
if ($env:CARDS_AA -eq 'gridfit') {
    $aaHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
}

$W = 1920; $H = 1080

# ---- read cards.json as UTF-8 ----
$json = Get-Content (Join-Path $root 'cards.json') -Raw -Encoding UTF8 | ConvertFrom-Json

$script:sfCenter = New-Object System.Drawing.StringFormat
$script:sfCenter.Alignment = [System.Drawing.StringAlignment]::Center
$script:sfCenter.LineAlignment = [System.Drawing.StringAlignment]::Near

$script:sfTypo = [System.Drawing.StringFormat]::GenericTypographic

function New-Canvas {
    $bmp = New-Object System.Drawing.Bitmap($W, $H, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = $aaHint
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.Clear([System.Drawing.Color]::Transparent)
    return @($bmp, $g)
}

function C([int]$r, [int]$gg, [int]$b, [int]$a) {
    return [System.Drawing.Color]::FromArgb($a, $r, $gg, $b)
}

# soft shadow + main text, centered by rect, y = top
function Draw-Center {
    param($g, [string]$text, $font, $color, [double]$y, [double]$x = 0, [double]$w = $W)
    $rect = New-Object System.Drawing.RectangleF([float]$x, [float]$y, [float]$w, 300)
        $brush = New-Object System.Drawing.SolidBrush($color)
    $g.DrawString($text, $font, $brush, $rect, $script:sfCenter)
    $brush.Dispose()
}

# letter-spaced text, centered
function Draw-Tracked {
    param($g, [string]$text, $font, $color, [double]$centerX, [double]$y, [double]$tracking)
    $chars = $text.ToCharArray()
    $widths = @()
    $total = 0.0
    foreach ($ch in $chars) {
        if ($ch -eq ' ') { $w = [double]$font.Size * 0.34 } else { $sz = $g.MeasureString([string]$ch, $font, (New-Object System.Drawing.PointF(0, 0)), $script:sfTypo); $w = $sz.Width }
        $widths += $w
        $total += $w
    }
    $total += $tracking * ([math]::Max(0, $chars.Count - 1))
    if ($total -le 0) { return }
    $x = $centerX - $total / 2.0
    $brush = New-Object System.Drawing.SolidBrush($color)
    for ($i = 0; $i -lt $chars.Count; $i++) {
        $g.DrawString([string]$chars[$i], $font, $brush, [float]$x, [float]$y, $script:sfTypo)
        $x += $widths[$i] + $tracking
    }
    $brush.Dispose()
}

function Draw-Left {
    param($g, [string]$text, $font, $color, [double]$x, [double]$y)
    $brush = New-Object System.Drawing.SolidBrush($color)
    $g.DrawString($text, $font, $brush, [float]$x, [float]$y, $script:sfTypo)
    $brush.Dispose()
}

$colIvory   = C 240 226 192 255
$colIvory2  = C 214 202 172 255
$colEn      = C 186 174 146 255
$colEnDim   = C 158 148 124 255
$colWhite   = C 255 255 255 255
$colWhite2  = C 220 214 200 255
$colBody    = C 228 222 208 255

$generated = @()

foreach ($c in $json.cards) {
    $pair = New-Canvas
    $bmp = $pair[0]; $g = $pair[1]

    switch ($c.kind) {

        'title' {
            $fCN = New-Object System.Drawing.Font('STXingkai', 175, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
            $fEN = New-Object System.Drawing.Font('Microsoft YaHei', 30, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
            Draw-Center $g $c.cn $fCN $colIvory 300
            Draw-Tracked $g $c.en $fEN $colEn 960 640 11
            $fCN.Dispose(); $fEN.Dispose()
        }

        'subtitle_card' {
            $fA = New-Object System.Drawing.Font('STZhongsong', 54, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
            $fB = New-Object System.Drawing.Font('STZhongsong', 48, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
            $fC = New-Object System.Drawing.Font('Microsoft YaHei', 24, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
            Draw-Center $g $c.cn $fA $colIvory 430
            Draw-Center $g $c.cn2 $fB $colIvory2 480
            Draw-Tracked $g $c.en $fC $colEnDim 960 522 4
            $fA.Dispose(); $fB.Dispose(); $fC.Dispose()
        }

        'concept' {
            $fH  = New-Object System.Drawing.Font('STKaiti', 46, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
            $fHE = New-Object System.Drawing.Font('Microsoft YaHei', 22, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
            $fB  = New-Object System.Drawing.Font('STZhongsong', 31, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
            Draw-Center $g $c.heading_cn $fH $colIvory 240
            Draw-Tracked $g $c.heading_en $fHE $colEnDim 960 318 8
            $y = 402.0
            foreach ($line in $c.body) {
                Draw-Center $g $line $fB $colBody $y
                $y += 64
            }
            $fH.Dispose(); $fHE.Dispose(); $fB.Dispose()
        }

        'act' {
            $fCN = New-Object System.Drawing.Font('STKaiti', 84, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
            $fEN = New-Object System.Drawing.Font('Microsoft YaHei', 27, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
            $fCN2 = New-Object System.Drawing.Font('STZhongsong', 46, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
            Draw-Center $g $c.cn $fCN $colIvory 400
            Draw-Center $g $c.cn2 $fCN2 $colIvory2 528
            Draw-Tracked $g $c.en $fEN $colEn 960 625 9
            $fCN.Dispose(); $fEN.Dispose()
        }

        'sub' {
            $fCN = New-Object System.Drawing.Font('Microsoft YaHei', 45, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
            $fEN = New-Object System.Drawing.Font('Microsoft YaHei', 26, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
            Draw-Center $g $c.cn $fCN $colWhite 838
            Draw-Tracked $g $c.en $fEN $colWhite2 960 915 1.5
            $fCN.Dispose(); $fEN.Dispose()
        }

        'end_title' {
            $fCN = New-Object System.Drawing.Font('STXingkai', 128, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
            $fEN = New-Object System.Drawing.Font('Microsoft YaHei', 26, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
            Draw-Center $g $c.cn $fCN $colIvory 300
            Draw-Tracked $g $c.en $fEN $colEn 960 470 7
            $fCN.Dispose(); $fEN.Dispose()
        }

        'credit' {
            $fCN = New-Object System.Drawing.Font('Microsoft YaHei', 26, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
            $fEN = New-Object System.Drawing.Font('Microsoft YaHei', 22, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
            Draw-Center $g $c.cn $fCN $colEnDim 490
            Draw-Tracked $g $c.en $fEN $colEnDim 960 560 3
            $fCN.Dispose(); $fEN.Dispose()
        }

        'end_line' {
            $fCN = New-Object System.Drawing.Font('STZhongsong', 44, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
            $fEN = New-Object System.Drawing.Font('Microsoft YaHei', 24, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
            Draw-Center $g $c.cn $fCN $colIvory2 575
            Draw-Tracked $g $c.en $fEN $colEnDim 960 642 2
            $fCN.Dispose(); $fEN.Dispose()
        }

        'end' {
            $fA = New-Object System.Drawing.Font('STXingkai', 128, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
            $fB = New-Object System.Drawing.Font('STZhongsong', 46, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
            $fC = New-Object System.Drawing.Font('Microsoft YaHei', 26, [System.Drawing.FontStyle]::Regular, [System.Drawing.FontStyle]::Regular)
            $fC = New-Object System.Drawing.Font('Microsoft YaHei', 26, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
            $fD = New-Object System.Drawing.Font('Microsoft YaHei', 24, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
            Draw-Center $g $c.cn $fA $colIvory 300
            Draw-Center $g $c.cn2 $fB $colIvory2 470
            Draw-Tracked $g $c.en $fC $colEn 960 590 7
            Draw-Tracked $g $c.en2 $fD $colEnDim 960 645 3
            $fA.Dispose(); $fB.Dispose(); $fC.Dispose(); $fD.Dispose()
        }
    }

    $path = Join-Path $outDir ($c.id + '.png')
    $g.Dispose()
    $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    $generated += ("{0}  {1}  {2}s-{3}s  {4}" -f $c.id, $c.kind, $c.start, $c.end, (Split-Path $path -Leaf))
}

# ---- scrims ----
$pair = New-Canvas; $bmp = $pair[0]; $g = $pair[1]
$g.Clear((C 0 0 0 242))
$g.Dispose(); $bmp.Save((Join-Path $outDir 'scrimFull.png'), [System.Drawing.Imaging.ImageFormat]::Png); $bmp.Dispose()

$pair = New-Canvas; $bmp = $pair[0]; $g = $pair[1]
$rect = New-Object System.Drawing.Rectangle(0, 640, $W, 440)
$grad = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, (C 0 0 0 0), (C 0 0 0 200), [System.Drawing.Drawing2D.LinearGradientMode]::Vertical)
$g.FillRectangle($grad, $rect)
$grad.Dispose(); $g.Dispose()
$bmp.Save((Join-Path $outDir 'scrimBottom.png'), [System.Drawing.Imaging.ImageFormat]::Png); $bmp.Dispose()

$generated | ForEach-Object { $_ }
"---"
"cards generated: $($generated.Count)"
Get-ChildItem $outDir -Filter *.png | ForEach-Object { "{0,-16} {1,7:N0} KB" -f $_.Name, ($_.Length / 1KB) }

# ----  ----
$bmp = New-Object System.Drawing.Bitmap($W, $H)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.Clear([System.Drawing.Color]::FromArgb(255, 5, 4, 4))
$path = New-Object System.Drawing.Drawing2D.GraphicsPath
$path.AddEllipse(-320, -540, 2560, 2160)
$pgb = New-Object System.Drawing.Drawing2D.PathGradientBrush($path)
$pgb.CenterPoint = New-Object System.Drawing.PointF(960.0, 560.0)
$pgb.CenterColor = [System.Drawing.Color]::FromArgb(255, 32, 21, 13)
$sc = New-Object 'System.Drawing.Color[]' $path.PointCount
for ($i = 0; $i -lt $path.PointCount; $i++) { $sc[$i] = [System.Drawing.Color]::FromArgb(255, 5, 4, 4) }
$pgb.SurroundColors = $sc
$g.FillPath($pgb, $path)
$pgb.Dispose(); $path.Dispose(); $g.Dispose()
$bmp.Save((Join-Path $outDir 'prologue_bg.png'), [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()