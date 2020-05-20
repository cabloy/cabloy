// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // middlewares
  config.middlewares = {
    connection: {
      type: 'socketio.connection',
    },
    test: {
      type: 'socketio.connection',
    },
  };

  return config;
};
