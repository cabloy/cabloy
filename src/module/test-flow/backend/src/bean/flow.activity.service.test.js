module.exports = ctx => {
  class ActivityService extends ctx.app.meta.FlowActivityServiceBase {
    async execute(context) {
      // parameter
      const parameter = context.parameter;
      // set var
      context.contextNode.vars.set('echo', parameter);
      // return
      return parameter;
    }
  }
  return ActivityService;
};
