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
      // aUserRole
      sql = `
      ALTER TABLE aUserRole
        Add COLUMN atomId int(11) DEFAULT '0'
                `;
      await ctx.model.query(sql);
      // aViewUserRightRefAtomClass
      sql = `
      create view aViewUserRightRefAtomClass as
        select a.iid,a.userId as userIdWho,a.roleExpandId,a.roleId,a.roleIdBase,b.id as roleRightRefId,b.roleRightId,b.atomClassId,b.action,b.roleIdScope as roleIdWhom from aViewUserRoleExpand a
          inner join aRoleRightRef b on a.roleIdBase=b.roleId
        `;
      await ctx.model.query(sql);
    }
  }

  return VersionUpdate13;
};
