module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Auth extends app.Service {
    async signin({ clientID, clientSecret, state = 'login' }) {
      const res = await this.ctx.bean.authProvider.authenticateDirect({
        module: moduleInfo.relativeName,
        providerName: 'authopen',
        query: { state },
        body: { clientID, clientSecret },
      });
      return res;
    }
  }

  return Auth;
};
