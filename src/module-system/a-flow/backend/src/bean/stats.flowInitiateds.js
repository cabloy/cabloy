module.exports = ctx => {
  const moduleInfo = module.info;
  class Stats {
    async execute(context) {
      const { user } = context;
      const modelFlow = ctx.model.module(moduleInfo).flow;
      const count = await modelFlow.count({
        flowUserId: user.id,
      });
      return count;
    }
  }

  return Stats;
};
