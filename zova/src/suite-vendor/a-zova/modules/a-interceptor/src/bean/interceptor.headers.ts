import { AxiosRequestConfig } from 'axios';
import { $protocolKey } from 'zova';
import {
  BeanInterceptorBase,
  IDecoratorInterceptorOptions,
  Interceptor,
  NextInterceptorRequest,
} from 'zova-module-a-fetch';

export interface IInterceptorOptionsHeaders extends IDecoratorInterceptorOptions {
  openapiSchema?: boolean;
}

@Interceptor<IInterceptorOptionsHeaders>({ dependencies: 'a-interceptor:mock' })
export class InterceptorHeaders extends BeanInterceptorBase<IInterceptorOptionsHeaders> {
  async onRequest(
    config: AxiosRequestConfig,
    options: IInterceptorOptionsHeaders,
    next: NextInterceptorRequest,
  ): Promise<AxiosRequestConfig> {
    // locale
    const keyLocale = this.sys.env.APP_LOCALE_HEADER_KEY;
    if (keyLocale && !config.headers![keyLocale]) {
      config.headers![keyLocale] = this.app.meta.locale.current;
    }
    // tz
    const keyTz = this.sys.env.APP_TZ_HEADER_KEY;
    if (keyTz && !config.headers![keyTz]) {
      config.headers![keyTz] = this.app.meta.locale.tz;
    }
    // openapi schema
    if (options.openapiSchema) {
      config.headers![$protocolKey('x-vona-openapi-schema')] = true;
    }
    // next
    return next(config);
  }
}
