import { BeanCliBase } from '@cabloy/cli';
import fse from 'fs-extra';
import path from 'node:path';

import { __ThisSetName__ } from '../this.ts';

declare module '@cabloy/cli' {
  interface ICommandArgv {}
}

export class CliInitIcon extends BeanCliBase {
  async execute() {
    const { argv } = this.context;
    // super
    await super.execute();
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
    const iconDir = path.join(targetDir, 'icons');
    if (fse.existsSync(iconDir)) {
      throw new Error(`icon exists: ${moduleName}`);
    }
    // render boilerplate
    await this.template.renderBoilerplateAndSnippets({
      targetDir,
      setName: __ThisSetName__,
      snippetsPath: null,
      boilerplatePath: 'init/icon/boilerplate',
    });
    // set zovaModule.capabilities.icon: true
    await this._setPackageInfo(targetDir);
    // tools.metadata
    if (!argv.nometadata) {
      await this.helper.invokeCli([':tools:metadata', moduleName], { cwd: argv.projectPath });
    }
  }

  async _setPackageInfo(modulePath: string) {
    const pkgFile = path.join(modulePath, 'package.json');
    const pkg = await this.helper.loadJSONFile(pkgFile);
    if (!pkg.zovaModule) pkg.zovaModule = {};
    if (!pkg.zovaModule.capabilities) pkg.zovaModule.capabilities = {};
    if (pkg.zovaModule.capabilities.icon) return;
    pkg.zovaModule.capabilities.icon = true;
    await this.helper.saveJSONFile(pkgFile, pkg);
  }
}
