const versionManager = require('./bean/version.manager.js');
const flowBehaviorOvertime = require('./bean/flow.behavior.overtime.js');
const queueOvertime = require('./bean/queue.overtime.js');

module.exports = {
  // version
  'version.manager': {
    mode: 'app',
    bean: versionManager,
  },
  // flow behavior
  'flow.behavior.overtime': {
    mode: 'ctx',
    bean: flowBehaviorOvertime,
  },
  // queue
  'queue.overtime': {
    mode: 'app',
    bean: queueOvertime,
  },
};
