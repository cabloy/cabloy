const require3 = require('require3');
const assert = require3('assert');

module.exports = app => {
  class TestController extends app.Controller {

    async status() {

      // get
      let value = await this.ctx.meta.status.get('__enable');
      assert(value === undefined);

      // set
      await this.ctx.meta.status.set('__enable', true);

      // get
      value = await this.ctx.meta.status.get('__enable');
      assert(value === true);

      // other module's status
      const moduleStatus = this.ctx.meta.status.module(this.ctx.module.info.relativeName);
      value = await moduleStatus.get('__enable');
      assert(value === true);

      // set
      await this.ctx.meta.status.set('__enable', false);

      // get
      value = await this.ctx.meta.status.get('__enable');
      assert(value === false);

      this.ctx.success();
    }

  }
  return TestController;
};

