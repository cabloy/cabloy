const DingtalkHelperFn = require('../common/dingtalkHelper.js');

module.exports = app => {

  class AuthMini extends app.Service {

    async login({ scene, code }) {
      if (!code) return this.ctx.throw(403);
      const res = await this.ctx.meta.wxwork.app.mini[scene].code2Session(code);
      // const res = { errcode: 0, userid: 'YangJian1', session_key: 'kJtdi6RF+Dv67QkbLlPGjw==' };
      if (res.errcode) throw new Error(res.errmsg);
      const session_key = res.session_key;
      const memberId = res.userid;
      // verify
      const wxworkHelper = new (WxworkHelperFn(this.ctx))();
      await wxworkHelper.verifyAuthUser({ scene: `wxworkmini${scene}`, memberId });
      // save session_key, because ctx.user maybe changed
      await this.ctx.meta.wxwork.mini[scene].saveSessionKey(session_key);
      // echo
      return await this.ctx.meta.auth.echo();
    }

  }

  return AuthMini;
};
