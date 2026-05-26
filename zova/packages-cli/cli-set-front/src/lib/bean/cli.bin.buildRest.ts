import type { ZovaConfigMeta, ZovaMetaAppMode, ZovaMetaFlavor, ZovaMetaMode } from '@cabloy/module-info';
import type { ZovaViteConfigOptions } from 'zova-vite';

import { BeanCliBase } from '@cabloy/cli';
import { camelToKebab } from '@cabloy/word-utils';
import fse from 'fs-extra';
import path from 'node:path';
import { rimraf } from 'rimraf';
import { build } from 'tsdown';
import yaml from 'yaml';
import { createConfigUtils, saveJSONFile } from 'zova-vite';

import { loadJSONFile } from '../common/utils.ts';
import { __ThisSetName__ } from '../this.ts';

function svgResolverPlugin() {
  return {
    name: 'svg-resolver',
    resolveId: {
      filter: { id: /\.svg$/ },
      handler(source, importer) {
        return path.resolve(path.dirname(importer), source);
      },
    },
    load: {
      filter: { id: /\.svg$/ },
      handler(_id) {
        return 'export default {};';
      },
    },
  };
}

declare module '@cabloy/cli' {
  interface ICommandArgv {
    flavor?: ZovaMetaFlavor;
    Modules: string;
    Name: string;
    Version: string;
  }
}

interface IBinBuildRestContext {
  projectPath: string;
  flavor: ZovaMetaFlavor;
  bundleName: string;
  bundleNameCopy: string;
  srcDir: string;
  outDir: string;
  bundleModules?: string[];
}

export class CliBinBuildRest extends BeanCliBase {
  async execute() {
    const { argv } = this.context;
    // super
    await super.execute();
    const projectPath = argv.projectPath;
    //
    const flavor = argv.flavor || 'admin';
    const bundleName = `zova-rest-${camelToKebab(flavor)}`;
    const bundleNameCopy = `${camelToKebab(flavor)}`;
    //
    const srcDir = path.join(projectPath, '.zova-rest');
    const outDir = path.join(projectPath, 'dist', `rest-${flavor}`);
    await rimraf(srcDir);
    await fse.ensureDir(srcDir);
    await rimraf(outDir);
    // context
    const context: IBinBuildRestContext = {
      projectPath,
      flavor,
      bundleName,
      bundleNameCopy,
      srcDir,
      outDir,
    };
    //
    await this._prepareResources(context);
    await this._build(context);
    //
    await rimraf(srcDir);
  }

  async _prepareResources(context: IBinBuildRestContext) {
    const { projectPath, flavor, bundleName, srcDir } = context;
    const { argv } = this.context;
    //
    const mode: ZovaMetaMode = 'production';
    const appMode: ZovaMetaAppMode = 'ssr';
    const configMeta: ZovaConfigMeta = { flavor, mode, appMode };
    const configOptions: ZovaViteConfigOptions = {
      appDir: projectPath,
      runtimeDir: '.zova',
    };
    const configUtils = createConfigUtils(configMeta, configOptions);
    // env
    const env = configUtils.loadEnvs();
    // modulesMeta
    const modulesMeta = await configUtils.loadModulesMeta();
    // Modules
    const modules: string[] = [];
    const bundleModules: string[] = [];
    for (const module of modulesMeta.modulesArray) {
      modules.push(`export * from '${module.info.fullName}';`);
      const moduleRoot = module.root.replaceAll('\\', '/');
      if (moduleRoot.includes('/src/module/') || moduleRoot.includes('/src/suite/')) {
        bundleModules.push(module.info.fullName);
      }
    }
    context.bundleModules = bundleModules;
    argv.Modules = modules.join('\n');
    // Name/Version
    argv.Name = bundleName;
    argv.Version = env.APP_VERSION;
    // templateDir
    const templateDir = this.template.resolveTemplatePath(__ThisSetName__, 'rest');
    // render
    await this.template.renderDir(srcDir, templateDir);
  }

  async _buildTs({ srcDir, outDir }: IBinBuildRestContext) {
    // entry
    const entry = path.join(srcDir, 'index.ts');
    // build
    await build({
      entry: [entry],
      format: ['esm'],
      outDir,
      tsconfig: 'tsconfig.rest.json',
      plugins: [svgResolverPlugin()],
      deps: {
        alwaysBundle: (_id: string) => {
          return false;
        },
      },
      // minify: true,
    });
    const fileIndex = path.join(outDir, 'index.mjs');
    let fileContent = (await fse.readFile(fileIndex)).toString();
    fileContent = fileContent.replace(/import[\s\S]*?"[^"]*";/g, '').replace(/export[\s\S]*?"[^"]*";/g, '');
    await fse.writeFile(fileIndex, fileContent);
  }

