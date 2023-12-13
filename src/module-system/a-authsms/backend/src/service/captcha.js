module.exports = app => {
  const moduleInfo = module.info;
  class Captcha extends app.Service {
    async sendCode({ providerInstanceId, context }) {
      // sms provider
      const bean = this.ctx.bean._getBean(`${moduleInfo.relativeName}.captcha.provider.captcha`);
      const { provider, config } = bean.__createSMSProvider();
      // sendCode
      const data = await provider.sendCode({ providerInstanceId, context, config });
      // update
      await this.ctx.bean.captcha.update({
        providerInstanceId,
        data,
        context,
      });
    }
  }

  return Captcha;
};
