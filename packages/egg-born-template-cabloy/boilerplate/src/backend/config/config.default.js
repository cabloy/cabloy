module.exports = appInfo => {
  const config = {};

  // keys
  config.keys = appInfo.name + '_{{keys}}';

  // info
  config.pageSize = 20;

  // module config
  config.modules = {
  };

  // model
  config.model = {
    disableDeleted: false,
    disableInstance: false,
  };

  // session
  config.session = {
    key: 'CABLOY_SESS',
    httpOnly: true,
    encrypt: true,
  };

  return config;
};
