module.exports = class ProgressController {
  async check() {
    const res = await this.ctx.service.progress.check({
      progressId: this.ctx.request.body.progressId,
      counter: this.ctx.request.body.counter,
      user: this.ctx.state.user.op,
    });
    this.ctx.success(res);
  }

  async abort() {
    await this.ctx.service.progress.abort({
      progressId: this.ctx.request.body.progressId,
      user: this.ctx.state.user.op,
    });
    this.ctx.success();
  }

  async delete() {
    await this.ctx.service.progress.delete({
      progressId: this.ctx.request.body.progressId,
      user: this.ctx.state.user.op,
    });
    this.ctx.success();
  }
};
