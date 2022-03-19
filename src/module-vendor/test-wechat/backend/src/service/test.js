module.exports = app => {
  class Test extends app.Service {
    get modelWechatUser() {
      return this.ctx.model.module('a-wechat').wechatUser;
    }

    async getOpenid({ user }) {
      const wechatUser = await this.modelWechatUser.get({ userId: user.id, scene: 'wechat' });
      return {
        openid: wechatUser.openid,
        unionid: wechatUser.unionid,
      };
    }

    async getOpenidMini({ providerScene, user }) {
      const wechatUser = await this.modelWechatUser.get({ userId: user.id, providerScene: `wechatmini${scene}` });
      return {
        openid: wechatUser.openid,
        unionid: wechatUser.unionid,
      };
    }
  }

  return Test;
};
