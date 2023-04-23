module.exports = function (ctx) {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class VersionUpdate25 {
    async run() {
      // aAtomClass: drop atomClassInner
      const sql = `
        ALTER TABLE aAtomClass
          DROP COLUMN atomClassInner
                  `;
      await ctx.model.query(sql);
    }
  }

  return VersionUpdate25;
};
