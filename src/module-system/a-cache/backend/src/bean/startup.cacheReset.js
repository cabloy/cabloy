module.exports = app => {
  class Startup extends app.meta.BeanBase {
    async execute(/* context*/) {
      // cache reset
      //   : just clear mem cache
      await this.ctx.cache.mem._clearAll();
    }
  }

  return Startup;
};
