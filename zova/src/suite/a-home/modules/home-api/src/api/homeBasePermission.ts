import { Api, BeanApiBase, IApiActionOptions } from 'zova-module-a-api';

import { OpenApiBaseURL, type paths } from './openapi/index.js';

/** HomeBasePermission_retrievePermissions */
export const ApiApiHomeBasePermissionretrievePermissionsPath =
  '/api/home/base/permission/{resource}';
export type ApiApiHomeBasePermissionretrievePermissionsPath =
  '/api/home/base/permission/{resource}';
export type ApiApiHomeBasePermissionretrievePermissionsMethod = 'get';
export type ApiApiHomeBasePermissionretrievePermissionsRequestParams =
  paths[ApiApiHomeBasePermissionretrievePermissionsPath][ApiApiHomeBasePermissionretrievePermissionsMethod]['parameters']['path'];
export type ApiApiHomeBasePermissionretrievePermissionsResponseBody =
  paths[ApiApiHomeBasePermissionretrievePermissionsPath][ApiApiHomeBasePermissionretrievePermissionsMethod]['responses']['200']['content']['application/json']['data'];

@Api()
export class ApiHomeBasePermission extends BeanApiBase {
  retrievePermissions(
    options: {
      params: ApiApiHomeBasePermissionretrievePermissionsRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.get<any, ApiApiHomeBasePermissionretrievePermissionsResponseBody>(
      this.$pathTranslate(ApiApiHomeBasePermissionretrievePermissionsPath, options.params),
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }
}
