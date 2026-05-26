import type { OperationObject } from 'openapi3-ts/oas31';

import type { ModelSdk } from '../model/sdk.js';
import type { IOpenapiSchemaMeta } from './schema.js';

export const SymbolOpenapiSchemaName = '__schemaName__';

export interface IOpenapiSdkBootstrap {
  apiPath: string;
}

export interface IOpenapiSdkItem {
  schemas: string[];
  operationObject: OperationObject;
  meta?: IOpenapiSchemaMeta;
}

export type TypeRequestMethod = 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head';

declare module 'zova' {
  export interface BeanBase {
    $sdk: ModelSdk;
  }
}
