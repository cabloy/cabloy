// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // middleware disableVersionCheck
  config.disableVersionCheck = {
    enable: true,
    match: /\/version\//,
  };

  return config;
};
