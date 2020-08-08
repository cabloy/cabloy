const require3 = require('require3');
const assert = require3('assert');

module.exports = app => {

  class HookController extends app.Controller {

    async echo() {
      const data = this.ctx.request.body.data;
      assert.equal(data.text, 'before');
      data.text = 'before:echo';
      this.ctx.success();
    }

    async echoBefore() {
      const ctxCaller = this.ctx.ctxCaller;
      ctxCaller.request.body.data = { text: 'before' };
      this.ctx.success();
    }
    async echoAfter() {
      const ctxCaller = this.ctx.ctxCaller;
      const data = ctxCaller.request.body.data;
      assert.equal(data.text, 'before:echo');
      this.ctx.success();
    }

  }

  return HookController;
};

