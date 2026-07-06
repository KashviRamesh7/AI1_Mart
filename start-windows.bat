@echo off
title AI1 Mart Launcher
color 0B
echo.
echo  ============================================
echo    AI1 MART - All In One Mart
echo    Starting all services...
echo  ============================================
echo.

echo  [1/3] Checking MongoDB...
net start MongoDB >nul 2>&1
echo  MongoDB started (or already running)
echo.

echo  [2/3] Starting Backend Server...
start "AI1Mart - Backend" cmd /k "cd /d %~dp0backend && npm install --silent && npm run dev"
timeout /t 5 /nobreak >nul

echo  [3/3] Starting Frontend...
start "AI1Mart - Frontend" cmd /k "cd /d %~dp0frontend && npm install --silent && npm start"

echo.
echo  ============================================
echo  RUNNING!
echo  Backend  → http://localhost:5000
echo  Frontend → http://localhost:3000
echo  ============================================
echo.
echo  First time? Open a new terminal and run:
echo    node seed.js
echo.
pause
