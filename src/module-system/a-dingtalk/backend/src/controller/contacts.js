const require3 = require('require3');
const uuid = require3('uuid');

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class ContactsController extends app.Controller {

    async sync() {
      // progress
      const progressId = uuid.v4().replace(/-/g, '');
      // queue
      this.ctx.app.meta.queue.push({
        locale: this.ctx.locale,
        subdomain: this.ctx.subdomain,
        module: moduleInfo.relativeName,
        queueName: 'contacts',
        data: {
          queueAction: 'sync',
          type: this.ctx.request.body.type,
          progressId,
          userOp: this.ctx.user.op,
        },
      });
      this.ctx.success({ progressId });
    }

    async queue() {
      const queueAction = this.ctx.request.body.queueAction;
      if (queueAction === 'sync') {
        await this.service.contacts.queueSync({
          type: this.ctx.request.body.type,
          progressId: this.ctx.request.body.progressId,
          userOp: this.ctx.request.body.userOp,
        });
      } else if (queueAction === 'changeContact') {
        await this.service.contacts.queueChangeContact({
          message: this.ctx.request.body.message,
        });
      }
      this.ctx.success();
    }

  }
  return ContactsController;
};
