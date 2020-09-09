module.exports = app => {
  class Queue {

    async execute(context) {
      const data = context.data;
      const queueAction = data.queueAction;
      if (queueAction === 'sync') {
        await this.ctx.service.contacts.queueSync(data);
      } else if (queueAction === 'changeContact') {
        await this.ctx.service.contacts.queueChangeContact(data);
      }
    }

  }

  return Queue;
};
