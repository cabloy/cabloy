module.exports = app => {
  // schemas
  const schemas = require('./config/validation/schemas.js')(app);
  // socketio
  const socketioMessageMail = require('./config/socketio/messageMail.js')(app);
  const socketioChannelMail = require('./config/socketio/channelMail.js')(app);
  // static
  const staticResources = require('./config/static/resources.js')(app);
  // meta
  const meta = {
    base: {
      atoms: {},
      statics: {
        'a-base.resource': {
          items: staticResources,
        },
      },
    },
    validation: {
      validators: {},
      keywords: {},
      schemas,
    },
    socketio: {
      messages: {
        mail: socketioMessageMail,
      },
      channels: {
        mail: socketioChannelMail,
      },
    },
  };
  return meta;
};
