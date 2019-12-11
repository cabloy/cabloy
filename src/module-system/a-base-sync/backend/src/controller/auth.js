const require3 = require('require3');
const extend = require3('extend2');

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
      this.app.passport.verify(async (ctx, profileUser) => {
        // state: login/associate
        const state = ctx.request.query.state || 'login';
        // user verify
        const verifyUser = await ctx.meta.user.verify({ state, profileUser });
        // user verify event
        await ctx.meta.event.invoke({
          module: 'a-base', name: 'userVerify', data: { verifyUser, profileUser },
        });
        // ready
        return verifyUser;
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

    async getLoginInfo() {
      const info = {
        user: this.ctx.user,
        instance: this.getInstance(),
        config: this.getConfig(),
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

    getConfig() {
      // account
      const account = extend(true, {}, this.ctx.config.account);
      account.activatedRoles = undefined;
      // config
      const config = {
        modules: {
          'a-base': {
            account,
          },
        },
      };
      return config;
    }

  }

  return AuthController;
};
