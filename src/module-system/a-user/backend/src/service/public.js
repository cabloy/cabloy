module.exports = class Public2 {
  async profile({ userId }) {
    const item = await this.ctx.bean.user.get({ id: userId });
    const user = {
      userName: item.userName,
      avatar: item.avatar,
      motto: item.motto,
    };
    return { user };
  }
};
