module.exports = function(ctx) {

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

      // aCheckRoleRightRead
      sql = `
        create procedure aCheckRoleRightRead (in _iid int,in _roleIdWho int,in _atomId int)
        begin

          select a.* from aAtom a
           left join aAtomClass b on a.atomClassId=b.id
            where (
             a.deleted=0 and a.iid=_iid and a.id=_atomId
             and (
                    (a.atomEnabled=1 and (
                      (
                        a.atomFlow=1 and (
                          (exists(select c.atomId from aViewRoleRightAtom c where c.iid=_iid and a.id=c.atomId and c.action>2 and c.roleIdWho=_roleIdWho))
                        )
                      ) or (
                        a.atomFlow=0 and (
                          b.public=1 or exists(select c.atomId from aViewRoleRightAtom c where c.iid=_iid and a.id=c.atomId and c.action=2 and c.roleIdWho=_roleIdWho)
                        )
                      )
                    ))
                  )
            );

        end
        `;
      await ctx.model.query(sql);

    }

  }

  return VersionUpdate3;
};
