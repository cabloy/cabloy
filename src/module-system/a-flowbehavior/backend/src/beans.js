const versionManager = require('./bean/version.manager.js');
const flowBehaviorOvertime = require('./bean/flow.behavior.overtime.js');
const queueOvertime = require('./bean/queue.overtime.js');

module.exports = {
  // version
  'version.manager': {
    bean: versionManager,
  },
  // flow behavior
  'flow.behavior.overtime': {
    bean: flowBehaviorOvertime,
  },
  // queue
  'queue.overtime': {
    bean: queueOvertime,
  },
};
