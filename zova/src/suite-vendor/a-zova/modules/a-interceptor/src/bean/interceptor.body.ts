import type { AxiosError, AxiosResponse } from 'axios';
import type {
  IDecoratorInterceptorOptions,
  IInterceptorResponse,
  IInterceptorResponseError,
  NextInterceptorError,
  NextInterceptorResponse,
} from 'zova-module-a-fetch';

import { cast } from 'zova';
import {
  BeanInterceptorBase,
  Interceptor,
  SymbolInterceptorBodyResponseFlag,
} from 'zova-module-a-fetch';

export interface IInterceptorOptionsBody extends IDecoratorInterceptorOptions {}

@Interceptor<IInterceptorOptionsBody>({ dependencies: 'a-interceptor:performAction' })
export class InterceptorBody
  extends BeanInterceptorBase<IInterceptorOptionsBody>
  implements IInterceptorResponse, IInterceptorResponseError
{
  async onResponse(
    response: AxiosResponse,
    _options: IInterceptorOptionsBody,
    next: NextInterceptorResponse,
  ): Promise<AxiosResponse> {
    response = await next();
    const contentType = response.headers['content-type'];
    if (
      !contentType ||
      typeof contentType !== 'string' ||
      !contentType.includes('application/json')
    ) {
      response[SymbolInterceptorBodyResponseFlag] = true;
      return response;
    }
    if (response.data.code !== 0) {
      const error = new Error();
      error.code = response.data.code;
      error.message = response.data.message;
      throw error;
    }
    // return data
    return response.data.data ?? null;
  }

  async onResponseError(
    error: AxiosError,
    _options: IInterceptorOptionsBody,
    next: NextInterceptorError,
  ): Promise<AxiosError> {
    error = await next();
    if (!(error instanceof Error)) return error;
    if (error.response) {
      error.code = cast(error.response.data)?.code ?? error.response.status;
      error.message = cast(error.response.data)?.message ?? error.response.statusText;
    }
    return error;
  }
}
