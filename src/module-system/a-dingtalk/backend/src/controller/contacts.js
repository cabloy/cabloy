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
          userOp: this.ctx.state.user.op,
        },
      });
      this.ctx.success({ progressId });
    }

    async syncStatus() {
      const res = await this.service.contacts.syncStatus();
      this.ctx.success(res);
    }

  }
  return ContactsController;
};
