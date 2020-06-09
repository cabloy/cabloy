const WechatHelperFn = require('../common/wechatHelper.js');

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Message extends app.Service {

    async index({ message }) {
      let res;
      // event: subscribe
      if (message.MsgType === 'event') {
        if (message.Event === 'subscribe') {
          res = await this._subscribeUser({ openid: message.FromUserName, message });
        } else if (message.Event === 'unsubscribe') {
          res = await this._unsubscribeUser({ openid: message.FromUserName, message });
        }
      }
      // raise event
      const res2 = await this.ctx.meta.event.invoke({
        module: moduleInfo.relativeName,
        name: 'wechatMessage',
        data: { message },
      });
      if (res2) res = res2;
      // check if ready
      if (res) return res;
      // default reply
      return {
        ToUserName: message.FromUserName,
        FromUserName: message.ToUserName,
        CreateTime: new Date().getTime(),
        MsgType: 'text',
        Content: this.ctx.config.account.public.message.reply.default,
      };
    }

    async _subscribeUser({ openid, message }) {
      // user info
      const userInfo = await this.ctx.meta.wechat.getUser({ openid });
      // verify auth user
      const wechatHelper = new (WechatHelperFn(this.ctx))();
      await wechatHelper.verifyAuthUser({ scene: 1, openid, userInfo });
      // ok
      return {
        ToUserName: message.FromUserName,
        FromUserName: message.ToUserName,
        CreateTime: new Date().getTime(),
        MsgType: 'text',
        Content: this.ctx.config.account.public.message.reply.subscribe,
      };
    }

    async _unsubscribeUser({ openid, message }) {
      // wechat user
      const userWechat = await this.ctx.model.wechatUser.get({ openid });
      if (userWechat) {
        await this.ctx.model.wechatUser.update({
          id: userWechat.id, subscribe: 0,
        });
      }
      // ok
      return {
        ToUserName: message.FromUserName,
        FromUserName: message.ToUserName,
        CreateTime: new Date().getTime(),
        MsgType: 'text',
        Content: '',
      };
    }

  }

  return Message;
};
