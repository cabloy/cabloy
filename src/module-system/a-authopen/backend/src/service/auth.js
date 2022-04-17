module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Auth extends app.Service {
    // data: { clientID, clientSecret }
    async signin({ data, state = 'login' }) {
      // signin
      return await this.ctx.bean.authProvider.authenticateDirect({
        module: moduleInfo.relativeName,
        providerName: 'authopen',
        query: { state },
        body: { data },
      });
    }
  }

  return Auth;
};
