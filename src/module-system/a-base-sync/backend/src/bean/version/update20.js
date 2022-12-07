module.exports = function (ctx) {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class VersionUpdate20 {
    async run() {
      // aAtom: add atomAreaKey atomAreaValue
      const sql = `
        ALTER TABLE aAtom
          ADD COLUMN atomAreaKey varchar(255) DEFAULT NULL,
          ADD COLUMN atomAreaValue varchar(255) DEFAULT NULL
      `;
      await ctx.model.query(sql);
    }
  }

  return VersionUpdate20;
};
