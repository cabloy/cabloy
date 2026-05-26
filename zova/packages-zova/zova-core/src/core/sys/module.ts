import type { IModule, IModuleInfo } from '@cabloy/module-info';

import * as ModuleInfo from '@cabloy/module-info';
import { forEach, forEachSync } from '@cabloy/utils';
import { shallowReactive } from 'vue';

import type { TypeBeanScopeRecordKeys } from '../../bean/type.ts';
import type {
  IModuleMainSys,
  IModuleResource,
  IMonkeyModuleSys,
  IMonkeySys,
  PluginZovaModulesMeta,
  TypeMonkeyName,
} from '../../types/index.ts';

import { BeanSimple } from '../../bean/beanSimple.ts';
import { SymbolInstalled } from '../../types/index.ts';
import { StateLock } from '../../utils/stateLock.ts';
import { deepExtend } from '../sys/util.ts';

export class SysModule extends BeanSimple {
  public modulesMeta: PluginZovaModulesMeta;
  private modules: Record<string, IModule> = shallowReactive({});
  private mainInstances: Record<string, IModuleMainSys> = {};
  private monkeyInstances: Record<string, IMonkeyModuleSys & IMonkeySys> = {};

  /** @internal */
  public async initialize(modulesMeta: PluginZovaModulesMeta) {
    this.modulesMeta = modulesMeta;
    await this._loadAllMonkeysAndSyncsAndPreloads();
    await this._requireAllSpecifics('preload');
    await this._requireAllSpecifics('monkey');
    await this._requireAllSpecifics('sync');
    if (process.env.SERVER) {
      await this._requireAllOthers();
    }
  }

  /** @internal */
  public dispose() {
    this.modulesMeta = undefined as any;
  }

  get<K extends TypeBeanScopeRecordKeys>(moduleName: K): IModule | undefined;
  get(moduleName: string): IModule | undefined;
  get(moduleName: IModuleInfo): IModule | undefined;
  get(moduleName: string | IModuleInfo): IModule | undefined {
    // module info
    if (!moduleName) return undefined;
    const moduleInfo =
      typeof moduleName === 'string' ? ModuleInfo.parseInfo(moduleName) : moduleName;
    if (!moduleInfo) throw new Error(`invalid module name: ${moduleName}`);
    // get
    const module = this.modules[moduleInfo.relativeName];
    if (!module) {
      return undefined;
    }
    if (!module[SymbolInstalled] || !module[SymbolInstalled].state) {
      return undefined;
    }
    return module;
  }

  async use<K extends TypeBeanScopeRecordKeys>(moduleName: K): Promise<IModule>;
  async use(moduleName: string): Promise<IModule>;
  async use(moduleName: IModuleInfo): Promise<IModule>;
  async use(moduleName?: string | IModuleInfo): Promise<IModule> {
    // module info
    if (!moduleName) throw new Error('should specify the module name');
    const moduleInfo =
      typeof moduleName === 'string' ? ModuleInfo.parseInfo(moduleName) : moduleName;
    if (!moduleInfo) throw new Error(`invalid module name: ${moduleName}`);
    const relativeName = moduleInfo.relativeName;
    // should not try check get directly
    // const module = this.getOnly(relativeName);
    // if (module) return module;
    // module
    const moduleRepo = this.modulesMeta.modules[relativeName];
    if (!moduleRepo) throw new Error(`module not exists: ${relativeName}`);
    // install
    await this._install(relativeName, moduleRepo);
    // ok
    return moduleRepo;
  }

  exists<K extends TypeBeanScopeRecordKeys>(moduleName: K): boolean;
  exists(moduleName: string): boolean;
  exists(moduleName: IModuleInfo): boolean;
  exists(moduleName: string | IModuleInfo): boolean {
    // module info
    if (!moduleName) return false;
    const moduleInfo =
      typeof moduleName === 'string' ? ModuleInfo.parseInfo(moduleName) : moduleName;
    if (!moduleInfo) throw new Error(`invalid module name: ${moduleName}`);
    const moduleRepo = this.modulesMeta.modules[moduleInfo.relativeName];
    return !!moduleRepo;
  }

