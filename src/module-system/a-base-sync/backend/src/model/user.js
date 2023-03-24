module.exports = app => {
  class User extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aUser', options: { disableDeleted: false } });
    }

    async update(user, ...args) {
      const res = await super.update(user, ...args);
      if (user.id) {
        await this.ctx.bean.user.deleteCacheUser({ userId: user.id });
      }
      return res;
    }

    async delete(user, ...args) {
      const res = await super.delete(user, ...args);
      if (user.id) {
        await this.ctx.bean.user.deleteCacheUser({ userId: user.id });
      }
      return res;
    }
  }

  return User;
};
