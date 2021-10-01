const flowTask_0 = require('./local.flow.task/local.flow.task_0.js');
const flowTask_claim = require('./local.flow.task/local.flow.task_claim.js');
const flowTask_complete = require('./local.flow.task/local.flow.task_complete.js');

module.exports = ctx => {
  return ctx.app.meta.util.mixinClasses(flowTask_0, [flowTask_claim, flowTask_complete], ctx);
};
