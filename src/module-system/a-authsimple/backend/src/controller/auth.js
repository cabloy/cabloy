module.exports = app => {
  class AuthController extends app.Controller {

    async add() {
      const { userId, password } = this.ctx.request.body;
      await this.service.auth.add({ userId, password });
      this.ctx.success();
    }

    async signup() {
      const { userName, realName, email, mobile, password } = this.ctx.request.body.data;
      await this.service.auth.signup({ userName, realName, email, mobile, password });
      this.ctx.success();
    }

    async reset() {
      const { passwordOld, passwordNew } = this.ctx.request.body.data;
      await this.service.auth.reset({ passwordOld, passwordNew, userId: this.ctx.user.agent.id });
      this.ctx.success();
    }

    async signin() {
      const { auth, password, rememberMe } = this.ctx.request.body.data;
      const res = await this.service.auth.signin({ auth, password, rememberMe });
      this.ctx.success(res);
    }

  }
  return AuthController;
};
