const flow_0 = require('./local.flow.flow/local.flow.flow_0.js');
const flow_assignees = require('./local.flow.flow/local.flow.flow_assignees.js');
const flow_endFlow = require('./local.flow.flow/local.flow.flow_endFlow.js');

module.exports = ctx => {
  return ctx.app.meta.util.mixinClasses(
    flow_0,
    [
      //
      flow_assignees,
      flow_endFlow,
    ],
    ctx
  );
};
