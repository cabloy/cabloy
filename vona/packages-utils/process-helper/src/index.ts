import ChildProcess from 'node:child_process';
import path from 'node:path';

// // only hook once and only when ever start any child.
// const childs: Set<ChildProcess.ChildProcess> = new Set();
// let hadHook = false;
// function gracefull(proc) {
//   // save child ref
//   childs.add(proc);

//   // only hook once
//   /* istanbul ignore else */
//   if (!hadHook) {
//     hadHook = true;
//     ['SIGINT', 'SIGQUIT', 'SIGTERM'].forEach(event => {
//       process.once(event, () => {
//         for (const child of childs) {
//           child.kill(event as any);
//         }
//       });
//     });
//   }
// }

export interface IProcessHelperSpawnOptions {
  cwd?: string;
  dummy?: boolean;
  logPrefix?: string;
  stdio?: any;
  shell?: boolean | string;
  // gracefull?: boolean;
}

export class ProcessHelperConsole {
  async log(data, options: IProcessHelperSpawnOptions = {}) {
    if (!data) return;
    // data
    if (typeof data !== 'object') {
      data = { text: String(data) };
    }
    let { text } = data;
    // logPrefix
    const logPrefix = options.logPrefix;
    if (logPrefix) {
      text = this._adjustText(logPrefix, text);
    }
    // log
    await this._logInner(data, text);
  }

  async _logInner(_data, text) {
    // fallback
    // eslint-disable-next-line
    console.log(text);
  }

  _adjustText(prefix, text) {
    return String(text)
      .split('\n')
      .map(item => (item ? prefix + item : item))
      .join('\n');
  }
}

export class ProcessHelper {
  cwd: string;
  console: ProcessHelperConsole;

  constructor(cwd?: string, console?: ProcessHelperConsole) {
    this.cwd = cwd || process.cwd();
    this.console = console || new ProcessHelperConsole();
  }

  async formatFile({ fileName, logPrefix }) {
    try {
      await this._formatFileInner({ fileName, logPrefix });
    } catch (err: any) {
      if (err.code === 2) {
        // not throw error
        return;
      } else if (err.code === 10001) {
        // try again
        await this._formatFileInner({ fileName, logPrefix });
        return;
      }
      throw err;
    }
  }

  private async _formatFileInner({ fileName, logPrefix }) {
    await this.spawnBin({
      cmd: 'oxfmt',
      args: ['--write', '--no-error-on-unmatched-pattern', '--threads=1', fileName],
      options: {
        logPrefix,
      },
    });
  }

  async spawnBin({
    cmd,
    args,
    options,
  }: {
    cmd: string;
    args?: string[];
    options?: IProcessHelperSpawnOptions;
  }): Promise<string> {
    cmd = path.join(this.cwd, 'node_modules/.bin', cmd);
    return await this.spawnCmd({ cmd, args, options });
  }

  async spawnCmd({
    cmd,
    args,
    options,
  }: {
    cmd: string;
    args?: string[];
    options?: IProcessHelperSpawnOptions;
  }): Promise<string> {
    if (process.platform.startsWith('win')) {
      cmd = `${cmd}.cmd`;
    }
    return await this.spawn({ cmd, args, options });
  }

  async spawnExe({
    cmd,
    args,
    options,
  }: {
    cmd: string;
    args?: string[];
    options?: IProcessHelperSpawnOptions;
  }): Promise<string> {
    if (process.platform.startsWith('win')) {
      cmd = `${cmd}.exe`;
    }
    return await this.spawn({ cmd, args, options });
  }

  async spawn({
    cmd,
    args = [],
    options = {},
  }: {
    cmd: string;
    args?: string[];
    options?: IProcessHelperSpawnOptions;
  }): Promise<string> {
    options.cwd = options.cwd || this.cwd;
    options.stdio = options.stdio || 'inherit';
    options.shell = options.shell ?? true;
    // options.gracefull = options.gracefull ?? true;
    return new Promise((resolve, reject) => {
      const logPrefix = options.logPrefix;
      const proc = ChildProcess.spawn(`${cmd} ${args.join(' ')}`, options);
      // if (options.gracefull) gracefull(proc);
      let stdout = '';
      let stderr = '';
      proc.stdout?.on('data', async data => {
        stdout += data.toString();
        if (!options.dummy) {
          await this.console.log({ text: data.toString() }, { logPrefix });
        }
      });
      proc.stderr?.on('data', async data => {
        stderr += data.toString();
        await this.console.log({ text: data.toString() }, { logPrefix });
      });
      proc.once('error', err => {
        reject(err);
      });
      proc.once('exit', code => {
        // if (options.gracefull) childs.delete(proc);
        if (code) {
          const message = stderr || `spawn ${cmd} ${args.join(' ')} fail, exit code: ${code}`;
          const err = new Error(message);
          (err as any).code = 10000 + Number(code);
          return reject(err);
        }
        resolve(stdout);
      });
    });
  }

  async npmPublish(options?: IProcessHelperSpawnOptions) {
    await this.spawnCmd({
      cmd: 'npm',
      args: ['publish'],
      options,
    });
  }

  async gitCommit(message: string, options?: IProcessHelperSpawnOptions) {
    // git status
    const stdout = await this.spawnExe({
      cmd: 'git',
      args: ['status'],
      options,
    });
    if (
      stdout.includes('nothing to commit, working tree clean') &&
      !stdout.includes('is ahead of')
    ) {
      // do nothing
      return;
    }
    if (!stdout.includes('is ahead of')) {
      // git add .
      await this.spawnExe({
        cmd: 'git',
        args: ['add', '.'],
        options,
      });
      // git commit
      await this.spawnExe({
        cmd: 'git',
        args: ['commit', '-m', message],
        options,
      });
    }
    // git push
    await this.spawnExe({
      cmd: 'git',
      args: ['push'],
      options,
    });
  }

  async tsc(args?: string[], options?: IProcessHelperSpawnOptions) {
    if (!args) args = ['-b'];
    const timeBegin = new Date();
    await this.console.log('tsc -b begin');
    await this.spawnBin({
      cmd: 'tsc',
      args,
      options,
    });
    const timeEnd = new Date();
    await this.console.log(`tsc -b end: ${(timeEnd.valueOf() - timeBegin.valueOf()) / 1000}s`);
  }
}
