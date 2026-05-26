import { BeanCliBase } from '@cabloy/cli';
import { getOnionMetasMeta, getOnionScenesMeta } from '@cabloy/module-info';
import { toUpperCaseFirstChar } from '@cabloy/word-utils';
import fse from 'fs-extra';
import path from 'node:path';

import { loadJSONFile, saveJSONFile } from '../utils.ts';
import { generateBeanGenerals } from './toolsMetadata/generateBeanGenerals.ts';
import {
  generateConfig,
  generateConstant,
  generateError,
  generateLocale1,
  generateLocale2,
} from './toolsMetadata/generateConfig.ts';
import { generateMetadataCustom } from './toolsMetadata/generateMetadataCustom.ts';
import { generateMain, generateMonkey } from './toolsMetadata/generateMonkey.ts';
import { generateOnions } from './toolsMetadata/generateOnions.ts';
import { generateScope } from './toolsMetadata/generateScope.ts';
import { generateScopeResources } from './toolsMetadata/generateScopeResources.ts';
import { generateScopeResourcesMeta } from './toolsMetadata/generateScopeResourcesMeta.ts';

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
    await this.helper.ensureDir(metaDir);
    // relativeNameCapitalize
    const relativeNameCapitalize = this.helper.stringToCapitalize(moduleName, '-');
    // onionScenesMeta
    const onionScenesMeta = getOnionScenesMeta(this.modulesMeta.modules);
    // content
    let content = '';
    // onions
    const scopeResources = {};
    for (const sceneName in onionScenesMeta) {
      const sceneMeta = onionScenesMeta[sceneName];
      // general
      content += await generateOnions(sceneName, sceneMeta, moduleName, modulePath);
      // scope resources
      if (sceneMeta.scopeResource) {
        const contentScopeResource = await generateScopeResources(
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
      if (sceneMeta.beanGeneral) {
        content += await generateBeanGenerals(sceneName, sceneMeta, moduleName, modulePath);
      }
      // metas
      if (sceneName === 'meta') {
        const onionMetasMeta = getOnionMetasMeta(this.modulesMeta.modules);
        for (const metaName in onionMetasMeta) {
          const metaMeta = onionMetasMeta[metaName];
          if (metaMeta.scopeResource) {
            const contentScopeResourceMeta = await generateScopeResourcesMeta(
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
        content += await generateMetadataCustom(this, sceneName, sceneMeta, moduleName, modulePath);
      }
    }
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
    // monkey
    content += await generateMonkey(modulePath);
    // main
    content += await generateMain(modulePath);
    // scope
    const generateScopeOptions = {
      config: contentConfig,
      errors: contentErrors,
      locales: contentLocales2,
      constants: contentConstants,
    };
    content += await generateScope(
      moduleName,
      relativeNameCapitalize,
      scopeResources,
      generateScopeOptions,
    );
    // patch
    content = this._generatePatch(content);
    // empty
    if (!content.trim()) {
      content = 'export {};';
    } else {
      content = `// eslint-disable\n${content}`;
    }
    // save
    await fse.writeFile(metaIndexFile, content);
    // await this.helper.formatFile({ fileName: metaIndexFile, logPrefix: 'format: ' });
    // locales
    await this._generateLocales(modulePath, contentLocales1);
    // generate this
    await this._generateThis(moduleName, relativeNameCapitalize, modulePath);
    // index
    await this._generateIndex(modulePath);
    // package
    await this._generatePackage(modulePath);
  }

  _generatePatch(content: string) {
    if (!content) return content;
    content = this._generatePatch_resources(content, 'table-identity', ['TableIdentity'], true);
    content = this._generatePatch_resources(
      content,
      'vona-module-a-openapi',
      ['TypeEntityOptionsFields', 'TypeControllerOptionsActions'],
      true,
    );
    content = this._generatePatch_resources(
      content,
      'vona-module-a-orm',
      [
        'TypeEntityMeta',
        'TypeModelsClassLikeGeneral',
        'TypeSymbolKeyFieldsMore',
        'IModelRelationHasOne',
        'IModelRelationBelongsTo',
        'IModelRelationHasMany',
        'IModelRelationBelongsToMany',
      ],
      true,
    );
    content = this._generatePatch_resources(content, 'vona', ['PowerPartial'], true);
    return content;
  }

  _generatePatch_resources(
    content: string,
    packageName: string,
    resources: string[],
    isTypeImport: boolean,
  ) {
    const items = resources.filter(item => {
      const escaped = item.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regexp = new RegExp(`${escaped}[\\[\\]<,;?:\\s]`);
      return !!regexp.exec(content);
    });
    if (items.length === 0) return content;
    const importContent = `import ${isTypeImport ? 'type ' : ''}{ ${items.join(',')} } from '${packageName}';`;
    return `${importContent}\n${content}`;
  }

  async _generateLocales(modulePath, contentLocales) {
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
export { ScopeModule${relativeNameCapitalize} as ScopeModule } from './index.ts';
`;
    // save
    await fse.writeFile(thisDest, content);
  }

  async _generateIndex(modulePath: string) {
    let jsContent = '';
    const jsFile = path.join(modulePath, 'src/index.ts');
    if (await fse.pathExists(jsFile)) {
      jsContent = (await fse.readFile(jsFile)).toString();
    }
    // exports
    jsContent = await this._prependExportIfNeeded(jsContent, [
      {
        exportLine: "export * from './types/index.ts';",
        sourceFile: path.join(modulePath, 'src/types/index.ts'),
      },
      {
        exportLine: "export * from './lib/index.ts';",
        sourceFile: path.join(modulePath, 'src/lib/index.ts'),
      },
      {
        exportLine: "export * from './.metadata/locales.ts';",
        sourceFile: path.join(modulePath, 'src/.metadata/locales.ts'),
      },
      {
        exportLine: "export * from './.metadata/index.ts';",
        sourceFile: path.join(modulePath, 'src/.metadata/index.ts'),
      },
    ]);
    // trim empty
    jsContent = jsContent.replace('export {};\n', '');
    // write
    await fse.writeFile(jsFile, jsContent);
    await this.helper.formatFile({ fileName: jsFile, logPrefix: 'format: ' });
  }

  async _prependExportIfNeeded(
    jsContent: string,
    entries: { exportLine: string; sourceFile: string }[],
  ): Promise<string> {
    for (const { exportLine, sourceFile } of entries) {
      if ((await fse.pathExists(sourceFile)) && !jsContent.includes(exportLine)) {
        jsContent = `${exportLine}\n${jsContent}`;
      }
    }
    return jsContent;
  }

  async _generatePackage(modulePath: string) {
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
    // cli
    for (const name of ['cli', 'zovaRest']) {
      const pathCheck = path.join(modulePath, name);
      if (!(await fse.pathExists(pathCheck))) continue;
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
    // save
    if (changed) {
      await saveJSONFile(pkgFile!, pkg);
      await this.helper.formatFile({ fileName: pkgFile! });
    }
  }
}
