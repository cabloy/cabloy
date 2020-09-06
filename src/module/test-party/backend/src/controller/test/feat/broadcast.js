module.exports = app => {

  class BroadcastController extends app.Controller {

    async emit() {
      this.ctx.app.meta.broadcast.emit({
        locale: 'zh-cn',
        subdomain: this.ctx.subdomain,
        module: 'test-party',
        broadcastName: 'broadcastTest',
        data: { message: 'hello' },
      });
      this.ctx.success();
    }

  }

  return BroadcastController;

};
