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

    async actionAsync2({ a, b }) {
      const name = this.name;
      const value = await this.actionAsync({ a, b });
      return `${name}:${value}`;
    }

    async actionAsync3({ a, b }) {
      return await this.actionAsync2({ a, b });
    }

  }

  return ctxBean;
};
