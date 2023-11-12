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
    // catchError
    async catchError(fnMethod, fnError) {
      let success;
      let data;
      try {
        data = await fnMethod();
        success = true;
      } catch (err) {
        success = false;
        await fnError(err);
      }
      // success
      if (success) {
        const err = { code: 0 };
        await fnError(err, data);
      }
      return data;
    },
  };
};
