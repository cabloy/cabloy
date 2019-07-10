const require3 = require('require3');
const assert = require3('assert');

module.exports = app => {

  class TailController extends app.Controller {

    async tail() {
      // 1
      this.ctx.meta._cache = 1;

      // tail
      this.ctx.tail(() => {
        assert.equal(this.ctx.meta._cache, 2);
      });

      // 2
      this.ctx.meta._cache = 2;

      // done
      this.ctx.success();
    }

  }

  return TailController;
};
