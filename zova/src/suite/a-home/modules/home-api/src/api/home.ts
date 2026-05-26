import { Api, BeanApiBase, IApiActionOptions } from 'zova-module-a-api';

import { OpenApiBaseURL, type paths } from './openapi/index.js';

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
