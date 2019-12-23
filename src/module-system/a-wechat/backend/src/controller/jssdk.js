module.exports = app => {
  class JSSDKController extends app.Controller {

    async config() {
      const res = await this.service.jssdk.config({
        url: this.ctx.request.body.url,
      });
      this.ctx.success(res);
    }

  }
  return JSSDKController;
};
