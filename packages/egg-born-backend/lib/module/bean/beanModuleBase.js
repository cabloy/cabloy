const BeanModuleCaches = Symbol('BEAN#__BeanModuleCaches');

class BeanModuleBase {

  constructor(ctx, beanClassName) {
    this.__ctx = ctx;
    this.__beanClassName = beanClassName;
  }

  // other module's atom
  module(moduleName) {
    if (!this[BeanModuleCaches]) this[BeanModuleCaches] = new Map();
    let beanInstance = this[BeanModuleCaches].get(moduleName);
    if (!beanInstance) {
      beanInstance = this.__ctx.bean._newBean(this.__beanClassName, moduleName);
      this[BeanModuleCaches].set(moduleName, beanInstance);
    }
    return beanInstance;
  }

}

module.exports = BeanModuleBase;
