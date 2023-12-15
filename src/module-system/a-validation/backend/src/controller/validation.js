module.exports = class ValidationController {
  schema() {
    const res = this.service.validation.schema(this.ctx.request.body);
    this.ctx.success(res);
  }
  async validate() {
    const res = await this.service.validation.validate({
      params: this.ctx.request.body.params,
      data: this.ctx.request.body.data,
    });
    this.ctx.success(res);
  }
};
