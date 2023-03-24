module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Category {
    async getCacheCategories({ categoryIds }) {
      const cache = this.__getCacheCategoryInfo();
      return await cache.mget(categoryIds);
    }

    async getCacheCategory({ categoryId }) {
      const cache = this.__getCacheCategoryInfo();
      return await cache.get(categoryId);
    }

    async deleteCacheCategory({ categoryId }) {
      const cache = this.__getCacheCategoryInfo();
      return await cache.del(categoryId);
    }

    __getCacheCategoryInfo() {
      return ctx.bean.summer.getCache({ module: moduleInfo.relativeName, name: 'categoryInfo' });
    }
  }
  return Category;
};
