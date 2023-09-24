module.exports = function (loader, modules) {
  // load metas
  loadMetas();

  function loadMetas() {
    Object.keys(modules).forEach(key => {
      const module = modules[key];
      // module meta
      if (module.main.meta) {
        // metaNew is not used by now
        const metaNew = loader.app.meta.util.monkeyModule(
          loader.app.meta.appMonkey,
          loader.app.meta.modulesMonkey,
          'metaLoaded',
          {
            module,
            meta: module.main.meta,
          }
        );
        if (metaNew) {
          module.main.meta = metaNew;
        }
      }
    });
  }
};
