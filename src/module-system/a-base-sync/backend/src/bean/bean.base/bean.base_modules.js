const _modulesLocales = {};

module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Base {
    modules() {
      if (!_modulesLocales[ctx.locale]) {
        _modulesLocales[ctx.locale] = this._prepareModules();
      }
      return _modulesLocales[ctx.locale];
    }

    _prepareModules() {
      const modules = {};
      for (const relativeName in ctx.app.meta.modules) {
        const module = ctx.app.meta.modules[relativeName];
        const _module = {
          name: relativeName,
          title: module.package.title || module.info.name,
          description: ctx.text(module.package.description),
          info: module.info,
        };
        const icon = module.package.eggBornModule && module.package.eggBornModule.icon;
        if (icon) {
          _module.icon = icon;
        }
        _module.titleLocale = ctx.text(_module.title);
        modules[relativeName] = _module;
      }
      return modules;
    }
  }
  return Base;
};
