import type { IDecoratorBeanOptionsBase, TypeModuleResourceConfig } from 'vona';
import type { ServiceOnion } from 'vona-module-a-onion';

import { getOnionMetasMeta, getOnionScenesMeta, parseInfoFromPath } from '@cabloy/module-info';
import { toUpperCaseFirstChar } from '@cabloy/word-utils';
import path from 'node:path';
import {
  appHmrDeps,
  appResource,
  BeanBase,
  cast,
  deepExtend,
  pathToHref,
  SymbolBeanContainerInstances,
  SymbolBeanInstancePropsLazy,
  SymbolCacheAopChains,
  SymbolCacheAopChainsKey,
  SymbolHmrStateLoad,
  SymbolHmrStateSave,
} from 'vona';
import { Service } from 'vona-module-a-bean';

import type { IHmrReload, TypeHmrWatchScene } from '../types/hmr.ts';

@Service()
export class ServiceHmr extends BeanBase {
  async reloadFile(sceneName: TypeHmrWatchScene, file: string) {
    const moduleInfo = parseInfoFromPath(path.dirname(file));
    const moduleName = moduleInfo?.relativeName;
    const fileUrl = `${pathToHref(file)}?${Date.now()}`;
    const fileModule = await import(fileUrl);
    await this.scope.event.hmrReload.emit({ sceneName, file }, async data => {
      let beanOptions;
      if (sceneName === '_error') {
        await this._reloadError(moduleName!, fileModule.errors);
      } else if (sceneName === '_locale') {
        await this._reloadLocale(moduleName!, fileModule.default, file);
      } else if (sceneName === '_config') {
        await this._reloadConfig(moduleName!, fileModule.config);
      } else if (sceneName === '_constant') {
        await this._reloadConstant(moduleName!, fileModule.constants);
      } else {
        beanOptions = await this._reloadBeanWrapper(fileModule);
      }
      data.beanOptions = beanOptions;
    });
  }

  private async _reloadError(moduleName: string, errors: {}) {
    deepExtend(this.app.meta.error.ebErrors[moduleName], errors);
  }

  private async _reloadLocale(moduleName: string, moduleLocales: {}, file: string) {
    const locale = path.basename(file, '.ts');
    // localeModules
    if (!this.app.meta.localeModules[moduleName]) this.app.meta.localeModules[moduleName] = {};
    this.app.meta.localeModules[moduleName][locale] = Object.assign(
      {},
      moduleLocales,
      this.app.meta.hmrCacheLocaleModules[moduleName]?.[locale],
    );
    // openapi
    await this.bean.openapi.clearAllCaches();
  }

  private async _reloadConfig(moduleName: string, config: TypeModuleResourceConfig) {
    const app = this.app;
    const configModule = await config(app);
    await app.util.monkeyModule(
      app.meta.appMonkey,
      app.meta.modulesMonkey,
      true,
      'configLoaded',
      app.meta.modules[moduleName],
      configModule,
    );
    // app config
    app.config.modules[moduleName] = deepExtend(
      {},
      configModule,
      app.meta.hmrCacheConfigModules[moduleName],
    );
    // instance config
    await this.$scope.instance.service.instance.resetAllCaches();
  }

  private async _reloadConstant(moduleName: string, constants: {}) {
    deepExtend(this.app.meta.constants[moduleName], constants);
  }

  private async _reloadBeanWrapper(fileModule: any) {
    let beanOptions;
    for (const key in fileModule) {
      const item = fileModule[key];
      if (typeof item !== 'function') continue;
      beanOptions = appResource.getBean(item);
      if (!beanOptions) continue;
      await this.reloadBean(beanOptions.beanFullName);
    }
    return beanOptions;
  }

  public async reloadBean(beanFullName: string) {
    if (appHmrDeps.deps[beanFullName] && appHmrDeps.deps[beanFullName].size > 0) {
      this.app.bean.worker.reload();
    } else {
      await this._reloadBean(beanFullName);
    }
  }

