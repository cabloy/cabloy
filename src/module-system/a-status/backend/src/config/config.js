// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // summer
  config.summer = {
    caches: {
      modelStatus: {
        mode: 'redis', // only redis
        // mem: {
        //   max: 500,
        // },
        redis: {
          ttl: 2 * 60 * 60 * 1000, // 2 hours
        },
      },
    },
  };

  return config;
};
