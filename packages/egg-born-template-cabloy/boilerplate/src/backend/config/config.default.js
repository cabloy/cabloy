module.exports = appInfo => {
  const config = {};

  // keys
  config.keys = appInfo.name + '_{{keys}}';

  // subdomainOffset
  config.subdomainOffset = 2;

  // i18n
  // config.i18n = {
  //   defaultLocale: 'zh-cn',
  // };

  return config;
};
