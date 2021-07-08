module.exports = function (ctx) {
  class VersionUpdate11 {
    async run() {
      // aAtom: add atomSimple
      const sql = `
        ALTER TABLE aAtom
          ADD COLUMN atomSimple int(11) DEFAULT '0'
                  `;
      await ctx.model.query(sql);
    }
  }

  return VersionUpdate11;
};
