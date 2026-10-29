@echo off
title Share Dukaan Khata Public Link
color 0B
echo ============================================================
echo   Generating Free Public Link for Dukaan Khata...
echo ============================================================
echo.
echo Make sure the server is already running (via START_APP.bat).
echo This will generate a public link you can share on WhatsApp
echo so anyone can test the site from their phone or internet!
echo.
cd /d "%~dp0"
npx --yes localtunnel --port 5000
pause
