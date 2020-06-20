const onSocketEmit = require('./middleware/adapter/socketEmit.js');

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
      global: true,
      dependencies: 'instance',
    },
  };

  // queues
  config.queues = {
    registerMessageClass: {
      path: 'messageClass/queueRegister',
    },
    saveMessage: {
      path: 'io/queueSaveMessage',
      concurrency: true,
    },
    process: {
      path: 'io/queueProcess',
      concurrency: true,
    },
    delivery: {
      path: 'io/queueDelivery',
      concurrency: true,
    },
    push: {
      path: 'io/queuePush',
      concurrency: true,
    },
    pushDirect: {
      path: 'io/queuePushDirect',
      concurrency: true,
    },
  };

  // broadcasts
  config.broadcasts = {
    socketEmit: {
      callback: onSocketEmit,
    },
  };

  return config;
};
