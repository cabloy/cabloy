module.exports = appInfo => {
  const config = {};

  // keys
  config.keys = appInfo.name + '_{{keys}}';

  return config;
};
