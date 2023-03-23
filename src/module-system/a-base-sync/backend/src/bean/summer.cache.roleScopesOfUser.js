module.exports = ctx => {
  class SummerCache {
    async get(key) {
      return await ctx.bean.atom.__getRoleScopesOfUserRaw(key);
    }
  }

  return SummerCache;
};
