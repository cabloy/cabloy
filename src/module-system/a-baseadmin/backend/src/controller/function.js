module.exports = app => {
  class FunctionController extends app.Controller {

    async scenesLoad() {
      const res = await this.ctx.service.function.scenesLoad({
        sceneMenu: this.ctx.request.body.sceneMenu,
      });
      this.ctx.success(res);
    }

    async scenesSave({ menu, scenes }) {

    }

  }
  return FunctionController;
};
