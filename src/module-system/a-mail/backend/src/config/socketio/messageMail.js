const modelMailFn = require('../../model/mail.js');

module.exports = app => {
  async function onRender({ ctx, message }) {
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
    },
    channels: {
      'a-mail:mail': {
        onRender,
      },
    },
  };
  return MessageMail;
};
