import { appResource, BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';
import { $columnsAll } from 'vona-module-a-ormutils';

const SymbolModuleScope = Symbol('SymbolModuleScope');

@Service()
export class ServiceEntityResolver extends BeanBase {
  protected [SymbolModuleScope]: string;
  private __instances: Record<string, any> = {};

  constructor(moduleScope: string) {
    super();
    this[SymbolModuleScope] = moduleScope;
  }

  protected __get__(prop: string) {
    if (!this.__instances[prop]) {
      const beanFullName = `${this[SymbolModuleScope]}.entity.${prop}`;
      const beanOptions = appResource.getBean(beanFullName)!;
      this.__instances[prop] = $columnsAll(beanOptions.beanClass, true, true);
    }
    return this.__instances[prop];
  }
}
