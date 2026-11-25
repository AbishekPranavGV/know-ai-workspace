# KNOW AKS Desktop Software Runner
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "     KNOW AKS — Universal Digital Workspace" -ForegroundColor White
Write-Host "          Launching Native Desktop Mode" -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Cyan

$CurrentDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $CurrentDir

# Verify local production server
$running = $false
try {
    $res = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 2
    if ($res.StatusCode -eq 200) { $running = $true }
} catch {}

if (-not $running) {
    Write-Host "[INFO] Starting KNOW AKS Production Daemon..." -ForegroundColor Yellow
    Start-Process -FilePath "cmd.exe" -ArgumentList "/c npm run start" -WindowStyle Hidden
    Start-Sleep -Seconds 3
}

Write-Host "[INFO] Launching borderless desktop application window..." -ForegroundColor Green

$url = "http://localhost:3000/dashboard"

if (Get-Command msedge -ErrorAction SilentlyContinue) {
    Start-Process "msedge" -ArgumentList "--app=$url", "--window-size=1400,900"
} elseif (Get-Command chrome -ErrorAction SilentlyContinue) {
    Start-Process "chrome" -ArgumentList "--app=$url", "--window-size=1400,900"
} else {
    Start-Process $url
}
