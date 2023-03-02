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
        throw new Error(`module does not exist: ${moduleName}`);
      }
      // target dir
      const targetDir = await this.helper.ensureDir(_module.root);
      // appName
      const appName = argv.appName.toLowerCase();
      argv.appName = appName;
      argv.appNameCapitalize = appName.toUpperCase();
      argv.appKey = `app${argv.appNameCapitalize}`;
      // render
      await this.template.renderBoilerplateAndSnippets({
        targetDir,
        moduleName: moduleInfo.relativeName,
        snippetsPath: 'create/controller/snippets',
        boilerplatePath: 'create/controller/boilerplate',
      });
      // reload
      ctx.app.meta.reload.now();
    }
  }

  return Cli;
};
