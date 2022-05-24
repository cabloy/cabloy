module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
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

    async save() {
      // check demo
      this.ctx.bean.util.checkDemo();
      // params
      const providerName = this.ctx.request.body.providerName;
      const data = this.ctx.request.body.data;
      // validate
      await this.ctx.bean.validation.validate({
        module: moduleInfo.relativeName,
        validator: providerName,
        schema: null,
        data,
        filterOptions: true,
      });
      // save
      await this.service.smsProvider.save({
        providerName,
        data,
      });
      // ok
      const res = this.ctx.bean.smsProviderCache.getSmsProvidersConfigForAdmin()[providerName];
      this.ctx.success(res);
    }
  }

  return SmsProviderController;
};
