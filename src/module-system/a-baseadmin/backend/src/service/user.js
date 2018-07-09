module.exports = app => {

  class User extends app.Service {

    async list({ roleId, query, anonymous, page }) {
      return await this.ctx.meta.user.list({ roleId, query, anonymous, page });
    }

    async item({ userId }) {
      return await this.ctx.meta.user.get({ id: userId });
    }

    async disable({ userId, disabled }) {
      return await this.ctx.meta.user.disable({ userId, disabled });
    }

    async delete({ userId }) {
      return await this.ctx.meta.user.delete({ userId });
    }

    async roles({ userId, page }) {
      return await this.ctx.meta.user.roles({ userId, page });
    }

    async addRole({ userId, roleId }) {
      return await this.ctx.meta.role.addUserRole({ userId, roleId });
    }

    async removeRole({ id }) {
      return await this.ctx.meta.role.deleteUserRole({ id });
    }

    async atomRights({ userId, page }) {
      return await this.ctx.meta.role.atomRightsOfUser({ userId, page });
    }

    async functionRights({ menu, userId, page }) {
      return await this.ctx.meta.role.functionRightsOfUser({ menu, userId, page });
    }


  }

  return User;
};
