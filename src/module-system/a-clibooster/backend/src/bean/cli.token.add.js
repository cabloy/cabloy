module.exports = class Cli extends module.meta.class.CliBase {
  get localToken() {
    return this.ctx.bean.local.module('a-authopen').token;
  }

  async execute({ user }) {
    const { argv } = this.context;
    // super
    await super.execute({ user });
    // add
    const { fileName } = await this.localToken.add({
      name: argv.name,
      host: argv.host,
      clientID: argv.clientID,
      clientSecret: argv.clientSecret,
      log: false,
    });
    // chalk
    const text = this.helper.chalk.keyword('cyan')(`\n  ${fileName}\n`);
    await this.console.log({ text });
  }
};
