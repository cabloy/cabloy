// const moduleInfo = module.info;
module.exports = class Local {
  constructor(cli) {
    this.cli = cli;
  }

  get options() {
    return this.cli.options;
  }

  get context() {
    return this.cli.options.context;
  }

  async log(data, options = {}) {
    if (!data) return;
    // data
    if (typeof data !== 'object') {
      data = { text: String(data) };
    }
    let { progressNo, total, progress, text } = data;
    // logPrefix
    const logPrefix = options.logPrefix;
    if (logPrefix) {
      text = this._adjustText(logPrefix, text);
    }
    // fallback
    if (!this.cli.terminal) {
      return console.log(text);
    }
    // update
    return await ctx.bean.progress.update({
      progressId: this.options.progressId,
      progressNo,
      total,
      progress,
      text,
    });
  }

  _adjustText(prefix, text) {
    return String(text)
      .split('\n')
      .map(item => (item ? prefix + item : item))
      .join('\n');
  }
};
