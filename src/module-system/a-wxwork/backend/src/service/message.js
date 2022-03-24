module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Message extends app.Service {
    get beanProviderSelfBuilt() {
      // bean provider
      const beanProvider = this.ctx.bean.authProvider.createAuthProviderBean({
        module: moduleInfo.relativeName,
        providerName: 'wxwork',
        providerScene: 'selfBuilt',
      });
      // if (!beanProvider.providerSceneValid) this.ctx.throw(423);
      return beanProvider;
    }

    async general({ providerName, providerScene, message }) {
      // result
      let result;
      // raise event
      return await this.ctx.bean.event.invoke({
        module: moduleInfo.relativeName,
        name: 'wxworkMessageGeneral',
        data: { providerName, providerScene, message },
        result,
        next: async (context, next) => {
          // default
          if (context.result === undefined) {
            if (['selfBuilt', 'contacts'].includes(providerScene)) {
              context.result = await this[providerScene]({ message });
            }
          }
          await next();
        },
      });
    }

    async selfBuilt({ message }) {
      // result
      let result;
      // event: subscribe
      if (message.MsgType === 'event') {
        if (message.Event === 'subscribe') {
          // donothing，具体逻辑在通讯录回调通知中实现
          return null;
        } else if (message.Event === 'unsubscribe') {
          // donothing，具体逻辑在通讯录回调通知中实现
          return null;
        }
      }
      // raise event
      return await this.ctx.bean.event.invoke({
        module: moduleInfo.relativeName,
        name: 'wxworkMessage',
        data: { message },
        result,
        next: async (context, next) => {
          // default
          if (context.result === undefined) {
            if (message.MsgType !== 'event') {
              const config = this.beanProviderSelfBuilt.configProviderScene;
              context.result = {
                ToUserName: message.FromUserName,
                FromUserName: message.ToUserName,
                CreateTime: new Date().getTime(),
                MsgType: 'text',
                Content: config.message.reply.default,
              };
            }
          }
          await next();
        },
      });
    }

    async contacts({ message }) {
      // queue
      this.ctx.meta.util.queuePush({
        module: moduleInfo.relativeName,
        queueName: 'contacts',
        data: {
          queueAction: 'changeContact',
          message,
        },
      });
      // ok
      return null;
    }
  }

  return Message;
};
