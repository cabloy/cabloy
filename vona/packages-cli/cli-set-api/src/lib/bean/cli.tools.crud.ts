import type { IModuleInfo } from '@cabloy/module-info';

import { BeanCliBase } from '@cabloy/cli';
import fs from 'node:fs';
import path from 'node:path';

import { __ThisSetName__ } from '../this.ts';

declare module '@cabloy/cli' {
  interface ICommandArgv {
    module: string;
    moduleInfo: IModuleInfo;
    resourceName: string;
    resourceNameCapitalize: string;
    ssrSiteModuleName: string;
    ssrSiteOnionName: string;
    ssrSiteGroupName: string;
  }
}

export class CliToolsCrud extends BeanCliBase {
  async execute() {
    const { argv } = this.context;
    // super
    await super.execute();
    // noformat
    // argv.noformat = true;
    // ssrSiteModuleName
    const isCabloyStart = fs.existsSync(path.join(argv.projectPath, '__CABLOY_START__'));
    argv.ssrSiteModuleName = isCabloyStart
      ? 'vona-module-start-siteadmin'
      : 'vona-module-basic-siteadmin';
    argv.ssrSiteOnionName = isCabloyStart ? 'start-siteadmin:admin' : 'basic-siteadmin:admin';
    argv.ssrSiteGroupName = isCabloyStart
      ? 'start-siteadmin:management'
      : 'basic-siteadmin:management';
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
    // controller
    const controllerFile = path.join(targetDir, 'src/controller', `${resourceName}.ts`);
    if (fs.existsSync(controllerFile)) {
      throw new Error(`resource exists: ${resourceName}`);
    }
    // tools:crud
    const commandName = isCabloyStart ? ':tools:crudStart' : ':tools:crudBasic';
    await this.helper.invokeCli(
      [commandName, resourceName, `--module=${argv.module}`, '--nometadata'],
      { cwd: argv.projectPath },
    );
    // render
    await this.template.renderBoilerplateAndSnippets({
      targetDir,
      setName: __ThisSetName__,
      snippetsPath: null,
      boilerplatePath: 'tools/crud/boilerplate',
    });
    // tools.metadata
    if (!argv.nometadata) {
      await this.helper.invokeCli([':tools:metadata', moduleName], { cwd: argv.projectPath });
    }
  }
}
