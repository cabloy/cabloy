import type { glob } from '@cabloy/module-glob';
import type { VonaConfigMeta, VonaMetaFlavor, VonaMetaMode } from '@cabloy/module-info';

import { BeanCliBase } from '@cabloy/cli';
import fse from 'fs-extra';
import path from 'node:path';
import { rimraf } from 'rimraf';
import { resolveVonaLocalPaths } from 'vona-core';

import type { VonaBinConfigOptions } from './toolsBin/types.ts';

import { getImportEsm } from '../utils.ts';
import { generateVonaMeta } from './toolsBin/generateVonaMeta.ts';

declare module '@cabloy/cli' {
  interface ICommandArgv {
    flavor?: VonaMetaFlavor;
  }
}

export class CliBinDbReset extends BeanCliBase {
  async execute() {
    const { argv } = this.context;
    // super
    await super.execute();
    const projectPath = argv.projectPath;
    // recreate the development database
    await this._dbReset(projectPath);
  }

  async _dbReset(projectPath: string) {
    const { argv } = this.context;
    const mode: VonaMetaMode = 'dev';
    const flavor: VonaMetaFlavor = argv.flavor || 'normal';
    const configMeta: VonaConfigMeta = { flavor, mode };
    const paths = resolveVonaLocalPaths(projectPath, mode);
    const configOptions: VonaBinConfigOptions = {
      appDir: projectPath,
      runtimeDir: paths.generatedDir,
      workers: 1,
    };
    try {
      const { modulesMeta } = await generateVonaMeta(configMeta, configOptions);
      await this._run(projectPath, modulesMeta);
    } finally {
      await rimraf(paths.generatedRoot);
    }
  }

  async _run(projectPath: string, _modulesMeta: Awaited<ReturnType<typeof glob>>) {
    // testFile
    let testFile = path.join(import.meta.dirname, '../../../toolsIsolate/dbReset.ts');
    if (!fse.existsSync(testFile)) {
      testFile = path.join(import.meta.dirname, '../dist-toolsIsolate/dbReset.js');
    }
    // run
    let args: string[] = [];
    args = args.concat([
      getImportEsm(resolveVonaLocalPaths(projectPath, 'dev').generatedDir),
      testFile,
      projectPath,
    ]);
    // args = args.concat(['--experimental-transform-types', getImportEsm(), testFile, projectPath]);
    await this.helper.spawnExe({
      cmd: 'node',
      args,
      options: {
        cwd: projectPath,
      },
    });
  }
}
