/**
 * 豆包 API 代理 - Cloudflare Worker（零配置版）
 * API Key 内置在 Worker 中，前端无需传 Key，用户打开即可对话
 *
 * 部署步骤：
 * 1. 把下方 DOUBAO_API_KEY 替换为你的火山引擎 API Key
 * 2. 打开 https://dash.cloudflare.com/ → Workers & Pages → 创建 Worker
 * 3. 粘贴代码，点击「部署」
 * 4. 获得 Worker URL（如 https://doubao-proxy.xxx.workers.dev）
 * 5. 将 URL 填入 xiaoshan.html 的 PROXY_URL 常量中
 *
 * 免费额度：每天 10 万次请求
 */

// ========== 在这里填入你的豆包 API Key ==========
const DOUBAO_API_KEY = 'YOUR_API_KEY_HERE';
// =================================================

const ARK_API = 'https://ark.cn-beijing.volces.com/api/v3/chat/completions';
const MODEL = 'doubao-1-5-pro-32k-250115';

export default {
  async fetch(request) {
    // CORS 预检
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age': '86400',
        }
      });
    }

    if (request.method !== 'POST') {
      return new Response('OK', {
        headers: { 'Access-Control-Allow-Origin': '*' }
      });
    }

    // 检查 Key 是否已配置
    if (DOUBAO_API_KEY === 'YOUR_API_KEY_HERE') {
      return new Response(JSON.stringify({ error: 'Worker 未配置 API Key，请在 Worker 代码中填入 DOUBAO_API_KEY' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      });
    }

    try {
      // 解析前端传来的消息体
      const body = await request.json();
      const messages = body.messages || [];

      // 转发到火山引擎（Key 由服务端注入，前端不传）
      const response = await fetch(ARK_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + DOUBAO_API_KEY,
        },
        body: JSON.stringify({
          model: MODEL,
          stream: true,
          messages: messages,
          temperature: 0.7,
          max_tokens: 600,
        }),
      });

      // 流式透传
      const newResponse = new Response(response.body, {
        status: response.status,
        headers: response.headers,
      });

      newResponse.headers.set('Access-Control-Allow-Origin', '*');
      newResponse.headers.set('Access-Control-Expose-Headers', '*');

      return newResponse;
    } catch (err) {
      return new Response(JSON.stringify({ error: '代理请求失败: ' + err.message }), {
        status: 502,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      });
    }
  }
};
