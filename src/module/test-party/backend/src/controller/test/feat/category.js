module.exports = app => {

  class CategoryController extends app.Controller {

    async category() {

      this.ctx.success();
    }

  }

  return CategoryController;

};
