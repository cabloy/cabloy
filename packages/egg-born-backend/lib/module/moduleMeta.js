module.exports = function (loader, modules) {
  // load metas
  loadMetas();

  function loadMetas() {
    Object.keys(modules).forEach(key => {
      const module = modules[key];
      // module meta
      if (module.main.meta) {
        const metaNew = loader.app.meta.util.monkeyModule(loader.app.meta.modulesMonkey, 'metaLoaded', {
          module,
          meta: module.main.meta,
        });
        if (metaNew) {
          module.main.meta = metaNew;
        }
      }
    });
  }
};
