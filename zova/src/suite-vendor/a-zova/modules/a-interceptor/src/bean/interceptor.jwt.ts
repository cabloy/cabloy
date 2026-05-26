import type { AxiosRequestConfig } from 'axios';
import type {
  BeanFetch,
  IDecoratorInterceptorOptions,
  IInterceptorRequest,
  NextInterceptorRequest,
} from 'zova-module-a-fetch';

import { $protocolKey } from 'zova';
import { BeanInterceptorBase, Interceptor } from 'zova-module-a-fetch';

import type { IJwtAdapter, IJwtInfo } from '../types/jwt.js';

export interface IInterceptorOptionsJwt extends IDecoratorInterceptorOptions {
  jwtAdapter?: string;
  authToken?: boolean | string;
}

@Interceptor<IInterceptorOptionsJwt>({ dependencies: 'a-interceptor:headers' })
export class InterceptorJwt
  extends BeanInterceptorBase<IInterceptorOptionsJwt>
  implements IInterceptorRequest
{
  private _beanJwtAdapter: IJwtAdapter;
  private _refreshAuthTokenPromise?: Promise<IJwtInfo>;

  protected async __init__(_beanFetch: BeanFetch, options: IInterceptorOptionsJwt) {
    const jwtAdapter = options.jwtAdapter || this.scope.config.jwtAdapter;
    const beanFullName = jwtAdapter.replace(':', '.service.');
    // singleton
    this._beanJwtAdapter = await this.app.bean._getBean(beanFullName as any, true);
  }

  async onRequest(
    config: AxiosRequestConfig,
    options: IInterceptorOptionsJwt,
    next: NextInterceptorRequest,
  ): Promise<AxiosRequestConfig> {
    try {
      const accessToken = await this.prepareAccessToken(config, options.authToken);
      if (accessToken) {
        config.headers!.Authorization = `Bearer ${accessToken}`;
      }
    } catch (error: any) {
      error.config = config;
      error.request = undefined;
      error.response = undefined;
      throw error;
    }
    return next(config);
  }

  async prepareAccessToken(
    config: AxiosRequestConfig,
    authToken: string | boolean | undefined,
  ): Promise<string | undefined> {
    if (!this.sys.config.api.jwt) return;
    if (this.sys.config.ssr.ignoreCookieOnServer) return;
    // use default in scope.config rather than IInterceptorOptionsJwt.options
    const authTokenCurrent = authToken ?? this.scope.config.authToken.default;
    // authToken = authToken ?? this.scope.config.authToken.default;
    if (process.env.SERVER) {
      config.headers![$protocolKey('x-vona-jwt-authtoken')] =
        typeof authTokenCurrent === 'string' ? true : authTokenCurrent;
    }
    // // authToken: false
    // if (authTokenCurrent === false) return;
    // authToken: string
    if (typeof authTokenCurrent === 'string') return authTokenCurrent;
    // if (typeof authToken === 'string') return authToken;
    // authToken: true
    let jwtInfo = await this._beanJwtAdapter.getJwtInfo();
    if (!jwtInfo) {
      if (authToken === true) {
        this.app.throw(401); // 401 rather than 403
      }
      return;
    }
    // accessToken
    if (process.env.SERVER || !jwtInfo.expireTime || jwtInfo.expireTime > Date.now()) {
      if (!jwtInfo.accessToken) {
        if (authToken === true) this.app.throw(401);
        return;
      }
      return jwtInfo.accessToken;
    }
    // refreshToken
    if (!jwtInfo.refreshToken) {
      if (authToken === true) this.app.throw(401);
      return;
    } else {
      if (authToken === false) {
        // need not refreshAuthToken, such as captcha.create
        return;
      }
    }
    jwtInfo = await this._refreshAuthToken(jwtInfo.refreshToken);
    return jwtInfo.accessToken;
  }

  private async _refreshAuthToken(refreshToken: string) {
    if (!this._refreshAuthTokenPromise) {
      this._refreshAuthTokenPromise = this._refreshAuthTokenInner(refreshToken);
    }
    return await this._refreshAuthTokenPromise;
  }

  private async _refreshAuthTokenInner(refreshToken: string) {
    try {
      return await this._beanJwtAdapter.refreshAuthToken(refreshToken);
    } finally {
      this._refreshAuthTokenPromise = undefined;
    }
  }
}
