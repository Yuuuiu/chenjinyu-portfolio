$ErrorActionPreference = 'Stop'

# ------------------------------------------------------------------
# v18 = the same film as v17, but with the text layer re-rendered crisp.
#
# Why a rebuild instead of an overlay: baked text and a freshly rendered copy
# are not pixel-aligned (3.2% of pixels differ after the yuv420p round trip),
# so compositing new text on top produces visible double edges.
#
# Held identical to v17:
#   - same card text / fonts / sizes / positions (cards.json, same gen_cards.ps1,
#     only the AA hint changes: AntiAlias -> AntiAliasGridFit)
#   - same scrims (scrimHalf alpha 125 in the prologue, scrimBottom in the body)
#   - same card timings (absolute film time from cards.json)
#   - same audio: stream-copied from v17, untouched
#
# Timeline: prologue 17.75 | body 122.85 | technical 12.9 | ending 10.9 = 164.4
# The body maps 1:1 onto the body source with a constant -17.75 s offset.
#
# NOTE: ASCII ONLY. Windows PowerShell 5.1 reads .ps1 as ANSI, and a multi-byte
# character in a COMMENT can swallow the line ending and comment out the next
# line of code. Never put Chinese in this file.
# ------------------------------------------------------------------

$ff    = 'D:\JianyingPro\11.5.0.14471\ffmpeg.exe'
$root  = $PSScriptRoot
$daily = (Get-Content (Join-Path $root 'paths.json') -Raw -Encoding UTF8 | ConvertFrom-Json).daily_dir

