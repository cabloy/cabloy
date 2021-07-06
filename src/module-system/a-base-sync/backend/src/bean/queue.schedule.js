module.exports = app => {
  class Queue extends app.meta.BeanBase {
    async execute(context) {
      await app.meta._runSchedule(context);
    }
  }

  return Queue;
};
