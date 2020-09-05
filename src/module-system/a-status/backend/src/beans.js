const beanStatus = require('./bean/bean.status.js');

module.exports = app => {
  const beans = {
    // global
    status: {
      mode: 'ctx',
      bean: beanStatus,
      global: true,
    },
  };
  return beans;
};
