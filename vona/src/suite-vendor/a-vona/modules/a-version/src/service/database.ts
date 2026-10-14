import type { IInstanceRecord, VonaApplication } from 'vona';
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

interface IDevDatabaseTarget {
  clientName: keyof IDatabaseClientRecord;
  instanceName?: keyof IInstanceRecord;
  configInstanceBase?: ConfigInstanceBase;
}

interface IDevDatabasePlan extends IDevDatabaseTarget {
  databasePrefix: string;
  sqliteRoot?: string;
  databases: string[];
  create: boolean;
}

interface IDevDatabasePreparation {
  prepared: boolean;
  createdInstances: Set<keyof IInstanceRecord>;
}

const devDatabasePreparations = new WeakMap<VonaApplication, IDevDatabasePreparation>();

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

  get createdInstanceNames(): (keyof IInstanceRecord)[] {
    return [...(devDatabasePreparations.get(this.app)?.createdInstances ?? [])];
  }

  consumeCreatedInstance(instanceName: keyof IInstanceRecord) {
    devDatabasePreparations.get(this.app)?.createdInstances.delete(instanceName);
  }

  public async prepareDevDatabases(reset = process.env.VONA_DB_RESET === 'true') {
    if (!this.app.meta.isDev) return;
    if (!this.configDatabase.testDatabase) {
      if (reset) {
        throw new Error('db:reset requires database.testDatabase=true in the dev configuration');
      }
      return;
    }
    if (devDatabasePreparations.get(this.app)?.prepared) return;

    if (typeof this.configDatabase.defaultClient !== 'string') {
      throw new TypeError('Disposable dev database preparation requires a static default client');
    }
    // Validate every target before clearing any application resources.
    const plans: IDevDatabasePlan[] = [];
    const clientNames = new Set<keyof IDatabaseClientRecord>();
    for (const target of this.__databaseTargets()) {
      if (target.configInstanceBase?.isolate && !target.configInstanceBase.id) {
        throw new Error(`should specify id for isolate instance: ${target.instanceName}`);
      }
      const clientName = this.$scope.orm.service.database.prepareClientNameReal(target.clientName);
      if (clientNames.has(clientName)) {
        throw new Error(`Disposable database targets must use distinct clients: ${clientName}`);
      }
      clientNames.add(clientName);
      plans.push(
        await this.bean.database.switchDb(async () => {
          const client = this.bean.database.current.client;
          const databasePrefix = this.getDatabasePrefix(
            target.instanceName,
            target.configInstanceBase,
          );
          const sqliteRoot = this.__sqliteRoot(client);
          const currentName = client.getDatabaseName();
          const currentFilename = sqliteRoot ? path.basename(currentName, '.db') : currentName;
          if (currentFilename.startsWith(databasePrefix)) {
            assertDisposableDatabaseName(currentName, databasePrefix, sqliteRoot);
            if (reset) {
              throw new Error('db:reset requires a connection outside the disposable database');
            }
          }
          const dbs = await this.__fetchDatabases(
            client,
            target.instanceName,
            target.configInstanceBase,
          );
          for (const db of dbs) {
            assertDisposableDatabaseName(db.name, databasePrefix, sqliteRoot);
          }
          return {
            ...target,
            databasePrefix,
            sqliteRoot,
            databases: dbs.map(db => db.name),
            create: reset,
          };
        }, target.clientName),
      );
    }

    if (!reset) {
      const missing = plans.find(plan => plan.databases.length === 0);
      if (missing) this.__missingDevDatabase(missing.instanceName);
    }

    if (reset) {
      await this.$scope.redis.service.redis.clearAllData();
      await this.bean.worker.setAlive();
    }
    const preparation: IDevDatabasePreparation = {
      prepared: false,
      createdInstances: new Set(),
    };
    for (const plan of plans) {
      await this.bean.database.switchDb(async () => {
        const client = this.bean.database.current.client;
        if (reset) {
          for (const databaseName of plan.databases) {
            assertDisposableDatabaseName(databaseName, plan.databasePrefix, plan.sqliteRoot);
            await client.connection.schema.dropDatabase(databaseName);
          }
        }
        const databaseName = plan.create
          ? await this.__createDatabase(client, plan.instanceName, plan.configInstanceBase)
          : plan.databases[0];
        assertDisposableDatabaseName(databaseName, plan.databasePrefix, plan.sqliteRoot);
        await client.changeConfigConnectionAndReloadWorker(databaseName);
        if (plan.create) preparation.createdInstances.add(plan.instanceName ?? '');
        this.$logger.silly(chalk.cyan(`dialect: ${client.db.dialectName}`));
        this.$logger.silly(chalk.cyan(`database: ${databaseName}, pid: ${process.pid}`));
      }, plan.clientName);
    }
    preparation.prepared = true;
    devDatabasePreparations.set(this.app, preparation);
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

  private __databaseTargets(): IDevDatabaseTarget[] {
    const targets: IDevDatabaseTarget[] = [{ clientName: 'default' }];
    for (const key in this.app.config.instance.instances) {
      const instanceName = key as keyof IInstanceRecord;
      const configInstanceBase = this.app.config.instance.instances[instanceName];
      if (configInstanceBase === false || !configInstanceBase.isolate) continue;
      if (!configInstanceBase.isolateClient) {
        throw new Error(`should specify isolateClient for isolate instance: ${instanceName}`);
      }
      targets.push({
        clientName: configInstanceBase.isolateClient,
        instanceName,
        configInstanceBase,
      });
    }
    return targets;
  }

  private __sqliteRoot(client: ServiceDatabaseClient) {
    return client.db.dialectName === 'better-sqlite3'
      ? resolveVonaLocalPaths(
          this.app.projectPath,
          this.app.meta.env.META_MODE,
          this.app.meta.env.VONA_TEST_RUN_ID,
        ).sqliteRoot
      : undefined;
  }

  private async __prepareDatabases(versionStart: boolean) {
    for (const target of this.__databaseTargets()) {
      await this.prepareDatabase(
        target.clientName,
        versionStart,
        target.instanceName,
        target.configInstanceBase,
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

  private __missingDevDatabase(instanceName?: keyof IInstanceRecord): never {
    // eslint-disable-next-line
    console.error(
      [
        '',
        chalk.bgRed.white.bold(' DEVELOPMENT DATABASE MISSING '),
        chalk.yellow(`Instance: ${instanceName || 'default'}`),
        '',
        chalk.bold.yellow('Run this command before starting the development server:'),
        '',
        chalk.bold.cyan('  npm run db:reset'),
        '',
        chalk.yellow('Warning: db:reset deletes managed development data.'),
        chalk.yellow('Stop processes using the same database and Redis namespace first.'),
        '',
      ].join('\n'),
    );
    throw new Error(
      `Development database is missing for instance "${instanceName || 'default'}". ` +
        'Run "npm run db:reset" before starting the development server.',
    );
  }

  private async __prepareDatabaseInner(
    instanceName?: keyof IInstanceRecord,
    configInstanceBase?: ConfigInstanceBase,
  ) {
    if (this.app.meta.isProd) {
      // donothing
      return;
    }
    if (this.app.meta.isDev) {
      await this.prepareDevDatabases();
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
    const databaseName = client.getDatabaseName();
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
