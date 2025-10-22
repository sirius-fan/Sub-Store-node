# Cloudflare Workers vs 服务器部署对比

## 📊 部署方式对比

| 特性 | Cloudflare Workers | 服务器部署 |
|------|-------------------|-----------|
| **部署难度** | ⭐⭐⭐ 简单 | ⭐⭐⭐⭐ 中等 |
| **成本** | 免费额度充足 | 需要服务器成本 |
| **性能** | 全球 CDN 加速 | 取决于服务器配置和位置 |
| **可控性** | 受限于 Workers 限制 | 完全可控 |
| **扩展性** | 自动扩展 | 需要手动配置负载均衡 |
| **监控** | Cloudflare Dashboard | 需自行配置（PM2、Docker等）|
| **自定义** | 受限 | 完全自定义 |
| **适用场景** | 个人使用、小规模 | 企业使用、大规模、需要自定义 |

## 🔄 从 Cloudflare Workers 迁移到服务器

### API 完全兼容

两种部署方式的 API 接口**完全一致**，只需要更改请求的域名即可。

#### 迁移前（Cloudflare Workers）
```
https://your-worker.workers.dev/?target=clash&url=...
```

#### 迁移后（服务器）
```
https://your-domain.com/?target=clash&url=...
```

### 迁移步骤

1. **在服务器上部署应用**
   ```bash
   git clone <your-repo>
   cd Sub-Store-node
   pnpm install
   pnpm start
   ```

2. **配置 Nginx 反向代理**（可选但推荐）
   ```bash
   sudo cp nginx.conf.example /etc/nginx/sites-available/sub-store-node
   sudo ln -s /etc/nginx/sites-available/sub-store-node /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

3. **配置 SSL 证书**（推荐）
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

4. **更新客户端配置**
   - 将所有引用 Workers 地址的地方改为服务器地址
   - 测试功能是否正常

5. **保留 Workers 作为备份**（可选）
   - 可以同时保留两种部署方式
   - 在服务器故障时作为备份

## 🎯 何时选择服务器部署

### 选择服务器部署的情况：

✅ **需要更多控制权**
   - 需要自定义配置
   - 需要集成其他服务
   - 需要特殊的中间件或功能

✅ **有服务器资源**
   - 已有闲置服务器
   - 使用云服务器（阿里云、腾讯云等）
   - 需要部署在内网环境

✅ **超出 Workers 限制**
   - 请求量超过免费额度
   - 需要更长的执行时间
   - 需要更多的内存

✅ **企业或团队使用**
   - 需要完整的日志和监控
   - 需要与现有系统集成
   - 需要更高的稳定性保证

### 继续使用 Cloudflare Workers 的情况：

✅ **个人使用**
   - 请求量小
   - 不需要自定义功能
   - 希望零维护成本

✅ **全球访问**
   - 需要全球 CDN 加速
   - 用户分布在不同地区
   - 追求最低延迟

✅ **零成本**
   - 免费额度足够使用
   - 不想维护服务器

## 💡 最佳实践：混合部署

可以同时使用两种部署方式：

1. **主服务：服务器部署**
   - 处理主要流量
   - 提供稳定服务
   - 便于监控和维护

2. **备份服务：Cloudflare Workers**
   - 作为故障转移备份
   - 处理突发流量
   - 提供全球访问

### 实现方式

使用 Nginx 配置健康检查和故障转移：

```nginx
upstream sub_store_backend {
    server localhost:3000 max_fails=3 fail_timeout=30s;
    server your-worker.workers.dev:443 backup;
}

server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://sub_store_backend;
        proxy_next_upstream error timeout http_502 http_503 http_504;
    }
}
```

## 📈 性能优化建议

### 服务器部署优化

1. **使用 PM2 集群模式**
   ```bash
   pm2 start ecosystem.config.cjs
   ```

2. **配置 Nginx 缓存**
   ```nginx
   proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=sub_store_cache:10m max_size=1g;
   
   location / {
       proxy_cache sub_store_cache;
       proxy_cache_valid 200 5m;
       proxy_cache_key "$scheme$request_method$host$request_uri";
   }
   ```

3. **启用 Gzip 压缩**
   ```nginx
   gzip on;
   gzip_types text/plain application/json application/x-yaml;
   gzip_min_length 1000;
   ```

4. **配置 CDN**
   - 在服务器前加一层 CDN（如 Cloudflare、阿里云 CDN）
   - 缓存静态内容和部分动态内容

### Cloudflare Workers 优化

1. **使用缓存 API**
   - 缓存转换结果
   - 减少重复计算

2. **优化代码大小**
   - 使用 esbuild 压缩
   - 移除不必要的依赖

## 🔧 监控和维护

### 服务器部署监控

1. **PM2 监控**
   ```bash
   pm2 monit
   pm2 status
   pm2 logs
   ```

2. **系统监控**
   - 使用 Prometheus + Grafana
   - 配置告警（如 CPU、内存、磁盘使用率）

3. **日志管理**
   - 配置日志轮转
   - 集中日志收集（如 ELK）

### Cloudflare Workers 监控

1. **Workers Analytics**
   - 查看请求量、错误率
   - 监控执行时间

2. **告警配置**
   - 配置邮件/Webhook 告警
   - 监控错误率阈值

## 📚 相关文档

- [快速启动指南](./QUICK_START.md)
- [完整部署指南](./SERVER_DEPLOY.md)
- [主文档](./README.md)

## ❓ 常见问题

### Q: 可以同时运行两种部署方式吗？
A: 可以，它们完全独立，互不影响。

### Q: 迁移需要修改代码吗？
A: 不需要，API 完全兼容，只需要更改请求地址。

### Q: 服务器部署的性能如何？
A: 取决于服务器配置，一般服务器性能都足够使用。使用 PM2 集群模式可以充分利用多核 CPU。

### Q: 需要什么配置的服务器？
A: 最低配置：1核 1GB 内存；推荐配置：2核 2GB 内存或更高。

### Q: 支持 Windows 服务器吗？
A: 支持，但推荐使用 Linux 服务器（Ubuntu、Debian、CentOS 等）。

### Q: 如何保证高可用？
A: 使用负载均衡、配置备份服务器、使用 Docker Swarm 或 Kubernetes 等容器编排工具。
