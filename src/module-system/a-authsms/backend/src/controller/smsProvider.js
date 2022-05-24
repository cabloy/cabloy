module.exports = app => {
  class SmsProviderController extends app.Controller {
    async list() {
      // check demo
      this.ctx.bean.util.checkDemo();
      const res = await this.ctx.service.smsProvider.list();
      this.ctx.success(res);
    }

    async setCurrent() {
      // check demo
      this.ctx.bean.util.checkDemo();
      const res = await this.ctx.service.smsProvider.setCurrent({
        providerName: this.ctx.request.body.providerName,
      });
      this.ctx.success(res);
    }
  }

  return SmsProviderController;
};
