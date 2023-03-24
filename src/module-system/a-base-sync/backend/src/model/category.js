module.exports = app => {
  class Category extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aCategory', options: { disableDeleted: false } });
    }

    async update(category, ...args) {
      const res = await super.update(category, ...args);
      if (category.id) {
        await this.ctx.bean.category.deleteCacheCategory({ categoryId: category.id });
      }
      return res;
    }

    async delete(category, ...args) {
      const res = await super.delete(category, ...args);
      if (category.id) {
        await this.ctx.bean.category.deleteCacheCategory({ categoryId: category.id });
      }
      return res;
    }
  }
  return Category;
};
