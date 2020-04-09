const require3 = require('require3');
const assert = require3('assert');

module.exports = app => {

  class MemController extends app.Controller {

    async mem() {

      // name
      const name = '__test:name:mem';

      // set
      this.ctx.cache.mem.set(name, 'zhennann');

      // has
      let res = this.ctx.cache.mem.has(name);
      assert.equal(!!res, true);

      // get
      let value = this.ctx.cache.mem.get(name);
      assert.equal(value, 'zhennann');

      // remove
      this.ctx.cache.mem.remove(name);
      res = this.ctx.cache.mem.has(name);
      assert.equal(res, null);

      // set with timeout
      this.ctx.cache.mem.set(name, 'zhennann', 1000);

      // get
      value = this.ctx.cache.mem.get(name);
      assert.equal(value, 'zhennann');

      // other module's cache
      const moduleCache = this.ctx.cache.mem.module(this.ctx.module.info.relativeName);
      value = moduleCache.get(name);
      assert.equal(value, 'zhennann');

      // get after timeout
      await sleep(1500);
      value = this.ctx.cache.mem.get(name);
      assert.equal(value, null);

      // done
      this.ctx.success();
    }

  }
  return MemController;
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
