// const schemas = require('./meta/validation/schemas.js');
// socketio
const socketioProgress = require('./meta/socketio/progress.js');
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
module.exports = meta;
