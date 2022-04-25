const fs = require('fs');
const path = require('path');

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Cli extends ctx.app.meta.CliBase(ctx) {
    get localToken() {
      return ctx.bean.local.module('a-authopen').token;
    }

    async execute({ command, context, user }) {
      const { argv } = context;
      // super
      await super.execute({ command, context, user });
      // target dir
      const targetDir = await this.helper.ensureDir(path.join(argv.projectPath, argv._[0]));
      if (!argv.force && fs.existsSync(targetDir)) {
        throw new Error(`module exists: ${argv.name}`);
      }
      // template
      const template = argv.template;
      // templateDir
      const templateDir = this.template.getTemplateDir({
        module: moduleInfo.relativeName,
        path: `create/${template}`,
      });
      if (template === 'module') {
        await this._create_template_module({ context, targetDir, templateDir });
      }
    }

    async _create_template_module({ context, targetDir, templateDir }) {
      await this.template.renderDir({ context, targetDir, templateDir });
    }
  }

  return Cli;
};
