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
    // broadcasts
    config.broadcasts = {
      broadcastTest: {
        path: 'test/feat/broadcast',
      },
    };
    // monkey
    config.monkeyed = false;
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

    // captcha scenes
    const _captchaSMS = {
      module: 'a-authsms',
      name: 'captcha',
    };
    config.captcha = {
      scenes: {
        formMobileVerifyTest: _captchaSMS,
        formCaptchaTest: null, // means using default
      // formCaptchaTest: {
      //   module: 'a-captchasimple',
      //   name: 'captcha',
      // },
      },
    };

  }


  return config;
};
