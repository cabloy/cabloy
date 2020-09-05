const beanSettings = require('./bean/bean.settings.js');

module.exports = app => {
  const beans = {
    // global
    settings: {
      mode: 'ctx',
      bean: beanSettings,
      global: true,
    },
  };
  return beans;
};
