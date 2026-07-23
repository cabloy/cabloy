import type {
  AopMethodNext,
  IAopMethodExecute,
  IDecoratorAopMethodOptions,
} from 'vona-module-a-aspect';

import { BeanAopMethodBase, Retry } from 'vona';
import { AopMethod } from 'vona-module-a-aspect';

export interface IAopMethodOptionsRetryable extends IDecoratorAopMethodOptions, Retry.WrapOptions {
  errorCodes: string[];
}

@AopMethod<IAopMethodOptionsRetryable>()
export class AopMethodRetryable extends BeanAopMethodBase implements IAopMethodExecute {
  async execute(
    options: IAopMethodOptionsRetryable,
    _args: [],
    next: AopMethodNext,
    _receiver: any,
    _prop: string,
  ): Promise<any> {
    const operation = Retry.operation(options);
    return await new Promise((resolve, reject) => {
      operation.attempt(() => {
        next
          .replay()
          .then(resolve)
          .catch(error => {
            if (this._shouldRetry(error, options) && operation.retry(error)) return;
            reject(error);
          });
      });
    });
  }

  private _shouldRetry(error: unknown, options: IAopMethodOptionsRetryable) {
    const code = (error as { code?: unknown })?.code;
    return typeof code === 'string' && options.errorCodes?.includes(code) === true;
  }
}
