module.exports = app => {
  const schemas = require('./config/validation/schemas.js')(app);
  // socketio
  const socketioMessageSystem = require('./config/socketio/messageSystem.js')(app);
  const meta = {
    base: {
      atoms: {},
    },
    validation: {
      validators: {},
      keywords: {},
      schemas: {},
    },
    socketio: {
      messages: {
        messageSystem: socketioMessageSystem,
      },
    },
  };
  return meta;
};
