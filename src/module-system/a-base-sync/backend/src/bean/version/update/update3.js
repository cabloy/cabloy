module.exports = function (ctx) {
  class VersionUpdate3 {
    async run() {
      // aViewRoleRightAtomClassUser
      let sql = `
        create view aViewRoleRightAtomClassUser as
          select a.iid,a.roleId as roleIdWho,b.atomClassId,b.action,c.userId as userIdWhom from aRoleExpand a
            inner join aRoleRightRef b on a.roleIdBase=b.roleId
            inner join aViewUserRoleRef c on b.roleIdScope=c.roleIdParent
          `;
      await ctx.model.query(sql);

      // aViewRoleRightAtom
      sql = `
        create view aViewRoleRightAtom as
          select a.iid, a.id as atomId,a.userIdCreated as userIdWhom,b.roleIdWho,b.action from aAtom a,aViewRoleRightAtomClassUser b
            where a.deleted=0 and a.atomEnabled=1
              and a.atomClassId=b.atomClassId
              and a.userIdCreated=b.userIdWhom
          `;
      await ctx.model.query(sql);
    }
  }

  return VersionUpdate3;
};
