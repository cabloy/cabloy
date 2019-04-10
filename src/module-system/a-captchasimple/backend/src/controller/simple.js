const require3 = require('require3');
const captcha = require3('trek-captcha');

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class SimpleController extends app.Controller {

    async getCaptcha() {
      // create
      const { token, buffer } = await captcha();
      // save
      await this.ctx.meta.captcha.save({
        provider: {
          module: moduleInfo.relativeName,
          name: 'simple',
        },
        code: token });
      // ok
      this.ctx.status = 200;
      this.ctx.type = 'image/gif';
      this.ctx.body = buffer;
    }

  }
  return SimpleController;
};
