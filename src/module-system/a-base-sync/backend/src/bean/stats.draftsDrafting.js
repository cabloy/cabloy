module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Stats {
    async execute(context) {
      const { user } = context;
      const modelAtom = ctx.model.module(moduleInfo.relativeName).atom;
      const count = await modelAtom.count({
        userIdUpdated: user.id,
        atomStage: 0,
        atomClosed: 0,
        atomFlowId: 0,
      });
      return count;
    }
  }

  return Stats;
};
