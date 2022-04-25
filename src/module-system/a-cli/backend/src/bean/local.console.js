module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Local {
    constructor(cli, options) {
      this.cli = cli;
      this.options = options;
    }

    async log(options) {
      if (!options) return;
      if (typeof options !== 'object') {
        options = { text: String(options) };
      }
      const { progressNo, total, progress, text } = options;
      // update
      return await ctx.bean.progress.update({
        progressId: this.options.progressId,
        progressNo,
        total,
        progress,
        text,
      });
    }
  }
  return Local;
};
