module.exports = app => {

  class PartyController extends app.Controller {

    async create() {
      const res = await this.ctx.service.party.create(this.ctx.request.body);
      this.ctx.success(res);
    }

    async read() {
      const res = await this.ctx.service.party.read(this.ctx.request.body);
      this.ctx.success(res);
    }

    async select() {
      const res = await this.ctx.service.party.select(this.ctx.request.body);
      this.ctx.success(res);
    }

    async write() {
      await this.ctx.service.party.write(this.ctx.request.body);
      this.ctx.success();
    }

    async delete() {
      await this.ctx.service.party.delete(this.ctx.request.body);
      this.ctx.success();
    }

    async action() {
      const res = await this.ctx.service.party.action(this.ctx.request.body);
      this.ctx.success(res);
    }

    async enable() {
      const res = await this.ctx.service.party.enable(this.ctx.request.body);
      this.ctx.success(res);
    }

    async types() {
      const res = await this.ctx.service.party.types(this.ctx.request.body);
      this.ctx.success(res);
    }

  }

  return PartyController;
};

