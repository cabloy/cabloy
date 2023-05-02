const _localeModules = {};

module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Base {
    localeModules() {
      if (!_localeModules[ctx.locale]) {
        _localeModules[ctx.locale] = this._prepareLocaleModules();
      }
      return _localeModules[ctx.locale];
    }

    _prepareLocaleModules() {
      const localeModules = [];
      for (const module of ctx.app.meta.modulesArray) {
        const locale = module.package.eggBornModule && module.package.eggBornModule.locale;
        if (!locale) continue;
        const locales = locale.split(',');
        if (locales.findIndex(item => item === ctx.locale) > -1) {
          localeModules.push(module.info.relativeName);
        }
      }
      return localeModules;
    }
  }
  return Base;
};
