const flow_0 = require('./local.flow.flow/local.flow.flow_0.js');
const flow_assignees = require('./local.flow.flow/local.flow.flow_assignees.js');
const flow_endFlow = require('./local.flow.flow/local.flow.flow_endFlow.js');
const flow_nextEdges = require('./local.flow.flow/local.flow.flow_nextEdges.js');
const flow_message = require('./local.flow.flow/local.flow.flow_message.js');

module.exports = module.meta.util.mixinClasses(flow_0, [
  //
  flow_assignees,
  flow_endFlow,
  flow_nextEdges,
  flow_message,
]);
