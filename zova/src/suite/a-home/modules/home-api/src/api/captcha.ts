import { Api, BeanApiBase, IApiActionOptions } from 'zova-module-a-api';

import { OpenApiBaseURL, type paths } from './openapi/index.js';

/** Captcha_create */
export const ApiApiCaptchacreatePath = '/api/captcha/create';
export type ApiApiCaptchacreatePath = '/api/captcha/create';
export type ApiApiCaptchacreateMethod = 'post';
export type ApiApiCaptchacreateRequestBody = {
  scene: string;
};
export type ApiApiCaptchacreateResponseBody =
  paths[ApiApiCaptchacreatePath][ApiApiCaptchacreateMethod]['responses']['200']['content']['application/json']['data'];

/** Captcha_refresh */
export const ApiApiCaptcharefreshPath = '/api/captcha/refresh';
export type ApiApiCaptcharefreshPath = '/api/captcha/refresh';
export type ApiApiCaptcharefreshMethod = 'post';
export type ApiApiCaptcharefreshRequestBody = {
  id: string;
  scene: string;
};
export type ApiApiCaptcharefreshResponseBody =
  paths[ApiApiCaptcharefreshPath][ApiApiCaptcharefreshMethod]['responses']['200']['content']['application/json']['data'];

/** Captcha_verifyImmediate */
export const ApiApiCaptchaverifyImmediatePath = '/api/captcha/verifyImmediate';
export type ApiApiCaptchaverifyImmediatePath = '/api/captcha/verifyImmediate';
export type ApiApiCaptchaverifyImmediateMethod = 'post';
export type ApiApiCaptchaverifyImmediateRequestBody = {
  id: string;
  token?: unknown;
};
export type ApiApiCaptchaverifyImmediateResponseBody =
  paths[ApiApiCaptchaverifyImmediatePath][ApiApiCaptchaverifyImmediateMethod]['responses']['200']['content']['application/json']['data'];

@Api()
export class ApiCaptcha extends BeanApiBase {
  create(body: ApiApiCaptchacreateRequestBody, options?: IApiActionOptions) {
    return this.$fetch.post<any, ApiApiCaptchacreateResponseBody>(
      ApiApiCaptchacreatePath,
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options),
    );
  }

  refresh(body: ApiApiCaptcharefreshRequestBody, options?: IApiActionOptions) {
    return this.$fetch.post<any, ApiApiCaptcharefreshResponseBody>(
      ApiApiCaptcharefreshPath,
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options),
    );
  }

  verifyImmediate(body: ApiApiCaptchaverifyImmediateRequestBody, options?: IApiActionOptions) {
    return this.$fetch.post<any, ApiApiCaptchaverifyImmediateResponseBody>(
      ApiApiCaptchaverifyImmediatePath,
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options),
    );
  }
}
