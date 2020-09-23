const versionManager = require('./bean/version.manager.js');
const flowNodeStartEventNone = require('./bean/flow.node.startEventNone.js');
const flowNodeEndEventNone = require('./bean/flow.node.endEventNone.js');

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // flow
    'flow.node.startEventNone': {
      mode: 'ctx',
      bean: flowNodeStartEventNone,
    },
    'flow.node.endEventNone': {
      mode: 'ctx',
      bean: flowNodeEndEventNone,
    },
  };
  return beans;
};
