module.exports = class VersionUpdate {
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
};
