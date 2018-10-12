// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // middlewares
  config.middlewares = {
    instance: {
      global: true,
      dependencies: 'cachemem',
      ignore: /(\/version\/(start|check|update|initModule)|\/a\/instance\/version\/init|\/a\/version\/version\/init)/,
    },
  };

  // cache
  config.cache = {
    timeout: 3 * 1000, // 3s
  };

  return config;
};
