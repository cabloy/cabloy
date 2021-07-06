module.exports = ctx => {
  class IOMessage extends ctx.app.meta.IOMessageBase(ctx) {
    async onSaveSync({ path, options, message, messageSync, messageClass }) {
      // options
      const messageScene = (options && options.scene) || '';
      // send back
      if (messageSync.messageDirection === 1 && message.userIdTo === 0) {
        const content = JSON.parse(message.content);
        const _message = {
          messageType: message.messageType,
          messageFilter: message.messageFilter,
          messageGroup: message.messageGroup,
          messageScene,
          userIdFrom: 0,
          userIdTo: messageSync.userId,
          content: {
            text: `Reply: ${content.text}`,
          },
        };
        await ctx.bean.io.publish({ path, message: _message, messageClass, options });
      }
      return await super.onSaveSync({ path, options, message, messageSync, messageClass });
    }
  }
  return IOMessage;
};
