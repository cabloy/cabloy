module.exports = app => {
  // const moduleInfo = module.info;
  class Version {
    async _update_9(options) {
      // drop column: aCmsContent.itemId
      const sql = `
      ALTER TABLE aCmsContent
        DROP COLUMN itemId
    `;
      await this.ctx.db.query(sql);

      // drop view: aCmsArticleViewFull
      await this.ctx.model.query('drop view aCmsArticleViewFull');

      // drop view: aCmsArticleViewSearch
      await this.ctx.model.query('drop view aCmsArticleViewSearch');
    }
  }
  return Version;
};
