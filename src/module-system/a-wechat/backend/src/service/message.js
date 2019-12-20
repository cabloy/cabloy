module.exports = app => {

  class Message extends app.Service {

    async index({ messageIn }) {
      if (messageIn.MsgType === 'text') {
        return {
          ToUserName: messageIn.FromUserName,
          FromUserName: messageIn.ToUserName,
          CreateTime: new Date().getTime(),
          MsgType: 'text',
          Content: messageIn.Content,
        };
      }
    }


  }

  return Message;
};
