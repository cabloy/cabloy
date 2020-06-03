const modelMailFn = require('../../model/mail.js');

module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  async function onCheck({ io, ctx, path, message, options, user }) {
    // only by system
    return user.id === 0;
  }

  async function onRender({ io, ctx, options, message, messageSync, messageClass }) {
    const content = JSON.parse(message.content);
    const modelMail = new (modelMailFn(ctx.app))(ctx);
    const mail = await modelMail.get({ id: content.mailId });
    return {
      scene: mail.scene,
      message: JSON.parse(mail.message),
    };
  }

  const MessageMail = {
    info: {
      title: 'Mail',
      persistence: false,
      push: {
        channels: [ 'a-mail:mail' ],
      },
    },
    callbacks: {
      onCheck,
    },
    channels: {
      'a-mail:mail': {
        onRender,
      },
    },
  };
  return MessageMail;
};
