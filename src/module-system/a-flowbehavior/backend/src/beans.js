const versionManager = require('./bean/version.manager.js');
const flowBehaviorOvertime = require('./bean/flow.behavior.overtime.js');

module.exports = app => {
  const beans = {
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
  };
  return beans;
};
