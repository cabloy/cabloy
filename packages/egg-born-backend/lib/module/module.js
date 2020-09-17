const path = require('path');
const mglob = require('egg-born-mglob');

module.exports = function(loader) {

  // all modules
  const { modules, modulesArray, modulesMonkey } = mglob.glob(
    path.join(loader.app.options.baseDir, '../..'),
    loader.app.config.disabledModules,
    !!loader.app.meta.inAgent
  );
  const ebModules = loader.app.meta.modules = modules;
  const ebModulesArray = loader.app.meta.modulesArray = modulesArray;
  const ebModulesMonkey = loader.app.meta.modulesMonkey = modulesMonkey;
  // load modules
  loadModules();
  // monkey modules
  monkeyModules();

  function loadModules() {
    for (const module of ebModulesArray) {
      module.main = loader.loadFile(module.js.backend, loader.app, module);
    }
  }

  function monkeyModules() {
    for (const module of ebModulesArray) {
      loader.app.meta.util.monkeyModule(ebModulesMonkey, 'moduleLoaded', { module });
    }
  }

  return ebModules;
};
