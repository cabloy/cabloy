// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // queues
  config.queues = {
    cacheDbSet: {
      path: 'db/set',
    },
  };

  // broadcasts
  config.broadcasts = {
    memRemove: {
      path: 'broadcast/memRemove',
    },
    memClear: {
      path: 'broadcast/memClear',
    },
  };

  // db
  config.db = {
    redis: true,
  };

  return config;
};
