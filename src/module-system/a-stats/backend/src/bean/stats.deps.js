module.exports = class Stats {
  async execute(context) {
    const { keys, provider, user } = context;
    const dependencies = provider.dependencies;
    let count = 0;
    for (const dep of dependencies) {
      const [module, name] = dep.split(':');
      const _keys = keys.slice(0);
      _keys.splice(0, 1, name);
      const fullName = _keys.join('.');
      const value = await this.ctx.bean.stats._get({
        module,
        name,
        fullName,
        user,
      });
      if (value) {
        count += value;
      }
    }
    return count;
  }
};
