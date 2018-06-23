module.exports = app => {
  class ValidationController extends app.Controller {

    schema() {
      const res = this.service.validation.schema(this.ctx.request.body);
      this.ctx.success(res);
    }

  }
  return ValidationController;
};
