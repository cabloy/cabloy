module.exports = class Captcha {
  async createProviderInstance({ module, sceneName, context }) {
    return await this.ctx.bean.captcha.createProviderInstance({ module, sceneName, context });
  }

  async refreshProviderInstance({ providerInstanceId, module, sceneName, context }) {
    return await this.ctx.bean.captcha.refreshProviderInstance({ providerInstanceId, module, sceneName, context });
  }
};
