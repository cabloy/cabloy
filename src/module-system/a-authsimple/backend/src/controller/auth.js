module.exports = class AuthController {
  async signin() {
    // data: { auth, password, rememberMe }
    const data = this.ctx.request.body.data;
    const state = this.ctx.request.body.state;
    const res = await this.service.auth.signin({ data, state });
    this.ctx.success(res);
  }

  async signup() {
    const { userName, realName, email, mobile, password } = this.ctx.request.body.data;
    const state = this.ctx.request.body.state;
    const res = await this.service.auth.signup({
      user: this.ctx.state.user.agent,
      state,
      userName,
      realName,
      email,
      mobile,
      password,
    });
    this.ctx.success(res);
  }

  async passwordChange() {
    // check demo
    this.ctx.bean.util.checkDemo();
    const { passwordOld, passwordNew } = this.ctx.request.body.data;
    await this.service.auth.passwordChange({ passwordOld, passwordNew, userId: this.ctx.state.user.agent.id });
    this.ctx.success();
  }

  async passwordForgot() {
    // check demo
    this.ctx.bean.util.checkDemo();
    const { email } = this.ctx.request.body.data;
    await this.service.auth.passwordForgot({ email });
    this.ctx.success();
  }

  async passwordReset() {
    // check demo
    this.ctx.bean.util.checkDemo();
    const { passwordNew } = this.ctx.request.body.data;
    const token = this.ctx.request.body.token;
    await this.service.auth.passwordReset({ passwordNew, token });
    this.ctx.success();
  }

  async emailConfirm() {
    const { email } = this.ctx.request.body.data;
    await this.service.auth.emailConfirm({ email, user: this.ctx.state.user.agent });
    this.ctx.success();
  }

  async emailConfirmation() {
    const token = this.ctx.request.query.token;
    await this.service.auth.emailConfirmation({ token });
    // this.ctx.success();
  }

  async checkStatus() {
    const res = await this.service.auth.checkStatus({ user: this.ctx.state.user.agent });
    this.ctx.success(res);
  }
};
