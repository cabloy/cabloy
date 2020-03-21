module.exports = app => {

  class Captcha extends app.Service {

    async createProviderInstance({ module, sceneName, context }) {
      return await this.ctx.meta.captcha.createProviderInstance({ module, sceneName, context });
    }

  }

  return Captcha;
};
