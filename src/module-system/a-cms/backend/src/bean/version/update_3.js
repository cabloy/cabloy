module.exports = app => {
  // const moduleInfo = module.info;
  class Version {
    async _update_3(options) {
      // alter table: aCmsArticle
      let sql = `
        ALTER TABLE aCmsArticle
          ADD COLUMN audioFirst varchar(255) DEFAULT NULL,
          ADD COLUMN audioCoverFirst varchar(255) DEFAULT NULL
                  `;
      await this.ctx.model.query(sql);

      // alter view: aCmsArticleView
      await this.ctx.model.query('drop view aCmsArticleView');
      sql = `
          CREATE VIEW aCmsArticleView as
            select a.*,b.categoryName,e.tags from aCmsArticle a
              left join aCmsCategory b on a.categoryId=b.id
              left join aCmsArticleTag e on a.id=e.itemId
        `;
      await this.ctx.model.query(sql);

      // alter view: aCmsArticleViewFull
      await this.ctx.model.query('drop view aCmsArticleViewFull');
      sql = `
          CREATE VIEW aCmsArticleViewFull as
            select a.*,b.categoryName,e.tags,c.content,c.html from aCmsArticle a
              left join aCmsCategory b on a.categoryId=b.id
              left join aCmsContent c on a.id=c.itemId
              left join aCmsArticleTag e on a.id=e.itemId
        `;
      await this.ctx.model.query(sql);

      // alter view: aCmsArticleViewSearch
      await this.ctx.model.query('drop view aCmsArticleViewSearch');
      sql = `
          CREATE VIEW aCmsArticleViewSearch as
            select a.*,b.categoryName,e.tags,c.content,c.html,concat(d.atomName,',',c.content) contentSearch from aCmsArticle a
              left join aCmsCategory b on a.categoryId=b.id
              left join aCmsContent c on a.id=c.itemId
              left join aAtom d on a.atomId=d.id
              left join aCmsArticleTag e on a.id=e.itemId
        `;
      await this.ctx.model.query(sql);

      // alter view: aCmsArticleViewTag
      await this.ctx.model.query('drop view aCmsArticleViewTag');
      sql = `
          CREATE VIEW aCmsArticleViewTag as
            select a.*,b.categoryName,e.tags,f.tagId from aCmsArticle a
              left join aCmsCategory b on a.categoryId=b.id
              left join aCmsArticleTag e on a.id=e.itemId
              left join aCmsArticleTagRef f on a.id=f.itemId
        `;
      await this.ctx.model.query(sql);
    }
  }
  return Version;
};
