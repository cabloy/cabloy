import { BeanCliBase } from '@cabloy/cli';
import fse from 'fs-extra';
import path from 'node:path';

import { __ThisSetName__ } from '../this.ts';

declare module '@cabloy/cli' {
  interface ICommandArgv {}
}

export class CliOpenapiConfig extends BeanCliBase {
  async execute() {
    const { argv } = this.context;
    // super
    await super.execute();
    const moduleNames = argv._;
    if (moduleNames.length === 0) {
      moduleNames.push('home-api');
    }
    // module config
    for (const moduleName of moduleNames) {
      await this._generateModuleConfig(moduleName);
    }
    // project config
    const configFile = path.join(argv.projectPath, 'openapi.config.ts');
    if (fse.existsSync(configFile)) return;
    // render boilerplate
    await this.template.renderBoilerplateAndSnippets({
      targetDir: argv.projectPath,
      setName: __ThisSetName__,
      snippetsPath: null,
      boilerplatePath: 'openapi/config/boilerplate/project',
    });
  }

  async _generateModuleConfig(moduleName: string) {
    // check if exists
    const _module = this.helper.findModule(moduleName);
    if (!_module) {
      throw new Error(`module does not exist: ${moduleName}`);
    }
    // target dir
    const targetDir = await this.helper.ensureDir(_module.root);
    const configFile = path.join(targetDir, 'cli/openapi.config.ts');
    if (fse.existsSync(configFile)) return;
    // render boilerplate
    await this.template.renderBoilerplateAndSnippets({
      targetDir: path.join(targetDir, 'cli'),
      setName: __ThisSetName__,
      snippetsPath: null,
      boilerplatePath: 'openapi/config/boilerplate/module',
    });
  }
}
