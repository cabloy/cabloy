const require3 = require('require3');
const assert = require3('assert');

module.exports = app => {

  class AllController extends app.Controller {

    async all() {
      // userIds
      const userIds = this.ctx.cache.mem.get('userIds');
      const userTom = { id: userIds.Tom };

      // function all: including widgets
      const resourceStaticsAll = this.ctx.module.main.meta.base.statics['a-base.resource'].items;
      const resourceCount = resourceStaticsAll.length;

      // Tom list all
      let list = await this.ctx.bean.resource.select({
        options: {
          where: { 'a.atomStaticKey': {
            op: 'likeRight', val: 'test-party:',
          } },
          orders: [[ 'a.id', 'asc' ]],
          page: { index: 0, size: 0 },
        },
        user: userTom,
      });
      assert.equal(list.length, resourceCount - 2);

      // done
      return this.ctx.success();

      // Tom menu list zh-cn
      list = await this.ctx.bean.function.list({
        options: {
          where: { 'a.module': 'test-party' },
          orders: [[ 'id', 'asc' ]],
          page: { index: 0, size: 0 },
          locale: 'zh-cn',
        },
        user: userTom,
      });
      assert.equal(list.length, functionCount);
      assert.equal(!!list[0].titleLocale, true);

      // hold first
      const function1 = list[0];

      // clear locales
      await this.ctx.bean.function.clearLocales();

      // select star
      list = await this.ctx.bean.function.list({
        user: userTom,
        options: {
          where: { 'a.module': 'test-party' },
          star: 1,
          page: { index: 0, size: 0 },
        },
      });
      assert.equal(list.length, 0);

      // star 1
      await this.ctx.bean.function.star({
        id: function1.id,
        star: 1,
        user: userTom,
      });
      list = await this.ctx.bean.function.list({
        user: userTom,
        options: {
          where: { 'a.module': 'test-party' },
          star: 1,
          page: { index: 0, size: 0 },
        },
      });
      assert.equal(list.length, 1);

      // star 0
      await this.ctx.bean.function.star({
        id: function1.id,
        star: 0,
        user: userTom,
      });
      list = await this.ctx.bean.function.list({
        user: userTom,
        options: {
          where: { 'a.module': 'test-party' },
          star: 1,
          page: { index: 0, size: 0 },
        },
      });
      assert.equal(list.length, 0);

      // check
      list = await this.ctx.bean.function.check({
        functions: [
          { module: function1.module, name: function1.name },
        ],
        user: userTom,
      });
      assert.equal(list[0].passed, true);

      // done
      this.ctx.success();
    }

  }

  return AllController;
};

