const require3 = require('require3');
const assert = require3('assert');
const pMap = require3('p-map');

module.exports = app => {

  class SequenceController extends app.Controller {

    async sequence() {

      // current
      let current = await this.ctx.meta.sequence.current('test');
      assert.equal(current, 0);

      // next
      let next = await this.ctx.meta.sequence.next('test');
      assert.equal(next, 1);

      // current
      current = await this.ctx.meta.sequence.current('test');
      assert.equal(current, 1);

      // reset
      await this.ctx.meta.sequence.reset('test');

      // other module's sequence
      const moduleSequence = this.ctx.meta.sequence.module(this.ctx.module.info.relativeName);

      // next
      next = await moduleSequence.next('test');
      assert.equal(next, 1);

      // current
      current = await moduleSequence.current('test');
      assert.equal(current, 1);

      // reset
      await moduleSequence.reset('test');

      // concurrency
      const results = await pMap([ 1, 2, 3, 4, 5 ], async () => {
        return await moduleSequence.next('test');
      });
      assert.equal(results.join(','), '1,2,3,4,5');

      // reset
      await moduleSequence.reset('test');

      // done
      this.ctx.success();
    }

  }
  return SequenceController;
};

