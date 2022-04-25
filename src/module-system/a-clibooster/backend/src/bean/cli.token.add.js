module.exports = ctx => {
  class Cli extends ctx.app.meta.CliBase(ctx) {
    get localToken() {
      return ctx.bean.local.module('a-authopen').token;
    }

    async execute({ user }) {
      const { argv } = context;
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
  }

  return Cli;
};
