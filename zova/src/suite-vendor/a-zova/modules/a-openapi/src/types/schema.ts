import type { OpenAPIObject, SchemaObject } from 'openapi3-ts/oas31';
import type { ModelUseQueryReturnType } from 'zova-module-a-model';

import type { IOpenapiSdkItem } from './sdk.js';

export interface IOpenapiSchema {
  doc: OpenAPIObject;
  meta?: IOpenapiSchemaMeta;
}

export interface IOpenapiSchemaMeta {}

export type TypeOpenapiSchemasSdk = ModelUseQueryReturnType<IOpenapiSdkItem, Error>;

export interface IOpenapiSchemas {
  sdk: TypeOpenapiSchemasSdk;
  query?: SchemaObject;
  filter?: SchemaObject;
  requestBody?: SchemaObject;
  responseBody?: SchemaObject;
  paged?: SchemaObject;
  row?: SchemaObject;
}
