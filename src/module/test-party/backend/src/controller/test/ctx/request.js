const require3 = require('require3');
const assert = require3('assert');

module.exports = app => {

  class RequestController extends app.Controller {

    async request() {
      // param
      assert.equal(this.ctx.params.id, '1');
      assert.equal(this.ctx.getInt('id'), 1);

      // query
      assert.equal(this.ctx.query.age, '18');
      assert.equal(this.ctx.getInt('age'), 18);

      // body
      assert.equal(this.ctx.request.body.userName, 'zhennann');
      assert.equal(this.ctx.getStr('userName'), 'zhennann');

      // done
      this.ctx.success();
    }

  }

  return RequestController;
};
