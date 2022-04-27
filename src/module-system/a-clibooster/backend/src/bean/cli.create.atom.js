const fs = require('fs');
const path = require('path');

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Cli extends ctx.app.meta.CliBase(ctx) {
    async execute({ user }) {
      const { argv } = this.context;
      // super
      await super.execute({ user });
      // module name/info
      const moduleName = argv.module;
      argv.moduleInfo = this.helper.parseModuleInfo(moduleName);
      // check if exists
      const _module = this.helper.findModule(moduleName);
      if (!_module) {
        throw new Error(`module does not exists: ${moduleName}`);
      }
      // target dir
      const targetDir = await this.helper.ensureDir(_module.root);
      // templateDir
      const templateDir = this.template.resolvePath({
        moduleName: moduleInfo.relativeName,
        path: 'create/atom/boilerplate',
      });
      // render
      await this.template.renderDir({ targetDir, templateDir });
      // reload
      ctx.app.meta.reload.now();
    }
  }

  return Cli;
};
