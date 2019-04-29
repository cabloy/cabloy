const utils = require('../common/utils.js');

module.exports = app => {

  class Version extends app.Service {

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
      }

    }

    async init(options) {
      if (options.version === 1) {
        // create roles: cms-writer cms-publisher to template
        const roles = [ 'cms-writer', 'cms-publisher' ];
        const roleTemplate = await this.ctx.meta.role.getSystemRole({ roleName: 'template' });
        const roleSuperuser = await this.ctx.meta.role.getSystemRole({ roleName: 'superuser' });
        for (const roleName of roles) {
          const roleId = await this.ctx.meta.role.add({
            roleName,
            roleIdParent: roleTemplate.id,
          });
          // role:superuser include cms-writer cms-publisher
          await this.ctx.meta.role.addRoleInc({ roleId: roleSuperuser.id, roleIdInc: roleId });
        }
        // build roles
        await this.ctx.meta.role.setDirty(true);

        // add role rights
        const roleRights = [
          { roleName: 'cms-writer', action: 'create' },
          { roleName: 'cms-writer', action: 'write', scopeNames: 0 },
          { roleName: 'cms-writer', action: 'delete', scopeNames: 0 },
          { roleName: 'cms-writer', action: 'read', scopeNames: 'authenticated' },
          { roleName: 'cms-publisher', action: 'read', scopeNames: 'authenticated' },
          { roleName: 'cms-publisher', action: 'write', scopeNames: 'authenticated' },
          { roleName: 'cms-publisher', action: 'publish', scopeNames: 'authenticated' },
          { roleName: 'root', action: 'read', scopeNames: 'authenticated' },
        ];
        const module = this.ctx.app.meta.modules[this.ctx.module.info.relativeName];
        const atomClass = await this.ctx.meta.atomClass.get({ atomClassName: 'article' });
        for (const roleRight of roleRights) {
          // role
          const role = await this.ctx.meta.role.get({ roleName: roleRight.roleName });
          // scope
          let scope;
          if (!roleRight.scopeNames) {
            scope = 0;
          } else {
            const roleScope = await this.ctx.meta.role.get({ roleName: roleRight.scopeNames });
            scope = [ roleScope.id ];
          }
          // add role right
          await this.ctx.meta.role.addRoleRight({
            roleId: role.id,
            atomClassId: atomClass.id,
            action: this.ctx.constant.module('a-base').atom.action[roleRight.action] || module.main.meta.base.atoms.article
              .actions[roleRight.action].code,
            scope,
          });
        }

      }

      if (options.version === 5) {
        // atomClass
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

    }

    async test() {

    }

  }

  return Version;
};
