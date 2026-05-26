import type { MetadataKey } from 'vona';

import { appMetadata } from 'vona';

import type { IOpenapiHeader, IOpenapiOptions, TypeResponseContentType } from '../../types/api.ts';
import type { SchemaLike, SchemaLikeCreate } from '../../types/decorator.ts';

import { SymbolOpenApiOptions } from '../const/decorator.ts';
import { makeSchemaLikes } from '../schema/makeSchemaLikes.ts';
import { Field } from './field.ts';

function httpCode(httpCode: number): MethodDecorator {
  return function (target: object, prop?: MetadataKey, descriptor?: PropertyDescriptor) {
    const options = appMetadata.getOwnMetadataMap(
      false,
      SymbolOpenApiOptions,
      target,
      prop,
    ) as IOpenapiOptions;
    options.httpCode = httpCode;
    return descriptor;
  } as any;
}

function contentType(contentType: TypeResponseContentType): MethodDecorator {
  return function (target: object, prop?: MetadataKey, descriptor?: PropertyDescriptor) {
    const options = appMetadata.getOwnMetadataMap(
      false,
      SymbolOpenApiOptions,
      target,
      prop,
    ) as IOpenapiOptions;
    options.contentType = contentType;
    return descriptor;
  } as any;
}

function body(...schemaLikes: SchemaLike[]): MethodDecorator {
  return function (target: object, prop?: MetadataKey, descriptor?: PropertyDescriptor) {
    // schema
    const metaType = appMetadata.getDesignReturntype(target, prop);
    const schema = makeSchemaLikes(schemaLikes, metaType);
    // options
    const options = appMetadata.getOwnMetadataMap(
      false,
      SymbolOpenApiOptions,
      target,
      prop,
    ) as IOpenapiOptions;
    options.bodySchema = schema;
    return descriptor;
  } as any;
}

function bodyCustom(
  bodySchemaWrapper: SchemaLikeCreate | false,
  ...schemaLikes: SchemaLike[]
): MethodDecorator {
  return function (target: object, prop?: MetadataKey, descriptor?: PropertyDescriptor) {
    // schema
    const metaType = appMetadata.getDesignReturntype(target, prop);
    const schema = makeSchemaLikes(schemaLikes, metaType);
    // options
    const options = appMetadata.getOwnMetadataMap(
      false,
      SymbolOpenApiOptions,
      target,
      prop,
    ) as IOpenapiOptions;
    options.bodySchema = schema;
    options.bodySchemaWrapper = bodySchemaWrapper;
    return descriptor;
  } as any;
}

function exclude(): ClassDecorator & MethodDecorator {
  return function (target: object, prop?: MetadataKey, descriptor?: PropertyDescriptor) {
    const options = appMetadata.getOwnMetadataMap(
      false,
      SymbolOpenApiOptions,
      target,
      prop,
    ) as IOpenapiOptions;
    options.exclude = true;
    return descriptor;
  } as any;
}

function tags(tags: string[]): ClassDecorator & MethodDecorator {
  return function (target: object, prop?: MetadataKey, descriptor?: PropertyDescriptor) {
    const options = appMetadata.getOwnMetadataMap(
      false,
      SymbolOpenApiOptions,
      target,
      prop,
    ) as IOpenapiOptions;
    options.tags = tags;
    return descriptor;
  } as any;
}

function header(header: IOpenapiHeader): ClassDecorator & MethodDecorator {
  return function (target: object, prop?: MetadataKey, descriptor?: PropertyDescriptor) {
    const options = appMetadata.getOwnMetadataMap(
      false,
      SymbolOpenApiOptions,
      target,
      prop,
    ) as IOpenapiOptions;
    if (!options.headers) options.headers = [];
    options.headers.push(header);
    return descriptor;
  } as any;
}

function headers(headers: IOpenapiHeader[]): ClassDecorator & MethodDecorator {
  return function (target: object, prop?: MetadataKey, descriptor?: PropertyDescriptor) {
    const options = appMetadata.getOwnMetadataMap(
      false,
      SymbolOpenApiOptions,
      target,
      prop,
    ) as IOpenapiOptions;
    if (!options.headers) options.headers = [];
    options.headers.push(...headers);
    return descriptor;
  } as any;
}

function setHeader(field: { [key: string]: string | string[] }): ClassDecorator & MethodDecorator;
function setHeader(field: string, val: string | string[]): ClassDecorator & MethodDecorator;
function setHeader(field: any, val?: any): ClassDecorator & MethodDecorator {
  return function (target: object, prop?: MetadataKey, descriptor?: PropertyDescriptor) {
    const options = appMetadata.getOwnMetadataMap(
      false,
      SymbolOpenApiOptions,
      target,
      prop,
    ) as IOpenapiOptions;
    if (!options.setHeaders) options.setHeaders = {};
    if (typeof field === 'string') {
      options.setHeaders[field] = val;
    } else {
      Object.assign(options.setHeaders, field);
    }
    return descriptor;
  } as any;
}

export const Api = {
  field: Field,
  httpCode,
  contentType,
  body,
  bodyCustom,
  exclude,
  tags,
  header,
  headers,
  setHeader,
};

export function setPublic(
  target: object,
  prop?: MetadataKey,
  _descriptor?: PropertyDescriptor,
  value?: boolean,
) {
  const options = appMetadata.getOwnMetadataMap(
    false,
    SymbolOpenApiOptions,
    target,
    prop,
  ) as IOpenapiOptions;
  options.public = value;
}
