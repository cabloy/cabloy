module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class MonkeyeeController extends app.Controller {

    async test() {
      this.ctx.success(moduleInfo.relativeName);
    }

  }

  return MonkeyeeController;
};

