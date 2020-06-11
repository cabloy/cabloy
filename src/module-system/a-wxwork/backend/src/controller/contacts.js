module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class ContactsController extends app.Controller {

    async sync() {
      // progress
      const progressId = await this.ctx.meta.progress.create();
      // queue
      this.ctx.app.meta.queue.push({
        locale: this.ctx.locale,
        subdomain: this.ctx.subdomain,
        module: moduleInfo.relativeName,
        queueName: 'contacts',
        data: {
          queueAction: 'sync',
          type: this.ctx.request.body.type,
          mode: this.ctx.request.body.mode,
          progressId,
        },
      });
      this.ctx.success({ progressId });
    }

    async queue() {
      const queueAction = this.ctx.request.body.queueAction;
      if (queueAction === 'sync') {
        await this.service.contacts.queueSync({
          type: this.ctx.request.body.type,
          mode: this.ctx.request.body.mode,
        });
      }
      this.ctx.success();
    }

  }
  return ContactsController;
};
