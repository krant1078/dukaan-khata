@echo off
title Dukaan Khata - Digital Ledger Server
color 0A
echo ============================================================
echo   Starting Dukaan Khata Full-Stack Server...
echo ============================================================
echo.

cd /d "%~dp0"

echo [1/3] Checking Node.js installation...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not found. Please install Node.js from https://nodejs.org
    pause
    exit /b
)

echo [2/3] Opening Dukaan Khata in your web browser...
start "" "http://localhost:5000"

echo [3/3] Launching Node.js Backend Server on port 5000...
echo.
echo Local Web App:   http://localhost:5000
echo Login / Register: http://localhost:5000/login.html
echo.
echo Press Ctrl + C to stop the server at any time.
echo ============================================================
node server.js
pause
