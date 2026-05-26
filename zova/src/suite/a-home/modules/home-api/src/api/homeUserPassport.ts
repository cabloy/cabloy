import { Api, BeanApiBase, IApiActionOptions } from 'zova-module-a-api';

import { OpenApiBaseURL, type components, type paths } from './openapi/index.js';

/** HomeUserPassport_current */
export const ApiApiHomeUserPassportcurrentPath = '/api/home/user/passport/current';
export type ApiApiHomeUserPassportcurrentPath = '/api/home/user/passport/current';
export type ApiApiHomeUserPassportcurrentMethod = 'get';
export type ApiApiHomeUserPassportcurrentResponseBody =
  paths[ApiApiHomeUserPassportcurrentPath][ApiApiHomeUserPassportcurrentMethod]['responses']['200']['content']['application/json']['data'];

/** HomeUserPassport_logout */
export const ApiApiHomeUserPassportlogoutPath = '/api/home/user/passport/logout';
export type ApiApiHomeUserPassportlogoutPath = '/api/home/user/passport/logout';
export type ApiApiHomeUserPassportlogoutMethod = 'post';
export type ApiApiHomeUserPassportlogoutResponseBody =
  paths[ApiApiHomeUserPassportlogoutPath][ApiApiHomeUserPassportlogoutMethod]['responses']['200']['content']['application/json']['data'];

/** HomeUserPassport_register */
export const ApiApiHomeUserPassportregisterPath = '/api/home/user/passport/register';
export type ApiApiHomeUserPassportregisterPath = '/api/home/user/passport/register';
export type ApiApiHomeUserPassportregisterMethod = 'post';
export type ApiApiHomeUserPassportregisterRequestBody =
  components['schemas']['home-user.dto.register'];
export type ApiApiHomeUserPassportregisterResponseBody =
  paths[ApiApiHomeUserPassportregisterPath][ApiApiHomeUserPassportregisterMethod]['responses']['200']['content']['application/json']['data'];

/** HomeUserPassport_login */
export const ApiApiHomeUserPassportloginPath = '/api/home/user/passport/login';
export type ApiApiHomeUserPassportloginPath = '/api/home/user/passport/login';
export type ApiApiHomeUserPassportloginMethod = 'post';
export type ApiApiHomeUserPassportloginRequestBody = components['schemas']['home-user.dto.login'];
export type ApiApiHomeUserPassportloginResponseBody =
  paths[ApiApiHomeUserPassportloginPath][ApiApiHomeUserPassportloginMethod]['responses']['200']['content']['application/json']['data'];

/** HomeUserPassport_loginOauth */
export const ApiApiHomeUserPassportloginOauthPath =
  '/api/home/user/passport/login/{module}/{providerName}/{clientName?}';
export type ApiApiHomeUserPassportloginOauthPath =
  '/api/home/user/passport/login/{module}/{providerName}/{clientName?}';
export type ApiApiHomeUserPassportloginOauthMethod = 'get';
export type ApiApiHomeUserPassportloginOauthRequestParams =
  paths[ApiApiHomeUserPassportloginOauthPath][ApiApiHomeUserPassportloginOauthMethod]['parameters']['path'];
export type ApiApiHomeUserPassportloginOauthRequestQuery =
  paths[ApiApiHomeUserPassportloginOauthPath][ApiApiHomeUserPassportloginOauthMethod]['parameters']['query'];
export type ApiApiHomeUserPassportloginOauthResponseBody =
  paths[ApiApiHomeUserPassportloginOauthPath][ApiApiHomeUserPassportloginOauthMethod]['responses']['200']['content']['application/json']['data'];

/** HomeUserPassport_associate */
export const ApiApiHomeUserPassportassociatePath =
  '/api/home/user/passport/associate/{module}/{providerName}/{clientName?}';
export type ApiApiHomeUserPassportassociatePath =
  '/api/home/user/passport/associate/{module}/{providerName}/{clientName?}';
