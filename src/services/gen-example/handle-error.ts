import type { axiosRequest } from '@liangskyli/axios-request';
import type { IGenJsonData } from '@/services/gen-example/index.ts';

type IGenAxiosRequestOpts = Parameters<
  typeof axiosRequest<IGenJsonData, 'retCode', 'retMsg', 'data', number>
>[0];

const handleError: IGenAxiosRequestOpts['ShowErrorMiddlewareConfig']['handleError'] =
  (err) => {
    switch (err.retCode) {
      default:
        break;
    }
  };
export default handleError;
