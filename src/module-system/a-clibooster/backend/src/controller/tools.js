module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class DemoController extends app.Controller {
    get localUtils() {
      return this.ctx.bean.local.module(moduleInfo.relativeName).utils;
    }

    async demo() {
      // method
      const method = this.ctx.params.method || 'execute';
      // execute
      const result = await this.localUtils.demoExecute({ method });
      this.ctx.success(result);
    }
  }

  return DemoController;
};
