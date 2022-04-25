module.exports = ctx => {
  class Cli extends ctx.app.meta.CliBase(ctx) {
    get localToken() {
      return ctx.bean.local.module('a-authopen').token;
    }

    async execute({ command, context, user }) {
      const { argv } = context;
      // super
      await super.execute({ command, context, user });
      // template
      const template = argv.template;
      if (template === 'module') {
        await this._create_template_module();
      }
    }

    async _create_template_module() {}
  }

  return Cli;
};
