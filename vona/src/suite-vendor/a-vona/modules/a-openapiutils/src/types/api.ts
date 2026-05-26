import type {
  OpenAPIObject as OpenAPIObject30,
  SchemaObject as SchemaObject30,
} from 'openapi3-ts/oas30';
import type {
  OpenAPIObject as OpenAPIObject31,
  SchemaObject as SchemaObject31,
} from 'openapi3-ts/oas31';
import type { ILocaleMagic, VonaApplication } from 'vona';
import type z from 'zod';

import type { SchemaLikeCreate } from './decorator.ts';

export interface IOpenapiHeader {
  name: string;
  description?: string;
}

export interface IResponseHeaders {
  [key: string]: string | string[];
}

export type TypeGenerateJsonScene = 'api' | 'rest';

export type TypeOpenApiVersion = 'V30' | 'V31';
export interface IOpenapiObject {
  V30: OpenAPIObject30;
  V31: OpenAPIObject31;
}
export interface IOpenapiSchemaObject {
  V30: SchemaObject30;
  V31: SchemaObject31;
}

export type TypeSecuritySchemes = Record<string, ((this: VonaApplication) => object) | object>;

export interface IOpenapiOptions {
  public?: boolean;
  description?: string | ILocaleMagic;
  summary?: string | ILocaleMagic;
  httpCode?: number;
  contentType?: TypeResponseContentType;
  bodySchema?: z.ZodType;
  bodySchemaWrapper?: SchemaLikeCreate | false;
  exclude?: boolean;
  tags?: string[];
  operationId?: string;
  headers?: IOpenapiHeader[];
  setHeaders?: IResponseHeaders;
}

export type TypeResponseContentType =
  | 'application/json'
  | 'application/xml'
  | 'application/x-www-form-urlencoded'
  | 'multipart/form-data'
  | 'text/plain'
  | 'text/html'
  | 'application/octet-stream'
  | 'application/pdf'
  | 'image/png'
  | 'image/jpeg'
  | 'image/gif'
  | 'image/webp'
  | 'image/svg+xml'
  | 'image/bmp'
  | 'image/tiff'
  | 'image/vnd.microsoft.icon'
  | 'image/vnd.wap.wbmp'
  | 'image/x-icon'
  | 'image/x-jng'
  | 'image/x-ms-bmp'
  | 'image/x-portable-bitmap'
  | 'image/x-portable-graymap'
  | 'image/x-portable-pixmap'
  | 'image/x-xbitmap'
  | 'image/x-xpixmap'
  | 'image/x-xwindowdump'
  | 'image/bmp'
  | 'image/x-bmp'
  | 'image/x-xbitmap'
  | 'image/x-win-bitmap'
  | 'image/x-windows-bmp'
  | 'image/ms-bmp'
  | 'image/x-ms-bmp'
  | 'image/x-icon'
  | 'image/x-ico'
  | 'image/vnd.microsoft.icon'
  | 'image/ico'
  | 'image/icon'
  | 'text/css'
  | 'text/csv'
  | 'text/html'
  | 'text/javascript'
  | 'text/plain'
  | 'text/xml'
  | 'application/javascript'
  | 'application/ecmascript'
  | 'application/json'
  | 'application/ld+json'
  | 'application/manifest+json'
  | 'application/javascript'
  | 'application/x-javascript'
  | 'application/x-json'
  | 'application/x-ms-application';
