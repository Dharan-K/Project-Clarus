@echo off
REM ============================================================
REM  Clarus - Website only (the dashboard / Console)
REM  Double-click this file to run just the website.
REM  Good for screenshots and the demo - no AI or UiPath needed.
REM ============================================================
cd /d "%~dp0"
title Clarus - Website

echo ============================================================
echo   Starting the Clarus website...
echo   When it is ready, open:  http://localhost:5173
echo   Press Ctrl+C in this window to stop it.
echo ============================================================
echo.

if not exist "node_modules" (
  echo First run detected - installing packages, please wait...
  call npm install
  echo.
)

call npm run dev
pause
