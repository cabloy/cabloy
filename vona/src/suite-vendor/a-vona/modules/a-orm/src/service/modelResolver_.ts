import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';

const SymbolModuleScope = Symbol('SymbolModuleScope');

@Service()
export class ServiceModelResolver extends BeanBase {
  protected [SymbolModuleScope]: string;

  constructor(moduleScope: string) {
    super();
    this[SymbolModuleScope] = moduleScope;
  }

  protected __get__(prop: string) {
    const beanFullName = `${this[SymbolModuleScope]}.model.${prop}`;
    return this.bean._getBean(beanFullName as any);
  }
}
