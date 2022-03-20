module.exports = app => {
  class AuthMini extends app.Service {
    get localHelper() {
      return this.ctx.bean.local.helper;
    }

    async login({ scene, code }) {
      if (!code) return this.ctx.throw(403);
      const res = await this.ctx.bean.wxwork.app.mini[scene].code2Session(code);
      // const res = { errcode: 0, userid: 'YangJian1', session_key: 'kJtdi6RF+Dv67QkbLlPGjw==' };
      if (res.errcode) throw new Error(res.errmsg);
      const session_key = res.session_key;
      const memberId = res.userid;
      // verify
      await this.localHelper.verifyAuthUser({ scene: `wxworkmini${scene}`, memberId, needLogin: true });
      // save session_key, because ctx.state.user maybe changed
      await this.ctx.bean.wxwork.mini[scene].saveSessionKey(session_key);
      // echo
      return await this.ctx.bean.auth.echo();
    }
  }

  return AuthMini;
};
