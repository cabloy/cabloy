import type { IInstanceRecord } from 'vona';
import type { IOnionSlice } from 'vona-module-a-onion';

import { isNil } from '@cabloy/utils';
import fse from 'fs-extra';
import {
  assertIsolatedTestConfig,
  assertFreshTestResourcesReady,
  requiresFreshTestResources,
  BeanBase,
  cast,
  getRuntimePathPhysicalRoot,
  withIsolatedTestDatabaseDiscovery,
} from 'vona';
import { Service } from 'vona-module-a-bean';

import type {
  IDecoratorStartupOptions,
  IInstanceStartupOptions,
  IStartupExecute,
  IStartupRecord,
} from '../types/startup.ts';

@Service()
export class ServiceStartup extends BeanBase {
  async appStart() {
    // db:reset is a one-shot data preparation command, not a development server.
    if (this.app.meta.isDev && process.env.VONA_DB_RESET === 'true') {
      this.app.config.server.listen.disable = true;
    }
    // clear keys
    await this._clearResources();
    if (this.app.meta.isDev) {
      await this.bean.executor.newCtx(
        () => this.$scope.version.service.database.prepareDevDatabases(),
        { dbInfo: { level: 1 }, instanceName: null },
      );
    }

    // run startups: not after
    for (const startup of this._startups) {
      const startupOptions = startup.beanOptions.options;
      if (!startupOptions?.instance && startupOptions?.after !== true) {
        const force =
          this.app.meta.isDev &&
          startup.name === 'a-version:databaseInit' &&
          (process.env.VONA_DB_RESET === 'true' ||
            this.$scope.version.service.database.createdInstanceNames.length > 0);
        const run = () => this.runStartup(startup.name, null, force ? { force: true } : undefined);
        if (this.app.meta.env.VONA_TEST_RUN_ID && startup.name === 'a-version:databaseInit') {
          const defaultClient = this.app.config.database.defaultClient;
          if (typeof defaultClient !== 'string') {
            throw new TypeError('Isolated test requires a static default database client');
          }
          const client = this.app.config.database.clients[defaultClient];
          await withIsolatedTestDatabaseDiscovery(this.app, defaultClient, client, run);
        } else {
          await run();
        }
      }
    }
  }

  async appReady() {
    const createdInstances = this.$scope.version.service.database.createdInstanceNames;
    const preparingDev = this.app.meta.isDev && createdInstances.length > 0;
    if (preparingDev) {
      // Prepare each fresh instance before application-level after-startups.
      const instanceNames = [
        '',
        ...createdInstances.filter(name => name !== ''),
      ] as (keyof IInstanceRecord)[];
      for (const instanceName of instanceNames) {
        await this._appReadyInstanceStartup(instanceName, true);
      }
    }

    // db:reset prepares data without starting runtime services.
    if (!(this.app.meta.isDev && process.env.VONA_DB_RESET === 'true')) {
      // run startups: after
      for (const startup of this._startups) {
        const startupOptions = startup.beanOptions.options;
        if (!startupOptions?.instance && startupOptions?.after === true) {
          await this.runStartup(startup.name, null);
        }
      }
    }

    // version init : force: should be false
    if (this.app.meta.isTest || this.app.meta.isDev) {
      if (!preparingDev) await this._appReadyInstanceStartup('', true);
    } else {
      // only start static instances (defined in config)
      for (const key in this.app.config.instance.instances) {
        const instanceName = key as keyof IInstanceRecord;
        const configInstanceBase = this.app.config.instance.instances[instanceName];
        if (configInstanceBase === false) continue;
        // need not await for prod
        const wait = this.app.config.server.listen.disable;
        await this._appReadyInstanceStartup(instanceName, wait);
      }
    }

    // Test seeding retains its existing lifecycle; dev seeding belongs to fresh instances.
    if (this.app.meta.isTest) {
      await this.seedDefaultInstance();
    }
  }

  private async seedDefaultInstance() {
    const instanceName = '';
    await this.bean.executor.newCtx(
      async () => {
        await this.$scope.version.service.version.__instanceSeed(instanceName);
      },
      { dbInfo: { level: 1 }, instanceName },
    );
  }

  private async _appReadyInstanceStartup(instanceName: keyof IInstanceRecord, wait: boolean) {
    const res = this.$scope.instance.service.instance.instanceStartupIsolate(instanceName, {
      force:
        this.app.meta.isDev &&
        (process.env.VONA_DB_RESET === 'true' ||
          this.$scope.version.service.database.createdInstanceNames.includes(instanceName)),
    });
    if (wait) {
      await res;
    }
  }

