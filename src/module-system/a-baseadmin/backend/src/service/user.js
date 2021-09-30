module.exports = app => {
  class User extends app.Service {
    async select(params) {
      return await this.ctx.bean.user.selectGeneral({ params });
    }

    async list({ roleId, query, anonymous, page }) {
      return await this.ctx.bean.user.list({ roleId, query, anonymous, page });
    }

    async item({ userId }) {
      return await this.ctx.bean.user.get({ id: userId });
    }

    async disable({ userId, disabled }) {
      return await this.ctx.bean.user.disable({ userId, disabled });
    }

    async delete({ userId }) {
      return await this.ctx.bean.user.delete({ userId });
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
