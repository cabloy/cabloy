module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Callback extends app.Service {

    async index({ message }) {
      // event: check_url
      if (message.EventType === 'check_url') {
        // just return
        return;
      } else if (message.EventType.indexOf('user_') === 0 || message.EventType.indexOf('org_dept_') === 0) {
        // user events or org events
        await this.contacts({ message });
      }
      // raise event
      await this.ctx.bean.event.invoke({
        module: moduleInfo.relativeName,
        name: 'dingtalkCallback',
        data: { message },
      });
    }

    async contacts({ message }) {
      // queue
      this.ctx.app.meta.queue.push({
        locale: this.ctx.locale,
        subdomain: this.ctx.subdomain,
        module: moduleInfo.relativeName,
        queueName: 'contacts',
        data: {
          queueAction: 'changeContact',
          message,
        },
      });
      // ok
      return null;
    }

  }

  return Callback;
};
