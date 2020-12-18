const require3 = require('require3');
const uuid = require3('uuid');
const utils = require('../common/utils.js');

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Version extends app.meta.BeanBase {

    async update(options) {
      if (options.version === 1) {
        // create table: aCmsArticle
        let sql = `
          CREATE TABLE aCmsArticle (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            atomId int(11) DEFAULT '0',
            categoryId int(11) DEFAULT '0',
            language varchar(50) DEFAULT NULL,
            sticky int(11) DEFAULT '0',
            keywords varchar(255) DEFAULT NULL,
            description text DEFAULT NULL,
            summary text DEFAULT NULL,
            url varchar(255) DEFAULT NULL,
            editMode int(11) DEFAULT '0',
            slug varchar(255) DEFAULT NULL,
            sorting int(11) DEFAULT '0',
            flag varchar(255) DEFAULT NULL,
            extra json DEFAULT NULL,
            imageFirst varchar(255) DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);

        // create table: aCmsContent
        sql = `
          CREATE TABLE aCmsContent (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            atomId int(11) DEFAULT '0',
            itemId int(11) DEFAULT '0',
            content LONGTEXT DEFAULT NULL,
            html LONGTEXT DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);

        // create table: aCmsCategory
        sql = `
          CREATE TABLE aCmsCategory (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            categoryName varchar(50) DEFAULT NULL,
            language varchar(50) DEFAULT NULL,
            catalog int(11) DEFAULT '0',
            hidden int(11) DEFAULT '0',
            sorting int(11) DEFAULT '0',
            flag varchar(255) DEFAULT NULL,
            categoryIdParent int(11) DEFAULT '0',
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);

        // create view: aCmsArticleView
        sql = `
          CREATE VIEW aCmsArticleView as
            select a.*,b.categoryName from aCmsArticle a
              left join aCmsCategory b on a.categoryId=b.id
        `;
        await this.ctx.model.query(sql);

        // create view: aCmsArticleViewFull
        sql = `
          CREATE VIEW aCmsArticleViewFull as
            select a.*,b.categoryName,c.content,c.html,concat(d.atomName,',',c.content) contentSearch from aCmsArticle a
              left join aCmsCategory b on a.categoryId=b.id
              left join aCmsContent c on a.id=c.itemId
              left join aAtom d on a.atomId=d.id
        `;
        await this.ctx.model.query(sql);

      }

      if (options.version === 2) {
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

      if (options.version === 3) {
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

      if (options.version === 4) {
        // alter table: aCmsCategory
        const sql = `
        ALTER TABLE aCmsCategory
          ADD COLUMN url varchar(255) DEFAULT NULL
                  `;
        await this.ctx.model.query(sql);
      }

      if (options.version === 5) {
        // alter table: aCmsCategory
        let sql = `
        ALTER TABLE aCmsCategory
          ADD COLUMN atomClassId int(11) DEFAULT '0'
                  `;
        await this.ctx.model.query(sql);
        // alter table: aCmsTag
        sql = `
        ALTER TABLE aCmsTag
          ADD COLUMN atomClassId int(11) DEFAULT '0'
                  `;
        await this.ctx.model.query(sql);

        // atomClass
        await this._update5AtomClassIds(options);

      }

      if (options.version === 6) {
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

      if (options.version === 7) {
        // migration: languange/category/tag
        await this._update7Migration(options);
      }

      if (options.version === 8) {
        // schemas
        await this._update7Migration_schemas(options);
      }

    }

    async init(options) {
      if (options.version === 1) {
        // create roles: cms-writer cms-publisher to template
        const roles = [ 'cms-writer', 'cms-publisher' ];
        const roleTemplate = await this.ctx.bean.role.getSystemRole({ roleName: 'template' });
        const roleSuperuser = await this.ctx.bean.role.getSystemRole({ roleName: 'superuser' });
        for (const roleName of roles) {
          const roleId = await this.ctx.bean.role.add({
            roleName,
            roleIdParent: roleTemplate.id,
          });
          // role:superuser include cms-writer cms-publisher
          await this.ctx.bean.role.addRoleInc({ roleId: roleSuperuser.id, roleIdInc: roleId });
        }
        // build roles
        await this.ctx.bean.role.setDirty(true);

        // add role rights
        const roleRights = [
          { roleName: 'cms-writer', action: 'create' },
          { roleName: 'cms-writer', action: 'read', scopeNames: 'authenticated' },
          { roleName: 'cms-writer', action: 'write', scopeNames: 0 },
          { roleName: 'cms-writer', action: 'delete', scopeNames: 0 },
          { roleName: 'cms-writer', action: 'clone', scopeNames: 0 },
          { roleName: 'cms-writer', action: 'deleteBulk' },
          { roleName: 'cms-writer', action: 'exportBulk' },
          { roleName: 'cms-publisher', action: 'read', scopeNames: 'authenticated' },
          { roleName: 'cms-publisher', action: 'write', scopeNames: 'authenticated' },
          { roleName: 'root', action: 'read', scopeNames: 'authenticated' },
          { roleName: 'root', action: 'read', scopeNames: 0 },
        ];
        await this.ctx.bean.role.addRoleRightBatch({ atomClassName: 'article', roleRights });

      }

    }

    async test() {
      const atomClass = {
        module: moduleInfo.relativeName,
        atomClassName: 'article',
      };
      const categories = [
        { categoryName: 'test1', language: 'en-us', categoryIdParent: 0 },
        { categoryName: 'test2', language: 'en-us', categoryIdParent: 0 },
        { categoryName: 'test2-1', language: 'en-us', categoryIdParent: 'test2' },
        { categoryName: 'test2-2', language: 'en-us', categoryIdParent: 'test2' },
        { categoryName: 'test3', language: 'en-us', categoryIdParent: 0, categorySorting: 1 },
        { categoryName: 'testHidden', language: 'en-us', categoryIdParent: 0, categoryHidden: 1 },
        { categoryName: 'testFlag', language: 'en-us', categoryIdParent: 0, categoryFlag: 'Flag' },
      ];
      const categoryIds = {};
      for (const item of categories) {
        // add
        const categoryId = await this.ctx.bean.category.add({
          atomClass,
          data: {
            language: item.language,
            categoryName: item.categoryName,
            categoryHidden: item.categoryHidden,
            categorySorting: item.categorySorting,
            categoryFlag: item.categoryFlag,
            categoryIdParent: item.categoryIdParent ? categoryIds[item.categoryIdParent] : 0,
          },
        });
        categoryIds[item.categoryName] = categoryId;
      }
    }

    async _update5AtomClassIds(options) {
      // all instances
      const instances = await this.ctx.bean.instance.list({ where: {} });
      for (const instance of instances) {
        await this.ctx.executeBean({
          subdomain: instance.name,
          beanModule: moduleInfo.relativeName,
          beanFullName: `${moduleInfo.relativeName}.version.manager`,
          context: options,
          fn: '_update5AtomClassIdsInstance',
        });
      }
    }

    async _update5AtomClassIdsInstance() {
      const atomClass = await utils.atomClass2(this.ctx, null);
      // update aCmsCategory's atomClassId
      await this.ctx.model.query(
        `update aCmsCategory set atomClassId=?
             where iid=?`,
        [ atomClass.id, this.ctx.instance.id ]);
      // update aCmsTag's atomClassId
      await this.ctx.model.query(
        `update aCmsTag set atomClassId=?
             where iid=?`,
        [ atomClass.id, this.ctx.instance.id ]);
    }

    async _update6Uuids(options) {
      // all instances
      const instances = await this.ctx.bean.instance.list({ where: {} });
      for (const instance of instances) {
        await this.ctx.executeBean({
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

    async _update7Migration(options) {
      // all instances
      const instances = await this.ctx.bean.instance.list({ where: {} });
      for (const instance of instances) {
        await this.ctx.executeBean({
          subdomain: instance.name,
          beanModule: moduleInfo.relativeName,
          beanFullName: `${moduleInfo.relativeName}.version.manager`,
          context: options,
          fn: '_update7MigrationInstance',
        });
      }
    }

    async _update7MigrationInstance() {
      // cagetories
      const mapCagetoryIds = await this._update7Migration_cagetories();
      // tags
      const mapTagIds = await this._update7Migration_tags();
      // articles/post
      await this._update7Migration_articles({ mapCagetoryIds, mapTagIds });
    }

    async _update7Migration_schemas() {
      let sql;
      // aCmsArticle
      sql = `
        ALTER TABLE aCmsArticle
          DROP COLUMN categoryId,
          DROP COLUMN language
        `;
      await this.ctx.model.query(sql);
      // aCmsArticleTag
      sql = 'DROP TABLE aCmsArticleTag';
      await this.ctx.model.query(sql);
      // aCmsArticleTagRef
      sql = 'DROP TABLE aCmsArticleTagRef';
      await this.ctx.model.query(sql);
      // aCmsCategory
      sql = 'DROP TABLE aCmsCategory';
      await this.ctx.model.query(sql);
      // aCmsTag
      sql = 'DROP TABLE aCmsTag';
      await this.ctx.model.query(sql);
      // aCmsArticleView
      sql = 'DROP VIEW aCmsArticleView';
      await this.ctx.model.query(sql);
      // aCmsArticleViewFull
      await this.ctx.model.query('drop view aCmsArticleViewFull');
      sql = `
          CREATE VIEW aCmsArticleViewFull as
            select a.*,b.content,b.html from aCmsArticle a
              left join aCmsContent b on a.id=b.itemId
        `;
      await this.ctx.model.query(sql);
      // aCmsArticleViewSearch
      await this.ctx.model.query('drop view aCmsArticleViewSearch');
      sql = `
          CREATE VIEW aCmsArticleViewSearch as
            select a.*,b.content,b.html,concat(c.atomName,',',b.content) contentSearch from aCmsArticle a
              left join aCmsContent b on a.id=b.itemId
              left join aAtom c on a.atomId=c.id
        `;
      await this.ctx.model.query(sql);
      // aCmsArticleViewTag
      await this.ctx.model.query('drop view aCmsArticleViewTag');
    }

    async _update7Migration_articles({ mapCagetoryIds, mapTagIds }) {
      // articles
      const articles = await this.ctx.model.query(`
        select a.*,b.userIdCreated,c.tags
           from aCmsArticle a
           left join aAtom b on b.id=a.atomId
           left join aCmsArticleTag c on c.atomId=a.atomId
            where a.iid=? and a.deleted=0 and b.atomStage=1
        `, [ this.ctx.instance.id ]);
      // loop
      for (const article of articles) {
        await this._update7Migration_article({ mapCagetoryIds, mapTagIds, article });
      }
    }

    async _update7Migration_article({ mapCagetoryIds, mapTagIds, article }) {
      // user
      const user = { id: article.userIdCreated };
      // open
      const res = await this.ctx.bean.atom.openDraft({ key: { atomId: article.atomId }, user });
      const draftKey = res.draft.key;
      // atomCategoryId
      const atomCategoryId = article.categoryId === 0 ? 0 : mapCagetoryIds[article.categoryId];
      // atomTags
      let atomTags = article.tags;
      if (article.tags) {
        const _tags = JSON.parse(article.tags);
        atomTags = _tags.map(item => {
          return mapTagIds[item.id];
        });
        atomTags = JSON.stringify(atomTags);
      }
      // write
      await this.ctx.bean.atom.write({
        key: draftKey,
        target: null,
        item: {
          atomLanguage: article.language,
          atomCategoryId,
          atomTags,
        },
        options: {
          ignoreRender: true,
        },
        user,
      });
      // submit
      await this.ctx.bean.atom.submit({
        key: draftKey,
        options: {
          ignoreRender: true,
          ignoreFlow: true,
        },
        user,
      });
    }

    async _update7Migration_tags() {
      const mapTagIds = {};
      const tags = await this.ctx.model.select('aCmsTag', {
        where: {
          iid: this.ctx.instance.id,
          deleted: 0,
        },
      });
      for (const tag of tags) {
        await this._update7Migration_tag({ mapTagIds, tags, tag });
      }
      return mapTagIds;
    }

    async _update7Migration_tag({ mapTagIds, tag }) {
      const tagIdNew = await this.ctx.bean.tag.add({
        atomClass: { id: tag.atomClassId },
        data: {
          language: tag.language,
          tagName: tag.tagName,
          tagAtomCount: tag.articleCount,
        },
      });
      mapTagIds[tag.id] = tagIdNew;
      return tagIdNew;
    }

    async _update7Migration_cagetories() {
      const mapCagetoryIds = {};
      const categories = await this.ctx.model.select('aCmsCategory', {
        where: {
          iid: this.ctx.instance.id,
          deleted: 0,
        },
      });
      for (const category of categories) {
        await this._update7Migration_cagetory({ mapCagetoryIds, categories, category });
      }
      return mapCagetoryIds;
    }
    async _update7Migration_cagetory({ mapCagetoryIds, categories, category }) {
      if (category.__parsed) return mapCagetoryIds[category.id];
      let categoryIdParent = 0;
      if (category.categoryIdParent > 0) {
        const categoryParent = categories.find(item => item.id === category.categoryIdParent);
        categoryIdParent = await this._update7Migration_cagetory({ mapCagetoryIds, categories, category: categoryParent });
      }
      const categoryIdNew = await this.ctx.bean.category.add({
        atomClass: { id: category.atomClassId },
        data: {
          language: category.language,
          categoryName: category.categoryName,
          categoryHidden: category.hidden,
          categorySorting: category.sorting,
          categoryFlag: category.flag,
          categoryUrl: category.url,
          categoryIdParent,
        },
      });
      category.__parsed = true;
      mapCagetoryIds[category.id] = categoryIdNew;
      return categoryIdNew;
    }

    _parseUuid(article) {
      if (!article.url) return this._uuid();
      const matches = article.url.match(/articles\/(.*)\.html/);
      if (!matches) return this._uuid();
      if (matches[1].length !== 32) return this._uuid();
      return matches[1];
    }

    _uuid() {
      return uuid.v4().replace(/-/g, '');
    }

  }

  return Version;
};