export type ApiApiHomeUserPassportassociateMethod = 'get';
export type ApiApiHomeUserPassportassociateRequestParams =
  paths[ApiApiHomeUserPassportassociatePath][ApiApiHomeUserPassportassociateMethod]['parameters']['path'];
export type ApiApiHomeUserPassportassociateRequestQuery =
  paths[ApiApiHomeUserPassportassociatePath][ApiApiHomeUserPassportassociateMethod]['parameters']['query'];
export type ApiApiHomeUserPassportassociateResponseBody =
  paths[ApiApiHomeUserPassportassociatePath][ApiApiHomeUserPassportassociateMethod]['responses']['200']['content']['application/json']['data'];

/** HomeUserPassport_migrate */
export const ApiApiHomeUserPassportmigratePath =
  '/api/home/user/passport/migrate/{module}/{providerName}/{clientName?}';
export type ApiApiHomeUserPassportmigratePath =
  '/api/home/user/passport/migrate/{module}/{providerName}/{clientName?}';
export type ApiApiHomeUserPassportmigrateMethod = 'get';
export type ApiApiHomeUserPassportmigrateRequestParams =
  paths[ApiApiHomeUserPassportmigratePath][ApiApiHomeUserPassportmigrateMethod]['parameters']['path'];
export type ApiApiHomeUserPassportmigrateRequestQuery =
  paths[ApiApiHomeUserPassportmigratePath][ApiApiHomeUserPassportmigrateMethod]['parameters']['query'];
export type ApiApiHomeUserPassportmigrateResponseBody =
  paths[ApiApiHomeUserPassportmigratePath][ApiApiHomeUserPassportmigrateMethod]['responses']['200']['content']['application/json']['data'];

/** HomeUserPassport_refreshAuthToken */
export const ApiApiHomeUserPassportrefreshAuthTokenPath =
  '/api/home/user/passport/refreshAuthToken';
export type ApiApiHomeUserPassportrefreshAuthTokenPath = '/api/home/user/passport/refreshAuthToken';
export type ApiApiHomeUserPassportrefreshAuthTokenMethod = 'post';
export type ApiApiHomeUserPassportrefreshAuthTokenRequestBody = {
  refreshToken: string;
};
export type ApiApiHomeUserPassportrefreshAuthTokenResponseBody =
  paths[ApiApiHomeUserPassportrefreshAuthTokenPath][ApiApiHomeUserPassportrefreshAuthTokenMethod]['responses']['200']['content']['application/json']['data'];

/** HomeUserPassport_createPassportJwtFromOauthCode */
export const ApiApiHomeUserPassportcreatePassportJwtFromOauthCodePath =
  '/api/home/user/passport/createPassportJwtFromOauthCode';
export type ApiApiHomeUserPassportcreatePassportJwtFromOauthCodePath =
  '/api/home/user/passport/createPassportJwtFromOauthCode';
export type ApiApiHomeUserPassportcreatePassportJwtFromOauthCodeMethod = 'post';
export type ApiApiHomeUserPassportcreatePassportJwtFromOauthCodeRequestBody = {
  code: string;
};
export type ApiApiHomeUserPassportcreatePassportJwtFromOauthCodeResponseBody =
  paths[ApiApiHomeUserPassportcreatePassportJwtFromOauthCodePath][ApiApiHomeUserPassportcreatePassportJwtFromOauthCodeMethod]['responses']['200']['content']['application/json']['data'];

/** HomeUserPassport_createTempAuthToken */
export const ApiApiHomeUserPassportcreateTempAuthTokenPath =
  '/api/home/user/passport/createTempAuthToken';
export type ApiApiHomeUserPassportcreateTempAuthTokenPath =
  '/api/home/user/passport/createTempAuthToken';
export type ApiApiHomeUserPassportcreateTempAuthTokenMethod = 'post';
export type ApiApiHomeUserPassportcreateTempAuthTokenRequestQuery =
  paths[ApiApiHomeUserPassportcreateTempAuthTokenPath][ApiApiHomeUserPassportcreateTempAuthTokenMethod]['parameters']['query'];
