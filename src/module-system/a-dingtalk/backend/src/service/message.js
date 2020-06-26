module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Message extends app.Service {

    async index({ message }) {
      // config
      const config = this.ctx.config.account.wxwork;
      const configAppSelfBuilt = config.apps.selfBuilt;
      // res
      let res;
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
      const res2 = await this.ctx.meta.event.invoke({
        module: moduleInfo.relativeName,
        name: 'wxworkMessage',
        data: { message },
      });
      if (res2) res = res2;
      // check if ready
      if (res) return res;
      // default reply
      if (message.MsgType !== 'event') {
        return {
          ToUserName: message.FromUserName,
          FromUserName: message.ToUserName,
          CreateTime: new Date().getTime(),
          MsgType: 'text',
          Content: configAppSelfBuilt.message.reply.default,
        };
      }
      return null;
    }

    async contacts({ message }) {
      // queue
      this.ctx.app.meta.queue.push({
        locale: this.ctx.locale,
        subdomain: this.ctx.subdomain,
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
