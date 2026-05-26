import type { IModule, IModulePackage } from '@cabloy/module-info';
import type { Stats } from 'fs-extra';

import DeepEqual from 'deep-equal';
import fse from 'fs-extra';
import { globby } from 'globby';
import path from 'node:path';
import semver from 'semver';

import type { BeanCliBase } from './bean.cli.base.ts';

type TypeDeps = Record<string, string>;

export class LocalCommon {
  cli: BeanCliBase;

  constructor(cli) {
    this.cli = cli;
  }

  async _generateTypeModulesFile(projectPath: string) {
    const pathName = this.cli.context.brandName === 'zova' ? 'front' : 'backend';
    const typeFile = path.join(projectPath, `src/${pathName}/typing/modules.d.ts`);
    let content = '';
    // // all suites
    // for (const key in this.modulesMeta.suites) {
    //   const suite = this.modulesMeta.suites[key];
    //   content += `import '${suite.package.name}';\n`;
    // }
    // all modules
    this.cli.modulesMeta.modulesArray.forEach(module => {
      content += `import '${module.package.name}';\n`;
    });
    await fse.writeFile(typeFile, content);
    const typeFileStat = await fse.stat(typeFile);
    // all modules: type file
    const promises: Promise<void>[] = [];
    for (const module of this.cli.modulesMeta.modulesArray) {
      if (module.info.node_modules && !fse.existsSync(path.join(module.root, 'src/.metadata'))) {
        continue;
      }
      const moduleTypeFile = path.join(module.root, 'src/.metadata/modules.d.ts');
      promises.push(this._generateTypeModulesFileInner(typeFile, typeFileStat, moduleTypeFile));
    }
    await Promise.all(promises);
  }

  async _generateTypeModulesFileInner(
    typeFile: string,
    typeFileStat: Stats,
    moduleTypeFile: string,
  ) {
    const win = process.platform.startsWith('win');
    let needCreate = true;
    const exists = await fse.exists(moduleTypeFile);
    if (exists) {
      try {
        if (win) {
          const stat = await fse.stat(moduleTypeFile);
          if (stat.size === typeFileStat.size) {
            needCreate = false;
          }
        } else {
          const realFile = await fse.readlink(moduleTypeFile);
          if (realFile === typeFile) {
            needCreate = false;
          }
        }
      } catch {}
    }
    if (needCreate) {
      await fse.remove(moduleTypeFile);
      if (win) {
        await fse.copy(typeFile, moduleTypeFile);
      } else {
        await fse.ensureSymlink(typeFile, moduleTypeFile);
      }
    }
  }

  async _generatePackageJson(projectPath: string) {
    const pkgFile = path.join(projectPath, 'package.json');
    const pkgOriginalFile = path.join(projectPath, 'package.original.json');
    // check original
    if (!fse.existsSync(pkgOriginalFile)) {
      await fse.copyFile(pkgFile, pkgOriginalFile);
    }
    // prepare deps
    const { deps, depsDev } = await this._generatePackageJson_prepareDeps(projectPath);
    // pkg/pkgOriginal
    const pkgOriginal = await this.cli.helper.loadJSONFile(pkgOriginalFile);
    let pkg: IModulePackage | undefined;
    if (fse.existsSync(pkgFile)) {
      pkg = await this.cli.helper.loadJSONFile(pkgFile);
      // save back
      await this._generatePackageJson_saveBack(pkg!, pkgOriginal, pkgOriginalFile, deps, depsDev);
    }
    // generate pkg from pkgOriginal
    return await this._generatePackageJson_pkgFromPkgOriginal(
      projectPath,
      pkgOriginal,
      pkg,
      pkgFile,
      deps,
      depsDev,
    );
  }

  async _generatePackageJson_prepareDeps(_projectPath: string) {
    const deps: TypeDeps = {};
    const depsDev: TypeDeps = {};
    // all modules
    this.cli.modulesMeta.modulesArray.forEach(module => {
      const version = module.info.node_modules ? `^${module.package.version}` : 'workspace:^';
      deps[module.package.name] = version;
    });
    // all globalDependencies of modules
    this.cli.modulesMeta.modulesArray.forEach(module => {
      _collectModuleDevs(module, deps, 'dependencies', 'globalDependencies');
      _collectModuleDevs(module, depsDev, 'devDependencies', 'globalDependenciesDev');
    });
    // all modules of suites
    for (const suiteName in this.cli.modulesMeta.suites) {
      const suite = this.cli.modulesMeta.suites[suiteName];
      if (!suite.info.node_modules) continue;
      for (const moduleName in suite.package.dependencies) {
        const version = suite.package.dependencies[moduleName];
        const versionCurrent = deps[moduleName];
        if (!versionCurrent || semver.lt(versionCurrent.substring(1), version.substring(1))) {
          deps[moduleName] = version;
        }
      }
    }
    return { deps, depsDev };
  }