export type ApiApiHomeUserPassportcreateTempAuthTokenResponseBody =
  paths[ApiApiHomeUserPassportcreateTempAuthTokenPath][ApiApiHomeUserPassportcreateTempAuthTokenMethod]['responses']['200']['content']['application/json']['data'];

@Api()
export class ApiHomeUserPassport extends BeanApiBase {
  current(options?: IApiActionOptions) {
    return this.$fetch.get<any, ApiApiHomeUserPassportcurrentResponseBody>(
      ApiApiHomeUserPassportcurrentPath,
      this.$configPrepare(OpenApiBaseURL(this.sys), options),
    );
  }

  logout(body?: undefined, options?: IApiActionOptions) {
    return this.$fetch.post<any, ApiApiHomeUserPassportlogoutResponseBody>(
      ApiApiHomeUserPassportlogoutPath,
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  register(body: ApiApiHomeUserPassportregisterRequestBody, options?: IApiActionOptions) {
    return this.$fetch.post<any, ApiApiHomeUserPassportregisterResponseBody>(
      ApiApiHomeUserPassportregisterPath,
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options),
    );
  }

  login(body: ApiApiHomeUserPassportloginRequestBody, options?: IApiActionOptions) {
    return this.$fetch.post<any, ApiApiHomeUserPassportloginResponseBody>(
      ApiApiHomeUserPassportloginPath,
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options),
    );
  }

  loginOauth(
    options: {
      params: ApiApiHomeUserPassportloginOauthRequestParams;
      query?: ApiApiHomeUserPassportloginOauthRequestQuery;
    } & IApiActionOptions,
  ) {
    return this.$fetch.get<any, ApiApiHomeUserPassportloginOauthResponseBody>(
      this.$pathTranslate(ApiApiHomeUserPassportloginOauthPath, options.params),
      this.$configPrepare(OpenApiBaseURL(this.sys), options),
    );
  }

  associate(
    options: {
      params: ApiApiHomeUserPassportassociateRequestParams;
      query?: ApiApiHomeUserPassportassociateRequestQuery;
    } & IApiActionOptions,
  ) {
    return this.$fetch.get<any, ApiApiHomeUserPassportassociateResponseBody>(
      this.$pathTranslate(ApiApiHomeUserPassportassociatePath, options.params),
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  migrate(
    options: {
      params: ApiApiHomeUserPassportmigrateRequestParams;
      query?: ApiApiHomeUserPassportmigrateRequestQuery;
    } & IApiActionOptions,
  ) {
    return this.$fetch.get<any, ApiApiHomeUserPassportmigrateResponseBody>(
      this.$pathTranslate(ApiApiHomeUserPassportmigratePath, options.params),
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  refreshAuthToken(
    body: ApiApiHomeUserPassportrefreshAuthTokenRequestBody,
    options?: IApiActionOptions,
  ) {
    return this.$fetch.post<any, ApiApiHomeUserPassportrefreshAuthTokenResponseBody>(
      ApiApiHomeUserPassportrefreshAuthTokenPath,
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options),
    );
  }

  createPassportJwtFromOauthCode(
    body: ApiApiHomeUserPassportcreatePassportJwtFromOauthCodeRequestBody,
    options?: IApiActionOptions,
  ) {
    return this.$fetch.post<any, ApiApiHomeUserPassportcreatePassportJwtFromOauthCodeResponseBody>(
      ApiApiHomeUserPassportcreatePassportJwtFromOauthCodePath,
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options),
    );
  }

  createTempAuthToken(
    body?: undefined,
    options?: {
      query?: ApiApiHomeUserPassportcreateTempAuthTokenRequestQuery;
    } & IApiActionOptions,
  ) {
    return this.$fetch.post<any, ApiApiHomeUserPassportcreateTempAuthTokenResponseBody>(
      ApiApiHomeUserPassportcreateTempAuthTokenPath,
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }
}
