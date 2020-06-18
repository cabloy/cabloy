const WechatHelperFn = require('../common/wechatHelper.js');

module.exports = app => {

  class AuthMini extends app.Service {

    async login({ code, detail }) {
      let session_key;
      let openid;
      let unionid;
      if (code) {
        // code2Session
        const res = await this.ctx.meta.wechat.mini.code2Session(code);
        session_key = res.session_key;
        openid = res.openid;
        unionid = res.unionid;
      } else {
        // from cache
        session_key = await this.ctx.meta.wechat.mini.getSessionKey();
      }
      // openid/unionid
      if ((!openid || !unionid) && detail && detail.encryptedData) {
        const res = await this.ctx.meta.wechat.mini.decryptMini(detail.encryptedData, detail.iv, session_key);
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
      // verify
      const wechatHelper = new (WechatHelperFn(this.ctx))();
      await wechatHelper.verifyAuthUser({ scene: 2, openid, userInfo });
      // save session_key, because ctx.user maybe changed
      await this.ctx.meta.wechat.mini.saveSessionKey(session_key);
      // echo
      return await this.ctx.meta.auth.echo();
    }

  }

  return AuthMini;
};
