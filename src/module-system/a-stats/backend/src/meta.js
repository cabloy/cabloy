module.exports = app => {
  const socketioStats = require('./meta/socketio/stats.js')(app);
  const meta = {
    socketio: {
      messages: {
        stats: socketioStats,
      },
    },
  };
  return meta;
};
