const _themesLocales = {};

module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Base {
    themes() {
      if (!_themesLocales[ctx.locale]) {
        _themesLocales[ctx.locale] = this._prepareThemes();
      }
      return _themesLocales[ctx.locale];
    }

    _prepareThemes() {
      const modules = {};
      for (const relativeName in ctx.app.meta.modules) {
        const module = ctx.app.meta.modules[relativeName];
        if (module.package.eggBornModule && module.package.eggBornModule.theme) {
          const _module = {
            name: relativeName,
            title: module.package.title || module.info.name,
            description: ctx.text(module.package.description),
            info: module.info,
          };
          _module.titleLocale = ctx.text(_module.title);
          modules[relativeName] = _module;
        }
      }
      return modules;
    }
  }
  return Base;
};
