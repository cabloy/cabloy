module.exports = app => {
  class Test extends app.Service {
    async getOpenid({ user }) {
      const modelWechatUser = this.ctx.model.module('a-wechat').wechatUser;
      const wechatUser = await modelWechatUser.get({ userId: user.id, scene: 'wechat' });
      return {
        openid: wechatUser.openid,
        unionid: wechatUser.unionid,
      };
    }

    async getOpenidMini({ providerScene, user }) {
      const modelWechatUser = this.ctx.model.module('a-wechat').wechatUser;
      const wechatUser = await modelWechatUser.get({ userId: user.id, providerScene: `wechatmini${scene}` });
      return {
        openid: wechatUser.openid,
        unionid: wechatUser.unionid,
      };
    }
  }

  return Test;
};
