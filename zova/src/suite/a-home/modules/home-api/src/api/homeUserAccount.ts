import type { IApiActionOptions } from 'zova-module-a-api';

import { Api, BeanApiBase } from 'zova-module-a-api';

import type { components, paths } from './openapi/index.js';

import { OpenApiBaseURL } from './openapi/index.js';

/** HomeUserAccount_current */
export const ApiApiHomeUserAccountcurrentPath = '/api/home/user/account/current';
export type ApiApiHomeUserAccountcurrentPath = '/api/home/user/account/current';
export type ApiApiHomeUserAccountcurrentMethod = 'get';
export type ApiApiHomeUserAccountcurrentResponseBody =
  paths[ApiApiHomeUserAccountcurrentPath][ApiApiHomeUserAccountcurrentMethod]['responses']['200']['content']['application/json']['data'];

/** HomeUserAccount_updateProfile */
export const ApiApiHomeUserAccountupdateProfilePath = '/api/home/user/account/profile';
export type ApiApiHomeUserAccountupdateProfilePath = '/api/home/user/account/profile';
export type ApiApiHomeUserAccountupdateProfileMethod = 'patch';
export type ApiApiHomeUserAccountupdateProfileRequestBody =
  components['schemas']['home-user.dto.accountProfileUpdate'];
export type ApiApiHomeUserAccountupdateProfileResponseBody =
  paths[ApiApiHomeUserAccountupdateProfilePath][ApiApiHomeUserAccountupdateProfileMethod]['responses']['200']['content']['application/json']['data'];

/** HomeUserAccount_consumeActivation */
export const ApiApiHomeUserAccountconsumeActivationPath =
  '/api/home/user/account/activation/consume';
export type ApiApiHomeUserAccountconsumeActivationPath =
  '/api/home/user/account/activation/consume';
export type ApiApiHomeUserAccountconsumeActivationMethod = 'post';
export type ApiApiHomeUserAccountconsumeActivationRequestBody =
  components['schemas']['home-user.dto.accountActivation'];
export type ApiApiHomeUserAccountconsumeActivationResponseBody =
  paths[ApiApiHomeUserAccountconsumeActivationPath][ApiApiHomeUserAccountconsumeActivationMethod]['responses']['200']['content']['application/json']['data'];

/** HomeUserAccount_changePassword */
export const ApiApiHomeUserAccountchangePasswordPath = '/api/home/user/account/password/change';
export type ApiApiHomeUserAccountchangePasswordPath = '/api/home/user/account/password/change';
export type ApiApiHomeUserAccountchangePasswordMethod = 'post';
export type ApiApiHomeUserAccountchangePasswordRequestBody =
  components['schemas']['home-user.dto.accountPasswordChange'];
export type ApiApiHomeUserAccountchangePasswordResponseBody =
  paths[ApiApiHomeUserAccountchangePasswordPath][ApiApiHomeUserAccountchangePasswordMethod]['responses']['200']['content']['application/json']['data'];

/** HomeUserAccount_issuePasswordSetLink */
export const ApiApiHomeUserAccountissuePasswordSetLinkPath =
  '/api/home/user/account/password-set/issue';
export type ApiApiHomeUserAccountissuePasswordSetLinkPath =
  '/api/home/user/account/password-set/issue';
export type ApiApiHomeUserAccountissuePasswordSetLinkMethod = 'post';
export type ApiApiHomeUserAccountissuePasswordSetLinkRequestBody =
  components['schemas']['home-user.dto.accountPasswordSetIssue'];
export type ApiApiHomeUserAccountissuePasswordSetLinkResponseBody =
  paths[ApiApiHomeUserAccountissuePasswordSetLinkPath][ApiApiHomeUserAccountissuePasswordSetLinkMethod]['responses']['200']['content']['application/json']['data'];

/** HomeUserAccount_consumePasswordSet */
export const ApiApiHomeUserAccountconsumePasswordSetPath =
  '/api/home/user/account/password-set/consume';
export type ApiApiHomeUserAccountconsumePasswordSetPath =
  '/api/home/user/account/password-set/consume';
export type ApiApiHomeUserAccountconsumePasswordSetMethod = 'post';
export type ApiApiHomeUserAccountconsumePasswordSetRequestBody =
  components['schemas']['home-user.dto.accountPasswordSet'];
