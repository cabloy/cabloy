module.exports = ctx => {
  class Stats {

    async execute(context) {
      const { provider, user } = context;
      const dependencies = provider.dependencies;
      const res = {};
      for (const dep of dependencies) {
        const [ module, fullName ] = dep.split(':');
        const value = await ctx.bean.stats._get({
          module, fullName, user,
        });
        if (dep === 'a-user:userRed') {
          res.red = value;
        } else if (dep === 'a-user:userOrange') {
          res.orange = value;
        }
      }
      return res;
    }

  }

  return Stats;
};
