import type { IInstanceRecord } from 'vona';
import type { ConfigInstanceBase } from 'vona-module-a-instance';
import type { IInstanceStartupOptions } from 'vona-module-a-startup';

import chalk from 'chalk';
import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';

import type { EntityVersion } from '../entity/version.ts';
import type { EntityVersionInit } from '../entity/versionInit.ts';
import type {
  IMetaVersionInit,
  IMetaVersionOptions,
  IMetaVersionOptionsInner,
  IMetaVersionTest,
  IMetaVersionUpdate,
} from '../types/version.ts';

@Service()
export class ServiceVersion extends BeanBase {
  async instanceInitStartup(options?: IInstanceStartupOptions) {
    const instanceBase = options?.configInstanceBase;
    await this.__instanceInit(this.ctx.instanceName, instanceBase);
  }

  async __start() {
    // update all modules
    try {
      const result = await this.__check({ scene: 'update' });
      // clear columns cache
      this.bean.database.current.columns.columnsClear();
      // log
      if (Object.keys(result).length > 0) {
        this.$logger.info(JSON.stringify(result, null, 2));
      }
      this.$logger.silly(chalk.cyan('All modules are checked successfully!'));
    } catch (err) {
      this.$logger.silly(chalk.cyan('Modules are checked failed!'));
      throw err;
    }
  }

  async __instanceInit(
    instanceName: keyof IInstanceRecord | undefined | null,
    instanceBase?: ConfigInstanceBase,
  ) {
    if (instanceName === undefined || instanceName === null) {
      throw new Error('instance name is not valid');
    }
    try {
      const optionsInit = Object.assign({}, instanceBase, { scene: 'init' as const, instanceName });
      await this.__check(optionsInit);
      this.$logger.silly(
        chalk.cyan(`The instance is initialized successfully: ${instanceName || 'default'}`),
      );
    } catch (err) {
      this.$logger.silly(
        chalk.cyan(`The instance is initialized failed: ${instanceName || 'default'}`),
      );
      throw err;
    }
  }

  async __instanceTest(instanceName: keyof IInstanceRecord) {
    await this.__check({ scene: 'test', instanceName });
  }

  // scene: null/init/test
  async __check(options: IMetaVersionOptionsInner) {
    options.result = {};

    if (options.scene === 'update') {
      // confirm table aVersion exists
      const entity = this.scope.entity.version;
      const hasTableVersion = await this.bean.model.schema.hasTable(entity.$table);
      if (!hasTableVersion) {
        await this.bean.model.createTable(entity.$table, table => {
          table.basicFieldsSimple({ deleted: false, iid: false });
          table.string(entity.module, 255);
          table.integer(entity.version);
        });
      }
    }

    // check all modules
    for (const module of this.app.meta.modulesArray) {
      this.$loggerChild('version').debug(
        'check module: %s, scene:%s',
        module.info.relativeName,
        options.scene,
      );
      await this.__checkModule(module.info.relativeName, options);
    }

    // version done
    await this.bean.executor.newCtx(
      async () => {
        await this.__done(options);
      },
      {
        instanceName: options.instanceName,
      },
    );

    // ok
    return options.result;
  }

  // check module
  async __checkModule(moduleName: string, options: IMetaVersionOptionsInner) {
    // module
    const module = this.__getModule(moduleName);

    // fileVersionNew
    let fileVersionNew = 0;
    if (module.package.vonaModule && module.package.vonaModule.fileVersion) {
      fileVersionNew = module.package.vonaModule.fileVersion;
    }

    if (fileVersionNew && ['update', 'init'].includes(options.scene)) {
      // update module or init module

      // -1: always
      if (fileVersionNew === -1) {
        await this.__updateModule(options, module, -1, -1);
      } else {
        // fileVersionOld
        let fileVersionOld = 0; // default
        if (options.scene === 'update') {
          const res = await this.bean.model
            .builder<EntityVersion>('aVersion')
            .select('*')
            .where('module', moduleName)
            .orderBy('version', 'desc')
            .first();
          if (res) {
            fileVersionOld = res.version;
          }
        } else {
          const res = await this.bean.model
            .builder<EntityVersionInit>('aVersionInit')
            .select('*')
            .where({ instanceName: options.instanceName, module: moduleName })
            .orderBy('version', 'desc')
            .first();
          if (res) {
            fileVersionOld = res.version;
          }
        }

        // check if need update
        if (fileVersionOld > fileVersionNew) {
          this.scope.error.ModuleOld.throw(moduleName);
        } else {
          // not check if (fileVersionOld < fileVersionNew)
          await this.__updateModule(options, module, fileVersionOld, fileVersionNew);
        }
      }
    }

    if (options.scene === 'test') {
      // test module
      await this.bean.executor.newCtx(
        async () => {
          await this.__testModuleTransaction(module, fileVersionNew, options);
        },
        {
          instanceName: options.instanceName,
          transaction: true,
        },
      );
    }
  }

