import type { Knex } from 'knex';

import { catchError } from '@cabloy/utils';
import knex from 'knex';
import { deepExtend } from 'vona';
import { Service } from 'vona-module-a-bean';
import { BeanMutateBase } from 'vona-module-a-beanmutate';

import type { ConfigDatabaseClient } from '../types/config.ts';
import type { IDatabaseClientRecord } from '../types/database.ts';

import { ServiceDb } from './db_.ts';

export interface IPrepareDatabaseNameResult {
  database?: string;
  filename?: string;
}

@Service()
export class ServiceDatabaseClient extends BeanMutateBase {
  level: number;
  clientName: keyof IDatabaseClientRecord;
  clientNameSelector: string;
  clientConfig: ConfigDatabaseClient;
  private _knex: Knex;
  private _db: ServiceDb;

  get configDatabase() {
    return this.app.config.database;
  }

  get connection(): Knex {
    return this._knex;
  }

  get db(): ServiceDb {
    return this._db;
  }

  protected __init__(clientNameSelector?: string, clientConfig?: ConfigDatabaseClient) {
    super.__init__();
    // db
    this._db = this.bean._newBean(ServiceDb, this);
    // load
    this.__load(clientNameSelector!, clientConfig);
  }

  protected async __dispose__() {
    await super.__dispose__();
    this._db = undefined as any;
    await this.__close();
  }

  protected async onReloadInstance({ clientName, clientConfig }) {
    if (clientName === this.clientName) {
      await this.reload(clientConfig);
    }
  }

  protected async onRemoveInstance({ clientName }) {
    if (clientName === this.clientName) {
      await super.onRemoveInstance({ clientName });
    }
  }

  private __load(clientNameSelector: string, clientConfig?: ConfigDatabaseClient) {
    // name
    this.clientNameSelector = clientNameSelector;
    const dbInfo = this.scope.service.database.parseClientNameSelector(clientNameSelector);
    this.level = dbInfo.level;
    this.clientName = dbInfo.clientName;
    // config: inited by bean.database.getClient
    this.clientConfig = clientConfig!;
    // knex
    this._knex = knex(deepExtend({}, this.clientConfig));
  }

  private async __close() {
    if (this._knex) {
      await catchError(() => {
        return this._knex.destroy();
      });
      this._knex = undefined as any;
    }
  }

  async reload(clientConfig?: ConfigDatabaseClient) {
    const clientConfigReal = this.scope.service.database.getClientConfig(
      this.clientName,
      clientConfig,
    );
    this.$mutate([this.clientNameSelector, clientConfigReal]);
    await this.__close();
    this.__load(this.clientNameSelector, clientConfigReal);
  }

  getDatabaseName(): string {
    const connection = this.clientConfig.connection as any;
    return connection.database || connection.filename;
  }

  private _prepareDatabaseName(databaseName: string): IPrepareDatabaseNameResult {
    const result: IPrepareDatabaseNameResult = {};
    const connection = this.clientConfig.connection as any;
    if (connection.database !== undefined) {
      result.database = databaseName;
    } else if (connection.filename !== undefined) {
      result.filename = databaseName;
    }
    return result;
  }

  // only used by startup, so no consider that workers broadcast
  async changeConfigConnectionAndReloadWorker(databaseName: string): Promise<void> {
    // set databaseName
    const connDatabaseName = this._prepareDatabaseName(databaseName);
    // set config
    //   * should not use this.clientConfig.connection, because password is hidden
    const config = this.scope.service.database.getClientConfig(this.clientName, undefined, true);
    config.connection = Object.assign({}, config.connection, connDatabaseName);
    // only used by startup, so no consider that workers broadcast
    this.configDatabase.clients[this.clientName] = config;
    // reload
    await this.scope.service.database.reloadClientsWorker(this.clientName, config);
    // await this.scope.service.database.reloadClients(this.clientName, config);
  }
}
