const fs = require('fs');
const path = require('path');

module.exports = ctx => {
  const moduleInfo = module.info;
  class Cli extends ctx.app.meta.CliBase(ctx) {
    async execute({ user }) {
      const { argv } = this.context;
      // super
      await super.execute({ user });
      // suite name/info
      const suiteName = argv.suite;
      if (suiteName) {
        argv.suiteInfo = this.helper.parseSuiteInfo(suiteName);
        // check if exists
        argv._suite = this.helper.findSuite(suiteName);
        if (!argv._suite) {
          throw new Error(`suite does not exist: ${suiteName}`);
        }
      }
      // module name/info
      const moduleName = argv.name;
      argv.moduleInfo = this.helper.parseModuleInfo(moduleName);
      // check if exists
      const _module = this.helper.findModule(moduleName);
      if (!argv.force && _module) {
        throw new Error(`module exists: ${moduleName}`);
      }
      // target dir
      let targetDir;
      if (suiteName) {
        targetDir = path.join(argv._suite.root, 'modules', moduleName);
      } else {
        targetDir = path.join(argv.projectPath, 'src/module', moduleName);
      }
      if (!argv.force && fs.existsSync(targetDir)) {
        throw new Error(`module exists: ${moduleName}`);
      }
      targetDir = await this.helper.ensureDir(targetDir);
      // template
      const template = argv.template;
      // templateDir
      const templateDir = this.template.resolvePath({
        moduleName: moduleInfo.relativeName,
        path: `create/${template}`,
      });
      // render
      await this.template.renderDir({ targetDir, templateDir });
      // npm install
      await this.helper.lernaBootstrap();
      // reload
      ctx.app.meta.reload.now();
    }
  }

  return Cli;
};
