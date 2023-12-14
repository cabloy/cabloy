const BeanModuleCaches = Symbol('BEAN#__BeanModuleCaches');

class BeanModuleBase {
  constructor(moduleName, beanClassName) {
    this.__moduleName = moduleName;
    this.__beanClassName = beanClassName;
  }

  get moduleName() {
    return this.__moduleName || this.ctx.module.info.relativeName;
  }

  // other module's bean
  module(moduleName) {
    if (!this[BeanModuleCaches]) this[BeanModuleCaches] = new Map();
    let beanInstance = this[BeanModuleCaches].get(moduleName);
    if (!beanInstance) {
      beanInstance = this.ctx.bean._newBean(this.__beanClassName, moduleName);
      this[BeanModuleCaches].set(moduleName, beanInstance);
    }
    return beanInstance;
  }
}

module.exports = BeanModuleBase;
