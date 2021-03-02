// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // disabled
  config.message = {
    disabled: true,
  };

  // socketio
  config.socketio = {
    message: {
      push: {
        channels: [ 'a-mail:mail' ],
      },
      render: {
        templates: {
          'a-mail:mail': {
            subject: 'uniformMessageRenderTemplateMailSubject',
            body: 'uniformMessageRenderTemplateMailBody',
          },
        },
      },
    },
  };

  return config;
};
