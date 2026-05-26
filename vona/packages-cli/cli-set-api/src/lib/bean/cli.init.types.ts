import { BeanCliBase } from '@cabloy/cli';
import fse from 'fs-extra';
import path from 'node:path';

import { __ThisSetName__ } from '../this.ts';

declare module '@cabloy/cli' {
  interface ICommandArgv {}
}

export class CliInitTypes extends BeanCliBase {
  async execute() {
    const { argv } = this.context;
    // super
    await super.execute();
    // noformat
    // argv.noformat = true;
    // module name/info
    const moduleName = argv._[0];
    if (!moduleName) return;
    argv.moduleInfo = this.helper.parseModuleInfo(moduleName);
    // check if exists
    const _module = this.helper.findModule(moduleName);
    if (!_module) {
      throw new Error(`module does not exist: ${moduleName}`);
    }
    // target dir
    const targetDir = await this.helper.ensureDir(_module.root);
    const mainFile = path.join(targetDir, 'src/types/index.ts');
    if (fse.existsSync(mainFile)) {
      throw new Error(`types exists: ${moduleName}`);
    }
    // render boilerplate
    await this.template.renderBoilerplateAndSnippets({
      targetDir: path.join(targetDir, 'src'),
      setName: __ThisSetName__,
      snippetsPath: null,
      boilerplatePath: 'init/types/boilerplate',
    });
    // tools.metadata
    if (!argv.nometadata) {
      await this.helper.invokeCli([':tools:metadata', moduleName], { cwd: argv.projectPath });
    }
  }
}
