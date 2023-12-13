let __icons = null;

module.exports = ctx => {
  // const moduleInfo = module.info;
  class Icon extends ctx.app.meta.BeanModuleBase {
    constructor(moduleName) {
      super(ctx, 'icon');
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

    getIcons() {
      if (!__icons) {
        __icons = this._prepareIcons();
      }
      return __icons;
    }

    _prepareIcons() {
      const icons = {};
      for (const relativeName in ctx.app.meta.modules) {
        const module = ctx.app.meta.modules[relativeName];
        const groups = ctx.bean.util.getProperty(module.main.meta, 'icon.groups');
        if (groups) {
          icons[relativeName] = groups;
        }
      }
      return icons;
    }
  }

  return Icon;
};
