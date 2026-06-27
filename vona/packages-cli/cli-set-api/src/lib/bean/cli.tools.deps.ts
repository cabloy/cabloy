import { BeanCliBase } from '@cabloy/cli';
import fse from 'fs-extra';
import { globby } from 'globby';
import path from 'node:path';

import { resolveTemplatePath } from '../../utils.ts';

declare module '@cabloy/cli' {
  interface ICommandArgv {}
}

export class CliToolsDeps extends BeanCliBase {
  async execute() {
    const { argv } = this.context;
    // super
    await super.execute();
    const projectPath = argv.projectPath;
    // generate
    await this._generate(projectPath);
  }

  async _generate(projectPath: string) {
    // generate zovaRest
    const needPnpmInstall = await this._generateZovaRest(projectPath);
    // generate package.json
    const pnpmInstalled = await this.common._generatePackageJson(projectPath);
    if (needPnpmInstall && !pnpmInstalled) {
      await this.helper.pnpmInstall();
    }
    // generate type modules file
    await this.common._generateTypeModulesFile(projectPath);
    // generate type project file
    await this._generateTypeProjectFile(projectPath);
  }

  _getProjectMode(projectPath: string) {
    const vonaPath = this._getVonaPath(projectPath)!;
    return vonaPath.includes('packages-vona') ? 'source' : 'project';
  }

  _getVonaPath(projectPath: string) {
    let vonaPath = path.join(projectPath, 'packages-vona/vona');
    if (fse.existsSync(vonaPath)) return vonaPath;
    vonaPath = path.join(projectPath, 'node_modules/vona');
    if (fse.existsSync(vonaPath)) return vonaPath;
  }

  async _generateTypeProjectFile(projectPath: string) {
    const projectMode = this._getProjectMode(projectPath);
    const fileTemplate = resolveTemplatePath(`config/_tsconfig_${projectMode}.json`);
    const fileConfig = path.join(projectPath, 'tsconfig.json');
    if (!fse.existsSync(fileConfig)) {
      await fse.copyFile(fileTemplate, fileConfig);
    }
  }

  async _generateZovaRest(projectPath: string) {
    const targetDir = path.join(projectPath, '.zova-rest');
    if (!fse.existsSync(targetDir)) {
      throw new Error(
        'Zova REST workspace .zova-rest not found. Please run `npm run build:zova:admin` or `npm run build:zova:web` first.',
      );
    }
    const bundles = await globby('*', { cwd: targetDir, onlyDirectories: true });
    if (bundles.length > 0) return false;
    throw new Error(
      'No Zova REST bundles found in .zova-rest. Please run `npm run build:zova:admin` or `npm run build:zova:web` first.',
    );
  }
}
