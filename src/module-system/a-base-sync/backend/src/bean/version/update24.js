module.exports = function (ctx) {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class VersionUpdate24 {
    async run() {
      await this._alterTables();
      await this._alterViews_aRoleRight_level1();
      await this._alterViews_aRoleRightRef_level1();
      await this._alterViews_aRoleRightRef_level2();
    }

    async _alterTables() {
      // aAtom: drop atomAreaKey atomAreaValue
      let sql = `
        ALTER TABLE aAtom
          DROP COLUMN atomAreaKey,
          DROP COLUMN atomAreaValue
      `;
      await ctx.model.query(sql);

      // aRoleRight: drop areaKey areaScope
      sql = `
        ALTER TABLE aRoleRight
          DROP COLUMN areaKey,
          DROP COLUMN areaScope
      `;
      await ctx.model.query(sql);

      // aRoleRightRef: drop areaKey areaScope
      sql = `
        ALTER TABLE aRoleRightRef
          DROP COLUMN areaKey,
          DROP COLUMN areaScope
      `;
      await ctx.model.query(sql);
    }

    async _alterViews_aRoleRight_level1() {
      // level1: aViewRoleRightAtomClass(8) aViewUserRightAtomClass(1)

      // aViewRoleRightAtomClass
      await ctx.model.query('drop view aViewRoleRightAtomClass');
      let sql = `
        create view aViewRoleRightAtomClass as
          select a.iid,a.roleId as roleIdWho,a.roleIdBase,
                 b.id as roleRightId,b.atomClassId,b.action,b.scope 
            from aRoleExpand a
              inner join aRoleRight b on a.roleIdBase=b.roleId
      `;
      await ctx.model.query(sql);

      // aViewUserRightAtomClass
      await ctx.model.query('drop view aViewUserRightAtomClass');
      sql = `
        create view aViewUserRightAtomClass as
          select a.iid,a.userId as userIdWho,a.roleExpandId,a.roleId,a.roleIdBase,
                 b.id as roleRightId,b.atomClassId,b.action,b.scope,b.areaKey,b.areaScope
            from aViewUserRoleExpand a
              inner join aRoleRight b on a.roleIdBase=b.roleId
      `;
      await ctx.model.query(sql);
    }

    async _alterViews_aRoleRightRef_level1() {
      // level1:
      //   aViewUserRightRefAtomClass(13)
      //   aViewUserRightAtomClassUser(13)
      //   aViewRoleRightAtomClassUser(13)
      //   aViewRoleRightAtomClassRole(13)
      //   aViewUserRightAtomClassRole(8)

      // aViewUserRightRefAtomClass
      await ctx.model.query('drop view aViewUserRightRefAtomClass');
      let sql = `
        create view aViewUserRightRefAtomClass as
          select a.iid,a.userId as userIdWho,a.roleExpandId,a.roleId,a.roleIdBase,
                b.id as roleRightRefId,b.roleRightId,b.atomClassId,b.action,b.roleIdScope as roleIdWhom,b.areaKey,b.areaScope
            from aViewUserRoleExpand a
              inner join aRoleRightRef b on a.roleIdBase=b.roleId
        `;
      await ctx.model.query(sql);

      // aViewUserRightAtomClassUser
      await ctx.model.query('drop view aViewUserRightAtomClassUser');
      sql = `
        create view aViewUserRightAtomClassUser as
          select a.iid,a.userId as userIdWho,b.atomClassId,b.action,b.areaKey,b.areaScope,
                c.userId as userIdWhom,c.roleId as roleIdWhom,
                a.roleIdBase,c.roleIdParent,c.level as roleIdParentLevel
            from aViewUserRoleExpand a
              inner join aRoleRightRef b on a.roleIdBase=b.roleId
              inner join aViewUserRoleRef c on b.roleIdScope=c.roleIdParent
      `;
      await ctx.model.query(sql);

      // aViewRoleRightAtomClassUser
      await ctx.model.query('drop view aViewRoleRightAtomClassUser');
      sql = `
      create view aViewRoleRightAtomClassUser as
        select a.iid,a.roleId as roleIdWho,b.atomClassId,b.action,b.areaKey,b.areaScope,
               c.userId as userIdWhom,c.roleId as roleIdWhom,
               a.roleIdBase,c.roleIdParent,c.level as roleIdParentLevel
          from aRoleExpand a
            inner join aRoleRightRef b on a.roleIdBase=b.roleId
            inner join aViewUserRoleRef c on b.roleIdScope=c.roleIdParent
        `;
      await ctx.model.query(sql);

      // aViewRoleRightAtomClassRole
      await ctx.model.query('drop view aViewRoleRightAtomClassRole');
      sql = `
        create view aViewRoleRightAtomClassRole as
          select a.iid,a.roleId as roleIdWho,b.atomClassId,b.action,b.areaKey,b.areaScope,
                c.roleId as roleIdWhom,
                a.roleIdBase,c.roleIdParent,c.level as roleIdParentLevel
            from aRoleExpand a
              inner join aRoleRightRef b on a.roleIdBase=b.roleId
              inner join aRoleRef c on b.roleIdScope=c.roleIdParent
      `;
      await ctx.model.query(sql);

      // aViewUserRightAtomClassRole
      await ctx.model.query('drop view aViewUserRightAtomClassRole');
      sql = `
        create view aViewUserRightAtomClassRole as
          select a.iid,a.userId as userIdWho,
                 b.atomClassId,b.action,b.areaKey,b.areaScope,
                 c.roleId as roleIdWhom
            from aViewUserRoleExpand a
              inner join aRoleRightRef b on a.roleIdBase=b.roleId
              inner join aRoleRef c on b.roleIdScope=c.roleIdParent
          `;
      await ctx.model.query(sql);
    }

    async _alterViews_aRoleRightRef_level2() {
      // level2:
      //   aViewUserRightAtom(9)
      //   aViewRoleRightAtom(9)
      //   aViewUserRightAtomRole(9)

      // aViewUserRightAtom
      await ctx.model.query('drop view aViewUserRightAtom');
      let sql = `
          create view aViewUserRightAtom as
            select a.iid, a.id as atomId,a.userIdCreated as userIdWhom,
                   b.userIdWho,b.action,b.areaKey,b.areaScope 
              from aAtom a,aViewUserRightAtomClassUser b
                where a.deleted=0 and a.atomStage>0
                  and a.atomClassId=b.atomClassId
                  and a.userIdCreated=b.userIdWhom
      `;
      await ctx.model.query(sql);

      // aViewRoleRightAtom
      await ctx.model.query('drop view aViewRoleRightAtom');
      sql = `
          create view aViewRoleRightAtom as
            select a.iid, a.id as atomId,a.userIdCreated as userIdWhom,
                   b.roleIdWho,b.action,b.areaKey,b.areaScope
              from aAtom a,aViewRoleRightAtomClassUser b
                where a.deleted=0 and a.atomStage>0
                  and a.atomClassId=b.atomClassId
                  and a.userIdCreated=b.userIdWhom
      `;
      await ctx.model.query(sql);

      // aViewUserRightAtomRole
      await ctx.model.query('drop view aViewUserRightAtomRole');
      sql = `
          create view aViewUserRightAtomRole as
            select a.iid, a.id as atomId,a.roleIdOwner as roleIdWhom,
                   b.userIdWho,b.action,b.areaKey,b.areaScope
              from aAtom a,aViewUserRightAtomClassRole b
                where a.deleted=0 and a.atomStage>0
                  and a.atomClassId=b.atomClassId
                  and a.roleIdOwner=b.roleIdWhom
        `;
      await ctx.model.query(sql);
    }
  }

  return VersionUpdate24;
};
