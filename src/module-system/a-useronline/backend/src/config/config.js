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
          ttl: 4 * 60 * 60 * 1000, // 4 hours
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
