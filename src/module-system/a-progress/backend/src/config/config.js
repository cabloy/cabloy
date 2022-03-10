// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // middlewares
  config.middlewares = {};

  // progress
  config.progress = {
    expireTime: 1 * 3600 * 1000, // default is one hour
  };

  return config;
};
