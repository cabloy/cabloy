import type { IModule } from '@cabloy/module-info';

import { getOnionMetasMeta } from '@cabloy/module-info';

import type { BeanBase } from '../beanBase.ts';

import { BeanBaseSimple, SymbolModuleBelong } from '../beanBaseSimple.ts';
import { BeanScopeError } from '../resource/error/beanScopeError.ts';
import { BeanScopeLocale } from '../resource/locale/beanScopeLocale.ts';
import { BeanScopeScene } from './beanScopeScene.ts';
import { BeanScopeUtil } from './beanScopeUtil.ts';

const BeanModuleError = Symbol('BeanScopeBase#BeanModuleError');
const BeanModuleLocale = Symbol('BeanScopeBase#BeanModuleLocale');
const BeanModuleUtil = Symbol('BeanScopeBase#BeanModuleUtil');
const BeanModuleModel = Symbol('BeanScopeBase#BeanModuleModel');
const BeanModuleEntity = Symbol('BeanScopeBase#BeanModuleEntity');

export class BeanScopeBase extends BeanBaseSimple {
  private [BeanModuleError]: BeanScopeError;
  private [BeanModuleLocale]: BeanScopeLocale;
  private [BeanModuleUtil]: BeanScopeUtil;
  private [BeanModuleModel]: BeanBase;
  private [BeanModuleEntity]: BeanBase;
  private __onionMetaNames: Record<string, boolean>;
  private __scenes: Record<string, BeanScopeScene> = {};
  private __metas: Record<string, unknown> = {};

  get module(): IModule {
    return this.app.meta.modules[this[SymbolModuleBelong]];
  }

  private get onionMetaNames() {
    if (!this.__onionMetaNames) {
      this.__onionMetaNames = {};
      const onionMetasMeta = getOnionMetasMeta(this.app.meta.modules);
      for (const metaName in onionMetasMeta) {
        const onionMetaMeta = onionMetasMeta[metaName];
        if (onionMetaMeta.scopeResource) {
          this.__onionMetaNames[metaName] = true;
        }
      }
    }
    return this.__onionMetaNames;
  }

  protected __get__(prop: string) {
    const moduleBelong = this[SymbolModuleBelong];
    // error
    if (prop === 'error') {
      if (!this[BeanModuleError]) {
        this[BeanModuleError] = this.bean._newBean(BeanScopeError, moduleBelong);
      }
      return this[BeanModuleError];
    }
    // locale
    if (prop === 'locale') {
      if (!this[BeanModuleLocale]) {
        this[BeanModuleLocale] = this.bean._newBean(BeanScopeLocale, moduleBelong);
      }
      return this[BeanModuleLocale];
    }
    // config
    if (prop === 'config') {
      // app or ctx
      const config = this.ctx?.config ?? this.app.config;
      return config.modules[moduleBelong];
    }
    // constant
    if (prop === 'constant') {
      return this.app.meta.constants[moduleBelong];
    }
    // util
    if (prop === 'util') {
      if (!this[BeanModuleUtil]) {
        this[BeanModuleUtil] = this.bean._newBean(BeanScopeUtil, moduleBelong);
      }
      return this[BeanModuleUtil];
    }
    // model
    if (prop === 'model') {
      if (!this[BeanModuleModel]) {
        this[BeanModuleModel] = this.bean._newBean(
          'a-orm.service.modelResolver' as any,
          moduleBelong,
        );
      }
      return this[BeanModuleModel];
    }
    // entity
    if (prop === 'entity') {
      if (!this[BeanModuleEntity]) {
        this[BeanModuleEntity] = this.bean._newBean(
          'a-orm.service.entityResolver' as any,
          moduleBelong,
        );
      }
      return this[BeanModuleEntity];
    }
    // meta
    if (this.onionMetaNames[prop]) {
      if (!this.__metas[prop]) {
        this.__metas[prop] = this.bean._getBean(`${moduleBelong}.meta.${prop}` as any);
      }
      return this.__metas[prop];
    }
    // scene
    if (!this.__scenes[prop]) {
      this.__scenes[prop] = this.bean._newBean(BeanScopeScene, moduleBelong, prop);
    }
    return this.__scenes[prop];
  }
}
