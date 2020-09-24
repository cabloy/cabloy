const versionManager = require('./bean/version.manager.js');
const flowEdgeSequence = require('./bean/flow.edge.sequence.js');
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
    'flow.edge.sequence': {
      mode: 'ctx',
      bean: flowEdgeSequence,
    },
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
