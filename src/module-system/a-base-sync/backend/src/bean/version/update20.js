module.exports = function (ctx) {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class VersionUpdate20 {
    async run() {
      await this._alterTables();
    }

    async _alterTables() {
      // aAtom: add atomAreaKey atomAreaValue
      let sql = `
        ALTER TABLE aAtom
          ADD COLUMN atomAreaKey varchar(255) DEFAULT NULL,
          ADD COLUMN atomAreaValue varchar(255) DEFAULT NULL
      `;
      await ctx.model.query(sql);

      // aRoleRight: add areaKey areaScope
      sql = `
        ALTER TABLE aRoleRight
          ADD COLUMN areaKey varchar(255) DEFAULT NULL,
          ADD COLUMN areaScope varchar(255) DEFAULT NULL
      `;
      await ctx.model.query(sql);

      // aRoleRightRef: add areaKey areaScope
      sql = `
        ALTER TABLE aRoleRightRef
          ADD COLUMN areaKey varchar(255) DEFAULT NULL,
          ADD COLUMN areaScope varchar(255) DEFAULT NULL
      `;
      await ctx.model.query(sql);
    }
  }

  return VersionUpdate20;
};
