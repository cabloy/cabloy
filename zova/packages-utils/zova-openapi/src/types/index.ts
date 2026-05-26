import type { OpenAPITSOptions } from '@cabloy/openapi-typescript';

export type TypeOpenapiConfigMatchRule = string | RegExp | (string | RegExp)[];

export interface ZovaOpenapiConfigModuleBase {
  source?: string;
  options?: OpenAPITSOptions;
  apiMeta?: boolean;
  apiSchema?: boolean;
}

export interface ZovaOpenapiConfigModule extends ZovaOpenapiConfigModuleBase {
  operations?: {
    match?: TypeOpenapiConfigMatchRule;
    ignore?: TypeOpenapiConfigMatchRule;
  };
}

export interface ZovaOpenapiConfig {
  default?: ZovaOpenapiConfigModuleBase;
  modules: Record<string, ZovaOpenapiConfigModule>;
}
