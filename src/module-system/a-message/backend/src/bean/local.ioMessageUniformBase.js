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
      if (channelFullName === 'a-mail:mail') {
        return await this._onChannelRenderMail({ options, message, messageSync, messageClass });
      }
      // super
      return await super.onChannelRender({ channelFullName, options, message, messageSync, messageClass });
    }

    async _onChannelRenderMail({ message, messageSync }) {
      // user
      const userId = messageSync.userId;
      const user = await ctx.bean.user.get({ id: userId });
      if (!user) {
        ctx.logger.info('not found user:', userId);
        return null;
      }
      let to = user.email;
      if (!to && (ctx.app.meta.isTest || ctx.app.meta.isLocal)) {
        to = `${user.userName}@test.com`;
      }
      if (!to) return null;
      // content
      const content = JSON.parse(message.content);
      // message
      const _message = {
        to,
        subject: content.title,
        text: content.body,
      };
      // ok
      return {
        scene: null, // use default
        message: _message,
      };
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
