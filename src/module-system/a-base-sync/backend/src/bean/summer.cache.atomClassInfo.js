module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class SummerCache {
    // key: id module/atomClassName
    async get(key) {
      console.log('--------------SummerCache.get', key);
      if (typeof key === 'object') {
        return await ctx.bean.atomClass.__getInner(key);
      }
      // id
      return await ctx.bean.atomClass.__getInner({ id: key });
    }
  }

  return SummerCache;
};
