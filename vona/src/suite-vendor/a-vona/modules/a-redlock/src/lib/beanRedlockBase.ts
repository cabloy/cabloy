import type { FunctionAsync } from 'vona';

import { BeanBase, SymbolModuleBelong } from 'vona';

import type { IRedlockLockIsolateOptions, IRedlockLockOptions } from '../types/redlock.ts';

export class BeanRedlockBase<
  TypeRedlockLockResource,
  TypeRedlockLockIsolateResource,
> extends BeanBase {
  async lock<RESULT>(
    resource: TypeRedlockLockResource,
    fn: FunctionAsync<RESULT>,
    options?: IRedlockLockOptions,
  ): Promise<RESULT> {
    return this.$scope.redlock.service.redlock.lock(this._prepareResource(resource), fn, options);
  }

  async lockIsolate<RESULT>(
    resource: TypeRedlockLockIsolateResource,
    fn: FunctionAsync<RESULT>,
    options?: IRedlockLockIsolateOptions,
  ): Promise<RESULT> {
    return this.$scope.redlock.service.redlock.lockIsolate(
      this._prepareResource(resource),
      fn,
      options,
    );
  }

  private _prepareResource(resource: TypeRedlockLockResource | TypeRedlockLockIsolateResource) {
    return `${this[SymbolModuleBelong]}.${resource}`;
  }
}
