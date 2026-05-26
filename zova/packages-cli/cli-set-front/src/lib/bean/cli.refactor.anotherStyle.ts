import type { NameMeta } from '@cabloy/cli';
import type { IModuleInfo } from '@cabloy/module-info';

import { BeanCliBase } from '@cabloy/cli';
import fs from 'node:fs';
import path from 'node:path';

import { __ThisSetName__ } from '../this.ts';

declare module '@cabloy/cli' {
  interface ICommandArgv {
    module: string;
    moduleInfo: IModuleInfo;
    componentName: string;
    styleName: string;
    styleNameCapitalize: string;
    styleClassName: string;
    controllerClassName: string;
    nameMeta: NameMeta;
  }
}

export class CliRefactorAnotherStyle extends BeanCliBase {
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
    argv.styleNameCapitalize = this.helper.firstCharToUpperCase(argv.styleName);
    argv.styleClassName = `Style${argv.nameMeta.directory === 'page' ? 'Page' : ''}${argv.styleNameCapitalize}`;
    argv.controllerClassName = `Controller${argv.nameMeta.directory === 'page' ? 'Page' : ''}${argv.nameMeta.shortCapitalize}`;
    // directory
    const componentDir = path.join(targetDir, 'src', argv.nameMeta.original);
    if (!fs.existsSync(componentDir)) {
      throw new Error(`component not exists: ${componentDir}`);
    }
    const styleFile = path.join(componentDir, `style.${argv.styleName}.ts`);
    if (fs.existsSync(styleFile)) {
      throw new Error(`style exists: ${styleFile}`);
    }
    // style file must exists
    const styleFileFirst = path.join(componentDir, 'style.ts');
    if (!fs.existsSync(styleFileFirst)) {
      await this.helper.invokeCli([':refactor:firstStyle', argv.componentName, `--module=${moduleName}`], {
        cwd: argv.projectPath,
      });
    }
    // render boilerplate
    await this.template.renderBoilerplateAndSnippets({
      targetDir: componentDir,
      setName: __ThisSetName__,
      snippetsPath: 'refactor/anotherStyle/snippets',
      boilerplatePath: 'refactor/anotherStyle/boilerplate',
    });
    // tools.metadata
    if (!argv.nometadata) {
      await this.helper.invokeCli([':tools:metadata', moduleName], { cwd: argv.projectPath });
    }
  }
}
