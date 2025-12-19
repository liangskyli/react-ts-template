import { defineConfig } from '@liangskyli/http-mock-gen';

export default defineConfig([
  {
    mockDir: './mock/gen-example',
    openapiPath: new URL('./openapi/openapiv3-example.json', import.meta.url),
    genTsDir: './src/services/gen-example',
    requestFile: {
      path: '../../gen-example/index.ts',
      requestParamsType: 'IGenRequestConfig',
    },
    jsonSchemaFakerOptions: {
      minItems: 1,
      maxItems: 1,
    },
    mockDataReplace: (key, value) => {
      if (typeof value === 'string') {
        return key;
      }
      if (typeof value === 'number') {
        return 0;
      }
      if (typeof value === 'boolean') {
        return false;
      }
      return value;
    },
  },
]);
