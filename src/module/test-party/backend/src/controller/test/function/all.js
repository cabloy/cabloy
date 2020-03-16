const require3 = require('require3');
const assert = require3('assert');

module.exports = app => {

  class AllController extends app.Controller {

    async all() {
      // userIds
      const userIds = this.ctx.cache.mem.get('userIds');
      const userTom = { id: userIds.Tom };

      // function all: including panels/widgets
      const functionCount = Object.keys(this.ctx.module.main.meta.base.functions).length;

      // Tom list all
      let list = await this.ctx.meta.function.list({
        options: {
          where: { 'a.module': 'test-party' },
          orders: [[ 'id', 'asc' ]],
          page: { index: 0, size: 0 },
          locale: '',
        },
        user: userTom,
      });
      assert.equal(list.length, functionCount);
      assert(!list[0].titleLocale);

      // Tom menu list zh-cn
      //   testFunctionPublic is handled in version/test, so have not locale info
      list = await this.ctx.meta.function.list({
        options: {
          where: { 'a.module': 'test-party' },
          orders: [[ 'id', 'asc' ]],
          page: { index: 0, size: 0 },
          locale: 'zh-cn',
        },
        user: userTom,
      });
      assert.equal(list.length, functionCount - 1);
      assert.equal(!!list[0].titleLocale, true);

      // hold first
      const function1 = list[0];

      // clear locales
      await this.ctx.meta.function.clearLocales();

      // select star
      list = await this.ctx.meta.function.list({
        user: userTom,
        options: {
          where: { 'a.module': 'test-party' },
          star: 1,
          page: { index: 0, size: 0 },
        },
      });
      assert.equal(list.length, 0);

      // star 1
      await this.ctx.meta.function.star({
        id: function1.id,
        star: 1,
        user: userTom,
      });
      list = await this.ctx.meta.function.list({
        user: userTom,
        options: {
          where: { 'a.module': 'test-party' },
          star: 1,
          page: { index: 0, size: 0 },
        },
      });
      assert.equal(list.length, 1);

      // star 0
      await this.ctx.meta.function.star({
        id: function1.id,
        star: 0,
        user: userTom,
      });
      list = await this.ctx.meta.function.list({
        user: userTom,
        options: {
          where: { 'a.module': 'test-party' },
          star: 1,
          page: { index: 0, size: 0 },
        },
      });
      assert.equal(list.length, 0);

      // check
      list = await this.ctx.meta.function.check({
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

