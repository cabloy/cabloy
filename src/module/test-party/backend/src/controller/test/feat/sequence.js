const require3 = require('require3');
const assert = require3('assert');
const pMap = require3('p-map');

module.exports = app => {
  class SequenceController extends app.Controller {
    async sequence() {
      const arr = [1, 2, 3, 4, 5];
      let results;

      // current
      let current = await this.ctx.bean.sequence.current('test');
      assert.equal(current, 0);

      // next
      let next = await this.ctx.bean.sequence.next('test');
      assert.equal(next, 1);

      // current
      current = await this.ctx.bean.sequence.current('test');
      assert.equal(current, 1);

      // reset
      await this.ctx.bean.sequence.reset('test');

      // other module's sequence
      const moduleSequence = this.ctx.bean.sequence.module(this.ctx.module.info.relativeName);

      // next
      next = await moduleSequence.next('test');
      assert.equal(next, 1);

      // current
      current = await moduleSequence.current('test');
      assert.equal(current, 1);

      // reset
      await moduleSequence.reset('test');

      // concurrency
      results = await pMap(arr, async () => {
        return await moduleSequence.next('test');
      });
      assert.equal(new Set(results).size, new Set(arr).size);

      // reset
      await moduleSequence.reset('test');

      // concurrency transaction
      results = await pMap(arr, async () => {
        return await app.meta.util.executeBean({
          subdomain: this.ctx.subdomain,
          beanModule: this.ctx.module.info.relativeName,
          transaction: true,
          fn: async ({ ctx }) => {
            const res = await ctx.bean.sequence.next('test');
            await ctx.bean.util.sleep(50);
            return res;
          },
        });
      });
      assert.equal(new Set(results).size, new Set(arr).size, `sequence next: ${results}`);

      // reset
      await moduleSequence.reset('test');

      // done
      this.ctx.success();
    }
  }
  return SequenceController;
};
