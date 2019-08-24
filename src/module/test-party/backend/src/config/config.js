// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  if (appInfo.env === 'unittest') {
    // startups
    config.startups = {
      startupAll: {
        type: 'worker',
        path: 'test/feat/startup/all',
      },
      startupInstance: {
        type: 'worker',
        instance: true,
        path: 'test/feat/startup/instance',
      },
    };
    // middlewares
    config.middlewares = {
      testInterception: {
        global: false,
        dependencies: 'instance',
      },
      testRestructuring: {
        global: false,
        dependencies: 'instance',
      },
      testInjection: {
        global: false,
        dependencies: 'instance',
      },
    };
    // queues
    config.queues = {
      queueTest: {
        path: 'test/feat/queue',
      },
    };
  }

  if (appInfo.env === 'unittest' || appInfo.env === 'local') {

    // config
    config.message = 'Hello World';

    // settings
    config.settings = {
      instance: {
        groupInfo: {
          slogan: '',
        },
      },
      user: {
        groupInfo: {
          username: 'zhennann',
        },
        groupExtra: {
          panelExtra: {
            groupInfo: {
              mobile: '123',
              sex: 1,
              language: 'en-us',
            },
          },
        },
      },
    };
  }


  return config;
};
