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
      // render boilerplate
      await this._renderBoilerplate({ targetDir });
      // apply snippets
      await this._applySnippets({ targetDir });
      // reload
      ctx.app.meta.reload.now();
    }

    async _renderBoilerplate({ targetDir }) {
      // templateDir
      const templateDir = this.template.resolvePath({
        moduleName: moduleInfo.relativeName,
        path: 'create/controller/boilerplate',
      });
      // render
      await this.template.renderDir({ targetDir, templateDir });
    }

    async _applySnippets({ targetDir }) {
      // snippetsDir
      const snippetsDir = this.template.resolvePath({
        moduleName: moduleInfo.relativeName,
        path: 'create/controller/snippets',
      });
      // render
      await this.template.applySnippets({ targetDir, snippetsDir });
    }
  }

  return Cli;
};
