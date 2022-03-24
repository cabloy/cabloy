module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Message extends app.Service {
    async general({ beanProvider, message }) {
      // result
      let result;
      // raise event
      return await this.ctx.bean.event.invoke({
        module: moduleInfo.relativeName,
        name: 'wxworkMessageGeneral',
        data: { beanProvider, message },
        result,
        next: async (context, next) => {
          // default
          if (context.result === undefined) {
            const methodName = `${beanProvider.providerName}${beanProvider.providerScene}`;
            if (this[methodName]) {
              context.result = await this[methodName]({ beanProvider, message });
            }
          }
          await next();
        },
      });
    }

    async wxworkselfBuilt({ beanProvider, message }) {
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
        data: { beanProvider, message },
        result,
        next: async (context, next) => {
          // default
          if (context.result === undefined) {
            if (message.MsgType !== 'event') {
              const config = beanProvider.configProviderScene;
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

    async wxworkcontacts({ message }) {
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
