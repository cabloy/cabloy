const beanEvent = require('./bean/bean.event.js');

module.exports = app => {
  const beans = {
    // global
    event: {
      mode: 'ctx',
      bean: beanEvent,
      global: true,
    },
  };
  return beans;
};
