import type {
  ICustomDataMethods,
  ICustomsData,
  PartialAll,
  Request,
} from '@liangskyli/http-mock-gen';
import type { IApi } from '../../../../src/services/gen-example/schema-api/interface-api';

export const TemplateData: ICustomsData<{
  '/v1/building/get-list': ICustomDataMethods<
    PartialAll<IApi['/v1/building/get-list']['get']['Response']>,
    'get'
  >;
}> = {
  '/v1/building/get-list': {
    get: {
      /** mock 响应数据(函数调用，支持动态生成数据) */
      response: {
        retCode: 0,
        data: {
          isFuLi: false,
          blockList: [
            { buildingName: { description: 'description' }, isBindErp: false },
          ],
        },
        retMsg: 'retMsg',
      },
      /** mock 多场景响应数据 */
      sceneData: [
        {
          // eslint-disable-next-line
          requestCase: (_request: Request) => {
            // request 为http传入参数，可以根据不同参数配置不同场景数据
            // mock 场景数据判断,返回true时使用该场景，匹配成功后，跳出匹配
            return false;
          },
          response: {
            retCode: 0,
            data: {
              isFuLi: false,
              blockList: [
                {
                  buildingName: { description: 'description' },
                  isBindErp: false,
                },
              ],
            },
            retMsg: 'retMsg',
          },
        },
      ],
    },
  },
};
