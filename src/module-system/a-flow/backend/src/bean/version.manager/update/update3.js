module.exports = function SelfFactory(ctx) {
  // const moduleInfo = module.info;
  class VersionUpdate {
    async run(options) {
      let sql;

      // alter table: aFlowNode
      sql = `
        ALTER TABLE aFlowNode
          ADD COLUMN behaviorDefId varchar(255) DEFAULT '' 
                  `;
      await ctx.model.query(sql);

      // alter table: aFlowNodeHistory
      sql = `
        ALTER TABLE aFlowNodeHistory
          ADD COLUMN behaviorDefId varchar(255) DEFAULT ''
                  `;
      await ctx.model.query(sql);
    }
  }

  return VersionUpdate;
};
