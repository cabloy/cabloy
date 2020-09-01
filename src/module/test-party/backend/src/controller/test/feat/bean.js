const require3 = require('require3');
const assert = require3('assert');

module.exports = app => {

  class BeanController extends app.Controller {

    async bean() {
      const a = 3;
      const b = 4;
      let res;

      // // app.bean
      // assert.equal(app.bean['test-party.appBeanTest'], app.bean['test-party.appBeanTest']);

      // res = app.bean['test-party.appBeanTest'].actionSync({ a, b });
      // assert.equal(res, a + b);

      // res = await app.bean['test-party.appBeanTest'].actionAsync({ a, b });
      // assert.equal(res, a + b);

      // ctx.bean: global
      assert.equal(this.ctx.bean.ctxBeanTest, this.ctx.bean.ctxBeanTest);

      this.ctx.bean.ctxBeanTest.name = 'test-party:regexpaop:simpleaop';
      res = this.ctx.bean.ctxBeanTest.name;
      assert.equal(res, 'test-party:regexpaop:simpleaop');

      res = this.ctx.bean.ctxBeanTest.actionSync({ a, b });
      assert.equal(res, `${a + b}:regexpaop:simpleaop`);

      res = await this.ctx.bean.ctxBeanTest.actionAsync({ a, b });
      assert.equal(res, `${a + b}:regexpaop:simpleaop`);

      // ctx.bean: class
      assert.equal(this.ctx.bean['test-party.classBeanTest'], this.ctx.bean['test-party.classBeanTest']);

      res = this.ctx.bean['test-party.classBeanTest'].actionSync({ a, b });
      assert.equal(res, `${a + b}:regexpaop`);

      res = await this.ctx.bean['test-party.classBeanTest'].actionAsync({ a, b });
      assert.equal(res, `${a + b}:regexpaop`);

      // ok
      this.ctx.success();
    }

  }

  return BeanController;
};

