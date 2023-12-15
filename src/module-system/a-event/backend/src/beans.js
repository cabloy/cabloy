const beanEvent = require('./bean/bean.event.js');

module.exports = {
  // global
  event: {
    mode: 'ctx',
    bean: beanEvent,
    global: true,
  },
};
