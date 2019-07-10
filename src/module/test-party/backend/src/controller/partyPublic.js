module.exports = app => {

  class PartyPublicController extends app.Controller {

    async create() {
      const res = await this.ctx.service.partyPublic.create(this.ctx.request.body);
      this.ctx.success(res);
    }

    async write() {
      await this.ctx.service.partyPublic.write(this.ctx.request.body);
      this.ctx.success();
    }

    async delete() {
      await this.ctx.service.partyPublic.delete(this.ctx.request.body);
      this.ctx.success();
    }

  }

  return PartyPublicController;
};

