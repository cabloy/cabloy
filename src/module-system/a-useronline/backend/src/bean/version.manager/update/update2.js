module.exports = function SelfFactory(ctx) {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class VersionUpdate {
    async run(options) {
      // aAtom: drop atomId
      const sql = `
        ALTER TABLE aUserOnlineHistory
          DROP COLUMN atomId
      `;
      await ctx.model.query(sql);
    }
  }

  return VersionUpdate;
};
