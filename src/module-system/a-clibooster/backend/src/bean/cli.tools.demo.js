module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Cli extends ctx.app.meta.CliBase(ctx) {
    get localUtils() {
      return ctx.bean.local.module(moduleInfo.relativeName).utils;
    }

    async execute({ user }) {
      const { argv } = this.context;
      // super
      await super.execute({ user });
      // check env
      if (!ctx.app.meta.isLocal) ctx.throw(403);
      // methods
      let methods = argv._;
      if (methods.length === 0) {
        methods = ['execute']; // default method
      }
      // loop
      for (const method of methods) {
        // execute
        const res = await this.localUtils.demoExecute({ method, argv });
        // log
        await this.console.log(`===> method     : ${method}`);
        await this.console.log(`===> time begin : ${res.timeBegin}`);
        await this.console.log(`===> time end   : ${res.timeEnd}`);
        await this.console.log(`===> duration   : ${res.duration}ms`);
        await this.console.log({ text: res.result });
      }
    }
  }

  return Cli;
};
