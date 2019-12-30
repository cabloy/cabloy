const WechatHelperFn = require('../common/wechatHelper.js');

module.exports = app => {

  class AuthMini extends app.Service {

    async login({ code, detail }) {
      // code2Session
      const res = await this.ctx.meta.wechatMini.code2Session(code);
      const session_key = res.session_key;
      const openid = res.openid;
      let unionid = res.unionid;
      // unionid
      if (!unionid && detail && detail.encryptedData) {
        const res2 = this.ctx.meta.wechatMini.decryptMini(detail.encryptedData, session_key, detail.iv);
        unionid = res2.unionid;
      }
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
      // echo
      return await this.ctx.performAction({
        method: 'post',
        url: '/a/base/auth/echo',
      });
    }

  }

  return AuthMini;
};
