module.exports = app => {
  class User extends app.Service {
    async select({ query, page, user }) {
      return await this.ctx.bean.user.selectGeneral({ params: { query, page }, user });
    }

    async roles({ userId, page }) {
      return await this.ctx.bean.user.roles({ userId, page });
    }

    async addRole({ userId, roleId }) {
      return await this.ctx.bean.role.addUserRole({ userId, roleId });
    }

    async removeRole({ id }) {
      return await this.ctx.bean.role.deleteUserRole({ id });
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
