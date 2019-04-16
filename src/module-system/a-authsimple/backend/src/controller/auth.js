module.exports = app => {
  class AuthController extends app.Controller {

    async add() {
      const { userId, password } = this.ctx.request.body;
      await this.service.auth.add({ userId, password });
      this.ctx.success();
    }

    async signin() {
      const { auth, password, rememberMe } = this.ctx.request.body.data;
      const res = await this.service.auth.signin({ auth, password, rememberMe });
      this.ctx.success(res);
    }

    async signup() {
      const { userName, realName, email, mobile, password } = this.ctx.request.body.data;
      const state = this.ctx.request.body.state;
      const res = await this.service.auth.signup({ state, userName, realName, email, mobile, password });
      this.ctx.success(res);
    }

    async passwordChange() {
      const { passwordOld, passwordNew } = this.ctx.request.body.data;
      await this.service.auth.passwordChange({ passwordOld, passwordNew, userId: this.ctx.user.agent.id });
      this.ctx.success();
    }

    async passwordForgot() {
      const { email } = this.ctx.request.body.data;
      await this.service.auth.passwordForgot({ email });
      this.ctx.success();
    }

    async passwordReset() {
      const { passwordNew } = this.ctx.request.body.data;
      const token = this.ctx.request.body.token;
      await this.service.auth.passwordReset({ passwordNew, token });
      this.ctx.success();
    }

    async emailConfirm() {
      const { email } = this.ctx.request.body.data;
      await this.service.auth.emailConfirm({ email, user: this.ctx.user.agent });
      this.ctx.success();
    }

    async emailConfirmation() {
      const token = this.ctx.request.query.token;
      await this.service.auth.emailConfirmation({ token });
      // this.ctx.success();
    }


  }
  return AuthController;
};
