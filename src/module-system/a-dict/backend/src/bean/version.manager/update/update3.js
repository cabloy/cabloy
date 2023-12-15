module.exports = class VersionUpdate {
  async run(options) {
    // aDict: add dictMode
    let sql = `
        ALTER TABLE aDict
          Add COLUMN dictMode int(11) DEFAULT '0'
      `;
    await this.ctx.model.query(sql);
    // alter view: aDictViewFull
    await this.ctx.model.query('drop view aDictViewFull');
    sql = `
        CREATE VIEW aDictViewFull as
          select a.*,b.dictItems,b.dictLocales from aDict a
            left join aDictContent b on a.id=b.itemId
      `;
    await this.ctx.model.query(sql);
  }
};
