module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Auth extends app.Service {
    // mobile: not use
    async signup({ user, state = 'login', userName, realName, email, /* mobile,*/ password }) {
      return await this.ctx.bean.authSimple.signup({ user, state, userName, realName, email, /* mobile,*/ password });
    }

    // data: { auth, password, rememberMe }
    async signin({ data, state = 'login' }) {
      return await this.ctx.bean.authSimple.signin({ data, state });
    }

    async add({ userId, password }) {
      return await this.ctx.bean.authSimple.add({ userId, password });
    }

    async passwordChange({ passwordOld, passwordNew, userId }) {
      return await this.ctx.bean.authSimple.passwordChange({ passwordOld, passwordNew, userId });
    }

    async passwordReset({ passwordNew, token }) {
      return await this.ctx.bean.authSimple.passwordReset({ passwordNew, token });
    }

    async passwordForgot({ email }) {
      return await this.ctx.bean.authSimple.passwordForgot({ email });
    }

    async emailConfirm({ email, user }) {
      return await this.ctx.bean.authSimple.emailConfirm({ email, user });
    }

    // invoke by user clicking the link
    async emailConfirmation({ token }) {
      return await this.ctx.bean.authSimple.emailConfirmation({ token });
    }

    async checkStatus({ user }) {
      return await this.ctx.bean.authSimple.checkStatus({ user });
    }
  }

  return Auth;
};
