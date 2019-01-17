module.exports = app => {
  class TestController extends app.Controller {

    async test() {
      const data = {
        name: 'test',
      };
      await this.ctx.meta.event.invoke({
        module: 'a-event', name: 'test', data,
      });
      console.log('a-event:test:name:', data.name);
      this.ctx.success();
    }

    async eventTest() {
      const data = this.ctx.request.body.data;
      data.name = 'test:echo';
      this.ctx.success();
    }

  }
  return TestController;
};

