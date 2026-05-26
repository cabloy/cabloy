import { AxiosError } from 'axios';
import {
  BeanInterceptorBase,
  IDecoratorInterceptorOptions,
  IInterceptorResponseError,
  Interceptor,
  NextInterceptorError,
  SymbolInterceptorBodyResponseFlag,
} from 'zova-module-a-fetch';

export interface IInterceptorOptionsMock extends IDecoratorInterceptorOptions {}

// not include: ERR_BAD_RESPONSE
const __ErrorsShouldBeMocked = ['ECONNREFUSED', 'ERR_NETWORK', '404'];

@Interceptor<IInterceptorOptionsMock>()
export class InterceptorMock
  extends BeanInterceptorBase<IInterceptorOptionsMock>
  implements IInterceptorResponseError
{
  async onResponseError(
    error: AxiosError,
    _options: IDecoratorInterceptorOptions,
    next: NextInterceptorError,
  ): Promise<AxiosError> {
    if (!(error instanceof Error)) return next();
    if (this.sys.env.MOCK_ENABLED === 'true') {
      if (process.env.DEV || (process.env.PROD && this.sys.env.MOCK_BUILD === 'true')) {
        if (__ErrorsShouldBeMocked.includes(String(error.code)) || error.status === 404) {
          const config = error.config!;
          if (config.baseURL) {
            const port = process.env.DEV
              ? this.sys.env.DEV_SERVER_PORT
              : this.sys.env.MOCK_BUILD_PORT;
            let baseURL = `http://localhost:${port}`;
            if (config.baseURL.endsWith(this.sys.env.API_PREFIX!)) {
              baseURL = `${baseURL}${this.sys.env.API_PREFIX}`;
            }
            if (config.baseURL !== baseURL && config.baseURL !== this.sys.env.API_PREFIX) {
              const response = await this.$fetch.request(Object.assign({}, config, { baseURL }));
              if (response && response[SymbolInterceptorBodyResponseFlag]) {
                return response.data;
              } else {
                return response as any;
              }
            }
          }
        }
      }
    }
    return next();
  }
}
