// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // middlewares
  config.middlewares = {
    mail: {
      global: false,
    },
  };

  // queues
  config.queues = {
    send: {
      path: 'mail/queueSend',
    },
  };

  // schedules
  config.schedules = {
    pushQueue: {
      type: 'worker',
      path: 'mail/schedulePushQueueInstance',
      instance: true,
      interval: '120s',
      // interval: '5s',
    },
  };

  // scenes
  config.scenes = {
    system: {
      transport: {
        host: '',
        port: 0,
        secure: false,
        auth: {
          user: '',
          pass: '',
        },
        logger: false,
        debug: false,
      },
      defaults: {
        from: '',
      },
    },
  };

  return config;
};
