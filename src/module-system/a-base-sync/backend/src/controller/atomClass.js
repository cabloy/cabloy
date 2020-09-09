module.exports = app => {

  class AtomClassController extends app.Controller {

    async validatorSearch() {
      const res = await this.ctx.service.atomClass.validatorSearch({
        atomClass: this.ctx.request.body.atomClass,
      });
      this.ctx.success(res);
    }

    async checkRightCreate() {
      const res = await this.ctx.service.atomClass.checkRightCreate({
        atomClass: this.ctx.request.body.atomClass,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async atomClass() {
      const res = await this.ctx.service.atomClass.atomClass({
        atomClass: this.ctx.request.body.atomClass,
      });
      this.ctx.success(res);
    }

  }

  return AtomClassController;
};
