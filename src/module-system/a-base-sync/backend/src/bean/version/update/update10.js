module.exports = function (ctx) {
  class VersionUpdate10 {
    async run() {
      // aAtom: atomIdArchive -> atomIdFormal
      const sql = `
        ALTER TABLE aAtom
          CHANGE COLUMN atomIdArchive atomIdFormal int(11) DEFAULT '0'
                  `;
      await ctx.model.query(sql);
    }
  }

  return VersionUpdate10;
};
