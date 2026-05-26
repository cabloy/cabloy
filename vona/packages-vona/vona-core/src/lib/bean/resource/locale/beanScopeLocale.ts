import type { IModuleLocale } from './type.ts';

import { BeanSimple } from '../../beanSimple.ts';

const BeanModuleScope = Symbol('BeanScopeLocale#ModuleScope');

export class BeanScopeLocale extends BeanSimple {
  private [BeanModuleScope]: string;
  private __instances: Record<string, IModuleLocale> = {};

  constructor(moduleScope) {
    super();
    this[BeanModuleScope] = moduleScope;
  }

  protected __get__(prop: string) {
    if (!this.__instances[prop]) {
      this.__instances[prop] = this.app.meta.locale.createScopeLocaleText(
        this[BeanModuleScope],
        prop,
      );
    }
    return this.__instances[prop];
  }
}
