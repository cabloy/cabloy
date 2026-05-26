import { BeanCliBase } from '@cabloy/cli';
import fse from 'fs-extra';
import path from 'node:path';

import { __ThisSetName__ } from '../this.ts';

declare module '@cabloy/cli' {
  interface ICommandArgv {}
}

export class CliInitMonkey extends BeanCliBase {
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
    const monkeyFile = path.join(targetDir, 'src/monkey.ts');
    if (fse.existsSync(monkeyFile)) {
      throw new Error(`monkey exists: ${moduleName}`);
    }
    // render boilerplate
    await this.template.renderBoilerplateAndSnippets({
      targetDir: path.join(targetDir, 'src'),
      setName: __ThisSetName__,
      snippetsPath: null,
      boilerplatePath: 'init/monkey/boilerplate',
    });
    // set vonaModule.capabilities.monkey: true
    await this._setPackageInfo(targetDir);
    // tools.metadata
    if (!argv.nometadata) {
      await this.helper.invokeCli([':tools:metadata', moduleName], { cwd: argv.projectPath });
    }
  }

  async _setPackageInfo(modulePath: string) {
    const pkgFile = path.join(modulePath, 'package.json');
    const pkg = await this.helper.loadJSONFile(pkgFile);
    if (!pkg.vonaModule) pkg.vonaModule = {};
    if (!pkg.vonaModule.capabilities) pkg.vonaModule.capabilities = {};
    let changed: boolean | undefined;
    // monkey
    if (!pkg.vonaModule.capabilities.monkey) {
      pkg.vonaModule.capabilities.monkey = true;
      changed = true;
    }
    // // dependencies
    // if (!pkg.vonaModule.dependencies) pkg.vonaModule.dependencies = {};
    // if (!pkg.vonaModule.dependencies['a-vona']) {
    //   pkg.vonaModule.dependencies['a-vona'] = '5.0.0';
    //   changed = true;
    // }
    // save
    if (changed) {
      await this.helper.saveJSONFile(pkgFile, pkg);
    }
  }
}
