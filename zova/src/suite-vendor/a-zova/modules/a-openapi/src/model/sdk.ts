import { isNil } from '@cabloy/utils';
import { SchemaObject } from 'openapi3-ts/oas31';
import z from 'zod';
import { cast, ILocaleRecord, TypeEventOff, Use, usePrepareArg } from 'zova';
import { IApiSchemaOptions } from 'zova-module-a-api';
import { $QueryAutoLoad, BeanModelBase, IDecoratorModelOptions, Model } from 'zova-module-a-model';

import { SysSdk } from '../bean/sys.sdk.js';
import {
  getSchemaOfRequestBody,
  getSchemaOfRequestQuery,
  getSchemaOfRequestQueryFilter,
  getSchemaOfResponseBody,
  loadSchemaProperties,
  schemaToZodSchema,
} from '../lib/schema.js';
import { TypeOpenapiPermissions } from '../types/permissions.js';
import { TypeSchemaScene } from '../types/rest.js';
import { IOpenapiSchemas, TypeOpenapiSchemasSdk } from '../types/schema.js';
import { TypeRequestMethod } from '../types/sdk.js';

const __schemaRefPrefix = '#/components/schemas/';

export interface IModelOptionsSdk extends IDecoratorModelOptions {}

@Model<IModelOptionsSdk>({
  enableSelector: true,
})
export class ModelSdk extends BeanModelBase {
  private _eventSsrHmrReload: TypeEventOff;

  @Use({ beanFullName: 'a-openapi.sys.sdk' })
  get $$sysSdk(): SysSdk {
    return usePrepareArg(this.selector, true);
  }

  protected async __init__(locale: keyof ILocaleRecord) {
    if (!locale) throw new Error('locale not specified');
    await super.__init__(locale);
    // event
    if (process.env.CLIENT && this.sys.config.ssr.hmr) {
      this._eventSsrHmrReload = this.sys.meta.event.on('a-ssrhmr:reload', async (_data, next) => {
        await this.$refetchQueries({ queryKey: ['bootstrap'] });
        await this.$refetchQueries({ queryKey: ['sdk'] });
        return next();
      });
    }
  }

  protected __dispose__() {
    if (this._eventSsrHmrReload) {
      this._eventSsrHmrReload();
    }
  }

  getBootstrap(resource: string) {
    return this.$useStateData({
      queryKey: ['bootstrap', resource],
      queryFn: async () => {
        const bootstrap = await this.$$sysSdk.loadBootstrap(this.$fetch, resource);
        if (!bootstrap) throw new Error('load bootstrap error');
        if (process.env.SERVER) {
          await $QueryAutoLoad(() => this.getPermissions(resource));
        } else {
          await this.$refetchQueries({ queryKey: ['permissions', resource] });
        }
        return bootstrap ?? null;
      },
    });
  }

  getPermissions(resource: string) {
    return this.$useStateData({
      queryKey: ['permissions', resource],
      queryFn: async () => {
        const permissions = (await this.$fetch.get(
          this.sys.util.apiActionPathTranslate(this.scope.config.api.permissions, { resource }),
          this.sys.util.apiActionConfigPrepare(),
        )) as TypeOpenapiPermissions;
        return permissions ?? null;
      },
    });
  }

  getSdk(
    api: string,
    apiMethod?: TypeRequestMethod,
    apiOptions?: IApiSchemaOptions,
  ): TypeOpenapiSchemasSdk {
    if (!api) throw new Error('should specify api');
    const [api2, apiMethod2] = this.$$sysSdk.prepareApiMeta(api, apiMethod);
    return this.$useStateData({
      queryKey: ['sdk', api2, apiMethod2],
      queryFn: async () => {
        const sdk = await this.$$sysSdk.loadSdk(this.$fetch, api, apiMethod, apiOptions);
        if (!sdk) throw new Error('load sdk error');
        for (const schemaName of sdk.schemas) {
          if (process.env.SERVER) {
            await $QueryAutoLoad(() => this.getSchema(schemaName));
          } else {
            await this.$refetchQueries({ queryKey: ['schema', schemaName] });
          }
        }
        return sdk;
      },
    }) as TypeOpenapiSchemasSdk;
  }

