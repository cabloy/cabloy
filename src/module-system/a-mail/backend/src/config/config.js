// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // middlewares
  config.middlewares = {
    mail: {
      global: false,
      dependencies: 'instance',
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
      path: 'mail/schedulePushQueueInstance',
      instance: true,
      repeat: {
        every: 120 * 1000,
        // every: 5 * 1000,
      },
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
