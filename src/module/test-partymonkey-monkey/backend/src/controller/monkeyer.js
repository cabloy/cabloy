module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class MonkeyerController extends app.Controller {

    async test() {
      const config = this.ctx.config.module('test-party');
      this.ctx.success({
        moduleName: moduleInfo.relativeName,
        monkeyed: config.monkeyed,
      });
    }

  }

  return MonkeyerController;
};

