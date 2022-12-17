module.exports = ctx => {
  class Stats {
    async execute(context) {
      const { keys, provider, user } = context;
      const dependencies = provider.dependencies;
      let count = 0;
      for (const dep of dependencies) {
        const [module, name] = dep.split(':');
        const value = await ctx.bean.stats._get({
          module,
          name,
          user,
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
