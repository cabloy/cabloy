module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Message extends app.Service {
    get modelWechatUser() {
      return this.ctx.model.wechatUser;
    }

    async general({ beanProvider, message }) {
      // result
      let result;
      // raise event
      return await this.ctx.bean.event.invoke({
        module: moduleInfo.relativeName,
        name: 'wechatMessageGeneral',
        data: { beanProvider, message },
        result,
        next: async (context, next) => {
          // default
          if (context.result === undefined) {
            const methodName = `${beanProvider.providerName}${beanProvider.providerScene || 'index'}`;
            if (this[methodName]) {
              context.result = await this[methodName]({ beanProvider, message });
            }
          }
          await next();
        },
      });
    }

    async wechatindex({ beanProvider, message }) {
      let result;
      // event: subscribe
      if (message.MsgType === 'event') {
        if (message.Event === 'subscribe') {
          result = await this._subscribeUser({ openid: message.FromUserName, message, beanProvider });
        } else if (message.Event === 'unsubscribe') {
          result = await this._unsubscribeUser({ openid: message.FromUserName, message, beanProvider });
        }
      }
      // raise event
      return await this.ctx.bean.event.invoke({
        module: moduleInfo.relativeName,
        name: 'wechatMessage',
        data: { beanProvider, message },
        result,
        next: async (context, next) => {
          // default
          if (context.result === undefined) {
            const config = beanProvider.configProviderScene;
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

    async wechatminidefault({ beanProvider, message }) {
      // raise event
      await this.ctx.bean.event.invoke({
        module: moduleInfo.relativeName,
        name: 'wechatMessageMini',
        data: { beanProvider, message },
      });
    }

    async _subscribeUser({ openid, message, beanProvider }) {
      const config = beanProvider.configProviderScene;
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
      const userWechat = await this.modelWechatUser.get({ openid });
      if (userWechat) {
        await this.modelWechatUser.update({
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
