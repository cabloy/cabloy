const path = require('path');
const mglob = require('egg-born-mglob');

module.exports = function (loader) {
  // all modules
  const { suites, modules, modulesArray, modulesMonkey } = mglob.glob({
    projectPath: path.join(loader.app.options.baseDir, '../..'),
    disabledModules: loader.app.config.disabledModules,
    disabledSuites: loader.app.config.disabledSuites,
    log: !!loader.app.meta.inAgent,
    type: 'backend',
  });
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
