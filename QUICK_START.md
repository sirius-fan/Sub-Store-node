# 快速启动指南

## 🚀 立即开始

### 1. 安装依赖
```bash
pnpm install
```

### 2. 启动服务

#### 开发模式（推荐用于测试）
```bash
pnpm run server:dev
```

#### 生产模式
```bash
pnpm start
```

### 3. 访问服务

打开浏览器访问：http://localhost:3000

你会看到使用说明和 API 文档。

## 📝 测试 API

### 使用 curl 测试

```bash
# 1. 健康检查
curl http://localhost:3000/health

# 2. 查看使用说明
curl http://localhost:3000/

# 3. 测试转换（需要真实的订阅链接）
curl "http://localhost:3000/?target=clash&url=YOUR_ENCODED_SUBSCRIPTION_URL"
```

### 使用浏览器测试

直接在浏览器中访问：
```
http://localhost:3000/?target=clash&url=YOUR_ENCODED_SUBSCRIPTION_URL
```

## ⚙️ 配置端口

### 方法 1: 使用环境变量
```bash
PORT=8080 pnpm start
```

### 方法 2: 创建 .env 文件
```bash
cp .env.example .env
# 编辑 .env 文件，修改 PORT 值
nano .env
```

## 🔧 常用命令

```bash
# 安装依赖
pnpm install

# 开发模式（带热重载）
pnpm run server:dev

# 生产模式启动
pnpm start

# 使用 PM2 启动（生产环境推荐）
pm2 start ecosystem.config.cjs

# 查看 PM2 状态
pm2 status

# 查看日志
pm2 logs sub-store-node

# 停止服务
pm2 stop sub-store-node

# 重启服务
pm2 restart sub-store-node
```

## 🐳 Docker 快速启动

### 使用 Docker Compose
```bash
# 启动
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止
docker-compose down
```

### 使用 Docker
```bash
# 构建
docker build -t sub-store-node .

# 运行
docker run -d -p 3000:3000 --name sub-store-node sub-store-node

# 查看日志
docker logs -f sub-store-node

# 停止
docker stop sub-store-node

# 删除
docker rm sub-store-node
```

## 🌐 支持的转换格式

- Clash / Clash Meta / Mihomo
- V2Ray
- Quantumult X
- Surge / Surge Mac
- Loon
- Shadowrocket
- Stash
- Surfboard
- Sing-box
- Egern
- Base64 / URI / JSON

## 🆘 遇到问题？

1. **端口被占用**
   ```bash
   # 查看占用端口的进程
   lsof -i :3000
   # 或使用其他端口
   PORT=8080 pnpm start
   ```

2. **依赖安装失败**
   ```bash
   # 清除缓存后重新安装
   pnpm store prune
   pnpm install
   ```

3. **服务启动失败**
   - 检查 Node.js 版本（需要 18.x 或更高）
   - 检查端口是否被占用
   - 查看错误日志

4. **转换失败**
   - 确保订阅链接已正确 URL 编码
   - 检查订阅源是否可访问
   - 验证 target 参数是否正确

## 📚 更多文档

- [完整部署指南](./SERVER_DEPLOY.md)
- [README](./README.md)

## 💡 提示

- 生产环境建议使用 PM2 或 Docker 部署
- 建议配置 Nginx 反向代理
- 定期查看日志以监控服务状态
- 可以配置多实例负载均衡
