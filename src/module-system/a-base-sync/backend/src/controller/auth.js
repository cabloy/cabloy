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
        const info = await this.getLoginInfo();
        this.ctx.success(info);
      } catch (e) {
        // deleted,disabled
        await this.logout();
      }
    }

    async check() {
      const info = await this.getLoginInfo();
      this.ctx.success(info);
    }

    async logout() {
      await this.ctx.logout();
      await this.ctx.meta.user.loginAsAnonymous();
      const info = await this.getLoginInfo();
      this.ctx.success(info);
    }

    async installAuthProviders() {
      // register all authProviders
      await this.ctx.service.auth.registerAllProviders();
      // verify
      this.app.passport.verify(async function(ctx, profileUser) {
        // user verify
        const verifyUser = await ctx.meta.user.verify(profileUser);
        // user verify event
        await ctx.meta.event.invoke({
          module: 'a-base', name: 'userVerify', data: { verifyUser, profileUser },
        });
        // ready
        return verifyUser;
      });
      this.ctx.success();
    }

    async register() {
      const res = await this.ctx.service.auth.register({
        module: this.ctx.request.body.module,
        providerName: this.ctx.request.body.providerName,
      });
      this.ctx.success(res);
    }

    async getLoginInfo() {
      const info = {
        user: this.ctx.user,
        instance: this.getInstance(),
      };
      // login info event
      await this.ctx.meta.event.invoke({
        name: 'loginInfo', data: { info },
      });
      return info;
    }

    getInstance() {
      return {
        name: this.ctx.instance.name,
        title: this.ctx.instance.title,
      };
    }

  }

  return AuthController;
};
