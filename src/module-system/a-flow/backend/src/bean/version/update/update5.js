module.exports = function SelfFactory(ctx) {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class VersionUpdate5 {
    async run(options) {
      let sql;

      // alter table: aFlow
      sql = `
        ALTER TABLE aFlow
          ADD COLUMN flowAtomClassId int(11) DEFAULT '0'
                  `;
      await this.ctx.model.query(sql);

      // alter table: aFlowHistory
      sql = `
        ALTER TABLE aFlowHistory
          ADD COLUMN flowAtomClassId int(11) DEFAULT '0'
                  `;
      await this.ctx.model.query(sql);
    }
  }

  return VersionUpdate5;
};
