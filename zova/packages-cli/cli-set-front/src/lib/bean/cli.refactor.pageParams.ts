import type { NameMeta } from '@cabloy/cli';
import type { IModuleInfo } from '@cabloy/module-info';

import { BeanCliBase } from '@cabloy/cli';
import fs from 'node:fs';
import path from 'node:path';

import { getControllerFileName } from '../common/utils.ts';
import { __ThisSetName__ } from '../this.ts';

declare module '@cabloy/cli' {
  interface ICommandArgv {
    module: string;
    moduleInfo: IModuleInfo;
    pageName: string;
    nameMeta: NameMeta;
    controllerClassName: string;
    controllerFileName: string;
  }
}

export class CliRefactorPageParams extends BeanCliBase {
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
    // pageName
    const pageName = argv.pageName;
    // nameMeta
    argv.nameMeta = this.helper.parseNameMeta(pageName, ['page']);
    argv.controllerClassName = `ControllerPage${argv.nameMeta.shortCapitalize}`;
    argv.controllerFileName = getControllerFileName(_module, 'page', argv.nameMeta.short);
    // directory
    const pageDir = path.join(targetDir, 'src/page', argv.nameMeta.short);
    if (!fs.existsSync(pageDir)) {
      throw new Error(`page not exists: ${pageDir}`);
    }
    // render boilerplate
    await this.template.renderBoilerplateAndSnippets({
      targetDir: pageDir,
      setName: __ThisSetName__,
      snippetsPath: 'refactor/pageParams/snippets',
      boilerplatePath: null,
    });
    // tools.metadata
    if (!argv.nometadata) {
      await this.helper.invokeCli([':tools:metadata', moduleName], { cwd: argv.projectPath });
    }
  }
}
