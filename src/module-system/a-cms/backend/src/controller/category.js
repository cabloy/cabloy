module.exports = app => {

  class CategoryController extends app.Controller {

    async item() {
      const data = await this.ctx.service.category.item({
        categoryId: this.ctx.request.body.categoryId,
      });
      this.ctx.success(data);
    }

    async save() {
      const res = await this.ctx.service.category.save({
        categoryId: this.ctx.request.body.categoryId,
        data: this.ctx.request.body.data,
      });
      this.ctx.success(res);
    }

    async tree() {
      const list = await this.ctx.service.category.tree({
        language: this.ctx.request.body.language,
        categoryId: this.ctx.request.body.categoryId,
        hidden: this.ctx.request.body.hidden,
        flag: this.ctx.request.body.flag,
      });
      this.ctx.success({ list });
    }

    async children() {
      const list = await this.ctx.service.category.children({
        language: this.ctx.request.body.language,
        categoryId: this.ctx.request.body.categoryId,
        hidden: this.ctx.request.body.hidden,
        flag: this.ctx.request.body.flag,
      });
      this.ctx.success({ list });
    }

    async add() {
      const res = await this.ctx.service.category.add(this.ctx.request.body.data);
      this.ctx.success(res);
    }

    async delete() {
      const res = await this.ctx.service.category.delete({
        categoryId: this.ctx.request.body.categoryId,
      });
      this.ctx.success(res);
    }

    async move() {
      const res = await this.ctx.service.category.move({
        categoryId: this.ctx.request.body.categoryId,
        categoryIdParent: this.ctx.request.body.categoryIdParent,
      });
      this.ctx.success(res);
    }

  }
  return CategoryController;
};

