module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);

  const __atomClass = {
    module: moduleInfo.relativeName,
    atomClassName: 'dict',
  };

  class Dict extends ctx.app.meta.BeanModuleBase {
    constructor(moduleName) {
      super(ctx, 'dict');
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

    get model() {
      return ctx.model.module(moduleInfo.relativeName).dict;
    }

    get modelDictContent() {
      return ctx.model.module(moduleInfo.relativeName).dictContent;
    }

    // options: translate/separator
    async find({ dictKey, code, options }) {
      options = options || { translate: false, separator: '/' };
    }
  }

  return Dict;
};
