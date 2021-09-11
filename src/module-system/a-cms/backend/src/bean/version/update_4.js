module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Version {
    async _update_4(options) {
      // alter table: aCmsCategory
      const sql = `
      ALTER TABLE aCmsCategory
        ADD COLUMN url varchar(255) DEFAULT NULL
                `;
      await this.ctx.model.query(sql);
    }
  }
  return Version;
};
