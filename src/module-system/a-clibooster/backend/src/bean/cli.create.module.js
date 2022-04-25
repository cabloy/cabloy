const fs = require('fs');
const path = require('path');

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Cli extends ctx.app.meta.CliBase(ctx) {
    get localToken() {
      return ctx.bean.local.module('a-authopen').token;
    }

    async execute({ user }) {
      const { argv } = this.context;
      // super
      await super.execute({ user });
      // module name/info
      const moduleName = argv.name;
      argv.moduleInfo = this.helper.parseModuleInfo(moduleName);
      // check if exists
      const _module = this.helper.findModule(moduleName);
      if (!argv.force && _module) {
        throw new Error(`module exists: ${moduleName}`);
      }
      // target dir
      const targetDir = await this.helper.ensureDir(path.join(argv.projectPath, 'src/module', moduleName));
      if (!argv.force && fs.existsSync(targetDir)) {
        throw new Error(`module exists: ${moduleName}`);
      }
      // template
      const template = argv.template;
      // templateDir
      const templateDir = this.template.resolvePath({
        moduleName: moduleInfo.relativeName,
        path: `create/${template}`,
      });
      if (template === 'module') {
        await this._create_template_module({ targetDir, templateDir });
      } else if (template === 'module-business') {
        await this._create_template_module_business({ targetDir, templateDir });
      }
    }

    async _create_template_module({ targetDir, templateDir }) {
      await this.template.renderDir({ targetDir, templateDir });
    }

    async _create_template_module_business({ targetDir, templateDir }) {
      const { argv } = this.context;
      argv.atomClassNameCapitalize = argv.atomClassName.replace(/^\S/, function (s) {
        return s.toUpperCase();
      });
      await this.template.renderDir({ targetDir, templateDir });
    }
  }

  return Cli;
};
