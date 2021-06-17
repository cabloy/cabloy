module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Stats {

    async execute(context) {
      const { user } = context;
      const count = await ctx.bean.atom.count({
        options: {
          star: 1,
        },
        user,
      });
      return count;
    }

  }

  return Stats;
};
