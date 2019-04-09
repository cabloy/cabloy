module.exports = app => {

  class MailController extends app.Controller {

    async create() {
      const res = await this.ctx.service.mail.create(this.ctx.request.body);
      this.ctx.success(res);
    }

    async read() {
      const res = await this.ctx.service.mail.read(this.ctx.request.body);
      this.ctx.success(res);
    }

    async select() {
      const res = await this.ctx.service.mail.select(this.ctx.request.body);
      this.ctx.success(res);
    }

    async write() {
      await this.ctx.service.mail.write(this.ctx.request.body);
      this.ctx.success();
    }

    async delete() {
      await this.ctx.service.mail.delete(this.ctx.request.body);
      this.ctx.success();
    }

    async action() {
      const res = await this.ctx.service.mail.action(this.ctx.request.body);
      this.ctx.success(res);
    }

    async enable() {
      const res = await this.ctx.service.mail.enable(this.ctx.request.body);
      this.ctx.success(res);
    }

  }
  return MailController;
};