  async _buildDts({ srcDir, outDir, bundleModules }: IBinBuildRestContext) {
    // entry
    const entry = path.join(srcDir, 'index.ts');
    // build
    await build({
      entry: [entry],
      format: ['esm'],
      outDir,
      tsconfig: 'tsconfig.rest.json',
      clean: false,
      dts: {
        // resolve: true,
        resolver: 'tsc',
        tsgo: true,
        eager: true,
        tsconfig: 'tsconfig.rest.json',
        emitDtsOnly: true,
      },
      plugins: [svgResolverPlugin()],
      deps: {
        alwaysBundle: (id: string) => {
          if (bundleModules!.includes(id)) return true;
          return false;
        },
      },
      // minify: true,
    });
  }

  async _build(buildContext: IBinBuildRestContext) {
    const { projectPath, flavor, bundleNameCopy, srcDir, outDir } = buildContext;
    // build
    await this._buildTs(buildContext);
    await this._buildDts(buildContext);
    // deps
    const deps = await _extractDeps(path.join(outDir, 'index.d.mts'));
    const depsVersion = await _extractDepsVersion(projectPath, deps);
    // package.json
    const pkgContent = await loadJSONFile(path.join(srcDir, 'package.json'));
    pkgContent.dependencies = depsVersion;
    await saveJSONFile(path.join(outDir, 'package.json'), pkgContent);
    // await fse.copyFile(path.join(srcDir, 'package.json'), path.join(outDir, 'package.json'));
    // release
    const outReleasesDir = path.join(projectPath, 'dist-releases', `rest-${flavor}-${process.env.APP_VERSION}`);
    await fse.copy(outDir, outReleasesDir);
    // copy
    _copyToTarget(outDir, process.env.BUILD_REST_COPY_DIST, bundleNameCopy);
  }
}

function _copyToTarget(outDir: string, target: string | undefined, bundleNameCopy: string) {
  if (!target) return;
  const dirs = target.split(',');
  for (const dir of dirs) {
    const outReleasesDirCopy = path.join(dir, bundleNameCopy);
    fse.removeSync(outReleasesDirCopy);
    fse.copySync(outDir, outReleasesDirCopy, { preserveTimestamps: true });
  }
}

async function _extractDeps(filePath: string): Promise<string[]> {
  let content = (await fse.readFile(filePath)).toString();
  const pos = content.indexOf('//#region');
  content = content.substring(0, pos);
  const packageNames = new Set();
  const re = /import\s+[\s\S]*?\s+from\s+['"]([^'"]+)['"]/g;

  let match: any;
  while (true) {
    match = re.exec(content);
    if (!match) break;
    let pkg: string = match[1];
    if (pkg.startsWith('.') || pkg.startsWith('/')) continue;
    if (pkg.startsWith('@')) {
      if (pkg.split('/').length > 2) {
        pkg = pkg.split('/').slice(0, 2).join('/');
      }
    } else {
      if (pkg.split('/').length > 1) {
        pkg = pkg.split('/').slice(0, 1).join('/');
      }
    }
    packageNames.add(pkg);
  }
  return Array.from(packageNames).sort() as string[];
}

async function _extractDepsVersion(projectPath: string, deps: string[]) {
  const lockfilePath = path.join(projectPath, 'pnpm-lock.yaml');
  const lockfileContent = (await fse.readFile(lockfilePath)).toString();
  const parsedLockfile = yaml.parse(lockfileContent);
  const depsVersion = {};
  for (const dep of deps) {
    let version = getPackageVersionFromLock(parsedLockfile, dep);
    if (!version) {
      version = await getPackageVersionFromNodeModules(projectPath, dep);
    }
    if (!version) {
      console.warn('dep version not found: ', dep);
      continue;
    }
    depsVersion[dep] = `^${version}`;
  }
  return depsVersion;
}

function getPackageVersionFromLock(parsedLockfile: any, packageName: string) {
  const packages = parsedLockfile.packages || {};

  for (const key in packages) {
    if (key.startsWith(`${packageName}@`)) {
      return key.substring(`${packageName}@`.length);
    }
  }

  return null;
}

async function getPackageVersionFromNodeModules(projectPath: string, packageName: string) {
  const pkgFile = path.join(projectPath, 'node_modules', packageName, 'package.json');
  if (!fse.existsSync(pkgFile)) return null;
  const pkgContent = await loadJSONFile(pkgFile);
  return pkgContent.version;
}
