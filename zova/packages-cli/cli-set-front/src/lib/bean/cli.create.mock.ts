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
    mockName: string;
    nameMeta: NameMeta;
  }
}

export class CliCreateMock extends BeanCliBase {
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
    // mockName
    const mockName = argv.mockName;
    // nameMeta
    argv.nameMeta = this.helper.parseNameMeta(mockName, ['mock']);
    // directory
    const mockDir = path.join(targetDir, 'mock');
    const mockFile = path.join(mockDir, `${mockName}.fake.ts`);
    if (fs.existsSync(mockFile)) {
      throw new Error(`mock exists: ${mockFile}`);
    }
    await this.helper.ensureDir(mockDir);
    // render boilerplate
    await this.template.renderBoilerplateAndSnippets({
      targetDir: mockDir,
      setName: __ThisSetName__,
      snippetsPath: null,
      boilerplatePath: 'create/mock/boilerplate',
    });
  }
}
