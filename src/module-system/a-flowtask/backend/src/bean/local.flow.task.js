const flowTask_0 = require('./local.flow.task/local.flow.task_0.js');
const flowTask_claim = require('./local.flow.task/local.flow.task_claim.js');
const flowTask_complete = require('./local.flow.task/local.flow.task_complete.js');
const flowTask_event = require('./local.flow.task/local.flow.task_event.js');
const flowTask_schema = require('./local.flow.task/local.flow.task_schema.js');

module.exports = ctx => {
  return ctx.app.meta.util.mixinClasses(
    flowTask_0,
    [flowTask_claim, flowTask_complete, flowTask_event, flowTask_schema],
    ctx
  );
};
