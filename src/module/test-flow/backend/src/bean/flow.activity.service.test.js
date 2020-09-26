module.exports = ctx => {
  class ActivityService {
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
