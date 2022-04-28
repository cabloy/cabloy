module.exports = appInfo => {
  const config = {};

  // keys
  config.keys = appInfo.name + '_{{safeKeys}}';

  // disabledModules
  config.disabledModules = [];

  // disabledSuites
  config.disabledSuites = [];

  // subdomainOffset
  config.subdomainOffset = 2;

  // cookies
  config.cookies = {
    sameSite: 'none',
  };

  // i18n
  // config.i18n = {
  //   defaultLocale: 'zh-cn',
  // };

  return config;
};
