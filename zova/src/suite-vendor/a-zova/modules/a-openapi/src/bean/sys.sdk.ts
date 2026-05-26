import type { SchemaObject } from 'openapi3-ts/oas31';

import { shallowReactive } from 'vue';
import { BeanBase, IApiActionConfigPrepareOptions, ILocaleRecord, TypeEventOff } from 'zova';
import { IApiSchemaOptions } from 'zova-module-a-api';
import { Sys } from 'zova-module-a-bean';
import { BeanFetch } from 'zova-module-a-fetch';

import { IOpenapiSchema } from '../types/schema.js';
import {
  IOpenapiSdkBootstrap,
  IOpenapiSdkItem,
  SymbolOpenapiSchemaName,
  TypeRequestMethod,
} from '../types/sdk.js';

// const PATH_PARAM_RE = /\{([^{}/]+)\}/g;

@Sys()
export class SysSdk extends BeanBase {
  private locale: keyof ILocaleRecord;
  bootstraps: Record<string, IOpenapiSdkBootstrap>;
  schemas: Record<string, SchemaObject>;
  sdks: Record<string, Record<string, IOpenapiSdkItem>>;
  private _eventSsrHmrReload: TypeEventOff;
  private _fetch: BeanFetch;

  protected async __init__(locale: keyof ILocaleRecord) {
    this.locale = locale;
    this.bootstraps = shallowReactive({});
    this.schemas = shallowReactive({});
    this.sdks = shallowReactive({});
    // event
    if (this.sys.config.ssr.hmr) {
      this._eventSsrHmrReload = this.sys.meta.event.on('a-ssrhmr:reload', async (_data, next) => {
        await this.reload();
        return next();
      });
    }
  }

  protected __dispose__() {
    if (this._eventSsrHmrReload) {
      this._eventSsrHmrReload();
    }
  }

  private async reload() {
    // server
    if (process.env.SERVER) {
      this.bootstraps = shallowReactive({});
      this.schemas = shallowReactive({});
      this.sdks = shallowReactive({});
      return;
    }
    // client
    // bootstraps
    const bootstraps = this.bootstraps;
    this.bootstraps = shallowReactive({});
    for (const resource in bootstraps) {
      await this.loadBootstrap(this._fetch, resource);
    }
    // sdks
    const sdks = this.sdks;
    this.sdks = shallowReactive({});
    for (const api in sdks) {
      for (const apiMethod in sdks[api]) {
        await this.loadSdk(this._fetch, api, apiMethod as any, { authToken: false });
      }
    }
  }

  getBootstrap(resource: string): IOpenapiSdkBootstrap | undefined {
    return this.bootstraps[resource];
  }

  getSdk(api: string | undefined, apiMethod: string | undefined): IOpenapiSdkItem | undefined {
    if (!api) return;
    const [api2, apiMethod2] = this.prepareApiMeta(api, apiMethod);
    return this.sdks[api2]?.[apiMethod2];
  }

  getSchema(schemaName: string): SchemaObject {
    return this.schemas[schemaName];
  }

  async loadBootstrap($fetch: BeanFetch, resource: string): Promise<IOpenapiSdkBootstrap> {
    if (process.env.CLIENT) {
      this._fetch = $fetch;
    }
    if (!this.bootstraps[resource]) {
      this.bootstraps[resource] = await $fetch.get(
        this.sys.util.apiActionPathTranslate(this.scope.config.api.bootstrap, { resource }),
        this.sys.util.apiActionConfigPrepare(undefined, undefined, false),
      );
    }
    return this.bootstraps[resource];
  }

  async loadSdk(
    $fetch: BeanFetch,
    api?: string,
    apiMethod?: TypeRequestMethod,
    apiOptions?: IApiSchemaOptions,
  ): Promise<IOpenapiSdkItem | undefined> {
    if (process.env.CLIENT) {
      this._fetch = $fetch;
    }
    if (!api) return;
    const [api2, apiMethod2] = this.prepareApiMeta(api, apiMethod);
    if (this.sdks[api2]?.[apiMethod2]) return this.sdks[api2][apiMethod2];
    // params
    const params: any[] = [this.sys.util.apiActionPathTranslate(api2)];
    // body
    if (!['get', 'delete'].includes(apiMethod2)) {
      params.push(undefined);
    }
    // options
    const options: IApiActionConfigPrepareOptions = {
      authToken: apiOptions?.authToken,
      openapiSchema: true,
      headers: {},
    };
    const localeKey = this.sys.env.APP_LOCALE_HEADER_KEY;
    if (localeKey) {
      options.headers![localeKey] = this.locale;
    }
    params.push(this.sys.util.apiActionConfigPrepare(undefined, options));
    const data: IOpenapiSchema = await $fetch[apiMethod2](...params);
    // schemas
    const schemaNames: string[] = [];
    const schemas = data.doc.components?.schemas;
    if (schemas) {
      for (const key in schemas) {
        const schema = schemas[key] as unknown as SchemaObject;
        if (!schema[SymbolOpenapiSchemaName]) {
          schema[SymbolOpenapiSchemaName] = key;
        }
        this.schemas[key] = schema;
        schemaNames.push(key);
      }
    }
    // paths
    const paths = data.doc.paths;
    if (paths) {
      for (const key in paths) {
        // const path = key.replace(PATH_PARAM_RE, ':$1');
        if (!this.sdks[api2]) this.sdks[api2] = shallowReactive({});
        for (const method in paths[key]) {
          this.sdks[api2][method] = {
            schemas: schemaNames,
            operationObject: paths[key][method],
            meta: data.meta,
          };
        }
      }
    }
    // ok
    return this.sdks[api2][apiMethod2];
  }

  prepareApiMeta(api: string, apiMethod?: string) {
    return [api, apiMethod ?? 'get'];
  }
}
