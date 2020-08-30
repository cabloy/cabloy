const semver = require('semver');
const chalk = require('chalk');
const mglob = require('egg-born-mglob');
const util = require('./util.js');

module.exports = function(loader) {

  // all modules
  const ebModules = loader.app.meta.modules = {};
  const ebModulesArray = loader.app.meta.modulesArray = [];
  const ebModulesMonkey = loader.app.meta.modulesMonkey = {};

  const _ebModulesLast = [];

  // parse/order modules
  orderModules(parseModules());
  // load modules
  loadModules();
  // monkey modules
  monkeyModules();
  // log modules
  logModules();

  function logModules() {
    if (loader.app.meta.inAgent) {
      for (const module of ebModulesArray) {
        console.log(module.info.fullName);
      }
    }
  }

  function loadModules() {
    for (const module of ebModulesArray) {
      module.main = loader.loadFile(module.js.backend, loader.app, module);
    }
  }

  function monkeyModules() {
    for (const module of ebModulesArray) {
      util.monkeyModule(ebModulesMonkey, 'moduleLoaded', { module });
    }
  }

  function orderModules(modules) {
    // 'a-version' first
    _pushModule(modules, 'a-version');
    // others
    for (const key in modules) {
      if (key !== 'a-version') {
        _pushModule(modules, key);
      }
    }
    // combine last
    for (const module of _ebModulesLast) {
      ebModulesArray.push(module);
    }
  }

  function _pushModule(modules, moduleRelativeName) {
    // module
    const module = modules[moduleRelativeName];
    if (module.__ordering) return;
    module.__ordering = true;

    // dependencies
    _orderDependencies(modules, module);

    // push this
    ebModules[moduleRelativeName] = module;
    if (module.package && module.package.eggBornModule && module.package.eggBornModule.last === true) {
      _ebModulesLast.push(module);
    } else {
      ebModulesArray.push(module);
    }
  }

  function _orderDependencies(modules, module) {
    if (!module.package.eggBornModule || !module.package.eggBornModule.dependencies) return;

    const dependencies = module.package.eggBornModule.dependencies;
    for (const key in dependencies) {
      const subModule = modules[key];
      if (!subModule) {
        console.warn(chalk.cyan(`module ${key} not exists`));
        process.exit(0);
      }

      const subModuleVersion = dependencies[key];
      if (semver.lt(subModule.package.version, subModuleVersion)) {
        console.warn(chalk.cyan(`module ${key} is old`));
        process.exit(0);
      }

      _pushModule(modules, key);
    }
  }

  function parseModules() {
    const modules = mglob.glob();
    for (const relativeName in modules) {
      const module = modules[relativeName];
      if (module.info.monkey) {
        ebModulesMonkey[relativeName] = module;
      }
    }
    return modules;
  }

  return ebModules;
};
