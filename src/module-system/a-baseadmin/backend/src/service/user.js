module.exports = app => {

  class User extends app.Service {

    async select({ query, page }) {
      return await this.ctx.bean.user.select({
        options: {
          where: {
            'a.anonymous': 0,
            'a.disabled': 0,
            __or__: [
              { 'a.userName': { op: 'like', val: query } },
              { 'a.realName': { op: 'like', val: query } },
              { 'a.mobile': { op: 'like', val: query } },
            ],
          },
          orders: [[ 'a.userName', 'asc' ]],
          page,
          removePrivacy: true,
        },
      });
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

  }

  return User;
};
