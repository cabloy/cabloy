module.exports = function SelfFactory(ctx) {
  // const moduleInfo = module.info;
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
