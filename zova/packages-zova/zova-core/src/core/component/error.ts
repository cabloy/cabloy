import type { ComponentPublicInstance } from 'vue';

import type { IErrorObject } from '../../bean/resource/error/errorObject.ts';
import type {
  IErrorHandlerLoad,
  IErrorInstanceInfo,
  IModuleError,
} from '../../bean/resource/error/type.ts';
import type { ZovaContext } from '../context/context.ts';

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

  public handleLoadError(
    originalError: unknown,
    ctx: ZovaContext,
    instance?: ComponentPublicInstance | null,
  ) {
    const err = normalizeError(originalError);
    const load: IErrorHandlerLoad = {
      kind: 'controller-load',
      ctx,
      originalError,
      disposition: 'fallback',
    };
    this._handleError(err, instance, 'useController:load', load);
    return { err, disposition: load.disposition };
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
    load?: IErrorHandlerLoad,
  ) {
    if (!this.app) {
      // means destroyed
      console.error(err);
      return;
    }
    const err2 = this.app.meta.event.emitSync(
      'app:errorHandler',
      { err: err as Error, instance, info, load },
      data => {
        return data.err;
      },
    );
    // only log error in client
    if (process.env.CLIENT) {
      if (!err2 || !(err2 instanceof Error)) return err2;
      console.error(err2);
    }
    return err2;
  }
}

export function normalizeError(error: unknown) {
  if (error instanceof Error) return error;
  const normalized = new Error(getErrorMessage(error));
  if (error && (typeof error === 'object' || typeof error === 'function')) {
    for (const key of ['code', 'status', 'pagePath', 'url']) {
      const descriptor = Object.getOwnPropertyDescriptor(error, key);
      if (!descriptor || !('value' in descriptor)) continue;
      const value = descriptor.value;
      if (
        (key === 'code' || key === 'status') &&
        (typeof value === 'number' || typeof value === 'string')
      ) {
        (normalized as any)[key] = value;
      }
      if ((key === 'pagePath' || key === 'url') && typeof value === 'string') {
        (normalized as any)[key] = value;
      }
    }
  }
  return normalized;
}

function getErrorMessage(error: unknown) {
  if (
    error === null ||
    error === undefined ||
    typeof error === 'string' ||
    typeof error === 'number' ||
    typeof error === 'boolean' ||
    typeof error === 'bigint' ||
    typeof error === 'symbol'
  ) {
    return String(error);
  }
  return 'Unknown error';
}
