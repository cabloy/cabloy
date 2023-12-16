module.exports = class Auth {
  async list() {
    return this.ctx.bean.authProviderCache.getAuthProvidersConfigForLogin();
  }
};
