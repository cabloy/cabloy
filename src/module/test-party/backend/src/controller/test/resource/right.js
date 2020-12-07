module.exports = app => {

  class RightController extends app.Controller {

    async checkRightResourceUser() {
      // checked by route/middleware
      this.ctx.success(this.ctx.meta._resource);
    }

  }

  return RightController;
};

