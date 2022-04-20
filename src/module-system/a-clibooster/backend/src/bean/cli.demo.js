module.exports = ctx => {
  class Cli extends ctx.app.meta.CliBase {
    async meta({ argv, user }) {
      const meta = await super.meta({ argv, user });
    }
  }

  return Cli;
};
