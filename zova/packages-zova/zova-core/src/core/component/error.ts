import type { ComponentPublicInstance } from 'vue';

import type { IErrorObject } from '../../bean/resource/error/errorObject.ts';
import type { IErrorInstanceInfo, IModuleError } from '../../bean/resource/error/type.ts';

import { ErrorClass } from '../../bean/resource/error/errorClass.ts';
import { SymbolErrorInstanceInfo } from '../../bean/resource/error/type.ts';

export class AppError extends ErrorClass {
  /** @internal */
  public async initialize() {
    await super.initialize();
    // errorHandler
    this.app.vue.config.errorHandler = (err, instance, info) => {
      return this._handleError(err as Error, instance, info);
    };
    // unhandledrejection
    if (process.env.CLIENT) {
      window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
        event.preventDefault();
        this._handleUnhandledError(event.reason, 'unhandledrejection');
        return false;
      });
      window.addEventListener('error', (event: ErrorEvent) => {
        event.preventDefault();
        this._handleUnhandledError(event.error, 'unhandlederror');
        return false;
      });
    }
  }

  /** @internal */
  public createScopeError(moduleScope: string, errorCode: number | string): IModuleError {
    const self = this;
    return {
      throw: (...args: any[]): never => {
        return self.throw(moduleScope, errorCode, ...args);
      },
      parseFail: (...args: any[]): IErrorObject => {
        return self.parseFail(moduleScope, errorCode, ...args);
      },
    };
  }

  private _handleUnhandledError(error: Error, infoDefault: string) {
    if (error instanceof Error) {
      const errorInfo: IErrorInstanceInfo | undefined = error[SymbolErrorInstanceInfo];
      if (errorInfo) {
        delete error[SymbolErrorInstanceInfo];
      }
      // should not catch error
      this.app.vue.config.errorHandler!(
        error,
        errorInfo?.instance as any,
        errorInfo?.info || infoDefault,
      ) as unknown as Error;
    }
  }

  private _handleError(
    err: Error,
    instance: ComponentPublicInstance | null | undefined,
    info: string | undefined,
  ) {
    if (!this.app) {
      // means destroyed
      console.error(err);
      return;
    }
    const err2 = this.app.meta.event.emitSync(
      'app:errorHandler',
      { err: err as Error, instance, info },
      data => {
        return data.err;
      },
    );
    // only log error in client
    if (process.env.CLIENT) {
      if (!err2 || !(err2 instanceof Error)) return err2;
      if (!info || !['useMutationData'].includes(info)) {
        console.error(err2);
      }
    }
    return err2;
  }
}
