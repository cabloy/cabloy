module.exports = app => {
  class Category extends app.Service {
    async child({ atomClass, language, categoryId, categoryName, categoryHidden, categoryFlag, setLocale }) {
      return await this.ctx.bean.category.child({ atomClass, language, categoryId, categoryName, categoryHidden, categoryFlag, setLocale });
    }

    async children({ atomClass, language, categoryId, categoryName, categoryHidden, categoryFlag, setLocale }) {
      return await this.ctx.bean.category.children({ atomClass, language, categoryId, categoryName, categoryHidden, categoryFlag, setLocale });
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

    async item({ categoryId, setLocale }) {
      return await this.ctx.bean.category.get({ categoryId, setLocale });
    }

    async save({ categoryId, data }) {
      return await this.ctx.bean.category.save({ categoryId, data });
    }

    async tree({ atomClass, language, categoryId, categoryHidden, categoryFlag, setLocale }) {
      return await this.ctx.bean.category.tree({ atomClass, language, categoryId, categoryHidden, categoryFlag, setLocale });
    }

    async relativeTop({ categoryId, setLocale }) {
      return await this.ctx.bean.category.relativeTop({ categoryId, setLocale });
    }
  }

  return Category;
};
