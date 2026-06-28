import type { FunctionAny } from 'vona';

import { AsyncResource } from 'node:async_hooks';
import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';

@Service()
export class ServiceTransactionConsistency‌ extends BeanBase {
  private _commitCallbacks: FunctionAny[] = [];
  private _compensateCallbacks: FunctionAny[] = [];

  commit(cb: FunctionAny) {
    this._commitCallbacks.push(AsyncResource.bind(cb));
  }

  compensate(cb: FunctionAny) {
    this._compensateCallbacks.unshift(AsyncResource.bind(cb));
  }

  async commitsDone() {
    while (true) {
      const cb = this._commitCallbacks.shift();
      if (!cb) break;
      await cb();
    }
    this._compensateCallbacks = [];
  }

  async compensatesDone() {
    while (true) {
      const cb = this._compensateCallbacks.shift();
      if (!cb) break;
      await cb();
    }
    this._commitCallbacks = [];
  }
}
