module.exports = app => {
  class Auth extends app.Service {
    async list() {
      return this.ctx.bean.authProviderCache.getAuthProvidersConfigForAdmin();
    }

    async disable({ id, disabled }) {
      // update
      await this.ctx.model.authProvider.update({ id, disabled });
      // item
      const item = await this.ctx.model.authProvider.get({ id });
      // changed
      this.ctx.bean.authProviderCache.authProviderChanged({
        module: item.module,
        providerName: item.providerName,
      });
    }

    async save({ id, config }) {
      // update
      await this.ctx.model.authProvider.update({ id, config: JSON.stringify(config) });
      // item
      const item = await this.ctx.model.authProvider.get({ id });
      // broadcast
      this.ctx.meta.util.broadcastEmit({
        module: 'a-auth',
        broadcastName: 'authProviderChanged',
        data: {
          module: item.module,
          providerName: item.providerName,
        },
      });
    }
  }

  return Auth;
};
