import type knex from 'knex';
import type { FunctionAny } from 'vona';

import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';

import { ServiceTransactionConsistency‌ } from './transactionConsistency‌_.ts';

@Service()
export class ServiceTransactionFiber extends BeanBase {
  private _connection: knex.Knex.Transaction;
  private _transactionConsistency: ServiceTransactionConsistency‌;

  protected __init__(connection: knex.Knex.Transaction) {
    this._connection = connection;
    this._transactionConsistency = this.app.bean._newBean(ServiceTransactionConsistency‌);
  }

  public get connection() {
    return this._connection;
  }

  commit(cb: FunctionAny) {
    this._transactionConsistency.commit(cb);
  }

  compensate(cb: FunctionAny) {
    this._transactionConsistency.compensate(cb);
  }

  async doCommit() {
    await this._connection.commit();
    await this._transactionConsistency.commitsDone();
    this._connection = undefined as any;
  }

  async doRollback() {
    await this._connection.rollback();
    await this._transactionConsistency.compensatesDone();
    this._connection = undefined as any;
  }
}
