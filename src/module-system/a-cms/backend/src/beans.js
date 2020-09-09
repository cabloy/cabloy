const queueRender = require('./bean/queue.render.js');

module.exports = app => {
  const beans = {
    // queue
    'queue.render': {
      mode: 'ctx',
      bean: queueRender,
    },
  };
  return beans;
};
