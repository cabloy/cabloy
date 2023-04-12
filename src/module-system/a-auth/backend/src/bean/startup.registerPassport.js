module.exports = app => {
  class Startup extends app.meta.BeanBase {
    async execute() {
      // verify
      app.passport.verify(async (ctx, profileUser) => {
        // state: login/associate
        const state = ctx.request.query.state || 'login';
        // maybe ready
        if (profileUser.op && profileUser.agent && profileUser.provider) {
          return profileUser;
        }
        // user verify
        console.log('----app.passport.verify:', profileUser.module, profileUser.provider, profileUser.providerScene);
        return await ctx.bean.user.verify({ state, profileUser });
      });
      // serializeUser
      app.passport.serializeUser(async (ctx, user) => {
        ctx.state.user = user;
        return await ctx.bean.auth.serializeUser({ user });
      });
      // deserializeUser
      app.passport.deserializeUser(async (ctx, user) => {
        if (!ctx.instance) {
          return null;
        }
        if (ctx.state && ctx.state.user) {
          return ctx.bean.auth._pruneUser({ user: ctx.state.user });
        }
        return await ctx.bean.auth.deserializeUser({ user });
      });
    }
  }

  return Startup;
};
