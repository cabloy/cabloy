module.exports = app => {

  class Category extends app.Service {

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


  }

  return Category;
};
