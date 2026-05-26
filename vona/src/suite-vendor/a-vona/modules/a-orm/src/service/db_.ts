import type { FunctionAny } from 'vona';

import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';

import type { BeanDatabaseDialectBase } from '../bean/bean.databaseDialectBase.ts';
import type { IDatabaseClientDialectRecord, IDbInfo } from '../types/database.ts';
import type { ITransactionConsistencyCommitOptions } from '../types/transaction.ts';
import type { ServiceDatabaseClient } from './databaseClient_.ts';

import { ServiceColumns } from './columns_.ts';
import { ServiceTransaction } from './transaction_.ts';

@Service()
export class ServiceDb extends BeanBase {
  private _client: ServiceDatabaseClient;
  private _columns: ServiceColumns;
  private _transaction: ServiceTransaction;

  protected __init__(client: ServiceDatabaseClient) {
    this._client = client;
  }

  get info(): IDbInfo {
    return { level: this.level, clientName: this.clientName };
  }

  get level() {
    return this._client.level;
  }

  get clientName() {
    return this._client.clientName;
  }

  get client() {
    return this._client;
  }

  get columns() {
    if (!this._columns) {
      this._columns = this.app.bean._newBean(ServiceColumns, this);
    }
    return this._columns;
  }

  get transaction() {
    if (!this._transaction) {
      this._transaction = this.app.bean._newBean(ServiceTransaction, this);
    }
    return this._transaction;
  }

  get inTransaction() {
    return this.transaction.inTransaction;
  }

  get connection() {
    return this.transaction.connection ?? this.client.connection;
  }

  get dialectName(): keyof IDatabaseClientDialectRecord {
    return this.client.clientConfig.client;
  }

  get dialect(): BeanDatabaseDialectBase {
    return this.bean.database.getDialect(this.dialectName);
  }

  async commit(cb: FunctionAny, options?: ITransactionConsistencyCommitOptions) {
    return await this.transaction.commit(cb, options);
  }

  compensate(cb: FunctionAny) {
    return this.transaction.compensate(cb);
  }
}
