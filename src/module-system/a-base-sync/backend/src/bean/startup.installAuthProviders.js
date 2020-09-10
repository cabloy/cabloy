module.exports = app => {
  class Startup extends app.meta.BeanBase {

    async execute() {
      // register all authProviders
      await this.ctx.bean.auth._installAuthProviders();

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
        const _user = {
          op: { id: user.op.id, iid: user.op.iid, anonymous: user.op.anonymous },
          provider: user.provider,
        };
        if (user.agent.id !== user.op.id) {
          _user.agent = { id: user.agent.id, iid: user.agent.iid, anonymous: user.agent.anonymous };
        }
        return _user;
      });
      // deserializeUser
      app.passport.deserializeUser(async (ctx, user) => {
        return user;
      });
    }

  }

  return Startup;
};
