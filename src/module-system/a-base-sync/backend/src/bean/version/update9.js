module.exports = function(ctx) {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class VersionUpdate9 {

    async run() {

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

  }

  return VersionUpdate9;
};
