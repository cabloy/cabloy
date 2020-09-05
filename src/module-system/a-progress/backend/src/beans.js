const beanProgress = require('./bean/bean.progress.js');

module.exports = app => {
  const beans = {
    // global
    progress: {
      mode: 'ctx',
      bean: beanProgress,
      global: true,
    },
  };
  return beans;
};
