module.exports = app => {
  class userOnlineController extends app.Controller {
    async kickOut() {
      const res = await this.ctx.service.userOnline.kickOut({
        key: this.ctx.request.body.key,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }
  }

  return userOnlineController;
};
