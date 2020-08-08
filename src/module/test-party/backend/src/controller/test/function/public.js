const require3 = require('require3');
const assert = require3('assert');

module.exports = app => {

  class PublicController extends app.Controller {

    async functionPublic() {
      // userIds
      const userIds = this.ctx.cache.mem.get('userIds');
      const userTom = { id: userIds.Tom };

      // function all: including panels/widgets
      const functionCount = Object.values(this.ctx.module.main.meta.base.functions).filter(item => item.public === 1).length;

      // check right function
      const pass = await this.ctx.meta.function.checkRightFunction({
        function: {
          module: 'test-party',
          name: 'testFunctionPublic',
        },
        user: userTom,
      });
      assert.equal(!!pass, true);

      // Tom list all
      const list = await this.ctx.meta.function.list({
        options: {
          where: {
            'a.module': 'test-party',
            'a.public': 1,
          },
          orders: [[ 'id', 'asc' ]],
          page: { index: 0, size: 0 },
          locale: '',
        },
        user: userTom,
      });
      assert.equal(list.length, functionCount);

      // delete function
      await this.ctx.model.query('delete from aFunction where id=?', [ pass.id ]);

      // done
      this.ctx.success();
    }

  }

  return PublicController;
};

