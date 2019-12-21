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

  }

  return Event;
};
