const flowTask_0 = require('./bean.flowTask/bean.flowTask_0.js');
const flowTask_1 = require('./bean.flowTask/bean.flowTask_1.js');
const flowTask_2 = require('./bean.flowTask/bean.flowTask_2.js');

module.exports = ctx => {
  return ctx.app.meta.util.mixinClasses(flowTask_0, [flowTask_1, flowTask_2], ctx);
};
