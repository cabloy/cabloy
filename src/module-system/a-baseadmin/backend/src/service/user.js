module.exports = app => {
  class User extends app.Service {
    async select({ query, page, user }) {
      return await this.ctx.bean.user.selectGeneral({ params: { query, page }, user });
    }

    async userRoles({ userAtomId, page, user }) {
      return await this.ctx.bean.role.userRoles({ userAtomId, page, user });
    }

    async addUserRole({ userAtomId, roleId, user }) {
      return await this.ctx.bean.role.addUserRole({ userAtomId, roleId, user });
    }

    async deleteUserRole({ userAtomId, roleId, user }) {
      return await this.ctx.bean.role.deleteUserRole({ userAtomId, roleId, user });
    }

    async atomRights({ userId, page }) {
      return await this.ctx.bean.role.atomRightsOfUser({ userId, page });
    }

    async resourceRights({ userId, page }) {
      return await this.ctx.bean.resource.resourceRightsOfUser({ userId, page });
    }
  }

  return User;
};
