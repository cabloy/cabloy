import type { VonaConfigMeta, VonaMetaFlavor, VonaMetaMode } from '@cabloy/module-info';

import { BeanCliBase } from '@cabloy/cli';
import fse from 'fs-extra';
import path from 'node:path';

import type { VonaBinConfigOptions } from './toolsBin/types.ts';

import { getImportEsm, loadJSONFile } from '../utils.ts';
import { generateVonaMeta } from './toolsBin/generateVonaMeta.ts';

declare module '@cabloy/cli' {
  interface ICommandArgv {
    mode?: VonaMetaMode;
    flavor?: VonaMetaFlavor;
    retainRuntime?: boolean;
    attach?: boolean;
  }
}

export class CliBinPlay extends BeanCliBase {
  async execute() {
    const { argv } = this.context;
    // super
    await super.execute();
    const projectPath = argv.projectPath;
    // test
    await this._play(projectPath);
  }

  async _play(projectPath: string) {
    const { argv } = this.context;
    const mode: VonaMetaMode = argv.mode || 'dev';
    const flavor: VonaMetaFlavor = argv.flavor || 'play';
    const configMeta: VonaConfigMeta = { flavor, mode };
    if (!argv.retainRuntime || !fse.existsSync(path.join(projectPath, '.vona'))) {
      const configOptions: VonaBinConfigOptions = {
        appDir: projectPath,
        runtimeDir: '.vona',
        workers: 1,
      };
      await generateVonaMeta(configMeta, configOptions);
    }
    if (argv.attach) {
      await this._runAttach(projectPath);
    } else {
      await this._runIsolate(projectPath);
    }
  }

  async _runAttach(projectPath: string) {
    const runtimeFile = path.join(projectPath, '.app/runtime/-.json');
    if (!fse.existsSync(runtimeFile)) throw new Error('dev server not running');
    // args
    let args: string[] = [];
    const pos = process.argv.indexOf(':bin:play');
    if (pos > -1) {
      args = args.concat(process.argv.slice(pos + 1));
    }
    const body = { args, projectPath };
    //
    const runtime = await loadJSONFile(runtimeFile);
    const runtimeCore = runtime['a-core'];
    const runtimeUser = runtime['a-user'];
    const result = await fetch(`${runtimeCore?.protocol}://${runtimeCore?.host}/api/play`, {
      method: 'post',
      headers: {
        'content-type': 'application/json',
        'authorization': `Bearer ${runtimeUser?.accessToken}`,
      },
      body: JSON.stringify(body),
    });
    if (result.status !== 200) {
      const message = `error: ${result.status}, ${result.statusText}`;
      throw new Error(message);
    }
    const res = await result.json();
    if (res.code !== 0) throw new Error(res.message);
    if (res.data !== undefined) {
      // eslint-disable-next-line no-console
      console.log(res.data);
    }
  }

  async _runIsolate(projectPath: string) {
    // testFile
    let testFile = path.join(import.meta.dirname, '../../../toolsIsolate/play.ts');
    if (!fse.existsSync(testFile)) {
      testFile = path.join(import.meta.dirname, '../dist-toolsIsolate/play.js');
    }
    // run
    let args: string[] = [];
    args = args.concat([getImportEsm(), testFile, projectPath]);
    // args = args.concat(['--experimental-transform-types', getImportEsm(), testFile, projectPath]);
    const pos = process.argv.indexOf(':bin:play');
    if (pos > -1) {
      args = args.concat(process.argv.slice(pos + 1));
    }
    await this.helper.spawnExe({
      cmd: 'node',
      args,
      options: {
        cwd: projectPath,
      },
    });
  }
}
