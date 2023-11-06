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
      // cli
      const cli = this.ctx.bean._newBean('cliBase', {
        command: null,
        context: { cwd: argv.projectPath },
        terminal: false,
      });
      // execute
      return await this.localUtils.demoExecute({ method, argv, cli });
    }
  }

  return tools;
};
