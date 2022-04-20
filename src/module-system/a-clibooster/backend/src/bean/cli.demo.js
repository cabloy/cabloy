module.exports = ctx => {
  class Cli extends ctx.app.meta.CliBase(ctx) {
    async meta({ command, argv, user }) {
      const meta = await super.meta({ command, argv, user });
      return meta;
    }
  }

  return Cli;
};