  // update module or init module
  async __updateModule(options, module, fileVersionOld, fileVersionNew) {
    if (fileVersionNew === -1) {
      // always
      await this.__updateModule2(options, module, -1);
    } else {
      // versions
      //   always version:0
      const versions = [0];
      for (let version = fileVersionOld + 1; version <= fileVersionNew; version++) {
        versions.push(version);
      }
      // loop
      for (const version of versions) {
        this.$loggerChild('version').debug(
          'update module: %s, version: %d, scene:%s',
          module.info.relativeName,
          version,
          options.scene,
        );
        await this.__updateModule2(options, module, version);
      }
    }

    // log
    if (fileVersionOld !== fileVersionNew) {
      options.result[module.info.relativeName] = { fileVersionOld, fileVersionNew };
    }
  }

  async __updateModule2(options, module, version) {
    // perform action
    if (options.scene === 'update') {
      // update
      await this.bean.executor.newCtx(
        async () => {
          await this.__updateModuleTransaction(module, version);
        },
        {
          transaction: module.name !== 'a-index',
        },
      );
    } else {
      // init
      await this.bean.executor.newCtx(
        async () => {
          await this.__initModuleTransaction(module, version, options);
        },
        {
          instanceName: options.instanceName,
          transaction: true,
        },
      );
    }
  }

  async __updateModuleTransaction(module, version) {
    // bean
    const beanVersion = this.__getBeanVersion<IMetaVersionUpdate>(module.info.relativeName, true);
    if (!beanVersion.update)
      throw new Error(`meta.version.update not exists for ${module.info.relativeName}`);
    // clear columns cache
    this.bean.database.current.columns.columnsClear();
    // execute
    await beanVersion.update({ version });
    // insert record
    if (version > 0) {
      await this.scope.model.version.insert({ module: module.info.relativeName, version });
    }
  }

  async __initModuleTransaction(module, version, options) {
    // bean
    const beanVersion = this.__getBeanVersion<IMetaVersionInit>(module.info.relativeName, true);
    // execute
    if (beanVersion.init) {
      await beanVersion.init({ ...options, version });
    }
    // insert record
    if (version > 0) {
      await this.scope.model.versionInit.insert({
        instanceName: options.instanceName,
        module: module.info.relativeName,
        version,
      });
    }
  }

  // test module
  async __testModuleTransaction(module, version, options) {
    // bean
    const beanVersion = this.__getBeanVersion<IMetaVersionTest>(module.info.relativeName, false);
    // execute
    if (beanVersion && beanVersion.test) {
      await beanVersion.test({ ...options, version });
    }
  }

  protected async __done(options: IMetaVersionOptions) {
    await this.scope.event.versionDone.emit(options);
  }

  // get module
  private __getModule(moduleName: string) {
    return this.app.meta.modules[moduleName];
  }

  private __getBeanVersion<T>(moduleName: string, throwErrorIfEmpty: boolean): T {
    // bean
    const beanVersion = this.bean._getBean(`${moduleName}.meta.version` as any);
    if (!beanVersion && throwErrorIfEmpty)
      throw new Error(`meta.version not exists for ${moduleName}`);
    return beanVersion;
  }
}
