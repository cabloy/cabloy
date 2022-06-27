module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Stats {
    async execute(context) {
      const { user } = context;
      // user stats
      const statsUser = await ctx.bean.stats._get({
        module: moduleInfo.relativeName,
        fullName: 'user',
        user,
      });
      // message stats
      const statsMessage = await ctx.bean.stats._get({
        module: 'a-message',
        fullName: 'message',
        user,
      });
      const res = { red: 0, orange: 0 };
      return res;
    }
  }

  return Stats;
};
