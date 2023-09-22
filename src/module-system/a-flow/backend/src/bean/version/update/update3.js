module.exports = function SelfFactory(ctx) {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class VersionUpdate3 {
    async run(options) {
      let sql;

      // alter table: aFlowNode
      sql = `
        ALTER TABLE aFlowNode
          ADD COLUMN behaviorDefId varchar(255) DEFAULT '' 
                  `;
      await this.ctx.model.query(sql);

      // alter table: aFlowNodeHistory
      sql = `
        ALTER TABLE aFlowNodeHistory
          ADD COLUMN behaviorDefId varchar(255) DEFAULT ''
                  `;
      await this.ctx.model.query(sql);
    }
  }

  return VersionUpdate3;
};
