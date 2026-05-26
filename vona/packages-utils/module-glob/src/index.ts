/* eslint-disable no-console */
import type { IModule, IModulePackage, ISuite, ISuiteModuleBase } from '@cabloy/module-info';

import { parseInfoPro } from '@cabloy/module-info';
import { checkMeta } from '@cabloy/utils';
import boxen from 'boxen';
import chalk from 'chalk';
import fse from 'fs-extra';
import { globbySync } from 'globby';
import path from 'node:path';
import semver from 'semver';

import type { IModuleGlobContext, IModuleGlobOptions } from './interface.ts';

import { getPathsMeta } from './meta.ts';

export * from './interface.ts';

const SymbolModuleOrdering = Symbol('SymbolModuleOrdering');

const boxenOptions: boxen.Options = {
  padding: 1,
  margin: 1,
  align: 'center',
  borderColor: 'yellow',
  borderStyle: 'round',
} as boxen.Options;

// type: front/backend
export async function glob(options: IModuleGlobOptions) {
  const { projectPath, disabledModules, disabledSuites, log, projectMode, meta } = options;
  // context
  const context: IModuleGlobContext = {
    options,
    suites: {},
    modules: {},
    modulesArray: [],
    modulesLast: [],
    //
    modulesLocal: {},
    modulesGlobal: {},
    modulesMonkey: {},
    modulesSync: {},
    modulesIcon: {},
    //
    suitesLocal: {},
    suitesVendor: {},
    //
    disabledModules: __getDisabledModules(disabledModules),
    disabledSuites: __getDisabledSuites(disabledSuites),
    meta,
    //
    pathsMeta: getPathsMeta(projectMode),
  };

  // parse suites
  const suites = __parseSuites(context, projectPath);
  // parse modules
  const modules = __parseModules(context, projectPath);
  // load package
  await __loadPackage(context, suites);
  await __loadPackage(context, modules);
  // bind suites modules
  __bindSuitesModules(suites, modules);

  // check suites
  __checkSuites(context, suites);

  // order
  __orderModules(context, modules);

  // check disables, after __orderModules
  __checkModulesDisables(context);

  // log
  __logModules(context, log);
  __logSuites(context, log);

  // ok
  return {
    suites: context.suites,
    modules: context.modules,
    modulesArray: context.modulesArray,
    //
    // modulesLocal: context.modulesLocal,
    // modulesGlobal: context.modulesGlobal,
    // modulesMonkey: context.modulesMonkey,
    //
    // suitesLocal: context.suitesLocal,
    // suitesVendor: context.suitesVendor,
  };
}

function getPackageModuleNode(projectMode) {
  return ['zova', 'vona'].includes(projectMode) ? `${projectMode}Module` : 'cabloyModule';
}

function __checkModulesDisables(context: IModuleGlobContext) {
  for (const key of Object.keys(context.modules)) {
    const module = context.modules[key];
    if (!module) continue;
    const disables = module.package.zovaModule?.disables ?? module.package.vonaModule?.disables;
    if (!disables) continue;
    for (const name of disables) {
      delete context.modules[name];
      const index = context.modulesArray.findIndex(item => item.info.relativeName === name);
      if (index > -1) {
        context.modulesArray.splice(index, 1);
      }
    }
  }
}

async function __loadPackage(
  context: IModuleGlobContext,
  modules: Record<string, ISuiteModuleBase>,
) {
  const promises: Promise<IModulePackage>[] = [];
  const modulesArray: string[] = [];
  for (const moduleName in modules) {
    const module = modules[moduleName];
    promises.push(fse.readFile(module.pkg) as unknown as Promise<IModulePackage>);
    modulesArray.push(moduleName);
  }
  const modulesPackage = await Promise.all(promises);
  for (let i = 0; i < modulesPackage.length; i++) {
    const moduleName = modulesArray[i];
    const module = modules[moduleName];
    module.package = JSON.parse(modulesPackage[i].toString());
    const moduleNode = getPackageModuleNode(context.options.projectMode);
    const capabilities = module.package[moduleNode]?.capabilities;
    module.info.capabilities = capabilities;
    module.info.onionsMeta = {
      onions: module.package[moduleNode]?.onions,
      metas: module.package[moduleNode]?.metas,
      onionsConfig: module.package[moduleNode]?.onionsConfig,
      beansPreload: module.package[moduleNode]?.beansPreload,
    };
  }
}

