import type { glob } from '@cabloy/module-glob';
import type { VonaConfigMeta, VonaMetaFlavor, VonaMetaMode } from '@cabloy/module-info';

import { BeanCliBase } from '@cabloy/cli';
import path from 'node:path';
import nodemon from 'nodemon';
import { rimraf } from 'rimraf';

import type { VonaBinConfigOptions } from './toolsBin/types.ts';

import { getImportEsm } from '../utils.ts';
import { generateVonaMeta } from './toolsBin/generateVonaMeta.ts';

declare module '@cabloy/cli' {
  interface ICommandArgv {
    workers?: number;
    flavor?: VonaMetaFlavor;
  }
}

export class CliBinDev extends BeanCliBase {
  async execute() {
    const { argv } = this.context;
    // super
    await super.execute();
    const projectPath = argv.projectPath;
    // run
    await this._dev(projectPath);
  }

  async _dev(projectPath: string) {
    const { argv } = this.context;
    const mode: VonaMetaMode = 'dev';
    const flavor: VonaMetaFlavor = argv.flavor || 'normal';
    const configMeta: VonaConfigMeta = { flavor, mode };
    const configOptions: VonaBinConfigOptions = {
      appDir: projectPath,
      runtimeDir: '.vona',
      workers: argv.workers,
    };
    const { modulesMeta } = await generateVonaMeta(configMeta, configOptions);
    await this._run(projectPath, modulesMeta);
    await rimraf(path.join(projectPath, '.vona'));
  }

  async _run(projectPath: string, _modulesMeta: Awaited<ReturnType<typeof glob>>) {
    let closed = false;
    return new Promise((resolve, _reject) => {
      (nodemon as any)({
        script: '.vona/bootstrap.ts',
        cwd: projectPath,
        exec: 'node',
        execArgs: [getImportEsm()],
        // execArgs: ['--experimental-transform-types', getImportEsm(), '--trace-deprecation'],
        // signal: 'SIGHUP',
        watch: ['packages-utils', 'packages-vona', './src'],
        ignore: [
          '**/node_modules/**',
          '**/dist/**',
          '**/test/**/*.test.ts',
          'src/backend/play/**',
          'src/backend/typing/**',
          '**/src/config/errors.ts',
          '**/src/config/locale/*.ts',
          '**/src/config/config.ts',
          '**/src/config/constants.ts',
          '**/src/types/**',
          '**/src/controller/*.ts(x)?',
          '**/src/model/*.ts',
          '**/src/service/*.ts',
          '**/src/bean/*.*.ts',
          '**/src/dto/*.ts(x)?',
          '**/src/entity/*.ts(x)?',
        ],
      });
      nodemon
        .on('quit', () => {
          closed = true;
          resolve(undefined);
        })
        .on('restart', files => {
          if (closed) {
            // force exit
            process.exit(0);
          }
          // eslint-disable-next-line
          console.log('App restarted due to: ', files);
        });
    });
    // await this.helper.spawnExe({
    //   cmd: 'node',
    //   args: ['--experimental-transform-types', '--loader=ts-node/esm', '.vona/bootstrap.ts'],
    //   options: {
    //     cwd: projectPath,
    //   },
    // });
  }
}
