const path = require('path');
const fse = require('fs-extra');
const glob = require('glob');
const semver = require('semver');
const chalk = require('chalk');
const mparse = require('egg-born-mparse').default;

module.exports = {
  glob: eggBornMglob,
};

const __pathSuites = [
  {
    prefix: 'src/suite/',
    vendor: false,
  },
  {
    prefix: 'src/suite-vendor/',
    vendor: true,
  },
];

const __pathsModules = [
  {
    prefix: 'src/module/',
    public: false,
    fronts: [{ js: 'front/src/main.js' }, { js: 'dist/front.js' }],
    backends: [
      { js: 'backend/src/main.js', static: 'backend/static' },
      { js: 'dist/backend.js', static: 'dist/staticBackend' },
    ],
  },
  {
    prefix: 'src/module-system/',
    public: false,
    fronts: [{ js: 'front/src/main.js' }, { js: 'dist/front.js' }],
    backends: [
      { js: 'backend/src/main.js', static: 'backend/static' },
      { js: 'dist/backend.js', static: 'dist/staticBackend' },
    ],
  },
  {
    prefix: 'src/suite/*/modules/',
    public: false,
    fronts: [{ js: 'front/src/main.js' }, { js: 'dist/front.js' }],
    backends: [
      { js: 'backend/src/main.js', static: 'backend/static' },
      { js: 'dist/backend.js', static: 'dist/staticBackend' },
    ],
  },
  {
    prefix: 'src/module-vendor/',
    public: false,
    fronts: [{ js: 'dist/front.js' }, { js: 'front/src/main.js' }],
    backends: [
      { js: 'dist/backend.js', static: 'dist/staticBackend' },
      { js: 'backend/src/main.js', static: 'backend/static' },
    ],
  },
  {
    prefix: 'src/suite-vendor/*/modules/',
    public: false,
    fronts: [{ js: 'dist/front.js' }, { js: 'front/src/main.js' }],
    backends: [
      { js: 'dist/backend.js', static: 'dist/staticBackend' },
      { js: 'backend/src/main.js', static: 'backend/static' },
    ],
  },
  {
    prefix: 'node_modules/egg-born-module-',
    public: true,
    fronts: [{ js: 'dist/front.js' }, { js: 'front/src/main.js' }],
    backends: [
      { js: 'dist/backend.js', static: 'dist/staticBackend' },
      { js: 'backend/src/main.js', static: 'backend/static' },
    ],
  },
];

