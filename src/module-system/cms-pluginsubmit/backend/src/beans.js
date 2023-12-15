const queueSubmit = require('./bean/queue.submit.js');
const localTools = require('./bean/local.tools.js');

module.exports = {
  // queue
  'queue.submit': {
    mode: 'app',
    bean: queueSubmit,
  },
  // local
  'local.tools': {
    mode: 'ctx',
    bean: localTools,
  },
};
