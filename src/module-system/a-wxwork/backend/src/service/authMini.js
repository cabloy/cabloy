const WxworkHelperFn = require('../common/wxworkHelper.js');

module.exports = app => {

  class AuthMini extends app.Service {

    async login({ code }) {
      if (!code) return this.ctx.throw(403);
      const res = await this.ctx.meta.wxwork.app.selfBuilt.code2Session(code);
      if (res.errcode) throw new Error(res.errmsg);
      const session_key = res.session_key;
      const memberId = res.userid;
      // verify
      const wxworkHelper = new (WxworkHelperFn(this.ctx))();
      await wxworkHelper.verifyAuthUser({ scene: 2, memberId });
      // save session_key, because ctx.user maybe changed
      await this.ctx.meta.wxwork.mini.saveSessionKey(session_key);
      // echo
      return await this.ctx.meta.auth.echo();
    }

  }

  return AuthMini;
};
