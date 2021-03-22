module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Stats {

    async execute(context) {
      const { user } = context;
      const modelAtomLabelRef = ctx.model.module(moduleInfo.relativeName).atomLabelRef;
      // root stats
      const statsRoot = {
        red: 0,
        orange: 0,
      };
      // userLabels
      const userLabels = await ctx.bean.atom.getLabels({ user });
      for (const labelId of Object.keys(userLabels)) {
        const userLabel = userLabels[labelId];
        // sub
        const count = await modelAtomLabelRef.count({
          userId: user.id,
          labelId,
        });
        await ctx.bean.stats._set({
          module: moduleInfo.relativeName,
          name: 'labels',
          fullName: `labels.${labelId}`,
          value: count,
          user,
        });
        // root
        if (userLabel.color === 'red') {
          statsRoot.red += count;
        } else if (userLabel.color === 'orange') {
          statsRoot.orange += count;
        }
      }
      // ok
      return statsRoot;
    }

  }

  return Stats;
};
