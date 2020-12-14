const require3 = require('require3');
const assert = require3('assert');

module.exports = app => {
  class StatsController extends app.Controller {

    async stats() {

      // userIds
      const userIds = this.ctx.cache.mem.get('userIds');
      const user = { id: userIds.Tom };

      // old
      let value = await this.ctx.bean.stats.get({
        name: 'tasksUser',
        nameSub: 'department.project',
        user,
      });
      assert.equal(value, undefined);

      // notify
      await this.ctx.bean.stats.notifyAsync({
        name: 'tasksUser',
        nameSub: 'department.project',
        user,
      });

      // new
      value = await this.ctx.bean.stats.get({
        name: 'tasksUser',
        nameSub: 'department.project',
        user,
      });
      assert.equal(value, 1);

      // done
      this.ctx.success();
    }

  }
  return StatsController;
};

