module.exports = app => {

  class Event extends app.Service {

    async wechatMessage({ event, data }) {
      const message = data.message;
      if (message.MsgType === 'text') {
        event.break = true;
        return {
          ToUserName: message.FromUserName,
          FromUserName: message.ToUserName,
          CreateTime: new Date().getTime(),
          MsgType: 'text',
          Content: `${this.ctx.text.locale('zh-cn', 'Reply')}: ${message.Content}`,
        };
      }
    }

    async wechatMessageMini({ event, data }) {
      // scene
      const scene = data.scene;
      // message
      const message = data.message;
      if (message.MsgType === 'text') {
        event.break = true;
        const text = `${this.ctx.text.locale('zh-cn', 'Reply')}: ${message.Content}`;
        await this.ctx.meta.wechat.mini[scene].sendText(message.FromUserName, text);
      }
    }

  }

  return Event;
};
