module.exports = app => {
  // const schemas = require('./config/validation/schemas.js')(app);
  // socketio
  const socketioProgress = require('./config/socketio/progress.js')(app);
  const meta = {
    base: {
      atoms: {
      },
      functions: {
      },
    },
    validation: {
      validators: {
      },
      keywords: {},
      schemas: {
      },
    },
    socketio: {
      messages: {
        progress: socketioProgress,
      },
    },
  };
  return meta;
};
