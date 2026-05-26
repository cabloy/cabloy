import { BeanCliBase } from '@cabloy/cli';
import fse from 'fs-extra';
import path from 'node:path';

declare module '@cabloy/cli' {
  interface ICommandArgv {
    force: boolean;
  }
}

export class CliToolsDeps extends BeanCliBase {
  async execute() {
    const { argv } = this.context;
    // super
    await super.execute();
    const projectPath = argv.projectPath;
    // const force = argv.force;
    // generate
    await this._generate(projectPath);
  }

  async _generate(projectPath: string) {
    await this._generate_preparePackage(projectPath);
    // generate package.json
    await this.common._generatePackageJson(projectPath);
    // generate type modules file
    await this.common._generateTypeModulesFile(projectPath);
  }

  async _generate_preparePackage(projectPath: string) {
    // copy package.json
    const filePackage = path.join(projectPath, 'package.json');
    if (!fse.existsSync(filePackage)) {
      fse.copyFileSync(path.join(projectPath, 'package.original.json'), filePackage);
      await this.helper.pnpmInstall();
    }
  }
}
