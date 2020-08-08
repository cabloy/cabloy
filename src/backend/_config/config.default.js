module.exports = appInfo => {
  const config = {};

  // keys
  config.keys = appInfo.name + '_1596889047267_3245';

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
