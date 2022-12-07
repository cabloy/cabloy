module.exports = function (ctx) {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class VersionUpdate20 {
    async run() {
      throw new Error('正在加入新功能，暂时不可用');
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
          select a.iid,a.roleId as roleIdWho,a.roleIdBase,b.id as roleRightId,b.atomClassId,b.action,b.scope,b.areaKey,b.areaScope from aRoleExpand a
            inner join aRoleRight b on a.roleIdBase=b.roleId
      `;
      await ctx.model.query(sql);

      // aViewUserRightAtomClass
      await ctx.model.query('drop view aViewUserRightAtomClass');
      sql = `
        create view aViewUserRightAtomClass as
          select a.iid,a.userId as userIdWho,a.roleExpandId,a.roleId,a.roleIdBase,b.id as roleRightId,b.atomClassId,b.action,b.scope,b.areaKey,b.areaScope from aViewUserRoleExpand a
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
      //
    }
  }

  return VersionUpdate20;
};
