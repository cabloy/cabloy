
const _subscribePath = '/test/party/test';

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class SocketIOController extends app.Controller {

    async publish() {
      const options = this.ctx.request.body.options;
      const message = this.ctx.request.body.message;
      message.userIdFrom = this.ctx.user.op.id;
      const res = await this.ctx.meta.io.publish({
        path: _subscribePath,
        message,
        messageClass: {
          module: moduleInfo.relativeName,
          messageClassName: 'test',
        },
        options,
      });
      // done
      this.ctx.success(res);
    }

  }

  return SocketIOController;

};
