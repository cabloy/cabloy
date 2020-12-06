module.exports = app => {

  class RightController extends app.Controller {

    async checkRightFunctionUser() {
      // checked by route/middleware
      this.ctx.success(this.ctx.meta._function);
    }

  }

  return RightController;
};

