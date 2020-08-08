const require3 = require('require3');
const assert = require3('assert');

module.exports = app => {

  class SessionController extends app.Controller {

    async session() {
      // key1
      this.ctx.session._key1 = 1;
      // echo1
      const res = await this.ctx.performAction({
        method: 'post',
        url: 'test/ctx/session/echo1',
      });
      assert.equal(res.user.op.id, this.ctx.user.op.id);
      assert.equal(res.instance.id, this.ctx.instance.id);
      assert.equal(this.ctx.session._key2, 2);
      // done
      this.ctx.success();
    }

    async echo1() {
      // echo2
      const res = await this.ctx.performAction({
        method: 'post',
        url: 'test/ctx/session/echo2',
      });
      // echo back
      this.ctx.success(res);
    }

    async echo2() {
      // check
      assert.equal(this.ctx.session._key1, 1);
      // key2
      this.ctx.session._key2 = 2;
      // echo back
      this.ctx.success({
        user: this.ctx.user,
        instance: this.ctx.instance,
      });
    }

  }

  return SessionController;
};
