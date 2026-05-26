import type { IModuleApi, IModuleApiSchema } from '../.metadata/index.js';

declare module 'zova' {
  export interface BeanBase {
    $api: IModuleApi;
    $apiSchema: IModuleApiSchema;
  }
}
