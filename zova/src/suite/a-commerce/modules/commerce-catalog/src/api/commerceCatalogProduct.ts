import type { IApiActionOptions } from 'zova-module-a-api';

import { Api, BeanApiBase } from 'zova-module-a-api';

import type { paths } from './openapi/index.js';

import { OpenApiBaseURL } from './openapi/index.js';

/** CommerceCatalogProduct_selectPublic */
export const ApiApiCommerceCatalogProductselectPublicPath = '/api/commerce/catalog/product/public';
export type ApiApiCommerceCatalogProductselectPublicPath = '/api/commerce/catalog/product/public';
export type ApiApiCommerceCatalogProductselectPublicMethod = 'get';
export type ApiApiCommerceCatalogProductselectPublicRequestQuery =
  paths[ApiApiCommerceCatalogProductselectPublicPath][ApiApiCommerceCatalogProductselectPublicMethod]['parameters']['query'];
export type ApiApiCommerceCatalogProductselectPublicResponseBody =
  paths[ApiApiCommerceCatalogProductselectPublicPath][ApiApiCommerceCatalogProductselectPublicMethod]['responses']['200']['content']['application/json']['data'];

/** CommerceCatalogProduct_viewPublic */
export const ApiApiCommerceCatalogProductviewPublicPath =
  '/api/commerce/catalog/product/public/{id}';
export type ApiApiCommerceCatalogProductviewPublicPath =
  '/api/commerce/catalog/product/public/{id}';
export type ApiApiCommerceCatalogProductviewPublicMethod = 'get';
export type ApiApiCommerceCatalogProductviewPublicRequestParams =
  paths[ApiApiCommerceCatalogProductviewPublicPath][ApiApiCommerceCatalogProductviewPublicMethod]['parameters']['path'];
export type ApiApiCommerceCatalogProductviewPublicResponseBody =
  paths[ApiApiCommerceCatalogProductviewPublicPath][ApiApiCommerceCatalogProductviewPublicMethod]['responses']['200']['content']['application/json']['data'];

@Api()
export class ApiCommerceCatalogProduct extends BeanApiBase {
  selectPublic(
    options?: {
      query?: ApiApiCommerceCatalogProductselectPublicRequestQuery;
    } & IApiActionOptions,
  ) {
    return this.$fetch.get<any, ApiApiCommerceCatalogProductselectPublicResponseBody>(
      ApiApiCommerceCatalogProductselectPublicPath,
      this.$configPrepare(OpenApiBaseURL(this.sys), options),
    );
  }

  viewPublic(
    options: {
      params: ApiApiCommerceCatalogProductviewPublicRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.get<any, ApiApiCommerceCatalogProductviewPublicResponseBody>(
      this.$pathTranslate(ApiApiCommerceCatalogProductviewPublicPath, options.params),
      this.$configPrepare(OpenApiBaseURL(this.sys), options),
    );
  }
}
