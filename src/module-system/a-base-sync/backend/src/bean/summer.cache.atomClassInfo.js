module.exports = ctx => {
  class SummerCache {
    // key: id module/atomClassName
    async get(key) {
      if (typeof key === 'object') {
        return await ctx.bean.atomClass.__getRaw(key);
      }
      // id
      return await ctx.bean.atomClass.__getRaw({ id: key });
    }
  }

  return SummerCache;
};
