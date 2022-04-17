module.exports = function (ctx) {
  class VersionUpdate13 {
    async run() {
      let sql;
      // aRole
      sql = `
      ALTER TABLE aRole
        Add COLUMN description varchar(255) DEFAULT NULL,
        Add COLUMN atomId int(11) DEFAULT '0',
        Add COLUMN roleTypeCode INT(11) DEFAULT '0',
        Add COLUMN roleConfig JSON DEFAULT NULL
                `;
      await ctx.model.query(sql);
      // aUser
      sql = `
      ALTER TABLE aUser
        Add COLUMN atomId int(11) DEFAULT '0'
                `;
      await ctx.model.query(sql);
      // aViewUserRightRefAtomClass
      sql = `
      create view aViewUserRightRefAtomClass as
        select a.iid,a.userId as userIdWho,a.roleExpandId,a.roleId,a.roleIdBase,
               b.id as roleRightRefId,b.roleRightId,b.atomClassId,b.action,b.roleIdScope as roleIdWhom 
          from aViewUserRoleExpand a
            inner join aRoleRightRef b on a.roleIdBase=b.roleId
        `;
      await ctx.model.query(sql);
      // aViewUserRightAtomClassUser
      await ctx.model.query('drop view aViewUserRightAtomClassUser');
      sql = `
      create view aViewUserRightAtomClassUser as
        select a.iid,a.userId as userIdWho,b.atomClassId,b.action,
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
        select a.iid,a.roleId as roleIdWho,b.atomClassId,b.action,
               c.userId as userIdWhom,c.roleId as roleIdWhom,
               a.roleIdBase,c.roleIdParent,c.level as roleIdParentLevel
          from aRoleExpand a
            inner join aRoleRightRef b on a.roleIdBase=b.roleId
            inner join aViewUserRoleRef c on b.roleIdScope=c.roleIdParent
        `;
      await ctx.model.query(sql);
      // aViewRoleRightAtomClassRole
      sql = `
      create view aViewRoleRightAtomClassRole as
        select a.iid,a.roleId as roleIdWho,b.atomClassId,b.action,
               c.roleId as roleIdWhom,
               a.roleIdBase,c.roleIdParent,c.level as roleIdParentLevel
          from aRoleExpand a
            inner join aRoleRightRef b on a.roleIdBase=b.roleId
            inner join aRoleRef c on b.roleIdScope=c.roleIdParent
        `;
      await ctx.model.query(sql);
      // aViewRoleRightResource
      sql = `
        create view aViewRoleRightResource as
          select a.iid,a.roleId as roleIdWho,a.roleIdBase,b.id as resourceRoleId,b.atomId from aRoleExpand a
            inner join aResourceRole b on a.roleIdBase=b.roleId
          `;
      await ctx.model.query(sql);
      // view: aRoleView
      sql = `
          CREATE VIEW aRoleView as
            select a.*,b.roleName as roleNameParent from aRole a
              left join aRole b on a.roleIdParent=b.id
        `;
      await ctx.model.query(sql);
      // view: aRoleIncludesView
      sql = `
          CREATE VIEW aRoleIncludesView as
            select a.*,b.id as roleIncId,b.roleId as roleIdWho,b.roleIdInc from aRole a
              inner join aRoleInc b on a.id=b.roleIdInc
        `;
      await ctx.model.query(sql);
      // view: aRoleUsersView
      sql = `
          CREATE VIEW aRoleUserRolesView as
            select a.*,b.id as userRoleId,b.userId as userIdWho from aRole a
              inner join aUserRole b on a.id=b.roleId
        `;
      await ctx.model.query(sql);
    }
  }

  return VersionUpdate13;
};
