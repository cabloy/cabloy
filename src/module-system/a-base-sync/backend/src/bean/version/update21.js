module.exports = function (ctx) {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class VersionUpdate21 {
    async run() {
      await this._alterTables();
    }

    async _alterTables() {
      // aAtom: add atomState
      const sql = `
        ALTER TABLE aAtom
          ADD COLUMN atomState varchar(255) DEFAULT NULL
      `;
      await ctx.model.query(sql);
    }
  }

  return VersionUpdate21;
};
