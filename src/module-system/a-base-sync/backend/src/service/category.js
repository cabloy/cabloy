module.exports = app => {

  class Category extends app.Service {

    async children({ atomClass, language, categoryId, categoryName, categoryHidden, categoryFlag }) {
      return await this.ctx.bean.category.children({ atomClass, language, categoryId, categoryName, categoryHidden, categoryFlag });
    }

  }

  return Category;
};
