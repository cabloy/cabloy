const path = require('path');

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Local {
    constructor(cli) {
      this.cli = cli;
    }

    get console() {
      return this.cli.console;
    }

    get helper() {
      return this.cli.helper;
    }

    get moduleConfig() {
      return ctx.config.module(moduleInfo.relativeName);
    }

    get fileMapping() {
      return this.moduleConfig.template.fileMapping;
    }

    getTemplateDir(options) {
      const _module = ctx.app.meta.modules[options.module];
      return path.join(_module.root, 'backend/cli/templates', options.path);
    }

    async renderDir({ templateDir, targetDir, scope }) {
      await this.console.log(templateDir);
      await this.console.log(targetDir);
      await this.console.log({ text: scope });
    }
  }
  return Local;
};
