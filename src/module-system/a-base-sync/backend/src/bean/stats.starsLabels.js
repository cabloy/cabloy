module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Stats {

    async execute(context) {
      const { user } = context;
      // stats
      let stats;
      // labels
      stats = await ctx.bean.stats._get({
        module: moduleInfo.relativeName,
        fullName: 'labels',
        user,
      });
      if (!stats) {
        stats = {
          red: 0,
          orange: 0,
        };
      }
      // stars
      const stars = await ctx.bean.stats._get({
        module: moduleInfo.relativeName,
        fullName: 'stars',
        user,
      });
      stats.gray = stars || 0;
      // ok
      return stats;
    }

  }

  return Stats;
};
