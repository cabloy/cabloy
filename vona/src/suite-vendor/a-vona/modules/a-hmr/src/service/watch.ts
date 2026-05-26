import { catchError } from '@cabloy/utils';
import chalk from 'chalk';
import chokidar, { FSWatcher } from 'chokidar';
import { globby } from 'globby';
import path from 'node:path';
import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';

import type { TypeBroadcastReloadFileJobData } from '../bean/broadcast.reloadFile.ts';
import type { TypeHmrWatchScene } from '../types/hmr.ts';

type TypePathWatchStrict = [TypeHmrWatchScene, RegExp];

const __pathesWatch = [
  'src/backend/config/config/*.tsx',
  '**/src/config/errors.ts',
  '**/src/config/locale/*.ts',
  '**/src/config/config.ts',
  '**/src/config/constants.ts',
  '**/src/controller/*.ts(x)?',
  '**/src/model/*.ts',
  '**/src/service/*.ts',
  '**/src/dto/*.ts(x)?',
  '**/src/entity/*.ts(x)?',
  '**/src/bean/*.*.ts',
];

const __pathesWatchStrict: TypePathWatchStrict[] = [
  ['_error', /\/src\/config\/errors.ts/],
  ['_locale', /\/src\/config\/locale\/[^/]+.ts/],
  ['_config', /\/src\/config\/config.ts/],
  ['_constant', /\/src\/config\/constants.ts/],
  ['controller', /\/src\/controller\/[^/]+.tsx?/],
  ['model', /\/src\/model\/[^/]+.ts/],
  ['service', /\/src\/service\/[^/]+.ts/],
  ['dto', /\/src\/dto\/[^/]+.tsx?/],
  ['entity', /\/src\/entity\/[^/]+.tsx?/],
  ['bean', /\/src\/bean\/[^/]+.ts/],
];

@Service()
export class ServiceWatch extends BeanBase {
  private _watcher?: FSWatcher;
  private _changeFiles: Record<string, number | undefined> = {};

  async start() {
    // stop
    await this.stop();
    // watcher
    const watchDirs = await this._collectWatchDirs();
    this._watcher = chokidar
      .watch(watchDirs, {
        cwd: this.app.projectPath,
      })
      .on('change', async file => {
        const [_, err] = await catchError(() => {
          return this._onChange(file);
        });
        if (err) {
          this.app.handleError(err);
        }
      });
  }

  async stop() {
    // close
    if (this._watcher) {
      await this._watcher.close();
      this._watcher = undefined;
      return true;
    }
    return false;
  }

  protected async _onChange(file: string) {
    const datePrev = this._changeFiles[file];
    const dateNow = Date.now();
    if (datePrev && datePrev + this.scope.config.change.debounce >= dateNow) {
      // donothing
      return;
    }
    this._changeFiles[file] = dateNow;
    await this._onChangeInner(file);
  }

  protected async _onChangeInner(file: string) {
    const file2 = file.replace(/\\/g, '/');
    const item = __pathesWatchStrict.find(item => item[1].test(file2));
    if (!item) {
      // log
      const message = `[hmr] reload: ${file}`;
      // eslint-disable-next-line
      console.log(chalk.cyan(message));
      // only reload
      this.app.bean.worker.reloadAll();
      return;
    }
    const timeBegin = new Date();
    await this._reloadFile({
      sceneName: item[0],
      file: path.join(this.app.projectPath, file),
    });
    const timeEnd = new Date();
    // log
    const message = `[hmr] reload ${timeEnd.valueOf() - timeBegin.valueOf()}ms: ${file}`;
    // eslint-disable-next-line
    console.log(chalk.cyan(message));
  }

  private async _reloadFile(data: TypeBroadcastReloadFileJobData) {
    this.scope.broadcast.reloadFile.emit(data);
    await this._reloadFileWorker(data);
  }

  public async _reloadFileWorker(data: TypeBroadcastReloadFileJobData) {
    return await this.bean.executor.newCtx(
      async () => {
        return await this.scope.service.hmr.reloadFile(data.sceneName, data.file);
      },
      { dbInfo: {}, instanceName: '' },
    );
  }

  private async _collectWatchDirs() {
    return await globby(__pathesWatch, {
      cwd: this.app.projectPath,
      onlyFiles: true,
      ignore: ['**/node_modules/**'],
    });
  }
}
