import type { IModule, IModuleInfo } from '@cabloy/module-info';

import * as ModuleInfo from '@cabloy/module-info';
import { forEach, forEachSync } from '@cabloy/utils';
import { shallowReactive } from 'vue';

import type { TypeBeanScopeRecordKeys } from '../../bean/type.ts';
import type {
  IModuleApp,
  IModuleMain,
  IMonkeyApp,
  IMonkeyController,
  IMonkeyModule,
  TypeMonkeyName,
} from '../../types/index.ts';

import { BeanSimple } from '../../bean/beanSimple.ts';
import { SymbolInstalled } from '../../types/index.ts';
import { StateLock } from '../../utils/stateLock.ts';

export class AppModule extends BeanSimple {
  private modules: Record<string, IModuleApp> = shallowReactive({});
  private mainInstances: Record<string, IModuleMain> = {};
  private monkeyInstances: Record<string, IMonkeyModule & IMonkeyApp & IMonkeyController> = {};

  /** @internal */
  public async initialize() {
    await this._requireAllSpecifics('preload');
    await this._requireAllSpecifics('monkey');
    await this._requireAllSpecifics('sync');
  }

  get<K extends TypeBeanScopeRecordKeys>(moduleName: K, forceLoad?: boolean): IModule | undefined;
  get(moduleName: string, forceLoad?: boolean): IModule | undefined;
  get(moduleName: IModuleInfo, forceLoad?: boolean): IModule | undefined;
  get(moduleName: string | IModuleInfo, forceLoad?: boolean): IModule | undefined {
    // module info
    if (!moduleName) return undefined;
    const moduleInfo =
      typeof moduleName === 'string' ? ModuleInfo.parseInfo(moduleName) : moduleName;
    if (!moduleInfo) throw new Error(`invalid module name: ${moduleName}`);
    // get
    const module = this.modules[moduleInfo.relativeName];
    if (!module) {
      // module not loaded, so async use to raise the next call
      if (forceLoad !== false) {
        this.use(moduleInfo.relativeName);
      }
      return undefined;
    }
    if (!module[SymbolInstalled] || !module[SymbolInstalled].state) {
      return undefined;
    }
    return this.sys.meta.module.get(moduleName as any);
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
    const moduleRepo = this.sys.meta.module.modulesMeta.modules[relativeName];
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
    return this.sys.meta.module.exists(moduleName as any);
  }

  private async _requireAllSpecifics(capabilityName: 'preload' | 'monkey' | 'sync') {
    const moduleNames = this.sys.meta.module.modulesMeta.moduleNames.filter(moduleName => {
      const module = this.sys.meta.module.modulesMeta.modules[moduleName];
      return module.info.capabilities?.[capabilityName];
    });
    // if (moduleNames.length > 0) {
    //   this.sys.meta.logger.child('module', 'default').debug(`app modules: ${capabilityName}: ${moduleNames.join(',')}`);
    // }
    for (const moduleName of moduleNames) {
      const module = this.sys.meta.module.modulesMeta.modules[moduleName];
      await this._install(moduleName, module);
    }
  }

  private async _install(moduleName: string, moduleRepo: IModule) {
    // sys first
    await this.sys.meta.module._install(moduleName, moduleRepo);
    // check
    if (this.modules[moduleName]) {
      const module = this.modules[moduleName];
      // should check state, otherwise infinite loop
      if (module[SymbolInstalled].state) return;
      // wait
      await module[SymbolInstalled].wait();
      // scope: should after [SymbolInstalled].touch
      await this.app.bean._getBean(`${moduleName}.scope.module` as any, false);
      return;
    }
    // clone for ssr
    const module: IModuleApp = {
      [SymbolInstalled]: StateLock.create(),
    };
    // record
    this.modules[moduleName] = module;
    // install
    await this._installInner(moduleName, moduleRepo);
    // installed
    module[SymbolInstalled].touch();
    // scope: should after [SymbolInstalled].touch
    await this.app.bean._getBean(`${moduleName}.scope.module` as any, false);
    // monkey: moduleLoaded
    await this._monkeyModule(true, 'moduleLoaded', moduleRepo);
  }

  private async _installInner(moduleName: string, moduleRepo: IModule) {
    // main / monkey
    if (moduleRepo.resource.Main) {
      this.mainInstances[moduleName] = this.app.bean._newBeanSimple(
        moduleRepo.resource.Main,
        false,
        moduleRepo,
      );
    }
    if (moduleRepo.resource.Monkey) {
      this.monkeyInstances[moduleName] = this.app.bean._newBeanSimple(
        moduleRepo.resource.Monkey,
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
    this._registerComponents(module);
  }

  private _registerComponents(module: IModule) {
    this.app.meta.component._registerComponents(
      module.info.relativeName,
      module.resource.components,
    );
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
        // @ts-ignore ignore
        await this.app.vue.runWithContext(async () => {
          await mainInstance[monkeyName](...monkeyData);
        });
      }
    }
    // module monkey
    await forEach(this.sys.meta.module.modulesMeta.moduleNames, order, async key => {
      const moduleMonkey: IModule = this.sys.meta.module.modulesMeta.modules[key];
      if (moduleMonkey.info.capabilities?.monkey) {
        const monkeyInstance = this.monkeyInstances[key];
        if (monkeyInstance && monkeyInstance[monkeyName]) {
          await this.app.vue.runWithContext(async () => {
            if (moduleTarget === undefined) {
              // @ts-ignore ignore
              await monkeyInstance[monkeyName](...monkeyData);
            } else {
              // @ts-ignore ignore
              await monkeyInstance[monkeyName](moduleTarget, ...monkeyData);
            }
          });
        }
      }
    });
    // app monkey
    const appMonkey = this.app.meta.appMonkey;
    if (appMonkey && appMonkey[monkeyName]) {
      await this.app.vue.runWithContext(async () => {
        if (moduleTarget === undefined) {
          // @ts-ignore ignore
          await appMonkey[monkeyName](...monkeyData);
        } else {
          // @ts-ignore ignore
          await appMonkey[monkeyName](moduleTarget, ...monkeyData);
        }
      });
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
        // @ts-ignore ignore
        this.app.vue.runWithContext(async () => {
          mainInstance[monkeyName](...monkeyData);
        });
      }
    }
    // module monkey
    forEachSync(this.sys.meta.module.modulesMeta.moduleNames, order, key => {
      const moduleMonkey: IModule = this.sys.meta.module.modulesMeta.modules[key];
      if (moduleMonkey.info.capabilities?.monkey) {
        const monkeyInstance = this.monkeyInstances[key];
        if (monkeyInstance && monkeyInstance[monkeyName]) {
          this.app.vue.runWithContext(async () => {
            if (moduleTarget === undefined) {
              // @ts-ignore ignore
              monkeyInstance[monkeyName](...monkeyData);
            } else {
              // @ts-ignore ignore
              monkeyInstance[monkeyName](moduleTarget, ...monkeyData);
            }
          });
        }
      }
    });
    // app monkey
    const appMonkey = this.app.meta.appMonkey;
    if (appMonkey && appMonkey[monkeyName]) {
      this.app.vue.runWithContext(async () => {
        if (moduleTarget === undefined) {
          // @ts-ignore ignore
          appMonkey[monkeyName](...monkeyData);
        } else {
          // @ts-ignore ignore
          appMonkey[monkeyName](moduleTarget, ...monkeyData);
        }
      });
    }
  }
}
