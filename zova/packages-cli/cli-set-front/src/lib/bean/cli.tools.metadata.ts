import { BeanCliBase } from '@cabloy/cli';
import { getOnionMetasMeta, getOnionScenesMeta } from '@cabloy/module-info';
import { toUpperCaseFirstChar } from '@cabloy/word-utils';
import fse from 'fs-extra';
import path from 'node:path';

import { loadJSONFile, saveJSONFile } from '../common/utils.ts';
import { generateBeanGenerals } from './toolsMetadata/generateBeanGenerals.ts';
import {
  generateConfig,
  generateConstant,
  generateError,
  generateLocale1,
  generateLocale2,
} from './toolsMetadata/generateConfig.ts';
import { generateIcons } from './toolsMetadata/generateIcons.ts';
import { generateMetadataCustom } from './toolsMetadata/generateMetadataCustom.ts';
import {
  generateMain,
  generateMainSys,
  generateMonkey,
  generateMonkeySys,
} from './toolsMetadata/generateMonkey.ts';
import { generateOnions } from './toolsMetadata/generateOnions.ts';
import { generateOptionsPackage } from './toolsMetadata/generateOptionsPackage.ts';
import { generateScope } from './toolsMetadata/generateScope.ts';
import { generateScopeResources } from './toolsMetadata/generateScopeResources.ts';
import { generateScopeResourcesMeta } from './toolsMetadata/generateScopeResourcesMeta.ts';
import { globAllTsFiles } from './toolsMetadata/utils.ts';

declare module '@cabloy/cli' {
  interface ICommandArgv {
    force: boolean;
  }
}

export class CliToolsMetadata extends BeanCliBase {
  async execute() {
    const { argv } = this.context;
    // super
    await super.execute();
    // noformat: src/index.ts need format
    // argv.noformat = true;
    // moduleNames
    let moduleNames = argv._;
    const force = argv.force ?? moduleNames.length > 0;
    if (moduleNames.length === 0) {
      moduleNames = this.modulesMeta.modulesArray
        .filter(item => !item.info.node_modules)
        .map(item => item.info.relativeName);
    }
    const total = moduleNames.length;
    for (let index = 0; index < total; index++) {
      const moduleName = moduleNames[index];
      // log
      await this.console.log({
        total,
        progress: index,
        text: moduleName,
      });
      // generate res
      await this._generateMetadata(moduleName, force);
    }
  }

  async _generateMetadata(moduleName: string, force: boolean) {
    const module = this.helper.findModule(moduleName);
    if (!module) throw new Error(`module not found: ${moduleName}`);
    const modulePath = module.root;
    const metaDir = path.join(modulePath, 'src/.metadata');
    const metaIndexFile = path.join(metaDir, 'index.ts');
    if ((await fse.pathExists(metaIndexFile)) && !force) {
      // do nothing
      return;
    }
    // metaDir
    await fse.remove(path.join(metaDir, 'component'));
    await fse.remove(path.join(metaDir, 'page'));
    await fse.remove(path.join(metaDir, 'icons'));
    await this.helper.ensureDir(metaDir);
    // relativeNameCapitalize
    const relativeNameCapitalize = this.helper.stringToCapitalize(moduleName, '-');
    // onionScenesMeta
    const onionScenesMeta = getOnionScenesMeta(this.modulesMeta.modules);
    // content
    let content = '';
    // all files
    const globFiles = await globAllTsFiles(moduleName, modulePath);
    const beansPreload = globFiles.filter(item => item.isPreload).map(item => item.beanFullName);
    // onions
    const scopeResources = {};
    for (const sceneName in onionScenesMeta) {
      const sceneMeta = onionScenesMeta[sceneName];
      const globFilesScene = globFiles.filter(item => item.sceneName === sceneName);
      // general
      content += await generateOnions(globFilesScene, sceneName, sceneMeta, moduleName, modulePath);
      // scope resources
      if (sceneMeta.scopeResource) {
        const contentScopeResource = await generateScopeResources(
          globFilesScene,
          sceneName,
          sceneMeta,
          moduleName,
          modulePath,
        );
        if (contentScopeResource) {
          content += contentScopeResource;
          scopeResources[sceneName] = `IModule${toUpperCaseFirstChar(sceneName)}`;
        }
      }
      // bean generals
      content += await generateBeanGenerals(
        globFilesScene,
        sceneName,
        sceneMeta,
        moduleName,
        modulePath,
      );
      // metas
      if (sceneName === 'meta') {
        const onionMetasMeta = getOnionMetasMeta(this.modulesMeta.modules);
        for (const metaName in onionMetasMeta) {
          const metaMeta = onionMetasMeta[metaName];
          const globFilesMeta = globFiles.filter(
            item => item.sceneName === 'meta' && item.beanName === metaName,
          );
          if (metaMeta.scopeResource) {
            const contentScopeResourceMeta = await generateScopeResourcesMeta(
              globFilesMeta,
              metaName,
              metaMeta,
              sceneName,
              sceneMeta,
              moduleName,
              modulePath,
            );
            if (contentScopeResourceMeta) {
              content += contentScopeResourceMeta;
              scopeResources[metaName] = `Meta${toUpperCaseFirstChar(metaName)}`;
            }
          }
        }
      }
      // metadata custom
      if (sceneMeta.metadataCustom) {
        content += await generateMetadataCustom(
          this,
          globFilesScene,
          sceneName,
          sceneMeta,
          moduleName,
          modulePath,
        );
      }
    }
    // onions: optionsPackage
    content += await generateOptionsPackage(
      this,
      globFiles,
      onionScenesMeta,
      moduleName,
      modulePath,
    );
    // icons
    content += await generateIcons(moduleName, modulePath);
    // config
    const contentConfig = await generateConfig(modulePath);
    content += contentConfig;
    // constant
    const contentConstants = await generateConstant(modulePath);
    content += contentConstants;
    // locale
    const contentLocales1 = await generateLocale1(modulePath, moduleName);
    const contentLocales2 = await generateLocale2(contentLocales1);
    content += contentLocales2;
    // error
    const contentErrors = await generateError(modulePath);
    content += contentErrors;
    // monkey/monkeySys
    content += await generateMonkey(modulePath);
    content += await generateMonkeySys(modulePath);
    // main/mainSys
    content += await generateMain(modulePath);
    content += await generateMainSys(modulePath);
    // scope
    content += await generateScope(moduleName, relativeNameCapitalize, scopeResources, {
      config: contentConfig,
      errors: contentErrors,
      locales: contentLocales2,
      constants: contentConstants,
    });
    // empty
    if (!content.trim()) {
      content = 'export {};';
    } else {
      content = `// eslint-disable\n${content}`;
    }
    // save
    await fse.writeFile(metaIndexFile, content);
    // locales
    await this._generateLocales(modulePath, contentLocales1);
    // generate this
    await this._generateThis(moduleName, relativeNameCapitalize, modulePath);
    // index
    await this._generateIndex(modulePath);
    // package
    await this._generatePackage(modulePath, beansPreload);
  }

