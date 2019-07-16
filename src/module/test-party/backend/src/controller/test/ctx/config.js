const require3 = require('require3');
const assert = require3('assert');

module.exports = app => {

  class ConfigController extends app.Controller {

    async test() {
      // current module
      let message = this.ctx.config.message;
      assert.equal(message, 'Hello World');

      // other module
      message = this.ctx.config.module('test-party').message;
      assert.equal(message, 'Hello World');

      // done
      this.ctx.success();
    }

  }

  return ConfigController;
};
