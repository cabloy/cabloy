// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // middlewares
  config.middlewares = {
    connection: {
      bean: 'connection',
      type: 'socketio.connection',
      dependencies: 'connectionAuth',
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

  // message
  config.message = {
    sync: {
      saveLimit: 20,
    },
  };

  return config;
};
