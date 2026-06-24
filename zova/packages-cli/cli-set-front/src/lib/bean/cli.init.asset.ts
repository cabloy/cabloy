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
    // module name/info
    const moduleName = argv.module;
    argv.moduleInfo = this.helper.parseModuleInfoCanonical(moduleName);
    const _module = this.helper.findModuleCanonical(moduleName);
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
