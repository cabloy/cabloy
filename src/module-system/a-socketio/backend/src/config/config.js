// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // middlewares
  config.middlewares = {
    connection: {
      type: 'socketio.connection',
    },
    packet: {
      type: 'socketio.packet',
    },
    io: {
      global: false,
      dependencies: 'instance',
    },
  };

  // queues
  config.queues = {
    registerMessageClass: {
      path: 'messageClass/register',
    },
  };

  return config;
};
