import type { IRequestConfig } from '@liangskyli/axios-request';
import { axiosRequest } from '@liangskyli/axios-request';
import { ajaxLoadingStore } from '@/store';
import handleError from '@/services/gen-example/handle-error.ts';
import config from '@/utils/config.ts';

export type IGenJsonData<T = unknown> = {
  retCode: number;
  retMsg?: string;
  data: T;
};
export type IGenRequestConfig<
  T extends Record<string, unknown> = Record<string, unknown>,
> = IRequestConfig<IGenJsonData<T>, 'retCode', 'retMsg', number>;
const request = axiosRequest<IGenJsonData, 'retCode', 'retMsg', 'data', number>(
  {
    initConfig: {
      baseURL: config.baseApiPrefix,
    },
    loadingMiddlewareConfig: {
      showLoading: () => {
        ajaxLoadingStore.getState().showLoading();
      },
      hideLoading: () => {
        ajaxLoadingStore.getState().hideLoading();
      },
    },
    serializedResponseMiddlewareConfig: {
      serializedResponseCodeKey: 'retCode',
      serializedResponseSuccessCode: 0,
      serializedResponseDataKey: 'data',
    },
    ShowErrorMiddlewareConfig: {
      handleError: (err, ctx) => {
        return handleError?.(err, ctx);
      },
      showError: (err, ctx) => {
        console.log('showError:', err, ctx);
      },
    },
  },
);
export default request;
