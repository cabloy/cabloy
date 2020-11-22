module.exports = app => {

  class ModelController extends app.Controller {

    async model() {
      this.ctx.success();
    }

  }

  return ModelController;

};
