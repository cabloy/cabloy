import type { IConsoleLogData, IConsoleLogOptions } from '../types/console.ts';
import type { BeanCliBase } from './bean.cli.base.ts';

export class LocalConsole {
  cli: BeanCliBase;

  constructor(cli) {
    this.cli = cli;
  }

  get options() {
    return this.cli.options;
  }

  get context() {
    return this.cli.options.context;
  }

  async log(data?: IConsoleLogData | string, options: IConsoleLogOptions = {}) {
    if (!data) return;
    // data
    if (typeof data !== 'object') {
      data = { text: String(data) };
    }
    let { /* progressNo, */ total, progress, text } = data;
    // logPrefix
    const logPrefix = options.logPrefix;
    if (logPrefix) {
      text = this._adjustText(logPrefix, text);
    }
    // fallback
    if (!this.cli.terminal) {
      if (total !== undefined && progress !== undefined) {
        const progressValid = progress >= 0;
        const progressText = `(${progressValid ? progress + 1 : '-'}/${total})`;
        if (progressValid) {
          text = this._adjustText(`${progressText}=> `, text);
        }
      }
      // eslint-disable-next-line
      console.log(text);
    }
  }

  _adjustText(prefix, text) {
    return String(text)
      .split('\n')
      .map(item => (item ? prefix + item : item))
      .join('\n');
  }
}
