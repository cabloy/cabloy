const require3 = require('require3');
const assert = require3('assert');

module.exports = app => {

  class QueueController extends app.Controller {

    async queue() {
      const { a, b } = this.ctx.request.body;
      const c = a + b;
      this.ctx.success(c);
    }

    async pushAsync() {
      const res = await this.ctx.app.meta.queue.pushAsync({
        subdomain: this.ctx.subdomain,
        module: 'test-party',
        queueName: 'queueTest',
        data: { a: 1, b: 2 },
      });
      assert.equal(res, 3);
      this.ctx.success();
    }

    async push() {
      this.ctx.app.meta.queue.push({
        subdomain: this.ctx.subdomain,
        module: 'test-party',
        queueName: 'queueTest',
        data: { a: 1, b: 2 },
      });
      this.ctx.success();
    }

  }

  return QueueController;

};
