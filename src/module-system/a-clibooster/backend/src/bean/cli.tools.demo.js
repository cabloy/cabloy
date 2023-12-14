const moduleInfo = module.info;
module.exports = class Cli extends module.meta.class.CliBase {
  get localUtils() {
    return this.ctx.bean.local.module(moduleInfo.relativeName).utils;
  }

  async execute({ user }) {
    const { argv } = this.context;
    // super
    await super.execute({ user });
    // check env
    if (!this.ctx.app.meta.isLocal) this.ctx.throw(403);
    // methods
    let methods = argv._;
    if (methods.length === 0) {
      methods = ['execute']; // default method
    }
    // loop
    for (const method of methods) {
      // log
      const log = this.helper.chalk.keyword('yellow')(`\n=== method: ${method} ===\n`);
      await this.console.log(log);
      // execute
      const res = await this.localUtils.demoExecute({ method, argv, cli: this });
      // log
      await this.console.log(`===> time begin : ${res.timeBegin}`);
      await this.console.log(`===> time end   : ${res.timeEnd}`);
      await this.console.log(`===> duration   : ${res.duration}ms`);
      await this.console.log('===> result     :');
      await this.console.log({ text: JSON.stringify(res.result, null, 2) });
    }
  }
};