  private async _loadAllMonkeysAndSyncsAndPreloads() {
    const moduleNames: string[] = [];
    for (const moduleName of this.modulesMeta.moduleNames) {
      const module = this.modulesMeta.modules[moduleName];
      const info = module.info;
      const shouldLoad =
        process.env.SERVER ||
        info.capabilities?.monkey ||
        info.capabilities?.sync ||
        info.capabilities?.preload;
      if (shouldLoad) {
        const moduleResource = module.resource as any;
        if (typeof moduleResource === 'function') {
          moduleNames.push(moduleName);
        }
      }
    }
    await this.loadModules(moduleNames);
  }

  public async loadModules(moduleNames: string[]) {
    if (moduleNames.length === 0) return;
    const promises: Promise<IModuleResource>[] = [];
    const moduleNamesLoading: string[] = [];
    for (const moduleName of moduleNames) {
      const module = this.modulesMeta.modules[moduleName];
      if (!module) throw new Error(`module not found: ${moduleName}`);
      const moduleResource = module.resource as any;
      if (typeof moduleResource === 'function') {
        const promise = moduleResource();
        if (process.env.SERVER && process.env.DEV) {
          await promise;
        }
        promises.push(promise);
        moduleNamesLoading.push(moduleName);
      }
    }
    const modulesResource = await Promise.all(promises);
    for (let i = 0; i < modulesResource.length; i++) {
      const moduleName = moduleNamesLoading[i];
      this.modulesMeta.modules[moduleName].resource = modulesResource[i];
    }
  }

  private async _requireAllSpecifics(capabilityName: 'preload' | 'monkey' | 'sync') {
    const moduleNames = this.modulesMeta.moduleNames.filter(moduleName => {
      const module = this.modulesMeta.modules[moduleName];
      return module.info.capabilities?.[capabilityName];
    });
    if (moduleNames.length > 0) {
      this.sys.meta.logger
        .child('module', 'default')
        .debug(`modules ${capabilityName}: ${moduleNames.join(',')}`);
    }
    for (const moduleName of moduleNames) {
      const module = this.modulesMeta.modules[moduleName];
      await this._install(moduleName, module);
    }
  }

  private async _requireAllOthers() {
    for (const moduleName of this.modulesMeta.moduleNames) {
      const module = this.modulesMeta.modules[moduleName];
      const info = module.info;
      const shouldInstall =
        !info.capabilities?.monkey && !info.capabilities?.sync && !info.capabilities?.preload;
      if (shouldInstall) {
        await this._install(moduleName, module);
      }
    }
  }

  /** @internal */
  public async _install(moduleName: string, moduleRepo: IModule) {
    // check
    if (this.modules[moduleName]) {
      const module = this.modules[moduleName];
      // should check state, otherwise infinite loop
      if (module[SymbolInstalled].state) return;
      // wait
      await module[SymbolInstalled].wait();
      // scope: should after [SymbolInstalled].touch
      await this.sys.bean._getBean(`${moduleName}.scope.module` as any, false);
      return;
    }
    // state
    const module = moduleRepo;
    module[SymbolInstalled] = StateLock.create();
    // record
    this.modules[moduleName] = module;
    // install
    await this._installInner(moduleName, moduleRepo);
    // installed
    module[SymbolInstalled].touch();
    // scope: should after [SymbolInstalled].touch
    await this.sys.bean._getBean(`${moduleName}.scope.module` as any, false);
    // monkey: moduleLoaded
    await this._monkeyModule(true, 'moduleLoaded', module);
  }

  private async _installInner(moduleName: string, moduleRepo: IModule) {
    // load
    if (typeof moduleRepo.resource === 'function') {
      const moduleResource = moduleRepo.resource as any;
      moduleRepo.resource = await moduleResource();
    }
    // main / monkey
    if (moduleRepo.resource.MainSys) {
      this.mainInstances[moduleName] = this.sys.bean._newBeanSimple(
        moduleRepo.resource.MainSys,
        false,
        moduleRepo,
      );
    }
    if (moduleRepo.resource.MonkeySys) {
      this.monkeyInstances[moduleName] = this.sys.bean._newBeanSimple(
        moduleRepo.resource.MonkeySys,
        false,
        moduleRepo,
      );
    }
    // monkey: moduleLoading
    await this._monkeyModule(true, 'moduleLoading', moduleRepo);
    // register resources
    await this._registerResources(moduleRepo);
  }

