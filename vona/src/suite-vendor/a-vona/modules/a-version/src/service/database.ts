import type { IInstanceRecord } from 'vona';
import type { ConfigInstanceBase } from 'vona-module-a-instance';
import type { IDatabaseClientRecord, ServiceDatabaseClient } from 'vona-module-a-orm';

import chalk from 'chalk';
import { DateTime } from 'luxon';
import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';

const __separator = '-';
const __timeFormat = `yyyyMMdd${__separator}HHmmss`;

@Service()
export class ServiceDatabase extends BeanBase {
  get configDatabase() {
    return this.app.config.database;
  }

  public getDatabasePrefix(
    instanceName?: keyof IInstanceRecord,
    configInstanceBase?: ConfigInstanceBase,
  ) {
    const prefix = configInstanceBase?.isolate ? `isolate${__separator}${instanceName}` : 'share';
    return `vona${__separator}test${__separator}${this.app.name}${__separator}${prefix}${__separator}`;
  }

  public async databaseInitStartup() {
    // database
    await this.__prepareDatabases(true);
  }

  public async databaseNameStartup() {
    // database
    await this.__prepareDatabases(false);
  }

  public async prepareDatabase(
    clientName: keyof IDatabaseClientRecord,
    versionStart: boolean,
    instanceName?: keyof IInstanceRecord,
    configInstanceBase?: ConfigInstanceBase,
  ) {
    await this.bean.database.switchDb(async () => {
      await this.__prepareDatabase(versionStart, instanceName, configInstanceBase);
    }, clientName);
  }

  private async __fetchDatabases(
    client: ServiceDatabaseClient,
    instanceName?: keyof IInstanceRecord,
    configInstanceBase?: ConfigInstanceBase,
  ) {
    const databasePrefix = this.getDatabasePrefix(instanceName, configInstanceBase);
    return await client.connection.schema.fetchDatabases(databasePrefix);
  }

  private async __createDatabase(
    client: ServiceDatabaseClient,
    instanceName?: keyof IInstanceRecord,
    configInstanceBase?: ConfigInstanceBase,
  ) {
    const databasePrefix = this.getDatabasePrefix(instanceName, configInstanceBase);
    const databaseName = `${databasePrefix}${DateTime.now().toFormat(__timeFormat)}`;
    return await client.connection.schema.createDatabase(databaseName);
  }

  private async __prepareDatabases(versionStart: boolean) {
    // default
    await this.prepareDatabase('default', versionStart);
    // isolate
    for (const key in this.app.config.instance.instances) {
      const instanceName = key as keyof IInstanceRecord;
      const configInstanceBase = this.app.config.instance.instances[instanceName];
      if (configInstanceBase === false) continue;
      if (!configInstanceBase.isolate) continue;
      if (!configInstanceBase.isolateClient)
        throw new Error(`should specify isolateClient for isolate instance: ${instanceName}`);
      await this.prepareDatabase(
        configInstanceBase.isolateClient,
        versionStart,
        instanceName,
        configInstanceBase,
      );
    }
  }

  private async __prepareDatabase(
    versionStart: boolean,
    instanceName?: keyof IInstanceRecord,
    configInstanceBase?: ConfigInstanceBase,
  ) {
    await this.__prepareDatabaseInner(instanceName, configInstanceBase);
    if (versionStart) {
      await this.scope.service.version.__start();
    }
  }

  private async __prepareDatabaseInner(
    instanceName?: keyof IInstanceRecord,
    configInstanceBase?: ConfigInstanceBase,
  ) {
    if (this.app.meta.isProd) {
      // donothing
      return;
    }
    const databasePrefix = this.getDatabasePrefix(instanceName, configInstanceBase);
    // client
    const client = this.bean.database.current.client;
    // get current database name
    let databaseName = client.getDatabaseName();
    const isTestDatabase = databaseName.includes(databasePrefix);
    // dev/debug db
    if (this.app.meta.isDev) {
      // if enable testDatabase
      const enableTestDatabase = this.configDatabase.testDatabase;
      // check
      if (!enableTestDatabase || isTestDatabase) {
        // donothing
        return;
      }
      const dbs = await this.__fetchDatabases(client, instanceName, configInstanceBase);
      if (dbs.length === 0) {
        databaseName = await this.__createDatabase(client, instanceName, configInstanceBase);
      } else {
        databaseName = dbs[0].name;
      }
      // set config and reload client
      await client.changeConfigConnectionAndReloadWorker(databaseName);
      this.$logger.silly(chalk.cyan(`dialect: ${client.db.dialectName}`));
      this.$logger.silly(chalk.cyan(`database: ${databaseName}, pid: ${process.pid}`));
    }
    // test db
    if (this.app.meta.isTest) {
      // check
      if (isTestDatabase) {
        // donothing
        return;
      }
      // drop old databases
      const dbs = await this.__fetchDatabases(client, instanceName, configInstanceBase);
      for (const db of dbs) {
        await client.connection.schema.dropDatabase(db.name);
      }
      // create database
      const databaseName = await this.__createDatabase(client, instanceName, configInstanceBase);
      // set config and reload client
      await client.changeConfigConnectionAndReloadWorker(databaseName);
      // database ready
      this.$logger.silly(chalk.cyan(`dialect: ${client.db.dialectName}`));
      this.$logger.silly(chalk.cyan(`database: ${databaseName}, pid: ${process.pid}`));
    }
  }
}
