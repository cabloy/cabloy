module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class AuthOpen {
    isAuthOpen() {
      const provider = this.getProperty(this.ctx, 'state.user.provider');
      if (!provider) return false;
      return provider.module === 'a-authopen' && provider.providerName === 'authopen' ? provider : null;
    }
  }
  return AuthOpen;
};
