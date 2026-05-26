import type knex from 'knex';
import type { Knex } from 'knex';
import type { FunctionAny, FunctionAsync } from 'vona';

import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';

import type {
  ITransactionConsistencyCommitOptions,
  ITransactionOptions,
} from '../types/transaction.ts';
import type { ServiceDb } from './db_.ts';
import type { ServiceTransactionFiber } from './transactionFiber_.ts';

import { TransactionIsolationLevelsMap } from '../types/transaction.ts';
import { ServiceTransactionAsyncLocalStorage } from './transactionAsyncLocalStorage_.ts';

@Service()
export class ServiceTransaction extends BeanBase {
  private _db: ServiceDb;

  protected __init__(db: ServiceDb) {
    this._db = db;
  }

  get transactionState() {
    return this.bean._getBean(ServiceTransactionAsyncLocalStorage).transactionState;
  }

  get transactionFiber(): ServiceTransactionFiber | undefined {
    return this.transactionState.get(this._db);
  }

  get inTransaction() {
    return !!this.transactionFiber;
  }

  get connection(): knex.Knex.Transaction | undefined {
    return this.transactionFiber?.connection;
  }

  async commit(cb: FunctionAny, options?: ITransactionConsistencyCommitOptions) {
    const fiber = this.transactionFiber;
    if (!fiber) {
      if (!options?.ignoreIfNotInTransaction) {
        await cb();
      }
    } else {
      fiber.commit(cb);
    }
  }

  compensate(cb: FunctionAny) {
    const fiber = this.transactionFiber;
    if (fiber) {
      fiber.compensate(cb);
    }
  }

  async begin<RESULT>(fn: FunctionAsync<RESULT>, options?: ITransactionOptions): Promise<RESULT> {
    // transactionOptions
    const transactionOptions = Object.assign({}, options, { propagation: undefined });
    // propagation
    const propagation = options?.propagation ?? 'REQUIRED';
    if (propagation === 'REQUIRED') {
      // required
      return this._isolationLevelRequired(fn, transactionOptions);
    } else if (propagation === 'SUPPORTS') {
      // supports
      if (this.inTransaction) {
        return this._isolationLevelRequired(fn, transactionOptions);
      } else {
        return fn();
      }
    } else if (propagation === 'MANDATORY') {
      // mandatory
      if (this.inTransaction) {
        return this._isolationLevelRequired(fn, transactionOptions);
      } else {
        throw new Error('transaction error: EnumTransactionPropagation.MANDATORY');
      }
    } else if (propagation === 'REQUIRES_NEW') {
      // requires_new
      if (!this.inTransaction) {
        return this._isolationLevelRequired(fn, transactionOptions);
      } else {
        return this.bean.database.switchDbIsolate(() => {
          return this.bean.database.current.transaction.begin(() => {
            return fn();
          }, transactionOptions);
        }, this._db.info);
      }
    } else if (propagation === 'NOT_SUPPORTED') {
      if (!this.inTransaction) {
        return fn();
      } else {
        return this.bean.database.switchDbIsolate(fn, this._db.info);
      }
    } else if (propagation === 'NEVER') {
      if (!this.inTransaction) {
        return fn();
      } else {
        throw new Error('transaction error: EnumTransactionPropagation.NEVER');
      }
    }
    throw new Error('transaction error: unknown propagation');
  }

  private async _isolationLevelRequired<RESULT>(
    fn: FunctionAsync<RESULT>,
    options?: ITransactionOptions,
  ): Promise<RESULT> {
    let res: RESULT;
    // begin
    let fiber: ServiceTransactionFiber | undefined;
    if (!this.inTransaction) {
      const connection = this._db.client.connection;
      const transactionConnection = await connection.transaction(
        _translateTransactionOptions(options),
      );
      fiber = this.transactionState.add(this._db, transactionConnection);
    }
    // fn
    try {
      res = await fn();
    } catch (err) {
      if (fiber) {
        await fiber.doRollback();
        this.transactionState.remove(this._db);
      }
      throw err;
    }
    try {
      if (fiber) {
        await fiber.doCommit();
        this.transactionState.remove(this._db);
      }
    } catch (err) {
      if (fiber) {
        await fiber.doRollback();
        this.transactionState.remove(this._db);
      }
      throw err;
    }
    return res;
  }
}

function _translateTransactionOptions(
  options?: ITransactionOptions,
): Knex.TransactionConfig | undefined {
  if (!options) return undefined;
  return {
    isolationLevel: TransactionIsolationLevelsMap[options.isolationLevel ?? 'DEFAULT'] as any,
    readOnly: options.readOnly,
  };
}
