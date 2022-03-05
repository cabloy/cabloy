module.exports = app => {
  class userOnline extends app.Service {
    async kickOut({ key }) {
      const item = await this.ctx.model.userOnline.get({ id: key.itemId });
      const user = { id: item.userId };
      await this.ctx.bean.userOnline.kickOut({ user });
    }
  }

  return userOnline;
};
