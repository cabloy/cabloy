module.exports = app => {

  class Status extends app.Service {

    async set({ module, name, value }) {
      const res = await this.ctx.meta.status.module(module)._set({ name, value, queue: false });
      return res;
    }

  }

  return Status;
};
