const beanStatus = require('./bean/bean.status.js');
const queueStatusSet = require('./bean/queue.statusSet.js');

module.exports = app => {
  const beans = {
    // queue
    'queue.statusSet': {
      mode: 'ctx',
      bean: queueStatusSet,
    },
    // global
    status: {
      mode: 'ctx',
      bean: beanStatus,
      global: true,
    },
  };
  return beans;
};
