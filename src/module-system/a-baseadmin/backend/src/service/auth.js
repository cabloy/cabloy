module.exports = class Auth {
  async list() {
    return this.ctx.bean.authProviderCache.getAuthProvidersConfigForAdmin();
  }

  async disable({ id, disabled }) {
    // check if only one
    if (disabled) {
      const list = this.ctx.bean.authProviderCache.getAuthProvidersConfigForLogin();
      if (list.length <= 1) this.ctx.throw(1001);
    }
    // update
    await this.ctx.model.authProvider.update({ id, disabled });
    // item
    const item = await this.ctx.model.authProvider.get({ id });
    // changed
    await this.ctx.bean.authProviderCache.authProviderChanged({
      module: item.module,
      providerName: item.providerName,
    });
  }

  async save({ id, config }) {
    // update
    await this.ctx.model.authProvider.update({ id, config: JSON.stringify(config) });
    // item
    const item = await this.ctx.model.authProvider.get({ id });
    // changed
    await this.ctx.bean.authProviderCache.authProviderChanged({
      module: item.module,
      providerName: item.providerName,
    });
  }
};
