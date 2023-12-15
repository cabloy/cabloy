module.exports = class Stats {
  async execute(context) {
    const { provider, user } = context;
    const dependencies = provider.dependencies;
    const res = { red: 0, orange: 0 };
    for (const dep of dependencies) {
      const [module, fullName] = dep.split(':');
      const value = await this.ctx.bean.stats._get({
        module,
        fullName,
        user,
      });
      // value maybe undefined
      if (!value) continue;
      if (dep === 'a-user:userRed') {
        res.red += value;
      } else if (dep === 'a-user:userOrange') {
        res.orange += value;
      } else {
        // e.g. dep === 'a-message:message' || dep === 'a-base:starsLabels'
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
};