  async _generatePackageJson_pkgFromPkgOriginal(
    projectPath: string,
    pkgOriginal: IModulePackage,
    pkg: IModulePackage | undefined,
    pkgFile: string,
    deps: TypeDeps,
    depsDev: TypeDeps,
  ) {
    function _handleDeps(nameDependencies: string, deps: TypeDeps) {
      for (const key in deps) {
        const version = deps[key];
        if (!version) throw new Error(`${nameDependencies}.${key}.version should not be empty`);
        if (!pkgOriginal[nameDependencies][key]) {
          pkgOriginal[nameDependencies][key] = version;
        }
      }
    }
    _handleDeps('dependencies', deps);
    _handleDeps('devDependencies', depsDev);
    // zovaRest
    await this._generatePackageJson_pkgFromZovaRest(projectPath, pkgOriginal.dependencies);
    // save
    if (
      !DeepEqual((pkg as any)?.scripts, (pkgOriginal as any).scripts) ||
      !DeepEqual((pkg as any)?.dependencies, (pkgOriginal as any).dependencies) ||
      !DeepEqual((pkg as any)?.devDependencies, (pkgOriginal as any).devDependencies)
    ) {
      const strPkgOriginal = `${JSON.stringify(pkgOriginal, null, 2)}\n`;
      await fse.writeFile(pkgFile, strPkgOriginal);
      await this.cli.helper.formatFile({ fileName: pkgFile });
      await this.cli.helper.pnpmInstall();
      return true;
    }
    return false;
  }

  async _generatePackageJson_pkgFromZovaRest(projectPath: string, devDependencies: {}) {
    if (this.cli.context.brandName !== 'vona') return;
    const targetDir = path.join(projectPath, '.zova-rest');
    const bundles = await globby('*', { cwd: targetDir, onlyDirectories: true });
    for (const bundle of bundles) {
      const name = `zova-rest-${bundle}`;
      devDependencies[name] = `file:./.zova-rest/${bundle}`;
    }
  }

  async _generatePackageJson_saveBack(
    pkg: IModulePackage,
    pkgOriginal: IModulePackage,
    pkgOriginalFile: string,
    deps: TypeDeps,
    depsDev: TypeDeps,
  ) {
    let changed = false;
    for (const key of ['version', 'gitHead']) {
      if (pkgOriginal[key] !== pkg[key]) {
        pkgOriginal[key] = pkg[key];
        changed = true;
      }
    }
    function _handleDeps(nameDependencies: string, deps: TypeDeps) {
      const moduleDeps = pkg[nameDependencies];
      const moduleDepsOriginal = pkgOriginal[nameDependencies];
      for (const key in moduleDeps) {
        const version = moduleDeps[key];
        if (moduleDepsOriginal[key] && moduleDepsOriginal[key] === version) continue;
        const isZovaRest = key.includes('zova-rest-');
        const isModule = key.includes('vona-module-') || key.includes('zova-module-');
        const isModuleWorkspace = isModule && version.startsWith('workspace:');
        if (isZovaRest && version.includes('file:')) continue;
        if (isModuleWorkspace) continue;
        // if (deps[key] && !isModule) continue;
        if (isModule) continue;
        if (deps[key]) continue;
        moduleDepsOriginal[key] = version;
        changed = true;
      }
    }
    _handleDeps('dependencies', deps);
    _handleDeps('devDependencies', depsDev);
    if (changed) {
      await this.cli.helper.saveJSONFile(pkgOriginalFile, pkgOriginal);
    }
  }
}

function _collectModuleDevs(
  module: IModule,
  deps: {},
  nameDependencies: string,
  nameGlobalDependencies: string,
) {
  const moduleDeps = module.package[nameDependencies];
  const globalDependencies =
    module.package.vonaModule?.[nameGlobalDependencies] ||
    module.package.zovaModule?.[nameGlobalDependencies];
  if (globalDependencies) {
    for (const key in globalDependencies) {
      let version = globalDependencies[key];
      if (version !== false) {
        if (version === true) {
          if (!moduleDeps)
            throw new Error(`${nameDependencies} not found: ${module.info.relativeName}`);
          version = moduleDeps[key];
        }
        deps[key] = version;
      }
    }
  }
  return deps;
}

// function _checkIfModuleOnlyDev(module: IModule) {
//   const meta = module.package.vonaModule?.capabilities?.meta || module.package.zovaModule?.capabilities?.meta;
//   if (!meta || !meta.mode) return false;
//   const modes = Array.isArray(meta.mode) ? meta.mode : [meta.mode];
//   return !modes.some(mode => ['prod', 'production'].includes(mode));
// }
