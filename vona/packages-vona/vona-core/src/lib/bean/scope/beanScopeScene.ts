import { BeanSimple } from '../beanSimple.ts';

const BeanModuleScope = Symbol('BeanScopeScene#ModuleScope');
const BeanModuleScene = Symbol('BeanScopeScene#BeanModuleScene');

export class BeanScopeScene extends BeanSimple {
  private [BeanModuleScope]: string;
  private [BeanModuleScene]: string;
  private __instances: Record<string, any> = {};

  constructor(moduleScope, scene) {
    super();
    this[BeanModuleScope] = moduleScope;
    this[BeanModuleScene] = scene;
  }

  protected __get__(prop: string) {
    if (!this.__instances[prop]) {
      const beanFullName = `${this[BeanModuleScope]}.${this[BeanModuleScene]}.${prop}`;
      this.__instances[prop] = (this.bean as any)._injectBeanInstanceProp(this, beanFullName, {});
    }
    return this.__instances[prop];
  }
}
