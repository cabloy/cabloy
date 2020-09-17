const path = require('path');
const glob = require('glob');
const semver = require('semver');
const chalk = require('chalk');
const mparse = require('egg-born-mparse').default;

module.exports = {
  glob: eggBornMglob,
};

const __paths = [
  { prefix: 'src/module/', public: false, jsFront: 'front/src/main.js,dist/front.js', jsBackend: 'backend/src/main.js,dist/backend.js', staticBackend: 'backend/src/static,dist/staticBackend' },
  { prefix: 'src/module-system/', public: false, jsFront: 'front/src/main.js,dist/front.js', jsBackend: 'backend/src/main.js,dist/backend.js', staticBackend: 'backend/src/static,dist/staticBackend' },
  { prefix: 'node_modules/egg-born-module-', public: true, jsFront: 'dist/front.js', jsBackend: 'dist/backend.js', staticBackend: 'dist/staticBackend' },
];

function eggBornMglob(projectPath, disabledModules, log) {
  // context
  const context = {
    modules: {},
    modulesArray: [],
    modulesLast: [],
    //
    modulesLocal: {},
    modulesGlobal: {},
    modulesMonkey: {},
    disabledModules: __getDisabledModules(disabledModules),
  };
  // parse
  const modules = __parseModules(projectPath);
  // order
  __orderModules(context, modules);
  // log
  __logModules(context, log);
  // ok
  return {
    modules: context.modules,
    modulesArray: context.modulesArray,
    //
    modulesLocal: context.modulesLocal,
    modulesGlobal: context.modulesGlobal,
    modulesMonkey: context.modulesMonkey,
  };
}

function __orderModules(context, modules) {
  // 'a-version' first
  __pushModule(context, modules, 'a-version');
  // others
  for (const key in modules) {
    if (key !== 'a-version') {
      __pushModule(context, modules, key);
    }
  }
  // combine last
  for (const module of context.modulesLast) {
    context.modulesArray.push(module);
  }
}

function __pushModule(context, modules, moduleRelativeName) {
  // check if disable
  if (context.disabledModules[moduleRelativeName]) return false;

  // module
  const module = modules[moduleRelativeName];
  if (module.__ordering) return true;
  module.__ordering = true;

  // dependencies
  if (!__orderDependencies(context, modules, module)) {
    context.disabledModules[moduleRelativeName] = true;
    return false;
  }

  // push this
  context.modules[moduleRelativeName] = module;
  if (module.package && module.package.eggBornModule && module.package.eggBornModule.last === true) {
    context.modulesLast.push(module);
  } else {
    context.modulesArray.push(module);
  }

  return true;
}

function __orderDependencies(context, modules, module) {
  if (!module.package.eggBornModule || !module.package.eggBornModule.dependencies) return true;

  let enabled = true;

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

    if (!__pushModule(context, modules, key)) {
      enabled = false;
    }
  }

  return enabled;
}

function __parseModules(projectPath) {
  const modules = {};
  for (const __path of __paths) {
    const jsFronts = __path.jsFront.split(',');
    const jsBackends = __path.jsBackend.split(',');
    const staticBackends = __path.staticBackend.split(',');
    for (const index in jsFronts) {
      const jsFront = jsFronts[index];
      const jsBackend = jsBackends[index];
      const staticBackend = staticBackends[index];
      const prefix = `${projectPath}/${__path.prefix}`;
      const files = glob.sync(`${prefix}*/${jsFront}`);
      for (const file of files) {
        // name
        const pos1 = prefix.length;
        const pos2 = file.indexOf('/', pos1);
        const name = file.substr(pos1, pos2 - pos1);
        if (!__path.public && name.indexOf('egg-born-module-') > -1) {
          throw new Error(`Should use relative name for private module: ${name}`);
        }
        // info
        const info = mparse.parseInfo(name);
        info.public = __path.public;
        if (!modules[info.relativeName]) {
          // more info
          const root = file.substr(0, file.length - jsFront.length - 1);
          const pkg = `${root}/package.json`;
          const _package = require(pkg);
          const jsFrontPath = file;
          const jsBackendPath = `${root}/${jsBackend}`;
          const staticBackendPath = path.normalize(`${root}/${staticBackend}`);
          // record
          modules[info.relativeName] = {
            name, info,
            root, pkg, package: _package,
            js: { front: jsFrontPath, backend: jsBackendPath },
            static: { backend: staticBackendPath },
          };
        }
      }
    }
  }
  return modules;
}

function __logModules(context, log) {
  for (const module of context.modulesArray) {
    const relativeName = module.info.relativeName;
    if (module.info.monkey) {
      context.modulesMonkey[relativeName] = module;
    }
    if (module.info.public) {
      context.modulesGlobal[relativeName] = module;
    } else {
      context.modulesLocal[relativeName] = module;
    }
  }
  if (!log) return;
  // log
  console.log('\n');
  console.log(chalk.yellow('\n=== Local Modules ==='));
  for (const key in context.modulesLocal) {
    console.log(chalk.cyan('> ' + key));
  }
  console.log(chalk.yellow('\n=== Global Modules ==='));
  for (const key in context.modulesGlobal) {
    console.log(chalk.cyan('> ' + key));
  }
  console.log(chalk.yellow('\n=== Monkey Modules ==='));
  for (const key in context.modulesMonkey) {
    console.log(chalk.cyan('> ' + key));
  }
  console.log('\n');
}

function __getDisabledModules(disabledModules) {
  const disabledModulesMap = {};
  if (disabledModules && disabledModules.length > 0) {
    for (const moduleName of disabledModules) {
      disabledModulesMap[moduleName] = true;
    }
  }
  return disabledModulesMap;
}