  getSchema(schemaName: string) {
    if (schemaName.startsWith(__schemaRefPrefix)) {
      schemaName = schemaName.substring(__schemaRefPrefix.length);
    }
    return this.$useStateData({
      queryKey: ['schema', schemaName],
      queryFn: async () => {
        const schema = this.$$sysSdk.getSchema(schemaName);
        return schema ?? null;
      },
    });
  }

  getZodSchema(schemaName: string) {
    return this.$useStateComputed({
      queryKey: ['zodSchema', schemaName],
      queryFn: () => {
        const querySchema = this.getSchema(schemaName);
        if (!querySchema.data) return null;
        const zodSchema = this.schemaToZodSchema(querySchema.data);
        return zodSchema;
      },
    });
  }

  getSchemaDefaultValue(schemaName: string) {
    return this.$useStateComputed({
      queryKey: ['schemaDefaultValue', schemaName],
      queryFn: () => {
        const querySchema = this.getSchema(schemaName);
        if (!querySchema.data) return null;
        const schema = querySchema.data;
        // const schema = this.$$sysSdk.getSchema(schemaName);
        // if (!schema) return null;
        const defaultValues = {};
        for (const key in schema.properties) {
          const property = schema.properties[key] as any;
          if (!isNil(property.default)) {
            defaultValues[key] = property.default;
          }
        }
        return defaultValues;
      },
    });
  }

  public createApiSchemas(
    api: string,
    apiMethod?: TypeRequestMethod,
    apiOptions?: IApiSchemaOptions,
  ): IOpenapiSchemas {
    // eslint-disable-next-line
    const self = this;
    const sdk = this.getSdk(api, apiMethod, apiOptions);
    return {
      get sdk() {
        return sdk;
      },
      get query() {
        const operationObject = sdk.data?.operationObject;
        return getSchemaOfRequestQuery(operationObject);
      },
      get filter() {
        const operationObject = sdk.data?.operationObject;
        return getSchemaOfRequestQueryFilter(operationObject, { where: true });
      },
      get requestBody() {
        const operationObject = sdk.data?.operationObject;
        const schemaBody = getSchemaOfRequestBody(operationObject);
        const schemaName = cast(schemaBody)?.$ref;
        if (schemaName) return self.getSchema(schemaName).data;
        return schemaBody;
      },
      get responseBody() {
        const operationObject = sdk.data?.operationObject;
        const schemaBody = getSchemaOfResponseBody(operationObject);
        const schemaData = schemaBody?.properties?.data;
        const schemaName = cast(schemaData)?.$ref;
        if (schemaName) return self.getSchema(schemaName).data;
        return schemaData as SchemaObject;
      },
      get paged() {
        const operationObject = sdk.data?.operationObject;
        const schemaBody = getSchemaOfResponseBody(operationObject);
        if (!schemaBody) return;
        const schemaName = cast(schemaBody?.properties?.data)?.items?.$ref;
        if (schemaName) return;
        // pages
        return this.responseBody;
      },
      get row() {
        const operationObject = sdk.data?.operationObject;
        const schemaBody = getSchemaOfResponseBody(operationObject);
        if (!schemaBody) return;
        // schemaData
        let schemaData;
        if (schemaBody?.properties?.data.$ref) {
          schemaData = self.getSchema(schemaBody?.properties?.data.$ref).data;
        } else {
          schemaData = schemaBody?.properties?.data;
        }
        // entry
        const schemaName = cast(schemaData)?.items?.$ref;
        if (schemaName) {
          return self.getSchema(schemaName).data;
        }
        // pages
        const schemaRow = cast(schemaData?.properties?.list)?.items;
        if (schemaRow?.$ref) {
          return self.getSchema(schemaRow?.$ref).data;
        }
        return schemaRow;
      },
    };
  }

  public loadSchemaProperties(
    schema: SchemaObject | undefined,
    schemaScene?: TypeSchemaScene,
  ): SchemaObject[] | undefined {
    return loadSchemaProperties(schema, schemaName => this.getSchema(schemaName).data, schemaScene);
  }

  public schemaToZodSchema<T extends z.ZodType = z.ZodType>(schema: SchemaObject): T {
    return schemaToZodSchema(schema, schemaName => this.getSchema(schemaName).data);
  }
}
