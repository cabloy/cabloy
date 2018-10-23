module.exports = app => {

  class {{atomClassNameCapitalize}}Controller extends app.Controller {

    async create() {
      const res = await this.ctx.service.{{atomClassName}}.create(this.ctx.request.body);
      this.ctx.success(res);
    }

    async read() {
      const res = await this.ctx.service.{{atomClassName}}.read(this.ctx.request.body);
      this.ctx.success(res);
    }

    async select() {
      const res = await this.ctx.service.{{atomClassName}}.select(this.ctx.request.body);
      this.ctx.success(res);
    }

    async write() {
      await this.ctx.service.{{atomClassName}}.write(this.ctx.request.body);
      this.ctx.success();
    }

    async delete() {
      await this.ctx.service.{{atomClassName}}.delete(this.ctx.request.body);
      this.ctx.success();
    }

    async action() {
      const res = await this.ctx.service.{{atomClassName}}.action(this.ctx.request.body);
      this.ctx.success(res);
    }

    async enable() {
      const res = await this.ctx.service.{{atomClassName}}.enable(this.ctx.request.body);
      this.ctx.success(res);
    }

  }
  return {{atomClassNameCapitalize}}Controller;
};

