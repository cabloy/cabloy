module.exports = ctx => {
  class IOMessage extends ctx.app.meta.IOMessageBase(ctx) {

    async onDelivery({ path, options, message, messageSync, messageClass }) {
      // options
      const messageScene = (options && options.scene) || '';
      // send back
      if (messageSync.messageDirection === 2 && messageSync.userId === 0) {
        const content = JSON.parse(message.content);
        const _message = {
          messageType: message.messageType,
          messageFilter: message.messageFilter,
          messageGroup: message.messageGroup,
          messageScene,
          userIdFrom: 0,
          userIdTo: message.userIdFrom,
          content: {
            text: `Reply: ${content.text}`,
          },
        };
        return await super.publish({ path, message: _message, messageClass, options, user: { id: 0 } });
      }
      // default
      return await super.onDelivery({ path, options, message, messageSync, messageClass });
    }

  }
  return IOMessage;
};
