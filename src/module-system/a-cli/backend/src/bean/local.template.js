module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Local {
    get moduleConfig() {
      return ctx.config.module(moduleInfo.relativeName);
    }

    get fileMapping() {
      return this.moduleConfig.template.fileMapping;
    }

    async outputDir({ templateDir, targetDir, scope }) {}
  }
  return Local;
};
