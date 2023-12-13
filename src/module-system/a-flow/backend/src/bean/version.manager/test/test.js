module.exports = function (ctx) {
  // const moduleInfo = module.info;
  class VersionTest {
    async run(options) {
      // why add these test codes
      //   - for force flowHistory.id !== flow.id
      // flowHistory
      let res = await ctx.model.flowHistory.insert({});
      await ctx.model.flowHistory.delete({ id: res.insertId });
      // flowNodeHistory
      res = await ctx.model.flowNodeHistory.insert({});
      await ctx.model.flowNodeHistory.delete({ id: res.insertId });
    }
  }

  return VersionTest;
};
