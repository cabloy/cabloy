// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // queues
  config.queues = {
    stats: {
      bean: 'stats',
    },
  };

  // summer
  config.summer = {
    caches: {
      modelStats: {
        mode: 'redis', // only redis
        // mem: {
        //   max: 500,
        // },
        redis: {
          ttl: 4 * 60 * 60 * 1000, // 4 hours
        },
      },
    },
  };

  return config;
};
