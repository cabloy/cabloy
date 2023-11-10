module.exports = ctx => {
  return {
    // login
    async login({ auth, password = '123456' }) {
      return await ctx.meta.util.performAction({
        innerAccess: false,
        method: 'post',
        url: '/a/auth/passport/a-authsimple/authsimple',
        body: {
          data: {
            auth,
            password,
          },
        },
      });
    },
    // logout
    async logout() {
      return await ctx.meta.util.performAction({
        innerAccess: false,
        method: 'post',
        url: '/a/base/auth/logout',
      });
    },
  };
};
