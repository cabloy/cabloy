const require3 = require('require3');
const assert = require3('assert');

module.exports = app => {

  class StartupController extends app.Controller {

    async all() {
      console.log('test/feat/startup: all');
      assert.equal(this.ctx.instance, undefined);
      this.ctx.success();
    }

    async instance() {
      console.log(`test/feat/startup: instance:${this.ctx.instance.id}`);
      assert(this.ctx.instance.id > 0);
      this.ctx.success();
    }

  }

  return StartupController;
};
