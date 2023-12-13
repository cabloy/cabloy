module.exports = app => {
  const moduleInfo = module.info;
  class Auth extends app.Service {
    // data: { clientID, clientSecret }
    async signin({ data, state = 'login' }) {
      // signin
      await this.ctx.bean.authProvider.authenticateDirect({
        module: moduleInfo.relativeName,
        providerName: 'authopen',
        query: { state },
        body: { data },
      });
      // user info
      return await this.ctx.bean.auth.getLoginInfo({ clientId: true });
    }
  }

  return Auth;
};
