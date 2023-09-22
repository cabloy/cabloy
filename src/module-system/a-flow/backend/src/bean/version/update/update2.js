module.exports = function SelfFactory(ctx) {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class VersionUpdate {
    async run(options) {
      let sql;

      // alter table: aFlow
      sql = `
        ALTER TABLE aFlow
          ADD COLUMN flowHandleStatus int(11) DEFAULT '0'
                  `;
      await ctx.model.query(sql);

      // alter table: aFlowHistory
      sql = `
        ALTER TABLE aFlowHistory
          ADD COLUMN flowHandleStatus int(11) DEFAULT '0'
                  `;
      await ctx.model.query(sql);

      // alter table: aFlowNode
      sql = `
        ALTER TABLE aFlowNode
          ADD COLUMN flowNodeHandleStatus int(11) DEFAULT '0'
                  `;
      await ctx.model.query(sql);

      // alter table: aFlowNodeHistory
      sql = `
        ALTER TABLE aFlowNodeHistory
          ADD COLUMN flowNodeHandleStatus int(11) DEFAULT '0'
                  `;
      await ctx.model.query(sql);
    }
  }

  return VersionUpdate;
};
