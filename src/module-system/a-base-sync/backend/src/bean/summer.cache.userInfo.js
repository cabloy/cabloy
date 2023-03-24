module.exports = ctx => {
  class SummerCache {
    async get(key) {
      return await ctx.bean.user.model.get({ id: key });
    }

    async mget(keys) {
      // select
      return await ctx.bean.user.model.select({
        where: {
          id: keys,
        },
      });
    }
  }

  return SummerCache;
};
