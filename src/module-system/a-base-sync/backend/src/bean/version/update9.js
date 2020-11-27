module.exports = function(ctx) {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class VersionUpdate9 {

    async run() {
      await this.run_atom();
      await this.run_categorytag();
    }

    async run_atom() {

      let sql;

      // aAtom: atomEnabled->atomStage
      sql = `
        ALTER TABLE aAtom
          CHANGE COLUMN atomEnabled atomStage int(11) DEFAULT '0'
        `;
      await ctx.model.query(sql);

      // aAtom: atomFlow->atomFlowId
      sql = `
        ALTER TABLE aAtom
          CHANGE COLUMN atomFlow atomFlowId int(11) DEFAULT '0'
        `;
      await ctx.model.query(sql);

      // aAtom: add field atomClosed/atomIdDraft/atomIdArchive
      sql = `
        ALTER TABLE aAtom
          ADD COLUMN atomClosed int(11) DEFAULT '0',
          ADD COLUMN atomIdDraft int(11) DEFAULT '0',
          ADD COLUMN atomIdArchive int(11) DEFAULT '0'
        `;
      await ctx.model.query(sql);

      // aAtom: add field atomStatic/atomStaticKey/atomRevision
      sql = `
        ALTER TABLE aAtom
          ADD COLUMN atomStatic int(11) DEFAULT '0',
          ADD COLUMN atomStaticKey varchar(255) DEFAULT NULL,
          ADD COLUMN atomRevision int(11) DEFAULT '0'
        `;
      await ctx.model.query(sql);

      // alter view: aViewUserRightAtom
      await ctx.model.query('drop view aViewUserRightAtom');
      sql = `
          create view aViewUserRightAtom as
            select a.iid, a.id as atomId,a.userIdCreated as userIdWhom,b.userIdWho,b.action from aAtom a,aViewUserRightAtomClassUser b
              where a.deleted=0 and a.atomStage>0
                and a.atomClassId=b.atomClassId
                and a.userIdCreated=b.userIdWhom
        `;
      await ctx.model.query(sql);

      // alter view: aViewRoleRightAtom
      await ctx.model.query('drop view aViewRoleRightAtom');
      sql = `
          create view aViewRoleRightAtom as
            select a.iid, a.id as atomId,a.userIdCreated as userIdWhom,b.roleIdWho,b.action from aAtom a,aViewRoleRightAtomClassUser b
              where a.deleted=0 and a.atomStage>0
                and a.atomClassId=b.atomClassId
                and a.userIdCreated=b.userIdWhom
        `;
      await ctx.model.query(sql);

      // alter view: aViewUserRightAtomRole
      await ctx.model.query('drop view aViewUserRightAtomRole');
      sql = `
          create view aViewUserRightAtomRole as
            select a.iid, a.id as atomId,a.roleIdOwner as roleIdWhom,b.userIdWho,b.action from aAtom a,aViewUserRightAtomClassRole b
              where a.deleted=0 and a.atomStage>0
                and a.atomClassId=b.atomClassId
                and a.roleIdOwner=b.roleIdWhom
        `;
      await ctx.model.query(sql);

      // aAtomAction: add field bulk
      sql = `
        ALTER TABLE aAtomAction
          ADD COLUMN bulk int(11) DEFAULT '0'
        `;
      await ctx.model.query(sql);
      //   update action:create as bulk
      sql = `
        update aAtomAction set bulk=1 where code=1
        `;
      await ctx.model.query(sql);

    }

    async run_categorytag() {

      let sql;
      // aAtom: add field atomLanguage\atomCategoryId
      sql = `
        ALTER TABLE aAtom
          ADD COLUMN atomLanguage varchar(50) DEFAULT NULL,
          ADD COLUMN atomCategoryId int(11) DEFAULT '0',
          ADD COLUMN atomTags JSON DEFAULT NULL
        `;
      await ctx.model.query(sql);

      // create table: aCategory
      sql = `
          CREATE TABLE aCategory (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            atomClassId int(11) DEFAULT '0',
            language varchar(50) DEFAULT NULL,
            categoryName varchar(50) DEFAULT NULL,
            categoryCatalog int(11) DEFAULT '0',
            categoryHidden int(11) DEFAULT '0',
            categorySorting int(11) DEFAULT '0',
            categoryFlag varchar(255) DEFAULT NULL,
            categoryIdParent int(11) DEFAULT '0',
            categoryUrl varchar(255) DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `;
      await ctx.model.query(sql);

      // create table: aTag
      sql = `
          CREATE TABLE aTag (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            atomClassId int(11) DEFAULT '0',
            language varchar(50) DEFAULT NULL,
            tagName varchar(50) DEFAULT NULL,
            tagAtomCount int(11) DEFAULT '0',
            PRIMARY KEY (id)
          )
        `;
      await ctx.model.query(sql);

      // create table: aTagRef
      sql = `
          CREATE TABLE aTagRef (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            atomId int(11) DEFAULT '0',
            tagId int(11) DEFAULT '0',
            PRIMARY KEY (id)
          )
        `;
      await ctx.model.query(sql);

    }

  }

  return VersionUpdate9;
};
