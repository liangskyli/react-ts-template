import type { IBaseJsonData } from '@/services/request/base.ts';
import request from '@/services/request/base.ts';
import config from '@/utils/config.ts';

const { baseApiPrefix } = config;
const createApi = request.createApi({ baseURL: baseApiPrefix });
const requestApi = {
  getList: createApi<IBaseJsonData<{ name: string }>>({
    url: 'test1/get-list',
    method: 'GET',
  }),

  /**
   * 流式请求 API - 模拟服务器端点
   * 这个接口应该返回分块传输的数据或 Server-Sent Events
   */
  noStreamData: createApi<IBaseJsonData<string>>({
    url: 'test1/stream-data',
    method: 'POST',
  }),
  streamData: createApi<IBaseJsonData<ReadableStream<Uint8Array<ArrayBuffer>>>>(
    {
      url: 'test1/stream-data',
      method: 'POST',
      responseType: 'stream', // 返回 ReadableStream
      adapter: 'fetch', // 使用 fetch adapter
      customOptions: { isResponseStringSerializedObj: true },
    },
  ),
};
export default requestApi;
