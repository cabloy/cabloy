module.exports = app => {

  class Db extends app.Service {

    async set({ module, name, value, timeout }) {
      const res = await this.ctx.cache._db.module(module)._set({ name, value, timeout, queue: false });
      return res;
    }

  }

  return Db;
};
