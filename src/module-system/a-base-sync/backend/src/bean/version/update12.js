module.exports = function (ctx) {
  class VersionUpdate12 {
    async run() {
      // aAtomClass: add atomClassInner
      const sql = `
        ALTER TABLE aAtomClass
          ADD COLUMN atomClassInner int(11) DEFAULT '0'
                  `;
      await ctx.model.query(sql);
    }
  }

  return VersionUpdate12;
};
