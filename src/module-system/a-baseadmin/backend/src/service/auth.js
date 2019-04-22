module.exports = app => {

  class Auth extends app.Service {

    async list() {
      // list
      const list = await this.ctx.model.authProvider.select();
      // meta
      const authProviders = this.ctx.meta.base.authProviders();
      for (const item of list) {
        const key = `${item.module}:${item.providerName}`;
        const authProvider = authProviders[key];
        item.meta = authProvider.meta;
      }
      // ok
      return list;
    }

    async disable({ id, disabled }) {
      await this.ctx.model.authProvider.update({ id, disabled });
    }

    async item({ id }) {
      return await this.ctx.model.authProvider.get({ id });
    }

    async save({ id, config }) {
      await this.ctx.model.authProvider.update({ id, config: JSON.stringify(config) });
    }

  }

  return Auth;
};
