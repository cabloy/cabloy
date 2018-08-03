const require3 = require('require3');
const assert = require3('assert');

module.exports = app => {
  class TestController extends app.Controller {

    async cachemem() {

      // set
      this.ctx.cache.mem.set('name', 'zhennann');

      // has
      let res = this.ctx.cache.mem.has('name');
      assert(res);

      // get
      let value = this.ctx.cache.mem.get('name');
      assert(value === 'zhennann');

      // remove
      this.ctx.cache.mem.remove('name');
      res = this.ctx.cache.mem.has('name');
      assert(!res);

      // set with timeout
      this.ctx.cache.mem.set('name', 'zhennann', 1000);

      // get
      value = this.ctx.cache.mem.get('name');
      assert(value === 'zhennann');

      // other module's cache
      const moduleCache = this.ctx.cache.mem.module(this.ctx.module.info.relativeName);
      value = moduleCache.get('name');
      assert(value === 'zhennann');

      // get after timeout
      await sleep(1000);
      value = this.ctx.cache.mem.get('name');
      assert(!value);

      // clear
      //   not clear, hold other caches
      // this.ctx.cache.mem.clear();

      this.ctx.success();
    }

    async cachedb() {

      // set
      await this.ctx.cache.db.set('name', 'zhennann');

      // has
      let res = await this.ctx.cache.db.has('name');
      assert(res);

      // get
      let value = await this.ctx.cache.db.get('name');
      assert(value === 'zhennann');

      // remove
      await this.ctx.cache.db.remove('name');
      res = await this.ctx.cache.db.has('name');
      assert(!res);

      // set with timeout
      await this.ctx.cache.db.set('name', 'zhennann', 1000);

      // get
      value = await this.ctx.cache.db.get('name');
      assert(value === 'zhennann');

      // other module's cache
      const moduleCache = this.ctx.cache.db.module(this.ctx.module.info.relativeName);
      value = await moduleCache.get('name');
      assert(value === 'zhennann');

      // get after timeout
      await sleep(1000);
      value = await this.ctx.cache.db.get('name');
      assert(!value);

      // clear
      //   not clear, hold other caches
      // await this.ctx.cache.db.clear();

      this.ctx.success();
    }

  }
  return TestController;
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
