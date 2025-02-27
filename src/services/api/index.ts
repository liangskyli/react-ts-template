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
};
export default requestApi;
