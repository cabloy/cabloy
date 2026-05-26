import type { AxiosInstance } from 'axios';

import axios, { Axios } from 'axios';
import { markRaw } from 'vue';
import { BeanBase, deepExtend } from 'zova';
import { Bean } from 'zova-module-a-bean';

import type { IBeanFetchOptions } from '../types/interceptor.js';

import { ServiceComposer } from '../service/composer.js';

const SymbolFetch = Symbol('SymbolFetch');

export interface BeanFetch extends AxiosInstance {}

@Bean()
export class BeanFetch extends BeanBase {
  private _composer: ServiceComposer;

  protected [SymbolFetch]: AxiosInstance;

  protected async __init__(options?: IBeanFetchOptions) {
    patchAxios(Axios);
    // axiosConfig
    const axiosConfig = deepExtend(
      {},
      { baseURL: this.sys.util.getApiBaseURL() },
      this.scope.config.axios.config,
      options?.axiosConfig,
    );
    // composer
    this._composer = await this.bean._newBean(ServiceComposer, true, this, options?.onionItems);
    // axios
    this[SymbolFetch] = markRaw(axios.create(axiosConfig));
    this._addInterceptors(this[SymbolFetch]);
  }

  protected __get__(prop: string) {
    return this[SymbolFetch] && this[SymbolFetch][prop];
  }

  private _addInterceptors(api: AxiosInstance) {
    // request
    api.interceptors.request.use(
      async config => {
        return await this._composer.executeRequest(config);
      },
      async (_error: any) => {
        if (!(_error instanceof Error)) return Promise.reject(_error);
        const error = await this._composer.executeRequestError(_error as any);
        return Promise.reject(error);
      },
    );
    // response
    api.interceptors.response.use(
      async response => {
        return await this._composer.executeResponse(response);
      },
      async (_error: any) => {
        if (!(_error instanceof Error)) return Promise.reject(_error);
        const error = await this._composer.executeResponseError(_error as any);
        return Promise.reject(error);
      },
    );
  }
}

function patchAxios(_Axios: any) {
  if (_Axios.__requestPatched) return;
  _Axios.__requestPatched = true;
  const requestPrev: Function = _Axios.prototype.request;
  _Axios.prototype.request = async function (...args: any[]) {
    try {
      return await requestPrev.call(this, ...args);
    } catch (err) {
      if (err instanceof Error) throw err;
      return err;
    }
  };
}