function __orderModules(context: IModuleGlobContext, modules: Record<string, IModule>) {
  // 'a-version' first
  if (modules['a-version']) {
    __pushModule(context, modules, 'a-version');
  }
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

function __pushModule(
  context: IModuleGlobContext,
  modules: Record<string, IModule>,
  moduleRelativeName,
) {
  // module
  const module = modules[moduleRelativeName];
  // check if disable
  if (context.disabledModules[moduleRelativeName]) return false;
  // check meta
  const capabilities =
    module.package.zovaModule?.capabilities ?? module.package.vonaModule?.capabilities;
  if (context.meta && capabilities && !checkMeta(capabilities.meta, context.meta)) return false;

  // ordering
  if (module[SymbolModuleOrdering]) return true;
  module[SymbolModuleOrdering] = true;

  // dependencies
  if (!__orderDependencies(context, modules, module, moduleRelativeName)) {
    context.disabledModules[moduleRelativeName] = true;
    return false;
  }

  // push this
  context.modules[moduleRelativeName] = module;
  const moduleNode = getPackageModuleNode(context.options.projectMode);
  if (module.package && module.package[moduleNode] && module.package[moduleNode].last === true) {
    context.modulesLast.push(module);
  } else {
    context.modulesArray.push(module);
  }

  return true;
}

function __orderDependencies(
  context: IModuleGlobContext,
  modules: Record<string, IModule>,
  module,
  moduleRelativeName,
) {
  if (context.options.disableCheckDependencies) return true;
  const moduleNode = getPackageModuleNode(context.options.projectMode);
  if (!module.package[moduleNode] || !module.package[moduleNode].dependencies) return true;

  let enabled = true;

  const dependencies = module.package[moduleNode].dependencies;
  for (const key in dependencies) {
    const subModule = modules[key];
    if (context.options.check !== false) {
      if (!subModule) {
        const message = `${chalk.keyword('orange')(`module ${moduleRelativeName} disabled`)}, because ${chalk.keyword(
          'cyan',
        )(`module ${key} not exists`)}`;
        console.log(`\n${boxen(message, boxenOptions)}\n`);
        enabled = false; // process.exit(0);
        continue;
      }

      const subModuleVersion = dependencies[key];
      if (semver.lt(subModule.package.version, subModuleVersion)) {
        console.warn(chalk.cyan(`module ${key} is old`));
        process.exit(0);
      }
    }

    if (subModule && !__pushModule(context, modules, key)) {
      enabled = false;
    }
  }

  return enabled;
}

function __parseModules(context: IModuleGlobContext, projectPath) {
  const modules: Record<string, IModule> = {};
  for (const __path of context.pathsMeta.modules) {
    const fileNames = globbySync(`${__path.prefix}*/package.json`, { cwd: projectPath });
    for (const fileName of fileNames) {
      const filePkg = path.join(projectPath, fileName);
      // name
      const name = fileName.split('/').slice(-2)[0];
      // check if '-' prefix exists
      if (name.substring(0, 1) === '-') {
        // skip
        continue;
      }
      // info
      const info = parseInfoPro(name, context.options.projectMode, 'module');
      if (!info) {
        throw new Error(`module name is not valid: ${name}`);
      }
      // check if exists
      if (modules[info.relativeName]) continue;
      // info
      info.vendor = __path.vendor;
      info.node_modules = __path.node_modules;
      info.originalName = name;
      // resource
      const root = path.dirname(filePkg);
      const module = {
        name,
        info,
        root,
        pkg: filePkg,
      } as IModule;
      // record
      modules[info.relativeName] = module;
    }
  }
  return modules;
}

function __logModules(context: IModuleGlobContext, log) {
  for (const module of context.modulesArray) {
    const relativeName = module.info.relativeName;
    if (module.info.capabilities?.monkey) {
      context.modulesMonkey[relativeName] = module;
    }
    if (module.info.capabilities?.sync) {
      context.modulesSync[relativeName] = module;
    }
    if (module.info.capabilities?.icon) {
      context.modulesIcon[relativeName] = module;
    }
    if (module.info.node_modules) {
      context.modulesGlobal[relativeName] = module;
    } else {
      context.modulesLocal[relativeName] = module;
    }
  }
  if (!log) return;
  // log
  console.log(chalk.yellow('\n=== Local Modules ==='));
  for (const key in context.modulesLocal) {
    console.log(chalk.cyan(`> ${key}`));
  }
  console.log(chalk.yellow('\n=== Global Modules ==='));
  for (const key in context.modulesGlobal) {
    console.log(chalk.cyan(`> ${key}`));
  }
  console.log(chalk.yellow('\n=== Monkey Modules ==='));
  for (const key in context.modulesMonkey) {
    console.log(chalk.cyan(`> ${key}`));
  }
  console.log(chalk.yellow('\n=== Sync Modules ==='));
  for (const key in context.modulesSync) {
    console.log(chalk.cyan(`> ${key}`));
  }
  console.log(chalk.yellow('\n=== Icon Modules ==='));
  for (const key in context.modulesIcon) {
    console.log(chalk.cyan(`> ${key}`));
  }
  console.log(chalk.keyword('orange')(`\n=== Total Modules: ${context.modulesArray.length} ===`));
  // console.log('\n');
}

function __logSuites(context: IModuleGlobContext, log) {
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
    console.log(chalk.cyan(`> ${key}`));
  }
  console.log(chalk.yellow('\n=== Vendor Suites ==='));
  for (const key in context.suitesVendor) {
    console.log(chalk.cyan(`> ${key}`));
  }
  console.log(
    chalk.keyword('orange')(`\n=== Total Suites: ${Object.keys(context.suites).length} ===`),
  );
  console.log('\n');
}

