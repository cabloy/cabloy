module.exports = app => {

  class AuthController extends app.Controller {

    // return current user auth info
    //   { op:{id},agent:{id},provider}
    async echo() {
      const info = await this.ctx.meta.auth.echo();
      this.ctx.success(info);
    }

    async check() {
      const info = await this.ctx.meta.auth.check();
      this.ctx.success(info);
    }

    async logout() {
      const info = await this.ctx.meta.auth.logout();
      this.ctx.success(info);
    }

    async installAuthProviders() {
      // register all authProviders
      await this.ctx.service.auth.registerAllProviders();
      // verify
      this.app.passport.verify(async (ctx, profileUser) => {
        // state: login/associate
        const state = ctx.request.query.state || 'login';
        // user verify
        return await ctx.meta.user.verify({ state, profileUser });
      });
      // // serializeUser
      // app.passport.serializeUser(async (ctx, user) => {
      //   return {
      //     agent: { id: user.agent.id, iid: user.agent.iid },
      //     op: { id: user.op.id, iid: user.op.iid },
      //     provider: user.provider,
      //   };
      // });
      // // deserializeUser
      // app.passport.deserializeUser(async (ctx, user) => {
      //   return user;
      // });
      // ok
      this.ctx.success();
    }

    async register() {
      const res = await this.ctx.service.auth.register({
        module: this.ctx.request.body.module,
        providerName: this.ctx.request.body.providerName,
      });
      this.ctx.success(res);
    }

  }

  return AuthController;
};
