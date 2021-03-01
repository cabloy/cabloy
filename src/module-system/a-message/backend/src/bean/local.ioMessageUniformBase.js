const __PATH_MESSAGE_UNIFORM = '/a/message/uniform';

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class IOMessageUniformBase extends ctx.app.meta.IOMessageBase(ctx) {

    async onPublish({ path, message, messageClass, options }) {
      // todo: will be removed
      if (ctx.config.module(moduleInfo.relativeName).message.disabled) return;
      // path
      path = __PATH_MESSAGE_UNIFORM;
      // user
      const user = { id: message.userIdTo };
      // stats
      this._notify({ messageClass, user });
      // onPublish
      return await super.onPublish({ path, message, messageClass, options });
    }

    async onSetRead({ messageClass, messageIds, all, user }) {
      // stats
      if (messageClass) {
        this._notify({ messageClass, user });
      }
      // onPublish
      return await super.onSetRead({ messageClass, messageIds, all, user });
    }

    async onPushEnable(/* { options, message, messageSyncs, messageClass }*/) {
      return true;
    }

    async onChannels({ options, message, messageSync, messageClass }) {
      let channels = await super.onChannels({ options, message, messageSync, messageClass });
      if (!channels) {
        channels = ctx.config.module(moduleInfo.relativeName).socketio.message.push.channels;
      }
      return channels;
    }

    async onChannelRender({ channelFullName, options, message, messageSync, messageClass }) {
      // if (channelFullName === 'a-mail:mail') {
      //   return await this._onChannelRenderMail({ options, message, messageSync, messageClass });
      // }
      // // super
      // await super.onChannelRender({ channelFullName, options, message, messageSync, messageClass });
    }

    _notify({ messageClass, user }) {
      // stats
      ctx.bean.stats.notify({
        module: moduleInfo.relativeName,
        name: 'message',
        nameSub: `${messageClass.module}_${messageClass.messageClassName}`,
        user,
      });
    }

  }
  return IOMessageUniformBase;
};
