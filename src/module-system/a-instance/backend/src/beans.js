const beanInstance = require('./bean/bean.instance.js');

module.exports = app => {
  const beans = {
    // global
    instance: {
      mode: 'ctx',
      bean: beanInstance,
      global: true,
    },
  };
  return beans;
};
