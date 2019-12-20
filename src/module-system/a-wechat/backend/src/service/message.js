module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Message extends app.Service {

    async index({ message }) {
      // event
      const res = await this.ctx.meta.event.invoke({
        module: moduleInfo.relativeName,
        name: 'wechatMessage',
        data: { message },
      });
      if (res) return res;
      // default reply
      return {
        ToUserName: message.FromUserName,
        FromUserName: message.ToUserName,
        CreateTime: new Date().getTime(),
        MsgType: 'text',
        Content: this.ctx.config.account.public.message.autoReply,
      };
    }


  }

  return Message;
};