  async runStartup(
    startupName: string,
    instanceName?: keyof IInstanceRecord | null,
    options?: IInstanceStartupOptions,
  ) {
    const startup = this.bean.onion.startup.onionsNormal[startupName];
    const startupOptions = startup.beanOptions.options as IDecoratorStartupOptions;
    // normal
    if (!startupOptions.debounce) {
      return await this._runStartupInner(startup, instanceName, options);
    }
    // debounce: lock
    return await this.scope.redlock.lockIsolate(
      `startup.${startupName}`,
      async () => {
        return await this._runStartupLock(startup, instanceName, options);
      },
      {
        instanceName,
      },
    );
  }

  async _runStartupLock<T extends keyof IStartupRecord>(
    startup: IOnionSlice<IStartupRecord, T>,
    instanceName?: keyof IInstanceRecord | null,
    options?: IInstanceStartupOptions,
  ) {
    // ignore debounce for test
    if (!options?.force && !this.app.meta.isTest) {
      const startupOptions = startup.beanOptions.options as IDecoratorStartupOptions;
      const cacheKey =
        `startupDebounce:${startup.name}${!isNil(instanceName) ? `:${this.ctx.instance.id}` : ''}` as const;
      const debounce =
        typeof startupOptions.debounce === 'number'
          ? startupOptions.debounce
          : this.scope.config.startup.debounce;
      const flag = await this.scope.cacheRedis.startupDebounce.getset(true, cacheKey, {
        ttl: debounce,
      });
      if (flag) return;
    }
    // perform
    await this._runStartupInner(startup, instanceName, options);
  }

  async _runStartupInner<T extends keyof IStartupRecord>(
    startup: IOnionSlice<IStartupRecord, T>,
    instanceName?: keyof IInstanceRecord | null,
    options?: IInstanceStartupOptions,
  ) {
    this.$logger.silly(
      `startup${startup.beanOptions?.options?.instance ? ' instance' : ''}: ${startup.name}, pid: ${process.pid}`,
    );
    const startupOptions = startup.beanOptions.options as IDecoratorStartupOptions;
    // execute
    return await this.bean.executor.newCtx(
      async () => {
        const bean = cast<IStartupExecute>(
          this.bean._getBean(startup.beanOptions.beanFullName as any),
        );
        await bean.execute(options);
      },
      {
        dbInfo: { level: 1 },
        instanceName,
        transaction: startupOptions.transaction,
      },
    );
  }

  async runStartupInstance(instanceName: keyof IInstanceRecord, options?: IInstanceStartupOptions) {
    // run startups: not after
    for (const startup of this._startups) {
      const startupOptions = startup.beanOptions.options;
      if (startupOptions?.instance && startupOptions?.after !== true) {
        await this.runStartup(startup.name, instanceName, options);
      }
    }
    if (
      this.app.meta.isDev &&
      this.$scope.version.service.database.createdInstanceNames.includes(instanceName)
    ) {
      if (instanceName === '') {
        await this.$scope.version.service.version.__instanceSeed(instanceName);
      }
      this.$scope.version.service.database.consumeCreatedInstance(instanceName);
    }
    await this.runStartupInstanceAfter(instanceName, options);
  }

  async runStartupInstanceAfter(
    instanceName: keyof IInstanceRecord,
    options?: IInstanceStartupOptions,
  ) {
    // set flag
    this.app.meta.appReadyInstances[instanceName] = true;
    // Keep readiness checks from reentering initialization even when runtime startups are skipped.
    if (this.app.meta.isDev && process.env.VONA_DB_RESET === 'true') return;
    // run startups: after
    for (const startup of this._startups) {
      const startupOptions = startup.beanOptions.options;
      if (startupOptions?.instance && startupOptions?.after === true) {
        await this.runStartup(startup.name, instanceName, options);
      }
    }
  }

  private get _startups() {
    return this.bean.onion.startup.getOnionsEnabledCached();
  }

  private async _clearResources() {
    if (!this.app.meta.isTest) return;
    assertIsolatedTestConfig(this.app);
    if (requiresFreshTestResources()) {
      assertFreshTestResourcesReady(this.app);
      return;
    }
    // redis
    await this.$scope.redis.service.redis.clearAllData();
    // .app/public
    await fse.remove(this.app.config.server.publicDir);
    // .app/runtime
    await fse.remove(getRuntimePathPhysicalRoot(this.app));
  }
}
