import { Api, BeanApiBase, IApiActionOptions } from 'zova-module-a-api';

import { OpenApiBaseURL, type paths } from './openapi/index.js';

/** HomeBaseMenu_retrieveMenus */
export const ApiApiHomeBaseMenuretrieveMenusPath = '/api/home/base/menu/{publicPath?}';
export type ApiApiHomeBaseMenuretrieveMenusPath = '/api/home/base/menu/{publicPath?}';
export type ApiApiHomeBaseMenuretrieveMenusMethod = 'get';
export type ApiApiHomeBaseMenuretrieveMenusRequestParams =
  paths[ApiApiHomeBaseMenuretrieveMenusPath][ApiApiHomeBaseMenuretrieveMenusMethod]['parameters']['path'];
export type ApiApiHomeBaseMenuretrieveMenusResponseBody =
  paths[ApiApiHomeBaseMenuretrieveMenusPath][ApiApiHomeBaseMenuretrieveMenusMethod]['responses']['200']['content']['application/json']['data'];

@Api()
export class ApiHomeBaseMenu extends BeanApiBase {
  retrieveMenus(
    options: {
      params: ApiApiHomeBaseMenuretrieveMenusRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.get<any, ApiApiHomeBaseMenuretrieveMenusResponseBody>(
      this.$pathTranslate(ApiApiHomeBaseMenuretrieveMenusPath, options.params),
      this.$configPrepare(OpenApiBaseURL(this.sys), options),
    );
  }
}
