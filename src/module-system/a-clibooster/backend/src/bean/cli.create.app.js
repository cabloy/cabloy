module.exports = ctx => {
  const moduleInfo = module.info;
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
      let appName = argv.appName;
      appName = appName.replace(appName[0], appName[0].toLowerCase());
      argv.appName = appName;
      argv.appNameCapitalize = appName.replace(appName[0], appName[0].toUpperCase());
      argv.appKey = `app${argv.appNameCapitalize}`;
      // render
      await this.template.renderBoilerplateAndSnippets({
        targetDir,
        moduleName: moduleInfo.relativeName,
        snippetsPath: 'create/app/snippets',
        boilerplatePath: 'create/app/boilerplate',
      });
      // reload
      ctx.app.meta.reload.now();
    }
  }

  return Cli;
};
