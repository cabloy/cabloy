module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Stats {

    async execute(context) {
      const { user } = context;
      const modelAtomLabelRef = ctx.model.module(moduleInfo.relativeName).atomLabelRef;
      // root stats
      const statsRoot = { };
      // userLabels
      const userLabels = await ctx.bean.atom.getLabels({ user });
      for (const labelId of Object.keys(userLabels)) {
        const userLabel = userLabels[labelId];
        const count = await modelAtomLabelRef.count({
          userId: user.id,
          labelId,
        });
      }

      return count;
    }

  }

  return Stats;
};
