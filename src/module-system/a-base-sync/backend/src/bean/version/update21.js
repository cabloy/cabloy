module.exports = function (ctx) {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class VersionUpdate21 {
    async run() {
      await this._alterTables();
    }

    async _alterTables() {
      // aAtom: add atomState, default value is null
      let sql = `
        ALTER TABLE aAtom
          ADD COLUMN atomState varchar(255) DEFAULT NULL
      `;
      await ctx.model.query(sql);
      // aAtomAction: for workflow
      //   actionMode: 0/default 1/workflow
      sql = `
        ALTER TABLE aAtomAction
          ADD COLUMN actionMode int(11) DEFAULT '0',
          ADD COLUMN flowKey varchar(50) DEFAULT NULL,
          ADD COLUMN nodeDefId varchar(50) DEFAULT NULL,
          ADD COLUMN nodeDefName varchar(255) DEFAULT NULL
      `;
      await ctx.model.query(sql);
    }
  }

  return VersionUpdate21;
};
