const require3 = require('require3');
const assert = require3('assert');

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);

  class HelloController extends app.Controller {

    async hello() {
      const data = {
        text: 'hello',
      };
      const res = await this.ctx.meta.event.invoke({
        module: moduleInfo.relativeName, name: 'hello', data,
      });
      assert.equal(data.text, 'hello echo');
      assert.equal(res, 'returnValue');
      this.ctx.success(res);
    }

    async helloEcho() {
      const event = this.ctx.request.body.event;
      const data = this.ctx.request.body.data;
      data.text = 'hello echo';
      event.break = true;
      this.ctx.success('returnValue');
    }

  }

  return HelloController;
};

