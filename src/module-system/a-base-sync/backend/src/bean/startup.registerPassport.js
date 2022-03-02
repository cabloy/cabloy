module.exports = app => {
  class Startup extends app.meta.BeanBase {
    async execute() {
      // verify
      app.passport.verify(async (ctx, profileUser) => {
        // state: login/associate
        const state = ctx.request.query.state || 'login';
        // user verify
        return await ctx.bean.user.verify({ state, profileUser });
      });
      // serializeUser
      app.passport.serializeUser(async (ctx, user) => {
        ctx.state.user = user;
        return await ctx.bean.auth.serializeUser({ user });
      });
      // deserializeUser
      app.passport.deserializeUser(async (ctx, user) => {
        return await ctx.bean.auth.deserializeUser({ user });
      });
    }
  }

  return Startup;
};
