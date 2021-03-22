module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Stats {

    async execute(context) {
      const { user } = context;
      const modelAtomLabelRef = ctx.model.module(moduleInfo.relativeName).atomLabelRef;
      const count = await modelStar.count({
        userId: user.id,
        star: 1,
      });
      return count;
    }

  }

  return Stats;
};
