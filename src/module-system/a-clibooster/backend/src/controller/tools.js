module.exports = class DemoController {
  async demo() {
    const result = await this.ctx.service.tools.demo({ method: this.ctx.params.method, query: this.ctx.query });
    this.ctx.success(result);
  }
};
