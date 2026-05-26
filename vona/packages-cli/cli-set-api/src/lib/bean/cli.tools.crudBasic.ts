import type { IModuleInfo } from '@cabloy/module-info';

import { BeanCliBase } from '@cabloy/cli';
import { combineApiPathControllerAndActionRaw } from '@cabloy/utils';
import fs from 'node:fs';
import path from 'node:path';

import { __ThisSetName__ } from '../this.ts';

declare module '@cabloy/cli' {
  interface ICommandArgv {
    module: string;
    moduleInfo: IModuleInfo;
    resourceName: string;
    resourceNameCapitalize: string;
    moduleResourceName: string;
    moduleActionPathRaw: string;
  }
}

export class CliToolsCrudBasic extends BeanCliBase {
  async execute() {
    const { argv } = this.context;
    // super
    await super.execute();
    // noformat
    // argv.noformat = true;
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
    // resourceName
    const resourceName = argv.resourceName;
    argv.resourceNameCapitalize = this.helper.firstCharToUpperCase(resourceName);
    // moduleResourceName
    argv.moduleResourceName = this.helper.combineModuleNameAndResource(
      argv.moduleInfo.relativeName,
      argv.resourceName,
    );
    argv.moduleActionPathRaw = combineApiPathControllerAndActionRaw(
      moduleName,
      resourceName,
      '',
      true,
    );
    // controller
    const controllerFile = path.join(targetDir, 'src/controller', `${resourceName}.ts`);
    if (fs.existsSync(controllerFile)) {
      throw new Error(`resource exists: ${resourceName}`);
    }
    // render
    await this.template.renderBoilerplateAndSnippets({
      targetDir,
      setName: __ThisSetName__,
      snippetsPath: 'tools/crudBasic/snippets',
      boilerplatePath: 'tools/crudBasic/boilerplate',
    });
    // tools.metadata
    if (!argv.nometadata) {
      await this.helper.invokeCli([':tools:metadata', moduleName], { cwd: argv.projectPath });
    }
  }
}
