module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
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
      userId = await ctx.bean.user._forceUserId({ userAtomId, userId });
      page = ctx.bean.util.page(page, false);
      const _limit = ctx.model._limit(page.size, page.index);
      const items = await ctx.model.query(
        `
        select a.*,b.roleName from aUserRole a
          left join aRole b on a.roleId=b.id
            where a.iid=? and a.userId=?
            ${_limit}
        `,
        [ctx.instance.id, userId]
      );
      return this._translateRoleNamesLocale({ items });
    }

    // add user role
    async addUserRole({ roleAtomId, roleId, userAtomId, userId, user }) {
      // role
      const _role = await this._forceRoleAndCheckRightRead({ roleAtomId, roleId, user });
      // user
      const _user = await ctx.bean.user._forceUserAndCheckRightRead({ userAtomId, userId, user });
      // insert
      const res = await this.modelUserRole.insert({
        userId: _user.id,
        roleId: _role.id,
      });
      return res.insertId;
    }

    async deleteUserRole({ roleAtomId, roleId, userAtomId, userId, user }) {
      // role
      const _role = await this._forceRoleAndCheckRightRead({ roleAtomId, roleId, user });
      // user
      const _user = await ctx.bean.user._forceUserAndCheckRightRead({ userAtomId, userId, user });
      // delete
      await this.modelUserRole.delete({
        userId: _user.id,
        roleId: _role.id,
      });
    }

    async deleteAllUserRoles({ userId }) {
      await this.modelUserRole.delete({ userId });
    }
  }

  return Role;
};
