module.exports = app => {
  class AuthController extends app.Controller {

    async signin() {
      const { mobile, rememberMe } = this.ctx.request.body.data;
      const res = await this.service.auth.signin({ mobile, rememberMe });
      this.ctx.success(res);
    }

    async signup() {
      const { userName, realName, mobile } = this.ctx.request.body.data;
      const state = this.ctx.request.body.state;
      const res = await this.service.auth.signup({
        user: this.ctx.user.agent,
        state,
        userName, realName, mobile,
      });
      this.ctx.success(res);
    }

    async mobileVerify() {
      const { mobile } = this.ctx.request.body.data;
      const res = await this.service.auth.mobileVerify({
        user: this.ctx.user.agent,
        mobile,
      });
      this.ctx.success(res);
    }


  }
  return AuthController;
};
