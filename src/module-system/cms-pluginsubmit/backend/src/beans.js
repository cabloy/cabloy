const queueSubmit = require('./bean/queue.submit.js');

module.exports = app => {
  const beans = {
    // queue
    'queue.submit': {
      mode: 'app',
      bean: queueSubmit,
    },
  };
  return beans;
};
