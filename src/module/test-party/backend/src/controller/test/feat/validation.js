module.exports = app => {

  class ValidationController extends app.Controller {

    async success() {
      this.ctx.success();
    }

    async fail() {
      this.ctx.success();
    }

    async schema() {
      this.ctx.success();
    }

  }

  return ValidationController;
};

