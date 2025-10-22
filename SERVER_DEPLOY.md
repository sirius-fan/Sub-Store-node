# Sub-Store Node 服务器部署指南

本项目现已支持部署到服务器，同时保持与 Cloudflare Workers 版本的完全兼容。

## 功能特性

- ✅ 完全兼容原有 API 接口
- ✅ 支持所有转换格式（Clash、V2Ray、Surge、Loon 等）
- ✅ 支持多订阅合并
- ✅ 基于 Express 框架，性能稳定
- ✅ 支持 PM2 集群模式部署

## 快速开始

### 1. 安装依赖

使用 pnpm 安装依赖（推荐）：

```bash
pnpm install
```

或使用 npm：

```bash
npm install
```

### 2. 启动服务

#### 开发模式（带热重载）

```bash
pnpm run server:dev
```

#### 生产模式

```bash
pnpm start
```

服务默认运行在 `http://localhost:3000`

### 3. 配置端口

创建 `.env` 文件（可选）：

```bash
cp .env.example .env
```

编辑 `.env` 文件设置端口：

```env
PORT=3000
```

或通过环境变量启动：

```bash
PORT=8080 pnpm start
```

## 生产环境部署

### 使用 PM2（推荐）

PM2 是一个强大的 Node.js 进程管理工具，支持负载均衡、自动重启等功能。

#### 安装 PM2

```bash
pnpm add -g pm2
```

#### 启动服务

```bash
# 启动应用
pm2 start ecosystem.config.cjs

# 查看状态
pm2 status

# 查看日志
pm2 logs sub-store-node

# 重启应用
pm2 restart sub-store-node

# 停止应用
pm2 stop sub-store-node

# 删除应用
pm2 delete sub-store-node
```

#### 开机自启

```bash
# 保存当前进程列表
pm2 save

# 生成开机启动脚本
pm2 startup
```

### 使用 systemd

创建服务文件 `/etc/systemd/system/sub-store-node.service`：

```ini
[Unit]
Description=Sub-Store Node Conversion Service
After=network.target

[Service]
Type=simple
User=your-username
WorkingDirectory=/path/to/Sub-Store-node
Environment=NODE_ENV=production
Environment=PORT=3000
ExecStart=/usr/bin/node /path/to/Sub-Store-node/server.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

启动服务：

```bash
sudo systemctl daemon-reload
sudo systemctl enable sub-store-node
sudo systemctl start sub-store-node
sudo systemctl status sub-store-node
```

### 使用 Docker

创建 `Dockerfile`：

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --prod

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
```

构建并运行：

```bash
docker build -t sub-store-node .
docker run -d -p 3000:3000 --name sub-store-node sub-store-node
```

### 使用 Nginx 反向代理

配置 Nginx（`/etc/nginx/sites-available/sub-store`）：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

启用配置：

```bash
sudo ln -s /etc/nginx/sites-available/sub-store /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## API 使用说明

### 接口地址

```
GET /?target=<平台>&url=<订阅链接>
```

### 参数说明

- `target`: 目标平台类型
  - 支持格式: `singbox`, `mihomo`, `v2ray`, `base64`, `qx`, `QuantumultX`, `surge`, `Surge`, `SurgeMac`, `Loon`, `Clash`, `meta`, `clashmeta`, `Mihomo`, `uri`, `json`, `stash`, `Stash`, `shadowrocket`, `Shadowrocket`, `surfboard`, `Surfboard`, `egern`, `Egern`
  
- `url`: URL 编码后的订阅链接
  - 支持多个订阅，使用逗号 `,` 分隔

### 使用示例

#### 单个订阅转换

```bash
# 转换为 Clash 格式
curl "http://localhost:3000/?target=clash&url=https%3A%2F%2Fexample.com%2Fsubscription"

# 转换为 V2Ray 格式
curl "http://localhost:3000/?target=v2ray&url=https%3A%2F%2Fexample.com%2Fsubscription"
```

#### 多个订阅合并

```bash
curl "http://localhost:3000/?target=clash&url=https%3A%2F%2Fexample.com%2Fsub1,https%3A%2F%2Fexample.com%2Fsub2"
```

#### 健康检查

```bash
curl http://localhost:3000/health
```

## 迁移说明

从 Cloudflare Workers 迁移到服务器部署：

1. **API 完全兼容**：无需修改客户端代码，只需更改请求地址
2. **环境变量**：如有特殊配置，通过 `.env` 文件或环境变量设置
3. **性能优化**：服务器版本支持集群模式，可充分利用多核 CPU

## 同时支持两种部署方式

### Cloudflare Workers 部署

```bash
pnpm run build
pnpm run deploy
```

### 服务器部署

```bash
pnpm install
pnpm start
```

## 故障排除

### 端口被占用

```bash
# 查找占用端口的进程
lsof -i :3000

# 或使用其他端口
PORT=8080 pnpm start
```

### 查看日志

```bash
# PM2 日志
pm2 logs sub-store-node

# systemd 日志
sudo journalctl -u sub-store-node -f
```

### 权限问题

确保 Node.js 和项目文件具有正确的权限：

```bash
chmod +x server.js
chown -R your-user:your-group /path/to/Sub-Store-node
```

## 性能建议

1. **使用 PM2 集群模式**：充分利用多核 CPU
2. **配置 Nginx 反向代理**：提供缓存、负载均衡等功能
3. **监控资源使用**：使用 `pm2 monit` 监控应用状态
4. **定期更新依赖**：保持依赖包最新以获取安全更新

## 许可证

GPL-3.0

## 支持

如有问题，请提交 Issue。
