// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  if (appInfo.env === 'unittest') {
    // startups
    config.startups = {
      startupAll: {
        path: 'test/feat/startup/all',
      },
      startupInstance: {
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
    };
    // queues
    config.queues = {
      queueTest: {
        bean: 'test',
      },
    };
    // broadcasts
    config.broadcasts = {
      broadcastTest: {
        bean: 'test',
      },
    };
    // monkey
    config.monkeyed = false;
  }

  if (appInfo.env === 'unittest' || appInfo.env === 'local') {

    // config
    config.message = 'Hello World';

    // schedules
    config.schedules = {
      test: {
        bean: 'test',
        instance: true,
        repeat: {
          every: 3000,
        },
        disable: true,
      },
    };

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
