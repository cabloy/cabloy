module.exports = app => {

  class SequenceController extends app.Controller {

    async next() {
      const res = await this.ctx.service.sequence.next(this.ctx.request.body);
      this.ctx.success(res);
    }

  }

  return SequenceController;
};
