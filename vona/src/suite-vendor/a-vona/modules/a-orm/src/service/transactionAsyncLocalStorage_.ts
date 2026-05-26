import type { FunctionAsync } from 'vona';

import { AsyncLocalStorage } from 'node:async_hooks';
import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';

import { ServiceTransactionState } from './transactionState_.ts';

@Service()
export class ServiceTransactionAsyncLocalStorage extends BeanBase {
  transactionStorage: AsyncLocalStorage<ServiceTransactionState>;

  protected __init__() {
    this.transactionStorage = new AsyncLocalStorage();
  }

  get transactionState(): ServiceTransactionState {
    return this.transactionStorage.getStore()!;
  }

  async run<RESULT>(fn: FunctionAsync<RESULT>): Promise<RESULT> {
    // only once
    if (this.transactionState) {
      return fn();
    }
    const transactionState = this.bean._newBean(ServiceTransactionState);
    return this.transactionStorage.run(transactionState, () => {
      return fn();
    });
  }
}
