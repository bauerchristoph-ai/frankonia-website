# ---------------------------------------------------------------------------
# Social-share (Open Graph) images: 1200x630 JPEG, one per hero photograph.
# ---------------------------------------------------------------------------
# Run once, in development, from the repo root:
#     powershell -ExecutionPolicy Bypass -File docs/design-sources/og-images.ps1
# It is NOT part of `npm run build` (same convention as the other generators in
# this folder). Output: assets/images/og/<hero-base>.jpg
#
# WHY THIS EXISTS
#   Every page declared twitter:card="summary_large_image" while only the
#   homepage declared an og:image at all - and that file
#   (/assets/images/og-home.jpg) had never been created. So all 54 pages asked
#   social platforms for a large image card and handed them nothing: a link
#   shared to WhatsApp / LinkedIn / Slack rendered as a bare text row.
#
# WHY 1200x630 JPEG AND NOT JUST POINTING og:image AT THE HERO FILE
#   1. Nine of the fifteen hero photographs are PORTRAIT (820x~1222). A portrait
#      og:image is centre-cropped by every platform into a landscape card, which
#      is exactly the crop CLAUDE.md documents as cutting heads off these nine.
#   2. WebP in og:image is unreliable (LinkedIn in particular); JPEG is the safe
#      format, which is what the placeholder comment in pages/index.html already
#      said before this existed.
#   3. 1200x630 is the ratio every platform actually targets (1.905:1).
#
# THE VERTICAL CROP IS NOT A GUESS - it is each hero's OWN object-position from
# the stylesheets, i.e. the framing already reviewed on screen. Horizontal
# position is irrelevant here: every source is narrower in ratio than 1.905:1,
# so the full width is always kept and only height is cropped.
#     herofinal            42%  css/page-home.css (mobile cover rule)
#     hero-werkschutz      42%  css/page-service.css .service-hero__bg img
#     leistungen-hero      50%  css/page-leistungen.css .lh-hero__bg img
#     jobs / ueber-uns /
#     referenzen           50%  no object-position in CSS => browser default
#     the 9 service photos 32%  css/page-service.css (portrait hero bg mode)
#
# TWO OVERRIDES, and the reason matters if anyone re-tunes these:
#   baustellenbewachung and interventionsdienst use 15%, not 32%. The 32% in
#   the stylesheet is calibrated for the ON-PAGE hero, which is a far TALLER
#   box than 1.905:1 - on a phone that box is roughly 0.45:1, so cover crops
#   these 0.668:1 photos on the WIDTH and the vertical percentage barely moves
#   anything. A 1200x630 window is a much harsher cut (430px out of 1222), and
#   at 32% it clipped the helmet crown in one and both heads in the other.
#   Found by rendering all fifteen as a contact sheet and looking, not by
#   reading the number.
#   veranstaltungsschutz stays at 32% deliberately: its subject is shot from
#   behind and the FRANKONIA SICHERHEITSDIENST lettering on his back sits near
#   y=750, so no 430px window can hold both the head and the lettering. Head
#   plus crowd is the stronger card.
# ---------------------------------------------------------------------------

Add-Type -AssemblyName System.Drawing

$ErrorActionPreference = "Stop"
$repo = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$srcDir = Join-Path $repo "assets\images"
$outDir = Join-Path $srcDir "og"
$TARGET_W = 1200
$TARGET_H = 630
$QUALITY  = 82

# source file (without .jpg)  ->  vertical crop position, output name
$JOBS = @(
  @{ src = "herofinal-1347";       v = 0.42; out = "herofinal" },
  @{ src = "hero-werkschutz-1536"; v = 0.42; out = "hero-werkschutz" },
  @{ src = "leistungen-hero-1578"; v = 0.50; out = "leistungen-hero" },
  @{ src = "jobs-hero";            v = 0.50; out = "jobs-hero" },
  @{ src = "uu-hero-team-1280";    v = 0.50; out = "uu-hero-team" },
  @{ src = "referenzen-hero";      v = 0.50; out = "referenzen-hero" },
  @{ src = "baustellenbewachung";  v = 0.15; out = "baustellenbewachung" },   # override, see below
  @{ src = "brandwache";           v = 0.32; out = "brandwache" },
  @{ src = "empfangsdienst";       v = 0.32; out = "empfangsdienst" },
  @{ src = "interventionsdienst";  v = 0.15; out = "interventionsdienst" },   # override, see below
  @{ src = "kaufhausdetektei";     v = 0.32; out = "kaufhausdetektei" },
  @{ src = "objektschutz";         v = 0.32; out = "objektschutz" },
  @{ src = "revier-schliessdienst";v = 0.32; out = "revier-schliessdienst" },
  @{ src = "sicherheitstechnik";   v = 0.32; out = "sicherheitstechnik" },
  @{ src = "veranstaltungsschutz"; v = 0.32; out = "veranstaltungsschutz" }
)

if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir | Out-Null }

$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
         Where-Object { $_.MimeType -eq "image/jpeg" }
$encParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
  [System.Drawing.Imaging.Encoder]::Quality, [int]$QUALITY)

$targetRatio = $TARGET_W / $TARGET_H

foreach ($job in $JOBS) {
  $srcPath = Join-Path $srcDir ($job.src + ".jpg")
  if (-not (Test-Path $srcPath)) { throw "missing source: $srcPath" }

  $img = [System.Drawing.Image]::FromFile($srcPath)
  try {
    # Crop window: keep the full width, take the tallest 1.905:1 slice that fits,
    # positioned by this hero's own object-position percentage.
    $cropW = $img.Width
    $cropH = [int][math]::Round($cropW / $targetRatio)
    if ($cropH -gt $img.Height) {
      # A source WIDER than 1.905:1 would crop horizontally instead. None of the
      # current fifteen is, so this is a guard, not a code path in use.
      $cropH = $img.Height
      $cropW = [int][math]::Round($cropH * $targetRatio)
    }
    $x = [int][math]::Round(($img.Width  - $cropW) * 0.5)
    $y = [int][math]::Round(($img.Height - $cropH) * $job.v)

    $bmp = New-Object System.Drawing.Bitmap($TARGET_W, $TARGET_H)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    try {
      $g.InterpolationMode  = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
      $g.PixelOffsetMode    = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
      $g.SmoothingMode      = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
      $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
      $srcRect  = New-Object System.Drawing.Rectangle($x, $y, $cropW, $cropH)
      $destRect = New-Object System.Drawing.Rectangle(0, 0, $TARGET_W, $TARGET_H)
      $g.DrawImage($img, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
    } finally { $g.Dispose() }

    $outPath = Join-Path $outDir ($job.out + ".jpg")
    $bmp.Save($outPath, $codec, $encParams)
    $bmp.Dispose()

    $kb = [math]::Round((Get-Item $outPath).Length / 1KB)
    Write-Output ("{0,-24} {1,4}x{2,-4} crop {3},{4} {5}x{6}  ->  {7} KB" -f `
      $job.out, $img.Width, $img.Height, $x, $y, $cropW, $cropH, $kb)
  } finally { $img.Dispose() }
}

Write-Output "done - $($JOBS.Count) images in assets/images/og/"
