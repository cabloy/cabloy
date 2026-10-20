import type { glob } from '@cabloy/module-glob';
import type { VonaConfigMeta, VonaMetaFlavor, VonaMetaMode } from '@cabloy/module-info';

import { BeanCliBase } from '@cabloy/cli';
import { spawn } from 'node:child_process';
import nodemon from 'nodemon';
import { rimraf } from 'rimraf';
import { requiresFreshTestResources, resolveVonaLocalPaths } from 'vona-core';

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
    const strict = requiresFreshTestResources();
    const paths = resolveVonaLocalPaths(projectPath, mode);
    if (strict && (mode !== 'test' || !paths.runId)) {
      throw new Error('Strict generation requires an isolated test run in test mode');
    }
    const configOptions: VonaBinConfigOptions = {
      appDir: projectPath,
      runtimeDir: paths.generatedDir,
      workers,
    };
    try {
      const { env, modulesMeta } = await generateVonaMeta(configMeta, configOptions);
      if (mode === 'test') {
        if (strict) await this._runTest(projectPath, env);
        else await this._runTest(projectPath);
      } else {
        await this._run(projectPath, modulesMeta);
      }
    } finally {
      if (!paths.runId) await rimraf(paths.generatedRoot);
    }
  }

  async _runTest(projectPath: string, resolvedEnv?: NodeJS.ProcessEnv) {
    const strict = requiresFreshTestResources();
    if (strict && !resolvedEnv) {
      throw new Error('Strict generation requires resolved environment handoff');
    }
    const generatedDir = resolveVonaLocalPaths(projectPath, 'test').generatedDir;
    const child = spawn(
      process.execPath,
      [getImportEsm(generatedDir), `${generatedDir}/bootstrap.ts`],
      {
        cwd: projectPath,
        stdio: 'inherit',
        ...(strict ? { env: { ...process.env, ...resolvedEnv } } : {}),
      },
    );
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
    let crashError: Error | undefined;
    return new Promise((resolve, reject) => {
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
        .on('crash', () => {
          if (closed) return;
          closed = true;
          // nodemon emits crash without an error payload; the child already logged the cause.
          crashError = new Error('Development server crashed; see the startup error above');
          // Let nodemon finish processing the child exit before stopping its watchers.
          setImmediate(() => nodemon.emit('quit'));
        })
        .on('quit', () => {
          closed = true;
          if (crashError) {
            // The programmatic quit event does not close watchers; reset before propagating
            // the failure to the CLI's error handler, which exits the process immediately.
            nodemon.reset(() => reject(crashError));
          } else {
            resolve(undefined);
          }
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
