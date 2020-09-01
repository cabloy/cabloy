module.exports = ctx => {
  class ctxBean {

    constructor(moduleName) {
      this._name = moduleName || ctx.module.info.relativeName;
    }

    get name() {
      return this._name;
    }

    set name(value) {
      this._name = value;
    }

    actionSync({ a, b }) {
      return a + b;
    }

    async actionAsync({ a, b }) {
      return Promise.resolve(a + b);
    }


  }

  return ctxBean;
};
