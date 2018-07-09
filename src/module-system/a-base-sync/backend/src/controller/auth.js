module.exports = app => {

  class AuthController extends app.Controller {

    // return current user auth info
    //   { op:{id},agent:{id},provider}
    async echo() {
      try {
        if (!this.ctx.isAuthenticated() || !this.ctx.user.op || !this.ctx.user.agent) {
          // anonymous
          await this.ctx.meta.user.loginAsAnonymous();
        } else {
          // check if deleted,disabled,agent
          await this.ctx.meta.user.check();
        }
        // logined
        this.ctx.success(this.ctx.user);
      } catch (e) {
        // deleted,disabled
        await this.logout();
      }
    }

    async check() {
      this.ctx.success(this.ctx.user);
    }

    async logout() {
      await this.ctx.logout();
      await this.ctx.meta.user.loginAsAnonymous();
      this.ctx.success(this.ctx.user);
    }

    async installAuthProviders() {
      // register all authProviders
      await this.ctx.service.auth.registerAllProviders();
      // verify
      this.app.passport.verify(async function(ctx, profileUser) {
        return await ctx.meta.user.verify(profileUser);
      });
      this.ctx.success();
    }

  }

  return AuthController;
};
