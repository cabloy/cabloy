module.exports = function (ctx) {
  class VersionUpdate13 {
    async run() {
      let sql;
      // aRole
      sql = `
      ALTER TABLE aRole
        Add COLUMN description varchar(255) DEFAULT NULL,
        Add COLUMN atomId int(11) DEFAULT '0',
        Add COLUMN roleTypeCode INT(11) DEFAULT '0',
        Add COLUMN roleConfig JSON DEFAULT NULL
                `;
      await this.ctx.model.query(sql);
      // aUserRole
      sql = `
      ALTER TABLE aUserRole
        Add COLUMN atomId int(11) DEFAULT '0'
                `;
      await this.ctx.model.query(sql);
    }
  }

  return VersionUpdate13;
};
