const moduleInfo = module.info;
module.exports = class Version {
  async _update_6(options) {
    // alter table: aCmsArticle
    let sql = `
        ALTER TABLE aCmsArticle
          ADD COLUMN uuid varchar(50) DEFAULT NULL
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

    // uuid
    await this._update6Uuids(options);
  }

  async _update6Uuids(options) {
    // all instances
    const instances = await this.ctx.bean.instance.list({ where: {} });
    for (const instance of instances) {
      await this.ctx.meta.util.executeBean({
        subdomain: instance.name,
        beanModule: moduleInfo.relativeName,
        beanFullName: `${moduleInfo.relativeName}.version.manager`,
        context: options,
        fn: '_update6UuidsInstance',
      });
    }
  }

  async _update6UuidsInstance() {
    const articles = await this.ctx.model.article.select();
    for (const article of articles) {
      const uuid = this._parseUuid(article);
      await this.ctx.model.article.update({
        id: article.id,
        uuid,
      });
    }
  }

  _parseUuid(article) {
    if (!article.url) return this._uuid();
    const matches = article.url.match(/articles\/(.*)\.html/);
    if (!matches) return this._uuid();
    if (matches[1].length !== 32) return this._uuid();
    return matches[1];
  }

  _uuid() {
    return this.ctx.bean.util.uuidv4();
  }
};
