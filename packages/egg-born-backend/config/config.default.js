

module.exports = appInfo => {
  const config = {};

  // safe
  config.security = {
    csrf: {
      enable: false,
    },
  };

  return config;
};
