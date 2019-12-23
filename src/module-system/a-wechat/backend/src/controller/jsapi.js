module.exports = app => {
  class JSApiController extends app.Controller {

    async config() {
      const res = await this.service.jsapi.config({
        url: this.ctx.request.body.url,
      });
      this.ctx.success(res);
    }

  }
  return JSApiController;
};
