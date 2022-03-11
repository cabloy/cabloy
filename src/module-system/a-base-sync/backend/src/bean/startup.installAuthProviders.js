module.exports = app => {
  class Startup extends app.meta.BeanBase {
    async execute(context) {
      const options = context.options;
      // reset auth providers
      if (options.force) {
        await this.ctx.bean.base.authProvidersReset();
      }
      // register all authProviders
      await this.ctx.bean.authProvider._installAuthProviders();
    }
  }

  return Startup;
};
