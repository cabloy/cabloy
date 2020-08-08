const require3 = require('require3');
const assert = require3('assert');

module.exports = app => {

  class StatusController extends app.Controller {

    async status() {

      // name
      const name = '__test_enable';

      // get
      let value = await this.ctx.meta.status.get(name);
      assert.equal(value, undefined);

      // set
      await this.ctx.meta.status.set(name, true);

      // get
      value = await this.ctx.meta.status.get(name);
      assert.equal(value, true);

      // other module's status
      const moduleStatus = this.ctx.meta.status.module(this.ctx.module.info.relativeName);
      value = await moduleStatus.get(name);
      assert.equal(value, true);

      // set
      await this.ctx.meta.status.set(name, false);

      // get
      value = await this.ctx.meta.status.get(name);
      assert.equal(value, false);

      // done
      this.ctx.success();
    }

  }
  return StatusController;
};

