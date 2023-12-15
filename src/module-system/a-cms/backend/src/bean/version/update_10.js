module.exports = class Version {
  async _update_10(options) {
    // alter table: aCmsArticle
    const sql = `
      ALTER TABLE aCmsArticle
        ADD COLUMN imageCover varchar(255) DEFAULT NULL
                `;
    await this.ctx.model.query(sql);
  }
};
