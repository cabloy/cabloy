module.exports = class Startup {
  async execute() {
    // verify
    this.app.passport.verify(async (ctx, profileUser) => {
      // state: login/associate
      const state = ctx.request.query.state || 'login';
      // maybe ready
      if (profileUser.op && profileUser.agent && profileUser.provider) {
        return profileUser;
      }
      // user verify
      return await ctx.bean.user.verify({ state, profileUser });
    });
    // serializeUser
    this.app.passport.serializeUser(async (ctx, user) => {
      ctx.state.user = user;
      return await ctx.bean.auth.serializeUser({ user });
    });
    // deserializeUser
    this.app.passport.deserializeUser(async (ctx, user) => {
      if (!ctx.instance) {
        return null;
      }
      if (ctx.state && ctx.state.user) {
        return ctx.bean.auth._pruneUser({ user: ctx.state.user });
      }
      return await ctx.bean.auth.deserializeUser({ user });
    });
  }
};
