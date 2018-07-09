module.exports = app => {

  class AtomActionController extends app.Controller {

    async register() {
      const res = await this.ctx.service.atomAction.register({
        atomClassId: this.ctx.request.body.atomClassId,
        code: this.ctx.request.body.code,
      });
      this.ctx.success(res);
    }

  }

  return AtomActionController;
};
