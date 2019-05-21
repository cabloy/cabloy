module.exports = app => {
  class PublicController extends app.Controller {

    async profile() {
      const res = await this.service.public.profile({
        userId: this.ctx.request.body.userId,
      });
      this.ctx.success(res);
    }

  }
  return PublicController;
};
