Add-Type -AssemblyName System.Drawing

$srcPath = Join-Path $PSScriptRoot "public\reference_dashboard.jpg"
$src = [System.Drawing.Image]::FromFile($srcPath)

# 1. Sidebar bottom saffron card: x: 0 to 148, y: 440 to 636
$rectCard = New-Object System.Drawing.Rectangle(0, 440, 148, 196)
$cropCard = New-Object System.Drawing.Bitmap(148, 196)
$gCard = [System.Drawing.Graphics]::FromImage($cropCard)
$gCard.DrawImage($src, 0, 0, $rectCard, [System.Drawing.GraphicsUnit]::Pixel)
$cropCard.Save((Join-Path $PSScriptRoot "public\sidebar-saffron-card.jpg"), [System.Drawing.Imaging.ImageFormat]::Jpeg)
$gCard.Dispose()
$cropCard.Dispose()

# 2. Entire left sidebar background: x: 0 to 148, y: 122 to 636
$rectSidebar = New-Object System.Drawing.Rectangle(0, 122, 148, 514)
$cropSidebar = New-Object System.Drawing.Bitmap(148, 514)
$gSidebar = [System.Drawing.Graphics]::FromImage($cropSidebar)
$gSidebar.DrawImage($src, 0, 0, $rectSidebar, [System.Drawing.GraphicsUnit]::Pixel)
$cropSidebar.Save((Join-Path $PSScriptRoot "public\sidebar-bg.jpg"), [System.Drawing.Imaging.ImageFormat]::Jpeg)
$gSidebar.Dispose()
$cropSidebar.Dispose()

# 3. Cultural Header background: x: 0 to 1024, y: 0 to 122
$rectHeader = New-Object System.Drawing.Rectangle(0, 0, 1024, 122)
$cropHeader = New-Object System.Drawing.Bitmap(1024, 122)
$gHeader = [System.Drawing.Graphics]::FromImage($cropHeader)
$gHeader.DrawImage($src, 0, 0, $rectHeader, [System.Drawing.GraphicsUnit]::Pixel)
$cropHeader.Save((Join-Path $PSScriptRoot "public\header-bg.jpg"), [System.Drawing.Imaging.ImageFormat]::Jpeg)
$gHeader.Dispose()
$cropHeader.Dispose()

$src.Dispose()
Write-Output "Assets successfully extracted from reference image!"
