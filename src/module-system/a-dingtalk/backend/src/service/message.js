module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Message extends app.Service {
    async general({ beanProvider, message }) {
      // result
      let result;
      // raise event
      return await this.ctx.bean.event.invoke({
        module: moduleInfo.relativeName,
        name: 'dingtalkMessageGeneral',
        data: { beanProvider, message },
        result,
        next: async (context, next) => {
          // default
          if (context.result === undefined) {
            const methodName = `${beanProvider.providerName}${beanProvider.providerScene}`;
            if (this[methodName]) {
              context.result = await this[methodName]({ beanProvider, message });
            }
          }
          await next();
        },
      });
    }

    async dingtalkselfBuilt({ beanProvider, message }) {
      // event: check_url
      if (message.EventType === 'check_url') {
        // just return null
        return null;
      } else if (message.EventType.indexOf('user_') === 0 || message.EventType.indexOf('org_dept_') === 0) {
        // user events or org events
        return await this.contacts({ beanProvider, message });
      }
    }

    async contacts({ message }) {
      // queue
      this.ctx.meta.util.queuePush({
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

  return Message;
};
