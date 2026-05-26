import type { FunctionAsync } from 'vona';

import { AsyncLocalStorage } from 'node:async_hooks';
import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';

import { ServiceDb } from '../service/db_.ts';

@Service()
export class ServiceDatabaseAsyncLocalStorage extends BeanBase {
  dbStorage: AsyncLocalStorage<ServiceDb>;

  protected __init__() {
    this.dbStorage = new AsyncLocalStorage();
  }

  get current(): ServiceDb {
    return this.dbStorage.getStore()!;
  }

  async run<RESULT>(store: ServiceDb, fn: FunctionAsync<RESULT>): Promise<RESULT> {
    if (store === this.current) {
      return fn();
    }
    return this.dbStorage.run(store, () => {
      return fn();
    });
  }
}
