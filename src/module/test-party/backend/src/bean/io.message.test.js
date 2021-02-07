module.exports = ctx => {
  class IOMessage extends ctx.app.meta.IOMessageBase(ctx) {

    async onSessionId({ path, message, options }) {
      return await super.onSessionId({ path, message, options });
    }

    async onGroupUsers({ path, message, options }) {
      return await super.onGroupUsers({ path, message, options });
    }

    async onProcess({ path, options, message, messageSyncs, groupUsers, messageClass }) {
      return await super.onProcess({ path, options, message, messageSyncs, groupUsers, messageClass });
    }

    async onPush({ options, message, messageSync, messageClass }) {
      return await super.onPush({ options, message, messageSync, messageClass });
    }

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

    async onChannelRender({ channelFullName, options, message, messageSync, messageClass }) {
      await super.onChannelRender({ channelFullName, options, message, messageSync, messageClass });
    }

  }
  return IOMessage;
};