  async _generateLocales(modulePath: string, contentLocales) {
    if (!contentLocales) return;
    const localesDest = path.join(modulePath, 'src/.metadata/locales.ts');
    // save
    await fse.writeFile(localesDest, contentLocales);
    await this.helper.formatFile({ fileName: localesDest, logPrefix: 'format: ' });
  }

  async _generateThis(moduleName: string, relativeNameCapitalize: string, modulePath: string) {
    const thisDest = path.join(modulePath, 'src/.metadata/this.ts');
    if (await fse.pathExists(thisDest)) return;
    const content = `export const __ThisModule__ = '${moduleName}';
export { ScopeModule${relativeNameCapitalize} as ScopeModule } from './index.js';
`;
    // save
    await fse.writeFile(thisDest, content);
  }

  async _prependExportIfNeeded(
    jsContent: string,
    exportLine: string,
    sourceFile: string,
    modulePath: string,
  ) {
    const sourcePath = path.join(modulePath, sourceFile);
    if ((await fse.pathExists(sourcePath)) && !jsContent.includes(exportLine)) {
      return `${exportLine}\n${jsContent}`;
    }
    return jsContent;
  }

  async _generateIndex(modulePath: string) {
    let jsContent = '';
    const jsFile = path.join(modulePath, 'src/index.ts');
    if (await fse.pathExists(jsFile)) {
      jsContent = (await fse.readFile(jsFile)).toString();
    }
    jsContent = await this._prependExportIfNeeded(
      jsContent,
      "export * from './types/index.js';",
      'src/types/index.ts',
      modulePath,
    );
    jsContent = await this._prependExportIfNeeded(
      jsContent,
      "export * from './lib/index.js';",
      'src/lib/index.ts',
      modulePath,
    );
    jsContent = await this._prependExportIfNeeded(
      jsContent,
      "export * from './.metadata/locales.js';",
      'src/.metadata/locales.ts',
      modulePath,
    );
    jsContent = await this._prependExportIfNeeded(
      jsContent,
      "export * from './.metadata/index.js';",
      'src/.metadata/index.ts',
      modulePath,
    );
    // trim empty
    jsContent = jsContent.replace('export {};\n', '');
    // write
    await fse.writeFile(jsFile, jsContent);
    await this.helper.formatFile({ fileName: jsFile, logPrefix: 'format: ' });
  }

  async _generatePackage(modulePath: string, beansPreload: string[]) {
    let pkgFile: string;
    let pkg: any;
    let changed: boolean | undefined;
    async function _loadPkg() {
      if (!pkg) {
        pkgFile = path.join(modulePath, 'package.json');
        pkg = await loadJSONFile(pkgFile);
      }
      return pkg;
    }
    // beansPreload
    if (beansPreload.length > 0) {
      pkg = await _loadPkg();
      if (!pkg.zovaModule) pkg.zovaModule = {};
      if (
        !pkg.zovaModule.beansPreload ||
        pkg.zovaModule.beansPreload.join(',') !== beansPreload.join(',')
      ) {
        changed = true;
        pkg.zovaModule.beansPreload = beansPreload;
      }
    }
    // cli
    for (const name of ['cli', 'icons']) {
      const cli = path.join(modulePath, name);
      if (await fse.pathExists(cli)) {
        pkg = await _loadPkg();
        pkg.files ??= [];
        const index = pkg.files.indexOf(name);
        if (index === -1) {
          changed = true;
          pkg.files.push(name);
        }
        if (name === 'cli') {
          if (pkg.scripts?.['tsc:publish'].includes('tsconfig.cli.json')) {
            const index = pkg.files.indexOf('dist-cli');
            if (index === -1) {
              changed = true;
              pkg.files.push('dist-cli');
            }
          }
        }
      }
    }
    // save
    if (changed) {
      await saveJSONFile(pkgFile!, pkg);
      await this.helper.formatFile({ fileName: pkgFile! });
    }
  }
}
