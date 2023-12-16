module.exports = class AuthOpen {
  async hideClientSecret({ key, user }) {
    return await this.ctx.bean.authOpen.hideClientSecret({
      atomId: key.atomId,
      itemId: key.itemId,
      user,
    });
  }

  async resetClientSecret({ key, user }) {
    return await this.ctx.bean.authOpen.resetClientSecret({
      atomId: key.atomId,
      itemId: key.itemId,
      user,
    });
  }
};
