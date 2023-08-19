module.exports = ctx => {
  class SummerCache {
    async get(key) {
      return await ctx.bean.fields.__getFieldsRightOfAtomClassRaw(key);
    }
  }

  return SummerCache;
};
