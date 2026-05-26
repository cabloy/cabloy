import type { NameMeta } from '@cabloy/cli';
import type { IModuleInfo } from '@cabloy/module-info';

import { BeanCliBase } from '@cabloy/cli';
import fse from 'fs-extra';
import { globbySync } from 'globby';
import gogocode from 'gogocode';
import path from 'node:path';

declare module '@cabloy/cli' {
  interface ICommandArgv {
    module: string;
    moduleInfo: IModuleInfo;
    componentName: string;
    componentNameNew: string;
    componentNameNewCapitalize: string;
    nameMeta: NameMeta;
  }
}

export class CliRefactorRenameComponent extends BeanCliBase {
  async execute() {
    const { argv } = this.context;
    // super
    await super.execute();
    // module name/info
    const moduleName = argv.module;
    argv.moduleInfo = this.helper.parseModuleInfo(moduleName);
    // check if exists
    const _module = this.helper.findModule(moduleName);
    if (!_module) {
      throw new Error(`module does not exist: ${moduleName}`);
    }
    // target dir
    const targetDir = await this.helper.ensureDir(_module.root);
    // componentName
    const componentName = argv.componentName;
    // nameMeta
    argv.nameMeta = this.helper.parseNameMeta(componentName, ['component', 'page']);
    argv.componentNameNewCapitalize = this.helper.firstCharToUpperCase(argv.componentNameNew);
    // directory
    const componentDir = path.join(targetDir, 'src', argv.nameMeta.original);
    if (!fse.existsSync(componentDir)) {
      throw new Error(`component not exists: ${componentDir}`);
    }
    // rename
    await this._renameRoute(targetDir);
    await this._renameFiles(componentDir);
    await this._renameDir(componentDir, targetDir);
    // tools.metadata
    if (!argv.nometadata) {
      await this.helper.invokeCli([':tools:metadata', moduleName], { cwd: argv.projectPath });
    }
  }

  async _renameDir(componentDir: string, targetDir: string) {
    const { argv } = this.context;
    // delete old vue
    const componentVueOld = path.join(
      targetDir,
      'src/.metadata',
      argv.nameMeta.directory === 'page' ? 'page' : 'component',
      `${argv.nameMeta.short}.ts`,
    );
    await fse.remove(componentVueOld);
    // delete rest
    const restDir = path.join(targetDir, 'rest');
    await fse.remove(restDir);
    // rename
    const componentDirNew = path.join(targetDir, 'src', argv.nameMeta.directory === 'page' ? 'page' : 'component', argv.componentNameNew);
    await fse.rename(componentDir, componentDirNew);
  }

  async _renameRoute(targetDir: string) {
    const { argv } = this.context;
    if (argv.nameMeta.directory !== 'page') return;
    const routesFile = path.join(targetDir, 'src/routes.ts');
    let content = (await fse.readFile(routesFile)).toString();
    //
    content = content.replace(
      `import { ZPage${argv.nameMeta.shortCapitalize} } from './.metadata/page/${argv.nameMeta.short}.js';`,
      `import { ZPage${argv.componentNameNewCapitalize} } from './.metadata/page/${argv.componentNameNew}.js';`,
    );
    //
    const ast = gogocode(content);
    const astNode = ast.find('export const routes: IModuleRoute[] = [$_$]');
    const astMatches = astNode.match[0];
    const astMatch = astMatches.find(item => {
      return (item.node as any).properties.some(prop => {
        return prop.key.name === 'component' && prop.value.name === `ZPage${argv.nameMeta.shortCapitalize}`;
      });
    });
    if (!astMatch) {
      throw new Error(`page route not found: ${argv.nameMeta.shortCapitalize}`);
    }
    const astPropComponent = (astMatch?.node as any)?.properties.find(prop => {
      return prop.key.name === 'component';
    });
    astPropComponent.value.name = `ZPage${argv.componentNameNewCapitalize}`;
    const astPropPath = (astMatch?.node as any)?.properties.find(prop => {
      return prop.key.name === 'path';
    });
    if (astPropPath && astPropPath.value.value) {
      astPropPath.value.value = astPropPath.value.value.replace(argv.nameMeta.short, argv.componentNameNew);
    }
    content = ast.root().generate();
    await fse.writeFile(routesFile, content);
    // format
    await this.helper.formatFile({ fileName: routesFile, logPrefix: 'format: ' });
  }

  async _renameFiles(componentDir: string) {
    const { argv } = this.context;
    //
    const typeMiddleFix = argv.nameMeta.directory === 'page' ? 'Page' : '';
    //
    const replaces: Array<[string, string]> = [];
    replaces.push([`Controller${typeMiddleFix}${argv.nameMeta.shortCapitalize}`, `Controller${typeMiddleFix}${argv.componentNameNewCapitalize}`]);
    replaces.push([`Render${typeMiddleFix}${argv.nameMeta.shortCapitalize}`, `Render${typeMiddleFix}${argv.componentNameNewCapitalize}`]);
    replaces.push([`Style${typeMiddleFix}${argv.nameMeta.shortCapitalize}`, `Style${typeMiddleFix}${argv.componentNameNewCapitalize}`]);
    //
    const files = globbySync('*', {
      cwd: componentDir,
      onlyFiles: true,
    });
    for (const file of files) {
      const fileName = path.join(componentDir, file);
      let content = (await fse.readFile(fileName)).toString();
      for (const replace of replaces) {
        content = content.replaceAll(replace[0], replace[1]);
      }
      await fse.writeFile(fileName, content);
    }
  }
}
