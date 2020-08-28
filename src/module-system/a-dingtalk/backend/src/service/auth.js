const DingtalkHelperFn = require('../common/dingtalkHelper.js');

module.exports = app => {

  class Auth extends app.Service {

    async login({ scene, code, state }) {
      if (!scene || !code) return this.ctx.throw(403);
      // member
      const res = await this.ctx.meta.dingtalk.app.selfBuilt.user.getUserInfoByCode(code);
      const memberId = res.userid;
      // verify auth user
      const dingtalkHelper = new (DingtalkHelperFn(this.ctx))();
      await dingtalkHelper.verifyAuthUser({ state, scene: 'dingtalk', memberId });
      // echo
      return await this.ctx.meta.auth.echo();
    }

  }

  return Auth;
};
