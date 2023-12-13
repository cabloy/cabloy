const __PATH_MESSAGE_UNIFORM = '/a/message/uniform';

module.exports = ctx => {
  const moduleInfo = module.info;
  class IOMessageUniformBase extends ctx.app.meta.IOMessageBase(ctx) {
    async onPublish({ /* path,*/ message, messageClass, options }) {
      // onPublish
      return await super.onPublish({ path: __PATH_MESSAGE_UNIFORM, message, messageClass, options });
    }

    async onSaveSync({ path, options, message, messageSync, messageClass }) {
      if (messageSync.userId > 0 && messageSync.messageDirection === 2) {
        // user
        const user = { id: messageSync.userId };
        // stats
        this._notify({ messageClass, user });
      }
      return await super.onSaveSync({ path, options, message, messageSync, messageClass });
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
        return await this._onChannelRenderMail({ channelFullName, options, message, messageSync, messageClass });
      }
      // super
      return await super.onChannelRender({ channelFullName, options, message, messageSync, messageClass });
    }

    async _onChannelRenderMail({ channelFullName, message, messageSync }) {
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
      // link
      const link = ctx.bean.base.getAbsoluteUrl(`/#!/a/message/autojump?id=${message.id}`);
      // scope
      const scope = {
        user,
        message,
        content,
        info: {
          link,
          siteName: ctx.instance.title,
        },
      };
      // config
      const configTemplate = ctx.config.module(moduleInfo.relativeName).socketio.message.render.templates[
        channelFullName
      ];
      // subject
      let subject = ctx.text.locale(user.locale, configTemplate.subject);
      subject = ctx.bean.util.replaceTemplate(subject, scope);
      // body
      let body = ctx.text.locale(user.locale, configTemplate.body);
      body = ctx.bean.util.replaceTemplate(body, scope);
      // message
      const _message = {
        to,
        subject,
        text: body,
      };
      // ok
      return {
        scene: null, // use default
        message: _message,
      };
    }

    _notify({ messageClass, user }) {
      if (user.id <= 0) return;
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
