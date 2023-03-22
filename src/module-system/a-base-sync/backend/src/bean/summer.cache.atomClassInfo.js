module.exports = ctx => {
  class SummerCache {
    // key: id module/atomClassName
    async get(key) {
      if (typeof key === 'object') {
        return await ctx.bean.atomClass.__getInner(key);
      }
      // id
      return await ctx.bean.atomClass.__getInner({ id: key });
    }
  }

  return SummerCache;
};
