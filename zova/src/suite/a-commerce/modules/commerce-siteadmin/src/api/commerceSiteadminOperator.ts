import type { IApiActionOptions } from 'zova-module-a-api';

import { Api, BeanApiBase } from 'zova-module-a-api';

import type { paths } from './openapi/index.js';

import { OpenApiBaseURL } from './openapi/index.js';

/** CommerceSiteadminOperator_context */
export const ApiApiCommerceSiteadminOperatorcontextPath =
  '/api/commerce/siteadmin/operator/context';
export type ApiApiCommerceSiteadminOperatorcontextPath = '/api/commerce/siteadmin/operator/context';
export type ApiApiCommerceSiteadminOperatorcontextMethod = 'get';
export type ApiApiCommerceSiteadminOperatorcontextResponseBody =
  paths[ApiApiCommerceSiteadminOperatorcontextPath][ApiApiCommerceSiteadminOperatorcontextMethod]['responses']['200']['content']['application/json']['data'];

@Api()
export class ApiCommerceSiteadminOperator extends BeanApiBase {
  context(options?: IApiActionOptions) {
    return this.$fetch.get<any, ApiApiCommerceSiteadminOperatorcontextResponseBody>(
      ApiApiCommerceSiteadminOperatorcontextPath,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }
}
