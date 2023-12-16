module.exports = app => {
  const socketioStats = require('./meta/socketio/stats.js');
  const meta = {
    socketio: {
      messages: {
        stats: socketioStats,
      },
    },
  };
  return meta;
};
