module.exports = class Version {
  async _update_2(options) {
    // create table: aCmsTag
    let sql = `
      CREATE TABLE aCmsTag (
        id int(11) NOT NULL AUTO_INCREMENT,
        createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        deleted int(11) DEFAULT '0',
        iid int(11) DEFAULT '0',
        language varchar(50) DEFAULT NULL,
        tagName varchar(50) DEFAULT NULL,
        articleCount int(11) DEFAULT '0',
        PRIMARY KEY (id)
      )
    `;
    await this.ctx.model.query(sql);

    // create table: aCmsArticleTag
    sql = `
      CREATE TABLE aCmsArticleTag (
        id int(11) NOT NULL AUTO_INCREMENT,
        createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        deleted int(11) DEFAULT '0',
        iid int(11) DEFAULT '0',
        atomId int(11) DEFAULT '0',
        itemId int(11) DEFAULT '0',
        tags JSON DEFAULT NULL,
        PRIMARY KEY (id)
      )
    `;
    await this.ctx.model.query(sql);

    // create table: aCmsArticleTagRef
    sql = `
      CREATE TABLE aCmsArticleTagRef (
        id int(11) NOT NULL AUTO_INCREMENT,
        createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        deleted int(11) DEFAULT '0',
        iid int(11) DEFAULT '0',
        atomId int(11) DEFAULT '0',
        itemId int(11) DEFAULT '0',
        tagId int(11) DEFAULT '0',
        PRIMARY KEY (id)
      )
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

    // create view: aCmsArticleViewSearch
    sql = `
      CREATE VIEW aCmsArticleViewSearch as
        select a.*,b.categoryName,e.tags,c.content,c.html,concat(d.atomName,',',c.content) contentSearch from aCmsArticle a
          left join aCmsCategory b on a.categoryId=b.id
          left join aCmsContent c on a.id=c.itemId
          left join aAtom d on a.atomId=d.id
          left join aCmsArticleTag e on a.id=e.itemId
    `;
    await this.ctx.model.query(sql);

    // create view: aCmsArticleViewTag
    sql = `
      CREATE VIEW aCmsArticleViewTag as
        select a.*,b.categoryName,e.tags,f.tagId from aCmsArticle a
          left join aCmsCategory b on a.categoryId=b.id
          left join aCmsArticleTag e on a.id=e.itemId
          left join aCmsArticleTagRef f on a.id=f.itemId
    `;
    await this.ctx.model.query(sql);
  }
};
