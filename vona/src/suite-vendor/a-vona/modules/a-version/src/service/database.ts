import type { IInstanceRecord } from 'vona';
import type { ConfigInstanceBase } from 'vona-module-a-instance';
import type { IDatabaseClientRecord, ServiceDatabaseClient } from 'vona-module-a-orm';

import chalk from 'chalk';
import { DateTime } from 'luxon';
import path from 'node:path';
import {
  BeanBase,
  assertDisposableDatabaseName as assertDisposableDatabaseNameCore,
  assertIsolatedTestPath,
  assertTestRunOwner,
  resolveVonaLocalPaths,
  withIsolatedTestDatabaseDiscovery,
} from 'vona';
import { Service } from 'vona-module-a-bean';

import { createDatabaseTestName, getDatabaseTestPrefix } from '../lib/databaseTestName.ts';

const __separator = '-';
const __timeFormat = `yyyyMMdd${__separator}HHmmss`;

export function assertDisposableDatabaseName(
  databaseName: string,
  databasePrefix: string,
  sqliteRoot?: string,
) {
  const filename = sqliteRoot ? path.basename(databaseName, '.db') : databaseName;
  assertDisposableDatabaseNameCore(filename, databasePrefix);
  if (sqliteRoot) {
    if (!path.isAbsolute(databaseName) || path.extname(databaseName) !== '.db') {
      throw new Error(`Database is outside the disposable SQLite directory: ${databaseName}`);
    }
    assertIsolatedTestPath(databaseName, path.join(sqliteRoot, `${filename}.db`));
  }
}

@Service()
export class ServiceDatabase extends BeanBase {
  get configDatabase() {
    return this.app.config.database;
  }

  public getDatabasePrefix(
    instanceName?: keyof IInstanceRecord,
    configInstanceBase?: ConfigInstanceBase,
  ) {
    const scope = configInstanceBase?.isolate ? `isolate${__separator}${instanceName}` : 'share';
    return getDatabaseTestPrefix(this.app.name, scope);
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
    const clientNameReal =
      clientName === 'default' ? (this.configDatabase.defaultClient as string) : clientName;
    const clientConfig = this.configDatabase.clients[clientNameReal];
    await withIsolatedTestDatabaseDiscovery(this.app, clientNameReal, clientConfig, async () => {
      await this.bean.database.switchDb(async () => {
        await this.__prepareDatabase(versionStart, instanceName, configInstanceBase);
      }, clientName);
    });
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
    const databaseName = createDatabaseTestName(
      databasePrefix,
      DateTime.now().toFormat(__timeFormat),
    );
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
    await this.__prepareDatabaseInner(versionStart, instanceName, configInstanceBase);
    if (versionStart) {
      await this.scope.service.version.__start();
    }
  }

  private async __prepareDatabaseInner(
    versionStart: boolean,
    instanceName?: keyof IInstanceRecord,
    configInstanceBase?: ConfigInstanceBase,
  ) {
    if (this.app.meta.isProd) {
      // donothing
      return;
    }
    const databasePrefix = this.getDatabasePrefix(instanceName, configInstanceBase);
    if (this.app.meta.env.VONA_TEST_RUN_ID) {
      const paths = resolveVonaLocalPaths(
        this.app.projectPath,
        this.app.meta.env.META_MODE,
        this.app.meta.env.VONA_TEST_RUN_ID,
      );
      assertTestRunOwner(paths.dataRoot, paths.runId!);
    }
    // client
    const client = this.bean.database.current.client;
    // get current database name
    let databaseName = client.getDatabaseName();
    // dev/debug db
    if (this.app.meta.isDev) {
      const reset = versionStart && process.env.VONA_DB_RESET === 'true';
      // Never drop a configured, non-disposable development database.
      if (reset && !this.configDatabase.testDatabase) {
        throw new Error('db:reset requires database.testDatabase=true in the dev configuration');
      }
      if (!this.configDatabase.testDatabase) return;
    }
    const sqliteRoot =
      client.db.dialectName === 'better-sqlite3'
        ? resolveVonaLocalPaths(
            this.app.projectPath,
            this.app.meta.env.META_MODE,
            this.app.meta.env.VONA_TEST_RUN_ID,
          ).sqliteRoot
        : undefined;
    const currentFilename = sqliteRoot ? path.basename(databaseName, '.db') : databaseName;
    const isTestDatabase = currentFilename.startsWith(databasePrefix);
    if (isTestDatabase) assertDisposableDatabaseName(databaseName, databasePrefix, sqliteRoot);
    if (
      this.app.meta.isTest &&
      this.app.meta.env.VONA_TEST_RUN_ID &&
      currentFilename.startsWith('vona-test-') &&
      !isTestDatabase
    ) {
      throw new Error(
        `Isolated test database is outside its disposable namespace: ${databaseName}`,
      );
    }
    // dev/debug db
    if (this.app.meta.isDev) {
      const reset = versionStart && process.env.VONA_DB_RESET === 'true';
      // The database used to enumerate/drop databases must not itself be dropped.
      if (isTestDatabase) {
        if (reset)
          throw new Error('db:reset requires a connection outside the disposable database');
        return;
      }
      const dbs = await this.__fetchDatabases(client, instanceName, configInstanceBase);
      for (const db of dbs) {
        assertDisposableDatabaseName(db.name, databasePrefix, sqliteRoot);
      }
      if (reset) {
        for (const db of dbs) {
          await client.connection.schema.dropDatabase(db.name);
        }
      }
      databaseName =
        reset || dbs.length === 0
          ? await this.__createDatabase(client, instanceName, configInstanceBase)
          : dbs[0].name;
      assertDisposableDatabaseName(databaseName, databasePrefix, sqliteRoot);
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
        assertDisposableDatabaseName(db.name, databasePrefix, sqliteRoot);
      }
      for (const db of dbs) {
        await client.connection.schema.dropDatabase(db.name);
      }
      // create database
      const databaseName = await this.__createDatabase(client, instanceName, configInstanceBase);
      assertDisposableDatabaseName(databaseName, databasePrefix, sqliteRoot);
      // set config and reload client
      await client.changeConfigConnectionAndReloadWorker(databaseName);
      // database ready
      this.$logger.silly(chalk.cyan(`dialect: ${client.db.dialectName}`));
      this.$logger.silly(chalk.cyan(`database: ${databaseName}, pid: ${process.pid}`));
    }
  }
}
