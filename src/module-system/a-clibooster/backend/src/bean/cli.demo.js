module.exports = ctx => {
  class Cli extends ctx.app.meta.CliBase(ctx) {
    async meta({ argv, user }) {
      const meta = await super.meta({ argv, user });
      return meta;
    }
  }

  return Cli;
};
