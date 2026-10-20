import type { ExistingReadyCapability, FunctionAsync, VonaContext } from 'vona';
import type { ServiceDb } from 'vona-module-a-orm';
import type { IApiPathRecordMethodMap } from 'vona-module-a-web';

import { isNil } from '@cabloy/utils';
import {
  BeanBase,
  captureRequestBoundary,
  isExistingReadyContext,
  pinExistingReadyContext,
  resolveExistingReadyCapability,
} from 'vona';
import { Bean } from 'vona-module-a-bean';
import {
  ServiceDatabaseAsyncLocalStorage,
  ServiceTransactionAsyncLocalStorage,
} from 'vona-module-a-orm';

import type {
  INewCtxLifecycle,
  INewCtxOptions,
  INewCtxReadyExistingOptions,
  IPerformActionOptions,
} from '../types/executor.ts';

import { __delegateProperties } from '../lib/utils.ts';

@Bean()
export class BeanExecutor extends BeanBase {
  async performAction<
    METHOD extends keyof IApiPathRecordMethodMap,
    PATH extends keyof IApiPathRecordMethodMap[METHOD],
  >(method: METHOD, path: PATH, options?: IPerformActionOptions): Promise<any> {
    this._assertOrdinaryContext();
    // url
    const url = this.app.util.combineApiPath(path as any, '', true, true);
    return await this.scope.service.executor.performActionInner(method, url, options);
  }

  runInBackground(fn: FunctionAsync<void>) {
    this._assertOrdinaryContext();
    return this.bean.database.switchDbIsolate(() => {
      return this.newCtx(fn);
    });
  }

  async newCtxIsolate<RESULT>(
    fn: FunctionAsync<RESULT>,
    options?: INewCtxOptions,
    lifecycle?: INewCtxLifecycle,
  ): Promise<RESULT> {
    this._assertOrdinaryContext();
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
    this._assertOrdinaryContext();
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
    this._assertOrdinaryContext();
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

  private _assertOrdinaryContext() {
    if (isExistingReadyContext(this.ctx)) throw new Error('Existing-ready rebinding unavailable');
  }

  async newCtxReadyExisting<RESULT>(
    capability: ExistingReadyCapability,
    fn: FunctionAsync<RESULT>,
    options?: INewCtxReadyExistingOptions,
    lifecycle?: INewCtxLifecycle,
  ): Promise<RESULT> {
    this._assertOrdinaryContext();
    const capture = captureRequestBoundary();
    const owner = this.app.meta.completedReadiness;
    const resolved = owner && resolveExistingReadyCapability(owner, capability, this.app);
    if (!capture || capture.snapshot().portFault || !resolved)
      throw new Error('Existing-ready unavailable');
    const data = (value: object | undefined, allowed: readonly string[]) => {
      const result: Record<string, any> = Object.create(null);
      if (value === undefined) return result;
      if (!value || typeof value !== 'object')
        throw new Error('Existing-ready options unavailable');
      const proto = Object.getPrototypeOf(value);
      if (proto !== null && proto !== Object.prototype)
        throw new Error('Existing-ready options unavailable');
      for (const key of Reflect.ownKeys(value)) {
        if (typeof key !== 'string' || !allowed.includes(key))
          throw new Error('Existing-ready options unavailable');
        const desc = Object.getOwnPropertyDescriptor(value, key)!;
        if (!('value' in desc)) throw new Error('Existing-ready options unavailable');
        result[key] = desc.value;
      }
      return result;
    };
    const selected = data(options, ['req', 'res', 'locale', 'tz']);
    const hooks = data(lifecycle, ['initializeContext', 'onScopeOutcome']);
    if (
      (selected.locale !== undefined && typeof selected.locale !== 'string') ||
      (selected.tz !== undefined && typeof selected.tz !== 'string') ||
      (hooks.initializeContext !== undefined && typeof hooks.initializeContext !== 'function') ||
      (hooks.onScopeOutcome !== undefined && typeof hooks.onScopeOutcome !== 'function')
    ) {
      throw new Error('Existing-ready options unavailable');
    }
    if (typeof fn !== 'function') throw new Error('Existing-ready unavailable');
    let context: VonaContext;
    try {
      context = this.app.createAnonymousContext(selected.req, selected.res);
    } catch (error) {
      try {
        const observed: unknown = hooks.onScopeOutcome?.('not_created');
        if (observed && (typeof observed === 'object' || typeof observed === 'function')) {
          const then = (observed as PromiseLike<unknown>).then;
          if (typeof then === 'function') {
            capture.reportFailure('observer_failed');
            void new Promise<unknown>((resolve, reject) =>
              then.call(observed, resolve, reject),
            ).catch(() => {});
          }
        }
      } catch {
        capture.reportFailure('observer_failed');
      }
      throw error;
    }
    const execute = async () => {
      if (!pinExistingReadyContext(owner, capability, this.app, context))
        throw new Error('Existing-ready unavailable');
      if (selected.locale !== undefined) context.locale = selected.locale;
      if (selected.tz !== undefined) context.tz = selected.tz;
      const initialized: unknown = hooks.initializeContext?.(context);
      if (initialized && (typeof initialized === 'object' || typeof initialized === 'function')) {
        const then = (initialized as PromiseLike<unknown>).then;
        if (typeof then === 'function') {
          await new Promise<unknown>((resolve, reject) =>
            then.call(initialized, resolve, reject),
          ).catch(() => undefined);
          throw new Error('Context initializer must be synchronous');
        }
      }
      if (
        !resolveExistingReadyCapability(owner, capability, this.app) ||
        capture.snapshot().portFault
      ) {
        throw new Error('Existing-ready unavailable');
      }
      const database = this.bean._getBean(ServiceDatabaseAsyncLocalStorage);
      const transaction = this.bean._getBean(ServiceTransactionAsyncLocalStorage);
      return database.dbStorage.run(resolved.handle as ServiceDb, () =>
        transaction.run(async () => {
          const result = await fn();
          await context.commitsDone();
          return result;
        }, true),
      );
    };
    return hooks.onScopeOutcome
      ? this.app.ctxStorage.runObserved(context, execute, hooks.onScopeOutcome)
      : this.app.ctxStorage.run(context, execute);
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
