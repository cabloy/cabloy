module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class AuthMini extends app.Service {
    async login({ providerScene, code, detail }) {
      let session_key;
      let openid;
      let unionid;

      // mini
      const apiMini = this.ctx.bean.wechat.mini[providerScene];

      // code
      if (code) {
        // code2Session
        const res = await apiMini.code2Session(code);
        session_key = res.session_key;
        openid = res.openid;
        unionid = res.unionid;
      } else {
        // from cache
        session_key = await apiMini.getSessionKey();
      }
      // openid/unionid
      if ((!openid || !unionid) && detail && detail.encryptedData) {
        const res = await apiMini.decryptMini(detail.encryptedData, detail.iv, session_key);
        if (!res) this.ctx.throw(403);
        openid = res.openId;
        unionid = res.unionId;
      }
      // check openid
      if (!openid) this.ctx.throw(403);
      // userInfo
      const userInfo = { openid, unionid };
      if (detail && detail.userInfo) {
        userInfo.nickname = detail.userInfo.nickName;
        userInfo.sex = detail.userInfo.gender;
        userInfo.language = detail.userInfo.language;
        userInfo.city = detail.userInfo.city;
        userInfo.province = detail.userInfo.province;
        userInfo.country = detail.userInfo.country;
        userInfo.headimgurl = detail.userInfo.avatarUrl;
      }
      // bean provider
      const beanProvider = this.ctx.bean.authProvider.createAuthProviderBean({
        module: moduleInfo.relativeName,
        providerName: 'wechatmini',
        providerScene,
      });
      if (!beanProvider.providerSceneValid) this.ctx.throw.module('a-base', 1015);
      // verify
      await this.ctx.bean.local.helper.verifyAuthUser({ beanProvider, openid, userInfo, needLogin: true });
      // save session_key, because ctx.state.user maybe changed
      await apiMini.saveSessionKey(session_key);
      // echo
      return await this.ctx.bean.auth.echo();
    }
  }

  return AuthMini;
};
