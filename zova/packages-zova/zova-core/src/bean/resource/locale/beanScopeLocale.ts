import type { IModuleLocale } from './type.ts';

import { BeanSimple } from '../../beanSimple.ts';

const BeanModuleScope = Symbol('BeanScopeLocale#ModuleScope');

export class BeanScopeLocale extends BeanSimple {
  // @ts-ignore: ignore
  private [BeanModuleScope]: string;
  private __instances: Record<string, IModuleLocale> = {};

  constructor(moduleScope) {
    super();
    this[BeanModuleScope] = moduleScope;
  }

  protected __get__(prop: string) {
    if (!this.__instances[prop]) {
      const metaLocale = this.app ? this.app.meta.locale : this.sys.meta.locale;
      this.__instances[prop] = metaLocale.createScopeLocaleText(this[BeanModuleScope], prop);
    }
    return this.__instances[prop];
  }
}
