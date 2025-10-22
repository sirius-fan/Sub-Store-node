#!/bin/bash

echo "======================================"
echo "Sub-Store Node 服务器功能测试"
echo "======================================"
echo ""

# 检查服务器是否运行
echo "📡 检查服务器状态..."
if curl -s http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ 服务器运行正常"
else
    echo "❌ 服务器未运行，请先启动服务器：pnpm start"
    exit 1
fi

echo ""
echo "======================================"
echo "测试 1: 健康检查接口"
echo "======================================"
curl -s http://localhost:3000/health | jq . || echo "请安装 jq 工具以格式化 JSON 输出"

echo ""
echo "======================================"
echo "测试 2: 使用说明接口"
echo "======================================"
curl -s "http://localhost:3000/" | jq . || echo "请安装 jq 工具以格式化 JSON 输出"

echo ""
echo "======================================"
echo "测试 3: 404 处理"
echo "======================================"
curl -s http://localhost:3000/notfound | jq . || echo "请安装 jq 工具以格式化 JSON 输出"

echo ""
echo "======================================"
echo "测试 4: 缺少参数"
echo "======================================"
curl -s "http://localhost:3000/?target=clash" | jq . || echo "请安装 jq 工具以格式化 JSON 输出"

echo ""
echo "======================================"
echo "测试完成！"
echo "======================================"
