module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Stats {

    async execute(context) {
      const { keys, user } = context;
      const fullName = keys.join('.');
    }

  }

  return Stats;
};
