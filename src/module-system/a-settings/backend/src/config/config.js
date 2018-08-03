// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // middlewares
  config.middlewares = {
    settings: {
      global: true,
      dependencies: 'validation',
    },
  };

  // schedules
  config.schedules = {
  };

  // settings
  config.settings = {
    instance: {
      info: {
        title: 'title1',
      },
    },
    user: {
      info: {
        username: 'zhennann',
      },
      extra: {
        extra: {
          info: {
            mobile: '1',
            sex: 1,
            language: 'en-us',
          },
        },
      },
    },
  };

  return config;
};
