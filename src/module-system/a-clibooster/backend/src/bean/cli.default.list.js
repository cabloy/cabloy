module.exports = ctx => {
  class Cli extends ctx.app.meta.CliBase(ctx) {
    async execute({ command, context, user }) {
      const { argv } = context;
      // super
      await super.execute({ command, context, user });
    }
  }

  return Cli;
};
