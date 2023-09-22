module.exports = function (ctx) {
  class VersionTest {
    async run(options) {
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
