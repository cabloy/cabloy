import type { AxiosError, AxiosRequestConfig, AxiosResponse, CreateAxiosDefaults } from 'axios';
import type { OmitNever, PowerPartial } from 'zova';
import type {
  IOnionItem,
  IOnionOptionsDeps,
  IOnionOptionsEnable,
  IOnionOptionsMatch,
  ServiceOnion,
  TypeOnionOptionsMatchRule,
} from 'zova-module-a-bean';

import type { BeanFetch } from '../bean/bean.fetch.js';

export type NextInterceptorRequest = (config?: AxiosRequestConfig) => Promise<AxiosRequestConfig>;
export type NextInterceptorResponse = (response?: AxiosResponse) => Promise<AxiosResponse>;
export type NextInterceptorError = (error?: AxiosError) => Promise<AxiosError>;

export interface IBeanFetchOptions {
  axiosConfig?: CreateAxiosDefaults;
  onionItems?:
    | IOnionItem<IDecoratorInterceptorOptions, keyof IInterceptorRecord>
    | IOnionItem<IDecoratorInterceptorOptions, keyof IInterceptorRecord>[];
}

export interface IInterceptorRecord {}

export interface IInterceptorRequest {
  onRequest(
    _config: AxiosRequestConfig,
    _options: IDecoratorInterceptorOptions,
    _next: NextInterceptorRequest,
  ): Promise<AxiosRequestConfig>;
}

export interface IInterceptorRequestError {
  onRequestError(
    _error: AxiosError,
    _options: IDecoratorInterceptorOptions,
    _next: NextInterceptorError,
  ): Promise<AxiosError>;
}

export interface IInterceptorResponse {
  onResponse(
    _response: AxiosResponse,
    _options: IDecoratorInterceptorOptions,
    _next: NextInterceptorResponse,
  ): Promise<AxiosResponse>;
}

export interface IInterceptorResponseError {
  onResponseError(
    _error: AxiosError,
    _options: IDecoratorInterceptorOptions,
    _next: NextInterceptorError,
  ): Promise<AxiosError>;
}

export interface IDecoratorInterceptorOptions
  extends
    IOnionOptionsEnable,
    IOnionOptionsMatch<TypeOnionOptionsMatchRule<string>>,
    IOnionOptionsDeps<keyof IInterceptorRecord> {}

declare module 'zova-module-a-bean' {
  export interface SysOnion {
    interceptor: ServiceOnion<IDecoratorInterceptorOptions, keyof IInterceptorRecord>;
  }
}

declare module 'zova' {
  export interface ConfigOnions {
    interceptor: OmitNever<IInterceptorRecord>;
  }

  export interface IBeanSceneRecord {
    interceptor: never;
  }
}

declare module 'zova' {
  export interface AppMeta {
    $fetch: BeanFetch;
  }
  export interface BeanBase {
    $fetch: BeanFetch;
  }
}

declare module 'axios' {
  export interface AxiosRequestConfig {
    interceptors?: PowerPartial<IInterceptorRecord>;
  }
}
