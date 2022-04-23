module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Local {
    constructor(options) {
      this.options = options;
    }

    async log({ progressNo, total, progress, text }) {
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
