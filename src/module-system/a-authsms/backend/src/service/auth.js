module.exports = app => {
  class Auth extends app.Service {

    async signin({ mobile, rememberMe }) {
      try {
        const res = await this.ctx.performAction({
          method: 'post',
          url: 'passport/a-authsimple/authsimple',
          body: { auth, password, rememberMe },
        });
        return res;
      } catch (err) {
        const error = new Error();
        error.code = err.code;
        error.message = err.message;
        throw error;
      }
    }

  }

  return Auth;
};
