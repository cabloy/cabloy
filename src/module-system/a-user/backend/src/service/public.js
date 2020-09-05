module.exports = app => {

  class Public2 extends app.Service {

    async profile({ userId }) {
      const item = await this.ctx.bean.user.get({ id: userId });
      const user = {
        userName: item.userName,
        avatar: item.avatar,
        motto: item.motto,
      };
      return { user };
    }

  }
  return Public2;
};
