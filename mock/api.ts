import type { Request, Response } from '@liangskyli/mock';

export default {
  // 支持值为 Object 和 Array
  'GET /test1/get-list': {
    code: 0,
    data: { name: 'name' },
    message: 'message',
  },

  // 支持自定义函数
  'GET /test1/get-list2': (_req: Request, res: Response) => {
    // 添加跨域请求头
    res.setHeader('Access-Control-Allow-Origin', '*');
    const data = { code: 0, data: { name: 'name' }, message: 'message' };
    res.json(data);
  },

  // 流式数据接口 mock - 模拟 Server-Sent Events 或分块传输
  'POST /test1/stream-data': (_req: Request, res: Response) => {
    // 添加必要的响应头
    // res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    /**
     * 将字符串转换为16进制Buffer
     * @param text 原始文本数据
     * @returns 16进制编码的Buffer
     */
    const convertToHexBuffer = (text: string): Buffer => {
      return Buffer.from(text, 'utf-8');
    };

    // 模拟流式数据发送 (原始文本数据)
    const chunks = [
      '数据块 1: 初始化连接...\n',
      '数据块 2: 开始处理数据...\n',
      '数据块 3: 加载用户信息...\n',
      '数据块 4: {"userId": 123, "name": "张三", "role": "admin"}\n',
      '数据块 5: 加载产品列表...\n',
      '数据块 6: {"products": [{"id": 1, "name": "商品A"}, {"id": 2, "name": "商品B"}]}\n',
      '数据块 7: 处理订单数据...\n',
      '数据块 8: {"orders": [{"id": "ORD-001", "total": 299.99}]}\n',
      '数据块 9: 生成报表中...\n',
      '数据块 10: {"report": "生成完成", "records": 150}\n',
      '\n✅ 流式传输完成！\n',
    ];

    let index = 0;

    // 使用定时器模拟分块发送16进制数据
    const interval = setInterval(() => {
      if (index < chunks.length) {
        // 将原始文本通过转换方法映射为16进制Buffer并发送
        const hexBuffer = convertToHexBuffer(chunks[index]);
        res.write(hexBuffer);
        index++;
      } else {
        clearInterval(interval);
        res.end();
      }
    }, 300); // 每 300ms 发送一个数据块
  },
};
