const beanSequence = require('./bean/bean.sequence.js');

module.exports = app => {
  const beans = {
    // global
    sequence: {
      mode: 'ctx',
      bean: beanSequence,
      global: true,
    },
  };
  return beans;
};
