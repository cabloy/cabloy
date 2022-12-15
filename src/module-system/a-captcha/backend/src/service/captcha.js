module.exports = app => {
  class Captcha extends app.Service {
    async createProviderInstance({ module, sceneName, context }) {
      return await this.ctx.bean.captcha.createProviderInstance({ module, sceneName, context });
    }

    async refreshProviderInstance({ providerInstanceId, module, sceneName, context }) {
      return await this.ctx.bean.captcha.refreshProviderInstance({ providerInstanceId, module, sceneName, context });
    }
  }

  return Captcha;
};
