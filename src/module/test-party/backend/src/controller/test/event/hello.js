const require3 = require('require3');
const assert = require3('assert');

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);

  class HelloController extends app.Controller {

    async hello() {
      const data = {
        text: 'hello',
      };
      let result = 'world';
      result = await this.ctx.bean.event.invoke({
        module: moduleInfo.relativeName,
        name: 'hello',
        data,
        result,
        next: async (context, next) => {
          context.result = `${context.result}.hello`;
          await next();
          context.result = `hello.${context.result}`;
        },
      });
      assert.equal(data.text, 'hello echo');
      assert.equal(result, 'echo.hello.world.echo.hello');
      this.ctx.success();
    }

  }

  return HelloController;
};

