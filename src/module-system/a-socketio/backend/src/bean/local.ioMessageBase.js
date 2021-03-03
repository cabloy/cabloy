module.exports = ctx => {
  class IOMessageBase {

    async onSessionId({ /* path,*/ message /* options*/ }) {
      const userIdFrom = message.userIdFrom;
      const userIdTo = message.userIdTo;
      return message.messageGroup ? userIdTo : this._combineSessionId(userIdFrom, userIdTo);
    }

    async onProcess({ path, options, message, messageSyncs, groupUsers, messageClass }) {
      return await ctx.bean.io._onProcessBase({ path, options, message, messageSyncs, groupUsers, messageClass });
    }

    async onSaveSyncs({ path, options, message, messageClass }) {
      return await ctx.bean.io._onSaveSyncs({ path, options, message, messageClass });
    }

    async onSaveSyncsPolicy({ path, options, message, messageClass, saveLimit, onSaveSync }) {
      return await ctx.bean.io._onSaveSyncsPolicy({ path, options, message, messageClass, saveLimit, onSaveSync });
    }

    async onDelivery({ path, options, message, messageSync, messageClass }) {
      return await ctx.bean.io.delivery({ path, options, message, messageSync, messageClass });
    }

    async onPushEnable({ /* options, message, messageSyncs,*/ messageClass }) {
      const messageClassBase = ctx.bean.io.messageClass.messageClass(messageClass);
      return !!(messageClassBase.info.push && messageClassBase.info.push.channels);
    }

    async onPush({ options, message, messageSync, messageClass }) {
      return await ctx.bean.io.push({ options, message, messageSync, messageClass });
    }

    async onChannels({ /* options, message, messageSync,*/ messageClass }) {
      const messageClassBase = ctx.bean.io.messageClass.messageClass(messageClass);
      return messageClassBase.info.push && messageClassBase.info.push.channels;
    }

    async onChannelRender(/* { channelFullName, options, message, messageSync, messageClass }*/) {
      return null;
    }

    async onPublish({ path, message, messageClass, options }) {
      return await ctx.bean.io._publish({ path, message, messageClass, options });
    }

    async onSetRead({ messageClass, messageIds, all, user }) {
      return await ctx.bean.io.message._setRead({ messageClass, messageIds, all, user });
    }

    // combine sessionId
    _combineSessionId(userIdFrom, userIdTo) {
      if (userIdFrom === userIdTo) return userIdFrom;
      return `${userIdFrom > userIdTo ? userIdFrom : userIdTo}:${userIdFrom < userIdTo ? userIdFrom : userIdTo}`;
    }

  }
  return IOMessageBase;
};
