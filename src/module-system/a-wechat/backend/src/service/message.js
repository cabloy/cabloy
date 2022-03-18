module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Message extends app.Service {
    async index({ message, config, beanProvider }) {
      let result;
      // event: subscribe
      if (message.MsgType === 'event') {
        if (message.Event === 'subscribe') {
          result = await this._subscribeUser({ openid: message.FromUserName, message, config, beanProvider });
        } else if (message.Event === 'unsubscribe') {
          result = await this._unsubscribeUser({ openid: message.FromUserName, message, config, beanProvider });
        }
      }
      // raise event
      return await this.ctx.bean.event.invoke({
        module: moduleInfo.relativeName,
        name: 'wechatMessage',
        data: { message },
        result,
        next: async (context, next) => {
          // default
          if (context.result === undefined) {
            context.result = {
              ToUserName: message.FromUserName,
              FromUserName: message.ToUserName,
              CreateTime: new Date().getTime(),
              MsgType: 'text',
              Content: config.message.reply.default,
            };
          }
          await next();
        },
      });
    }

    async _subscribeUser({ openid, message, config, beanProvider }) {
      // user info
      const userInfo = await this.ctx.bean.wechat.app.getUser({ openid });
      // verify auth user
      await this.ctx.bean.local.helper.verifyAuthUser({ beanProvider, openid, userInfo, needLogin: true });
      // ok
      return {
        ToUserName: message.FromUserName,
        FromUserName: message.ToUserName,
        CreateTime: new Date().getTime(),
        MsgType: 'text',
        Content: config.message.reply.subscribe,
      };
    }

    async _unsubscribeUser({ openid, message }) {
      // wechat user
      const userWechat = await this.ctx.model.wechatUser.get({ openid });
      if (userWechat) {
        await this.ctx.model.wechatUser.update({
          id: userWechat.id,
          subscribe: 0,
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
