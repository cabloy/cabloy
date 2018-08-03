const require3 = require('require3');
const assert = require3('assert');

module.exports = app => {
  const pMap = require('p-map');
  class TestController extends app.Controller {

    async sequence() {

      // current
      let current = await this.ctx.meta.sequence.current('test');
      assert(current === 0);

      // next
      let next = await this.ctx.meta.sequence.next('test');
      assert(next === 1);

      // current
      current = await this.ctx.meta.sequence.current('test');
      assert(current === 1);

      // reset
      await this.ctx.meta.sequence.reset('test');

      // other module's sequence
      const moduleSequence = this.ctx.meta.sequence.module(this.ctx.module.info.relativeName);

      // next
      next = await moduleSequence.next('test');
      assert(next === 1);

      // current
      current = await moduleSequence.current('test');
      assert(current === 1);

      // reset
      await moduleSequence.reset('test');

      // concurrency
      const results = await pMap([ 1, 2, 3, 4, 5 ], async () => {
        return await moduleSequence.next('test');
      });
      assert(results.join(',') === '1,2,3,4,5');

      // reset
      await moduleSequence.reset('test');

      this.ctx.success();
    }

  }
  return TestController;
};

