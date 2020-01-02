module.exports = app => {

  class Test extends app.Service {

    async getOpenid({ user }) {
      const wechatUser = await this.ctx.model.wechatUser.get({ userId: user.id, scene: 1 });
      return {
        openid: wechatUser.openid,
        unionid: wechatUser.unionid,
      };
    }

    async getOpenidMini({ user }) {
      const wechatUser = await this.ctx.model.wechatUser.get({ userId: user.id, scene: 2 });
      return {
        openid: wechatUser.openid,
        unionid: wechatUser.unionid,
      };
    }

  }

  return Test;
};
