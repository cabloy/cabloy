module.exports = app => {
  class TestController extends app.Controller {

    async test() {
      const data = {
        name: 'test',
      };
      const res = await this.ctx.meta.event.invoke({
        module: 'a-event', name: 'test', data,
      });
      console.log('a-event:test:name:', data.name);
      console.log('a-event:test:name:returnValue', res);
      this.ctx.success(res);
    }

    async eventTest() {
      const event = this.ctx.request.body.event;
      const data = this.ctx.request.body.data;
      data.name = 'test:echo';
      event.break = true;
      this.ctx.success('returnValue');
    }

  }
  return TestController;
};

