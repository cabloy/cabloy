const require3 = require('require3');
const assert = require3('assert');

module.exports = app => {

  class BroadcastController extends app.Controller {

    async broadcast() {
      const { sameAsCaller, message } = this.ctx.request.body;
      if (!sameAsCaller) {
        // do something
      }
      assert.equal(message, 'hello');
      this.ctx.success();
    }

    async emit() {
      this.ctx.app.meta.broadcast.emit({
        subdomain: this.ctx.subdomain,
        module: 'test-party',
        broadcastName: 'broadcastTest',
        data: { message: 'hello' },
      });
      this.ctx.success();
    }

  }

  return BroadcastController;

};
