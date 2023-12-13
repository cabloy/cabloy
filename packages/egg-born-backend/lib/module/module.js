const fse = require('fs-extra');
const path = require('path');
const is = require('is-type-of');
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

  // app monkey
  const pathAppMonkey = path.resolve(loader.appInfo.baseDir, 'config/monkey.js');
  let ebAppMonkey;
  if (fse.existsSync(pathAppMonkey)) {
    const AppMonkey = require(pathAppMonkey);
    ebAppMonkey = loader.app.meta.appMonkey = AppMonkey(loader.app);
  }

  return {
    loadModules() {
      // 1. require
      for (const module of ebModulesArray) {
        module.main = loader.requireFile(module.js.backend);
      }
      // 2. load
      for (const module of ebModulesArray) {
        if (is.function(module.main) && !is.class(module.main)) {
          module.main = module.main(loader.app, module);
        }
      }
      return ebModules;
    },
    monkeyModules(monkeyName) {
      for (const module of ebModulesArray) {
        loader.app.meta.util.monkeyModule(ebAppMonkey, ebModulesMonkey, monkeyName, { module });
      }
    },
  };
};
