module.exports = ctx => {
  return {
    // login
    async login({ auth, password = '123456' }) {
      return await ctx.bean.authSimple.signinDirect({ data: { auth, password } });
    },
    // logout
    async logout() {
      return await ctx.bean.auth.logout();
    },
  };
};
