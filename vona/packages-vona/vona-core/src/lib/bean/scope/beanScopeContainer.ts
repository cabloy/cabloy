import { splitWords } from '@cabloy/word-utils';

import { BeanSimple } from '../beanSimple.ts';

export interface IBeanScopeContainer {}

export class BeanScopeContainer extends BeanSimple {
  private __instances: Record<string, any> = {};

  protected __get__(prop: string) {
    if (!this.__instances[prop]) {
      let moduleName = splitWords(prop, true, '-');
      if (!moduleName?.includes('-')) {
        moduleName = `a-${moduleName}`;
      }
      this.__instances[prop] = this.bean.scope(moduleName as never);
    }
    return this.__instances[prop];
  }
}
