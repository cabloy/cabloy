const queueSubmit = require('./bean/queue.submit.js');
const localTools = require('./bean/local.tools.js');

module.exports = {
  // queue
  'queue.submit': {
    bean: queueSubmit,
  },
  // local
  'local.tools': {
    bean: localTools,
  },
};
