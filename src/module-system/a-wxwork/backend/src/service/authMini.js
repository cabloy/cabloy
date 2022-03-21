module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class AuthMini extends app.Service {
    get localHelper() {
      return this.ctx.bean.local.helper;
    }

    async login({ providerScene, code }) {
      if (!code) return this.ctx.throw(403);
      // mini
      const apiMini = this.ctx.bean.wxwork.mini[providerScene];
      // session
      const res = await apiMini.code2Session(code);
      // const res = { errcode: 0, userid: 'YangJian1', session_key: 'kJtdi6RF+Dv67QkbLlPGjw==' };
      if (res.errcode) throw new Error(res.errmsg);
      const session_key = res.session_key;
      const memberId = res.userid;
      // bean provider
      const beanProvider = this.ctx.bean.authProvider.createAuthProviderBean({
        module: moduleInfo.relativeName,
        providerName: 'wxworkmini',
        providerScene,
      });
      if (!beanProvider.providerSceneValid) this.ctx.throw(423);
      // verify
      await this.localHelper.verifyAuthUser({ beanProvider, memberId, needLogin: true });
      // save session_key, because ctx.state.user maybe changed
      await apiMini.saveSessionKey(session_key);
      // echo
      return await this.ctx.bean.auth.echo();
    }
  }

  return AuthMini;
};
