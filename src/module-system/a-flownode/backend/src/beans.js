const versionManager = require('./bean/version.manager.js');
const queueStartEventTimer = require('./bean/queue.startEventTimer.js');
const flowEdgeSequence = require('./bean/flow.edge.sequence.js');
const flowNodeStartEventNone = require('./bean/flow.node.startEventNone.js');
const flowNodeStartEventTimer = require('./bean/flow.node.startEventTimer.js');
const flowNodeEndEventNone = require('./bean/flow.node.endEventNone.js');
const flowNodeActivityNone = require('./bean/flow.node.activityNone.js');
const flowNodeActivityService = require('./bean/flow.node.activityService.js');

module.exports = {
  // version
  'version.manager': {
    bean: versionManager,
  },
  // queue
  'queue.startEventTimer': {
    bean: queueStartEventTimer,
  },
  // flow
  'flow.edge.sequence': {
    bean: flowEdgeSequence,
  },
  'flow.node.startEventNone': {
    bean: flowNodeStartEventNone,
  },
  'flow.node.startEventTimer': {
    bean: flowNodeStartEventTimer,
  },
  'flow.node.endEventNone': {
    bean: flowNodeEndEventNone,
  },
  'flow.node.activityNone': {
    bean: flowNodeActivityNone,
  },
  'flow.node.activityService': {
    bean: flowNodeActivityService,
  },
};
