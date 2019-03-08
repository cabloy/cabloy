module.exports = app => {

  class CategoryController extends app.Controller {

    async item() {
      // need not param:atomClass
      const data = await this.ctx.service.category.item({
        categoryId: this.ctx.request.body.categoryId,
      });
      this.ctx.success(data);
    }

    async save() {
      // need not param:atomClass
      const res = await this.ctx.service.category.save({
        categoryId: this.ctx.request.body.categoryId,
        data: this.ctx.request.body.data,
      });
      this.ctx.success(res);
    }

    async tree() {
      const atomClass = this.ctx.request.body.atomClass;
      const list = await this.ctx.service.category.tree({
        atomClass,
        language: this.ctx.request.body.language,
        categoryId: this.ctx.request.body.categoryId,
        hidden: this.ctx.request.body.hidden,
        flag: this.ctx.request.body.flag,
      });
      this.ctx.success({ list });
    }

    async children() {
      const atomClass = this.ctx.request.body.atomClass;
      const list = await this.ctx.service.category.children({
        atomClass,
        language: this.ctx.request.body.language,
        categoryId: this.ctx.request.body.categoryId,
        hidden: this.ctx.request.body.hidden,
        flag: this.ctx.request.body.flag,
      });
      this.ctx.success({ list });
    }

    async add() {
      const atomClass = this.ctx.request.body.atomClass;
      const res = await this.ctx.service.category.add({
        atomClass,
        data: this.ctx.request.body.data,
      });
      this.ctx.success(res);
    }

    async delete() {
      // need not param:atomClass
      const res = await this.ctx.service.category.delete({
        categoryId: this.ctx.request.body.categoryId,
      });
      this.ctx.success(res);
    }

    async move() {
      // need not param:atomClass
      const res = await this.ctx.service.category.move({
        categoryId: this.ctx.request.body.categoryId,
        categoryIdParent: this.ctx.request.body.categoryIdParent,
      });
      this.ctx.success(res);
    }

    async relativeTop() {
      // need not param:atomClass
      const res = await this.ctx.service.category.relativeTop({
        categoryId: this.ctx.request.body.categoryId,
      });
      this.ctx.success(res);
    }

  }
  return CategoryController;
};

