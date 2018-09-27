module.exports = app => {

  class AtomClassController extends app.Controller {

    async register() {
      const res = await this.ctx.service.atomClass.register({
        module: this.ctx.request.body.module,
        atomClassName: this.ctx.request.body.atomClassName,
        atomClassIdParent: this.ctx.request.body.atomClassIdParent,
      });
      this.ctx.success(res);
    }

    validatorSearch() {
      const res = this.ctx.service.atomClass.validatorSearch({
        module: this.ctx.request.body.module,
        atomClassName: this.ctx.request.body.atomClassName,
      });
      this.ctx.success(res);
    }

    async checkRightCreate() {
      const res = await this.ctx.service.atomClass.checkRightCreate({
        atomClass: this.ctx.request.body.atomClass,
        user: this.ctx.user.op,
      });
      this.ctx.success(res);
    }

  }

  return AtomClassController;
};
