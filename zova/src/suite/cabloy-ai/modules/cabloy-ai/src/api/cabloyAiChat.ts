import type { IApiActionOptions } from 'zova-module-a-api';

import { Api, BeanApiBase } from 'zova-module-a-api';

import type { components, paths } from './openapi/index.ts';

import { OpenApiBaseURL } from './openapi/index.ts';

/** CabloyAiChat_create */
export const ApiApiCabloyAiChatcreatePath = '/api/cabloy/ai/chat/create';
export type ApiApiCabloyAiChatcreatePath = '/api/cabloy/ai/chat/create';
export type ApiApiCabloyAiChatcreateMethod = 'post';
export type ApiApiCabloyAiChatcreateRequestBody = components['schemas']['cabloy-ai.dto.chatCreate'];
export type ApiApiCabloyAiChatcreateResponseBody =
  paths[ApiApiCabloyAiChatcreatePath][ApiApiCabloyAiChatcreateMethod]['responses']['200']['content']['application/json']['data'];

/** CabloyAiChat_list */
export const ApiApiCabloyAiChatlistPath = '/api/cabloy/ai/chat/list';
export type ApiApiCabloyAiChatlistPath = '/api/cabloy/ai/chat/list';
export type ApiApiCabloyAiChatlistMethod = 'post';
export type ApiApiCabloyAiChatlistRequestBody = components['schemas']['cabloy-ai.dto.chatList'];
export type ApiApiCabloyAiChatlistResponseBody =
  paths[ApiApiCabloyAiChatlistPath][ApiApiCabloyAiChatlistMethod]['responses']['200']['content']['application/json']['data'];

/** CabloyAiChat_history */
export const ApiApiCabloyAiChathistoryPath = '/api/cabloy/ai/chat/history';
export type ApiApiCabloyAiChathistoryPath = '/api/cabloy/ai/chat/history';
export type ApiApiCabloyAiChathistoryMethod = 'post';
export type ApiApiCabloyAiChathistoryRequestBody =
  components['schemas']['cabloy-ai.dto.chatHistoryRequest'];
export type ApiApiCabloyAiChathistoryResponseBody =
  paths[ApiApiCabloyAiChathistoryPath][ApiApiCabloyAiChathistoryMethod]['responses']['200']['content']['application/json']['data'];

/** CabloyAiChat_status */
export const ApiApiCabloyAiChatstatusPath = '/api/cabloy/ai/chat/status';
export type ApiApiCabloyAiChatstatusPath = '/api/cabloy/ai/chat/status';
export type ApiApiCabloyAiChatstatusMethod = 'post';
export type ApiApiCabloyAiChatstatusRequestBody =
  components['schemas']['cabloy-ai.dto.chatStatusRequest'];
export type ApiApiCabloyAiChatstatusResponseBody =
  paths[ApiApiCabloyAiChatstatusPath][ApiApiCabloyAiChatstatusMethod]['responses']['200']['content']['application/json']['data'];

/** CabloyAiChat_remove */
export const ApiApiCabloyAiChatremovePath = '/api/cabloy/ai/chat/remove';
export type ApiApiCabloyAiChatremovePath = '/api/cabloy/ai/chat/remove';
export type ApiApiCabloyAiChatremoveMethod = 'post';
export type ApiApiCabloyAiChatremoveRequestBody =
  components['schemas']['cabloy-ai.dto.chatHistoryRequest'];
export type ApiApiCabloyAiChatremoveResponseBody =
  paths[ApiApiCabloyAiChatremovePath][ApiApiCabloyAiChatremoveMethod]['responses']['200']['content']['application/json']['data'];

/** CabloyAiChat_rename */
export const ApiApiCabloyAiChatrenamePath = '/api/cabloy/ai/chat/rename';
export type ApiApiCabloyAiChatrenamePath = '/api/cabloy/ai/chat/rename';
export type ApiApiCabloyAiChatrenameMethod = 'post';
export type ApiApiCabloyAiChatrenameRequestBody = components['schemas']['cabloy-ai.dto.chatRename'];
export type ApiApiCabloyAiChatrenameResponseBody =
  paths[ApiApiCabloyAiChatrenamePath][ApiApiCabloyAiChatrenameMethod]['responses']['200']['content']['application/json']['data'];

/** CabloyAiChat_pin */
export const ApiApiCabloyAiChatpinPath = '/api/cabloy/ai/chat/pin';
export type ApiApiCabloyAiChatpinPath = '/api/cabloy/ai/chat/pin';
export type ApiApiCabloyAiChatpinMethod = 'post';
export type ApiApiCabloyAiChatpinRequestBody = components['schemas']['cabloy-ai.dto.chatPin'];
export type ApiApiCabloyAiChatpinResponseBody =
  paths[ApiApiCabloyAiChatpinPath][ApiApiCabloyAiChatpinMethod]['responses']['200']['content']['application/json']['data'];

@Api()
export class ApiCabloyAiChat extends BeanApiBase {
  create(body: ApiApiCabloyAiChatcreateRequestBody, options?: IApiActionOptions) {
    return this.$fetch.post<any, ApiApiCabloyAiChatcreateResponseBody>(
      ApiApiCabloyAiChatcreatePath,
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  list(body: ApiApiCabloyAiChatlistRequestBody, options?: IApiActionOptions) {
    return this.$fetch.post<any, ApiApiCabloyAiChatlistResponseBody>(
      ApiApiCabloyAiChatlistPath,
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  history(body: ApiApiCabloyAiChathistoryRequestBody, options?: IApiActionOptions) {
    return this.$fetch.post<any, ApiApiCabloyAiChathistoryResponseBody>(
      ApiApiCabloyAiChathistoryPath,
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  status(body: ApiApiCabloyAiChatstatusRequestBody, options?: IApiActionOptions) {
    return this.$fetch.post<any, ApiApiCabloyAiChatstatusResponseBody>(
      ApiApiCabloyAiChatstatusPath,
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  remove(body: ApiApiCabloyAiChatremoveRequestBody, options?: IApiActionOptions) {
    return this.$fetch.post<any, ApiApiCabloyAiChatremoveResponseBody>(
      ApiApiCabloyAiChatremovePath,
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  rename(body: ApiApiCabloyAiChatrenameRequestBody, options?: IApiActionOptions) {
    return this.$fetch.post<any, ApiApiCabloyAiChatrenameResponseBody>(
      ApiApiCabloyAiChatrenamePath,
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  pin(body: ApiApiCabloyAiChatpinRequestBody, options?: IApiActionOptions) {
    return this.$fetch.post<any, ApiApiCabloyAiChatpinResponseBody>(
      ApiApiCabloyAiChatpinPath,
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }
}
