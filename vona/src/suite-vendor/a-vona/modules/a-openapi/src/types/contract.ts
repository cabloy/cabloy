import type { IOpenapiOptions, TypeResponseContentType } from 'vona-module-a-openapiutils';
import type { z } from 'zod';

import type { RouteHandlerArgumentMetaDecorator } from './decorator.ts';

export interface IControllerActionRequest {
  params?: z.ZodType;
  query?: z.ZodType;
  body?: z.ZodType;
  headers?: z.ZodType;
}

export interface IControllerActionContract {
  request: IControllerActionRequest;
  /** The controller return validator, without the HTTP response wrapper. */
  response: z.ZodType;
  contentType: TypeResponseContentType;
  openapiOptions?: IOpenapiOptions;
  /** Copies of the original executor metadata, without synthetic documentation headers. */
  argsMeta: RouteHandlerArgumentMetaDecorator[];
}

export interface IGenerateJsonOfControllerActionOptions {
  includeExcluded?: boolean;
}
