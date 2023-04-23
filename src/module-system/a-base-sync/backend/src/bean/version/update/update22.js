module.exports = function (ctx) {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class VersionUpdate22 {
    async run() {
      const sql = `
        update aAtom set atomFlowId=0 where atomStage in (1,2)
      `;
      await ctx.model.query(sql);
    }
  }

  return VersionUpdate22;
};
