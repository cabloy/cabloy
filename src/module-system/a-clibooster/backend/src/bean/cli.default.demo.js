module.exports = ctx => {
  class Cli extends ctx.app.meta.CliBase(ctx) {
    async meta({ command, context, user }) {
      const meta = await super.meta({ command, context, user });
      return meta;
    }
  }

  return Cli;
};
