const _resourceTypes = {};

module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Base {
    resourceTypes() {
      if (!_resourceTypes[ctx.locale]) {
        _resourceTypes[ctx.locale] = this._prepareResourceTypes();
      }
      return _resourceTypes[ctx.locale];
    }

    _prepareResourceTypes() {
      const resourceTypes = {};
      for (const module of ctx.app.meta.modulesArray) {
        const moduleName = module.info.relativeName;
        const resources = module.main.meta && module.main.meta.base && module.main.meta.base.resources;
        if (!resources) continue;
        for (const key in resources) {
          const resource = resources[key];
          const fullKey = `${moduleName}:${key}`;
          resourceTypes[fullKey] = {
            ...resource,
            titleLocale: ctx.text(resource.title),
          };
        }
      }
      return resourceTypes;
    }
  }
  return Base;
};
