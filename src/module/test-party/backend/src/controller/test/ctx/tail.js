const require3 = require('require3');
const assert = require3('assert');

module.exports = app => {
  class TailController extends app.Controller {
    async tail() {
      // 1
      this.ctx.meta._tail_test = 1;

      // tail
      this.ctx.tail(() => {
        assert.equal(this.ctx.meta._tail_test, 2);
        this.ctx.tail(() => {
          assert.equal(this.ctx.meta._tail_test, 3);
        });
        this.ctx.meta._tail_test = 3;
      });

      // 2
      this.ctx.meta._tail_test = 2;

      // done
      this.ctx.success();
    }
  }

  return TailController;
};