export type ApiApiHomeUserAccountconsumePasswordSetResponseBody =
  paths[ApiApiHomeUserAccountconsumePasswordSetPath][ApiApiHomeUserAccountconsumePasswordSetMethod]['responses']['200']['content']['application/json']['data'];

/** HomeUserAccount_requestPasswordReset */
export const ApiApiHomeUserAccountrequestPasswordResetPath =
  '/api/home/user/account/password-reset/request';
export type ApiApiHomeUserAccountrequestPasswordResetPath =
  '/api/home/user/account/password-reset/request';
export type ApiApiHomeUserAccountrequestPasswordResetMethod = 'post';
export type ApiApiHomeUserAccountrequestPasswordResetRequestBody =
  components['schemas']['home-user.dto.accountPasswordResetRequest'];
export type ApiApiHomeUserAccountrequestPasswordResetResponseBody =
  paths[ApiApiHomeUserAccountrequestPasswordResetPath][ApiApiHomeUserAccountrequestPasswordResetMethod]['responses']['200']['content']['application/json']['data'];

/** HomeUserAccount_consumePasswordReset */
export const ApiApiHomeUserAccountconsumePasswordResetPath =
  '/api/home/user/account/password-reset/consume';
export type ApiApiHomeUserAccountconsumePasswordResetPath =
  '/api/home/user/account/password-reset/consume';
export type ApiApiHomeUserAccountconsumePasswordResetMethod = 'post';
export type ApiApiHomeUserAccountconsumePasswordResetRequestBody =
  components['schemas']['home-user.dto.accountPasswordReset'];
export type ApiApiHomeUserAccountconsumePasswordResetResponseBody =
  paths[ApiApiHomeUserAccountconsumePasswordResetPath][ApiApiHomeUserAccountconsumePasswordResetMethod]['responses']['200']['content']['application/json']['data'];

@Api()
export class ApiHomeUserAccount extends BeanApiBase {
  current(options?: IApiActionOptions) {
    return this.$fetch.get<any, ApiApiHomeUserAccountcurrentResponseBody>(
      ApiApiHomeUserAccountcurrentPath,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  updateProfile(body: ApiApiHomeUserAccountupdateProfileRequestBody, options?: IApiActionOptions) {
    return this.$fetch.patch<any, ApiApiHomeUserAccountupdateProfileResponseBody>(
      ApiApiHomeUserAccountupdateProfilePath,
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  consumeActivation(
    body: ApiApiHomeUserAccountconsumeActivationRequestBody,
    options?: IApiActionOptions,
  ) {
    return this.$fetch.post<any, ApiApiHomeUserAccountconsumeActivationResponseBody>(
      ApiApiHomeUserAccountconsumeActivationPath,
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options),
    );
  }

  changePassword(
    body: ApiApiHomeUserAccountchangePasswordRequestBody,
    options?: IApiActionOptions,
  ) {
    return this.$fetch.post<any, ApiApiHomeUserAccountchangePasswordResponseBody>(
      ApiApiHomeUserAccountchangePasswordPath,
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  issuePasswordSetLink(
    body: ApiApiHomeUserAccountissuePasswordSetLinkRequestBody,
    options?: IApiActionOptions,
  ) {
    return this.$fetch.post<any, ApiApiHomeUserAccountissuePasswordSetLinkResponseBody>(
      ApiApiHomeUserAccountissuePasswordSetLinkPath,
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  consumePasswordSet(
    body: ApiApiHomeUserAccountconsumePasswordSetRequestBody,
    options?: IApiActionOptions,
  ) {
    return this.$fetch.post<any, ApiApiHomeUserAccountconsumePasswordSetResponseBody>(
      ApiApiHomeUserAccountconsumePasswordSetPath,
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options),
    );
  }

  requestPasswordReset(
    body: ApiApiHomeUserAccountrequestPasswordResetRequestBody,
    options?: IApiActionOptions,
  ) {
    return this.$fetch.post<any, ApiApiHomeUserAccountrequestPasswordResetResponseBody>(
      ApiApiHomeUserAccountrequestPasswordResetPath,
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options),
    );
  }

  consumePasswordReset(
    body: ApiApiHomeUserAccountconsumePasswordResetRequestBody,
    options?: IApiActionOptions,
  ) {
    return this.$fetch.post<any, ApiApiHomeUserAccountconsumePasswordResetResponseBody>(
      ApiApiHomeUserAccountconsumePasswordResetPath,
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options),
    );
  }
}
