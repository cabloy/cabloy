module.exports = ctx => {
  class FlowService extends ctx.app.meta.FlowServiceBase {
    async execute(context) {
      // parameter
      const parameter = context.parameter;
      // set var
      context.contextNode.vars.set('echo', parameter);
      // return
      return parameter;
    }
  }
  return FlowService;
};
