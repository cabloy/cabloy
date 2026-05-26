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
    let needPnpmInstall = false;
    const targetDir = path.join(projectPath, '.zova-rest');
    for (const module of this.modulesMeta.modulesArray) {
      const moduleZovaRest = path.join(module.root, 'zovaRest');
      if (!fse.existsSync(moduleZovaRest)) continue;
      const bundles = await globby('*', { cwd: moduleZovaRest, onlyDirectories: true });
      for (const bundle of bundles) {
        const moduleZovaRestSrc = path.join(moduleZovaRest, bundle);
        const moduleZovaRestDest = path.join(targetDir, bundle);
        let needCopy = true;
        if (fse.existsSync(moduleZovaRestDest)) {
          const statDest = await fse.stat(path.join(moduleZovaRestDest, 'package.json'));
          const statSrc = await fse.stat(path.join(moduleZovaRestSrc, 'package.json'));
          // diff: 5s
          if (statDest.mtimeMs + 5000 >= statSrc.mtimeMs) {
            needCopy = false;
          }
        }
        if (!needCopy) continue;
        await fse.copy(moduleZovaRestSrc, moduleZovaRestDest, { preserveTimestamps: true });
        needPnpmInstall = true;
      }
    }
    return needPnpmInstall;
  }
}
