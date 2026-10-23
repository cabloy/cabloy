import type { IApiActionOptions } from 'zova-module-a-api';

import { Api, BeanApiBase } from 'zova-module-a-api';

import type { paths } from './openapi/index.ts';

import { OpenApiBaseURL } from './openapi/index.ts';

/** Home_index */
export const ApiApiHomeindexPath = '/';
export type ApiApiHomeindexPath = '/';
export type ApiApiHomeindexMethod = 'get';
export type ApiApiHomeindexResponseBody =
  paths[ApiApiHomeindexPath][ApiApiHomeindexMethod]['responses']['200']['content']['application/json']['data'];

@Api()
export class ApiHome extends BeanApiBase {
  /** @description Home */
  index(options?: IApiActionOptions) {
    return this.$fetch.get<any, ApiApiHomeindexResponseBody>(
      ApiApiHomeindexPath,
      this.$configPrepare(OpenApiBaseURL(this.sys), options),
    );
  }
}
