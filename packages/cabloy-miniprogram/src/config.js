const configDefault = {
  base: {
    providerScene: 'default',
    locale: 'en-us',
  },
  api: {
    baseURL: '',
  },
  locales: {
    'en-us': 'English',
    'zh-cn': 'Chinese',
  },
};

module.exports = function (cabloy, options) {
  return cabloy.util.extend({}, configDefault, options);
};