  private async _registerResources(module: IModule) {
    this._registerLocales(module);
    this._registerErrors(module);
    this._registerConstants(module);
    await this._registerConfig(module);
  }

  private _registerErrors(module: IModule) {
    if (!module.resource.errors) return;
    this.sys.meta.error.errors[module.info.relativeName] = module.resource.errors;
  }

  private _registerLocales(module: IModule) {
    this.sys.meta.locale._registerLocales(module.info.relativeName, module.resource.locales);
  }

  private _registerConstants(module: IModule) {
    if (!module.resource.constants) return;
    const relativeName = module.info.relativeName;
    this.sys.constant.modules[relativeName] = deepExtend(
      {},
      module.resource.constants,
      this.sys.constant.modules[relativeName],
    );
  }

  private async _registerConfig(module: IModule) {
    if (!module.resource.config) return;
    // config
    const config = await module.resource.config(this.sys);
    // monkey
    await this._monkeyModule(true, 'configLoaded', module, config);
    // extend
    const relativeName = module.info.relativeName;
    this.sys.config.modules[relativeName] = deepExtend(
      {},
      config,
      this.sys.config.modules[relativeName],
    );
    this.sys.configOriginal.modules![relativeName] = config;
  }

  /** @internal */
  public async _monkeyModule(
    order: boolean,
    monkeyName: TypeMonkeyName,
    moduleTarget?: IModule,
    ...monkeyData: any[]
  ) {
    // self: main
    if (moduleTarget) {
      const mainInstance = this.mainInstances[moduleTarget.info.relativeName];
      if (mainInstance && mainInstance[monkeyName]) {
        await mainInstance[monkeyName](...monkeyData);
      }
    }
    // module monkey
    await forEach(this.modulesMeta.moduleNames, order, async key => {
      const moduleMonkey: IModule = this.modulesMeta.modules[key];
      if (moduleMonkey.info.capabilities?.monkey) {
        const monkeyInstance = this.monkeyInstances[key];
        if (monkeyInstance && monkeyInstance[monkeyName]) {
          if (moduleTarget === undefined) {
            // @ts-ignore ignore
            await monkeyInstance[monkeyName](...monkeyData);
          } else {
            // @ts-ignore ignore
            await monkeyInstance[monkeyName](moduleTarget, ...monkeyData);
          }
        }
      }
    });
    // sys monkey
    const sysMonkey = this.sys.meta.sysMonkey;
    if (sysMonkey && sysMonkey[monkeyName]) {
      if (moduleTarget === undefined) {
        // @ts-ignore ignore
        await sysMonkey[monkeyName](...monkeyData);
      } else {
        // @ts-ignore ignore
        await sysMonkey[monkeyName](moduleTarget, ...monkeyData);
      }
    }
  }

  /** @internal */
  public _monkeyModuleSync(
    order: boolean,
    monkeyName: TypeMonkeyName,
    moduleTarget?: IModule,
    ...monkeyData: any[]
  ) {
    // self: main
    if (moduleTarget) {
      const mainInstance = this.mainInstances[moduleTarget.info.relativeName];
      if (mainInstance && mainInstance[monkeyName]) {
        mainInstance[monkeyName](...monkeyData);
      }
    }
    // module monkey
    forEachSync(this.modulesMeta.moduleNames, order, key => {
      const moduleMonkey: IModule = this.modulesMeta.modules[key];
      if (moduleMonkey.info.capabilities?.monkey) {
        const monkeyInstance = this.monkeyInstances[key];
        if (monkeyInstance && monkeyInstance[monkeyName]) {
          if (moduleTarget === undefined) {
            // @ts-ignore ignore
            monkeyInstance[monkeyName](...monkeyData);
          } else {
            // @ts-ignore ignore
            monkeyInstance[monkeyName](moduleTarget, ...monkeyData);
          }
        }
      }
    });
    // app monkey
    const sysMonkey = this.sys.meta.sysMonkey;
    if (sysMonkey && sysMonkey[monkeyName]) {
      if (moduleTarget === undefined) {
        // @ts-ignore ignore
        sysMonkey[monkeyName](...monkeyData);
      } else {
        // @ts-ignore ignore
        sysMonkey[monkeyName](moduleTarget, ...monkeyData);
      }
    }
  }
}
