import type { IModuleApi, IModuleApiSchema } from '../.metadata/index.ts';

declare module 'zova' {
  export interface BeanBase {
    $api: IModuleApi;
    $apiSchema: IModuleApiSchema;
  }
}
