module.exports = class Cli extends module.meta.class.CliBase {
  get localToken() {
    return this.ctx.bean.local.module('a-authopen').token;
  }

  async execute({ user }) {
    // super
    await super.execute({ user });
    // add
    const { fileName, config } = await this.localToken.list({
      log: false,
    });
    // tokens
    if (!config.tokens) config.tokens = {};
    const table = this.helper.newTable({
      head: ['Token Name', 'Host'],
      colWidths: [30, 50],
    });
    for (const tokenName in config.tokens) {
      const token = config.tokens[tokenName];
      table.push([tokenName, token.host]);
    }
    await this.console.log({ text: table.toString() });
    // fileName
    const text = this.helper.chalk.keyword('cyan')(`\n  ${fileName}\n`);
    await this.console.log({ text });
  }
};
