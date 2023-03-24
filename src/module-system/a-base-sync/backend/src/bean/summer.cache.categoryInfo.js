module.exports = ctx => {
  class SummerCache {
    async get(key) {
      return await ctx.bean.category.modelCategory.get({ id: key });
    }

    async mget(keys) {
      // select
      return await ctx.bean.category.modelCategory.select({
        where: {
          id: keys,
        },
      });
    }
  }

  return SummerCache;
};
