module.exports = app => {

  class Test extends app.Service {

    async getOpenid({ user }) {
      const modelWechatUser = this.ctx.model.module('a-wechat').wechatUser;
      const wechatUser = await modelWechatUser.get({ userId: user.id, scene: 1 });
      return {
        openid: wechatUser.openid,
        unionid: wechatUser.unionid,
      };
    }

    async getOpenidMini({ user }) {
      const modelWechatUser = this.ctx.model.module('a-wechat').wechatUser;
      const wechatUser = await modelWechatUser.get({ userId: user.id, scene: 2 });
      return {
        openid: wechatUser.openid,
        unionid: wechatUser.unionid,
      };
    }

  }

  return Test;
};
