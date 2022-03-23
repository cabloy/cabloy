module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Auth extends app.Service {
    async login({ providerName, providerScene, code, state }) {
      if (!providerScene || !code) return this.ctx.throw(403);
      // member
      //   use dingtalk.app.selfBuilt
      const res = await this.ctx.bean.dingtalk.app.selfBuilt.user.getUserInfoByCode(code);
      const memberId = res.userid;
      // bean provider
      const beanProvider = this.ctx.bean.authProvider.createAuthProviderBean({
        module: moduleInfo.relativeName,
        providerName,
        providerScene,
      });
      if (!beanProvider.providerSceneValid) this.ctx.throw(423);
      // verify
      await this.localHelper.verifyAuthUser({ beanProvider, state, memberId, needLogin: true });
      // echo
      return await this.ctx.bean.auth.echo();
    }
  }

  return Auth;
};
