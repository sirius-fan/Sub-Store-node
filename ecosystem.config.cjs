module.exports = {
  apps: [
    {
      name: 'sub-store-node',
      script: './server.js',
      instances: 'max', // 使用所有 CPU 核心
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 3000,
      },
      // 自动重启配置
      watch: false,
      max_memory_restart: '500M',
      // 日志配置
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true,
      // 重启策略
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      restart_delay: 4000,
    },
  ],
};
