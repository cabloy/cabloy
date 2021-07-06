module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Stats {
    async execute(context) {
      const { user } = context;
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
        const count = await ctx.bean.atom.count({
          options: {
            label: labelId,
          },
          user,
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
