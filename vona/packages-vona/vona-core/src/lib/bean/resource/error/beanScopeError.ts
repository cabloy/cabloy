import type { IModuleError } from './type.ts';

import { BeanSimple } from '../../beanSimple.ts';
import { BeanScopeErrorImpl } from './beanScopeErrorImpl.ts';

const BeanModuleScope = Symbol('BeanScopeError#ModuleScope');

export class BeanScopeError extends BeanSimple {
  private [BeanModuleScope]: string;
  private __instances: Record<string, IModuleError> = {};

  constructor(moduleScope) {
    super();
    this[BeanModuleScope] = moduleScope;
  }

  protected __get__(prop: string) {
    if (!this.__instances[prop]) {
      this.__instances[prop] = this.bean._newBean(BeanScopeErrorImpl, this[BeanModuleScope], prop);
    }
    return this.__instances[prop];
  }
}
