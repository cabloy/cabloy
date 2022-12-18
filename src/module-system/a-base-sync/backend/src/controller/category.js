module.exports = app => {
  class CategoryController extends app.Controller {
    async child() {
      const atomClass = this.ctx.request.body.atomClass;
      const res = await this.ctx.service.category.child({
        atomClass,
        language: this.ctx.request.body.language,
        categoryId: this.ctx.request.body.categoryId,
        categoryName: this.ctx.request.body.categoryName,
        categoryHidden: this.ctx.request.body.categoryHidden,
        categoryFlag: this.ctx.request.body.categoryFlag,
        setLocale: this.ctx.request.body.setLocale,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async children() {
      const atomClass = this.ctx.request.body.atomClass;
      const list = await this.ctx.service.category.children({
        atomClass,
        language: this.ctx.request.body.language,
        categoryId: this.ctx.request.body.categoryId,
        categoryName: this.ctx.request.body.categoryName,
        categoryHidden: this.ctx.request.body.categoryHidden,
        categoryFlag: this.ctx.request.body.categoryFlag,
        setLocale: this.ctx.request.body.setLocale,
        user: this.ctx.state.user.op,
      });
      this.ctx.success({ list });
    }

    async tree() {
      const atomClass = this.ctx.request.body.atomClass;
      const list = await this.ctx.service.category.tree({
        atomClass,
        language: this.ctx.request.body.language,
        categoryId: this.ctx.request.body.categoryId,
        categoryHidden: this.ctx.request.body.categoryHidden,
        categoryFlag: this.ctx.request.body.categoryFlag,
        setLocale: this.ctx.request.body.setLocale,
        user: this.ctx.state.user.op,
      });
      this.ctx.success({ list });
    }

    async add() {
      // check demo
      this.ctx.bean.util.checkDemo();
      const atomClass = this.ctx.request.body.atomClass;
      const res = await this.ctx.service.category.add({
        atomClass,
        data: this.ctx.request.body.data,
      });
      this.ctx.success(res);
    }

    async delete() {
      // check demo
      this.ctx.bean.util.checkDemo();
      // need not param:atomClass
      const res = await this.ctx.service.category.delete({
        categoryId: this.ctx.request.body.categoryId,
      });
      this.ctx.success(res);
    }

    async move() {
      // check demo
      this.ctx.bean.util.checkDemo();
      // need not param:atomClass
      const res = await this.ctx.service.category.move({
        categoryId: this.ctx.request.body.categoryId,
        categoryIdParent: this.ctx.request.body.categoryIdParent,
      });
      this.ctx.success(res);
    }

    async item() {
      // need not param:atomClass
      const data = await this.ctx.service.category.item({
        categoryId: this.ctx.request.body.categoryId,
        setLocale: this.ctx.request.body.setLocale,
      });
      this.ctx.success(data);
    }

    async save() {
      // check demo
      this.ctx.bean.util.checkDemo();
      // need not param:atomClass
      const res = await this.ctx.service.category.save({
        categoryId: this.ctx.request.body.categoryId,
        data: this.ctx.request.body.data,
      });
      this.ctx.success(res);
    }

    async relativeTop() {
      // need not param:atomClass
      const res = await this.ctx.service.category.relativeTop({
        categoryId: this.ctx.request.body.categoryId,
        setLocale: this.ctx.request.body.setLocale,
      });
      this.ctx.success(res);
    }

    async parseCategoryName() {
      const atomClass = this.ctx.request.body.atomClass;
      const category = await this.ctx.service.category.parseCategoryName({
        atomClass,
        language: this.ctx.request.body.language,
        categoryName: this.ctx.request.body.categoryName,
        categoryIdParent: this.ctx.request.body.categoryIdParent,
        force: false,
      });
      this.ctx.success(category);
    }
  }
  return CategoryController;
};
