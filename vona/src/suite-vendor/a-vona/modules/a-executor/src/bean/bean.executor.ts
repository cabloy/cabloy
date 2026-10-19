import type { FunctionAsync, VonaContext } from 'vona';
import type { IApiPathRecordMethodMap } from 'vona-module-a-web';

import { isNil } from '@cabloy/utils';
import { BeanBase, captureRequestBoundary } from 'vona';
import { Bean } from 'vona-module-a-bean';
import { ServiceTransactionAsyncLocalStorage } from 'vona-module-a-orm';

import type { INewCtxLifecycle, INewCtxOptions, IPerformActionOptions } from '../types/executor.ts';

import { __delegateProperties } from '../lib/utils.ts';

@Bean()
export class BeanExecutor extends BeanBase {
  async performAction<
    METHOD extends keyof IApiPathRecordMethodMap,
    PATH extends keyof IApiPathRecordMethodMap[METHOD],
  >(method: METHOD, path: PATH, options?: IPerformActionOptions): Promise<any> {
    // url
    const url = this.app.util.combineApiPath(path as any, '', true, true);
    return await this.scope.service.executor.performActionInner(method, url, options);
  }

  runInBackground(fn: FunctionAsync<void>) {
    return this.bean.database.switchDbIsolate(() => {
      return this.newCtx(fn);
    });
  }

  async newCtxIsolate<RESULT>(
    fn: FunctionAsync<RESULT>,
    options?: INewCtxOptions,
    lifecycle?: INewCtxLifecycle,
  ): Promise<RESULT> {
    options = Object.assign({}, options);
    // instanceName !== undefined means isolate
    options.instanceName =
      options.instanceName === undefined ? this.ctx?.instanceName : options.instanceName;
    if (options.instanceName === this.ctx?.instanceName) {
      options.locale = options.locale === undefined ? this.ctx?.locale : options.locale;
      options.tz = options.tz === undefined ? this.ctx?.tz : options.tz;
    }
    return this.newCtx(fn, options, lifecycle);
  }

  async mockCtx<RESULT>(
    fn: FunctionAsync<RESULT>,
    options?: INewCtxOptions,
    lifecycle?: INewCtxLifecycle,
  ): Promise<RESULT> {
    options = Object.assign({}, options);
    options.dbInfo = isNil(options.dbInfo) ? { level: 1 } : options.dbInfo;
    options.instanceName =
      options.instanceName === undefined ? (this.ctx?.instanceName ?? '') : options.instanceName;
    options.instance = !isNil(options.instanceName);
    return this.newCtx(fn, options, lifecycle);
  }

  async newCtx<RESULT>(
    fn: FunctionAsync<RESULT>,
    options?: INewCtxOptions,
    lifecycle?: INewCtxLifecycle,
  ): Promise<RESULT> {
    return this._newCtxInnerStep1(
      () => {
        if (isNil(options?.dbInfo)) return this._newCtxInnerStep2(fn, options);
        return this.bean.database.switchDb(() => {
          return this._newCtxInnerStep2(fn, options);
        }, options?.dbInfo);
      },
      options,
      lifecycle,
    );
  }

  private async _newCtxInnerStep1<RESULT>(
    fn: FunctionAsync<RESULT>,
    options: INewCtxOptions = {},
    lifecycle?: INewCtxLifecycle,
  ): Promise<RESULT> {
    const capture = captureRequestBoundary();
    const onScopeOutcome = lifecycle?.onScopeOutcome;
    let ctx: VonaContext | undefined;
    try {
      options = Object.assign({}, options);
      // innerAccess
      const innerAccess = options.innerAccess !== false;
      // isolate
      const isolate =
        !this.ctx ||
        options.instanceName !== undefined ||
        (!innerAccess && this.ctx?.instanceName === null);
      const ctxCaller = !isolate && this.ctx ? this.ctx : undefined;
      // locale/tz/instanceName
      if (!isolate && this.ctx) {
        options.locale = options.locale === undefined ? this.ctx.locale : options.locale;
        options.tz = options.tz === undefined ? this.ctx.tz : options.tz;
        options.instanceName =
          options.instanceName === undefined
            ? !innerAccess && this.ctx.instanceName === null
              ? undefined
              : this.ctx.instanceName
            : options.instanceName;
      }
      // run
      ctx = this.app.createAnonymousContext(options.req, options.res);
      const context = ctx;
      const execute = async () => {
        const initialized: unknown = lifecycle?.initializeContext?.(context);
        if (initialized && (typeof initialized === 'object' || typeof initialized === 'function')) {
          const then = (initialized as PromiseLike<unknown>).then;
          if (typeof then === 'function') {
            await new Promise<unknown>((resolve, reject) => {
              then.call(initialized, resolve, reject);
            }).catch(() => undefined);
            throw new Error('Context initializer must be synchronous');
          }
        }
        // innerAccess
        context.innerAccess = innerAccess;
        // locale
        if (options.locale !== undefined) {
          context.locale = options.locale;
        }
        // tz
        if (options.tz !== undefined) {
          context.tz = options.tz;
        }
        // instanceName: undefined/null is different
        if (options.instanceName !== undefined) {
          context.instanceName = options.instanceName;
        }
        // ctxCaller
        if (ctxCaller) {
          // delegateProperties
          __delegateProperties(context, ctxCaller);
          // ctxCaller
          context.ctxCaller = ctxCaller;
        } else {
          // isolate: extraData
          if (options.extraData) {
            // delegateProperties
            __delegateProperties(context, options.extraData);
          }
        }
        return await this.bean._getBean(ServiceTransactionAsyncLocalStorage).run(fn, isolate);
      };
      return onScopeOutcome
        ? await this.app.ctxStorage.runObserved(context, execute, onScopeOutcome)
        : await this.app.ctxStorage.run(context, execute);
    } catch (error) {
      if (!ctx && onScopeOutcome) {
        try {
          const result: unknown = onScopeOutcome('not_created');
          if (result && (typeof result === 'object' || typeof result === 'function')) {
            const then = (result as PromiseLike<unknown>).then;
            if (typeof then === 'function') {
              capture?.reportFailure('observer_failed');
              void new Promise<unknown>((resolve, reject) => {
                then.call(result, resolve, reject);
              }).catch(() => {});
            }
          }
        } catch {
          capture?.reportFailure('observer_failed');
        }
      }
      throw error;
    }
  }

  private async _newCtxInnerStep2<RESULT>(
    fn: FunctionAsync<RESULT>,
    options?: INewCtxOptions,
  ): Promise<RESULT> {
    // instance
    const instanceName = this.ctx.instanceName; // use default instanceName when undefined
    if (instanceName !== undefined && instanceName !== null) {
      if (!this.app.meta.appReady) {
        throw new Error(
          `should not init ctx.instance: ${instanceName}, when app.meta.appReady not true`,
        );
      }
      this.ctx.instance = (await this.bean.instance.get(instanceName))!;
      // start instance
      if (options?.instance) {
        await this.$scope.instance.service.instance.checkAppReadyInstance(true);
      }
    }
    // execute
    let res: RESULT;
    if (options?.transaction) {
      res = await this.bean.database.current.transaction.begin(async () => {
        return await fn();
      }, options?.transactionOptions);
    } else {
      res = await fn();
    }
    // commitsDone
    await this.ctx.commitsDone();
    // ok
    return res;
  }
}
