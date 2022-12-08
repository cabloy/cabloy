module.exports = function (ctx) {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class VersionUpdate20 {
    async run() {
      throw new Error('正在加入新功能，源码模式暂时不可用。请使用项目模式来创建Cabloy项目');
      await this._alterTables();
      await this._alterViews_aRoleRight();
      await this._alterViews_aRoleRightRef();
    }

    async _alterTables() {
      // aAtom: add atomAreaKey atomAreaValue
      let sql = `
        ALTER TABLE aAtom
          ADD COLUMN atomAreaKey varchar(255) DEFAULT NULL,
          ADD COLUMN atomAreaValue varchar(255) DEFAULT NULL
      `;
      await ctx.model.query(sql);

      // aRoleRight: add areaKey areaScope
      sql = `
        ALTER TABLE aRoleRight
          ADD COLUMN areaKey varchar(255) DEFAULT NULL,
          ADD COLUMN areaScope varchar(255) DEFAULT NULL
      `;
      await ctx.model.query(sql);

      // aRoleRightRef: add areaKey areaScope
      sql = `
        ALTER TABLE aRoleRightRef
          ADD COLUMN areaKey varchar(255) DEFAULT NULL,
          ADD COLUMN areaScope varchar(255) DEFAULT NULL
      `;
      await ctx.model.query(sql);
    }

    async _alterViews_aRoleRight() {
      // level1: aViewRoleRightAtomClass(8) aViewUserRightAtomClass(1)

      // aViewRoleRightAtomClass
      await ctx.model.query('drop view aViewRoleRightAtomClass');
      let sql = `
        create view aViewRoleRightAtomClass as
          select a.iid,a.roleId as roleIdWho,a.roleIdBase,
                 b.id as roleRightId,b.atomClassId,b.action,b.scope,b.areaKey,b.areaScope 
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

    async _alterViews_aRoleRightRef() {
      // level1:
      //   aViewUserRightRefAtomClass(13)
      //   aViewUserRightAtomClassUser(13)
      //   aViewRoleRightAtomClassUser(13)
      //   aViewRoleRightAtomClassRole(13)
      //   aViewUserRightAtomClassRole(8)
      // level2:
      //   aViewUserRightAtom(9)
      //   aViewRoleRightAtom(9)
      //   aViewUserRightAtomRole(9)

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
    }
  }

  return VersionUpdate20;
};
