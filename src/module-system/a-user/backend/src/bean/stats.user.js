module.exports = ctx => {
  class Stats {

    async execute(context) {
      const { provider, user } = context;
      const dependencies = provider.dependencies;
      const res = { red: 0, orange: 0 };
      for (const dep of dependencies) {
        const [ module, fullName ] = dep.split(':');
        const value = await ctx.bean.stats._get({
          module, fullName, user,
        });
        if (dep === 'a-user:userRed') {
          res.red += value;
        } else if (dep === 'a-user:userOrange') {
          res.orange += value;
        } else if (dep === 'a-message:message') {
          if (value.red !== undefined) {
            res.red += value.red;
          }
          if (value.orange !== undefined) {
            res.orange += value.orange;
          }
          // ignore gray
        }
      }
      return res;
    }

  }

  return Stats;
};