function __getDisabledModules(disabledModules?: string[] | string) {
  const disabledModulesMap = {};
  if (!disabledModules) return disabledModulesMap;
  if (typeof disabledModules === 'string') disabledModules = disabledModules.split(',');
  for (const moduleName of disabledModules) {
    disabledModulesMap[moduleName] = true;
  }
  return disabledModulesMap;
}

function __getDisabledSuites(disabledSuites?: string[] | string) {
  const disabledSuitesMap = {};
  if (!disabledSuites) return disabledSuitesMap;
  if (typeof disabledSuites === 'string') disabledSuites = disabledSuites.split(',');
  for (const suiteName of disabledSuites) {
    disabledSuitesMap[suiteName] = true;
  }
  return disabledSuitesMap;
}

function __parseSuites(context: IModuleGlobContext, projectPath) {
  const suites: Record<string, ISuite> = {};
  for (const __path of context.pathsMeta.suites) {
    const fileNames = globbySync(`${__path.prefix}*/package.json`, { cwd: projectPath });
    for (const fileName of fileNames) {
      const filePkg = path.join(projectPath, fileName);
      // name
      const name = fileName.split('/').slice(-2)[0];
      // check if '-' prefix exists
      if (name.substring(0, 1) === '-') {
        // skip
        continue;
      }
      // info
      const info = parseInfoPro(name, context.options.projectMode, 'suite');
      if (!info) {
        throw new Error(`suite name is not valid: ${name}`);
      }
      // check if exists
      if (suites[info.relativeName]) continue;
      // info
      info.vendor = __path.vendor;
      info.node_modules = __path.node_modules;
      info.originalName = name;
      // suite
      const root = path.dirname(filePkg);
      const suite = {
        name,
        info,
        root,
        pkg: filePkg,
        modules: [],
      } as unknown as ISuite;
      // record
      suites[info.relativeName] = suite;
    }
  }
  // ok
  return suites;
}

const __suite_pattern1 = /src\/suite\/([^/]+)\/modules/;
const __suite_pattern2 = /src\/suite-vendor\/([^/]+)\/modules/;
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

function __checkSuites(context: IModuleGlobContext, suites: Record<string, ISuite>) {
  for (const key in suites) {
    const suite = suites[key];
    // check if disable
    if (_checkSuiteValid(context, suites, key)) {
      context.suites[key] = suite;
    } else {
      // disabledModules
      for (const moduleName of suite.modules) {
        context.disabledModules[moduleName] = true;
      }
    }
  }
}

function _checkSuiteValid(
  context: IModuleGlobContext,
  suites: Record<string, ISuite>,
  suiteRelativeName: string,
): boolean {
  // suite
  const suite = suites[suiteRelativeName];
  // check if disable
  if (context.disabledSuites[suiteRelativeName]) return false;
  // check meta
  const capabilities =
    suite.package.zovaModule?.capabilities ?? suite.package.vonaModule?.capabilities;
  if (context.meta && capabilities && !checkMeta(capabilities.meta, context.meta)) return false;
  // ok
  return true;
}
