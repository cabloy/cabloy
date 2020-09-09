const queueSubmit = require('./bean/queue.submit.js');

module.exports = app => {
  const beans = {
    // queue
    'queue.submit': {
      mode: 'ctx',
      bean: queueSubmit,
    },
  };
  return beans;
};
