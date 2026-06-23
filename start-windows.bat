@echo off
chcp 65001 >nul
title 本地预览服务器
cd /d %~dp0
echo =========================================
echo 正在启动本地预览服务器...
echo =========================================

:: 尝试在浏览器中打开页面
start http://localhost:8080

:: 优先使用 Python（如果安装了）
python --version >nul 2>&1
if %errorlevel% equ 0 (
    cd dist && python -m http.server 8080
    goto end
)

:: 其次尝试使用 Node.js 的 npx serve
npx --version >nul 2>&1
if %errorlevel% equ 0 (
    npx serve dist -l 8080
    goto end
)

echo.
echo 未检测到 Python 或 Node.js 环境。
echo 请尝试双击 dist 目录下的 index.html，或者安装 Node.js。
echo.
pause

:end
