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
          orders: [['a.id', 'asc']],
          page: { index: 0, size: 0 },
          locale: 'en-us',
        },
        user: userTom,
      });
      assert.equal(list.length, resourceCount);
      assert.equal(!!list[0].atomNameLocale, true);

      // hold first
      const resource_one = list[0];

      // check
      list = await this.ctx.bean.resource.check({
        atomStaticKeys: [resource_one.atomStaticKey],
        user: userTom,
      });
      assert.equal(list[0].passed, true);

      // read
      const item = await this.ctx.bean.resource.read({
        key: { atomId: resource_one.atomId },
        options: { locale: 'en-us' },
        user: userTom,
      });
      assert.equal(!!item.atomNameLocale, true);

      // done
      this.ctx.success();
    }

  }

  return AllController;
};