$cfg18 = Get-Content (Join-Path $root 'v18_build.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$cfg16 = Get-Content (Join-Path $root 'v16_build.json') -Raw -Encoding UTF8 | ConvertFrom-Json

$v17  = Join-Path $root $cfg18.input_v17
$out  = Join-Path $root $cfg18.out
$work = Join-Path $root 'v18parts'
New-Item -ItemType Directory -Force -Path $work | Out-Null

$cards = Join-Path $root 'cards_sharp'
$srcP  = Join-Path $daily $cfg16.source_prologue
$srcB  = Join-Path $daily $cfg16.source_body
$tdOv  = Join-Path $root 'td_ov'

foreach ($f in @($v17, $srcP, $srcB)) { if (-not (Test-Path $f)) { throw "missing input: $f" } }

$cardsJson = Get-Content (Join-Path $root 'cards.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$v17cfg    = Get-Content (Join-Path $root 'v17_build.json') -Raw -Encoding UTF8 | ConvertFrom-Json

$PRO = 18.05; $BODY = 122.55; $TECH = 12.9; $TAIL = 10.9
$TOTAL = $PRO + $BODY + $TECH + $TAIL
$OFF = 18.05

$ENC = @('-c:v','h264_nvenc','-preset','p5','-tune','hq','-rc','vbr','-cq','12',
         '-b:v','30M','-maxrate','60M','-bufsize','90M','-pix_fmt','yuv420p',
         '-r','30','-g','30','-bf','0')

function RunPart($name, $argList, $graph, $outFile, $dur) {
    $fc = $graph -join ';'
    if ($fc -match '==' -or $fc -match '=,') { throw "empty var in $name graph" }
    $fc | Out-File (Join-Path $work "$name.filter.txt") -Encoding UTF8
    $a = @('-hide_banner','-loglevel','warning','-y') + $argList + @('-filter_complex',$fc,'-map','[out]','-an') + $ENC + @($outFile)
    & $ff @a
    if ($LASTEXITCODE -ne 0) { throw "$name failed (exit $LASTEXITCODE)" }
    if (-not (Test-Path $outFile)) { throw "$name produced no file" }
    "  [ok] $name  $([math]::Round((Get-Item $outFile).Length/1MB,1)) MB  (target ${dur}s)"
}

# ===================== 1) PROLOGUE =====================
"=== 1/5 prologue (${PRO}s) ==="
$segs = @(@(94.0,4.5), @(99.0,5.0), @(104.5,8.55))
$pargs = @(); $fc = @()
for ($i=0; $i -lt 3; $i++) {
    $pargs += @('-ss',"$($segs[$i][0])",'-t',"$($segs[$i][1]+0.4)",'-i',$srcP)
    $fc += "[$($i):v]scale=1920:1080,setsar=1,trim=duration=$($segs[$i][1]),setpts=PTS-STARTPTS,fps=30[b$($i)]"
}
$fc += "[b0][b1][b2]concat=n=3:v=1:a=0[base]"
$pargs += @('-loop','1','-framerate','30','-t',"$PRO",'-i',(Join-Path $cards 'scrimHalf.png'))
foreach ($cp in @('T1.png','T2.png','T3.png')) { $pargs += @('-loop','1','-framerate','30','-t',"$PRO",'-i',(Join-Path $cards $cp)) }
function Win($id) { $c = $cardsJson.cards | Where-Object { $_.id -eq $id }; return @($c.start,($c.end-$c.fade_out),$c.fade_out) }
$w1 = Win 'T1'; $w2 = Win 'T2'; $w3 = Win 'T3'
$fc += "[3:v]format=rgba,fade=t=in:st=0.2:d=1.7:alpha=1,fade=t=out:st=16.55:d=1.5:alpha=1[sc]"
$fc += "[base][sc]overlay=0:0:format=auto[o1]"
$fc += "[4:v]format=rgba,fade=t=in:st=$($w1[0]):d=$($w1[2]):alpha=1,fade=t=out:st=$($w1[1]):d=$($w1[2]):alpha=1[c1]"
$fc += "[o1][c1]overlay=0:0:format=auto[o2]"
$fc += "[5:v]format=rgba,fade=t=in:st=$($w2[0]):d=$($w2[2]):alpha=1,fade=t=out:st=$($w2[1]):d=$($w2[2]):alpha=1[c2]"
$fc += "[o2][c2]overlay=0:0:format=auto[o3]"
$fc += "[6:v]format=rgba,fade=t=in:st=$($w3[0]):d=$($w3[2]):alpha=1,fade=t=out:st=$($w3[1]):d=$($w3[2]):alpha=1[c3]"
$fc += "[o3][c3]overlay=0:0:format=auto,fade=t=in:st=0:d=1.1,format=yuv420p[out]"
RunPart 'p1_prologue' $pargs $fc (Join-Path $work 'p1.mp4') $PRO

# ===================== 2) BODY, SEGMENTED =====================
# One 122.85 s body with 16 looped 1080p card streams runs out of memory
# (ENOMEM -12): each "-loop 1 -t 122.85" image input has to produce 3686
# frames. Split into 4 segments, so each pass holds only 3-4 cards / ~920
# frames. Concatenating the segments back is identical.
$bodyCards = @($cardsJson.cards | Where-Object {
    ([double]$_.start -ge 19.0) -and ([double]$_.start -lt 140.6)
})
# Segment boundaries are placed INSIDE card-free gaps (in absolute film time),
# so no card ever straddles a boundary. That matters because ffmpeg's fade
# filter rejects a negative st, so a straddling card could not be continued
# into the next segment without restarting its fade-in.
$bounds = @(18.05, 48.6, 77.0, 108.4, 140.6)
$segN = $bounds.Count - 1
"=== 2/5 body (${BODY}s, $($bodyCards.Count) cards, $segN segments) ==="
if ($bodyCards.Count -lt 10) { throw "body card selection looks wrong ($($bodyCards.Count))" }

# verify no card crosses a boundary
foreach ($c in $bodyCards) {
    foreach ($b in $bounds[1..($bounds.Count-2)]) {
        if (([double]$c.start -lt $b) -and ([double]$c.end -gt $b)) {
            throw "card $($c.id) straddles boundary $b"
        }
    }
}
"  boundary check: OK (no card straddles)"

$bodyParts = @()
for ($s = 0; $s -lt $segN; $s++) {
    $absStart = $bounds[$s]
    $absEnd   = $bounds[$s+1]
    $len      = [math]::Round($absEnd - $absStart, 4)
    $srcStart = [math]::Round($absStart - $OFF, 4)

    $inSeg = @($bodyCards | Where-Object {
        ([double]$_.start -ge $absStart) -and ([double]$_.end -le $absEnd)
    })

    $bargs = @('-ss', "$srcStart", '-t', "$([math]::Round($len + 0.4,3))", '-i', $srcB)
    $bargs += @('-loop','1','-framerate','30','-t',"$len",'-i',(Join-Path $cards 'scrimBottom.png'))
    $fc = @("[0:v]scale=1920:1080,setsar=1,trim=duration=$len,setpts=PTS-STARTPTS,fps=30[plate]")
    $fc += "[1:v]format=rgba[sc]"
    $fc += "[plate][sc]overlay=0:0:format=auto[acc0]"
    $prev = 'acc0'
    $k = 0
    foreach ($c in $inSeg) {
        $idx = 2 + $k
        $bargs += @('-loop','1','-framerate','30','-t',"$len",'-i',(Join-Path $cards ($c.id + '.png')))
        # local time base is the segment start
        $ls = [math]::Round(([double]$c.start - $absStart), 3)
        $lo = [math]::Round(([double]$c.end - [double]$c.fade_out - $absStart), 3)
        $fc += "[$($idx):v]format=rgba,fade=t=in:st=$($ls):d=$($c.fade_in):alpha=1,fade=t=out:st=$($lo):d=$($c.fade_out):alpha=1[k$($k)]"
        $fc += "[$($prev)][k$($k)]overlay=0:0:format=auto[acc$($k+1)]"
        $prev = "acc$($k+1)"
        $k++
    }
    $fc += "[$($prev)]format=yuv420p[out]"

    $tag = "p2_body$($s+1)"
    $file = Join-Path $work "$tag.mp4"
    "  segment $($s+1): film $absStart..$absEnd (src $srcStart, ${len}s)  cards: $(($inSeg | ForEach-Object { $_.id }) -join ',')"
    RunPart $tag $bargs $fc $file $len
    $bodyParts += $file
}

# ===================== 3) TECHNICAL =====================
"=== 3/5 technical (${TECH}s) ==="
$clips = Get-ChildItem $daily -Filter 'TouchDesigner*.mp4' | Sort-Object Name
$targs = @(); $fc = @()
$shots = $v17cfg.shots
$shotLen = $v17cfg.shot_len; $xdur = $v17cfg.xfade
$step = $shotLen - $xdur
for ($i=0; $i -lt $shots.Count; $i++) {
    $targs += @('-ss',"$($shots[$i].t)",'-t',"$($shotLen+0.4)",'-i',$clips[$shots[$i].clip - 1].FullName)
    $fc += "[$($i):v]crop=2496:1404:0:0,scale=1920:1080:flags=lanczos,trim=duration=$($shotLen),setpts=PTS-STARTPTS,setsar=1,fps=30[t$($i)]"
}
$n = $shots.Count
for ($i=0; $i -lt $n-1; $i++) {
    $off = $step * ($i+1)
    $prev = if ($i -eq 0) { "[t0]" } else { "[x$($i)]" }
    $fc += "$($prev)[t$($i+1)]xfade=transition=fade:duration=$($xdur):offset=$($off)[x$($i+1)]"
}
$targs += @('-loop','1','-framerate','30','-t',"$TECH",'-i',(Join-Path $tdOv 'sec_title.png'))
for ($i=0; $i -lt $n; $i++) { $targs += @('-loop','1','-framerate','30','-t',"$TECH",'-i',(Join-Path $tdOv ("n$($i+1).png"))) }
$titleIdx = $n
$fc += "[$($titleIdx):v]format=rgba,fade=t=in:st=0.3:d=0.8:alpha=1,fade=t=out:st=2.2:d=0.8:alpha=1[ovt]"
$fc += "[x$($n-1)][ovt]overlay=0:0:format=auto[vT1]"
for ($i=0; $i -lt $n; $i++) {
    $si  = $titleIdx + 1 + $i
    $lin = [math]::Round($step*$i + 1.4, 2)
    $lout= [math]::Round($step*$i + $shotLen - 0.9, 2)
    $fc += "[$($si):v]format=rgba,fade=t=in:st=$($lin):d=0.4:alpha=1,fade=t=out:st=$($lout):d=0.4:alpha=1[ov$($i)]"
    $pr = if ($i -eq 0) { "[vT1]" } else { "[vT$($i)]" }
    $fc += "$($pr)[ov$($i)]overlay=0:0:format=auto[vT$($i+1)]"
}
$fc += "[vT$($n)]fade=t=in:st=0:d=0.5,fade=t=out:st=$([math]::Round($TECH-0.6,2)):d=0.6,format=yuv420p[out]"
RunPart 'p3_tech' $targs $fc (Join-Path $work 'p3.mp4') $TECH

# ===================== 4) ENDING =====================
"=== 4/5 ending (${TAIL}s) ==="
$eargs = @('-f','lavfi','-i',"color=c=black:s=1920x1080:r=30:d=$TAIL")
$fc = @("[0:v]format=yuv420p[acc]")
$k = 0; $prev = 'acc'
foreach ($id in @('E1','E2','E3')) {
    $c = $cardsJson.cards | Where-Object { $_.id -eq $id }
    $idx = 1 + $k
    $eargs += @('-loop','1','-framerate','30','-t',"$TAIL",'-i',(Join-Path $cards ($id + '.png')))
    # ending cards sit at v15 time + 12.9; this segment starts at 153.5
    $ls = [math]::Round(([double]$c.start + 12.9 - 153.5), 2)
    $lo = [math]::Round(([double]$c.end + 12.9 - 153.5 - [double]$c.fade_out), 2)
    if ($ls -lt 0) { $ls = 0 }
    $fc += "[$($idx):v]format=rgba,fade=t=in:st=$($ls):d=$($c.fade_in):alpha=1,fade=t=out:st=$($lo):d=$($c.fade_out):alpha=1[e$($k)]"
    $fc += "[$($prev)][e$($k)]overlay=0:0:format=auto[eacc$($k)]"
    $prev = "eacc$($k)"; $k++
}
$fc += "[$($prev)]format=yuv420p[out]"
RunPart 'p4_ending' $eargs $fc (Join-Path $work 'p4.mp4') $TAIL

# ===================== 5) CONCAT + AUDIO =====================
"=== 5/5 concat + v17 audio ==="
$list = Join-Path $work 'concat.txt'
$lines = @("file '$(Join-Path $work 'p1.mp4')'")
foreach ($bp in $bodyParts) { $lines += "file '$bp'" }
$lines += "file '$(Join-Path $work 'p3.mp4')'"
$lines += "file '$(Join-Path $work 'p4.mp4')'"
# UTF-8: the concat demuxer reads UTF-8, and these paths contain Chinese
[System.IO.File]::WriteAllLines($list, $lines, [System.Text.UTF8Encoding]::new($false))

& $ff -hide_banner -loglevel warning -y -f concat -safe 0 -i $list -i $v17 `
   -map '0:v' -map '1:a' -c:v copy -c:a copy -t $TOTAL -movflags '+faststart' $out
"concat exit=$LASTEXITCODE"
if (Test-Path $out) { "v18: {0:N1} MB" -f ((Get-Item $out).Length/1MB) }
