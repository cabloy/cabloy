module.exports = app => {
  const socketioStats = require('./config/socketio/stats.js')(app);
  const meta = {
    socketio: {
      messages: {
        stats: socketioStats,
      },
    },
  };
  return meta;
};
