import type { IModuleInfo } from '@cabloy/module-info';

import { BeanCliBase } from '@cabloy/cli';
import fse from 'fs-extra';
import path from 'node:path';

declare module '@cabloy/cli' {
  interface ICommandArgv {
    module: string;
    moduleInfo: IModuleInfo;
    scene: string;
  }
}

export class CliInitAsset extends BeanCliBase {
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
    // scene
    const scene = argv.scene;
    // directory
    const assetDir = path.join(targetDir, 'assets', scene);
    if (fse.existsSync(assetDir)) {
      throw new Error(`asset exists: ${moduleName}/assets/${scene}`);
    }
    await this.helper.ensureDir(assetDir);
  }
}
