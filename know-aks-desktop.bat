@echo off
title KNOW AKS Desktop Software
echo ===================================================
echo     KNOW AKS — Universal Digital Workspace
echo           Launching Native Desktop Mode
echo ===================================================
echo.

cd /d "%~dp0"

:: Check if server is responding on port 3000
powershell -Command "try { $r = Invoke-WebRequest -Uri 'http://localhost:3000' -UseBasicParsing -TimeoutSec 2; exit 0 } catch { exit 1 }"
if %ERRORLEVEL% NEQ 0 (
    echo [INFO] Starting KNOW AKS Production Daemon in background...
    start /min "" cmd /c "npm run start"
    timeout /t 3 /nobreak >nul
)

echo [INFO] Launching borderless desktop software window...

:: Try Edge in App mode (installed on 100% of Windows 10/11)
where msedge >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    start "" msedge --app="http://localhost:3000/dashboard" --window-size=1400,900
    exit /b 0
)

:: Try Chrome in App mode
where chrome >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    start "" chrome --app="http://localhost:3000/dashboard" --window-size=1400,900
    exit /b 0
)

:: Fallback to default browser
start "" "http://localhost:3000/dashboard"
exit /b 0
