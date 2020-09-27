module.exports = ctx => {
  class FlowService extends ctx.app.meta.FlowServiceBase {
    async execute(context) {
      // parameter
      const { flowDefId, parameter, node } = context.parameter;
      // start
      await ctx.bean.flow.startById({
        flowDefId,
        flowVars: parameter,
        flowUserId: 1,
        startEventId: node.id,
      });
    }
  }
  return FlowService;
};
