// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // startups
  config.startups = {
    cacheReset: {
      bean: 'cacheReset',
      instance: true,
    },
  };

  // broadcasts
  config.broadcasts = {
    memRemove: {
      bean: 'memRemove',
    },
    memClear: {
      bean: 'memClear',
    },
  };

  // db
  config.db = {
    redis: true,
  };

  return config;
};
