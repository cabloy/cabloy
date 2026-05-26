import { BeanCliBase } from '@cabloy/cli';
import fse from 'fs-extra';
import path from 'node:path';

import { __ThisSetName__ } from '../this.ts';

declare module '@cabloy/cli' {
  interface ICommandArgv {}
}

export class CliInitAppMonkey extends BeanCliBase {
  async execute() {
    const { argv } = this.context;
    // super
    await super.execute();
    // noformat
    // argv.noformat = true;
    // target dir
    const targetDir = path.join(argv.projectPath, 'src/backend/config');
    const monkeyFile = path.join(targetDir, 'monkey.ts');
    if (fse.existsSync(monkeyFile)) {
      throw new Error('app monkey exists');
    }
    // render boilerplate
    await this.template.renderBoilerplateAndSnippets({
      targetDir,
      setName: __ThisSetName__,
      snippetsPath: null,
      boilerplatePath: 'init/appMonkey/boilerplate',
    });
  }
}
