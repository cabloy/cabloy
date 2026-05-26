import type knex from 'knex';

import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';

import type { ServiceDb } from './db_.ts';

import { ServiceDatabase } from './database.ts';
import { ServiceTransactionFiber } from './transactionFiber_.ts';

@Service()
export class ServiceTransactionState extends BeanBase {
  private _fibers: Record<string, ServiceTransactionFiber> = {};

  private get serviceDatabase() {
    return this.bean._getBean(ServiceDatabase);
  }

  public get(db: ServiceDb): ServiceTransactionFiber | undefined {
    const selector = this.serviceDatabase.prepareClientNameSelector(db.info, db.dialect);
    return this._fibers[selector];
  }

  public add(db: ServiceDb, connection: knex.Knex.Transaction) {
    const selector = this.serviceDatabase.prepareClientNameSelector(db.info, db.dialect);
    const fiber = this.bean._newBean(ServiceTransactionFiber, connection);
    this._fibers[selector] = fiber;
    return fiber;
  }

  public remove(db: ServiceDb) {
    const selector = this.serviceDatabase.prepareClientNameSelector(db.info, db.dialect);
    delete this._fibers[selector];
  }
}
