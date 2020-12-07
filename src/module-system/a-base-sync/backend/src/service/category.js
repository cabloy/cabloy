module.exports = app => {

  class Category extends app.Service {

    async child({ atomClass, language, categoryId, categoryName, categoryHidden, categoryFlag }) {
      return await this.ctx.bean.category.child({ atomClass, language, categoryId, categoryName, categoryHidden, categoryFlag });
    }

    async children({ atomClass, language, categoryId, categoryName, categoryHidden, categoryFlag }) {
      return await this.ctx.bean.category.children({ atomClass, language, categoryId, categoryName, categoryHidden, categoryFlag });
    }

    async add({ atomClass, data }) {
      return await this.ctx.bean.category.add({ atomClass, data });
    }

    async delete({ categoryId }) {
      return await this.ctx.bean.category.delete({ categoryId });
    }

    async move({ categoryId, categoryIdParent }) {
      return await this.ctx.bean.category.move({ categoryId, categoryIdParent });
    }

    async item({ categoryId }) {
      return await this.ctx.bean.category.get({ categoryId });
    }

    async save({ categoryId, data }) {
      return await this.ctx.bean.category.save({ categoryId, data });
    }

    async tree({ atomClass, language, categoryId, categoryHidden, categoryFlag }) {
      return await this.ctx.bean.category.tree({ atomClass, language, categoryId, categoryHidden, categoryFlag });
    }

    async relativeTop({ categoryId }) {
      return await this.ctx.bean.category.relativeTop({ categoryId });
    }

  }

  return Category;
};
