module.exports = (ctx, pageMode) => {
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
      // render
      await this.template.renderBoilerplateAndSnippets({
        targetDir,
        moduleName: moduleInfo.relativeName,
        snippetsPath: `create/${pageMode}/snippets`,
        boilerplatePath: `create/${pageMode}/boilerplate`,
      });
      // need not reload
      // ctx.app.meta.reload.now();
    }
  }

  return Cli;
};
