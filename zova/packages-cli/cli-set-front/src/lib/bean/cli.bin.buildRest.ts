import type {
  ZovaConfigMeta,
  ZovaMetaAppMode,
  ZovaMetaFlavor,
  ZovaMetaMode,
} from '@cabloy/module-info';
import type { ZovaViteConfigOptions } from 'zova-vite';

import { BeanCliBase } from '@cabloy/cli';
import { camelToKebab } from '@cabloy/word-utils';
import fse from 'fs-extra';
import path from 'node:path';
import { rimraf } from 'rimraf';
import { build } from 'tsdown';
import {
  createConfigUtils,
  generateEntryFiles,
  resolveZovaViteContext,
  saveJSONFile,
} from 'zova-vite';

import { resolveRestBuildPaths, writeIsolatedRestTsconfig } from '../common/restBuildPaths.ts';
import { extractRestDependencies } from '../common/restDependencies.ts';
import { extractRestDependencyVersions } from '../common/restDependencyVersions.ts';
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

interface IBinBuildRestPackageJson {
  name: string;
  version: string;
  dependencies?: Record<string, string>;
  [key: string]: unknown;
}

interface IBinBuildRestContext {
  projectPath: string;
  flavor: ZovaMetaFlavor;
  bundleName: string;
  bundleNameCopy: string;
  srcDir: string;
  outDir: string;
  tsconfigPath: string;
  isolated: boolean;
  bundleModules?: string[];
  sideEffectImportModuleNames?: string[];
  moduleRoots?: string[];
  packageJson?: IBinBuildRestPackageJson;
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
    const { runtimeDir } = resolveZovaViteContext({ appDir: projectPath });
    const paths = await resolveRestBuildPaths(path.resolve(projectPath), flavor, runtimeDir);
    const { isolated, srcDir, outDir, tsconfigPath } = paths;
    if (!isolated) {
      const manifest = await loadJSONFile(path.join(projectPath, 'package.json'));
      if (Object.hasOwn(manifest.scripts ?? {}, 'build:isolated')) {
        const hook = manifest.scripts['build:isolated'];
        if (typeof hook !== 'string' || !hook.trim()) {
          throw new Error('The application build:isolated script must be a non-empty string');
        }
        if (!/^[a-z0-9][\w-]*$/i.test(flavor)) {
          throw new Error('Invalid isolated REST flavor');
        }
        await this.helper.spawnCmd({
          cmd: 'npm',
          args: ['run', 'build:isolated', '--', '--operation', 'rest', flavor],
          options: { cwd: projectPath },
        });
        return;
      }
    }
    await rimraf(srcDir);
    await fse.ensureDir(srcDir);
    await rimraf(outDir);
    if (isolated) await writeIsolatedRestTsconfig(path.resolve(projectPath), paths);
    // context
    const context: IBinBuildRestContext = {
      projectPath,
      flavor,
      bundleName,
      bundleNameCopy,
      srcDir,
      outDir,
      tsconfigPath,
      isolated,
    };
    //
    await this._prepareResources(context, runtimeDir);
    await this._build(context);
    //
    if (!isolated) await rimraf(srcDir);
  }

  async _prepareResources(context: IBinBuildRestContext, runtimeDir: string) {
    const { projectPath, flavor, bundleName, srcDir } = context;
    const { argv } = this.context;
    //
    const mode: ZovaMetaMode = 'production';
    const appMode: ZovaMetaAppMode = 'ssr';
    const configMeta: ZovaConfigMeta = { flavor, mode, appMode };
    const configOptions: ZovaViteConfigOptions = {
      appDir: projectPath,
      runtimeDir,
    };
    const configUtils = createConfigUtils(configMeta, configOptions);
    // env
    const env = configUtils.loadEnvs();
    // modulesMeta
    const modulesMeta = await configUtils.loadModulesMeta();
    if (context.isolated) {
      await generateEntryFiles(configMeta, configOptions, modulesMeta, env);
    }
    // Modules
    const modules: string[] = [];
    const bundleModules: string[] = [];
    const sideEffectImportModuleNames: string[] = [];
    const moduleRoots: string[] = [];
    for (const module of modulesMeta.modulesArray) {
      const moduleName = module.info.fullName;
      modules.push(`import '${moduleName}';`);
      modules.push(`export * from '${moduleName}';`);
      const moduleRoot = module.root.replaceAll('\\', '/');
      moduleRoots.push(moduleRoot);
      if (moduleRoot.includes('/src/module/') || moduleRoot.includes('/src/suite/')) {
        bundleModules.push(moduleName);
      } else {
        sideEffectImportModuleNames.push(moduleName);
      }
    }
    context.bundleModules = bundleModules;
    context.sideEffectImportModuleNames = sideEffectImportModuleNames;
    context.moduleRoots = moduleRoots;
    argv.Modules = modules.join('\n');
    // Name/Version
    argv.Name = bundleName;
    argv.Version = env.APP_VERSION;
    // templateDir
    const templateDir = this.template.resolveTemplatePath(__ThisSetName__, 'rest');
    // render
    await this.template.renderDir(srcDir, templateDir);
    context.packageJson = await loadJSONFile(path.join(srcDir, 'package.json'));
  }

  async _buildTs({ srcDir, outDir, tsconfigPath }: IBinBuildRestContext) {
    // entry
    const entry = path.join(srcDir, 'index.ts');
    // build
    await build({
      entry: [entry],
      format: ['esm'],
      outDir,
      tsconfig: tsconfigPath,
      dts: false,
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
    fileContent = fileContent
      .replace(/import[\s\S]*?"[^"]*";/g, '')
      .replace(/export[\s\S]*?"[^"]*";/g, '');
    await fse.writeFile(fileIndex, fileContent);
  }

  async _buildDts({
    srcDir,
    outDir,
    tsconfigPath,
    bundleModules,
    sideEffectImportModuleNames,
  }: IBinBuildRestContext) {
    // entry
    const entry = path.join(srcDir, 'index.ts');
    // build
    await build({
      entry: [entry],
      format: ['esm'],
      outDir,
      tsconfig: tsconfigPath,
      clean: false,
      checks: {
        namespaceConflict: false,
      },
      dts: {
        resolver: 'oxc',
        generator: 'tsgo',
        eager: true,
        tsconfig: tsconfigPath,
        emitDtsOnly: true,
      },
      plugins: [svgResolverPlugin()],
      deps: {
        alwaysBundle: (id: string) => {
          return bundleModules!.some(moduleName => {
            return id === moduleName || id.startsWith(`${moduleName}/`);
          });
        },
      },
      // minify: true,
    });
    await this._injectDtsImports(outDir, sideEffectImportModuleNames!);
  }

  async _injectDtsImports(outDir: string, sideEffectImportModuleNames: string[]) {
    const fileIndex = path.join(outDir, 'index.d.mts');
    let fileContent = (await fse.readFile(fileIndex)).toString();
    const imports = sideEffectImportModuleNames
      .filter(moduleName => !fileContent.includes(`import "${moduleName}";`))
      .map(moduleName => `import "${moduleName}";`);
    if (imports.length === 0) return;
    fileContent = `${imports.join('\n')}\n${fileContent}`;
    await fse.writeFile(fileIndex, fileContent);
  }

  async _build(buildContext: IBinBuildRestContext) {
    const { projectPath, flavor, bundleNameCopy, outDir, packageJson, moduleRoots } = buildContext;
    // build
    await this._buildTs(buildContext);
    await this._buildDts(buildContext);
    // deps
    const deps = await _extractDeps(path.join(outDir, 'index.d.mts'));
    const depsVersion = await extractRestDependencyVersions(projectPath, deps, moduleRoots);
    // package.json
    const pkgContent = {
      ...packageJson!,
      dependencies: depsVersion,
    };
    await saveJSONFile(path.join(outDir, 'package.json'), pkgContent);
    // await fse.copyFile(path.join(srcDir, 'package.json'), path.join(outDir, 'package.json'));
    // release
    if (!buildContext.isolated) {
      const outReleasesDir = path.join(
        projectPath,
        'dist-releases',
        `rest-${flavor}-${process.env.APP_VERSION}`,
      );
      await fse.copy(outDir, outReleasesDir);
      // copy
      _copyToTarget(outDir, process.env.BUILD_REST_COPY_DIST, bundleNameCopy, projectPath);
    }
  }
}

function _copyToTarget(
  outDir: string,
  target: string | undefined,
  bundleNameCopy: string,
  projectPath: string,
) {
  if (!target) return;
  const dirs = target.split(',');
  for (const dir of dirs) {
    const dir2 = path.isAbsolute(dir) ? dir : path.join(projectPath, dir);
    const outReleasesDirCopy = path.join(dir2, bundleNameCopy);
    fse.removeSync(outReleasesDirCopy);
    fse.copySync(outDir, outReleasesDirCopy, { preserveTimestamps: true });
  }
}

async function _extractDeps(filePath: string): Promise<string[]> {
  const content = await fse.readFile(filePath, 'utf8');
  return extractRestDependencies(content);
}
