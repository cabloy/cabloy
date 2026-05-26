import type { Constructable, Type, VonaContext } from 'vona';
import type { z } from 'zod';

export interface ISchemaObjectOptions {
  loose?: boolean;
  strict?: boolean;
}

export interface RouteHandlerArgumentMetaDecorator {
  index: number;
  type: RouteHandlerArgumentType;
  field?: string;
  pipes: Function[];
  schema: z.ZodType;
  extractValue?: TypeExtractValue;
}

export interface RouteHandlerArgumentMeta {
  type: RouteHandlerArgumentType;
  field?: string;
  metaType?: Type<any>;
  controller: Constructable;
  method: string;
  index: number;
}

export type RouteHandlerArgumentType =
  | 'request'
  | 'response'
  | 'body'
  | 'query'
  | 'param'
  | 'headers'
  | 'session'
  | 'fields'
  | 'field'
  | 'files'
  | 'file'
  | 'host'
  | 'ip'
  | 'rawBody'
  | 'string'
  | 'user';

export type TypeExtractValue = (
  ctx: VonaContext,
  argMeta: RouteHandlerArgumentMetaDecorator,
) => Promise<any>;
