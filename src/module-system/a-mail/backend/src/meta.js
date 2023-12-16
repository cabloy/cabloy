module.exports = app => {
  const schemas = require('./meta/validation/schemas.js');
  // socketio
  const socketioMessageMail = require('./meta/socketio/messageMail.js');
  const socketioChannelMail = require('./meta/socketio/channelMail.js');
  // static
  const staticResources = require('./meta/static/resources.js');
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
