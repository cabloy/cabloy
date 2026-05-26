import type { NameMeta } from '@cabloy/cli';
import type { IModuleInfo } from '@cabloy/module-info';

import { BeanCliBase } from '@cabloy/cli';
import fse from 'fs-extra';
import fs from 'node:fs';
import path from 'node:path';

import { __ThisSetName__ } from '../this.ts';

declare module '@cabloy/cli' {
  interface ICommandArgv {
    module: string;
    moduleInfo: IModuleInfo;
    componentName: string;
    renderName: string;
    renderNameCapitalize: string;
    renderClassName: string;
    nameMeta: NameMeta;
  }
}

export class CliRefactorFirstRender extends BeanCliBase {
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
    argv.renderName = 'render';
    argv.renderNameCapitalize = this.helper.firstCharToUpperCase(argv.renderName);
    argv.renderClassName = `Render${argv.nameMeta.directory === 'page' ? 'Page' : ''}${argv.nameMeta.shortCapitalize}`;
    // directory
    const componentDir = path.join(targetDir, 'src', argv.nameMeta.original);
    if (!fs.existsSync(componentDir)) {
      throw new Error(`component not exists: ${componentDir}`);
    }
    const renderFile = path.join(componentDir, `${argv.renderName}.tsx`);
    if (fs.existsSync(renderFile)) {
      throw new Error(`render exists: ${renderFile}`);
    }
    // render boilerplate
    await this.template.renderBoilerplateAndSnippets({
      targetDir: componentDir,
      setName: __ThisSetName__,
      snippetsPath: null,
      boilerplatePath: 'refactor/firstRender/boilerplate',
    });
    // controller render
    let controllerFile = path.join(componentDir, 'controller.tsx');
    if (!fs.existsSync(controllerFile)) {
      controllerFile = path.join(componentDir, 'controller.ts');
    }
    let controllerContent = (await fse.readFile(controllerFile)).toString();
    controllerContent = controllerContent.replace('protected render() {', 'protected _render() {');
    await fse.writeFile(controllerFile, controllerContent);
    // tools.metadata
    if (!argv.nometadata) {
      await this.helper.invokeCli([':tools:metadata', moduleName], { cwd: argv.projectPath });
    }
  }
}
