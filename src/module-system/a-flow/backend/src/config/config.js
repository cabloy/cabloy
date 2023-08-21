// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // summer
  config.summer = {
    caches: {
      modelFlow: {
        mode: 'redis', // only redis
        redis: {
          ttl: 2 * 60 * 60 * 1000, // 2 hours
        },
      },
      modelFlowHistory: {
        mode: 'redis', // only redis
        redis: {
          ttl: 2 * 60 * 60 * 1000, // 2 hours
        },
      },
      modelFlowNode: {
        mode: 'redis', // only redis
        redis: {
          ttl: 2 * 60 * 60 * 1000, // 2 hours
        },
      },
      modelFlowNodeHistory: {
        mode: 'redis', // only redis
        redis: {
          ttl: 2 * 60 * 60 * 1000, // 2 hours
        },
      },
    },
  };

  return config;
};
