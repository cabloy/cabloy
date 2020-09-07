module.exports = app => {

  class Auth extends app.Service {

    // register all authProviders
    async installAuthProviders() {
      // registerAllRouters
      this.ctx.bean.auth._registerAllRouters();
      // registerAllProviders
      await this.ctx.bean.auth._registerAllProviders();
    }

    async register({ module, providerName }) {
      return await this.ctx.bean.user.registerAuthProvider({ module, providerName });
    }

  }

  return Auth;
};
