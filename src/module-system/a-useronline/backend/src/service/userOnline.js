module.exports = app => {
  class userOnline extends app.Service {
    async kickOut({ key }) {
      const item = await this.ctx.model.userOnline.get({ id: key.itemId });
      const userId = item.userId;
      //
    }
  }

  return userOnline;
};
