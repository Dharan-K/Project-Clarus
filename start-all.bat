@echo off
REM ============================================================
REM  Clarus - FULL system launcher (for a UiPath demo)
REM  Double-click this file. It opens 3 windows:
REM    1. AI Agents   (port 8000)
REM    2. Tunnel      (gives a public URL for UiPath)
REM    3. Website     (http://localhost:5173)
REM ============================================================
cd /d "%~dp0"
title Clarus launcher

echo ============================================================
echo   Starting Clarus (full system)
echo ============================================================
echo.

if not exist "agents\.env" (
  echo [!] WARNING: agents\.env is missing.
  echo     Create it with ONE line:
  echo         OPENROUTER_API_KEY=sk-or-v1-your-key-here
  echo     The AI agents will not work without it.
  echo.
  pause
)

echo Opening 3 windows...
echo.

REM 1) AI Agents
start "Clarus - AI Agents (port 8000)" cmd /k "cd /d "%~dp0agents" && uvicorn server:app --port 8000"

REM give the agents a moment to boot before the tunnel connects
timeout /t 3 >nul

REM 2) Tunnel (cloudflared) - prints the public https URL
start "Clarus - Tunnel (copy the URL)" cmd /k ""C:\Program Files (x86)\cloudflared\cloudflared.exe" tunnel --url http://localhost:8000"

REM 3) Website
start "Clarus - Website (localhost:5173)" cmd /k "cd /d "%~dp0" && npm run dev"

echo ============================================================
echo   Three windows opened:
echo.
echo    1. AI Agents - wait for "Application startup complete"
echo    2. Tunnel    - COPY the https://....trycloudflare.com URL
echo                   (add /demo on the end for UiPath)
echo    3. Website   - open http://localhost:5173
echo.
echo   Keep all three windows OPEN while you demo.
echo   Close them when you are done.
echo ============================================================
echo.
pause
