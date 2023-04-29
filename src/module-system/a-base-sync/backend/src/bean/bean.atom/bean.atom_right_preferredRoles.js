module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Atom {
    // preffered roles
    async preferredRoles({ atomClass, user }) {
      // atomClass
      atomClass = await ctx.bean.atomClass.get(atomClass);
      // normal check
      const roles = await this._preferredRoles_normal({ atomClass, user });
      if (!roles || roles.length === 0) return roles;
      // auth open check
      const resAuthOpenCheck = await ctx.bean.authOpen.checkRightAtomAction({ atomClass, action: 'create' });
      if (!resAuthOpenCheck) return [];
      // ok
      return roles;
    }

    // preffered roles
    async _preferredRoles_normal({ atomClass, user }) {
      const roles = await ctx.model.query(
        `select a.*,b.userId,c.roleName as roleNameWho from aViewRoleRightAtomClass a
          inner join aUserRole b on a.roleIdWho=b.roleId
          left join aRole c on a.roleIdWho=c.id
          where a.iid=? and a.atomClassId=? and a.action=1 and b.userId=?
          order by a.roleIdWho desc`,
        [ctx.instance.id, atomClass.id, user.id]
      );
      return roles;
    }

    async preferredRole({ atomClass, user }) {
      const roles = await this.preferredRoles({ atomClass, user });
      return !roles || roles.length === 0 ? null : roles[0];
    }

    async preferredRoleId({ atomClass, user }) {
      const role = await this.preferredRole({ atomClass, user });
      return role ? role.roleIdWho : 0;
    }
  }

  return Atom;
};
