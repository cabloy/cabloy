const path = require('path');
const fse = require('fs-extra');
const semver = require('semver');
const chalk = require('chalk');
const boxen = require('boxen');
const eggBornUtils = require('egg-born-utils');
const mparse = require('egg-born-mparse').default;

const boxenOptions = { padding: 1, margin: 1, align: 'center', borderColor: 'yellow', borderStyle: 'round' };

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
    vendor: false,
    public: false,
    fronts: [{ js: 'front/src/main.js' }, { js: 'dist/front.js' }],
    backends: [
      { js: 'backend/src/main.js', static: 'backend/static' },
      { js: 'dist/backend.js', static: 'dist/staticBackend' },
    ],
  },
  {
    prefix: 'src/module-system/',
    vendor: false,
    public: false,
    fronts: [{ js: 'front/src/main.js' }, { js: 'dist/front.js' }],
    backends: [
      { js: 'backend/src/main.js', static: 'backend/static' },
      { js: 'dist/backend.js', static: 'dist/staticBackend' },
    ],
  },
  {
    prefix: 'src/suite/*/modules/',
    vendor: false,
    public: false,
    fronts: [{ js: 'front/src/main.js' }, { js: 'dist/front.js' }],
    backends: [
      { js: 'backend/src/main.js', static: 'backend/static' },
      { js: 'dist/backend.js', static: 'dist/staticBackend' },
    ],
  },
  {
    prefix: 'src/module-vendor/',
    vendor: true,
    public: false,
    fronts: [{ js: 'dist/front.js' }, { js: 'front/src/main.js' }],
    backends: [
      { js: 'dist/backend.js', static: 'dist/staticBackend' },
      { js: 'backend/src/main.js', static: 'backend/static' },
    ],
  },
  {
    prefix: 'src/suite-vendor/*/modules/',
    vendor: true,
    public: false,
    fronts: [{ js: 'dist/front.js' }, { js: 'front/src/main.js' }],
    backends: [
      { js: 'dist/backend.js', static: 'dist/staticBackend' },
      { js: 'backend/src/main.js', static: 'backend/static' },
    ],
  },
  {
    prefix: 'node_modules/egg-born-module-',
    vendor: true,
    public: true,
    node_modules: true,
    fronts: [{ js: 'dist/front.js' }, { js: 'front/src/main.js' }],
    backends: [
      { js: 'dist/backend.js', static: 'dist/staticBackend' },
      { js: 'backend/src/main.js', static: 'backend/static' },
    ],
  },
];

// type: front/backend/all
function eggBornMglob(options) {
  const { projectPath, disabledModules, disabledSuites, log, type } = options;
  // context
  const context = {
    options,
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
  const modules = __parseModules(projectPath, type);
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
    //
    suitesLocal: context.suitesLocal,
    suitesVendor: context.suitesVendor,
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
  if (!__orderDependencies(context, modules, module, moduleRelativeName)) {
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

function __orderDependencies(context, modules, module, moduleRelativeName) {
  if (context.options.disableCheckDependencies) return true;
  if (!module.package.eggBornModule || !module.package.eggBornModule.dependencies) return true;

  let enabled = true;

  const dependencies = module.package.eggBornModule.dependencies;
  for (const key in dependencies) {
    const subModule = modules[key];
    if (!subModule) {
      const message =
        chalk.keyword('orange')(`module ${moduleRelativeName} disabled`) +
        ', because ' +
        chalk.keyword('cyan')(`module ${key} not exists`);
      console.log('\n' + boxen(message, boxenOptions) + '\n');
      enabled = false; // process.exit(0);
      continue;
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

function __parseModules(projectPath, type) {
  const modules = {};
  for (const __path of __pathsModules) {
    const prefix = `${projectPath}/${__path.prefix}`;
    const filePkgs = eggBornUtils.tools.globbySync(`${prefix}*/package.json`);
    for (let filePkg of filePkgs) {
      // name
      let name = filePkg.split('/').slice(-2)[0];
      // check if '-' prefix exists
      if (name.substring(0, 1) === '-') {
        // skip
        continue;
      }
      // check if full name
      if (!__path.public && name.indexOf('egg-born-module-') > -1) {
        const pathSrc = path.join(prefix, name);
        name = name.substring('egg-born-module-'.length);
        filePkg = path.join(prefix, name, 'package.json');
        const pathDest = path.join(prefix, name);
        fse.moveSync(pathSrc, pathDest);
        // throw new Error(`Should use relative name for local module: ${name}`);
      }
      // info
      const info = mparse.parseInfo(name, 'module');
      if (!info) {
        throw new Error(`module name is not valid: ${name}`);
      }
      info.vendor = __path.vendor;
      info.public = __path.public;
      info.node_modules = __path.node_modules;
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
        const _moduleMeta = __parseModule(__path, moduleMeta, type);
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

function __parseModule(__path, moduleMeta, type) {
  const root = moduleMeta.root;
  // front
  if (type !== 'backend') {
    for (const item of __path.fronts) {
      const file = path.join(root, item.js);
      if (fse.existsSync(file)) {
        moduleMeta.js.front = file;
        break;
      }
    }
    if (!moduleMeta.js.front) {
      return null;
    }
  }
  // backend
  if (type !== 'front') {
    for (const item of __path.backends) {
      const file = path.join(root, item.js);
      if (fse.existsSync(file)) {
        moduleMeta.js.backend = file;
        const staticBackendPath = path.normalize(path.join(root, item.static));
        moduleMeta.static.backend = staticBackendPath;
        break;
      }
    }
    if (!moduleMeta.js.backend) {
      return null;
    }
  }
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
  console.log(chalk.keyword('orange')(`\n=== Total Modules: ${context.modulesArray.length} ===`));
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
  console.log(chalk.keyword('orange')(`\n=== Total Suites: ${Object.keys(context.suites).length} ===`));
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
    const filePkgs = eggBornUtils.tools.globbySync(`${prefix}*/package.json`);
    for (let filePkg of filePkgs) {
      // name
      let name = filePkg.split('/').slice(-2)[0];
      // check if '-' prefix exists
      if (name.substring(0, 1) === '-') {
        // skip
        continue;
      }
      // check if full name
      if (name.indexOf('egg-born-suite-') > -1) {
        const pathSrc = path.join(prefix, name);
        name = name.substring('egg-born-suite-'.length);
        filePkg = path.join(prefix, name, 'package.json');
        const pathDest = path.join(prefix, name);
        fse.moveSync(pathSrc, pathDest);
        // throw new Error(`Should use relative name for local suite: ${name}`);
      }
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
    const suite = suites[suiteName];
    if (!suite) {
      // means disabled
      delete modules[moduleName];
    } else {
      // bind
      module.suite = suiteName;
      suite.modules.push(moduleName);
    }
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
