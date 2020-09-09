module.exports = app => {
  class Queue extends app.meta.BeanBase {

    async execute(context) {
      const { module, name } = context.data;
      await app.meta._runSchedule({ module, name });
    }

  }

  return Queue;
};
