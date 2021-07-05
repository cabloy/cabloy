module.exports = ctx => {
  class Stats {

    async execute(context) {
      const { provider, user } = context;
      const dependencies = provider.dependencies;
      let count = 0;
      for (const dep of dependencies) {
        const [module, fullName] = dep.split(':');
        const value = await ctx.bean.stats._get({
          module, fullName, user,
        });
        if (value) {
          count += value;
        }
      }
      return count;
    }

  }

  return Stats;
};
