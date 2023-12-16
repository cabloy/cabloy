const moduleInfo = module.info;
module.exports = class tools {
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
};
