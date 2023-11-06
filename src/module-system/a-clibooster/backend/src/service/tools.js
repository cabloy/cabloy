module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class tools extends app.Service {
    get localUtils() {
      return this.ctx.bean.local.module(moduleInfo.relativeName).utils;
    }

    async demo({ method, query }) {
      // methods
      const methods = [];
      if (method) {
        methods.push(method);
      } else {
        method = 'execute';
      }
      // argv
      const argv = {
        _: methods,
        projectPath: process.cwd(),
        ...query,
      };
      // execute
      return await this.localUtils.demoExecute({ method, argv });
    }
  }

  return tools;
};
