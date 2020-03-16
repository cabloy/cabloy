module.exports = app => {
  class FunctionController extends app.Controller {

    async scenesLoad() {
      const res = await this.ctx.service.function.scenesLoad({
        sceneMenu: this.ctx.request.body.sceneMenu,
      });
      this.ctx.success(res);
    }

    async scenesSaveSortings() {
      const res = await this.ctx.service.function.scenesSaveSortings({
        sceneMenu: this.ctx.request.body.sceneMenu,
        sortings: this.ctx.request.body.sortings,
      });
      this.ctx.success(res);
    }

  }
  return FunctionController;
};
