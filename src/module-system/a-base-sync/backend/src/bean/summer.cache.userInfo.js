module.exports = ctx => {
  class SummerCache {
    async get(key) {
      const user = await ctx.bean.user.model.get({ id: key });
      return this._mapUser(user);
    }

    async mget(keys) {
      // select
      const users = await ctx.bean.user.model.select({
        where: {
          id: keys,
        },
      });
      return users.map(user => {
        return this._mapUser(user);
      });
    }

    async _mapUser(user) {
      return {
        id: user.id,
        userName: user.userName,
        realName: user.realName,
        email: user.email,
        mobile: user.mobile,
        avatar: user.avatar,
      };
    }
  }

  return SummerCache;
};
