#!/bin/bash
cd "$(dirname "$0")"
echo "========================================="
echo "正在启动本地预览服务器..."
echo "========================================="

# 自动在浏览器中打开页面
if command -v open &>/dev/null; then
  open "http://localhost:8080"
fi

# 使用 Python 启动轻量级服务器（Mac 自带 Python，无需配置 IDE）
if command -v python3 &>/dev/null; then
  cd dist && python3 -m http.server 8080
elif command -v python &>/dev/null; then
  cd dist && python -m SimpleHTTPServer 8080
else
  # 如果没有 Python，尝试使用 npx (Node.js)
  if command -v npx &>/dev/null; then
    npx serve dist -l 8080
  else
    echo "未检测到 Python 或 Node.js，请确保电脑已安装其中之一。"
    read -p "按回车键退出..."
  fi
fi
