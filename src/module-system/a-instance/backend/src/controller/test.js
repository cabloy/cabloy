const require3 = require('require3');
const assert = require3('assert');

module.exports = app => {
  class TestController extends app.Controller {

    async instance() {
      assert(this.ctx.instance.id === 1);
      this.ctx.success();
    }

  }
  return TestController;
};
