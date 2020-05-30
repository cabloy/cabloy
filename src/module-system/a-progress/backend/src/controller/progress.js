module.exports = app => {
  class ProgressController extends app.Controller {

    async check() {
      const res = await this.service.progress.check({
        progressId: this.ctx.request.body.progressId,
        counter: this.ctx.request.body.counter,
        user: this.ctx.user.op,
      });
      this.ctx.success(res);
    }

    async abort() {
      await this.service.progress.abort({
        progressId: this.ctx.request.body.progressId,
        user: this.ctx.user.op,
      });
      this.ctx.success();
    }

    async delete() {
      await this.service.progress.delete({
        progressId: this.ctx.request.body.progressId,
        user: this.ctx.user.op,
      });
      this.ctx.success();
    }

  }
  return ProgressController;
};
