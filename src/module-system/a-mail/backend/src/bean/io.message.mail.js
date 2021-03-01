module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
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
      return await super.onDelivery({ path, options, message, messageSync, messageClass });
    }

    async onChannelRender({ channelFullName, options, message, messageSync, messageClass }) {
      if (channelFullName === 'a-mail:mail') {
        return await this._onChannelRenderMail({ options, message, messageSync, messageClass });
      }
      // super
      return await super.onChannelRender({ channelFullName, options, message, messageSync, messageClass });
    }

    async _onChannelRenderMail({ message }) {
      const content = JSON.parse(message.content);
      const modelMail = ctx.model.module(moduleInfo.relativeName).mail;
      const mail = await modelMail.get({ id: content.mailId });
      return {
        scene: mail.scene,
        message: JSON.parse(mail.message),
      };
    }

  }
  return IOMessage;
};
