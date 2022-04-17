module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class AuthOpen {
    get modelAuthOpen() {
      return ctx.model.module(moduleInfo.relativeName).authOpen;
    }

    async verify({ clientID, clientSecret }) {
      // authOpen
      const authOpen = await this.modelAuthOpen.get({ clientID, clientSecret });
      if (!authOpen) return ctx.throw(403);
      // atomDisabled
      const atom = await ctx.bean.atom.modelAtom.get({ id: authOpen.atomId });
      if (atom.atomDisabled) return ctx.throw(403);
      // neverExpire/expireTime
      if (!authOpen.neverExpire && authOpen.expireTime <= Date.now()) {
        return ctx.throw.module(moduleInfo.relativeName, 1001);
      }
      // done
      return authOpen;
    }

    isAuthOpen() {
      const provider = this.getProperty(this.ctx, 'state.user.provider');
      if (!provider) return false;
      return provider.module === 'a-authopen' && provider.providerName === 'authopen' ? provider : null;
    }
  }
  return AuthOpen;
};
