// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // summer
  config.summer = {
    caches: {
      modelUserOnline: {
        bean: null,
        mode: 'all',
        mem: {
          max: 500,
        },
        redis: {
          ttl: 10 * 60 * 1000, // 10 minutes
        },
      },
    },
  };

  // userOnline
  config.userOnline = {
    expired: 20 * 60 * 1000, // 20 minutes
  };
  return config;
};
