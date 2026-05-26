import { catchError } from '@cabloy/utils';
import { AxiosRequestConfig } from 'axios';
import { cast } from 'zova';
import {
  BeanInterceptorBase,
  IDecoratorInterceptorOptions,
  IInterceptorRequest,
  Interceptor,
  NextInterceptorRequest,
} from 'zova-module-a-fetch';
import { ISsrSitePerformActionOptions } from 'zova-module-a-ssr';

export interface IInterceptorOptionsPerformAction extends IDecoratorInterceptorOptions {}

@Interceptor<IInterceptorOptionsPerformAction>({ dependencies: 'a-interceptor:jwt' })
export class InterceptorPerformAction
  extends BeanInterceptorBase<IInterceptorOptionsPerformAction>
  implements IInterceptorRequest
{
  async onRequest(
    config: AxiosRequestConfig,
    _options: IInterceptorOptionsPerformAction,
    next: NextInterceptorRequest,
  ): Promise<AxiosRequestConfig> {
    if (process.env.CLIENT) return next();
    const performAction = this.ctx.meta.$ssr.getPerformAction(config.baseURL);
    if (!performAction) return next();
    const data: ISsrSitePerformActionOptions = {
      method: config.method as any,
      path: config.url!,
      query: config.params,
      body: config.data,
      headers: config.headers,
    };
    const [result, error] = await catchError(() => {
      return performAction(data);
    });
    if (error) {
      cast(error).config = config;
      throw error;
    }
    throw result;
  }
}
