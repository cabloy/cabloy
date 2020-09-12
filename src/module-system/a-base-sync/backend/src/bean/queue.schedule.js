module.exports = app => {
  class Queue extends app.meta.BeanBase {

    async execute(context) {
      const { subdomain, module, name } = context.data;
      await app.meta._runSchedule({ subdomain, module, name });
    }

  }

  return Queue;
};
