import type { glob } from '@cabloy/module-glob';
import type { VonaConfigMeta, VonaMetaFlavor, VonaMetaMode } from '@cabloy/module-info';

import { BeanCliBase } from '@cabloy/cli';
import { spawn } from 'node:child_process';
import path from 'node:path';
import nodemon from 'nodemon';
import { rimraf } from 'rimraf';

import type { VonaBinConfigOptions } from './toolsBin/types.ts';

import { getImportEsm } from '../utils.ts';
import { generateVonaMeta } from './toolsBin/generateVonaMeta.ts';

export function resolveDevMode(mode: unknown): 'dev' | 'test' {
  if (mode === undefined || mode === 'dev') return 'dev';
  if (mode === 'test') return 'test';
  throw new Error('Invalid --mode: expected dev or test');
}

export function resolveTestWorkers(mode: 'dev' | 'test', workers: unknown): number | undefined {
  if (mode !== 'test') return workers as number | undefined;
  if (workers === undefined || workers === 1) return 1;
  throw new Error('--mode=test requires --workers=1');
}

declare module '@cabloy/cli' {
  interface ICommandArgv {
    workers?: number;
    flavor?: VonaMetaFlavor;
    mode?: VonaMetaMode;
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
    const mode = resolveDevMode(argv.mode);
    const workers = resolveTestWorkers(mode, argv.workers);
    const flavor: VonaMetaFlavor = argv.flavor || 'normal';
    const configMeta: VonaConfigMeta = { flavor, mode };
    const configOptions: VonaBinConfigOptions = {
      appDir: projectPath,
      runtimeDir: '.vona',
      workers,
    };
    try {
      const { modulesMeta } = await generateVonaMeta(configMeta, configOptions);
      if (mode === 'test') {
        await this._runTest(projectPath);
      } else {
        await this._run(projectPath, modulesMeta);
      }
    } finally {
      await rimraf(path.join(projectPath, '.vona'));
    }
  }

  async _runTest(projectPath: string) {
    const child = spawn(process.execPath, [getImportEsm(), '.vona/bootstrap.ts'], {
      cwd: projectPath,
      stdio: 'inherit',
    });
    const forwardSignal = (signal: NodeJS.Signals) => child.kill(signal);
    const onInterrupt = () => forwardSignal('SIGINT');
    const onTerminate = () => forwardSignal('SIGTERM');
    process.on('SIGINT', onInterrupt);
    process.on('SIGTERM', onTerminate);
    try {
      await new Promise<void>((resolve, reject) => {
        child.once('error', reject);
        child.once('exit', (code, signal) => {
          if (code === 0) resolve();
          else reject(new Error(`Test-mode dev server exited: ${signal ?? code}`));
        });
      });
    } finally {
      process.off('SIGINT', onInterrupt);
      process.off('SIGTERM', onTerminate);
    }
  }

  async _run(projectPath: string, _modulesMeta: Awaited<ReturnType<typeof glob>>) {
    let closed = false;
    return new Promise((resolve, _reject) => {
      (nodemon as any)({
        script: '.vona/bootstrap.ts',
        cwd: projectPath,
        exec: 'node',
        execArgs: [getImportEsm()],
        ext: 'ts,tsx,json',
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