function eggBornMglob(projectPath, disabledModules, disabledSuites, log) {
  // context
  const context = {
    suites: {},
    modules: {},
    modulesArray: [],
    modulesLast: [],
    //
    modulesLocal: {},
    modulesGlobal: {},
    modulesMonkey: {},
    //
    suitesLocal: {},
    suitesVendor: {},
    //
    disabledModules: __getDisabledModules(disabledModules),
    disabledSuites: __getDisabledSuites(disabledSuites),
  };

  // parse suites
  const suites = __parseSuites(projectPath);
  // parse modules
  const modules = __parseModules(projectPath);
  // bind suites modules
  __bindSuitesModules(suites, modules);

  // check suites
  __checkSuites(context, suites);

  // order
  __orderModules(context, modules);
  // log
  __logModules(context, log);
  __logSuites(context, log);

  // ok
  return {
    suites: context.suites,
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
  for (const __path of __pathsModules) {
    const prefix = `${projectPath}/${__path.prefix}`;
    const filePkgs = glob.sync(`${prefix}*/package.json`);
    for (const filePkg of filePkgs) {
      // name
      const name = filePkg.split('/').slice(-2)[0];
      if (!__path.public && name.indexOf('egg-born-module-') > -1) {
        throw new Error(`Should use relative name for local module: ${name}`);
      }
      // info
      const info = mparse.parseInfo(name, 'module');
      if (!info) {
        throw new Error(`module name is not valid: ${name}`);
      }
      info.public = __path.public;
      // check if exists
      if (!modules[info.relativeName]) {
        // meta
        const _package = require(filePkg);
        const root = path.dirname(filePkg);
        const moduleMeta = {
          name,
          info,
          root,
          pkg: filePkg,
          package: _package,
          js: {},
          static: {},
        };
        const _moduleMeta = __parseModule(__path, moduleMeta);
        if (_moduleMeta) {
          // enhance check public
          // if (_moduleMeta.info.public) {
          const file = _moduleMeta.js.front || _moduleMeta.js.backend;
          _moduleMeta.info.public = file.replace(/\\/g, '/').indexOf('/dist/') > -1;
          // }
          // record
          modules[info.relativeName] = _moduleMeta;
        }
      }
    }
  }
  return modules;
}

function __parseModule(__path, moduleMeta) {
  const root = moduleMeta.root;
  // front
  for (const item of __path.fronts) {
    const file = path.join(root, item.js);
    if (fse.existsSync(file)) {
      moduleMeta.js.front = file;
      break;
    }
  }
  // backend
  for (const item of __path.backends) {
    const file = path.join(root, item.js);
    if (fse.existsSync(file)) {
      moduleMeta.js.backend = file;
      const staticBackendPath = path.normalize(path.join(root, item.static));
      moduleMeta.static.backend = staticBackendPath;
      break;
    }
  }
  // check if empty
  if (!moduleMeta.js.front || !moduleMeta.js.backend) return null;
  // ok
  return moduleMeta;
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
  // console.log('\n');
}

function __logSuites(context, log) {
  for (const suiteName in context.suites) {
    const suite = context.suites[suiteName];
    if (suite.info.vendor) {
      context.suitesVendor[suiteName] = suite;
    } else {
      context.suitesLocal[suiteName] = suite;
    }
  }
  if (!log) return;
  // log
  console.log(chalk.yellow('\n=== Local Suites ==='));
  for (const key in context.suitesLocal) {
    console.log(chalk.cyan('> ' + key));
  }
  console.log(chalk.yellow('\n=== Vendor Suites ==='));
  for (const key in context.suitesVendor) {
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

function __getDisabledSuites(disabledSuites) {
  const disabledSuitesMap = {};
  if (disabledSuites && disabledSuites.length > 0) {
    for (const suiteName of disabledSuites) {
      disabledSuitesMap[suiteName] = true;
    }
  }
  return disabledSuitesMap;
}

function __parseSuites(projectPath) {
  const suites = {};
  for (const __path of __pathSuites) {
    const prefix = `${projectPath}/${__path.prefix}`;
    const filePkgs = glob.sync(`${prefix}*/package.json`);
    for (const filePkg of filePkgs) {
      // name
      const name = filePkg.split('/').slice(-2)[0];
      // info
      const info = mparse.parseInfo(name, 'suite');
      if (!info) {
        throw new Error(`suite name is not valid: ${name}`);
      }
      info.vendor = __path.vendor;
      // check if exists
      if (!suites[info.relativeName]) {
        // meta
        const _package = require(filePkg);
        const root = path.dirname(filePkg);
        suites[info.relativeName] = {
          name,
          info,
          root,
          pkg: filePkg,
          package: _package,
          modules: [],
        };
      }
    }
  }
  // ok
  return suites;
}

const __suite_pattern1 = /src\/suite\/([^\/]+)\/modules/;
const __suite_pattern2 = /src\/suite-vendor\/([^\/]+)\/modules/;
function __bindSuitesModules(suites, modules) {
  for (const moduleName in modules) {
    const module = modules[moduleName];
    // check
    let res = module.root.match(__suite_pattern1);
    if (!res) {
      res = module.root.match(__suite_pattern2);
    }
    if (!res) continue;
    // suiteName
    const suiteName = res[1];
    // bind
    module.suite = suiteName;
    suites[suiteName].modules.push(moduleName);
  }
}

function __checkSuites(context, suites) {
  for (const key in suites) {
    const suite = suites[key];
    // check if disable
    if (!context.disabledSuites[key]) {
      context.suites[key] = suite;
    } else {
      // disabledModules
      for (const moduleName of suite.modules) {
        context.disabledModules[moduleName] = true;
      }
    }
  }
}
