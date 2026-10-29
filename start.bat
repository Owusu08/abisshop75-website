@echo off
title ABISSHOP 75 - local preview
cd /d "%~dp0"
echo.
echo  ABISSHOP 75 is starting at  http://localhost:8080
echo  Keep this window open while presenting. Press Ctrl+C to stop.
echo.
start "" http://localhost:8080
where py >nul 2>nul && (py -m http.server 8080 & goto :eof)
where python >nul 2>nul && (python -m http.server 8080 & goto :eof)
where npx >nul 2>nul && (npx --yes serve -l 8080 . & goto :eof)
echo Could not find Python or Node. Just double-click index.html instead - the site works that way too.
pause
