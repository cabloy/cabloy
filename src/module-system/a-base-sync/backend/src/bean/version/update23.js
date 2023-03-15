module.exports = function (ctx) {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class VersionUpdate23 {
    async run() {
      // aAtomClass: drop atomClassIdParent
      const sql = `
        ALTER TABLE aAtomClass
          DROP COLUMN atomClassIdParent
                  `;
      await ctx.model.query(sql);
    }
  }

  return VersionUpdate23;
};
