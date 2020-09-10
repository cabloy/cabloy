const require3 = require('require3');
const assert = require3('assert');

module.exports = app => {

  class BeanController extends app.Controller {

    async bean() {
      const a = 3;
      const b = 4;
      let res;

      // app.bean
      assert.equal(app.bean['test-party.test.app'], app.bean['test-party.test.app']);

      res = app.bean['test-party.test.app'].actionSync({ a, b });
      assert.equal(res, `${a + b}:regexpaop`);

      res = await app.bean['test-party.test.app'].actionAsync({ a, b });
      assert.equal(res, `${a + b}:regexpaop`);

      // ctx.bean: global
      assert.equal(this.ctx.bean['test.ctx'], this.ctx.bean['test.ctx']);

      this.ctx.bean['test.ctx'].name = 'test-party:regexpaop:simpleaop';
      res = this.ctx.bean['test.ctx'].name;
      assert.equal(res, 'test-party:regexpaop:simpleaop');

      res = this.ctx.bean['test.ctx'].actionSync({ a, b });
      assert.equal(res, `${a + b}:regexpaop:simpleaop`);

      res = await this.ctx.bean['test.ctx'].actionAsync({ a, b });
      assert.equal(res, `${a + b}:regexpaop:simpleaop`);

      res = await this.ctx.bean['test.ctx'].actionAsync2({ a, b });
      assert.equal(res, `test-party:regexpaop:simpleaop:${a + b}:regexpaop:simpleaop`);

      res = await this.ctx.bean['test.ctx'].actionAsync3({ a, b });
      assert.equal(res, `test-party:regexpaop:simpleaop:${a + b}:regexpaop:simpleaop`);

      // ctx.bean: class
      assert.equal(this.ctx.bean['test-party.test.class'], this.ctx.bean['test-party.test.class']);

      res = this.ctx.bean['test-party.test.class'].actionSync({ a, b });
      assert.equal(res, `${a + b}:regexpaop`);

      res = await this.ctx.bean['test-party.test.class'].actionAsync({ a, b });
      assert.equal(res, `${a + b}:regexpaop`);

      // ok
      this.ctx.success();
    }

  }

  return BeanController;
};

