import type { IInstanceRecord } from 'vona';
import type { IOnionSlice } from 'vona-module-a-onion';

import { isNil } from '@cabloy/utils';
import fse from 'fs-extra';
import path from 'node:path';
import { BeanBase, cast } from 'vona';
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
    // clear keys
    await this._clearResources();

    // run startups: not after
    for (const startup of this._startups) {
      const startupOptions = startup.beanOptions.options;
      if (!startupOptions?.instance && startupOptions?.after !== true) {
        await this.runStartup(startup.name, null);
      }
    }
  }

  async appReady() {
    // run startups: after
    for (const startup of this._startups) {
      const startupOptions = startup.beanOptions.options;
      if (!startupOptions?.instance && startupOptions?.after === true) {
        await this.runStartup(startup.name, null);
      }
    }

    // version init : force: should be false
    if (this.app.meta.isTest || this.app.meta.isDev) {
      await this._appReadyInstanceStartup('', true);
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

    // version test
    if (this.app.meta.isTest) {
      const instanceName = '';
      await this.bean.executor.newCtx(
        async () => {
          await this.$scope.version.service.version.__instanceTest(instanceName);
        },
        {
          dbInfo: { level: 1 },
          instanceName,
        },
      );
    }
  }

  private async _appReadyInstanceStartup(instanceName: keyof IInstanceRecord, wait: boolean) {
    const res = this.$scope.instance.service.instance.instanceStartupIsolate(instanceName, {
      force: false,
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
    // set flag
    this.app.meta.appReadyInstances[instanceName] = true;
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
    // redis
    await this.$scope.redis.service.redis.clearAllData();
    // .app/public
    await fse.remove(path.join(this.app.config.server.publicDir, '1'));
  }
}
