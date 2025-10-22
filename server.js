import express from 'express';
import processNodeConversion from './src/index.js';

const app = express();
const PORT = process.env.PORT || 3000;

/**
 * 返回使用说明
 * @returns {Object} 包含使用说明的JSON对象
 */
function getUsageInstructions() {
    return {
        version: 'SubStore v2.20.19',
        message: '这是一个基于 Node.js 的 sub-store 节点转换工具，仅转换节点用',
        usage: {
            target: '输出类型：{singbox|mihomo|v2ray|base64|qx|QX|QuantumultX|surge|Surge|SurgeMac|Loon|Clash|meta|clashmeta|clash.meta|Clash.Meta|ClashMeta|Mihomo|uri|URI|json|JSON|stash|Stash|shadowrocket|Shadowrocket|ShadowRocket|surfboard|Surfboard|egern|Egern}',
            url: '输入编码后的订阅链接，多个订阅可用英文逗号(,)分隔',
            example: '/?target=v2ray&url=UrlEncode(编码后的订阅)',
            examples: [
                '/?target=v2ray&url=https%3A%2F%2Fexample.com%2Fsubscription',
                '/?target=clash&url=https%3A%2F%2Fexample.com%2Fsub1,https%3A%2F%2Fexample.com%2Fsub1'
            ]
        }
    };
}

// 主路由处理
app.get('/', async (req, res) => {
    try {
        const { target, url: inputnode } = req.query;
        const nodeArray = inputnode ? inputnode.split(/[,|]/) : [];

        // 如果没有提供必需参数，返回使用说明
        if (!target || nodeArray.length === 0) {
            return res.status(200).json(getUsageInstructions());
        }

        // 处理节点转换
        const result = await processNodeConversion(nodeArray, target);
        let data = result.data;
        
        // 如果数据是对象，转换为 JSON 字符串
        if (typeof data === 'object') {
            data = JSON.stringify(data);
        }

        // 设置响应头（如果有）
        if (result.headers && typeof result.headers === 'object') {
            Object.entries(result.headers).forEach(([key, value]) => {
                if (value) {
                    res.setHeader(key, value);
                }
            });
        }

        // 返回结果
        res.status(result.status).send(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send(`Error: ${error.message}`);
    }
});

// 健康检查端点
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 处理
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: '请访问根路径 / 查看使用说明'
    });
});

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message
    });
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`\n🚀 Sub-Store 转换服务已启动！`);
    console.log(`📡 监听端口: ${PORT}`);
    console.log(`🌐 访问地址: http://localhost:${PORT}`);
    console.log(`📖 使用说明: http://localhost:${PORT}\n`);
});

// 优雅关闭
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('\nSIGINT signal received: closing HTTP server');
    process.exit(0);
});
