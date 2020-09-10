// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // middlewares
  config.middlewares = {
    connection: {
      bean: 'connection',
      type: 'socketio.connection',
    },
    packet: {
      bean: 'packet',
      type: 'socketio.packet',
    },
  };

  // queues
  config.queues = {
    registerMessageClass: {
      bean: 'registerMessageClass',
    },
    saveMessage: {
      bean: 'saveMessage',
      concurrency: true,
    },
    process: {
      bean: 'process',
      concurrency: true,
    },
    delivery: {
      bean: 'delivery',
      concurrency: true,
    },
    push: {
      bean: 'push',
      concurrency: true,
    },
    pushDirect: {
      bean: 'pushDirect',
      concurrency: true,
    },
  };

  // broadcasts
  config.broadcasts = {
    socketEmit: {
      bean: 'socketEmit',
    },
  };

  return config;
};