  private async _reloadBean(beanFullName: string) {
    const beanOptions = appResource.getBean(beanFullName)!;
    this._reloadBeanScene(beanOptions);
    this._reloadBeanAop(beanOptions);
    await this._reloadBeanInstances(beanOptions);
    this._reloadBeanInstanceScope(beanOptions);
    this._reloadBeanInstanceProps(beanOptions);
    await this._reloadBeanInstanceCustom(beanOptions);
  }

  private _reloadBeanScene(beanOptions: IDecoratorBeanOptionsBase) {
    const { scene } = beanOptions;
    if (!['bean'].includes(scene)) {
      cast<ServiceOnion<any>>(this.bean.onion[scene])?.load();
    }
  }

  private _reloadBeanAop(beanOptions: IDecoratorBeanOptionsBase) {
    delete this.app[SymbolCacheAopChains][beanOptions.beanFullName];
    delete this.app[SymbolCacheAopChainsKey][beanOptions.beanFullName];
  }

  private async _reloadBeanInstances(beanOptions: IDecoratorBeanOptionsBase) {
    const { beanFullName } = beanOptions;
    const beanContainer = this.bean;
    const recordBeanInstances = this.app.meta.hmr.recordBeanInstances[beanFullName];
    if (!recordBeanInstances) return;
    this.app.meta.hmr.recordBeanInstances[beanFullName] = [];
    for (const { beanInstanceKey, withSelector, args } of recordBeanInstances) {
      // dispose
      const beanInstanceOld: any = beanContainer[SymbolBeanContainerInstances][beanInstanceKey];
      if (beanInstanceOld) {
        const state = beanInstanceOld[SymbolHmrStateSave]?.();
        await beanContainer._removeBean(beanInstanceKey);
        // new
        const beanInstanceNew: any = beanContainer._getBeanSelectorInner(
          beanFullName,
          withSelector,
          ...args,
        );
        beanInstanceNew[SymbolHmrStateLoad]?.(state);
      }
    }
  }

  private _reloadBeanInstanceScope(beanOptions: IDecoratorBeanOptionsBase) {
    const { module, scene, name } = beanOptions;
    const beanContainer = this.app.bean;
    const scope: any = beanContainer.scope(module as never);
    if (scene === 'meta') {
      const scopeMetas = scope?.__metas;
      if (scopeMetas?.[name]) {
        delete scopeMetas?.[name];
      }
    } else {
      const scopeItems = scope?.__scenes[scene]?.__instances;
      if (scopeItems?.[name]) {
        delete scopeItems?.[name];
      }
    }
  }

  private _reloadBeanInstanceProps(beanOptions: IDecoratorBeanOptionsBase) {
    const { beanFullName } = beanOptions;
    const recordBeanInstanceProps = this.app.meta.hmr.recordBeanInstanceProps[beanFullName];
    if (!recordBeanInstanceProps) return;
    this.app.meta.hmr.recordBeanInstanceProps[beanFullName] = [];
    for (const { beanInstance, prop } of recordBeanInstanceProps) {
      delete beanInstance[SymbolBeanInstancePropsLazy][prop];
    }
  }

  private async _reloadBeanInstanceCustom(beanOptions: IDecoratorBeanOptionsBase) {
    const { scene, name } = beanOptions;
    const beanContainer = this.app.bean;
    const hmrBeanName = scene === 'meta' ? `meta${toUpperCaseFirstChar(name)}` : scene;
    let hmrModuleName: string;
    if (scene === 'meta') {
      const onionMetasMeta = getOnionMetasMeta(this.app.meta.modules);
      hmrModuleName = onionMetasMeta[name].module!.info.relativeName;
    } else {
      const onionScenesMeta = getOnionScenesMeta(this.app.meta.modules);
      hmrModuleName = onionScenesMeta[scene].module!.info.relativeName;
    }
    const beanFullName = `${hmrModuleName}.hmr.${hmrBeanName}`;
    const beanInstance = beanContainer._getBean<IHmrReload>(beanFullName as never);
    if (beanInstance) {
      await beanInstance.reload(beanOptions);
    }
  }
}
