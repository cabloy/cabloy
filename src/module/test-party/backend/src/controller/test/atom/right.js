module.exports = app => {

  class RightController extends app.Controller {

    async checkRightCreate() {
      // checked by route/middleware
      this.ctx.success(this.ctx.meta._atomClass);
    }

    async checkRightRead() {
      // checked by route/middleware
      this.ctx.success(this.ctx.meta._atom);
    }

    async checkRightWrite() {
      // checked by route/middleware
      this.ctx.success(this.ctx.meta._atom);
    }

    async checkRightAction() {
      // checked by route/middleware
      this.ctx.success(this.ctx.meta._atom);
    }

  }

  return RightController;
};

