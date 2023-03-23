module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const __atomClassRole = {
    module: moduleInfo.relativeName,
    atomClassName: 'role',
  };
  const __atomClassUser = {
    module: moduleInfo.relativeName,
    atomClassName: 'user',
  };

  class Role {
    async roleUsers({ roleAtomId, roleId, page, user }) {
      // user, should check user right scope
      // user = { id: 0 };
      // roleId
      roleId = await this._forceRoleId({ roleAtomId, roleId });
      page = ctx.bean.util.page(page, false);
      // select
      const list = await ctx.bean.atom.select({
        atomClass: __atomClassUser,
        options: {
          orders: [['f.userName', 'asc']],
          page,
          stage: 'formal',
          role: roleId,
          // where,
        },
        user,
      });
      return list;
    }

    async userRoles({ userAtomId, userId, page, user }) {
      // user, should check user right scope
      // user = { id: 0 };
      userId = await ctx.bean.user._forceUserId({ userAtomId, userId });
      page = ctx.bean.util.page(page, false);
      // where
      const where = { 'f.userIdWho': userId };
      // select
      const list = await ctx.bean.atom.select({
        atomClass: __atomClassRole,
        options: {
          orders: [['f.roleName', 'asc']],
          page,
          stage: 'formal',
          where,
          mode: 'userRoles',
        },
        user,
      });
      return list;
    }

    // add user role
    async addUserRole({ roleAtomId, roleId, userAtomId, userId, user }) {
      // role
      const _role = await this._forceRoleAndCheckRightRead({ roleAtomId, roleId, user });
      roleId = _role.id;
      // user
      const _user = await ctx.bean.user._forceUserAndCheckRightRead({ userAtomId, userId, user });
      userId = _user.id;
      // check if exists
      const item = await this.modelUserRole.get({
        userId,
        roleId,
      });
      if (item) return item.id;
      // insert
      const res = await this.modelUserRole.insert({
        userId,
        roleId,
      });
      // clear summer
      await ctx.bean.atom.clearSummer_roleScopesOfUser();
      // ok
      return res.insertId;
    }

    async deleteUserRole({ roleAtomId, roleId, userAtomId, userId, user }) {
      // role
      const _role = await this._forceRoleAndCheckRightRead({ roleAtomId, roleId, user });
      roleId = _role.id;
      // user
      const _user = await ctx.bean.user._forceUserAndCheckRightRead({ userAtomId, userId, user });
      userId = _user.id;
      // clear summer
      await ctx.bean.atom.clearSummer_roleScopesOfUser();
      // delete
      await this.modelUserRole.delete({
        userId,
        roleId,
      });
    }

    async deleteAllUserRoles({ userId }) {
      await this.modelUserRole.delete({ userId });
    }
  }

  return Role;
};
