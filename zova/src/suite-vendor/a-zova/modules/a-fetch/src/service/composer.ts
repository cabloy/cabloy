import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

import { BeanBase, cast, deepExtend, SymbolErrorInstanceInfo, Use } from 'zova';
import { IOnionItem, IOnionSlice, SysOnion, TypeComposer } from 'zova-module-a-bean';
import { Service } from 'zova-module-a-bean';

import type { BeanFetch } from '../bean/bean.fetch.js';
import type {
  IDecoratorInterceptorOptions,
  IInterceptorRecord,
  IInterceptorRequest,
  IInterceptorRequestError,
  IInterceptorResponse,
  IInterceptorResponseError,
} from '../types/interceptor.js';

@Service()
export class ServiceComposer extends BeanBase {
  protected $beanFetch: BeanFetch;
  @Use()
  $$sysOnion: SysOnion;

  private _composerRequest: TypeComposer;
  private _composerRequestError: TypeComposer;
  private _composerResponse: TypeComposer;
  private _composerResponseError: TypeComposer;

  protected async __init__(
    beanFetch: BeanFetch,
    onionItems?:
      | IOnionItem<IDecoratorInterceptorOptions, keyof IInterceptorRecord>
      | IOnionItem<IDecoratorInterceptorOptions, keyof IInterceptorRecord>[],
  ) {
    this.$beanFetch = beanFetch;
    await this._createComposer(onionItems);
  }

  public executeRequest(config: AxiosRequestConfig) {
    return this._composerRequest(config);
  }

  public executeRequestError(error: AxiosError) {
    return this._composerRequestError(error);
  }

  public executeResponse(response: AxiosResponse) {
    return this._composerResponse(response);
  }

  public async executeResponseError(error: AxiosError) {
    error = await this._composerResponseError(error);
    if (error instanceof Error) {
      error[SymbolErrorInstanceInfo] = {
        instance: this.ctx.instance,
        info: 'executeResponseError',
      };
    }
    return error;
  }

  private async _createComposer(
    onionItems?:
      | IOnionItem<IDecoratorInterceptorOptions, keyof IInterceptorRecord>
      | IOnionItem<IDecoratorInterceptorOptions, keyof IInterceptorRecord>[],
  ) {
    // onionSlices
    let onionSlices: IOnionSlice<IDecoratorInterceptorOptions, keyof IInterceptorRecord>[];
    if (onionItems) {
      onionSlices = await this.$$sysOnion.interceptor.loadOnions(onionItems);
    } else {
      onionSlices = await this.$$sysOnion.interceptor.loadOnionsFromPackage();
    }
    // create interceptors
    for (const onionSlice of onionSlices) {
      onionSlice.beanInstance = await this.bean._newBean(
        onionSlice.beanFullName as any,
        true,
        this.$beanFetch,
        onionSlice.options,
      );
    }
    // compose
    this._composerRequest = this.$$sysOnion.interceptor.compose(
      onionSlices,
      (onionSlice, config: AxiosRequestConfig, next) => {
        // options
        const options = this._combineOnionOptions(onionSlice, config);
        // enable match ignore
        if (!this.$$sysOnion.checkOnionOptionsEnabled(options, config.url)) {
          return next(config);
        }
        // execute
        const beanInstance = cast<IInterceptorRequest>(onionSlice.beanInstance);
        if (!beanInstance.onRequest) return next(config);
        return beanInstance.onRequest(config, options, next as any);
      },
    );
    this._composerRequestError = this.$$sysOnion.interceptor.compose(
      onionSlices,
      (onionSlice, error: AxiosError, next) => {
        const config = error.config;
        // options
        const options = this._combineOnionOptions(onionSlice, config);
        // enable match ignore
        if (!this.$$sysOnion.checkOnionOptionsEnabled(options, config?.url)) {
          return next(error);
        }
        // execute
        const beanInstance = cast<IInterceptorRequestError>(onionSlice.beanInstance);
        if (!beanInstance.onRequestError) return next(error);
        return beanInstance.onRequestError(error, options, next as any);
      },
    );
    this._composerResponse = this.$$sysOnion.interceptor.compose(
      onionSlices,
      (onionSlice, response: AxiosResponse, next) => {
        const config = response.config;
        // options
        const options = this._combineOnionOptions(onionSlice, config);
        // enable match ignore
        if (!this.$$sysOnion.checkOnionOptionsEnabled(options, config?.url)) {
          return next(response);
        }
        // execute
        const beanInstance = cast<IInterceptorResponse>(onionSlice.beanInstance);
        if (!beanInstance.onResponse) return next(response);
        return beanInstance.onResponse(response, options, next as any);
      },
    );
    this._composerResponseError = this.$$sysOnion.interceptor.compose(
      onionSlices,
      (onionSlice, error: AxiosError, next) => {
        const config = error.config;
        // options
        const options = this._combineOnionOptions(onionSlice, config);
        // enable match ignore
        if (!this.$$sysOnion.checkOnionOptionsEnabled(options, config?.url)) {
          return next(error);
        }
        // execute
        const beanInstance = cast<IInterceptorResponseError>(onionSlice.beanInstance);
        if (!beanInstance.onResponseError) return next(error);
        return beanInstance.onResponseError(error, options, next as any);
      },
    );
  }

  private _combineOnionOptions(
    item: IOnionSlice<IDecoratorInterceptorOptions, keyof IInterceptorRecord>,
    config?: AxiosRequestConfig,
  ) {
    // options: dynamic
    let optionsDynamic;
    if (config?.interceptors) {
      optionsDynamic = config?.interceptors[item.name];
    }
    // final options
    const options = optionsDynamic ? deepExtend({}, item.options, optionsDynamic) : item.options;
    // ok
    return options;
  }
}
