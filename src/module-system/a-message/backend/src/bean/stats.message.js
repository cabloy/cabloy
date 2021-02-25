module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
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
