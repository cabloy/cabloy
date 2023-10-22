module.exports = app => {
  // const schemas = require('./meta/validation/schemas.js')(app);
  // socketio
  const socketioProgress = require('./meta/socketio/progress.js')(app);
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
        progress: socketioProgress,
      },
    },
  };
  return meta;
};
