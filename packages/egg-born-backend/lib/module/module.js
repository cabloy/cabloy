const path = require('path');
const mglob = require('egg-born-mglob');

module.exports = function (loader) {
  // all modules
  const { suites, modules, modulesArray, modulesMonkey } = mglob.glob(
    path.join(loader.app.options.baseDir, '../..'),
    loader.app.config.disabledModules,
    loader.app.config.disabledSuites,
    !!loader.app.meta.inAgent,
    'backend'
  );
  // eslint-disable-next-line
  const ebSuites = (loader.app.meta.suites = suites);
  const ebModules = (loader.app.meta.modules = modules);
  const ebModulesArray = (loader.app.meta.modulesArray = modulesArray);
  const ebModulesMonkey = (loader.app.meta.modulesMonkey = modulesMonkey);

  return {
    loadModules() {
      for (const module of ebModulesArray) {
        module.main = loader.loadFile(module.js.backend, loader.app, module);
      }
      return ebModules;
    },
    monkeyModules(monkeyName) {
      for (const module of ebModulesArray) {
        loader.app.meta.util.monkeyModule(ebModulesMonkey, monkeyName, { module });
      }
    },
  };
};
