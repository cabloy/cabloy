import type { IApiActionOptions } from 'zova-module-a-api';

import { Api, BeanApiBase } from 'zova-module-a-api';

import type { paths } from './openapi/index.js';

import { OpenApiBaseURL } from './openapi/index.js';

/** HomeBaseSiteCatalog_select */
export const ApiApiHomeBaseSiteCatalogselectPath = '/api/home/base/siteCatalog';
export type ApiApiHomeBaseSiteCatalogselectPath = '/api/home/base/siteCatalog';
export type ApiApiHomeBaseSiteCatalogselectMethod = 'get';
export type ApiApiHomeBaseSiteCatalogselectResponseBody =
  paths[ApiApiHomeBaseSiteCatalogselectPath][ApiApiHomeBaseSiteCatalogselectMethod]['responses']['200']['content']['application/json']['data'];

@Api()
export class ApiHomeBaseSiteCatalog extends BeanApiBase {
  select(options?: IApiActionOptions) {
    return this.$fetch.get<any, ApiApiHomeBaseSiteCatalogselectResponseBody>(
      ApiApiHomeBaseSiteCatalogselectPath,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }
}
